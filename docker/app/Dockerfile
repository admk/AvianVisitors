FROM python:3.11-slim-bookworm

ENV DEBIAN_FRONTEND=noninteractive \
    HOME=/srv \
    PIP_NO_CACHE_DIR=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN sed -i 's#http://deb.debian.org/debian#https://mirrors.ustc.edu.cn/debian#g; s#http://deb.debian.org/debian-security#https://mirrors.ustc.edu.cn/debian-security#g' /etc/apt/sources.list.d/debian.sources \
  && apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates icecast2 libsox-fmt-mp3 lsof netcat-openbsd nginx php-cli php-fpm php-sqlite3 sqlite3 sox \
  && rm -rf /var/lib/apt/lists/* /var/www/html /tmp/*

RUN pip install --no-cache-dir --index-url https://pypi.tuna.tsinghua.edu.cn/simple ai-edge-litert==2.1.5 imageio-ffmpeg==0.6.0 inotify==0.2.12 numpy==2.4.6 pillow==12.2.0 requests==2.34.2 tzlocal==5.3.1 \
  && ln -s "$(python -c 'import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())')" /usr/local/bin/ffmpeg \
  && ffmpeg -version >/dev/null \
  && rm -rf /tmp/*

WORKDIR /srv/app

COPY avian /srv/app/avian
RUN python /srv/app/avian/scripts/clean_illustration_alpha.py /srv/app/avian/assets/illustrations
COPY scripts /srv/app/scripts
COPY model/BirdNET_GLOBAL_6K_V2.4_Model_FP16.tflite /srv/app/model/BirdNET_GLOBAL_6K_V2.4_Model_FP16.tflite
COPY model/BirdNET_GLOBAL_6K_V2.4_Model_FP16_Labels.txt /srv/app/model/BirdNET_GLOBAL_6K_V2.4_Model_FP16_Labels.txt
COPY model/BirdNET_GLOBAL_6K_V2.4_MData_Model_FP16.tflite /srv/app/model/BirdNET_GLOBAL_6K_V2.4_MData_Model_FP16.tflite
COPY model/l18n /srv/app/model/l18n
COPY docker/birdnet.conf /docker-defaults/birdnet.conf
COPY docker/app/nginx.conf /etc/nginx/conf.d/default.conf
COPY docker/app/entrypoint.sh /usr/local/bin/avian-app-entrypoint

RUN chmod +x /usr/local/bin/avian-app-entrypoint \
  && rm -f /etc/nginx/sites-enabled/default

EXPOSE 80

ENTRYPOINT ["avian-app-entrypoint"]
