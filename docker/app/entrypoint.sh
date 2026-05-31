#!/bin/sh
set -eu

[ -n "${RTSP_STREAM_URL:-}" ] || { echo "RTSP_STREAM_URL is required in .env" >&2; exit 64; }

export TZ="${TZ:-Asia/Shanghai}" AV_DOCKER=1 HOME=/srv
mkdir -p /config /data/logs /data/runstate /data/BirdSongs/StreamData \
  /data/BirdSongs/Processed /data/BirdSongs/Extracted/By_Date /etc/birdnet

ln -sfn /data/BirdSongs /srv/BirdSongs
ln -sfn /srv/app /srv/BirdNET-Pi
ln -sfn /data/BirdSongs /srv/app/BirdSongs
ln -sfn /config/birdnet.conf /srv/app/birdnet.conf
ln -sfn /config/birdnet.conf /etc/birdnet/birdnet.conf
ln -sfn /data/birds.db /srv/app/scripts/birds.db
ln -sfn /data/BirdDB.txt /srv/app/BirdDB.txt
rm -rf /logs /runstate
ln -s /data/logs /logs
ln -s /data/runstate /runstate

[ -f /config/birdnet.conf ] || cp /docker-defaults/birdnet.conf /config/birdnet.conf
for kv in "LATITUDE=${LATITUDE:-22.5431}" "LONGITUDE=${LONGITUDE:-114.0579}" "RTSP_STREAM=$RTSP_STREAM_URL"; do
  key=${kv%%=*}
  if grep -q "^$key=" /config/birdnet.conf; then
    sed -i "s#^$key=.*#$kv#" /config/birdnet.conf
  else
    printf '%s\n' "$kv" >> /config/birdnet.conf
  fi
done

if [ ! -s /data/birds.db ]; then
  sqlite3 /data/birds.db <<'SQL'
CREATE TABLE detections (Date DATE, Time TIME, Sci_Name VARCHAR(100) NOT NULL, Com_Name VARCHAR(100) NOT NULL, Confidence FLOAT, Lat FLOAT, Lon FLOAT, Cutoff FLOAT, Week INT, Sens FLOAT, Overlap FLOAT, File_Name VARCHAR(100) NOT NULL);
CREATE INDEX detections_Com_Name ON detections (Com_Name);
CREATE INDEX detections_Sci_Name ON detections (Sci_Name);
CREATE INDEX detections_Date_Time ON detections (Date DESC, Time DESC);
SQL
fi
touch /data/BirdDB.txt /data/BirdSongs/StreamData/analyzing_now.txt

php_fpm_bin="$(command -v php-fpm8.2 || command -v php-fpm)"
sed -i 's#^listen = .*#listen = 127.0.0.1:9000#;s#^;*clear_env = .*#clear_env = no#' /etc/php/8.2/fpm/pool.d/www.conf
cat >/tmp/icecast.xml <<EOF
<icecast><authentication><source-password>${ICECAST_SOURCE_PASSWORD:-avian-local-source}</source-password><admin-user>admin</admin-user><admin-password>${ICECAST_ADMIN_PASSWORD:-avian-local-admin}</admin-password></authentication><hostname>localhost</hostname><listen-socket><port>8000</port></listen-socket><paths><logdir>/tmp</logdir><webroot>/usr/share/icecast2/web</webroot><adminroot>/usr/share/icecast2/admin</adminroot></paths><logging><loglevel>2</loglevel></logging><security><chroot>0</chroot><changeowner><user>icecast2</user><group>icecast</group></changeowner></security></icecast>
EOF

icecast2 -c /tmp/icecast.xml >/data/logs/icecast.log 2>&1 &
icecast_pid=$!
until nc -z 127.0.0.1 8000; do kill -0 "$icecast_pid" 2>/dev/null || exit 1; sleep 0.2; done

heartbeat_loop() { while :; do touch "$1"; sleep 5; done; }
record_loop() {
  while :; do
    heartbeat_loop /data/runstate/birdnet_recording.heartbeat &
    hb=$!
    env -u http_proxy -u https_proxy -u all_proxy -u HTTP_PROXY -u HTTPS_PROXY -u ALL_PROXY \
      ffmpeg -hide_banner -nostdin -nostats -loglevel "${FFMPEG_LOG_LEVEL:-quiet}" -rtsp_transport "${RTSP_TRANSPORT:-tcp}" -i "$RTSP_STREAM_URL" \
      -map 0:a:0 -vn -sn -dn -codec:a pcm_s16le -ac 2 -ar 48000 -f segment -segment_format wav -segment_time "${RECORDING_LENGTH:-15}" -strftime 1 "/data/BirdSongs/StreamData/%F-birdnet-RTSP_1-%H:%M:%S.wav" \
      -map 0:a:0 -vn -sn -dn -codec:a libmp3lame -b:a "${STREAM_AUDIO_BITRATE:-128k}" -ac "${STREAM_AUDIO_CHANNELS:-1}" -content_type audio/mpeg -f mp3 "icecast://source:${ICECAST_SOURCE_PASSWORD:-avian-local-source}@127.0.0.1:8000/stream" || true
    kill "$hb" 2>/dev/null || true
    sleep "${FFMPEG_RETRY_SECONDS:-2}"
  done
}
analysis_loop() {
  while :; do
    heartbeat_loop /data/runstate/birdnet_analysis.heartbeat &
    hb=$!
    python3 -u /srv/app/scripts/birdnet_analysis.py || true
    kill "$hb" 2>/dev/null || true
    sleep 2
  done
}

record_loop >/data/logs/birdnet_recording.log 2>&1 &
recording_pid=$!
analysis_loop >/data/logs/birdnet_analysis.log 2>&1 &
analysis_pid=$!
"$php_fpm_bin" -F -O -y /etc/php/8.2/fpm/php-fpm.conf &
php_pid=$!
nginx -g 'daemon off;' &
nginx_pid=$!
trap 'kill "$nginx_pid" "$php_pid" "$analysis_pid" "$recording_pid" "$icecast_pid" 2>/dev/null || true' INT TERM EXIT
wait "$nginx_pid"
