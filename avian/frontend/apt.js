(function () {
  var PLACEHOLDER = [{"sci":"Calypte anna","com":"Anna's Hummingbird","featured":true},{"sci":"Passer domesticus","com":"House Sparrow"},{"sci":"Haemorhous mexicanus","com":"House Finch"},{"sci":"Turdus migratorius","com":"American Robin"},{"sci":"Zenaida macroura","com":"Mourning Dove"},{"sci":"Spinus psaltria","com":"Lesser Goldfinch"},{"sci":"Zonotrichia leucophrys","com":"White-crowned Sparrow"},{"sci":"Aphelocoma californica","com":"California Scrub-Jay"},{"sci":"Mimus polyglottos","com":"Northern Mockingbird"},{"sci":"Sayornis nigricans","com":"Black Phoebe"},{"sci":"Larus occidentalis","com":"Western Gull"},{"sci":"Corvus brachyrhynchos","com":"American Crow"}];
  // Bumped whenever the offline sketch build changes, so the browser
  // doesn't keep a stale cache after we regenerate the sketches.
  var SKETCH_VERSION = '8'; // pose-2 strict re-audit: regenerated 8 flight
                            // illustrations that had phantom wing-shapes,
                            // training-image watermark, or ghosted partial
                            // wings (actitis, colaptes×2, meleagris,
                            // melospiza×2, progne, sitta, tachycineta).
  // Cache-bust for /api/img - bump whenever a bird gets re-rendered via
  // /api/regen or whenever you need every CF DC to drop its cached copy.
  // Cloudflare keys on the full URL incl. query, so bumping this is
  // equivalent to a global cache purge for /api/img. (caches.default
  // .delete() in the worker only affects ONE colo at a time, so a
  // versioned URL is the only reliable way to invalidate everywhere.)
  var IMG_VERSION = '5'; // illustration alpha cleanup: removes transparent
                          // body holes and background speckles.

  function cutoutCacheQuery() {
    // Every surface must include IMG_VERSION, otherwise browsers/CDNs can
    // keep serving a pre-cleanup PNG even after the collage has refreshed.
    return '&v=' + IMG_VERSION + '&sketch=' + SKETCH_VERSION;
  }

  var I18N = {
    en: {
      langButton: 'EN',
      langLabel: 'switch language',
      titles: ['Heard Recently', 'Heard Recently', 'Avian Visitors'],
      pageTitle: 'your birds',
      pageDescription: 'A live bird collage from your window.',
      brand: 'your birds',
      collage: 'collage',
      stats: 'stats',
      atlas: 'atlas',
      menu: 'menu',
      password: 'password',
      backToCollage: 'back to collage',
      toggleDarkMode: 'toggle dark mode',
      unlock: 'unlock',
      birdCollage: 'Bird collage',
      statsAria: 'Stats',
      atlasAria: 'Atlas',
      sortAtlas: 'sort atlas',
      pose: 'Pose',
      view: 'View',
      lockHint: 'enter password to unlock tools.',
      wrongPassword: 'wrong password.',
      authUnavailable: 'auth unavailable.',
      networkError: 'network error.',
      noBirdsWindow: 'no birds heard in this window.',
      noDetectionsWindow: 'no detections in this window',
      noDetectionsWindowSentence: 'No detections in this window.',
      noBirdsDetected: 'No birds detected yet.',
      atlasHint: 'The atlas fills up as BirdNET-Pi identifies new species.',
      atlasLongerHint: 'Try a longer time window - the lifelist is still here under ALL.',
      byPeriod: 'By Period',
      byPeriodHint: 'detections, grouped by recency',
      topSpecies: 'Top Species',
      topSpeciesHintPrefix: 'most-heard, ',
      firstDetections: 'First Detections',
      firstDetectionsHint: 'newest additions to the life list',
      lastHour: 'last hour',
      today: 'today',
      last7Days: 'last 7 days',
      allTime: 'all time',
      topMostHeard: 'most heard',
      topMostRecent: 'most recent',
      alphabetical: 'a -> z',
      callsOne: 'call',
      callsMany: 'calls',
      thisHour: 'this hour',
      past12h: 'past 12h',
      thisWeek: 'this week',
      noDetectionsYet: 'no detections yet',
      noAudio: 'no audio',
      play: 'play',
      stop: 'stop',
      playRecording: 'play recording',
      scrub: 'scrub',
      loadingDescription: 'Loading description...',
      noDescription: 'No description available.',
      allTimeShort: 'all time',
      firstHeard: 'first heard',
      window: 'window',
      genus: 'genus',
      rarity: 'rarity',
      recordings: 'Recordings',
      loadingRecordings: 'Loading recordings...',
      noRecordings: 'No recordings yet.',
      failedRecordings: 'Failed to load recordings.',
      captured: ' captured',
      loadingSpectrogram: 'loading spectrogram...',
      renderingSpectrogram: 'rendering spectrogram...',
      spectrogramUnavailable: 'spectrogram unavailable',
      webAudioUnavailable: 'WebAudio not available',
      spectrogramFailedPrefix: 'spectrogram failed: ',
      perched: 'perched',
      inFlight: 'in flight',
      close: 'Close',
      wiki: 'wiki',
      ebird: 'ebird',
      liveAudio: 'Live audio',
      streamFromMic: 'stream from the mic',
      listen: 'listen',
      connecting: 'connecting...',
      streamingFromPi: 'streaming from pi',
      streamUnavailable: 'stream unavailable',
      streamErrorCheckSystem: 'stream error - check /#admin=system',
      autoplayBlocked: 'browser blocked autoplay - tap listen again',
      save: 'save',
      changePending: 'change pending',
      saving: 'saving...',
      saved: 'saved',
      saveFailed: 'save failed',
      loadingSettings: 'loading settings...',
      preserveAllRecordings: 'Preserve all recordings',
      dontAutoDelete: "don't auto-delete",
      confidenceThreshold: 'Confidence threshold',
      minScoreDetection: 'min score to log a detection',
      sensitivity: 'Sensitivity',
      analyzerSensitivity: 'analyzer sensitivity',
      chunkOverlap: 'Chunk overlap',
      secondsAnalyzed: 'seconds analyzed per pass',
      whenDiskFills: 'When disk fills',
      keep: 'keep',
      purge: 'purge',
      aboutTitle: 'The birds outside your window',
      aboutBody: "A tiny microphone identifies every passing bird with Cornell's BirdNET. Each species shows up as an illustration in the collage, sized by how often it's been heard.",
      aboutExplore: 'explore the birds ->',
      nowTag: 'NOW',
      todayTag: 'TODAY',
      weekTag: 'WEEK',
      allTag: 'ALL',
      todayAgo: 'today',
      daysAgo: 'd ago',
      secAgo: 's ago',
      minAgo: 'm ago',
      hourAgo: 'h ago',
      common: 'common',
      regular: 'regular',
      occasional: 'occasional',
      rare: 'rare',
    },
    'zh-CN': {
      langButton: '中',
      langLabel: '切换语言',
      titles: ['近期鸟声', '近期鸟声', '访客图鉴'],
      pageTitle: '窗外鸟声',
      pageDescription: '实时记录窗边听到的鸟类。',
      brand: '窗外鸟声',
      collage: '拼贴',
      stats: '统计',
      atlas: '图鉴',
      menu: '菜单',
      password: '密码',
      backToCollage: '返回拼贴',
      toggleDarkMode: '切换深色模式',
      unlock: '解锁',
      birdCollage: '鸟类拼贴',
      statsAria: '统计',
      atlasAria: '图鉴',
      sortAtlas: '排序图鉴',
      pose: '姿态',
      view: '视图',
      lockHint: '输入密码以解锁工具。',
      wrongPassword: '密码错误。',
      authUnavailable: '认证不可用。',
      networkError: '网络错误。',
      noBirdsWindow: '这段时间还没有听到鸟声。',
      noDetectionsWindow: '这段时间没有记录',
      noDetectionsWindowSentence: '这段时间没有记录。',
      noBirdsDetected: '还没有检测到鸟类。',
      atlasHint: 'BirdNET-Pi 每识别到一种新鸟，图鉴就会多一张卡片。',
      atlasLongerHint: '换个更长的时间范围；完整清单在“全部”里。',
      byPeriod: '时间范围',
      byPeriodHint: '按时间范围汇总的记录',
      topSpecies: '最常听到',
      topSpeciesHintPrefix: '按记录次数排序，',
      firstDetections: '初次记录',
      firstDetectionsHint: '最近加入清单的鸟种',
      lastHour: '过去 1 小时',
      today: '今天',
      last7Days: '最近 7 天',
      allTime: '全部时间',
      topMostHeard: '记录最多',
      topMostRecent: '最近出现',
      alphabetical: '按名称',
      callsOne: '次',
      callsMany: '次',
      thisHour: '过去 1 小时',
      past12h: '过去 12 小时',
      thisWeek: '本周',
      noDetectionsYet: '还没有记录',
      noAudio: '无音频',
      play: '播放',
      stop: '停止',
      playRecording: '播放录音',
      scrub: '拖动播放进度',
      loadingDescription: '正在加载描述...',
      noDescription: '暂无描述。',
      allTimeShort: '全部时间',
      firstHeard: '首次听到',
      window: '时间段',
      genus: '属',
      rarity: '出现频率',
      recordings: '录音',
      loadingRecordings: '正在加载录音...',
      noRecordings: '还没有录音。',
      failedRecordings: '录音加载失败。',
      captured: ' 条录音',
      loadingSpectrogram: '正在加载声谱图...',
      renderingSpectrogram: '正在绘制声谱图...',
      spectrogramUnavailable: '声谱图不可用',
      webAudioUnavailable: 'WebAudio 不可用',
      spectrogramFailedPrefix: '声谱图失败：',
      perched: '停栖',
      inFlight: '飞行',
      close: '关闭',
      wiki: '维基',
      ebird: 'eBird',
      liveAudio: '实时音频',
      streamFromMic: '来自麦克风的音频流',
      listen: '收听',
      connecting: '正在连接...',
      streamingFromPi: '正在播放 Pi 音频',
      streamUnavailable: '音频流不可用',
      streamErrorCheckSystem: '音频流出错，请检查 /#admin=system',
      autoplayBlocked: '浏览器阻止自动播放，请再次点击收听',
      save: '保存',
      changePending: '有未保存更改',
      saving: '正在保存...',
      saved: '已保存',
      saveFailed: '保存失败',
      loadingSettings: '正在加载设置...',
      preserveAllRecordings: '保留所有录音',
      dontAutoDelete: '不要自动删除',
      confidenceThreshold: '置信度阈值',
      minScoreDetection: '记录检测所需的最低分数',
      sensitivity: '灵敏度',
      analyzerSensitivity: '分析器灵敏度',
      chunkOverlap: '音频片段重叠',
      secondsAnalyzed: '每轮分析的秒数',
      whenDiskFills: '磁盘写满时',
      keep: '保留',
      purge: '清理',
      aboutTitle: '窗外的鸟',
      aboutBody: '一支小麦克风会用康奈尔的 BirdNET 辨认窗外的鸟声。每种鸟都会以插画出现在拼贴中，大小取决于被听到的频率。',
      aboutExplore: '浏览鸟类 ->',
      nowTag: '现在',
      todayTag: '今天',
      weekTag: '本周',
      allTag: '全部',
      todayAgo: '今天',
      daysAgo: '天前',
      secAgo: ' 秒前',
      minAgo: ' 分钟前',
      hourAgo: ' 小时前',
      common: '常见',
      regular: '经常',
      occasional: '偶见',
      rare: '少见',
    },
  };

  function readLS(k, fallback) { try { return localStorage.getItem(k) || fallback; } catch (e) { return fallback; } }
  function writeLS(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function browserLang() {
    var raw = ((navigator.languages && navigator.languages[0]) || navigator.language || '').toLowerCase();
    if (/^zh(?!-(tw|hk|mo|hant))/.test(raw) || raw === 'zh-cn' || raw === 'zh-hans') return 'zh-CN';
    return 'en';
  }
  function normalizeLang(lang) { return lang === 'zh-CN' ? 'zh-CN' : 'en'; }
  var currentLang = normalizeLang(readLS('bird:lang', browserLang()));
  function tr(key) {
    return (I18N[currentLang] && I18N[currentLang][key]) || I18N.en[key] || key;
  }
  function apiLangParam() { return currentLang === 'zh-CN' ? '&lang=zh-CN' : ''; }
  function speciesName(s) { return (s && (s.com || s.com_en || s.sci)) || ''; }
  function speciesNameEn(s) { return (s && (s.com_en || s.com || s.sci)) || ''; }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function fmtAgo(n, key) {
    return currentLang === 'zh-CN' ? (n + tr(key)) : (n + tr(key));
  }

  // ---- Sliding pill helper ----
  // Each segmented control has a single .seg-pill element that we move via
  // transform/width to whichever button currently has aria-current="true".
  // This gives an iOS-style smooth slide instead of a hard snap.
  function syncPill(container) {
    var pill = container.querySelector('.seg-pill');
    var active = container.querySelector('button[aria-current="true"]');
    if (!pill || !active) return;
    // offsetLeft is relative to the container (we set position:relative on it).
    pill.style.width = active.offsetWidth + 'px';
    pill.style.transform = 'translateX(' + active.offsetLeft + 'px)';
  }

  // ---- Slider ----
  var views = document.getElementById('views');
  var slider = document.getElementById('slider');
  var btns = [].slice.call(slider.querySelectorAll('button'));
  var winPick = document.getElementById('winPick');

  // Each view's title text. The shared static-head shows one of these
  // based on the current view; identical adjacent values mean the title
  // stays put with no fade (collage and stats both say Heard Recently).
  function viewTitle(i) { return tr('titles')[i] || I18N.en.titles[i] || ''; }
  var staticHead = document.querySelector('.static-head');
  var staticTitle = document.getElementById('staticTitle');
  function setTitleForView(i) {
    var next = viewTitle(i);
    if (!staticTitle || staticTitle.textContent === next) return;
    // Fade out -> swap text -> fade in. The opacity transition is 240ms;
    // we swap at ~half that so the eye doesn't catch the text change.
    staticHead.classList.add('swap-out');
    setTimeout(function () {
      staticTitle.textContent = next;
      // Force reflow before removing class so the transition restarts.
      void staticHead.offsetWidth;
      staticHead.classList.remove('swap-out');
    }, 220);
  }

  function go(i) {
    i = Math.max(0, Math.min(2, i));
    views.style.transform = 'translateX(-' + (i * 100) + '%)';
    btns.forEach(function (b, j) { b.setAttribute('aria-current', j === i ? 'true' : 'false'); });
    syncPill(slider);
    setTitleForView(i);
  }
  btns.forEach(function (b) { b.addEventListener('click', function () { go(+b.dataset.i); }); });

  // ---- Window picker ----
  // Persist selections across reloads so a returning visitor lands on the
  // same view they left. Keys are namespaced so a future schema change
  // can be invalidated by bumping the prefix.
  var winBtns = [].slice.call(winPick.querySelectorAll('button'));
  var currentHours = +readLS('bird:window', '24') || 24;
  winBtns.forEach(function (b) {
    b.setAttribute('aria-current', (+b.dataset.h === currentHours) ? 'true' : 'false');
  });
  winBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      winBtns.forEach(function (x) { x.setAttribute('aria-current', x === b ? 'true' : 'false'); });
      currentHours = +b.dataset.h;
      writeLS('bird:window', String(currentHours));
      syncPill(winPick);
      // Actual data refresh is wired below via refreshRecent().
    });
  });

  // Initial pill placement (after layout settles) + on resize.
  // Atlas sort segmented control - same pill-on-recess pattern.
  var atlasSortEl = document.getElementById('atlasSort');
  var atlasSortBtns = atlasSortEl ? [].slice.call(atlasSortEl.querySelectorAll('button')) : [];
  window.__atlasSort = readLS('bird:atlasSort', 'count');
  atlasSortBtns.forEach(function (b) {
    b.setAttribute('aria-current', (b.dataset.sort === window.__atlasSort) ? 'true' : 'false');
  });
  atlasSortBtns.forEach(function (b) {
    b.addEventListener('click', function () {
      atlasSortBtns.forEach(function (x) { x.setAttribute('aria-current', x === b ? 'true' : 'false'); });
      window.__atlasSort = b.dataset.sort;
      writeLS('bird:atlasSort', window.__atlasSort);
      syncPill(atlasSortEl);
      // Re-render the atlas with new sort.
      renderAtlas();
    });
  });

  function syncAllPills() { syncPill(slider); syncPill(winPick); if (atlasSortEl) syncPill(atlasSortEl); }
  // ---- Theme toggle ----
  var themeBtn = document.getElementById('themeBtn');
  var themeKey = 'bird:theme';
  function readTheme() {
    try { return localStorage.getItem(themeKey) || 'light'; } catch (e) { return 'light'; }
  }
  function writeTheme(v) {
    try { localStorage.setItem(themeKey, v); } catch (e) {}
  }
  function applyTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    if (themeBtn) themeBtn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }
  applyTheme(readTheme());
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      writeTheme(next);
      applyTheme(next);
    });
  }

  var langBtn = document.getElementById('langBtn');
  function applyStaticLanguage() {
    document.documentElement.lang = currentLang === 'zh-CN' ? 'zh-Hans-CN' : 'en';
    document.title = tr('pageTitle');
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', tr('pageDescription'));
    if (langBtn) {
      langBtn.textContent = tr('langButton');
      langBtn.setAttribute('aria-label', tr('langLabel'));
    }
    var aboutLink = document.getElementById('aboutLink');
    if (aboutLink) aboutLink.textContent = tr('brand');
    var returnToAtlas = document.getElementById('returnToAtlas');
    if (returnToAtlas) {
      returnToAtlas.setAttribute('aria-label', tr('backToCollage'));
      var textNode = [].slice.call(returnToAtlas.childNodes).filter(function (n) { return n.nodeType === 3; })[0];
      if (textNode) textNode.nodeValue = '\n  ' + tr('collage') + '\n';
    }
    if (staticTitle) staticTitle.textContent = viewTitle(btns.findIndex(function (b) {
      return b.getAttribute('aria-current') === 'true';
    }) || 0);
    var menu = document.getElementById('menuBtn');
    if (menu) menu.textContent = tr('menu');
    var theme = document.getElementById('themeBtn');
    if (theme) theme.setAttribute('aria-label', tr('toggleDarkMode'));
    var unlock = document.querySelector('#unlockForm button[type="submit"]');
    if (unlock) unlock.setAttribute('aria-label', tr('unlock'));
    var v0 = document.getElementById('v0');
    var v1 = document.getElementById('v1');
    var v2 = document.getElementById('v2');
    if (v0) v0.setAttribute('aria-label', tr('birdCollage'));
    if (v1) v1.setAttribute('aria-label', tr('statsAria'));
    if (v2) v2.setAttribute('aria-label', tr('atlasAria'));
    if (atlasSortEl) atlasSortEl.setAttribute('aria-label', tr('sortAtlas'));
    var poseToggle = document.getElementById('modalPoseToggle');
    if (poseToggle) poseToggle.setAttribute('aria-label', tr('pose'));
    if (slider) slider.setAttribute('aria-label', tr('view'));
    var lockPass = document.getElementById('lockPass');
    if (lockPass) lockPass.setAttribute('placeholder', tr('password'));
    if (lockHint && !lockHint.classList.contains('lock-err')) lockHint.textContent = tr('lockHint');
    var sliderLabels = [tr('collage'), tr('stats'), tr('atlas')];
    btns.forEach(function (b, i) { b.textContent = sliderLabels[i]; });
    var allBtn = winPick && winPick.querySelector('button[data-h="1000000"]');
    if (allBtn) allBtn.textContent = tr('allTag');
    var statsHeads = document.querySelectorAll('.stats-side .grp h3');
    if (statsHeads[0]) statsHeads[0].textContent = tr('byPeriod');
    if (statsHeads[1]) statsHeads[1].textContent = tr('topSpecies');
    if (statsHeads[2]) statsHeads[2].textContent = tr('firstDetections');
    var statsHints = document.querySelectorAll('.stats-side .grp small');
    if (statsHints[0]) statsHints[0].textContent = tr('byPeriodHint');
    if (statsHints[1]) statsHints[1].textContent = tr('topSpeciesHintPrefix') + windowLabel(currentHours);
    if (statsHints[2]) statsHints[2].textContent = tr('firstDetectionsHint');
    var sortTips = atlasSortEl ? atlasSortEl.querySelectorAll('.tip') : [];
    if (sortTips[0]) sortTips[0].textContent = tr('topMostHeard');
    if (sortTips[1]) sortTips[1].textContent = tr('topMostRecent');
    if (sortTips[2]) sortTips[2].textContent = tr('alphabetical');
    var modalClose = document.querySelector('#detail-modal .modal-close');
    if (modalClose) modalClose.setAttribute('aria-label', tr('close'));
    var aboutClose = document.querySelector('#about-modal .modal-close');
    if (aboutClose) aboutClose.setAttribute('aria-label', tr('close'));
    var poseTips = document.querySelectorAll('#modalPoseToggle .tip');
    if (poseTips[0]) poseTips[0].textContent = tr('perched');
    if (poseTips[1]) poseTips[1].textContent = tr('inFlight');
    var modalStatLabels = document.querySelectorAll('.modal-stats .lbl');
    if (modalStatLabels[0]) modalStatLabels[0].textContent = tr('allTimeShort');
    if (modalStatLabels[1]) modalStatLabels[1].textContent = tr('window');
    if (modalStatLabels[2]) modalStatLabels[2].textContent = tr('firstHeard');
    var metaKeys = document.querySelectorAll('.modal-meta .k');
    if (metaKeys[0]) metaKeys[0].textContent = tr('genus');
    if (metaKeys[1]) metaKeys[1].textContent = tr('rarity');
    var recHead = document.querySelector('.modal-recordings h3');
    if (recHead) recHead.textContent = tr('recordings');
    var wiki = document.getElementById('modalWiki');
    if (wiki) wiki.textContent = tr('wiki');
    var ebird = document.getElementById('modalEbird');
    if (ebird) ebird.textContent = tr('ebird');
    var aboutEyebrow = document.querySelector('.about-eyebrow');
    if (aboutEyebrow) aboutEyebrow.textContent = tr('brand');
    var aboutTitle = document.getElementById('aboutTitle');
    if (aboutTitle) aboutTitle.textContent = tr('aboutTitle');
    var aboutBody = document.querySelector('.about-body');
    if (aboutBody) {
      aboutBody.innerHTML = esc(tr('aboutBody')).replace('BirdNET', '<a href="https://birdnet.cornell.edu/" target="_blank" rel="noopener">BirdNET</a>');
    }
    var aboutExplore = document.querySelector('.about-explore');
    if (aboutExplore) aboutExplore.textContent = tr('aboutExplore');
    syncAllPills();
  }
  if (langBtn) {
    langBtn.addEventListener('click', function () {
      currentLang = currentLang === 'zh-CN' ? 'en' : 'zh-CN';
      writeLS('bird:lang', currentLang);
      applyStaticLanguage();
      refreshAll();
    });
  }
  // The buttons size from text content; wait for fonts so width is correct.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncAllPills);
  }
  // Also sync after layout is definitely done.
  requestAnimationFrame(function () { requestAnimationFrame(syncAllPills); });
  var pillTimer;
  window.addEventListener('resize', function () {
    clearTimeout(pillTimer);
    pillTimer = setTimeout(syncAllPills, 80);
  });

  // ---- Raster-bitmask collage with bird-shaped nesting ----
  // Each species ships a low-res binary alpha mask (cutout_masks.ts) that
  // matches the bird's actual outline. The layout maintains an occupancy
  // grid at viewport resolution; for each tile we spiral outward from the
  // cluster centre and pick the closest position where the tile's mask
  // doesn't overlap any already-placed mask. Result: birds nest into each
  // other's concavities (wing arc cradles tail, etc.) with a small visual
  // gap baked into the mask via Python-side dilation. No bbox overlap, no
  // rectangles touching - actual polygon-aware packing.

  var collage = document.getElementById('collage');
  var DIMS = {"acanthis-flammea":[560,372],"accipiter-cooperii":[558,560],"accipiter-gentilis":[558,560],"accipiter-striatus":[375,560],"actitis-macularius":[560,409],"aechmophorus-occidentalis":[525,560],"aegolius-acadicus":[560,558],"aeronautes-saxatalis":[560,439],"agelaius-phoeniceus":[276,560],"aix-sponsa":[560,378],"ammodramus-savannarum":[560,436],"amphispiza-bilineata":[560,559],"anas-crecca":[560,288],"anas-platyrhynchos":[558,560],"anser-albifrons":[560,439],"anthus-rubescens":[375,560],"aphelocoma-californica":[560,373],"aphelocoma-woodhouseii":[468,560],"aquila-chrysaetos":[437,560],"archilochus-alexandri":[560,344],"ardea-alba":[560,465],"ardea-herodias":[560,373],"artemisiospiza-belli":[560,435],"asio-flammeus":[560,560],"asio-otus":[404,560],"athene-cunicularia":[560,373],"aythya-affinis":[560,372],"aythya-americana":[560,553],"aythya-collaris":[560,373],"aythya-valisineria":[560,373],"baeolophus-inornatus":[560,311],"bombycilla-cedrorum":[339,560],"bombycilla-garrulus":[560,559],"branta-canadensis":[560,559],"bubo-virginianus":[373,560],"bubulcus-ibis":[267,560],"bucephala-albeola":[560,408],"bucephala-clangula":[560,242],"buteo-jamaicensis":[560,374],"buteo-lagopus":[560,244],"buteo-lineatus":[463,560],"buteo-regalis":[408,560],"buteo-swainsoni":[560,408],"butorides-virescens":[555,560],"calamospiza-melanocorys":[560,374],"calidris-alba":[560,371],"calidris-alpina":[560,374],"callipepla-californica":[560,372],"calothorax-lucifer":[465,560],"calypte-anna":[560,344],"calypte-costae":[560,409],"cardellina-pusilla":[560,281],"cardellina-rubrifrons":[527,560],"cathartes-aura":[376,560],"catharus-guttatus":[560,333],"catharus-ustulatus":[560,408],"catherpes-mexicanus":[320,560],"certhia-americana":[201,560],"chaetura-vauxi":[560,374],"charadrius-vociferus":[560,408],"chondestes-grammacus":[560,559],"chordeiles-minor":[560,319],"cinclus-mexicanus":[560,465],"circus-hudsonius":[372,560],"cistothorus-palustris":[437,560],"coccothraustes-vespertinus":[560,466],"colaptes-auratus":[560,560],"columba-livia":[560,327],"columbina-passerina":[560,559],"contopus-sordidulus":[560,502],"coragyps-atratus":[560,557],"corvus-brachyrhynchos":[560,503],"corvus-corax":[343,560],"cyanocitta-stelleri":[363,560],"cygnus-buccinator":[560,370],"cypseloides-niger":[560,356],"dryobates-nuttallii":[560,321],"dryobates-pubescens":[560,558],"dryobates-villosus":[268,560],"dryocopus-pileatus":[492,560],"egretta-caerulea":[560,321],"egretta-thula":[560,374],"elanus-leucurus":[560,378],"empidonax-difficilis":[268,560],"empidonax-hammondii":[558,560],"empidonax-oberholseri":[495,560],"empidonax-traillii":[371,560],"empidonax-wrightii":[560,527],"eremophila-alpestris":[560,529],"euphagus-cyanocephalus":[560,371],"falco-columbarius":[560,408],"falco-mexicanus":[349,560],"falco-peregrinus":[465,560],"falco-sparverius":[560,370],"gavia-immer":[560,374],"geothlypis-tolmiei":[560,406],"geothlypis-trichas":[560,316],"glaucidium-gnoma":[560,560],"gymnogyps-californianus":[466,560],"haemorhous-mexicanus":[523,560],"haemorhous-purpureus":[560,387],"haliaeetus-leucocephalus":[560,434],"himantopus-mexicanus":[458,560],"hirundo-rustica":[560,410],"hydroprogne-caspia":[560,373],"icteria-virens":[560,293],"icterus-bullockii":[560,214],"icterus-cucullatus":[391,560],"icterus-galbula":[560,528],"icterus-parisorum":[560,266],"ixoreus-naevius":[560,558],"junco-hyemalis":[560,320],"lanius-ludovicianus":[408,560],"larus-californicus":[560,437],"larus-delawarensis":[560,376],"larus-glaucescens":[560,374],"larus-heermanni":[560,436],"larus-occidentalis":[560,412],"leiothlypis-celata":[522,560],"leiothlypis-lucidae":[351,560],"leucophaeus-atricilla":[560,373],"leucophaeus-pipixcan":[560,560],"leucosticte-tephrocotis":[560,465],"limosa-fedoa":[560,556],"lophodytes-cucullatus":[560,409],"loxia-curvirostra":[560,319],"mareca-americana":[560,375],"mareca-strepera":[560,372],"megaceryle-alcyon":[560,409],"megascops-kennicottii":[560,374],"melanerpes-formicivorus":[351,560],"melanerpes-lewis":[372,560],"meleagris-gallopavo":[560,373],"melospiza-georgiana":[320,560],"melospiza-lincolnii":[560,245],"melospiza-melodia":[560,352],"melozone-aberti":[560,268],"melozone-crissalis":[560,538],"melozone-fusca":[560,495],"mergus-merganser":[560,374],"mimus-polyglottos":[560,310],"mniotilta-varia":[560,351],"molothrus-ater":[560,505],"myadestes-townsendi":[560,436],"myiarchus-cinerascens":[560,532],"nucifraga-columbiana":[560,373],"numenius-americanus":[558,560],"nycticorax-nycticorax":[560,465],"oreothlypis-ruficapilla":[372,560],"pandion-haliaetus":[560,371],"passer-domesticus":[560,444],"passerculus-sandwichensis":[560,542],"passerella-iliaca":[560,350],"passerina-amoena":[560,465],"passerina-cyanea":[560,560],"patagioenas-fasciata":[560,500],"pelecanus-erythrorhynchos":[560,316],"pelecanus-occidentalis":[560,406],"perisoreus-canadensis":[560,349],"petrochelidon-pyrrhonota":[558,560],"phainopepla-nitens":[560,464],"phalacrocorax-auritus":[490,560],"phalaenoptilus-nuttallii":[560,373],"phasianus-colchicus":[560,409],"pheucticus-melanocephalus":[559,560],"pica-nuttalli":[560,320],"picoides-arcticus":[374,560],"pinicola-enucleator":[560,372],"pipilo-chlorurus":[560,318],"pipilo-erythrophthalmus":[352,560],"pipilo-maculatus":[443,560],"piranga-ludoviciana":[293,560],"piranga-rubra":[560,495],"plegadis-chihi":[560,372],"podiceps-nigricollis":[560,374],"podilymbus-podiceps":[560,374],"poecile-gambeli":[560,350],"poecile-rufescens":[560,339],"polioptila-caerulea":[560,557],"pooecetes-gramineus":[560,436],"progne-subis":[313,560],"psaltriparus-minimus":[560,428],"quiscalus-mexicanus":[560,269],"recurvirostra-americana":[268,560],"regulus-calendula":[496,560],"regulus-satrapa":[464,560],"riparia-riparia":[560,494],"rynchops-niger":[560,374],"salpinctes-obsoletus":[560,465],"sayornis-nigricans":[308,560],"sayornis-saya":[463,560],"selasphorus-platycercus":[560,497],"selasphorus-rufus":[560,436],"selasphorus-sasin":[434,560],"setophaga-coronata":[461,560],"setophaga-magnolia":[560,268],"setophaga-nigrescens":[560,350],"setophaga-occidentalis":[560,367],"setophaga-palmarum":[438,560],"setophaga-petechia":[560,268],"setophaga-ruticilla":[560,293],"setophaga-townsendi":[560,416],"sialia-currucoides":[558,560],"sialia-mexicana":[560,371],"sitta-canadensis":[560,379],"sitta-carolinensis":[436,560],"sitta-pygmaea":[560,407],"spatula-clypeata":[560,408],"spatula-discors":[560,493],"sphyrapicus-ruber":[560,558],"sphyrapicus-thyroideus":[374,560],"spinus-lawrencei":[560,373],"spinus-pinus":[560,516],"spinus-psaltria":[560,548],"spinus-tristis":[536,560],"spizella-atrogularis":[246,560],"spizella-breweri":[560,557],"spizella-passerina":[560,320],"spizelloides-arborea":[560,436],"stelgidopteryx-serripennis":[558,560],"sterna-forsteri":[560,373],"sterna-hirundo":[560,411],"streptopelia-decaocto":[560,393],"strix-occidentalis":[560,553],"sturnella-neglecta":[320,560],"sturnus-vulgaris":[560,545],"tachycineta-bicolor":[375,560],"tachycineta-thalassina":[560,435],"thalasseus-elegans":[560,407],"thryomanes-bewickii":[560,263],"toxostoma-redivivum":[560,298],"tringa-semipalmata":[560,464],"troglodytes-aedon":[560,494],"troglodytes-pacificus":[560,407],"turdus-migratorius":[560,402],"tyrannus-verticalis":[559,560],"tyrannus-vociferans":[495,560],"tyto-alba":[560,464],"urile-penicillatus":[296,560],"vireo-bellii":[560,559],"vireo-cassinii":[560,319],"vireo-gilvus":[464,560],"vireo-huttoni":[410,560],"xanthocephalus-xanthocephalus":[293,560],"zenaida-asiatica":[560,558],"zenaida-macroura":[522,560],"zonotrichia-atricapilla":[560,238],"zonotrichia-leucophrys":[560,313],"zonotrichia-querula":[560,294]};
  var MASKS = {"acanthis-flammea":{"w":93,"h":62,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/8AAAAAAAAAAAAA//4AAAAAAAAAAAAP//wAAAAAAAAAAAD///AAAAAAAAAAAA///8AAAAAAAAAAAf///wAAAAAAAAAAH////AAAAAAAAAAA////8AAAAAAAAAAH////4AAAAAAAAAA/////4AAAAAAAAAH/////wAAAAAAAAA//////gAAAAAAAAB//////AAAAAAAAAH/////8AAAAAAAAA//////4AAAAAAAAD//////gAAAAAAAAf//////AAAAAAAAD//////+AAAAAAAAf//////4AAAAAAAD///////wAAAAAAAf///////AAAAAAAD///////8AAAAAAAP///////wAAAAAAB////////AAAAAAAP///////+AAAAAAB////////8AAAAAAP////////wAAAAAA/////////AAAAAAH////////8AAAAAAf////////4AAAAAD/////////wAAAAAP/////////wAAAAA//////////gAAAAD//////////AAAAAP/////////+AAAAA//////////wAAAAD/////////+AAAAAH////8Af//wAAAAAP///+AAf/+AAAAAAf///AAA//wAAAAAAf//gAAA/8AAAAAAAf/gAAAB/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"accipiter-cooperii":{"w":93,"h":93,"bits":"AAAAAAAAAAAAAB8HwAAAAAAAAAAAAPg+AAAAAAAAAAAAB8HwAAAAAAAAAAAAPg+AAB//AAAAAAAAAHwAB//+AAAAAAAAAAAAf//8AAAAAAAAAAAH///wAAAAAAAAAAB////AAAAAAAAAAAP///8AAAAAAAAAAD////wAAAAAAAAAAf///+AAAAAAAAAAH////4AAAAAAAAAA/////D4AAAAAAAAH////8fAAAAAAAAA/////74AAAAAAAAH//////AAAAAAAAA//////4AAAAAAAAH/////4AAAAAAAAA//////wAAAAAAAAD//////gAAAAAAAAB//////AAAAAAAAAH/////8AAAAAAAAA//////wAAAAAAAAP//////AAAAAAAAB/D////+AAAAAAAAP4P////wAAAAAAAB/h/////AAfAAAAAP8P////8AD4AAAAB/g/////gAfAAAAAP8P////+AD4AAAAB/h/////4AfAAAAAP4P/////AD4AAAAB/h/////8AAAAAAAP///////gAAAAAAA///////+AAAAAAAH///////4AAPgAAA////////AAB8AAAD///////4AAPgAAAf///////gAB8AAAB///////+AAPgAAAP///////wAAAAAAA////////AAB4AAAH///////4AAPAAAAf///////AAB4AAAD///////4AAPAAAAP///////gAB/4AAB///////+AAA/AAAH///////wAAH4AAAf//////+AAA/AAAD///////4AAH4fAAP///////AAAAD4AA///////4AAAAfAAD///////gAAAD4AAP//////+AAAAfAAA///////4AAAAAAAD///////gAAAAAAAf//////8AAAAAAAD///////wAAAAAAAP///////AAAAAAAB///////4AAAAAAAH///////AAAAAAAA///////4AAAAAAAD///////AAAAAAAAf//////4AAAAAAAD///////gAAAAAAAf//////8AAAAAAAD///////gAAAAAAAf//////8AAD4AAAD+//////gA4fAAAAP38D///8AHD4AAAAA/gP///g+4fAAAAAAAAf//8H3D4AAAAAAAA//+A+4AAAAAAAAD///4HwAAAAAAAAAff//A+AAAAAAAAAD7//8AAAAAAAAAAAfP//gAAAAAAAAAAD5//+AAAAAAAAAAAfH//wAAAAAAAAAAAA///AAAAAAAAAAAAD//4AAAAAAA+AAAAP//gAAAAAAHwAAAB//8AAAAPgA+AAAAH//gAAAB8AHz4AAAf/8AAAAPgA+fAAAB//gAAAB8AHz4AAAP/8AAAAPgAAfAAAA//gAAAD4AAD4AAAD/8AAAAfAAAAAAAAA+AAAAD4AAAAAAAAHwAAAAfAAAAAAAAA+AAA="},"accipiter-gentilis":{"w":93,"h":93,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAPgAAB8AAAAAAAAAB8AAAPgAAAAAAAAAPgAAB8AAAAAAAAH58AAAAAAAAAAAAP//gAAAAAAAAAAAH//4AAAAAAAAAAAB///gAAAAAAAAAAAf//8AAAAAAAAAAAH///wAAAAAAAAAAA////AAAAAAAAAAAP///8AA/AAAAAAAB////gAH4AAAAAAAf///8AA/AAAAAAD/////gAH4AAAAAAf////8AA/AAAAAB//////gAA4AAAAAP/////8AAAAAAAAB//////AAAAAAAAAP////8AAAAAAAAAB/////gAAAAAAAAAD////8AAAAAAAAAB/////gAAAAAAAAA/////8AAAAAAAAAH/////gD4AAAAAAB/////8AfAAAAAAAf/////AD4AAAAAAH/////4AfAAAAAAB//////AD4AAAAAAP/////4AAAAAAAAD//////AAAAAAAAA//////4AAAAAAAAH//////AAAAAAAAB//////4AAAAAAAAf//////AAAAAAAAD//////wAAAAAAAA//////+AAAAAAAAH//////wAAAAAAAB//////8AAAAAAAAf//////AAAAAAAAD//////4AAAAAH4A//////+AAAAAA/AH//////gAAAAAH4A//////4AAH4AA/AP//////AHw/AAH4B//////wA+H4AA/AP/////+AHw/AAD4B//////gA+H4AAAAf/////8AHwAAAAAH/////+AAAAAAAAA//////gAAAAAAAAP/////8AAAAAAAAD//////AAAAAAAAA//////4AAAAAAAAH//////AAAAAAAAB//////wAAAAAAAAf/////+AD4AAAAAD//////gAfAAAAAAf/////8AD4AAAAAD//////AAfAAAAAAf/////4AD4AAAAAH//////AAAAAAAAA////v/4AAAAAAAAH///4H/AAAAAAAAA////A/wAAAAAAAAH///wD4B8AAAAAAA///8AAAPgAAAAAAH//+AAAB8AAAAAAA///gAAAP+AAAAAAD//gAAAB/wAAAAAAf/8AAAAA+AAAAAAH//AAAAAHwAAAAAA//4AAAAA+AAAAAAH/+AAAAAHwAAAAAB//wPgAAAAAAAAAAP/8B8AAAAAAAAAAB//APgAAAAAAAAAAP/4B8AAAAAAAAAAB/+APgAAAAAAAAAAP/gAHwAAAAAAAAAA/4AA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"accipiter-striatus":{"w":62,"h":93,"bits":"8AAAAAAAAAPAAAAAAAAADwAAAAAAAAA4AAAAAAAAAOAAAAAAAAADgAAAAAAAAA4AAAAAAAAAAAAAA//AAAAAAAA//8AAAAAAAf//gAAAAAAP//4AAAAAAH//+AAAAAAD///wAAAAAA///8AAAAAAf///AAAAAAH///wAAAAAD///8AAAAAB////AAAAAA////4AAAAAP///+AAAAAH////gAAAAD////8AAAAB/////AAAAAf////wAAAAH////8AAAAD/////gAAAA/////4AAAAP////+AAAAH/////gAAAB/////4AAAAf////+AAAAH/////gAAAB/////4AAAAf////+AAAAH/////gAAAB/////4AAAAf////+AAAAH/////AAAAB/////wAAAAf////8AAAAH/////AAAAB/////wAAAAf////4AAAAH////+AAAAB/////gAAAAf////wAAAAH////8AAAAA/////AAAAAP////wAAAAD////4AAAAA////8AAAAAP////AAAAAD////wAAAAA////8AAAAAP////AAAAAD////wAAAAAf///8AAAAAH////AAAAAB////gAAAAAf///wAAAAAH///8AAAAAB///AAAAAAAf//wAAAAAAH//4AAAAAAB//8AAAAAAAf//AAAAAAAH//wAAAAAAB//8AAAAAAAf//AAAAAAAH//gAAAAAAB//4AAAAAAAP/+AAAAAAAD//gAAAAAAB//4AAAAAAAf/+AAAAAAAH//gAAAAAAB//4AAAAAAAf/+AAAAAAAH//gAAAAAAB//4AAAAAAAf/+AAAAAAAH//gAAAAAAB//wAAAAAAAf/8AAAAAAAH/+AAAAAAAB//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"actitis-macularius":{"w":93,"h":68,"bits":"//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////A="},"aechmophorus-occidentalis":{"w":87,"h":93,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//AAAAAAAAAAAD//4AAAAAAAAAAA///AAAAAAfAAAAP//8AAAAAD4AAAD///gAAAAAfAAAA///+AAAAAD4AAAP///4AAAAAfAAAP////AAAAAAAAAf////4AAAfgAAAf/////gAAD8AAAf/////8AAAfgAAH//////gAAD8AAA//////8AAAfgAAH//////gAAAAAAA//////8HwAAAAAH//////g+APgAAAAAAA//8HwB8AAAH8AAD//g+APgAAA/gAAP/4HwB8AAAH8AAB//AAAPgAAA/gAAP/4AAAAAAAH8AAB//AH4fAAAAAAAAP/4A/D4AAAAAAAB//AH4fAAAAAAAAf/wA/D4AAAAAAAD/+AH4fAAAAAAAAf/wAAAAAAAAfgAD/+AAAAAAAAD+AA//gAAAAAAAAfwAH/8AAAAAAAAD+AA//gAAAAAAAAfwAH/8AAAAAAAAB+AB//gAAAAAAAAAAAP/8AAAAAAAAAAAB//gAAAAAAAAAAAP/8AAAAAAAAAAAB//h///AAAAAAAAP//////58AAAAAB////////gAAAAAP///////8AAAAAB////////4AAAAAP////////wAAAAB/////////AAAAAP////////+AAAAB/////////4AAAAP/////////gPgAB/////////+B8AAP/////////4PgAB//////////h8AAP/////////+PgAA//////////wAAAH/////////+AAAA//////////wAAAH/////////+AAAA//////////wAAAH/////////+AAAA//////////wAA/D/////////8AAH4f/////////gAA/D/////////4AfH4f/w//////+AD8/B/+AP////+AAfgAP/wA////wAHz8AB/+AD///AAA+fgAP/wAD//AAAHx8AB/+AAP34AAA+PgAP/wAB+/AAAHwAAA//AAPz4AAAAAAAB/8AB+AAAAAAAAAP/gAAAAAAAAAAAA/8AAAAAAAAAAAAD/gAAAAAAAAAAAAP8AAAAAAAAAAAAB/gAAAAAAAAAAAAP8AAAAAAAAAAAA//wHwAAAAAAD////+B+AAAAAAB/////wPwAAAAAB/////+B+AAAAAA//////wPwAAAAAH/////+B+AAAAAA//////wAAAAAAAH/////+AAAAAAAA//////wAAAAAAAH/H///+AAAAAAAAAA////wAAAAAPgAAH///+AAAAAB8AAAf///wAAAAAPgAAAD//+AAAAAB8AA=="},"aegolius-acadicus":{"w":93,"h":93,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfAAfAAAAAf/+AAAD4AD4AAAAf///AAAfAAfAAAAP///8AAD4AD4AAAH////4AAfAAfAAAB/////gAAAAAAAAAf////+AAAAAAAAAD/////4AAAAAAAAA//////gfAAAAAAAP/////+D4AAAAAAB//////wfAAAAAAAf///////4AAAAAAD////////AAAAAAAf//////+AAAAAAAD///////wAAAAAAAf//////+AAAAAAAD//////+AAAAAAAAf//////wAAAAAAAD//////+AAAAAAAAf//////4AAAAAAAD///////AAAAAAAAf//////4AAAAAAAD///////gAAAAAAAf//////8AAAAAAAD///////wAAAAAAAf///////AAAAAAAD///////8AAAAAAAf///////wAAAAAAD////////AAAAAAAf///////8AAAAAAD////////wAAD4AAf////////AAAfAAD////////8AAD4AAP////////wAAfAAB////////+AAD4AAP////////4AAPAAB/////////gAAAAAP////////8AA/AAB/////////wAH4AAP////////+AA/AAB/////////4AH4AAP/////////AA/AAA/////////4AAAAAD/////////gAAAAAf////////8AAAAAD/////////gAAAAAP////////+AAAAAB/////////wAAAAAP////////+AAAAAB/////////4AAAAAH/////////AAAAAA/////////8AAAAAH/////////gAAAAAf////////8AA+AAD/////////gAHwAAP////////8AA+AAB/////////gAHwAAH////////+AA+AAAf////////wAAAAAB////////+AAAAAAH////////wAAAAAA////////+AAAHwAD////////wAAA+AAP///////+AAAHwAA////////wAAA+AAD///////+AAAHwAAP///////wAAAAAAA///////+AAAAAAAD///////4AAAAAAB////////AAAAAAA////////8AAAAAAP////////gAAAAAD////////8AAAAAAf////////wAAAAAD////////+AAAAAAf////////wAAAAAD////9///+AAAAAAf////j///wAAAAAB////8P//+AAAAAAAf+AAB///gAAAAAAAHwAAH//wAAAAAAAAAAAAf/+AAAAAAAAAAAAD//wAAAAAAAAAAAAP/+AAAAAAAAAAAAA//wAAAAAAAAAAAAB/+AAAAAAAAAAAAAH/wAAAAAAAAAAAAA+AAAAAAAAAAAAAAAAAAAA="},"aeronautes-saxatalis":{"w":93,"h":73,"bits":"AAAAAAAAAAAAAAB4AAAAAAAAAAAAAAPAAAAAAAAAAAAAAB4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//AAAAAAAAAAAAf//+AAAAAAAAAAH////wAAAAAAAAAP////+AAAAAAAAAH/////wAAAAAAAAB/////+AAAAAAAAB//////AAAAAAAAA/////+AfwAAAAAAP///////+AAAAAAB////////wAAAAAAf///////+AAAAAAD////////wAAAAAAf///////+AAAAAAD///////+AAAAAAAf///////wAAAAAAD////////AAAAAAAH///////4AAAAAAAP///////AAAAAAAAf///z//4AAAAAAAA///wAP/AAAAAAAAH//wAAAAAAAAAAAA//+AAAAAAAAAAAAD//4AAAAAAAAAAAAf//gAAAAAAAAAAAB//8AAAAAAAAAAAAH//wAAAAAAAAAAAA//+AAAAAAAAAAAAD//4AAAAAAAAAAAAP//AAAAAAAAAAAAA//8AAAAAAAAAAAAD//wAAAAAAAAAAAAP/+AAAAAAAAAAAAA//4AAAAAAAAAAAAD//gAAAAAAAAAAAAP/8AAAAAAAAAAAAA//wAAAAAAAAAAAAD//AAAAAAAAAAAAAH/4AAAAAAAAAAAAAf/AAAAAAAAAAAAAB/4AAAAAAAAAAAAAD/AAAAAAAAAAAAAAP4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"agelaius-phoeniceus":{"w":46,"h":93,"bits":"///4AAAD///wAAAP///gAAA////AAAD///8AAAH///4AAAP///wAAAP///AAAA///8AAAD///4AAAH///gAAAf///AAAA///8AAAD///4AAAP///wAAAf///gAAD////AAAP///+AAA////8AAD////4AAf////wAB/////AAH////+AAf////8AB/////4AH/////gA//////AD/////8AP/////4A//////gD//////AH/////8Af/////wB//////gH/////+Af/////8B//////wH//////AP/////+A//////4D//////gH//////Af/////8A//////wD//////AH/////8Af/////wA//////AD/////8AH/////wAP/////AAf////8AA/////wAB/////AAH////8AA/////wAD/////AAP////8AA/////wAD/////AAP////8AA/9///wAD/3///AAP/f//8AAf5///wAA/n///AAAAf//8AAAB///wAAAH///AAAAf//wAAAB///gAAAH//+AAAAf//4AAAB///wAAAH///AAAAf//8AAAB///wAAAH///AAAAf//8AAAB///wAAAH///AAAAf//8AAAB///wAAAH///AAAAf//8AAAB///wAAAH///AAAAP//8AAAA///wAAAB///AAAAH//8AAAAP//wAAAAP//A=="},"aix-sponsa":{"w":93,"h":63,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/4AAAAAAAAAAAAP//wAAAAAAAAAAAD///AAAAAAAAAAAA///8AAAAAAAAAAAP///gAAAAAAAAAAB///+AAAAAAAAAAAP///wAAAAAAAAAAB////AAAAAAAAAAAf///4AAAAAAAAAAD////gAAAAAAAAAB////8AAAAAAAAAAf////wAAAAAAAAAH////+AAAAAAAAAB/////wAAAAAAAAAP//////wAAAAAAAB//////////8AAAAP//////////7+AAB////////////8AAH////////////gAAB///////////8AAAf///////////gAAD///////////8AAAf///////////gAAH///////////8AAA////////////AAAH///////////wAAA///////////8AAAH//////////8AAAA//////////8AAAAH/////////+AAAAA//////////gAAAAH/////////4AAAAA/////////+AAAAAD/////////gAAAAAf////////4AAAAAB////////8AAAAAAH///////8AAAAAAAf//////4AAAAAAAAf/////AAAAAAAAAAAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAA=="},"ammodramus-savannarum":{"w":93,"h":72,"bits":"////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////"},"amphispiza-bilineata":{"w":93,"h":93,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfAAAAA+AAAAAAAAD4AAAAHwAAAAAAAAfAAAAA+AAAAAAAAD4AAAAHwAAAAAAAAfAAAAA+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8f+AAAAAAAAAAAAP//+AAAAAAAAAAAB///8AAAAAAAAAAAP///wA4AAAAAAAAB////wHAAAAAAAAAP////g4AAAAAAAAD////+HAAAAAAAAA/////w4AAAAAAAAP////+HAAAAAAAAD/////wAAAAAAAAAf////+AAAAAAAAAP/////wAAAAAAAAH/////4AAAAAAAAH/////8AAAA+AAAD//////AAAAHwAAA//////wAAAA+AAAf/////8AAAAHwAAH//////gAAAA+AAB//////4AAAAAAAA///////AAAAAAAAP//////4AAAAAAAH//////+AAAAAAAB///////wAAAAAAAf//////+AAAAAAAH///////wAAAAAAB///////+AAAAAAAf///////wAAAAAAH///////+AAAAAAB////////wAAAAAAf///////8AAAAAAH////////gAAAAAA////////4AAAAAAP////////AAAAAAD////////wAAAAAA////////+AAAAAAP////////gAAAAAD////////4AAAAAA////////+AAAAAAH////////gAAAAAA////////4AAAAAAH///////+AAAAAAD/////////AAAAAA////////74AAAAAP///////8fAAAAAD///////+D4AAAAB////////AfAAAAAf///////gAAAAAAH///4f//AAAAAAAB///wAAAAAPgAAAA///wAAAAHx8AAAAP//8AAA+A+PgAAAD///AAAHwHx8AAAA///gAAA+A+PgAAAP//4AAAHwHwAAAAD//+AAAA+AAAAAAA///gAAAAAAAAAAAP//4AAAAAAAAAAAD//+AAAAAAAAAAAAf//AAAAAAAAAAAAD//wAAAAAAAAAAAAf/8AAAAAAAAAAAAD//AAAAAAAAAAAAAf/wAAAAAAA+AAAAB/8AAAAAAAHwAAAA/+AAAAAAAA+AAAAH/gAAAAAAAHwAAAA+AAAAAAAAA+AAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAD4AAAAAA="},"anas-crecca":{"w":93,"h":48,"bits":"///+AAAAAAAAAAAH///4AAAAAAAAAAA////AAAAAAAAAAAH///8AAAAD//gAAA////wAAAD///gAAH////AAAB///+AAA////4AAB////wAAH////gAB////+AAA////8AA/////wAAH////gA/////+AAA////////////gAAH///////////4AAA////////////AAAH///////////+AAA////////////4AAH////////////wAA/////////////AAH////////////+AA/////////////8AH/////////////4A//////////////gH/////////////+A//////////////8H//////////////4///////////////3//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wAAf//////////+AAAD//////////+AAAAP////B/////AAAAA///8AD////4AAAAB///AAB///AAAAAAH///8AD//wAAAAAAP///+A//8AAAAAAAP//////+AAAAAAAAP//////AAAAAAAAAP/////gAAAAAA"},"anas-platyrhynchos":{"w":93,"h":93,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/gAAAAAAAAAAAAH//AAAAAAAAAAAAD//8AAAAAAAAAAAAf//gAAAAAAAAAAAH//+AAAAAAAAAAAB///wAAAAAAAAAAAP///AAAAAAAAAAAB///8AAAAAAAAAAAf///wAAAAAAAAAAD////gAAAAAAAAAAf///+AAAAAAAAAAD////8AAAAAAAAAAf////wAAAAAAAAAD////+AAAAAAAAAAf////wAAAAAAAAAD////+AAAAAAAAAAP////wAAAAAAAD/5//4/+AAAAAAAf/////gPwAAAAAAf/////+AAAAAAAA///////4AAAAAAB////////gAAAAAB////////8AAAAAP/////////wAAAA//////////+AAAAP//////////wAAAB//////////+AAAAf//////////wAAAD//////////+AAAD///////////wAAAf//////////+AAAD///////////wAAAf//////////+AAAD///////////wAAAf//////////+AAAD///////////wAAAH//////////+AAAAP//////////gAAAAf/////////8AAAAB//////////AAAAAH/////////wAAAAAf////////+AAAAAA/////////AAAAAAD////////wAAAAAAH///////wAAAAAAAP//////wAAAAAAAAf/////wAAAAAAAAAA////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"anser-albifrons":{"w":93,"h":73,"bits":"4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/gAAAAAAAAAAAAAf/AAAAAAAAAAAAAD/+AAAAAAAAAAAAAf/8AAAAAAAAAAAAD//4AAAAAAAAAAAAf//wAAAAAAAAAAAD///gAAAAAAAAAAAf//+AAAAAAAAAAAD///8AAAAAAAAAAAP///wAAAAAAAAAAB////gAAAAAAAAAAH///+AAAAAAAAAAAf///8AAAAAAAAAAD////wAAAAAAAAAAP////AAAAAAAAAAA////8AAAAAAAAAAD////wAAAAAAAAAAP////AAAAAAAAAAA////8AAAAAAAAAAH////gAAAAAAAAAAf///+AAAAAAAAAAB////wAAAAAAAAAAH////AfgAAAAAAAAf///8D+AAAAAAAAB////h/8AAAAAAAAH///+f/wAAAAAAAAf/////+AAAAAAAAB//////4AAAAAAAAH//////AAAAAAAAA//////4AAAAAAAAD//////AAAAAAAAAP/////4AAAAAAAAB///////wAAAAAAAH///////AAAAAAAA///////+AAAAAAAD///////8AAAAAAAP///////gAAAAAAA///////8AAAAAAAH///////gAAAAAA////////8AAAAAAH////////gAAAAAB////////gAAAAAAP//////wAAAAAAAB//////wAAAAAAAAP/////4AAAAAAAAB/////+AAAAAAAAAP/////AAAAAAAAAB/////wAAAAAAAAAP////4AAAAAAAAAB////8AAAAAAAAAAP///+AAAAAAAAAAA///4AAAAAAAAAAAH//gAAAAAAAAAAAAf/4AAAAAAAAAAAAA/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"anthus-rubescens":{"w":62,"h":93,"bits":"4AAAAAAAAAOAAAAAAAHwDgAAAAAAB8AAAH/wAAAfAAAP//AAAHwAAP//8AAB8AAH///gAAAAAB///8AAAAAA////gAAAAA////8AAAAA/////AAAAA/////4AAAAP////+AAAAD/////wAAAA/////8AAAAP/////gAAAD/////8AAAAH/////gAAAAH////+AAAAB/////wAAAAP////+AAAAH/////wAAAB/////+AAAA//////wAAAP/////+AAAD//////gAAA//////8AAAf//////gAAH//////4AAB///////AAAf//////4AAH//////+AAB///////wAAf//////8AAH///////gAA///////4AAP//////+AAD///////wAA///////8AAP///////gAB///////4AAf///////AAH///////wAA///////+AAP///////gAB///////4AAf///////AAD///////wAAf//////8AAH///////AAA///////4AAH//////+AAB///////gAAP//////4AAB//////+AAAP//////gAAB//////4AAAP/////+AAAP//////gAAP//////4AAP//////+AAH///////gAB//+H///4AAf//g///AAAH//4H//wAAB//AB//8AAAf/AAf//gAAH/wAH//4AAB/8AB//+AAAP/AAf//gAAD/wAD//8AAA/8AA///AAAP+AAB//wAAB/AAAf/+AAAfwAAH//gAAH8AAB//4AAB+AAAP//AAAfgAAD//wAAAAAAA//8AAAAAAAH//AAAAAAAB//wAAAAAAAf/8AAAAAAAH//AAAAAAAA//wAAAAAAAP/+AAAAAAAD//gAAAAAAAf/4AAAAAAAH/+AAAAAAAA//gAAAAAAAP/wAAAAAAAB/8AAAAAAAAH/AAAAAAAAAfgA=="},"aphelocoma-californica":{"w":93,"h":62,"bits":"B///wAAAAAAAAAAD////AAAAAAAAAAA////8AAAAAAAAAAH////wAAAAAAAAAA////+AAAAAAAAAAH////4AAAAAAAAAA/////AAAAAAAAAAH////4AAAAAAAAAA/////gAAAAAAAAAH////+AAAAAAAAAAB////4AAAAAAAAAAH////AAAAAAAAAAAP///8AAAAAAAAAAA////wAAAAAAAAAAD////gAAAAAAAAAAf///+AAAAAAAAAAB////8AAAAAAAAAAP////wAAAAAAAAAB/////AAAAAAAAAAP////8AAAAAAAAAA/////4AAAAAAAAAH/////gAAAAAAAAA/////8AAAAAAAAAD/////wAAAAAAAAAf/////gAAAAAAAAD/////+AAAAAAAAAP/////8AAAAAAAAB//////wAAAAAAAAP//////AAAAAAAAA//////+AAAAAAAAH//////4AAAAAAAA///////gAAAAAAAD//////+AAAAAAAAf//////wAAAAAAAD///////AAAAAAAAP//////8AAAAAAAA///////wAAAAAAAH///////AAAAAAAAf//////+AAAAAAAB///////8AAAAAAAH///////4AAAAAAAf///////wAAAAAAB////////gAAAAAAH////////AAAAAAAf///////+AAAAAAB////////8AAAAAAH////////wAAAAAAf////////gAAAAAA/////////AAAAAAH//wAD///+AAAAAAf/AAAH///4AAAAAB/4AAAf///wAAAAAP/AAAA////AAAAAAf4AAAB///+AAAAAAAAAAAD///4AAAAAAAAAAAH///AAAAAAAAAAAAf//4AAAAAAAAAAAA///AAAAAAAAAAAAB//4AAAAAAAAAAAAD//AAAAAAAAAAAAAP/4AAAAAAAAAAAAAf/A=="},"aphelocoma-woodhouseii":{"w":78,"h":93,"bits":"4AAAAAAAAAAB84AAAAAAAAAAB84AAAAAAAA//h84AAAAAAAD//4AAAAAAAAAP//8AAAAAAAAAf///4AAAAAAAA////+AAAAAAAD/////AAAAAAAD/////AAAAAAAD/////AAAAAAAH/////AAAAAAAP/////AAAAAAAP/////AAAAAAAf////4AAAAAAA/////AAAAAAAB////+AAAAAAAD////8AAAAAAAP////8AAAAAAAf////4AAAAAAB/////4AAAAAAD/////wAAAAAAH/////wAAAAAAP/////gAAAAAAf/////gAAAAAA//////gAAAAAB//////gAAAAAB//////gAAAAAD//////gAAAAAH//////gAAAAAH//////gAAAAAP//////gAAAAAP//////AAAAAAf//////AAAAAAf//////AAAAAA//////+AAAAAB//////+AAAAAB//////8AAAAAB//////8AAAAAD//////8AAAAAD//////4AAAAAH//////4AAAAAH//////4AAAAAH//////wAAAAAP//////wAAAAAP//////wAAAAAf//////wAAAAAf//////wAAAAAf//////AAAAAAf/////+AAAAAA//////+AAAAAA//////8AAAAAB//////4AAAAAB//////wAAAAAD//////gAAAAAD//////AAAAAAD/////+AAAAAAD/////8AAAAAAD/////wAAAAAAH/////4AAAAAAH///D/8AAAAAAP//+B/+AAAAAAP//+A//AAAAAAf//8Af/gAAAAA///8AP/wAAAAA///8Af/4AAAAB///8Af/8AAAAB///8Af//8AAAD///8Af///AAAH///8Af///gAAH///8Af///gAAP//38AH///gAAP//n+AD///gAAf//n+AAH//gAAf//H+AAD//gAA////+AAA//gAA/////AAAAAAAB//9//wAAAAAAB//9///gAAAAAD//5///4AAAAAH//5///4AAAAAH//x///4AAAAAH//w///4AAAAAP//gB//4AAAAAP//gA//4AAAAAf//AAf/+AAAB8f//AAHw+AAAB8f/+AAAA+AAAB8//8AAAA+AAAB8//4AAAA+AAAB8//wAAAAAAAAAA/+AAAAAAAAAAA/4AAAAAAAAAAAAAAAAAAAAAAAAA=="},"aquila-chrysaetos":{"w":72,"h":93,"bits":"8AAAAAAAAAAA8AAAAAAAAAAA8AAAAAAAAAAA8AAB+AAAAAAAA+AP/wAAAAAAA+AP/4AAAAAAA+B//4AAAAAAA+D//4AAAAAAA+D//8AAAAAAAAD//8AAAAAAAAD///gAAAAAAAP///gAAAAAAAP///wAAAAAAAP///wAAAAAAAP///wAAAAAAAP///wAAAAAAAP///4AAAAAAAP///4AAAAAAAP///4AAAAAAAP///4AAAAAAAP///8AAAAAAAf///8AAAAAAAf///8AAAAAAAf///+AAAAAAAf///+AAAAAAAf///+AAAAAAAP////AAAAAAAP////AAAAAAAP////AAAAAAAP////gAAAAAAP////gAAAAAAP////gAAAAAAP////gAAAAAAP////wAAAAAAP////wAAAAAAP////wAAAAAAP////wAAAAAAH////wAAAAAAH////4AAAAAAH////4AAAAAAD////4AAAAAAD////8AAAAAAB////8AAAAAAB////+AAAAAAA////+AAAAAAA////+AAAAAH/f////AAAAAP//////gAAAAP//////wAAAAf//////4AAAAf//////8AAAA////////gAAA////////4AAA////////8AAA////////+AAA////////+AAA////////+AAA////////+AAA////////+AAA////////+AAA////////8AAAf///////4AAAf///////+AAAP////////AAAH////////gAAD//9/////wAAB//x//////gAAf/B//////gAAP+A//////gAAAAA//////gAAAAAf/////gAAAAAP/////gAAAAAP/////gAAAAAH/////gAAAAAD////+AAAAAAB////8AAAAAAAP///wAAAAAAAD///wAAAAAAAAf/+AAAAAAAAAH/+AAAAAAAAAD/gAAAAAAAAAAfgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"archilochus-alexandri":{"w":93,"h":57,"bits":"4AAf//wAAAAAAAAHP/////AAAAAAAAA//////4AAAAAAAAH//////gPgAAAAAA//////8B8AAAAAAH//////gPgAAAAAA//////+B8AAAAH+H//////wPgAAH////4f///+AAAAf///4AAf///wAAAf////AAA///+AAB/////4AAD///wAD//////AAAf///AH//////4AAB///8H///////AAAP///j///////4AAB////////////AAAP///////////4AAA////////////AAAH///////////4AAA////////////AAAH///////////4AAA///////////wAAAH//////////8AAAA//////////wAAAAH/////////4AAAAA/////////wAAAAAH////////wAAAAAAf///////8AAAAAAD///////8AAAAAAAf///////AAAAAAAD///////AAAAAAAAf//////AAAAAAAAD//////gAAAAAAAAf/////wAAAAAAAAB/////4AAAAAAAAAP////8AAAAAAAAAA/////gAAAAAAAAAH////8AAAAAAAAAAf////gAAAAAAAAAB////+AAAAAAAAAAH////wAAAAAAAAAA////+AAAAAAAAAAD////4AAAAAAAAAAf////AAAAAAAAAAB////8AAAAAAAAAAP////gAAAAAAAAAA////8AAAAAAAAAAD////wAAAAAAAAAAP////AAAAAAAAAAAB///4AAAAAAAAAAAP///gAAAAAAAAAAAB//+AAAAAAAAAAAAP//4AAAAAAAAAAAA///AAAAAAAAAAAAD//4AAAAAAAAAAAAP//AAAAAAAAAAAAA//4AAAAA"},"ardea-alba":{"w":93,"h":77,"bits":"+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/8AAAAAAAAAAAAA//4AAAAAAAAAAAAP//gAAAAAAAAAAAB///gAAAAAAAAAAAf///gAAAAAAAAAAD////gAAAAAAAAAAf////gAAAAAAAAH/////+AAAAAAAAD//////wAAAAAAAB//////+AAAAAAAAf//////wAAAAAAAP////8/+AAAAAAAD/////wAAAAAAAAD/////+AAAAAAAAD//////wAAAAAAAB//7///+AAAAAAAAf/+////wAAAAAAAP//v///+AAAAAAAD///////wAAAAAAB///////+AAAAAAA////////gAAAAAAf//////v8AAAAAAH////////gAAAAAD////////4AAAAAB/////////AAAAAA/////////wAAAAA/////////8AAAAAH/////////AAAAAA/////////4AAAAAH////////8AAAAAA/////////AAAAAAAP///////wAAAAAAAP//////8AAAAAAAD///////AAAAAAAB///////wAAAAAAAf//////+AAAAAAAP///////gAAAAAAH///////AAAAAAAA///////wAAAAAAAH//////+AAAAAAAA///////wAAAAAAAH//////+AAAAAAAAD////v/wAAAAAAAAH///5/8AAAAAAAAB///+f/gAAAAAAAAf///z/8AAAAAAAAD/Af8f/gAAAAAAAAfwAAD/8AAAAAAAAD+AAAf/gAAAAAAAAfgAAD/8AAAAAAAAAAAAAf/gAAAAAAAAAAAAD/8AAAAAAAAAAAAAf/wAAAAAAAAAAAAB/+AAAAAAAAAAAAAP/wAAAAAAAAAAAAB/+AAAAAAAAAAAAAP/wAAAAAAAAAAAAB/+AAAAAAAAAAAAAP/wAAAAAAAAAAAAB/+AAAAAAAAAAAAAP/wAAAAAAAAAAAAB/+AAAAAAAAAAAAAP/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"ardea-herodias":{"w":93,"h":62,"bits":"4AAAAA+AAAAAAAAHAAAAAHwA/wAAAAA4AAAAA+Af/gAAAAAAAAAAHwf/+AAAAAAAAAAAAf//8AAAAAAAAAAAf///wAAAAAAAAAAP////AAAAAAAAAAB////8AAAAAAAAAAP////gAAAAAAAAAB////8AAAAAAAAAAP////gAAAAAAAAAA/3//8AAAAAAAAAAAA///gAAAAAAAAAAAH//8AAAAAAAAAAAB///gAAAAAAAAAAAP/+AAAAAAAAAAAAB//gAAAAAAAAAAAAP/4AAAAAAAAAAAAB//+AAAAAAAAAAAAP//8AAAAAAAAAAAB///wAAAAAAAAAAAP///AAAAAAAAAAAB///8AAAAAAAAAAAP///wAAAAAAAAAAB////AAAAAAAAAAAP///8AAAAAAAAAAB////wAAAAAAAAAAP////AAAAAAAAAAA////8AAAAAAAAAAH////gAAAAAAAAAAf///+AAAAAAAAAAD////4AAAAAAAAAAf////AAAAAAAAAAB////8AAAAAAAAAAP////gAAAAAAAAAA////+AA8AAAAAAAH////wAHgAAAAAAAf///+AA8AAAAAAAB////4AHgAAAAAAAP////AA8AAAAAAAB////8AAAAAAAAAAH////gAAAAAAAAAAD///+AAAAAAAAAAAf///wAAAAAAAAAAB///+AAAAAAAAAAAP///wAAAAAAAAAAA///+AAAAAAAAAAAH+//wAAAAAAAAAAA/z/+AAAAAAAAAAAH/P/wAAAAAAAAAAA/4f+AAAAAAAAAAAH/B/gAAAAAAAAAAA/4H4AAAAAAAAAAAP/AAAAAAAAAAAAAB/wAAAAAAAAAAAAAf+AAAAAAAAAAAAAD/wAAAAAAAAAAAAAf+AAAAAAAAAAAAAD/wAAAAAAAAAAAAAf+AAAAAAAAAAAAAD/wAAAAAAAAAAAAAfAAAAAA=="},"artemisiospiza-belli":{"w":93,"h":72,"bits":"+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/wAAAAAAAAAAAAH//gAAAAAAAAAAAD///AAAAAAAAAAAAf//8AAAAAAAAAAAP///wAAAAAAAAAAH///+AAAAAAAAAAA////4AAAAAAAAAAH////gAAAAAAAAAA////8AAAAAAAAAAH////w+AAAAAAAAA////+HwAAAAAAAAH////4+AAAAAAAAAP////nwAAAAAAAAB/////+AAAAAAAAAP////+AAAAAAAAAA/////+AAAAAAAAAH/////8AAAAAAAAA//////wAAAAAAAAD//////AAAAAAAAAf/////8AAAAAAAAD//////4AAAAAAAAf//////wAAAAAAAD///////gAAAAAAAf//////+AAAAAAAD///////8AAAAAAAf///////wAAAAAAB////////AAAAAAAP///////8AAAAAAB////////8AAAAAAH////////8AAAAAA/////////+AAAAAH//////////gAAAAf//////////4AAAB///////////8AAAP///////////+AAA////////////+AAD/////////////AAP/////////////AA/////////////4AD/////////////AAP////////////4AAf//////gH////AAA//////8AD///4AAD//////gAA///AAAH////AAAAAf/4AAAH///AAAAAAD8AAAAB//AAAAAAAAAAAAAD/wAAAAAAAAAAAAAf+AAAAAAAAAAAAAH/gAAAAAAAAAAAAA/8AAAAAAAAAAAAAP/AAAAAAAAAAAAAB/wAAAAAAAAAAAAAf+AAAAAAAAAAAAAD/gAAAAAAAAAAAAAf4AAAAAAAAAAAAAD/AAAAAAAAAAAAAAfwAAAAAAAAAAAAAD+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"asio-flammeus":{"w":93,"h":93,"bits":"HwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAD8+AAAAAAAAAAAAA//wAAAAAAAAAAAAH//AAAAAAAAAAAAB//8AAAAAAAAAAAAf//wAAAAAAAAAAAD///AAAAAAAAAAAA///4AAAAAAAAAAAH///AAAAAAAAAD4B///8AAAAAAAAAfAP///gAAAAAAAAD4D///8AAAAAAAAAfA////gAAAAAAAAD4P///8AAAAAAAAAAB////gAAAAAAAAAAf///8AAAAAAAAAAH////gAAAAAAAAAD////8AAAAAAAAAB/////gAAAAAAAAAf////8AAAAAAAAAP/////AAAAAAAAAD/////4AAAAAAAAA//////AAAAAAAAAP/////4AAAAAAAAD//////AAAAAAAAA//////4AAAAAAAAP/////+AAAAAPgAD//////wAAAAB8AA//////8AAAAAPgAf//////gAAAAB8AP//////4AAAAAPgH///////AAAAAAAH///////wAAAAAAH///////+AAAAAAD////////wAAAAAB////////8AAAAAAf////////AAAAAAD////////wAAAAAAf///////+AAAAAAD////////gAAAAAAf///////4AAAAAAD///////+AAAAAAAf///////gAAAAAAD///////8AAAAAAAf///////AAAAAAAD///////gAAAAAAAf//////4AAAAAAAD///////wAAAAAAAf///+///4AAAAAAA////n///gAAAAAAH///wf//8AAAAAAA///gD///gAAAAAAD/+AAf//8AAAAAAAP/AAD///gAAAAAAAfwAAf//gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"asio-otus":{"w":67,"h":93,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAD8AfwAAAAAAD+Af4AAAAAAB/gf8AAAAAAA/wf+AAAAAAAf8P/AAAAAAAP/P/gAAAAAAH///wAAAAAAD///8AAAAAAB////AAAAAAA////wAAAAAAf///8AAAAAAH////AAAAAAD////gAAAAAB////4AAAAAA////8AAAAAAf////AAAAAAP////gAAAAAH////wAAAAAD////8AAAAAB////+AAAAAA/////AAAAAA/////gAAAAAf////4AAAAAP////+AAAAAH/////AAAAAD/////wAAAAD/////8AAAAB//////AAAAA//////wAAAAf/////8AAAAP//////AAAAH//////wAAAD//////4AAAB//////+AAAA///////AAAAf//////wAAAP//////4AAAH//////+AAAD///////AAAA///////gAAAf//////4AAAP//////8AAAH//////+AAAD///////gAAB///////wAAA///////4AAAf//////8AAAP//////+AAAH///////AAAB///////gAAA///////wAAAP//////4AAAB//////8AAAAf//////AAAAP//////gAAAD//////wAAAB//////4AAAAf/////8AAAAH/////+AAAAD//////AAAAD//////gAAAB//////wAAAA//////4AAAAf/////8AAAAP/////+AAAAH//////AAAAD//////gAAAAD8////4AAAAAAf///8AAAAAAP////AAAAAAA////gAAAAAAP///4AAAAAAH///8AAAAAAB///+AAAAAAA////AAAAAAAP///gAAAAAAH///wAAAAAAD///wAAAAAAA///gAAAAAAAf//wAAAAAAAP//4AAAAAAAH/+AAAAAAAAD//AAAAAAAAA//gAAAAAAAAf/wAAAAAAAAH/4AAAAAAAAA/8AAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"athene-cunicularia":{"w":93,"h":62,"bits":"4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+AAAAAAAAAAAAA//4AAAAAAAAAAAAP//gAAAAAAAAAAAD//+AAAAAAAAAAAAf//4AAAAAAAAAAAD///AAAAAAAAAAAAf//8AAAAAAAAAAAH///gAAAAAAAAAAA///+AAAAAAAAAAAH///wAAAAAAAAAAA////AAAAAAAAAAAH///8AAAAAAAAAAA////wAAAAAAAAAAD////AAAAAAAAAAAf///8AAAAAAAAAAD////wAAAAAAAAAAf////AAAAAAAAAAD////4AAAAAAAAAAf////gAAAAAAAAAD////8AAAAAAAAAAf////wAAAAAAAAAD////+AAAAAAAAAAP////4AAAAAAAAAB/////AAAAAAAAAAP////4AAAAAAAAAA/////AAAAAAAAAAH////8AAAAAAAAAA/////gAAAAAAAAAH////8AAAAAAAAAAf////wAAAAAAAAAD////+AAAAAAAAAAf////4AAAAAAAAAB/////AAAAAAAAAAH////4AAAAAAAAAA/////AAAAAAAAAAD////8AAAAAAAAAAP////wAAAAAAAAAB/////AAAAAAAAAAD////4AAAAAAAAAAP////AAAAAAAAAAA////4AAAAAAAAAAD////AAAAAAAAAAAf///4AAAAAAAAAAD////AAAAAAAAAAA////4AAAAAAAAAAf/8//AAAAAAAAAAP//h/4AAAAAAAAAB//8D/AAAAAAAAAAP//gAAAAAAAAAAAB//8AAAAAAAAAAAAP//gAAAAAAAAAAAB//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"aythya-affinis":{"w":93,"h":62,"bits":"/AAAAAAAAAAAAAAH4AAAAAAAAAAAAAA/AAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AAAAAAAAAAAAAD/8AAAAAAAAAAAAA//wAAAAAAAAAAAAP//AAAAAAAAAAAAB//4AAAAAAAAAAAAf//gAAAAAAAAAAAD//8AAAAAAAAAAAA///gAAAAAAAAAAAP//+AAAAAAAAAAAH/////wAAAAAAAAD//////8AAAAAAAAf//////+AAAAAAAD///////+AAAAAAAf////////AAAAAAD/////////AAAAAAf////////4AAAAAD/////////8AAAAAA/////////gAAAAAH////////8AAAAAA/////////gAAAAAH////////8AAAAAA/////////gAAAAAH////////8AAAAAAf///////+AAAAAAD///////8AAAAAAAP//////+AAAAAAAAf/////wAAAAAAAAAAP//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"aythya-americana":{"w":93,"h":92,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgAAAAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/8AAAAAAAAAAAAA//4AAAAAAAAAAAAP//gAAAAAAAAAAAD//+AAAAAAAAAAAA///4AAAAAAAAAAAP///gAAAAAAAAAAB///8AAAAAAAAAAAP///wAAAAAAAAAAD///+AAAAAAAAAAAf///wAAAAAAAAAAP////AAAAAAAAAAD////4AAAAAAAAAB/////AAAAAAAAAA/////4AAAAAAAAAP/////AAAAPgAAAD/////4AAAB8AAAAf/////AAAAPgAAAD/////4AAAB8AAAAf///////4APgAAAD////////8AAAAAAP/v//////8AAAAAAAH///////8AAAAAAB////////+AAAAAAP////////+AAAAAD/////////8AAAAA//////////4AAAAH//////////gAA4B///////////AAHAP///////////AA4B///////////+AHAP///////////8A4B////////////gAAP///////////8AAB////////////wAAP////////////4AB/////////////gAP////////////8AB/////////////gAP////////////8AB/////////////gAH////////////8AA/////////////AAD////////////wAAf//+D///////wAAB////z/////8AAAAD/////////+AAAAAP/////////AAAAAAf////////wAAAAAAH///////wAAAAAAAAf////+AAAAAAAAAAD//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"aythya-collaris":{"w":93,"h":62,"bits":"+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHgAAAAAAAAAAAAAA4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP4AAAAAAAAAAAAAP/gAAAAAAAAAAAAH/+AAAAAAAAAAAAB//4AAAAAAAAAAAAf//gAAAAAAAAAAAH//8AAAAAAAAAAAB///gAAAAAAAAAAAP//+AAAAAAAAAAAB///wAAAAAAAAAAAP//+AAAAAAAAAAAD///wAAAAAAAAAAAf//+AAAAAAAAAAAH///wAAAAAAAAAAB////AAAAAAAAAAAf////8AAAAAAAAAP//////4AAAAAAAH///////4AAAAAAB////////wAAAAAAP////////wAAAAAB/////////wAAAAAP/////////gAAAAB//////////gAAAAP//////////AAAAA//////////8AAAAAf/////////wAAAAD//////////AAAAAf/////////4AAAAD//////////AAAAAf/////////+AAAAD//////////+AAAAf//////////8AAAD///////////gAAAf//////////8AAAD///////////gAAAP//////////8AAAA///////////gAAAD//////////wAAAAD///////+AAAAAAAAP///+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAB8AAAA=="},"aythya-valisineria":{"w":93,"h":62,"bits":"4AAAAAAB8AAAAAAHAAAAAAAPgAAAAAA4AAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAfAAAAAAAA/AAAAAD4AAAAAAAH4AAAAAAAAAAAAAA/APh8AAAA//gAAAH4B8PgAAAP/+AAAf/APh8AAAD//4AAD4AB8PgAAAf//gAAfAAPh8AAAH//8AAD4AAAAAAAB///wAAfAAAAAAAAf//+AAAAAAAAAAAP///4AAAAAAAAAAP////AAAAAAAAAAH////4AAAAAAAAAA/////AAAAAAAAAAH////4AAAAAAAAAA/////AAAAAAAAAAH////4AAAAAAAAAA/////AAAAAAAAAAH/h//4AAAAAAAAAAAAP/////4AAAAAAAAD///////AAAAAAAA////////gAAAAAAP////////8AAAAAB/////////4AAAAAf//////////gAAAD//////////8AAAA///////////gAAAH//////////8AAAA///////////gAAAH//////////8AAAA///////////AAAAH//////////gAAAA///8AH////wAAAAH//4AAf///gAAAAA/////////4AAAAAD////////+AAAAAAf////////AAAAAAB////////AAAAAAAD//////AAAAAAAAAAD5//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8AAAAAAAAAAAAAAHgAAAAAAAAAAAAAA8AAAAAAAAAAAAAAHgAAAAAAAAAAAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"baeolophus-inornatus":{"w":93,"h":51,"bits":"AH/8AAAAAAAAAAAAB//gAAAAAAAAAAAAf/+AAAAAAAAAAAAD//4AAAAAAAAAAAA///gAAAAAAAAAAAP//8AAAAAAAAAAAD///wAAAAAAAAA/wf///wAAAAAAAA/+H////AAAAAAAAf/4////+AAAAAAAP//H////4AAAAAAH//5/////gAAAAAD///P/////AAAAAA///5//////8AAAAf///f//////+AAAP///7////////AAH/////////////4D///////////////////////////////////3//////////////4//////////////8H/////////////+A//////////////AH/////////////AA/////////////gAB////////////wAAH///////////4AAAf//////////+AAAA///////////wAAAD//////////8AAAAP//////////wAAAB///////////AAAAH//////////4AAAA///////////AAAAD//////////4AAAAf//////////AAAAB//////////4AAAAP////////+AAAAAB/////////wAAAAAH////////8AAAAAAf////////AAAAAAD////////4AAAAAAP///////+AAAAAAA////////gAAAAAAD///////4AAAAAAAP//////+AAAAAAAA///////gAAAAAAAD//////4AAAAAAAAH/////+AAAAAAAAAP/////gAAAAAAAAA/////wAAAAAA="},"bombycilla-cedrorum":{"w":56,"h":93,"bits":"AH///8AAAAH////AAAAH////wAAAP////8AAAP/////AAAD////8AAAA/////AAAAP////4AAAD////+AAAA/////wAAAP////8AAAD/////AAAAH////4AAAA////+AAAAH////wAAAA////+AAAAP////gAAAB////8AAAAf////gAAAD////4AAAB/////AAAAf////4AAAH////+AAAB/////wAAAf////8AAAH/////gAAB/////4AAAf/////AAAH/////4AAB/////+AAAf/////wAAH/////+AAB//////gAAP/////8AAD//////gAA//////8AAP//////AAD//////4AAf//////AAH//////wAB//////+AAf//////gAD//////8AA///////AAH//////4AB//////+AAP//////gAD//////8AAf//////AAD//////wAA//////+AAH//////gAA//////4AAH/////+AAA//////gAAH/////4AAB/////+AAAP/////gAAB/////4AAAP/////AAAA/////wAAAP////8AAAD/////AAAA/////wAAAP////8AAAA/////AAAAAP///wAAAAAP//8AAAAAA///AAAAAAH//wAAAAAB//8AAAAAAP//AAAAAAD//wAAAAAAf/8AAAAAAH//AAAAAAA//wAAAAAAH/8AAAAAAA//AAAAAAAP/wAAAAAAB/8AAAAAAAf/AAAAAAAD/wAAAAAAA/8AAAAAAAH/AAAAAAAB/wAAAAAAAP8AAAAAAAD/AAAAAAAAfwAAAAAAAH8AAAAAAAA/AAAAAAAAPwAAAAAAAD8AAAAAAAAf"},"bombycilla-garrulus":{"w":93,"h":93,"bits":"AAAAAAAAAf8AAAAAAAAPgAAAD/gAAAAAAAB8AAAAf8AAAAAAAD/gHwAD/gAAAAAAAf8A+AAf8AAAAAAAD/gHwAAAAAAAAAAAfAA+AAAAAAAAA/AD4AHwAAAAAAAAH4AAAAAAAAAAAAAA/AAAAAAAAAAAAAAH4AAAAAAAAAAAAAA/AAAAAAAAAAAAAAD4AAAAAAfAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAfAAAAPgAAAAAAAAD4AAAB8AAAAAAAAAfAAAAPgAAAAAfAAAAAAAB8AAAAD//8AAAAAAPgAAAD///4AAAAAB8AAAA////wAAAAAAAAAAf///+AAAAAAAAAAP////wAAAAAAAAAH////+AAAAAAAAAH/////wAAAAAAAAD/////8AAAAAAAAAf////4AAAAAAAAAD/////gAAAAAAAAAf////8AAAAAAAAAD/////wAAAAAAAAAP/////AAAAAAAAAA/////8AAPgAAAAAA/////wAB8AAAAAAB/////AAPgAAAAAAH////+AB8AAAAAAA/////8APgAAAAAAD/////4B8AAAAAAAP/////wAAAAAAAAB//////gAAAAAAAAP/////+AAAAAAAAB//////8AAAAAAAAP//////wAAAAAAAB///////AAAAAAAAP//////+AAAAAAAB///////4AAAAAAAP///////gAAAAAAB////////AAAAAAAP///////8AAAAAAB////////wAAAAAAP////////AAAAAAA////////8AAAAAAH////////gAAAAAA/////////AAAAAAD////////8AAAAAAf////////4AAAAAB/////////gAAAAAP////////+AAAAAA/////////4AAAAAD/////////wAAAAAP/////////AAAAAA/////////8AAAAAD/////////gAAAAAP////////8AAAAAA/////////gAAAAAD////////8AAAAAAH////////wAAAAAAf////////gAAAAAA////////+AAAAAAA////f///4AA+AAAB///gf///gAHwAAAH//gAP//8AA+AAAAH8AAAP//gAHwAAAAAAAAA//8AA+AAAAAAAAAB//gAAAAAAAAAAAAH/8AAAAAAAAAAAAAP/AAAAAAAAAAAAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfgAAAAAAAAAAAAAD8AAAAAAAAAAAAAAfgAAAAAAAAAAAAAD8AAAAAAAAAAAAAAfgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"branta-canadensis":{"w":93,"h":93,"bits":"AAAAAAAAAAAAAAAAAH/AAAAAAAAAAAAAD/+AAAAAAAAAAAAA//4AAAAAAAAAAAAP//gAAAAAAAAAAAD//8AAAAAAAAAAAA///wAAAAAAAAAAAP//+AAAAAAAAAAAD///wAAAAAAAAAAB////AAAAAAAAAAA////4AAAAAAAAAAH////AAAAAAAAAAA////4AAAAAAAAAAH////AAAAAAAAAAA////4AAAAAAAAAAH////AAAAAAAAAAA////4AAAAAAAAAAAAP//AAAAAAAAAAAAAf/4AAAAAAAAAAAAD//AAAAAAAAAAAAAf/4AAAAAAAAAAAAB//AHwAAAAAAAAAAP/4A+AAAAAAAAAAB//AHwAAAAAAAAAAP/4A+AAAAAAAAAAB//AHwAAAAAAAAAAP/4AAAAAAAAAA4AD//AAAAAAAAAAHAAf/4AAAAAAAAAA4AD//AAAAAAAAAAHAAf/4AAAAAAAAAA4AD//AAAAAAAAAAAAAf/4AAAAAAAAAAAAH//AAAAAAAAAAAAA//4AAAAAAAAAAAAH//AAAAAAAAAAAAB//4AAAAAAAAAAAAP//AAAAAAAAAAAAD//wAAAAAAAAAAAAf//AAAAAAAAAAAAH//4AAAAAAAAAAAA///AAAAAAAAAAAAH//4AAAAAAAAAAAB///AAAAAAAAAAAAP//8AAAAAAAAAAAB///wAAAAAAAAAAAP///8AAAAAAAAAAB//////AAAAAAAAAP//////gAAAAAAAD///////AAAAAAAAf//////+AAAAAAAD///////8AAAAAAAf///////4AAAAAAD////////gAAAAAAf////////AAAAAAB////////+AAAAAAP////////4AAAAAB/////////gAAAAAP/////////AAAAAB/////////+AAAAAH/////////4AAAHw//////////wAAA+H//////////AAAHw//////////+AAA+H//////////8AAHw///////////wAAAH///////////AAAA///////////8AAAD///////////4AAAf///////////gAAD///////////+AAAP///////////wAAB////////////gAAH////////////AAA////////////+AAD////////////4AAf////////////gAB////////////8AAH////////////gAAf///////////8AAB////////////gAAH///////////8AAAf///////////wAAB////////////AAAD///////////4AAAH///////////AAAAP//////////4AAAAf//////Af//AAAAAf////+AB//4AAAAAH/8/AAAD//AAAAAAAAAAAAAH/4AAAAAAAAAAAAAP/AAAAAAAAAAAAAAAAA="},"bubo-virginianus":{"w":62,"h":93,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+AAAAAAAAAfwAH4AAAAAP+AH+AAAAAD/gD/gAAAAA/4D/4AAAAAP/B/+AAAAAD////gAAAAA////4AAAAAP///+AAAAAD////AAAAAA////4AAAAAP///+AAAAAD////wAAAAA////+AAAAAP////gAAAAD////4AHwAA/////AB8AAf////wAfAAH////8AHwAB/////gB8AAf////4AAAAH/////AAAAA/////wAAAAP////+AAAAD/////wAAAA/////+AAAAP/////4AAAD//////AAAA//////4AAAP//////AAAD//////wAAA//////+AAAP//////wAAD//////8AAA///////gAAP//////4AAD//////+AAAf//////wAAH//////8AAB///////AAAf//////4AAH//////+AAA///////wAAP//////8AAD///////AAAf//////4AAH///////4AA///////+AAH///////gAA///////4AAH//////+AAB//////8AAAP//////AAAB//////4AAAf/////+AAAB//////gAAAP/////4AAAD/////+AAAH//////gAAH//////4AAD//////+AAA///////gAAP//////8AAD///////AAA///////wAAP//////8AAD///////AAAH//////wAAA///5//8AAAPwH8f/8AAAAAAAD//AAAAAAAA//wAAAAAAAD/8AAAAAAAAP/AAAAAAAAB/wAAAAAAAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"bubulcus-ibis":{"w":44,"h":93,"bits":"/gAAAAAP4AAAAAD/4AAAAA/+AAAAAP/gAAAAB/4AAAAAA+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/gAAAAf/+AAAAf//wAAAH//+AAAD///gAAA///8AAAP///wAAD////gAA////+AAP////wAD////8AB/////AAf////wAH////8AB/////AB///+HwA////gAAf///4AAP///+AAH////gAD////4AB////+AAf////gAP////4AD////+AB/////gAf////4AP////+AD/////gA/////4AP////+AH/////AB/////wA/////4AP////+AD/////AA/////wAP////8AD////+AA/////gAP////4AD////8AA////+AAP////gAD////4AA////8AAP////AAD////gAA////4AAP///8AAD////AAA////gAAP///4AAD///8AAA////AAAP///gAAD///wAAA///8AAAP///AAAD///wAAA///8AAAH///AAAAf//wAAAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"bucephala-albeola":{"w":93,"h":68,"bits":"4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/+AAAAAAAAAAAAA//8AAAAAAAAAAAAP//wAAAAAAAAAAAD///AAAAAAAAAAAAf//8AAAAAAAAAAAH///gAAAAAAAAAAA///+AAAAAAAAAAAH///wAAAAAAAAAAA///+AAAAAAAAAAAP/9/4AAAAAAAAAAB//n/AAAAAAAAAAAf/+f4AAAAAAAAAAP////AAAAAAAAAAD////4AAAAAAAAAB/////AAAAAAAAAAf////4AAAAAAAAAD/////AAAAAAAAAAf////4AAAAAAAAAD/////P+AAAAAAAAf///////gAAAAAAB////////gAAAAAAAB///////gAAAAAAAf///////gAAAAAAD////////gAAAAAA/////////AAAAAAH////////+AAAAAA//////////gAAAAH8/////////AAAAA/P////////4AAAAH7//////////AAAA////////////AAAH///////////4AAA////////////AAAH///////////4AAA////////////AAAH///////////4AAAf//////////+AAAD///////////gAAAP//////////wAAAA/////////8AAAAAD////////+AAAAAAP////////AAAAAAAP///////gAAAAAAAD//////gAAAAAAAAAD///AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"bucephala-clangula":{"w":93,"h":40,"bits":"AAAAAAAAAAP//8AAAAAAAAAAAD///wAAAAAAAAAAA////AAAAAAAAAAAP///8AAAAAAAAAAD////gAAAAAAAAAAf///8AAAAAAAAAAH////wAAAAAAAAAA////+AAAAAAAAAAP////wAAAAAAAAAB////+AAAAAAAAAAP////4AAAAAAAAAB/////AAAAAAAAf8f////8AAAAAAH////////wAAAAAP/////////AAAAA//////////+AAAB///////////4AAB////////////AAA////////////4AB/////////////AD/////////////4H//////////////D//////////////5///////////////P/////////////4D//////////////Af//////////wAf8H//////////+AB/g///////////wAH8H//////////4AA/g///////////AAD8H//////////4AAfg//////////+AAD8H//////////wAA/g//////////+AAH8H////////////j/gAA////////////8AAAP///////////gAAAA//////////4AAAAAD////////+A"},"buteo-jamaicensis":{"w":93,"h":62,"bits":"+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAP/4AAAAAAAAAAAAD//gAAAAAAAAAAAAf//AAAAAAAAAAAAH//4AAAAAAAAAAAB///gAAAAAAAAAAAP//8AAAAAAAAAAAB///4AAAAAAAAAAAP///gAAAAAAAAAAB///+AAAAAAAAAAAP///8AAAAAAAAAAA////4AAAAAAAAAAB////wAAAAAAAAAAP////AAAAAAAAAAB////8AAAAAAAAAAP////gAAAAAAAAAB////+AAAAAAAAAAP////4AAAAAAAAAB/////AAAAAAAAAAP////8AAAAAAAAAB/////wAAAAAAAAAH/////AAAAAAAAAA/////4AAAAAAAAAH/////AAAAAAAAAAf////8AAAAAAAAAD/////gAAAAAAAAAP////+AAAAAAAAAB/////wAAAAAAAAAP////+AAAAAAAAAA/////wAAAAAAAAAD////+AAAAAAAAAAP////wAAAAAAAAAB/////AAAAAAAAAAH////8AAAAAAAAAAf////wAAAAAAAAAB////+AAAAAAAAAAP////4AAAAAAAAAA/////AAAAAAAAAAH////8AAAAAAAAAAf////gAAAAAAAAAD////8AAAAAAAAAAf////gAAAAAAAAAD////8AAAAAAAAAAD/v//AAAAAAAAAAAAA//4AAAAAAAAAAAAB//AAAAAAAAAAAAAP/4AAAAAAAAAAAAA//AAAAAAAAAAAAAH/4AAAAAAAAAAAAAf/AAAAAAAAAAAAAB/4AAAAAAAAAAAAAP/AAAAAAAAAAAB8A/4AAAAAAAAAAAPgB+AAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAA=="},"buteo-lagopus":{"w":93,"h":40,"bits":"////8AAAAAAAAAAH////+AAAAAAAAAA/////+AAAAAAAAAH/////8AP+AAAAAA//////+D/8AAAAAH//////+//gP/4AA/////////9/////n//////////////8////////////////////////////////////////////////////////////////////////////////////////////////////////////7///////////////H//////////////4P//////////////Af/////////////4A//////////////AB/////////////4AA/////////////AAD////////////4AAH////////////AAAH///////////4AAAD/////////8AAAAAAH///////wAAAAAAAf/////8AAAAAAAAH//+H/wAAAAAAAAB///4AAAAAAAAAAAf///AAAAAAAAAAAH///4AAAAAAAAAAB////AAAAAAAAAAAP///4AAAAAAAAAAB////AAAAAAAAAAAP///4AAAAAAAAAAB////AAAAAAAAAAAP///4AAAAAAAAAAB////AAAAAAAAAAAH///wAAAAAA"},"buteo-lineatus":{"w":77,"h":93,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/AAAAH/wAAAAB+AAAAf/4AAAAD8AAAD//4AAAAH4AAAP//4AAAAPwAAAf//4AAAAAAAAB///4AAAAAAAAD///wAAAAAAAAP///wAAAAAAAAf///gAAAAAAAA////AAAAAD4AD///+AAAAAHwAP///8AAAAAPgAf///wAAAAAfAB////gAAAAA+AH///AAAAAAAAAf//+AAAAAAAAB///8AAAAAAAAH///4AAAAAAAAf///wAAAAAAAB////gAAAAAAAH////AAAAAAAAf///+AAAAAAAB////8AAAAAAAD////4AAAAAAAP////wAAAAAAA/////gAAAAAAB/////AAAAAAAH////+AAAAAAAP////8AAAAAAA/////4AAAAAAB////fwAAAAAAH///+/gAAAAAAP///9/AAAAAAA/////8AAAAAAB/////4AAAAAAD/////wAAAAAAH/////AAAAAAAP////+AAAAAAA/////8AAAAAAB/////wAAAAAAD/////A+AAAAAH////+B8AAAAAP////8D4AAAAAf////4HwAAAAB/////wPgAAAAD/////AAAAAAAP////+AAAAAAAf////8AAAAAAA/////wAAAAAAB/////gAAAAAAD/////AAAAAAAH////+AAAAAAAf////8AAAAAAA/////4AAAAAAD//9//4AAAAAAH//j//wAAAAAAf/+D//gAAAAAA//4H//AAAAAAD//gP/+AAAAAAH//AP/8AAAAAAf/8AfvwAAAAAA//4AAAAAAAAAD//gAAAAAAAAAH//AAAAAAAAAAf/8AAAAAAAAAA//wAAAAAAAAAB//gAAAAAAAAAD/+AAAAAAAAAAH/8AAAAAAAAAAP/wAAAAAAAAAAf/gAAAAAAAAAA/+AAAAAAAAAAB/gAAAAAAAAAAAAAAfAAAAAAAAAAAA+AAAAAAAAAAAB8AAAAAAAAAAAD4AAAAAAAAAAAHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"buteo-regalis":{"w":68,"h":93,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//AAAAAAAAB//4AAAAAAAA///AAAAAAAAf//4AAAAAAAH///AAAAAAAB///wAAAAAAA///+AAAAAAAP///gAAAAAAD///4AAAAAAA////AAAAAAAP///4AAAAAAD///+AAAAAAA////4AAAAAAP////AAAAAAD////4AAAAAB/////AAAAAA/9///4AAAAAP/H//+AAAAAD/////wAAAAA/////+AAAAAP+////gAAAAH/v///8AAAAB/7////AAAAAf/////wAAAAH/////8AAAAB//////gAAAAf/////4AAAAH//n//+AAAAB//5///gAAAAP/////8AAAAD//////AAAAA//////wAAAAP/////8AAAAD//////AAAAAf/////wAAAAH/////8AAAAB//////AAAAAf/////wAAAAH/////+AAAAA//////gAAAAP/////4AAAAB/////+AAAAAf/////gAAAAH/////4AAAAA/////+AAAAAH/////gAAAAB/////4AAAAAH////+AAAAAA/////gAAAAAP////4AAAAAB////8AAAAAAf////AAAAAAH////4AAAAAA////+AAAAAAP////wAAAAAf////8AAAAAP/////gAAAAD/////4AAAAA//////AAAAAP/////wAAAAD/////8AAAAA//////AAAAAP/////wAAAAD/f///8AAAAAf37///AAAAAH4A///wAAAAB+AP//gAAAAAPgB//wAAAAAAAAP/8AAAAAAAAD//AAAAAAAAA//wAAAAAAAAH/8AAAAAAAAA//AAAAAAAAAP/gAAAAAAAAAf4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"buteo-swainsoni":{"w":93,"h":68,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/+AAAAAAAAAAAAA//8AAAAAAAAAAAAP//4AAAAAAAAAAAD///gAAAAAAAAAAA///8AAAAAAAAAAAH///wAAAAAAAAAAB///+AAAAAAAAAAAf///4AAAAAAAAAAH////AAAAAAAAAAD////4AAAAAAAAAA/////AAAAAAAAAAP////4AAAAAAAAAD/////AAAAAAAAAA/////wAAAAAAAAAf////gAAAAAAAAAH////8AAAAAAAAAB/////wAAAAAAAAAf////+AAAAAAAAAD/////wAAAAAAAAA/////+AAAA+AAAAP/////wAAAHwAAAB/////+AAAA+AAAAf/////gAAAHwAAAD/////8AAAA+AAAA//////gAAAAAAAPn/////8AAAAAAAB9//////AAAAAAAAPv/////4AAAAAAAB///////AAAAAAAAP//////wAAAAAAAAH/////+AAAAAAAAA//////wAAAAAAAAH/////+AAAAAAAAB//////gAAAAAAAAP/////8AAAAAAAAB//////AAAAAAAAAf/////4AAAAAAAAD/////+AAAAAAAAAf/////wAAAAAAAAD/////8AAAAAAAAAf/////AAAAAAAAAH/////4AAAAAAAAB/////+AAAAAAAAAf/////wAAAAAAAAH/////+AfAAAAAAB//////gD4AAAAAAf/////8AfAAAAAAH//////AD4AAAAAA//////4AfAAAAAAP//////AAAAAAAAB/////wAAAAAAAAAP////wAAAAAHwAAB////wAAAAAA+AAAP///AAAAAAAHwAAB///wAAAAAAA+AAAP//4AAAAAAAHwAAA///AAAAAAAA+AAAH//wAAAAAAAAAAAA//+AAAAAAAAAAAAB//gAAAAAAAAAAAAP/8AAAAAAAAAAAAB//AAAAAAAAAAAAAP/4AAAAAAAAAAAAB/+AAAAAAAAAAAAAP/gAAAAAAAAAAAAA/wAAAAAAAAAAA="},"butorides-virescens":{"w":92,"h":93,"bits":"AAAAAAAA+AAAAAAAAAAAAAAPgAAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//gAAAAAAAAAAAD//+AAAAAAAAAAAD///4AAAAAAAAAAB////gAAAAAAAAAP////8AAAAAAAAH//////gAAAAAAAf//////+AAPwAAA////////4AD8AAAf////////wA/AAAH/////////APwAAB/////////4D8AAAf/////////gAAAAH/////////8AAAAB//////////AAAAAAAB///////wAAAAAAAD//////+AAAAAAAAD//////wAAAAAB8Af//////AAAAAAfAH//////4AAAAAHwB///////AAAAAB8Af//////4AAAAAfAH///////AAAAAAAB///////4AAAAAAAf//////+AAAAAAAH///////wAAAAAAB///////+AAAAAAAP///////wAAAAAAD///////+AAAAAAA////////wAAAAAAP///////8AAAAAAD////////gAAAAAAf///////4AAAAAAH////////AAAAAAA////////wAAAAAAP///////+AAAAAAB////////wAAAAAAf///////8AAAAAAD////////gAAAAAAf///////4AAAAAAD////////AAAAAAA////////wAAAAAAH///////8AAAAAAA////////gAAAAAAH///////4AAAAAAA///////+AAAAAAAH///////gAAAAAAA///////8AAAAAAAH///////AAAAAAAA///////4AAAAAAAH//////+AAAAAAAAH//////gAAAAAAAA//////4PAAA+AAAH//////Dx8APgAAAf/////w8fAD4B8AH/////+PHwA+AfAA//////jx8APgHwAH/////4AfAAAB8AA/////+AHwAAAfAAH/////gAAAAD4AAB/////4AAAAA+AAAf////+AAAAAPgAAP/4D//gAAAAD4AAD/+Af/4AAAAA+AAB//gH/+AAAAAAAAAf/wA/8AAAAAAAAAH/8AH/AAAAAAAAAD/+AA/gAAAAAAAAA//gAAAAAAAAAAAAf/4AAAAAAAAAAAAH/8AAAAAAAAAAA////AAAAAAAAAAAf///8AAAAAAAAAA/////wAAAAAAAAAf////+AAAAAAAAAH/////gAAAAAAAAB/////4AAAAAAAAAf////+AAAAAAAAAH/////gAAAAAAAAAP////4AAAAAAAAAAP/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"calamospiza-melanocorys":{"w":93,"h":62,"bits":"A///AAAD4AAAAAAAf//8AAAfAAAAAAAH///4AAD4AAAAAAA////gAAfAAAAAAAP///8AAD4AAAAAAD////4AAAAAAAAAA/////gAAAAAAAAAH////8AAAAAAAAAA/////wAAAAAAAAAH/////AAAAAAAAAA/////8AAAAAAAAAH/////4AAAAAAAAA//////wAAAAAAAAH//////gAAAAAAAA///////AAAAAAAAB//////8AAAAAAAAH//////wAAAAAAAA///////gAAAAAAAH//////+AAAAAAAA///////4AAAAAAAH///////gAAAAAAA////////AAAAAAAH///////+AAAAAAA////////4AAAAAAH////////wAAAAAA/////////AAAAAAH////////8AAAAAAf////////4AAAAAD/////////gAAAAAf////////+AAAAAD/////////4AAAAAf/////////gAAAAB/////////+AAAAAP/////////8AAAAA//////////wAAAAH//////////AAAAA//////////8AAAAD//////////gAAAAP/////////8AAAAB//////////gAAAAH/////////+AAAAAf/////////8AAAAB//////////wAAAAH/////////+AAAAAf/////////4AAAAB//////////gAAAAD/////////+AAAAAP/////////4AAAAAf/////////wAAAAA//////////gAAAAA/////////+AAAAAB/////////8AAAAA/////H////4AAAAf///+AA////wAAAP////AAAH///AAAH////gAAAf//+AAA////4AAAA///4AAH////AAAAB///AAA////4AAAAD//4AAH////AAAAAP//AAAf///4AAAAAf/4AAAf/v/AAAAAA//A=="},"calidris-alba":{"w":93,"h":61,"bits":"8AAAAAAAAAAAAAAHgAAAAAAAAAAAAAA8AAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/gAAAAAAAAAAAAB//AAAAAAAAAAAAAf/8AAAAAAAAAAAAH//wAAAAAAAAAAAA////4AAAAAAAAAAP////8AAAAAAAAAD/////4AAAAAAAAA//////wAAAAAAAAf//////gAAAAAAAH///////AAAAAAAB///////8AAAAAAAP///////4AAAAAAB////////wAAAAAAP////////gAAAAAB/j///////gAAAAAPwP//////+AAAAAAAA////////wAAAAAAH///////+AAAAAAA////////wAAAAAAD////////AAAAAAAP///////4AAAAAAA////////AAAAAAAD///////4AAAAAAAP///////AAAAAAAAf//////wAAAAAAAA/////4AAAAAAAAAA/////AAAAAAAAAAB//wP4AAAAAAAAAAP/AAfAAAAAAAAAAB/4AAAAAAAAAAAAAf+AAAAAAAAAAAAAD/wAAAAAAAAAAAAAf8AAAAAAAAAAAAAD/gAAAAAAAAAAAAH/4AAAAAAAAAAAAH//AAAAAAAAAAAAA//wAAAAAAAAAAAAH/+AAAAAAAAAAAAA//wAAAAAAAAAAAAH/+AAAAAAAAAAAAA/+AAAAAAAAAAAAAB/AAAAAAAAAAAAAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"calidris-alpina":{"w":93,"h":62,"bits":"4AAAAAAAAA+AAAAHAAAAAAAAAHwAAAA4AAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAA+AAAHwAD8AAAAAAHwAAA+AAfgAAAAAA+AAAHwAD8AAAAAAHwAAAAAAfgAfgAAA+AAAAAAD/gD8AAAAAAAAAAAB+AfgAAAAAAAAAAAPwD8AAAAAAD/AAAB+AfgAAAAAB/+AAAPwAAAAAAAAf/4AAB+AAB/gAAAH//AAAAAAAP8AAAB//8AAAAAAB/gAAA///gAAAAAAP8AAB///8AAAPgAB/gAB////gAAB8AAH4AB////+AAAPgAA+AB/////4AAB8AAHwA//////gAAPgAAAA//////+AAB8AAAAP//////4AAPgAAAP///////AAAAAAP////////8AfAAAD/////////gD4AAAf////////8AfAAAH/////////gD4AAA/////////8AfAAAH///////+AAAAAAA////////wAAAAAAH///////+AAAAAAAf///////gAAAAAAAH//////4AAAAAAAAH//////AAAAAAAAAP/////wAAAAAAAAAf////8AAAAAAAAAB/////AAAAAA+AAAD////wAAAAAHwAAAD///4AAAAAA+AAAB///4AAAAAAHwAAAP//4AAAAAAA+AAAB/7/AAAAAAAAAAAAP+f4AAAAAAAPgAAB+AAAAAAAAAB8AAAPwAAAAAAAAAPgAAA+AAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"callipepla-californica":{"w":93,"h":62,"bits":"4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAP74AAAAAAAAAAAAB/fAAAAAAAAAAAAAPH4AAAAAAAAAAAAB4/AAAAAAAAP+AAAPH4AAAAAAB//wAAAA/AAAAAAA///AAAAH4AAAAAAP//4AAAAAAAAAAAD///AAAAAAAAAAAA///4AAAAAAAAAAAH///AAAAAAAAAAAB///wAAAAAAAAAAAP//gAAAAAAAAAAAD//8AAAAAAAAAAAAf//gAAAAAAAAAAAH//8AAAAAAAAAAAB//+AAAAAAAAAAAAf//wAAAAAAAAAAAH//+AAAAAAAAAAAD///4AAAAAAAAAAA////AAAAAAAAAAAf///4AAAAAAAAAAH////AAAAAAAAAAD////4AAAAAAAAAA/////AAAAAAAAAAP////4AAAAAAAAAD/////AAAAAAAAAA/////wAAAAAAAAAP////+AAAAAAAAAD/////wAAAAAAAAA/////8AAAAAAAAAP/////gAAAAAAAAD/////4AAAAAAAAAf/////AAAAAAAAAD/////wAAAAAAAAA/////+AAAAAAAAAH/////gAAAAAAAAA/////8AAAAAAAAAH/////AAAAAAAAAB/////wAAAAAAAAAP////+AAAAAAAAAD/////AAAAAAAAAA/////wAAAAAAAAAP////4AAAAAAAAAD////8AAAAAAAAAAf////AAAAAAAAAAH////4AAAAAAAAAB//4f/4AAAAAAAAAf/8B//4AAAAAAAAH/+AH//wAAAAAAAB//gA///AAAAAAAAf/wAH//4AAAAAAAD/8AA///AAAAAAAAf/AAH//4AAAAAAAD/gAAB//AAAAAAAAf4AAAP/gAAAAAAAD+AAAB/8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"calothorax-lucifer":{"w":77,"h":93,"bits":"4AAAAAAAAAAABwAAAAAAAAAAADgAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/gAAAAAB///H//wAAAAAD//////4AAAAAH//////4AAAAAP//////wAAAAAf//////wAAAAA///////gAAAAAH//////gAAAAAAA/////AAAAAAAAP///+AAAAAAAAH///+AAAAAAAAH///+AAAAAAAAP///+AAAAAAAAf///+AAAAAAAAf///+AAAAAAAA////+AAAAAAAB////+AAAAAAAD////+AAAAAAAD////+AAAAAAAH////+AAAAAAAP////8AAAAAAAf////8AAAAAAA/////8AAAAAAB/////4AAAAAAD/////4AAAAAAD/////wAAAAAAH/////wAAAAAAP/////gAAAAAAf/////gAAAAAA//////AAAAAAA//////AAAAAAB/////+AAAAAAD/////8AAAAAAD/////8AAAAAAH/////4AAAAAAH/////wAAAAAAH/////gAAAAAAH/////gAAAAAAH/////AAAAAAAH////+AAAAAAAH////8AAAAAAAH////8AAAAAAAH////4AAAAAAAP////wAAAAAAAf////gAAAAAAA/////gAAAAAAA/////gAAAAAAAf////gAAAAAAAAP///AAAAAAAAAH///AAAAAAAAAH//+AAAAAAAAAH//+AAAAAAAAAH//8AAAAAAAAAH//4AAAAAAAAAH//wAAAAAAAAAP//gAAAAAAAAAP//AAAAAAAAAAf/+AAAAAAAAAAf/wAAAAAAAAAA//gAAAAAAAAAA//gAAAAAAAAAB//+AAAAAAAAAB//8AAAAAAAAAB//4AAAAAAAAAD//wAAAAAAAAAD//gAAAAAAAAAH//AAAAAAAAAAH/+AAAAAAAAAAH/8AAAAAAAAAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"calypte-anna":{"w":93,"h":57,"bits":"//4D//AAAP/+AAAH/////8AAH//wAAA//////wAD//+Af////////AA///z/////////8AP/////////////wH///////H/////+B///////4A/////w////////AAf////P///////4AAf///7////////AAB////////////wAAH///////////8AAAf///////////AAAB///////////wAAAP//////////4AAAA//////////8AAAAH//////////AAAAAf/////////wAAAAD/////////wAAAAAf////////+AAAAAB/////////AAAAAAP////////wAAAAAB////////4AAAAAAP///////+AAAAAAA///////+AAAAAAAH///////gAAAAAAA///////gAAAAAAAH//////wAAAAAAAAf/////4AAAAAAAAD/////+AAAAAAAAAf/////AAAAAAAAAD/////wAAAAAAAAAf////+AAAAAAAAAB/////wAAAAAAAAAP/////AAAAAAAAAA/////4AAAAAAAAAH/////gAAAAAAAAAf////8AAAAAAAAAB/////wAAAAAAAAAH////+AAAAAAAAAAf////4AAAAAAAAAB/////gAAAAAAAAAD////8AAAAAAAAAAP////wAAAAAAAAAA////+AAAAAAAAAAH////4AAAAAAAAAAf////gAAAAAAAAAB////8AAAAAAAAAAB////wAAAAAAAAAAAA///AAAAAAAAAAAAD//4AAAAAAAAAAAAH//gAAAAAAAAAAAAf/+AAAAAAAAAAAAB//wAAAAAAAAAAAAD/+AAAAAAAAAAAAAP/wAAAAAAAAAAAAA/+AAAA"},"calypte-costae":{"w":93,"h":68,"bits":"8///fAB8AAAD/AD/v///4APgAAAf4H/9////4B8AAA//A///////4PgAH//wH/P/////B8AA//AB/5/////4AAAH/4H////////AAAD///////////4AAAf//////////4AAAD//////////wA//gf//////////gf/+D//////////////4f//////////////j//+///////////+f//3///////////z///////////////H98////////////4/vn////////////H9+///////+f///8Pv3///////4////h8+////////D///+AHz///////4f///4A+f///////B////gAD///////4P///+AAf///////h////4AD///////8P////gAA///////x////+AAH///////P////4AA///////5/////AAP///////v////8AB///////9/////wAP///////v////+AB///////9/////4AP///////v/////A////////5/////4H////////n/////g////////8/////8H////////n/////g////////8/////+D////////j/////wf////////f////+D//////////////wH////////3/////A////////+f////4H////////x/////A//5/////+H////8B//P//////f////wP/4//////7/////B//H//////f////8D/4//////5/////wf/H//////H////+Af4Pv////x8B///4B/B/////+fgH///D/4P/////j8Af//4f/B///////gB///D/4A//////8AD//4fHAH//////g+f/+D44A///////3x//wAffH///////+P/+AD7+////////w//wAffx///////+D/+AD7/////////wP/wA/f/////////h/+AH5/////////8H/x8/P/////////gf+Pn5/////////+AP98/P/////////wAPvj4f////+f//+AB98PA="},"cardellina-pusilla":{"w":93,"h":46,"bits":"AH////AAAAAAAH/4B////+AAAAAAB//Af////8AAAAAA//4P/////wAAAAAP/////////4AAAAD//////////8AAAA///////////8AAAf///////////4AAH////////////wAB/////////////wAf/////////////AP///3/////////+H///8H/////////////+Af/////////////gB/////////////4AH////////////8AA/////////////AAD////////////wAAf///////////8AAD///////////+AAAP///////////wAAB///////////+AAAH///////////gAAA///////////8AAAD//////////+AAAAP//////////wAAAB//////////8AAAAH//////////gAAAA//////////8AAAAH//////////4AAAAf//////////gAAAD//////////+AAAAP//////////8AAAB///////////gAAAH//////////+AAAAf//////////wAAAB//////////+AAAAH//////////wAAAAf///////+/+AAAAB////////gAAAAAAH///////4AAAAAAAf//////+AAAAAAAB///////gAAAAAAAD//////wAAAAAAAAP/////8AAAAAAAAAP/////AAAAAA=="},"cardellina-rubrifrons":{"w":87,"h":93,"bits":"/HwAAAAAAPgAAf/8+H/4AAAB8AB///33//4AAAPgAP///////wAAAAAB+/f/////AAAAAAPz5/////8AAAAAB+AP//////gAAHz/wB//////8AAB//gAAH/////gAAf/8AAB/////8AAD//gAAf/////nwAf/8AA//////8+AD//gAf///////4Afh+AH////////AD8HwA////////4Afg+AH////////AB8HwA////////8APg+AH////////gAAfwA////////+AAD+AA////////wAAfwAH////////wAD4AA////////+AAfH/AP///////wAAB/4B///////+AAAP/AH///////8AAB/4A////////gAAP/AH///////8AAB94A////////gAH4PAH////////vg/B4A////////98P4PB/////////vh//4P////////98P//B/////////vh8/4P////////8B/n/B////////+Afg/4A////////4D8ffAH////////wfj7/g////////+D8fA8H////////+f74Hg/////////wffA8H////////+P74Hgf////////x/AA4D/////////P4AHAf////////5/AAAD/////////P4AHAP////////8+D44B/////////wAfHAP//////////j44A//////////8fHAH//////////j4AAf///////////AAB///////////AAAH////////9/4AAA/////////v/AAAD////////8P4D/AP////////h/Af4A////////+P4D/fP////////x8Af///////////PgD///////////8AAfv//////////nwAB//////////++AAP///////////wAA+Hw/////////gAAA+B/////////gAAAA/////////8AAAB/3////////gA+D/+D///////8AHwf/wAAf/////gA+f//4AD/////8AHz///AAf////+AA+f/z4AP/////fAHz++fAB/3///D/g+f3z4AP+///4f8Hz++AAB/+///j/gAAAAHwP/3//+f8AAAAA+B/+///4HgAAAD/wH/////gAAAAAf+A//////AAAAAD/wH4ff//4B/wAAf+A/D5///AP+AAD/AD4fH//4B/wAAD4AAA+f//4P+B8AAAAAHz///B/wP+fAAAA+P//4AAB/z/wAAHw///AAAP+f/AAA+D///4AB/z/4AAAD////AAf+f/AAAAf///4Af/wP74AAD////AP/8A//AAAf///4B//gB/4AAD///AAP/AAP/AAAA/8AA=="},"cathartes-aura":{"w":62,"h":93,"bits":"4AAAAAAAAAOAAAAAAAAADgAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+AAAAAAAAD/wAAAAAAAB/+AAAAAAAA//gAAAAAAAf/8AAAAAAAP//AAAAAAAH//4AAAAAAB///AAAAAAAf//wAAAAAAH//+AAAAAAB///gAAAAAAf//4AAAAAAH///AAAAAAA///4AAAAAAB//+AAAAAAAf//wAAAAAAP///AAAAAAH///8AAAAAB////gAAAAAf///+AAAAAP////wAAAAD////+AAAAA/////wAAAAP////+AAAAD/////gAAAA/////8AAAAP/////AAAAD/////4AAAA/////+AAAAP/////wAAAD/////8AAAA//////AAAAH/////wAAAB/////+AAAAf/////gAAAH/////8AAAB//////AAAAP/////4AAAD/////+AAAA//////gAAAH/////4AAAB/////+AAAAP/////gAAAB/////4AAAAP/////AAAAD/////wAAAAf////8AAAAD/////gAAAA/////4AAAAH////+AAAAA/////wAAAAP////8AAAAB/////AAAAAf////wAAAAD////8AAAAA/////AAAAAH////wAAAAA////8AAAAAH////AAAAAA////wAAAAAAf//4AAAAAAD//8AAAAAAAf//AAAAAAAD//4AAAAAAA//+AAAAAAAP//gAAAAAAB//4AAAAAAAf/+AAAAAAAH//gAAAAAAA//4AAAAAAAP/+AAAAAAAB//gAAAAAAAP/4AAAAAAAB/wAAAAAAAAH4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"catharus-guttatus":{"w":93,"h":55,"bits":"/////gAAAAAAAAAH/////AAAAAAAAAA/////8AAAAAAAAAH/////wAAAAAAAAA/////+AAAAAAAAAH/////4AAAAAAAAA//////gAAAAAAAAH/////+AAAAAAAAAP/////4AAAAAAAAAf/////gAAAAAAAAB//////AAAAAAAAAP/////+AAAAAAAAA//////8AAAAAAAAH//////4AAAAAAAA///////wAAAAAAAD///////AAAAAAAAf//////8AAAAAAAD///////4AAAAAAAf///////gAAAAAAD///////+AAAAAAA////////4AAAAAAH////////wAAAAAA/////////AAAAAAH////////+AAAAAA/////////4AAAAAH/////////gAAAAA/////////+AAAAAH/////////4AAAAA//////////gAAAAH/////////+AAAAA//////////4AAAAH//////////gAAAA///////////AAAAH//////////8AAAAf//////////wAAAD///////////gAAAf//////////+AAAD///////////8AAAP///////////4AAB////////////wAAH////////////gAA/////////////AAD////////////+AAf////////////8AB/////////////4AH/////////////AAf////////////4AB/////////////AAH///////8////4AAf//////4AA///AAA//////8AAA//4AAD//////AAAB//AAAH/////gAAAD/4AAAf////wAAAAH/AAAAf///8AAAAAAAA=="},"catharus-ustulatus":{"w":93,"h":68,"bits":"AAAAAAD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAD4AAAf/gAAAAAAAAAAAAf//gAAAAAAAAAAAP//+AAAAAAAAAAAH///8AAAAAAAAAAB/////AAAAAAAAAA/////+AAAAAAAAAP/////wAAAAAAAAH/////+AAAAAAAAD//////wAAAAAAAB//////+AAAAAAAAf//////wAAAAAAAP//////4AAAAAAAD//////wAAAAAAAB//////8AAAAAAAAf//////AAAAAAAAH//////wAAAAAAAB//////+AAAAAAAAf//////gAAAAAAAP//////8AAAAAAAH///////AAAAAAAB///////4AAAAAAA////////AAAAAAAP///////4AAAAAAD////////AAAAAAA////////wAAAAAAP///////+AAAAAAD////////wAAAAAA////////+AAAAAAH////////gAAAAAB////////8AAAAAAf////////AAAAAAH////////4AAAAAB////////+AAAAAA/////////wAAAAAP////////8AAAAAH/////////AAAAAD/////////wAAAAA/////////8AAAAAP////////+AAAAAB/////////gAAAAAP////////wAAAHAB////////8AAAA4AP///////+AAAAHAB///////+AAAAA4Af//////+AAAAAHAH///////8AAAAAAD////B////4AAAAA////AP////8AAAAP//+AA/////wAAAD///gAH////+AAAA///wAAf////wAAAP//8AAB////+AAAD///AAAH////wAAAf//wAAAP///+AAAH//4AAAA///4AAAA//+AAAAD///4AAAH//gAAAB////AAAA//wAAAAf///4AAAH/8AAAAD////AAAAf/AAAAAf///4AAAD/wAAAAD////AAAAf4AAAAAf///4AAAB8AAAAAAf//wAAAAAAAAAAAB//8AAAAAAAAAAAAAB/gAAAAAAAAAAAAAD8AAAAA="},"catherpes-mexicanus":{"w":53,"h":93,"bits":"AAAAAAAH+AAAAAAAf8AAAAAAB/4AAAAAAH/wAAAAAAf/gAAAAAB//AAAAAAH/8AAAAAAf/wAAAAAA//AAAAAAH/8AAAAAAf/4AAAAAH//gAAAAA///AAAAAD//+AAAAAP//8AAAAB///8AAAAD///4AAAAP///4AAAA////wAAAD////gAAAH////gAAAf////AAAB////+AAAD////+AAAP///38AAAf///v4AAB////fwAAD/////gAAP/////AAAf////+AAB/////8AAD/////4AAP///8P4AA////4fwAD////4/gAH////x/AAf////h+AB/////j8AD/////H4AP////+PwAf////8fgB/////4/AD/////x+AP/////j8A//////H4B/////+PwH/////8/gP/////5/A//////z+B//////v8H//////f4P///////wf///////h////////D///////+H///////8f///////w////////h///////+D///////8P///////wf///////g///////+D///////4H///////gP//////+Af//////4A///////gB//////+AD//////wAH/////8AAP/////gAAf///gAAAA///8AAAAD///gAAAAH//+AAAAAP//wAAAAAf//gAAAAA//+AAAAAB//8AAAAAD//wAAAAAH//gAAAAAP//AAAAAAf/8AAAAAA//4AAAAAB//gAAAAAD//AAAAAAH/+AAAAAAP/4AAAAAAf/wAAAAAA//AAAAAAA/+AAAAAAA/4AAAAAAAA="},"certhia-americana":{"w":33,"h":93,"bits":"4AAAAHAAAB84AAAPgAAAB8AAAAPgAAAB8AAAAAAAAAAAAAAAAAAAD8AAAA/gAAAP8AAAD/gAAA/8AAAP/gAAH/4A4D/+AHA//wA4f/8AHH//gA5//+AAP//4AD///AA///8Af///wD////A////8H////w////+H////4/////B////4P////h////8P////h////8P////g////+H////w/////H////4/////H////4/////H////4////+H////g////8H////g////8D////gf///8D////Af///4D///+Af///wD///8Af///gB///4AP///wB///+B////3P//++5///33P//8A5///gHA//4AAH//AAA//wAAH/+AAAP/wAAH/8AAA//gAAH/4AAA//AAAH/4AAAP/AAAB/4AAAP/AAAA/4AAA//AB4H/4APA//AB4H/4APA//AB4A/wAA4H+AAHA/gAA4D4AAHAAD4A4AAfAAAAD4AAAAfAA"},"chaetura-vauxi":{"w":93,"h":62,"bits":"AAAAAAAAAAAAAAAA+AAAAAAAAAAB8AAH8AAAAAAAAAAP74A/gAAAAAAAAAB/fAH8AAAAAAAAAAP74A/gAAAAAAAAAB/fAB8AAAAAAAAAAD74AAAAAAAAAB8AAfAAAAAAAAAAAPgAAAAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAB8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA///4AAAAAAAAAA/////AAAAAAAB///////4AAAAAAA////////AAAAAAAP///////4AAAAAAD////////AAAAAAA////////AAAAAAAH//////8AAAAAAAA//////wAAAAAAAAH//////wAAAAAAAA/////////AAAAAAD////////4AAAAAAH////////AAAAAAAf///////4AAAAAAB////////AAAAAAAP///////wAAAAAAB///////4AAAAAAAP///////gAAAAAAAP//////8AAAAAAAAH//////h8AAAAAAAf//4H/8PgAAAAAAD///gD/h8AAAAAAAf//+AAAPgAAAAAAAf//4AAB8AAAAAAAA///gAAAAAAAAAAAD//+AAAAAAAAAAAAP//4AAAAAAAAAAAAf//gAAAAAAAAAAAB//+AAAAAAAAAAAAD//4AAAAAAAAHwAAP//gAP/AAAAA+AAAf//AB/8AAAAHwAAB//8AP/gAAAA+AAAD//gB/8AAAAHwAAAH/8Af/gAAAAAAAAAP/gD/8AAAAAAAAAAf8Af/gAAAH4AAAAA/gD/8AAAA/AAAAAAAAf/gAAAH4AAAAAAAD/8AAAA/AAAAAAAAP/gAAAH4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"charadrius-vociferus":{"w":93,"h":68,"bits":"+//////+A+/wAAB////////8P3+AAf/////////j//wAD//f//////8f//wAf/7///////7///D///f//////////4f//7///////////f///f//////////7///7///////////f//////////////H///H//////////w///4//////////+P///H//////////////4///////////////H//////////////4///////////////H//////////////4///////f//5////H//////7///P///4//////8f//9////H//////n///////4//////8///+////H/////4P///3///4/////8H////////H/////n//////7/4/////////+D//f/H/////////A//z/4/////////4///f/B///n/////H////4f/+A/////4/////D//w//////H////4f/+f/////7/////D/w///////f////4f////////7/////D////////+f////4f//////////////D//////////////4f//////////////D//////////////4f//////////////D//////////////4f//////////////D//////////////4f//////////////D//////////////4P//////////////D//////////////4f//////z///////D//////4f//////4///////D///////H//////4f//////4///////D///////H//////4f//////4//+////j///////B//////8f//////4P//////3///////A//////+///////4H//////3///////A//////+//////+AD/+P///3////+fwAf/5///+f////7+AD//P/7/z/////fAAf/5//A+f////4AAD//P/4AB/////AAAP/7//AA/////4AAB////4AH////8A+AP///8AA/////gHwB////gAH////4A+A="},"chondestes-grammacus":{"w":93,"h":93,"bits":"AAAAAAAf8AAAAAAAAAAAAAD/gHwAAAAAAAAAAAf8A+AAAAAAAAAAAAPgHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAfHwAAAAAAAAAAAAD4AAAAAAAAAAAA+AfAAAAAAAAAAAAHwD4AAAAAAAAAAAA+AfAAfgAAPgAAAAHwD4AD8AD58AAAAA+AAAAfgAfPgAAAAAAAAAD8AD58AAAAAAAAAAfgAfPgAPgAAAAAAAAAD4AAB8AAAAPgAAAAfAAAPgAAAB8AAAAAAAAB8AAAAPgAAAAAAAAPgAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAAAB/8AAAAAAAAAAAAA//8AAAAAAAAAAAAP//wAAAAAAAAAAAH///AAAAAAAB+AAB///+AAA/gAAPwAAf///8AAH8AAB+AHz////wA//gAAPwA+////+AH/8AAB+Af/////wD//gAAAAD/////+Af4AAAAAAf/////wD/AAAAAAD/////+AfAAAAAAAf/////AD4AAfAAAD/////gAAAAD4AAB/////4AAA+AfAAA/////+AAAHwD4AAP/////gAAA+AfAAH/////8AAAHwAAAD//////AAAA+AAAAf/////4AAAHwAAAP//////AAAAAAAAD//////4AAAAAAAB///////AAB8AAAAf//////4AAPg+AAH///////AAB8HwAB///////4AAPg+AAf//////+AAB8HwAH///////wAAAA+AB///////+AAAAAAAP///////gAAD4AAD///////8AAA/AAA////////AAAH4AAf///////4AAA/AAH///////+AAAH4AB////////j4AA/AAf///////8fAAAAAD/////+//D4AD8AAf///////4fAAfgAP////////D4AD8AH////////4AAAfgB/////////AAAD8A////////74AAAAAP///////8AAAAAAH////////gAAAAAB////////8AAAAAA////AD////AAAAAP//8AAf////AAAAD///AAB////+AAAA///gAAH////wAAAH//4AAA////+AAAA//8AAAH////wAAAH//AAAD////+AAAA//gAAAf////wAAA//4AAAD////gAAAH/+AAAAfAffAAAAA//AAAAD4D4AAAAAH/wAAAAAAfAAAAAA++AAAAAAD74AAAAAHwAAAAAAffAAAAAA+AAAAAAAD4D4AAAHwAAAAAAAfAfAAAAAAAHwAAAD4D4AA4AAAA+AAAAAAfAAHAAAAHwAAAAAD4AA4AAAA+B8AAAAAAAHAAAAHwPgAAAAAAA4AAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"chordeiles-minor":{"w":93,"h":53,"bits":"/gAAAAAAAAAAAAD/8AAAAAAAAAAAAAf/gAAAAAAAAAAPgD/4AAAAAAAAAAB8Af+AAAAAAAAAAAPgAHAAAAAAfgAAAB8AAAAAAAAD8AAAAPgAAAAAAAAfgAAAB8AAAAAAAAD8AAf/AAAAAAAAAAfgAP/+AAAAAAAAAAAAH//8AAAAAAAAAAAB///wAAAAAAAAAAAf///AAAAAAAAAAAP///8AAAAAAAAAAH////gAAD/gAAAAH////8AAAf/gAAAf/////gAAD//wAA//////8AAAf//8Af//////AAAD///////////gAAAf//////////8AAAB///////////gAAAH//////////8AAAP///////////gAAB///////////8AAAP///////////gAAB///////////8AAAP///////////gAAB///////////8AAAA///////////gAAAD//////////8AAAAP//////////gAAAAf/////////4AAAAA//////////AAAAAA/////////wAAAAAA////////8AAAAAAAf///////AAAAAAAAH//////wAAAAAfgAB/////8AAAAAD8AAA/////AAAAAAfgAAAD///gAAAAAD8AAHwAAPgAAAAAAfgAA+AAAAAAAAAAD4AAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"cinclus-mexicanus":{"w":93,"h":77,"bits":"4AAAAAAAAAAAAAAHAAP/gAAAAAAAAAA4AH//gAAAAAAAAAAAB//+AAAAAAAHwAAAf//4AAAAH4A+AAAH///gAAAA/AHwAH////+AAAAH4A+AB/////4AAAA/AHwAP/////gAAAH4A+AB/////8AAAAAAAAAP/////wAAAAAAAAB//////AAAAAAAAAH//////gAAAAAAAAH//////8AAAAAAAA///////8AAD4AAAH///////8AAfAAAA////////4AD4AAAH////////wAfAAAAB////////AD4AAAAP///////+AAAAAAB////////8AAAAAAf////////wAAAAAD/////////AAAAAAf////////+AAAAAD/////////4AAAAAf/////////gAAAAD//////////AAAAA//////////8AAAAH//////////gAAAA//////////+AAAAH//////////4AAAA///////////gAAAH//////////+AAAAf//////////4AAAD///////////gAAAf///////////AAAD///////////8AAAf///////////wAAD////////////gAAP////////////gAB/////////////AAH////////////+AA/////////////4AD/////////////AAf////////////4AB/////////////AAH////////////4AAf////////////AAB////////////4AAP///////////+AAA//////////+AAAAD/////////8AAAAAP////////8AAAAAA////////4AAAAAAD///////4AAAAfAAP//////+AAAAD4AA///////AAAAAfAAD//////gAAAAD4AAH/////wAAAAAfAAAP////wAAAAAAfAAA/////AAAAAAD/gAA////4AAAAAAf8AAB//+fAAAAAAD/g+AP//z4AAAAAAf8HwB//+fAAAAAAD/g+A///z4AAAAAAAAHwH//+AAAAAAAAAA+D///AAAAAAAAAAAB///4AAAAAAAAAAB////AAAAAAAAAAAP///wAAAAAAAAAAB///4AAAAAAAAAAAP//wAAAAAAAAAAAB//4AAAAAAAAAAAAP/8AAAAAAAAAAAAA/+AAAAAAAAAAAAAB/AAAAAAAAAAA="},"circus-hudsonius":{"w":62,"h":93,"bits":"4AAAAAAAAAOAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8AAAAAAAAAfAf/gAAAAAHwf/8AAAAAB8P//gAAAAAfD//8AAAAAAA///gAAAAAAP//4AAAAAB////AAAAAAf///wAAAAAH///8AAAAAD////AAAAAA////wAAAAAP///+AAAAAD////gAAAAP////8AAAAD4f///gAAAA+H///8AAAAP/////gAAAD/////8AAAAB/////gAAAB/////8AAAAf/////AAAAH/////4AAAB//////AAAAf/////wAAAH/////+AAAB//////wAAAA/////8AAAAP/////AAAAD/////4AAAAf////+AAAAH/////wAAAP/////8AAAD//////gAAD//////4AAA///////AAAP//////wAAD//////8AAA///////gAAf//////4AAH//////+AAB///////wAAf//////8AAH///////AAB///////4AAf//////+AAH///////gAB///////8AAH///////AAAf//////wAAH//////8AAB///////AAAf+P////wAAH/h////8AAA/wP///+AAAP8D////gAAA/Af///4AAAPgD///+AAAAAAB///gAAAAAAP//8AAAAAAB///AAAAAAAf//4AAAAAAD///AAAAAAAf//4AAAAAAH//+AAAAAAA///wAAAAAAP//+AAAAAAB///wAAAAAAf//8AAAAAAD///gAAAAAA///4AAAAAAH//+AAAAAAB///gAAAAAAf//4AAAAAAD//+AAAAAAA///gAAAAAAH//wAAAAAAB//wAAAAAAAf/wAAAAAAAD/8AAAAAAAA//AAAAAAAAH/wAAAAAAAB/8AAAAAAAAP+AAAAAAAAA/gAAAAAAAAAAAAAAAAAAAAAA=="},"cistothorus-palustris":{"w":72,"h":93,"bits":"AAAAAAAAAA//AAAAAAAAAB//AAAAAAAAAD//AAAAAAAAAD//AAAAAAAAAD//AAAAAAAAAH//AAAAAAAAAH//AAAAAAAAAP//AAAAAAAAAP//AAAAAAAAAf//AAAAAAAAAf//AAAAAAAAAf//AAAAAAAAAf//AAAAAAAAAf//AAAAAAAAA///AAAAAAAAA///AAAAAAAAB///AAAAAAAAB///AAAAAAAAB///AAAAAAAAB///AAAAAAAAD///AAP8AAAAD///AD//4AAAD//+AP//+AAAD//+/////gAAH//+/////wAAH//8/////4AAH//8/////8AAP//8/////8AAP//8/////+AAP//4//////AAf//4//////AAf//4H/////gAf//4B/////gA///wA/////wA///wA/////wB///wA/////4B///wA/////4B///gAf////8D///gAf////+D///gAf/////P///gAP/////////gAP/////////gAP/////////gAP/////////gAP/////////wAP/////////4AP/////////4AP/////////4AP/////////4AP/////////4AP/////////4AP/////////4AP/////////4AP/////////wAH/////////wAH/////////gAH/////////gAH/////////AAH////////+AAD////////+AAD////////+AAB/////////AAB/////////gAA/////////gAA/////////gAAf////////gAAf////////gAAP////////gAAP////////gAAH////////gAAH///////4AAAH///////gAAAH///////AAAAH//////+AAAAH//////8AAAAH//////4AAAAD//////wAAAAB8/////gAAAAAAP///+AAAAAAAD///8AAAAAAAA///4AAAAAAAAD//4AAAAAAAAAf/4AAAAAAAAAP/4AAAAAAAAAH/wAAAAAAAAAH/wAAAAAAAAAH/wAAAAAAAAAP/gAAAAAAAAAP/gAAAAAAAAAf/AAAAAAAAAAf+AAAAAAAAAAf8AAAA"},"coccothraustes-vespertinus":{"w":93,"h":77,"bits":"4AAAAAAAAAAAAAAHAAPgAAAAAAAAAAA4Af/4AAAAAAAAAAAAP//wAAAAAAAAAAAD///gAAAAAAAAAAA////AAAAAAAAAAAP///8AAAAAAAAAAD////gAAAAAAAAAA////+AAAAAAAAAAP////4AAAAAAAAAB/////gAAAAAAAAAf////+AAAAAAAAAH/////wAAAAAAAAB//////AAAAAAAAAf/////+AAAAAAAAH//////8AAAAAAAA///////wAAAAAAAH///////gAAAAAAA////////AAAAAAAH///////8AAAAAAA////////4AAAAAAH////////gAAAAAA/////////AAAAAAA////////8AAAAAAAf///////wAAAAAAD////////AAAAAAAP///////8AAAAAAA////////4AAAAAAH////////gAAAAAAf///////+AAAAAAD////////4AAAAAAP////////gAAAAAB////////+AAAAAAP////////4AAAAAB/////////gAAAAAP////////+AAAAAB/////////4AAAAAH/////////gAAAAA/////////8AAAAAD/////////wAAAAAf/////////AAAAAB/////////8AAAAAH/////////gAAAAA/////////+AAAAAD/////////4AAAAAP/////////AAAAAA/////////4AAAAAH/////////gAAAAAf////////+AAAAAB/////////wAAAAAH/////////AAAAAAf////////8AAAAAB/////////gAAAAAH////////+AAAAAAf////////4AAAAAB/////////gAAAAAD////////+AAAAAAH////////4AAAAAAP////////gAAAAAAf///////+AAAAAAD////////4AAAAAA////+////gAAAAAH///8A///+AAAAAA//8AAA///4AAAAAH//gAAB///gAAAAA//8AAAD//8AAAAAH//gAAAH//wAAAAA//8AAAAf//AAAAAH4fgAAAB//4AAAAAAAAAAAAH//AAAAAAAAAAAAAf/4AAAAAAAAAAAAA//AAAAAAAAAAAAAD/4AAAAAAAAAAAAAP/AB+AAAAAAAAAAA/4APwAAAAAAAAAAD/AB+AAAAAAAAAAAP4A="},"colaptes-auratus":{"w":93,"h":93,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/gAAAAAAAAAAAAH//gAAAAAAAAAAAB/////AAAAAAAAAAf////4AAAAAAAAAH/////AAAAAAAAAB/////4AAAAAAAAAP/////AAAAAAAAAD/////4AAAAAAAAAf////4AAAAAAAAAD////8AAAAAAAAAAf///8AAAAAAAAAAH////AAAAAAAAAAA////wAAAAAAAAAAH///8AAAAAAAAAAA////AAAAAAAAAAAP///wAAAAAAAAAAB///+AAAAAAAAAAAf///gAAAAAAAAAAP///8AAAAAAAAAAH////gAAAAAAAAAB////8AAAAAAAAAA/////gAAAAAAAAAP////8AAAAAAAAAD/////wAAAAAAAAA/////+AAAAAAAAAP/////wAAAAAAAAD/////+AAAAAAAAA//////wAAAAAAAAH/////+AAAAAAAAB//////wAAAAAAAAf/////+AAAAAAAAH//////wAAAAAAAB//////+AAAAAAAAf//////wAAAAAAAH//////+AAAAAAAB///////wAAAAAAAf//////+AAAAAAAD///////gAAAAAAA///////8AAAAAAAP///////AAAAAAAB///////4AAAAAAAf//////+AAAAAAAH///////wAAAAAAA///////8AAAAAAAP///////AAAAAAAB///////wAAAAAAAf//////+AAAAAAAD///////gAAAAAAA///////4AAAAAAAH//////+AAAAAAAA///////gAAAAAAAH//////4AAAAAAAA//////+AAAAAAAAH//////AAAAAAAAA//////wAAAAAAAAP/////4AAAAAAAAB/////+AAAAAAAAAf/////AAAAAAAAAD/////x8AAAAAAAA/////8PgAAAAAAAH///j+B8AAAAAAAB///wAAPgAAAAAAAf//8AAB8AAAAAAAD///AAAAAAAAAAAA///gAAAAAAAAAAAH//4AAAAAAAAAAAA//+AAAAAAAAAAAAH//AAAAAAAAAAAAB//wAAAAAAAAAAAAP/4AAAAAAAAAAAAD/+AAAAAAAAAAAAAf/gAAAAAAAAHwAAH/8AAAAAAAAf+AAA//AAAAAAAAD/wAAP/4AAAAAAAAf+AAD/+AAAAAAAAD/wAA//wAAAAAAAAfAAAH/8AAAAAAAAAAAAB//AAAAAAAAAAAAAf/4AAAAAAAAAAAAD/+AAAAAAAAAAAAAf/gAAAAAAAAAAAAD/wAAAAAAAAAAPgAf+AAAAAAAAAAB8AB/gAAAAAAAAAAPgAP4AAAAAAAAAAB8AAAAAAAAAAAAAAPgAA="},"columba-livia":{"w":93,"h":54,"bits":"P//4AAAAAAAAAAAD///wAAAAAAAAAAAf///AAAAAAAAAAAD///8AAAAAAAAAAAf///wAAAAAAAAAAH////AAAAAAAAAAA////+AAAAAAAAAAH////4AAAAAAAAAA/////+AAAAAAAAAH///////gAAAAAAA////////wAAAAAAH////////wAAAAAA/////////4AAAAAH/////////4AAAAA4/////////8AAAAAD/////h///8AAAAAf////8B///8AAAAB/////AP///4AAAAP////4H////gAAAA////+A////8AAAAH////gH////4AAAAf///4A/////wAAAD///8AH/////wAAAP//+AA//////AAAB///gAB//////AAAH//4AAD//////AAA//+AAAf/////+AAD//gAAH//////8AAf/8AAA///////wAD//AAAP//////+AAP/4AAB///////wAB//AAAP//////+AAH/8AAD///////wAA//gAA///////+AAD/+AAH/////+AAAAf/4AA//////+AAAB//gAf//////+AAAP/+AD///////4AAA//4B////////AAAD//wf///////4AAAf///////////gAAB///////////+AAAH///////////4AAAf///////////AAAA///////////4AAAD///////////AAAAH//////////4AAAAH//////////AAAAAP///4B////4AAAAAP//4AD////AAAAAAP/4AAH///4AAAAAB/+AAAf///AAAAAAH/gAAA///4AAAAAAAAAAAB///A=="},"columbina-passerina":{"w":93,"h":93,"bits":"AAAAAPgAAAAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAB8AAAAAB8A+AAAAAPgAAD/8PgHwAAPgAAAAB//58A+AAB8AAAAA///vgHwAAPgAAAAP///8A/AAB8AAAAD///4AA4AAPgAAB8f///AAHAPgAAAAPn///8AA4B8AAAAB8////gAHAPgAAAAPv///8B84B8AAAAB/////wPgfvgAAAAA/////B8D8AAAAAAf////8PgfgAfAAAP/////h8D8AD4AAH//////wAfgAfAAD//////+AD8AD4AA///////wAfAAfAAf//////+AAAAAAAH///////wAAAAAAB///////8B4AAAAA///////wAPAAAAAP///////AB4AAAAD///////4APAAAAA////////AB4AAAAP///////4AAAAAAB////////AAAAAAAf///////4AAAAAAH////////gAAAAAA////////8+AAAAA/////////nwAAAAP////////8+AAAAB/////////nwB8AAP////////8+APgAB/////////gAB8AAP////////8AAPgAD/////////gAB8AAf////////8AAAAAD/////////gAAAAA/////////8APAAAH/////////AP4AAA/////////4B/AAAP/////////AP4AAB/////////wB/AAAP////////+APwAAB/////////gAAAAAf////////8AAAAAH//////////AAAAB//////////4AA+Af//////////AAHwH//////////4AA+A///////////AAHwH/////////gAAA+A/////////8AAAAAH/////////gAAD4A/////////8AAAfAH/////////gAAD4Af///////74AAAfAD///////+AAAAD4P////////gAAAAAB////////wAAAAAAP////////wAAAAAB9////////gAAAAAPh///////8AAAAAAAf///////gAAAAAAD///////8AAAAAAAf///////gAAAAAAH///////8AB8AAAA///f///+AAPwAAAP//j+AH/wAB+AB8///4fwAAAAAPwHfn///D+AAAAAB+A78////vwAAAAAPwHfn///8AAAAAAB8A78///vgAAAAAAAAHfB//98AAAAAAAAAAAP//PgAAAAAAAAAAB///wAAAAAAAAA8AP//+AAAAAAAAAHgB//vwAAAD4AAAA8AP/5+AAAAfAAAAHgB/+PwAAAD4AAAA8AP/h8AAAAfAAAAHgB/wPgAAAD4AAAAAAHwAAAAAAAAD8AAAAAAAAAAAAAAfgAAAAAAAAAAAAAD8AAfAAAAAAAAAAAfgAD4AHwAAAAAB8D8AAfAA+AAAAAAPgfgAD4AHwAAAAAB8AAAAA="},"contopus-sordidulus":{"w":93,"h":83,"bits":"AAAAAAAAAB///+AAAAAAAAAAA////4AAAAAAAAAAP////gAAAAAAAAAD////+AAAAAAAAAA/////4AAAAAAAAAP/////gAAAAAAAAD/////+AAAAAAAAA//////8AAAAAAAAH//////4AAAAAAAB///////AAAAAAAAf//////4AAAAAAAD///////AAAAAAAA///////4AAAAAAAP///////AAAAAAAD///////4AAAAAAB////////AAAAAAAf///////4AAAAAAP///////wAAAAAAD///////+AAAAAAA////////gAAAAAAP///////4AAAAAAD///////8AAAAAAA////////AAAAAAAP///////4AAAAAAD///////+AAAAAAA////////wAAAAAAP///////8AAAAAAD////////gAAAAAA////////8AAAAAAH////////gAAAAAB////////8AAAAAAf////////gAAAAAP////////8AAAAAB/////////gAAAAAf////////8AAAAAH/////////gAAAAA/////////8AAAAAP/////////AAAAAD/////////4AAAAA//////////AAAAAH/////////wAAAAB/////////+AAAAAf/////////wAAAAD/////////8AAAAA//////////AAAAAH/////////4AAAAB/////////+AAAAAP/////////wAAAAB/////////8AAAAAP/////////AAAAAD/////////4AAAAA/////////+AAAAAP/////////gAAAAB/////////4AAAAAf////////+AAAAAH/////////gAAAAB/////////4AAAAAf////////+AAAAAD/////////gAAAAAf////////4AAAAAD////////8AAAAAAf////////AAAAAAH////////gAAAAAA////////wAAAAAAP///////gAAAAAAD////D//gAAAAAAA////gAAAAAAAAAAP///wAAAAAAAAAAD///gAAAAAAAAAAA///4AAAAAAAAAAAH//+AAAAAAAAAAAB///gAAAAAAAAAAAf//4AAAAAAAAAAAH//+AAAAAAAAAAAA///gAAAAAAAAAAAH//8AAAAAAAAAAAA///AAAAAAAAAAAAH//wAAAAAAAAAAAA//8AAAAAAAAAAAAH//AAAAAAAAAAAAA//wAAAAAAAAAAAAH/8AAAAAAAAAAAAA//gAAAAAAAAAAAAA="},"coragyps-atratus":{"w":93,"h":92,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/4AfAAAAAAAAAAAP/wD4AAAAAAAAAAD//AfAAAAAAAAAAA//8D4AAAAAAAAAAH//wfAAAAAAAAAAB///gAAAAAAAAAAAP//+AAAAAAAAAAAB///8AAAAAAAAAAAf///gAAAAAAAAAAH///+AAAAAAAAAAB////wAAAAAAAAAAf///+AAAAAAAAAAD////wAAAAAAAAAAf///+AAAAAAAAAAH////wAAAAAAAAAA////+AAAAAAAAAAf////gAAAAAAAAAP///8AAAAAAAAAAH////gAAAAAAAAAB////8AAAAAAAAAAf////gAAAAAAAAAP////8AAAAAAAAAH/////gAAAAAAAAB/////8AAAAAAAAAf/////gAAAAAAAAP/////4AAAAAAAAD//////AAAAAAAAA//////wAAAAAAAAP/////8AAAAAAAAB//////gAAAAAAAAf/////8AAAAAAAAH//////wAAAAAAAB//////+AAAAAAAAf//////wAAAAAAAD//////+AAAAAAAA///////wAAAAAAAH//////+AAAAAAAB///////gAAAAAAAP//////8AAAAAAAD///////gAAAAAAA///////8AAAAAAAH///////gAAAAAAB///////4AAAAAAAP//////+AAAAAAAD///////wAAAAAAAf//////8AAAAAAAD///////AAAAAAAAf//////4AAAAAAAD//////+AAAAAAAA///////wAAAAAAAH//////8AAAAAAAB///////gAAAAAAAP//////4AAAAAAAD//////+AAAAAAAAf//////gAAAAAAAD//////4AAAAAAAAf/////+AAAAAAAAD//////gAAAAAAAAf/////8AAAAAAAAD//////gAAAAAAAAf/////4AAAAAAAAB//////AAAAAAAAAf/////wAAAAAAAAH/////+AAAAAAAAB//////gAAAAAAAAP/////8AAAAAAAAD//////gAAAAAAAAf/////8AAAAAAAAD///+///gAAAAAAAf///H///AAAAAAAD///w///+AAAAAAAf//8P///wAAAAAAD///B///+AAAAAAAf//4P///wAAAAAAD//+B///+AAAAAAAf//wP///wAAAAAAD//+B///+AAAAAAAf//gP///wAAAAAAD//8B///+AAAAAAAA//AAA/8AAAAAAAAAAAAAA/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"corvus-brachyrhynchos":{"w":93,"h":83,"bits":"P////4AAAAAAAAAH/////gAAAAAAAAA/////+AAAAAAAAAH/////4AAAAAAAAA//////gAAAAAAAAH/////8AAAAAAAAA//////wAAAAAAAAH//////AAAAAAAAA//////4AAAAAAAAH//////gAAAAAAAAH/////8AAAAAAAAAB/////wAAAAAAAAAH////+AAAAAAAAAAf////4AAAAAAAAAB/////AAAAAAAAAAH////4AAAAAAAAAA/////gAAAAAAAAAH////8AAAAAAAAAA/////wAAAAAAAAAH/////AAAAAAAAAA/////8AAAAAAAAAH/////wAAAAAAAAB//////AAAAAAAAAP/////8AAAAAAAAB//////wAAAAAAAAf//////gAAAAAAAD//////+AAAAAAAAf//////4AAAAAAAD///////gAAAAAAAf//////+AAAAAAAD///////4AAAAAAAf///////gAAAAAAD///////8AAAAAAAf///////wAAAAAAD////////AAAAAAAf///////8AAAAAAD////////wAAAAAAf////////AAAAAAD////////8AAAAAAf////////wAAAAAD/////////AAAAAAP////////8AAAAAB/////////wAAAAAP/////////AAAAAB/////////8AAAAAH/////////wAAAAA//////////AAAAAD/////////8AAAAAP/////////wAAAAB/////////+AAAAAH/////////wAAAAA//////////AAAAAD/////////8AAAAAf/////////wAAAAB//////////AAAAAP/////////8AAAAA//////////wAAAAH//////////gAAAAf//////////AAAAD//////////+AAAAP//////////4AAAA///////////gAAAH//////////+AAAAf//////////4AAAB///////////AAAAP//////////8AAAA///////////wAAAD///////////AAAAH//////////4AAAAf////3/////AAAAB//f/8f////4AAAAP/x//B/////AAAAB/+P/wD////4AAAAf/B/+AP////AAAAH/4P/wA////4AAAB/+B/8AD////AAAAP/gP/AAH///4AAAD/4B/wAAP///AAAAf/Af+AAAD/8AAAAD/wD/gAAAAAAAAAAf8Af8AAAAAAAAAAD/AD/AAAAAAAAAAAf4Af4AAAAAAA="},"corvus-corax":{"w":57,"h":93,"bits":"AAH8AAAAAAAB/8AAAAAAAP/gAAAAAAD/8AAAAAAAf/8AAAAAA///gAAAAAH//8AAAAAB///gAAAAAP//8AAAAAB///gAAAAAf//+AAAAAD///wAAAAAf//+AAAAAD///wAAAAAf//+AAAAAD///4AAAAA////AAAAAH///4AAAAA////AAAAAH///8AAAAA////gAAAAH///8AAAAA////wAAAAH////AAAAA////4AAAAH////AAAAA////4AAAAH////wAAAA/////AAAAH////4AAAA/////gAAAH////8AAAA/////gAAAH////8AAAA/////gP+AD////+H/4Af////x//gB////+//+AH///////4Af///////AD///////4Af///////AD///////4D////////B////////4/////////P//////////////////////////////////////////////n//////+AA///////AAH//////4AA///////AAH//////4AAAB/////AAAAB////4AAAAP////AAAAD////4AAAAf////AAAAD////4AAAAf////AAAAD////4AAAAf////AAAAD////4AAAAf///+AAAAD////wAAAAP///+AAAAB////wAAAAH////AAAAA////4AAAAD////AAAAAf///8AAAAD////gAAAAP///8AAAAB////wAAAAH///+AAAAA////wAAAAD///+AAAAAf///wAAAAB///+AAAAAH///wAAAAA////AAAAAD///8AAAAAP///gAAAAA///8AAAAAD///gAAAAAP//8AAAAAA///gAAAAAA//8AAAAAAB/+AAAAAAAH/wAA"},"cyanocitta-stelleri":{"w":60,"h":93,"bits":"AAAAAf+AAAAAAAAf/AAAAAAAAf/gAAAAAAA//4AAAAAAA//8AAAAAAA///AAAAAAA///gAAAAAA///wAAAAAA///4AAAAAA///8AAAAAA///+AAAAAA////AAAAAAf///AAAAAAH///wAAAAAP///+AAAAAP////AAAAAP////AAAAAf////AAAAAf////AAAAA/////AAAAA/////AAAAB/////AAAAB/////AAAAB////gAAAAB////AAAAAD///+AAAAAD///8AAAAAD///8AAAAAH///8AAAAAH///8AAAAAP///8AAAAAf///8AAAAA////+AAAAB////+AAAAD////+AAAAD////+AAAAH////+AAAAP////+AAAAP////+AAAAf////+AAAAf////+AAAA/////+AAAA/////+AAAB/////+AAAD/////+AAAD/////+AAAH/////+AAAP/////+AAAP/////8AAAf/////8AAAf/////8AAAf/////4AAA//////4AAA//////4AAB//////wAAB//////wAAB//////gAAB////9/gAAB////5/gAAD////z/AAAD////n/AAAH////v+AAAH////v+AAAP/////8AAAP/////4AAAf/////4AAAf/////wAAAf/////gAAAf/////AAAAf/////AAAAf////+AAAA/////+AAAB///4f+AAAB///gf8AAAD//+AP8AAAH//+AAAAAAH//8AAAAAAP//8AAAAAAf//4AAAAAA///4AAAAAA///wAAAAAA///wAAAAAA///wAAAAAA///gAAAAAA///gAAAAAA///AAAAAAA///AAAAAAA///AAAAAAA//+AAAAAAA//+AAAAAAA//8AAAAAAA//4AAAAAAA//wAAAAAAAA="},"cygnus-buccinator":{"w":93,"h":61,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAP4AAAAAAAAAAAAAD/AAAAAAAAAAAAAA/+AAAAAAAAAAAAAP/wAAAAAAAAAAAAD/+AAAAAAAAAAAAAf/wAAAAAAAAAAAAH/+AAAAAAAAAAH/h//wAAAAAAAAAB/+f/+AAAAAAAAAAf////wAAAAAAAAAH////+AAAAAAAAAB/////wAAAAAAAAA//////4AAAAAAAAH////////+AAAAAA/////////wAAAAAH/////////AAAAAA/////////4AAAAAH8P///////AAAAAAAB///////4AAAAAAAf///////AAAAAAAH///////4AAAAAAB///////+AAAAAAAf///////wAAAAAAH///////4AAAAAAB////////AAAAAAAP///////gAAAAAAD///////4AAAAAAAf//////8AAAAAAH3//////8AAAAAAA+//////8AAAAAAAH3/////8AAAAAAAA+//////AAAAAAAAH3/////4AAAAAAAAA//////AAAAAAAAAH/////4AAAAAAAAAf////+AAAAAAAAAD/////wAAAAAAAAAf////8AAAAAAAAAB/////gAAAAAAAAAH////4AAAAAAAAAAf////AAAAAAAAAAB////wAAAAAAAAAAH////AAAAAAAAAAAf///+AAAAAAAAAAD////4AAAAAAAAAAP////wAAAAAAAAAA////+AAAAAAAAAAD////wAAAAAAAAAAH///+AAAAAAAAAAAf///wAAAAAAAAAAA///+AAAAAAAAAAH////gAAAAAAAAAA///wAAAAAAAAAAAH//gAAAAAAAAAAAA//8AAAAAAAAAAAAH//gAAAAAAAAAAAA//8AAAAAAAAAAAAH//gAAAAAAAAAAAAP/4AAAAAAAAAAAAB/+AAAAAAAA="},"cypseloides-niger":{"w":93,"h":59,"bits":"4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//AAAAAAAAAAAAAf/+AAAAAAAAAAAP///4AAAAAAAAAAf////gAAAAAAAAB/////8AAAAAAAAf//////4AAAAAAAf///////gAAAAAH////////8AAAH///////////gAA////////////8AAH////////////gAA////////////8AAH///////////4AAA////////////AAAH///////////wAAAP//////////+AAAP///////////gAAH///////////8AAA////////////gAAH///////////4AAB////////////AAAP///////////wAAB///////////8AAAP//8Af//////AAAB//gAAP/////gAAAP+AAAAf////4AAAAAAAAAA////8AAAAAAAAAAB///+AAAAAAAAAAAB/++AAAAAAAAAAAAB+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"dryobates-nuttallii":{"w":93,"h":53,"bits":"/AAAAAAAAAAAAAAH4AAAAAAAAAAAAAA/AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA8AAAAAAB8AAAAPgHgAAAAAAPwAAAB8A8AAAAAAP/wAAAPgHAAAAAAD//AAAB8A4AAAAAA///4AAPgAAAAAAAH///AAAAAAAAAAAA///4AAAAAAAAPgAH///AAAAAAAAB8AB///4AAAAAAAAPgA////AAAAAAAAB8AP///wAAAAAAAAPgD///+AAAAAAAAAAA////wAAAAAAAD4AP///AAAAAAAAAfAD///4AAAAAAAAD8Af//+AAAAAAAAAf4H///wAAAAAAAAD/A///+AAAD4AAAAP4P///wAAAfAAAAB/D///+AAAD4AAAAP4f///wAAAfAAAAH8H///+AAAD4AAAA+A////wAAAAAAAAHwP///8AAAAAAAAA+B////gAAAAAAHwH/v///4AAAAAAA+A//////AAAAAAAHwAP////wAAAAAAA+AB/////AAAAAAAHwAP////4APgAAAAAAAP////AD8AAAAAAAD////4AfgAAAAAAAf////AD8AAD4AAAD////4AfgAAfAAAAf//+AAD8AAD4AAAD//gAAAAAAAfAAAA//4AAAAAAAD4AAAP/8AAAAAAAAAAAAD/+AAAAAAAAAAAAA//wAAfAHwAA+AAAH/8AAD4A+AAHwAAA//AAAfAHz4A+AAAH/wAAD4A+fAHwAAA/4AAAfAHz4A+AAAD8AAAAAA+fAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"dryobates-pubescens":{"w":93,"h":93,"bits":"AAAAAAH+AAAAAAAAAAAAAD/4AAAAAAAfAAAAA//AAAAAAAD4AAAAH/4AAAAAAAfAAAAD//AAAAAAAD4AAAAf/4AAAAAAAfAAAAH//AAAAAAAAAAAAA//4AAAAAAAAAAAAH//AAAAAAAAAAAAA//4AAAAAAAAAAAAH//AB/+AAAAAAAAA//4A//8AAAAAHwAH//AP//wAAAAD+AA///////AAAAAfwAH//////8AAAAD+AA///////wAAAAfwAH//////+AAAAD+AA///////wAAAAfgAH//////+AAAAD8AAf//////wAAAAfgAD//n///+AAAAD8AAf/8f///wAAAAfgAH//n///+AAAAAAAB//9////wAAAAAAAP//////+AAAAAAAB///////wAAAAAAAP//////+AAAAAAAB///////wAAAAAAAP//////+AAAAAAAA///////wAAH4AAAH//////+AAA/AAAA///////wAAH4AAAH//9///+AAA/AAAA///v///wAAH4AAAH//7///+AAAAAAAA///f///wAAAAAAAH//7///+AAAAAAAA///f///wAAAAAAAH//////+AAD8AAAA///////wAA/gAAAH//////+AAH8AAAA///////wAA/gAAAH//////+AAH8AAAA///////wAA/AAAAH//////+AAHwAAAA///////AAAAAAAAH//////4AAAAAAAA//////+AAAAAAAAH//////wAAAAAAAA//////8AAAAAAAAH//////AAAAAAAAA//////4AAAAAAAAH/////+AAAAAAAAA//////wAAAAAAAAH/////+AAAAAAAAA//////gAAAAAAAAD/////8AAAAAAAAAH/////gAAAAAAAAA/////4AAAAAAAAAH/////AAAAAAAAAA/////wAAAAAAAAAH////+B8AAAAAAAA/////gPj4AAAAAAH////8B8fAAAAAAAf////APj4AAAAAAD////wB8fAAAAAAAP///8AAD4AAAAAAA////gAAAAAAAAAAH///4AAAAAAAAAAA////AAAAAAAAAAAD///4AAAAAAAAAAAf//+AAAAAAAAAAAB///wAAAAAAAAAAAH//8AAAAAAAAAAAA///gAAAAAAAAAAAH//8AAAAAAAAAAAA///AAAAAAAAAAAAH//gAAAAAAAAAAAA//4AAAAAAAAAAAAH//AAAAAAAAAAAAA//4AAAAAAAAPgAAH/+AAAAAAAAB8AAA//wAAAAAAAAPgAAH//AAAAAHAAB8AAAf/4AB8AA4AAPgAAD//AAPgAHAAB8AAAf/4AB8AA4AAAAAAB//AAPgAHAAAAAAAH/4AB8AAAAAAAAAAf/AAAAAAAAAAAAAD/4AAAAAAAAAAAAAf/AAAAAAAAAAAAAB/wAAAAAAA="},"dryobates-villosus":{"w":44,"h":93,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/gAAA/H/4AAH///+AAD////4AB////+AA/////gAf////4AH////+AD////gAA////gAAP///wAAD///4AAA///8AAAP///wAAD////H/A////5/+P////f/h//////4f/////+D//////g//////4H/////+A//////gP/////wB/////8Af/////AH/////wB/////8Af/////AH////+AD/////gA/////4AP////+AD///7/gA/////4AB////+AAf////gAH////4AA////+AAP////gAB////4AAf///+AAH////gAA////4AAH///+AAB////AAAP///wAAD///8AAA////AAAH///wAAB///8AAAP//+AAAD///gAD4f//4AA+D//+AAPgf//gAD4H//4AA+A//+AAAAP//wAAAB//8AAAAf//gAAAH//4AAAA///AAAAP//wAAAD//8AAAAf//AAAAA//wAAAAP/+AAAAD//wAAAAf/8AAB8H//AAAfA//wAAHwP/8AAB8A//AAAfAH/wAAHwB/gAAAAAP4AAAAAD+AAAAAA/gAAAAAH4AAAAAB+AAAAAAfgAAAAAAAAAAAAAAAAAAAAAAA="},"dryocopus-pileatus":{"w":82,"h":93,"bits":"8AAAAAAAAAAHwDwAAAAAAAAAAfAPAAAAAAAAAAB8A8AAAAAAAAAAHwDwAAAAAAAAAAfAPAAAAAAAAAAAAA8AAAAAAAAAAAADwAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAA/AAAAAAAAAAAAP8AAAAAAAAAAAB/wAAAAAAAAAAAf/AAAAAAAB8AAH/8AAAAAAAHwA///wAAAAAAAfAf//+AAAAAAAB8D///4AAAAAAAHwf///AAAAAAAAAD///4AAAAAAAAAf///AAAAAAAAAB///4AAAAAAAAAP///AAAAAAAAAD///4AAfAAAAAAP///8AD/AAAAAB/////wf8AAAAAH/////h/wAAAAAf/////v/AAAAAB///////8AAAAAH///////wAAAAAf//////+AAAAAAAP/////4AAAAAAAf/////gAAAAAAAf////+AAAAAAAA/////8AAAAAAAA/////wAAAAAAAB/////AAAAAAAAH/////AAAAAAAAP////+AAAAAAAA/////+AAAAAAAD/////4AAAAAAAP/////gAAAAAAA/////+AAAAAAAB/////4AAAAAAAH/////AAAAAAAAf///8AAAAAAAAA////wAAAAAAAAD////AAAAAAAAAH///8AAAAAAAAAf///wAAAAAAAAA///+AAAAAAAAAD///4AAAAAAAAAP///gAAAAAAAAAf//+AAAAAAAAAB///4AAAAAAAAAH///AAAAAAAAAAf//8AAAAAAAAAA///gAAAAAAAAAD//+AAAAAAAAAAP//4AAAAAAAAAAf//gAAAAAAAAAB//+AAAAAAAAAAD//4AAAAAAAAAAP//gAAAAAAAAAAf/8AAAAAAAAAAB//4AAAAAAAAAAD//wAAAAAAAAAAH//AAAAAAAAAAAf/8AAAAAAAAAAA//4AAAAAAAAAAD//gAAAD4AAAAAH//AAAAPgAAHwAf/8AAAA+AAAfAB//4AAAD4AAB8AH//gAAAPgAAHwAP/+AAAAAAAAfAA//8AAAAAAAAAAB//wAAAAAAAAAAAf/AAAAAAAAAAAA/8AAAAAAAAAAAD/wAAAAAAAAAAAP/AAAAAAAAAAAAf8AAAAAAAAAAAB/wAAAAAAAAAAAD/AAAAAAAAAAAAP8AAAAAAAAAAAA/wAAAAAAAAAAAD+AAAAAAAAAAAAP4AAAAAAAAAAAA/gAAAAAAAAAAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"egretta-caerulea":{"w":93,"h":53,"bits":"4AAAAAAAAAAAAAAHAAfAAAAAAAAAAAA4AD4AAAAAAAAAAAAAAfAAAAAAAAAAAAfAD4AAAAAAAAAAAD4AfAAAAAAAAAAAAfAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///+AAAAAAAAAAB////+AAAAAAAAAH/////+AAAAAAAAP//////8AAAAAAAB///////4AAAAAAAP///////wAAAAAAB////////gAAAAAAP////////+AAAfAB/////////wAAD4AAB///////+AAAfAAAD///////wAAD4AAAf//////+AAAfAAAB///////wAAAAAAAP//////+AAAAAAAA////////AAAAAAAD///////4AAAAAAAD///////AAAAAAAAAf/////4AAAAAAAAAf/////AAAAAAAAAA/////4AAAAAAAAAH/////wAAAAAAAAAf////+AfAAAAAAAB/////wD4AAAAAAAH////+AfAAAAAAAAf/+//wD4AAAAAAAB//wf+AfAAAAAAAAH/+AAHwAAAAAAAAA//wAA+AAAAAAAAAH/+AAHwAAAAAAAAA//AAA+AAAAAAAAAH/gAAHwAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"egretta-thula":{"w":93,"h":62,"bits":"4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf4AAAAAAAAAAAAAP/wAAAAAAAAAAAAH//AAAAAAAAAAAAD//8AAAAAAAAAAAA///wAAAAAAAAAAAP///gAAAAAAAAAAD////AAAAAAAAAAA////+AAAAAAAAAAf////8AAAAAAAAAD/////4AAAAAAAAAf/////gAAAAAAAAD/////8AAAAAAAAAf/////gAAAAAAAAD///z/8AAAAAAAAAH//+D/gAAAAAAAAA///wH8AAAAAAAAAf///AAAAAAAAAAAf///4AAAAAAAAAAP////AAAAAAAAAAH////4AAAAAAAAAD/////AAAAAAAAAA/////4AAAAAAAAAP////+AAAAAAAAAD/////wAAAAAAAAB/////+AAAAAAAAAf/////wAAAAAAAAH/////+AAAAAAAAB//////wAAAAAAAAP/////8AAAAAAAAD//////gAAAAAAAA//////4AAAAAAAAf/////+AAAAAAAD///////wAAAAAAAf//////8AAAAAAAD///////AAAAAAAAf//////wAAAAAAAH//////+AAAAAAAA///////gAAAAAAAH//////4AAAAAAAA//////+AAAAAAAAH//////gAAAAAAAAf/////4AAAAAAAAD/////+AAAAAAAAAP////8AAAAAAAAAA/////gAAAAAAAAAH////8AAAAAAAAAAf/gP/AAAAAAAAAAA/4B/4AAAAAAAAAAD8Af+AAAAAAAAAAAAAD/wAAAAAAAAAAAAAf+AAAAAAAAAAAAAD/wAAAAAAAAAAAAAf+AAAAAAAAAAAAAD/wAAAAAAAAAAAAAf+AAAAAAAAAAAAAD/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"elanus-leucurus":{"w":93,"h":63,"bits":"4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfwAAAAAAAAAAAAAH/gAAAAAAAAAAAAB/+AAAAAAAAAAAAAP/wAAAAAAAAAAAAB//AAAAAAAAAAAAAP/4AAAAAAAAAAAAD//AAAAAAAAAAAAAf/4AAAAAAAAAAAAH//gAAAAAAAAAAAB//+AAAAAAAAAAAAf//wAAAAAAAAAAAH//+AAAAAAAAAAAB///wAAAAAAAAAAAP//+AAAAAAAAAAAD///wAAAAAAAAAAA///+AAAAAAAAAAAH///wAAAAAAAAAAB///+AAAAAAAAAAAf///wAAAAAAAAAAD///8AAAAAAAAAAAf///gAAAAAAAAAAD///4AAAAAAAAAAA///+AAAAAAAAAAAH///wAAAAAAAAAAA///+AAAAAAAAAAAP///wAAAAAAAAAAD///+AAAAAAAAAAAf///wAAAAAAAAAAH///+AAAAAAAAAAB////wAAAAAAAAAAf///+AAAAAAAAAAH////wAAAAAAAAAB////+AAAAAAAAAAP////gAAAAAAAAAB////8AAAAAAAAAAP////gAAAAAAAAAB////8AAAAAAAAAAP//v/AAAAAAAAAAAH/9/4AAAAAAAAAAA//D+AAAAAAAAAAAD/4fgAAAAAAAAAAAf+D8AAAAAAAAAAAD/wfgAAAAAAAAAAAf8D8AAAAAP4AAAAAfgAAAAAAD/AAAAAAAAAAAAAAf4AAAAAAAAAAAAAD/AAAAAAAAAAAAAAf4AAAAAAAAAAAAAD/AAAAAAAAAAAAAAf4AAAAAAAAAAAAAD/AAAAAAAAAAAAAAf4AAAAAAAAAAAAAD/AAAAAAAAAAAAAAAAA=="},"empidonax-difficilis":{"w":44,"h":93,"bits":"AAA//8AAAAf//gAAAH//4AAAD///AAAB///4AAAf///AAAP///wAAD///8AAB////gAA////8AAf////4AP/////AD/////wA/////8Af/////AH/////wD/////8A//////Af/////AP////+AD/////gB/////wAf////8AP/////AH/////gB/////4Af////+AP/////gD/////4B/////+Af/////gH/////4D/////+A//////gP/////4D/////+A//////AP/////wD/////8A//////AP/////wD/////4A/////8AP/////AD/////gA/////4AP////8AD/////AA/////wAP////8AD/////AA/////wAP////8AD/////AA/////wAP////8AD////+AA/////AAP////gAD////wAA////8AAP///+AAD////gAA////wAAP///8AAD////AAA////gAAP///4AAD7//8AAAA///AAAAP//gAAAD//wAAAA//4AAAAP/8AAAAD//AAAAA//wAAAAP/8AAAAD//AAAAA//wAAAAP/8AAAAH//AAAAB//wAAAAf/8AAAAH//AAAAB//wAAAAf/8AAAAH//AAAAB//wAAAAf/8AAAAH//AAAAB//wAAAAf/8AAAAD//AAAAA="},"empidonax-hammondii":{"w":93,"h":93,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAD4AAAAHwAAAAAAAAfAAAAA+AAAAAAAAD4AAAAHwAD/wAAAAAAAAAA+AH//4AAAAAAAAAHwB///gAAAAAAAAAAA///+AAAAAAAAAAAP///8AAAAAAAAAAD////+AAAAAAAAAA/////8AAAAAAAAAP/////wAAAAAAAAD/////+AAAAAAAAAf/////wAAAAAAAAH/////+AAAAAAAAA//////wAAAAAAAAP/////4AAAAAAAAD/////wAAAAAAAAA/////8AAAAAAAAAP/////AAAAAAAAAH/////4AAAAAAAAB/////+AAAAAAAAAf/////wAAAAAAAAH/////8AAAAAAAAB//////gAAAAAAAAf/////8AAAAA+AAH//////AAAAAHwAB//////4AAAAA+AAf//////AAAAAHwAH//////4AAAAA+AA///////AAAAAHwAP//////4AAAAAAAD///////AAAAAAAA///////4AAAAAAAP///////AAAAAAAD///////wAAAAAAA///////+AAAAAAAH///////wAAAAAAB///////8AAAAAAAf///////gAAAAAAD///////8AAAAAAA////////AAAAAAAH///////wAAAAAAB///////8AAAAAAAf///////gAAAAAAH///////4AAAAAAB///////+AAAfAAAf///////gAAD4AAH///////4AAAfAAA///////+AAAD4AAP///////gAAAfAAD///////wAAAD4AAf//////8AAAAAAAD///////AAAAAAAAf///////wAAAAAAD////////gAAAAAAf///////+AAAAAAD////////wAAAAAAf///H///+AAAAAAD///h////wAAAAAAf//wP///+AAAAAAD//+B////wAAAAAA///gP///4AAAAAAP//4B///gAAAAAAB///AP//8AAAAAAAf//wAAD/gAAAAAAH//8AAAPgAAAAAAB///gAAAAAAAAAAAP//4AAAAAAAAAAAD//+AAAAAPgAAAAA///wAAAAB8AAAAAH//8AAAAAPgAAAAB///AAAAAB8AAAAAf//4AAAAAPgAAAAD//+AAAAAAAAAAAA///gAAAAAAAAAAAH//8AAAAAAAAAAAA///AAAAAAAAAAAAH//wAAAAAAAAAAAA//+AAAAAAAAAAAAH//gAAAAAAAAAAAA//4AAAAAAAAAAAAH/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"empidonax-oberholseri":{"w":82,"h":93,"bits":"+AAPwAAAAAAAAD4AH//AAAAAAAAPgD///AAAAAAAAAA////gPgD4AAAAH////A+APgAAAA////+D4A+AAAAP////8PgD4AAcA/////4+APgABwH/////gAAAAAHD/////+AHwAAAd//////8AfAAAB///////4B8AAAA///////gHwAAAD//////+AfAAAAP//////4AAAAAA///////wAAAAA////////AAAAAD3//////+AAAAAPA//////4AAAfA8B//////wAAB8DwD//////gAAHwAAH/////+AAAfAAAP/////8AAB8AAA//////4AAHwAAB//////wAAfAAAH//////gAB8AAAP//////AAHwAAAf/////+AAAHwAA//////8APgfAAD//////4A+B8AAH///////H4HwAAf//////8fgfAAB///////x+AAAAD///////H4AAAAP//////8fgAAAA///////h8AA4AD///////AAADgAP//////+AAAOAAf//////4AAA4AB///////gAADgAH///////AAAAAAf//////+AAAAAB///////4AAAAAD///////wAAAAAP///////AAAAAA///////+AAAAAB///////4AAAAAH///////wAAAAAP//v////AAAAAA//+////+AAAAAB//7////4AAAAAH///////wAAAAAP///////AAAAAAf//////8AAAAAB///////4AAAAAD///////gAAAAAP//////+AAAAAAf//////8AAAAAA///////wAAAAAD///////AAAAAAH//////+AAAAAAP//////4AAAAAAf//////gAD4AAA//////+AA/gAAB//////8AD+AAAB//////wAP4AAAD//////AA/gAAAD/v///8AD4AAAAH8////wAPgAAAAAD////AAAAAAAAAP///8AAAAAAAAA////wAAAAAAAAA////AAAAAAAAAB///8AAAAAAAAB////wAAAAAAAAH3///gAAAAAAAAfP//+AAAAAAAAB////8AAAAAAAAH////wAAAPgAAAA+///AAAA+AAAAD///+A4AD4AAAAP////zgAPgAAAAPv///uAA+AAAAA+f//+4AAfA+AAD5///7gAB8D4AAAH///gAAHwPgAAAf//+AAAfA+AAAB//+AAPh8D4AAAH//4AA+AAPgAAAB//gAD4AAAAAAAD/+AAPgAAAAAAAP/wAA+AAAAAAAAf4AA"},"empidonax-traillii":{"w":61,"h":93,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgAAAAAAAAHwAAAAAAAAD4AAAAAAAAB8AAAAAAAAA+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+AAAAAAAD//wAAAAAAH//+AAAAAAH///gAAAAAH///wAAAAA////8AAAAA/////AAAAAf////wAAAAP////4AAAAH////+AAAAD/////gAAAA/////4AAAAD////+AAAAA/////gAAAAf////4AAAAH////+AAAAD/////gAAAB/////wAAAAf////8AAAAP////+AAAAH/////gAAAD/////4AAAB/////+AAAA//////AAAAf/////wAAAP/////4AAAH/////+AAAD//////AAAA//////wAAAf/////4AAAH/////8AAAD//////AAAA//////gAAAP/////4AAAD/////+AAAA//////AAAAP/////wAAAD/////4AAAAf////8AAAAD////+AAAAAP////AAAAAAAf//gAAAAAAH//wAAAAAAA//8AAAAAAAP/+AAAAAAAD//gAAAAAAB//4AAAAAAAf/8AAAAAAAP//AAAAAAAD//wAAAAAAA//4AAAAAAAf/+AAAAAAAH//AAAAAAAD//gAAAAAAA//wAAAAAAAP/4AAAAAAAH/8AAAAAAAB/+AAAAAAAAf+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"empidonax-wrightii":{"w":93,"h":87,"bits":"AAH////gAAAAAAAAAA/////wAAAAAAAAAP////+AAAAAAAAAD/////wAAAAAAAAA//////AAAAAAAAAP/////8B/gAAAAAD//////wP8AAAAAB///////B/gAAAA////////4P8AAAAH////////h/gAH4A////////+AAAP/AH////////4AAB/4A/////////AAAP/AH////////8PgB/4A/////////x8AP/AH//////////gB8AAH/////////8AAAAAH/////////gAAAAAH////////4AAAAAA/////////8AAAA8D/////////gAAAHgf////////8AAAA8B/////////gPgAHgP////////8B8Pg8B/////////gPh8AAH////////8B8PgAA/////////8Ph8AAH/////////gAPgAAf////////8AAAAAD/////////gAAAAAf////////8AAAAAH/////////wAAAAA/////////+AAAAAH/////////4AAAfA//////////gAAD4H/////////8AAAfB//////////wAAD4P//////////AAA/B//////////4AAHgP//////////gAA8B//////////+AAHgP//////////wAA8B///////////AAAAP//////////4AAD9///////////gAAfv//////////8AAD8////////////AAfn///////////4AD8////////////AAAH///////////4AAAf///////////AAAD///////////4AAAf//////////wAAAB///////////AAAAP//////////4A4AA///////////APAAD//////////4B4AAf//////////wPAAB//////////+B4AAP//////////wPAAA/////h////+AAAAD////8f////wAAAAf////j////8AAAAB////8/////4AAAAH///4H/////AAAAA//5/f/////4AAAAD//8f//////AAAAAf//z//////4AAAAD//////////AAAAAf/////////8AAAAAH/////////wHAAAAf/////////A4AAAB/////////8HAAAAH/////4///g4+AAAP////8D//+HHwAAB/////gf//4A+AAB/////4B///gHwAAf/////AP//8A+AAD///4/AB///wAAAAf//wH4AP///AAAAD//wA/AA///4AAAAf/wAD4AH///AAAAB/wAAfAAf//4AAAAH4AAAAAD///AD4AA+AAAAAAH//4AfAAHwAAAAAAf//AD4AA+AAAAAAA//4A=="},"eremophila-alpestris":{"w":93,"h":88,"bits":"AAB8AAB8AAAf/8AAAAPgAAPgAAP//wAAAB8AAB8AAD///gAAAPgAAPgAAf//8AAAB8AAAAAAH///wAAAAAAAAAAA////AAAAAAAAAAAP///4AAAfAAAAAPj////AAHz4AAAAB8f///8AA+fAAAAAPj////wAHz4AAAAB8f///+AA+fAAAAAPj////wAHwAAAAAAAf////AAAAAAAAAAB////4AAAAAAAAAAH////AAAAD4AAAAA////4AAAAfAAAAAP////gAAAD4AAAAD////8AAAAfAAAAA/////gAAAD4AAAAP////8fAAAAAAAAD/////j4AAAAAAAA/////8fAAAAAAAAP/////j4AAAAAAAH/////8fAAAAAAAB//////AAAAAAAAB//////4AAAAAAAA///////AAAAAAAAP//////4AAAAAAAH//////+AAAAAAAB///////3AAAAAAAf//////+4AAAAAAH///////3AAAAA/B///////+4AAAAH4f///////3AAAAA/H///////+AAAAAH7////////wAAAAA/f///////+AAAAAD/////////wAAAAAB////////+AAAAAAf////////wAAAAAH////////+AAAAAB/////////wAAAAAf////////+AAAAAH/////////gAAAAB/////////8AAAAAf///////+/gAAAAH///////AP8AAAAB///////wB/AAAAAf//////8Af4AAAAH///////AH+AAAAB///////gA/wAAAB///////wAP8AHwH///////4AD/gA+A///////+AA/4AHwf///////wAP/AA+H///////+AH/wAHz////////AB/8AA+////////wA//AAAP///////+AP/wAAB////////wH/8AAAP///////+H//gAAB////////3//8AAAP//////////4AAAD//////////8AAAAf////f////+AHwAD////j/////AA+AAf///4H////gAHwAD///8AB///AAA+AAP//+AAH//AAAHwAA///AAAf/8AAA+AAf//+AAD//wAAAAAH//3wAAP//AAAAAB//8+AAA//8AAAAAf/+H/gAH//wAAAAH//g/8AAf//4AAAA//4H/gAB///4AAAP/+AB8AAP///wAAD//gAPgAB////AAA//wAAAAAP///4AAH/8AAAAAB////AAA//AAAAAAf///4AAH/wAAAAAH////AAA/8AAAAAA////4AAH+AAAAAAH///4AAA/gAAAAAA////AAAH4AAAAAAH///4AAA4AAAAAAAAD/gAAAAAAAAAAAAAAAAAAA"},"euphagus-cyanocephalus":{"w":93,"h":61,"bits":"D///+AAAAAAAAAAH////4AAAAAAAAAA/////gAAAAAAAAAH////+AAAAAAAAAA/////4AAAAAAAAAH/////gAAAAAAAAA/////8AAAAAAAAAH/////wAAAAAAAAA//////AAAAAAAAAB/////+AAAAAAAAAB/////8AAAAAAAAAH/////4AAAAAAAAAf/////wAAAAAAAAB//////gAAAAAAAAP/////+AAAAAAAAA//////8AAAAAAAAH//////wAAAAAAAAf//////gAAAAAAAD//////+AAAAAAAAf//////4AAAAAAAD///////wAAAAAAAf///////AAAAAAAD///////+AAAAAAAf///////4AAAAAAD////////wAAAAAAf////////AAAAAAD////////8AAAAAAP////////wAAAAAB/////////AAAAAAP////////8AAAAAA/////////wAAAAAH/////////AAAAAAf////////8AAAAAD/////////wAAAAAP/////////AAAAAA/////////+AAAAAH/////////4AAAAAf/////////gAAAAB/////////+AAAAAH/////////4AAAAAf/////////AAAAAB/////////4AAAAAH/////////gAAAAAf////////+AAAAAA/////////8AAAAAB/////////wAAAAAD/////////gAAAAAD/////////AAAAAAB//8B////8AAAAAAD/wAA////4AAAAAAP+AAAf///gAAAAAB/wAAB///+AAAAAAAAAAAH///4AAAAAAAAAAAP///AAAAAAAAAAAA///4AAAAAAAAAAAB///AAAAAAAAAAAAH//4AAAAAAAAAAAAf//AAAAAAAAAAAAA//4AAAAAAAAAAAAD//AAAAAAAAAAAAAH/4A="},"falco-columbarius":{"w":93,"h":68,"bits":"/gAAAAAAAAAAAAAH8AAAAAAAAAAAAAA/gAAAH/gAAAAAAAHwAAAD//AAAAAAAA8AAAA//+AAAAAAAHAAAAP//4AAAAAAAAAAAB///gAAAAAAAAAAAP//8AAAAAAAAAAAD///gAAAAAAAAAAAf//+AAAAAAAAAAAD///4AAAAAAAAAAAf///gAAAAAAAAAAD///+AAAAAAAAAAAf///4AAAAAAAAAAD////gAAAAAAAAAAf///+AAAAAAAAAAB////4AAAAAAAAAAH////gAAAAAAAAAA////+AAAAAAAAAAH////4AAAAAAAAAA/////AAAAAAAAAAH////8AAAAAAAPgA/////wAAAAAAB8AH////+AAAAAAAPgA/////4AAAAAAB8AH/////AAAAAAAPgA/////8AAAAAAAAAH/////gAAAAAAAAA/////+AAAAAAAAAD/////wAAAAAAAAAf////+AAAAAAAAAB/////4AAAAAAAAAP/////gAAAAAAAAA/////8AAAAAAAAAH/////gAAAAAAAAAf////+AAAAAAAAAB/////wAAAAAAAAAP/////AAAAAAAAAA/////8AAAAAAAAAD/////wAAAAAAAAAP/////AAAAAAAAAB/////8AAAAAAAAAf/////gAAAAAAAAD/////+AAAAAAAAAf/////4AAAAAAAAD//////gAAAAAAAAf/////+AAAAAAAAD//////4AAAAAAAAAH/////gAAAAAAAAAP////+AAAAAAAAAAf////wAAAAAAAAAAH///+AAAAAAAAAAAf///wAAAAAAAAAAB///+AAAAAAAAAAAH///wAAAAAAAAAAAf//4AAAAAAAAAAAB///AAAAAAAAAAAAH/4AAAAAAAAAAAAAf/gAAAAAAAAAAAAD/8AAAAAAAAAAAAAP/gAAAAAAAAAAAAB/+AAAAAAAAAAAAAH/wAAAAAAAAAAAAAf+AAAAAAAAAAAAAD/wAAAAAAAAAAAAAP+AAAAAAAAAAAAAAfwAAAAAAAAAAAAAAAAAAA="},"falco-mexicanus":{"w":58,"h":93,"bits":"/gAAAAAAAD+AAAAAAAAP4AAAAAAAA+AAAAAAAADgAAAAAAAAAAHwAAAAAAAAfAAAAAAAAB8AAAAAAAAHwAAAAAAAA/+AAAAAAAP/+AAAAAAB//+AAAAAAH//8AAAAAA///wAAAAAD///gAAAAAf//+AAAAAB///8AAAAAH///wAAAAAf///AAAAAB///+AAAAAH///8AAAAAf///4AAAAAf///wAAAAA////AAAAAH///+AAAAAf///8AAAAB////4AAAAH////wAAAAf////gAAAB/////AAAAH////+AAAAf////8AAAB/////wAAAH/////gAAAf////+AAAB/////4AAAH/////wAAAf/////AAAB/////+AAAD/////4AAAP/////wAAA//////AAAD/////8AAAH/////4AAAf/////gAAA//////AAAD/////8AAAH/////wAAAP/////gAAA/////+AAAB/////4AAAD/////gAAAP/////AAAAf////8AAAA/////wAAAB/////AAAAD////+AAAAP////8AAAAf////wAAAB/////gAAA//////AAA//////8AAD//////4AAP//////wAA///////gAD///////AAP//////8AA///////wAAf//////AAB8AB///8APgAAD///wA/+AAH///AD/4AAP//8AP/gAAf//wA//wAB///AAH/AAD//8AAf8AAP/4AAAHwAAf/wAAAfAAB//AAAAAAAD/8AAAAAAAP/4AAAAAAAf/gAAAAAAB/+AAAAAAAD/8AAAAAAAP/wAAAAAAAf/AAAAAAAA/8AAAAAAAD/wAAAAAAAH/AAAAAAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"falco-peregrinus":{"w":77,"h":93,"bits":"4AAAAAAAAAAABwAAAAAAAAAAADgAAAAAAAAAAAHAAAAAAAAAAAAOAAAAAAAAAAAAcAAAAAAAAAAAA4AAAAAAAAAAABwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPwAAAAAAAAAAD/8AAAAAAAAAAf/+AAAAAAAAAB//+AAAAAAAAAD//+AAAAAAAAAH//8AAAAAAAAAf//4AAAAAAAAA///wAAAAAAAAB///wAAAAAAAAD///gAAAAAAAAH///AAAAAAAAA///+AAAAAAAAD///8AAAAAAAAP///4AAAAAAAA////4AAAAAAAD////wAAAAAAAP////gAAAAAAA/////gAAAAAAD/////AAAAAAAH////+AAAAAAAf////8AAAAAAA/////4AAAAAAD/////wAAAAAAH/////gAAAAAAP/////AAAAAAAf////+AAAAAAB/////8HwAAAAD/////wPgAAAAH/////gfAAAAAP/////A+AAAAAf////+B8AAAAB/////4AAAAAAD/////wAAAAAAH/////gAAAAAAP////+AAAAAAA/////8AAAAAAB/////wAAAAAAD/////AAAAAAAH////8AAAAAAAP////4AAAAAAAf////wAAAAAAB/////AAAAAAAD////8AAAAAAAH////4AAAAAAAf/////AAAAAAA/////+AAAAAAD/////8AAAAAAP/////4AAAAAA//////wAAAAAB//////gAAAAAH/////+AAAAAAf/////8AAAAAB/////8AAAAAAH/////4AAAAAAf////4AAAAAAA/////gAAAAAAB////4AAAAAAAD////gAAAAAAAH////AAAAAAAAP///8AAAAAAAAf///wAAAAAAAAH///AAAAAAAAAP//+AAAAAAAAAf//8AAAAAAAAA+//wAAAAAAAAAD//gAAAAAAAAAH/+AAAAAAAAAAP/8AAAAAAAAAAf/wAAAAAAAAAA//AAAAAAAAAAA/+AAAAAAAAAAB/4AAAAAAAAAAB/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"falco-sparverius":{"w":93,"h":61,"bits":"+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHgAAAAAAAAAAAAAA8AAAAAAAAAAAAAAHAAAAAA/8AAAAAAA4AAAAAf/wAAAAAAHAAAAAH//AAAAAAAAAAAAA//8AAAAAAAAAAAAP//wAAAAAAAAAAAB//+AAAAAAAAAAAAP//wAAAAAAAAAAAB///AAAAAAAAAAAAP//4AAAAAAAAAAAB///AAAAAAAAAAAAP//8AAAAAAAAAAAB///wAAAAAAAAAAAP///AAAAAAAAAAAD///8AAAAAAAAAAAf///gAAAAAAAAAAD///+AAAAAAAAAAAf///4AAAAAAAAAAD////AAAAAAAAAAAf///4AAAAAAAAAAD////AAAAAAAAAAAf///8AAAAAAAAAAD////gAAAAAAAAAAf///8AAAAAAAAAAD////wAAAAAAAAAAf///+AAAAAAAAAAD////4AAAAAAAAAAf////AAAAAAAAAAB////4AAAAAAAAAAP////AAAAAAAAAAA////8AAAAAAAAAAH////gAAAAAAAAAAf///+AAAAAAAAAAB////wAAAAAAAAAAP////AAAAAAAAAAB////8AAAAAAAAAAH////wAAAAAAAAAAf////AAAAAAAAAAD////8AAAAAAAAAAf////gAAAAAAAAAD////+AAAAAAAAAAf////wAAAAAAAAAB/H//+AAAAAAAAAAAAf//wAAAAAAAAAAAA//+AAAAAAAAAAAAH//wAAAAAAAAAAAAf/8AAAAAAAAAAAAD//gAAAAAAAAAAAAP/8AAAAAAAAAAAAB/8AAAAAAAAAAAAAH/gAAAAAAAAAAAAAf+AAAAAAAAAAAAAD/wAAAAAAAAAAAAAP+AAAAAAAAAAAAAA/wAAAAAAAAAAAAAH+AAAAAAAAAAAAAAfwAAAAA="},"gavia-immer":{"w":93,"h":62,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/AAAAAAAAAAAAAP//AAAAAAAAAAAAD//8AAAAAAAAAAAB///wAAAAAAAAAAP////AAAAAAAAAAf////8AAAAAAAAAP/////wAAAAAAAAB/////+AAAAAAD8AP/////wAAAAAAfgB//////AAAAAAD8AP/////4AAAAAAfgA//////AAAAAAD8AAf////4AAAAAAAAAAA////AAAAAAAAAAAB///4AAAAAAAAAAAH///AAAAAAAAAAAAH//5///AAAAAAAAAf//////gAAAAAAAH///////AAAAAAAB////////gAAAAAAf////////AAAAAAH/////////AAAAAA/////////+AAAAAP/////////4AAAAB//////////+AAAAf//////////4AAAD///////////wAAAf//////////+AAAD///////////wAAAf//////////+AAAD///////////wAAAf//////////+AAAD///////////wAAAP//////////8AAAB///////////AAAAH//////////wAAAAf////////wAAAAAA///////4AAAAAAAAB/////gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"geothlypis-tolmiei":{"w":93,"h":67,"bits":"4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/+AAAAAAAAAAAAH//+AAAAAAAAAAAD///8AAAAAAAAAAA////4AAAAAAAAAAf////gAAAAAAAAAH/////AAAAAAAAAA/////8AAAAAAAAAP/////8AAAAAAAAD//////8AAAAAAAB///////8AAAAAAB////////4AAAAAA/////////gAAAAAP/////////AAAAAB/////////8AAAAAP/////////wPgAAB//////////B8AAAP/////////8Ph/4B///////////9//AA//////////////AA/////////////4AH/////////////AAf////////////4AD/////////////AAP////////////4AB/////////////AAP////////////wAA////////////wAAP///////////wAAB///////////wAAAP//////////wAAAB///////////AAAAP//////////8AAAB///////////wAAAP//////////+AAAB///////////wAAAP//////////+AAAA///////////wAAAH//////////+AAAA/////////8AAAAAH/////////gAAAAAf////////4AAAAAD////////+AAAAAAP////////wAAAAAB////////8AAAAAAH////////AAAAAAAf///////4AAAAAAD///////+AAAAAAAP///////gAAAAAAA///////4AAAAAAAD//////+AAAAAAAAP//////gAAAAAAAAf/////4AAAAAAAAA/////+AAAAAAAAAB/////AAAAAAAAAAD////wAAAAAAAAAAA///wAAAAAAAAAAAAf/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"geothlypis-trichas":{"w":93,"h":52,"bits":"AD////AAAAAAAD/gB////+AAAAAAB/8Af////8AAAAAA//g//////wAAAAAP/////////wAAAAH//////////wAAAD///////////wAAA////////////gAAf////////////AAH////////////+AD/////////////4B//////////////w/////H//////////////4P/////////////+B//////////////AH/////////////gA/////////////wAH////////////4AAf///////////8AAD///////////+AAAf///////////AAAB///////////wAAAP//////////8AAAA///////////AAAAH//////////8AAAA///////////4AAAH///////////gAAA///////////+AAAH///////////wAAA///////////+AAAD///////////wAAAf//////////+AAAD///////////wAAAf//////////8AAAD//////////4AAAAP//////////AAAAB//////////4AAAAP//////////AAAAA//////////4AAAAH//////////AAAAAf////////gAAAAAD////////8AAAAAAP////////AAAAAAA////////wAAAAAAD///////8AAAAAAAP///////AAAAAAAA///////wAAAAAAAD//////8AAAAAAAAP//////AAAAAAAAAf/////wAAAAAAAAB/////4AAAAAAAAAD////+AAAAAAA="},"glaucidium-gnoma":{"w":93,"h":93,"bits":"AAAfHwAAAAAAAAAAAAD4/gAAAAAAAAAAAAf/8AAAAAAAAAAAAD//gAAAAAAAAAAAAf/8AAAAAAAAAAAAD//gAAAAAAAAAH4AB+AAAAAAAAAAA/AAAAAAAAAAAAAAH4AAAHwAAAAAAAAA/4AAA+AAAAAAAAAH/AAAHwAAAAAAAAAD4AAA+AAAAAAAAAAfAAAHwAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAD//gAB8AAAAAAAAA///AAPgAAAAAAAA///+AB8AAAAAAAAP///4AAAB8AAAHwB////gAAAPgAAB+Af///+AAAB8AAAPwD////wAAAPgAAB+A/////AAAD8AAAPwH////4AAAfAAAB+A/////gAAD4AAAAAH////+AAAfAAAAAA/////4AAD4AAAAAH/////gAAAAAAAAA/////+AAAAAAAAAH/////4AAAAAAAAA//////gAAAAAAAAH/////+AAAAAAAAA//////4AAAAAAAAH//////AAAAAAAAA//////8AAAAAAAAH//////wAAAAAAAA//////+AAAAAAAAH//////wAAAAAAAA///////AAAAAAAAH//////4AAAA4AAA///////gAAAHAAAD//////8AAAA4HwAf//////gAAAHA+AB//////+AAAA4HwAP//////wAAPgP+AB///////AAB8B/wAP//////8AAPg/gAA///////gAB8H8AAH//////8AAPg/gAA///////wAAAHgAAH//////+AAAA8AAD///////wA+AAAAAf///////AHwAAAAD///////8A+AAAAAf////////nwAAAAD////////8+AAAAAff///////gAAAAAAB///////8AAAAAAAP///////gAAAB8AB///////4PgAAPgAP///////h8AAB8AB///////+PgAAPgAP///////58AAB8AB////////PgAAPgAH3/3////8AAAAAAAA++AD///4AAAA+AAAAAAH///gAAAHwAAAAAAH//8AAAA+AAAAAAAD//gAAAHwAAAAAAAP/8AAAA+AAAHwAAA//gAAAAAAfA/AAAB/8AAAAAAD4H4AAD//gAAAAAAfA/AAAfP4AAPgAAD4H4AAD4AAA58AAAfA/AAAfAAAHPgAAAAAAAAH4AAA58+AAfgAAAA+AAAHPnwAD8AAAAHwAAA58+AAfgAAAA+AAAHAHwAD8AAAAHwAAAAA+AAfgAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAPgAAAAH3wAAAAAAB8AAAAA++AAAAAAAPgAAAAHwAAAAAAAB8AAAAA+AAAAAAAAPgAAAAHwAAAAAAAB8AAAAAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAD4A="},"gymnogyps-californianus":{"w":77,"h":93,"bits":"8AAAAAAAAAAAB4AAAAAAAAAAADwAAAAAAAAAAAHA+AAAAAAAAAAAB8AAAAAAAAAAAD4AAAAAAAAAAAHwAAAAAAAAAAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/AAAAAAAAAAAf/AAAAAAAAAAD//AAAAAAAAAAf//AAAAAAAAAB///AAAAAAAAAP///gAAB8AAAA////gAAD4AAAB////gAAHwAAAH////gAAPgAAAP////AAAfAAAAf///+AAAAAAAA////+AAAAAAAB////+AAAAAAAD/////AAAAAAAH/////gAAAAAAP/////wAAAAAAP/////wAAAAAAA/////4AAAAAAB/////8AAAAAAD/////+AAAAAAH//////AAAAAAP//////gAAAAAf//////gAAAAA///////wAAAAB///////wAAAAD///////wAAAAH///////wAAAAP///////wAAAAP///////wAAAAf///////wAAAAf///////wAAAA////////wAAAA////////wAAAA////////gAAAB////////gAAAB////////AAAAD///////+AAAAH///////+AAAAH///////+AAAAP///////8AAAAf///////8AAAAf///////4AAAA////////4AAAA////////wAAAA////////wAAAA////////gAAAA////////gAAAA////////AAD4A////////APnwA///////+AfPgA///////8A+fAA///////4B8+AA///////wD58AA///////gAAAAA///////AAAAAA///////AAAAAB//////+AAAAAB//////+AAAAAD//////8AAAAAD//////8AAAAAH//////4AAAAAP//////4AAAAAf//////wAAAAAf/w////gAAAAA//h////AAAAAf//D///+AAAAD///j///8AAAD////H///4AAAH///+H///wAAAf///8P///gAAA////4f///AAAB////wf//+AAAD////g///gAAAH///4A///AAAAA/8AAA//+AAAAAAAAAA//8AAAAAAAAAAf/4AAAAAAAAAAH/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"haemorhous-mexicanus":{"w":87,"h":93,"bits":"AAAAAAAAAP///gAAAAAAAAAD////AAAAAAAAAA////+AAAAAAAAAP////8AAAAAAAAD/////wAAAAAAAA//////AAAAAAAAP/////4AAAAAAAB//////AAAAAAAAf/////4AAAAAAAD//////AAAAAAAA//////4AAAAAAAH//////AAAAAAAB//////4AAAAAAAP//////AAAAAAAD//////4AAAAAAAf/////+AAAAAAAD//////AAAAAAAA//////gAAAAAAAH/////8AAAAAAAB//////gAAAAAAAP/////8AAAAAAAB//////wAAAAAAAf/////+AAAAAAAD//////4AAAAAAA///////AAAAAAAH//////4AAAAAAB///////gAAAAAAf//////8AAAAAAH///////gAAAAAB///////8AAAAAAP///////gAAAAAD///////8AAAAAAf///////gAAAAAH///////8AAAAAB////////gAAAAAP///////8AAAAAD////////gAAAAAf///////8AAAAAH////////gAAAAA////////8AAAAAP////////AAAAAD////////4AAAAA/////////AAAAAP////////4AAAAB////////+AAAAAf////////wAAAAH////////8AAAAA/////////gAAAAP////////4AAAAD/////////AAAAAf////////wAAAAH////////+AAAAA/////////gAAAAP////////4AAAAB////////+AAAAAf////////gAAAAH////////4AAAAB////////+AAAAAf////////gAAAAH////////4AAAAB////////+AAAAAf////////4AAAAH/////////wAAAA//////////gAAAH//////////gAAA///////////AAAH//////////4AAA///////////gAAH//////////8AAA///////////gAAP//////////8AAD////v//////gAA////w//////8AAP///4AAf////AAB///+AAD/wAAAAAf///AAAf+AAAAAH///gAAD/wAAAAB///wAAAP+AAAAAf//4AAAB/wAAAAH//8AAAAH+AAAAB///AAAAAAAAAAAf//wAAAAAAAAAAD//8AAAAAAAAAAA///AAAAAAAAAAAP//wAAAAAAAAAAD//8AAAAAAAAAAA///gAAAAAAAAAAH//4AAAAAAAAAAA//+AAAAAAAAAAAH//gAAAAAAAAAAA//4AAAAAAAAAAAH/+AAAAAAAAAAAA//gAAAAAAAAAAAAA=="},"haemorhous-purpureus":{"w":93,"h":64,"bits":"D///wAAAAAAAAAAA////AAAAAAAAAAAH///8AAAAAAAAAAB////wAAAAAAAAAAf////AAAAAAAAAAH////8AAAAAAAAAA/////gAAAAAAAAAH////+AAAAAAAAAA/////wAAAAAAAAAH/////AAAAAAAAAA/////4AAAAAAAAAH/////gAAAAAAAAA/////8AAAAAAAAAH/////wAAAAAAAAAP/////AAAAAAAAAA/////8AAAAAAAAAH/////4AAAAAAAAA//////gAAAAAAAAD/////+AAAAAAAAAf/////4AAAAAAAAB//////gAAAAAAAAP//////AAAAAAAAB//////8AAAAAAAAP//////wAAAAAAAB///////AAAAAAAAP//////8AAAAAAAB///////wAAAAAAAP///////AAAAAAAB///////8AAAAAAAP///////wAAAAAAB////////gAAAAAAP///////+AAAAAAB////////4AAAAAAH////////gAAAAAA/////////AAAAAAH////////8AAAAAA/////////wAAAAAD/////////AAAAAAf////////8AAAAAD/////////wAAAAAP/////////AAAAAB/////////+AAAAAH/////////8AAAAA//////////wAAAAD//////////gAAAAf/////////+AAAAB//////////4AAAAH//////////gAAAAf/////////8AAAAB//////////wAAAAH//////////gAAAAP//////////AAAAAf/////////+AAAAA//////////4AAAAB//////////4AAAAB//////////gAAAAH//////////AAAAA////8H////+AAAAH///4AA////4AAAA///gAAAH///AAAAH/gAAAAAP//4AAAAfwAAAAAAP//AAAAAAAAAAAAAP/4AAAAAAAAAAAAAP/"},"haliaeetus-leucocephalus":{"w":93,"h":72,"bits":"+AAAAAD4AAAAAAAHwAAAAAfAAAAAAAA+AAA+AD4AAAAAAAHgAAHwAfAAAAAAAA4AAA+AD4AAAAAAAHAAAHwAAAAAAAAAA4AAA+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAD8AAAAAAAAAAAAAD/+AAAAAAAAAAAAB///AAAAAAAAAAAAP///4AAAAAAAAf//////AAAAAAAAf//////4AAAAAD4P///////AAAAAAfH///////4AAAAAD4////////AAAAAAfP///////4AAAAAD5////////AAAAAAAP///////8AAAAAAB////////gAAAAAAP///////8AAAAAAB////////gAAAAAAP///////8AAAAAAA////////gAAAAAAD///////4AAAAAAAf/9/////AAAAAAAD//H////4AAAAAAAf/7/////AAAAAAAD///////4AAAAAAAf///////gAAAAAAD///////8AAAAAAAP///////gAAAAAAAAf/////8AAAAAAAAA//////gAAAAAAAAB/////8AAAAAAAAAH/////gAAAAAAAAAf////4AAAAAAAAAD/////8AAAAAAAAAf/////gAAAAAAAAB/////8AAAAAAAAAP/////gAAAAAAAAB/////8AAAAAAAAAH////vgAAAAAAAAA///8B8AAAAAAAAAH//4AAAAAAAAAAAAf/+AAAAAAAAAAAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"himantopus-mexicanus":{"w":76,"h":93,"bits":"4AAAAAAAAAAADgAAAAAD8AAAAOAAAAAA/8AAAAAAAAAAH/4AAAAAAAAAA//wAAAAAAAAAD//AAAAAAAAAAf/8AAAAAAAAAB//8AAAAAAAAAH//8AAAAAAAAAf//+AAAAAAAAB///+AAAAAAAB////4AAAAAAA/////gAAAAAAP////+AAAAAAD///9/4AAAAAAf///w/gAAAAAD////AAAAAAAAf///8AAAAAAAD////wAAAAAAAf////AAAAAAAH////8AAAAAAA/////wAAAAAAP/////AAAAAAB/////4AAAAAAf/////gAAAAAf/////8AAAAAH//////wAAAAAf/////+AAAAAB//////wAAAAAH/////+AAAAAAf/////wAAAAAB/////+AAAAAAH//f//gAAAAAAAAD//4AAAAAAAAAf//AAAAAAAAAD//8AAAAAAAAAP/fwAAAAAAAAA/7/AAAAAAAAAD/P4AAAAAAAAAP8/gAAAAAAAAA/j+AAAAAAAAAD+P4AAAAAAAAAP4/gAAAAAAAAA/j+AAAAAAAAAD+P4AAAAAAAAAP4/gAAAAAAAAA/j+AAAAAAAAAD+P4AAAAAAAAAP4/gAAAAAAAAA/j+AAAAAAAAAD+P4AAAAAAAAAP4/gAAAAAAAAA/j+AAAAAAAAAD/P4AAAAAAAAAP8/wAAAAAAAAA/5/AAAAAAAAAD/38AAAAAAAAAP//wAAAAAAAAAf//AAAAAAAAAA///AAAAAAAAfh///AAAAAAA/////+AAAAAAD/////8AAAAAA//////4AAAAAD//////wAAAAAP//////gAAAAA//////+AAAAAD//////8AAAAAD//////4AAAAAAP/////gAAAAAAf////+AAAAAAAf////8AAAAAAAf////wAAAAAAA/////AAAAAAAA////8AAAAAAAB////wAAAAAAAD////B+AAAAAAH///8/4AAAAAAH/////gAAAAAAH////+AAAAAAAH////4AAAAAAAB////gAAAAAAAB///4AAAAAAAAH//8AAAAAAAAAf//AAAAAAAAAB//wAAAAAAAAAD//AAAAAAAAAAP/4AAAAAAAAAAf/gAAAAAAAAAA/8AAAAAAAAAAA/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"hirundo-rustica":{"w":93,"h":68,"bits":"///+AAAAAAAAAAAH///8AAAAAAAAAAA////wAAAAAAAAAAH////AAAAAAAAAAAP///4AAAAAAAAAAB////gAAAAAAAAAAf///8AAAAAAAAAAH////wAAAAAAAAAA////+AAAAAAAAAAH////4AAAAAAAAAA/////wAAAAAAAAAH/////AAAAAAAAAA/////8AAAAAAAAAB/////4AAAAAAAAAP/////gAAAAAAAAD/////+AAAAAAAAAf/////4AAAAAAAAD//////wAAAAAAAAf//////AAAAAAAAD//////8AAAAAAAAf//////wAAAAAAAD///////AAAAAAAAf//////8AAAAAAAD///////wAAAAAAAf///////AAAAAAAD///////+AAAAAAAf///////4AAAAAAD////////gAAAAAAf///////+AAAAAAB////////4AAAAAAP////////gAAAAAB////////+AAAAAAH////////4AAAAAA/////////gAAAAAD/////////AAAAAAf////////+AAAAAB/////////4AAAAAP/////////wAAAAA//////////gAAAAH/////////+AAAAH//////////8AAAA///////////wAAAH3//////////gAAA+f//////////AAAHx//////////+AAAAD//////////8AAAAP//////////4AAAA///////////wAAAB///////////gAAAP///////////AAAP///////////+AAD////8f//////8AAf///+A///////4AD//+/AD///////AA///wAAD//////4AH//+AAAH//////AB//AAAAAP/////4AP/wAAAAAf/////AB/8AAAAAA/////4AP/gAAAAAB/////AB/wAAAAAAB////4AD+AAAAAAAD////AAAAAAAAAAAH///4AAAAAAAAAAAH///AAAAAAAAAAAAH//4AAAAAAAAAAAAH//AAAAAAAAAAAAAP/4AAAAAAAAAAAAAH/A="},"hydroprogne-caspia":{"w":93,"h":62,"bits":"4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAB/wAAHwAAAAAAAAB//wAA+AAAAAAAAA///AAAAAAAAAAAAP//8AAAAAAAAAAAD///wAAAAAAAAAAD///+AAAAAAAAAAD////4AAAAAAAAAB/////AAAAAAAAAA/////4AAAAAAAAAP/////wAAAAAAAAB//////4AAAAAAAAP//////+AAAAAAAB///////8AAAAAAAP///////8AAAAAAB////////4AAAAAAAAf///////8AAAAAAD/v///////AAAfAAf5///////+/g/4AD8P///////////AAfv///////////4AD/////////////AAf////////////4AB/////////////AAP////////////4AB/////////////AAP////////////4AA/////////////AAH////////////wAAf///////////8AAD////////////gAAP///////////8AAA///////////+AAAD//////////+AAAAf/////////8AAAAB/////////gAAAAAH///////AAAAAAAAP////+AAAAAAAAAAf////AAAAAAAAAAA////gAAAAAAAAAAA///wAAAAAAAAAAAB//wAAAAAAAAAAAAP/AAAAAAAAAAAAAD/wAAAAAAAAAAAAf/8AAAAAAAAAAAAH//gAAAAAAAAAAAA//4AAAAAAAAAAAAH//AAAAAAAAAAAAA//4AAAAAAAAAAAAH//AAAAAAAAAAAAA//4AAAAAAAAAAAAB/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"icteria-virens":{"w":93,"h":48,"bits":"8AAAAAAAAAAAAAf/gAAAAAAAAAAAAf/8AAAAAAAAAAAAP/4AAAAAAAAAAAAH//AAAAAAAAAAAAD//4AAAAAAAAAAAB///AAAAAAAAAAAA///4AAAAAAAAAAAf//+AAAAAAAAAAAP///AAAAAAAAAAAH///g+AAAAAAAAAD///4HwAAAAAAAAD///8A+AAAAAAA/////+AHwAAAAAP//////AA+AAAAA///////wAAAAAAP///////4AAAAAAf///////8AAAAAA/////////AAAAAAP////////gAAAAAH////////4AAA/gD////////+AAAH/z/////////gAAA///////////4AAAH//////////+AAAA///////////gAAAH//////////wAAAA//////////8AAAAH//////////AAAAA//////////wAAAAD/////////8AAAAAP//////5//gAAAAD//////8f/4AAAAA///////n/+AAAAAH//////9//gAAAAA///////v/8AAAAAH/////////AAAAAA/////////AAAAAAH////////wAAAAAA////////4AAAAAAAB///////AAAAAAAAD//////4AAAAAAAAD//////AAAAAAAAAAAAB9/4AAAAAAAAAAAAPn/AAAAAAAAAAAAB8/gAAAAAAAAAAAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"icterus-bullockii":{"w":93,"h":35,"bits":"f///gAAAAAAAAAAH////AAAAAAAAAAA//////AAAAAAAAAH//////8AAAAAAAA///////+AAAAAAAH////////gAAAAAA/////////gAAAAAH/////////AAAAAAH////////+AAAAAAf////////8AAAAAB/////////4AAAAAH/////////+AAAAAf/////////8AAAAB//////////gAAAAH//////////AAAAAf//////////AAAAB///////////AAAAH///////////AAAAf///////////wAAD////////////4AAP////////////wAA/////////////AAD////////////4AAP////////////AAA////////////4AAD////////////AAAH//////8AP//4AAAP/////AAAD//AAAAf///4AAAAAAAAAAAP///AAAAAAAAAAAAf//wAAAAAAAAAAAA//8AAAAAAAAAAAAD//AAAAAAAAAAAAAf+AAAAAAAAAAAAAD/wAAAAAAAA="},"icterus-cucullatus":{"w":65,"h":93,"bits":"AP///AAAAAB/////gAAAAD/////gAAAAH/////AAAAAP/////AAAAAf/////AAAAA//////AAAAB//////AAAAD//////AAAAB//////gAAAA//////gAAAA//////gAAAA//////gAAAB//////gAAAB//////gAAAB//////gAAAB//////gAAAD//////AAAAH//////AAAAP//////AAAAf/////+AAAA//////+AAAB//////+AAAD//////8AAAH//////8AAAP//////4AAAf//////4AAA///////wAAB///////wAAB///////gAAD///////gAAD///////AAAH///////AAAP//////+AAAP//////+AAAf//////8AAAf//////8AAAf//////4AAA///////4AAA///////wAAA///////gAAA///////gAAB///////AAAB//////+AAAB//////8AAAB//////8AAAB//////4AAAA//////wAAAA//////gAAAD//////AAAAH/////+AAAAP/////8AAAAf/////4AAAA//////4AAAA/+f///wAAAA/8f///gAAAA/5////AAAAA/z///+AAAAA/H///8AAAAAAP///wAAAAAAf7//gAAAAAA/h//AAAAAAA+B/+AAAAAAAAD/8AAAAAAAAH/8AAAAAAAAP/4AAAAAAAAf/wAAAAAAAAf/gAAAAAAAA//gAAAAAAAB//AAAAAAAAD/+AAAAAAAAH/8AAAAAAAAH/8AAAAAAAAP/4AAAAAAAAf/wAAAAAAAA//wAAAAAAAA//gAAAAAAAB//AAAAAAAAD/+AAAAAAAAH/8AAAAAAAAH/4AAAAAAAAP/wAAAAAAAAf/gAAAAAAAAf/AAAAAAAAA/+AAAAAAAAB/8AAAAAAAAB/4AAAAAAAAD/wAAAAAAAAH/gAAAAAAAAP/AAAAAAAAAP+AAAAAAAAAf8AAAAAAAAAf4"},"icterus-galbula":{"w":93,"h":88,"bits":"AAAAAAAPgAAAAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAAAAA//wAAAAAAAAAAAAf//wAAAAAAAAAAAH////wAAAAAAAAAB/////gAAAAAAAAAf////8AAAAAAAAAH/////gAAAAAAAAB/////8AAAAAAAAAf/////gAAAAAAAAH/////8AAAAAAAAA/////8AAAAAAAAAP////8AAAAAAAAAH////+AAAAAAAAAB/////gAAAAAAAAA/////4AAAAAAAAAP////+AAAAAAAAAH/////gAAAAAAAAB/////8AAAAAAAAAf/////AAAAAAAAAH/////wAAAAAAAAD/////+AAAAAAAAA//////wAAAAAAAAH/////+AAAAAAAAB//////wAAAAAAAAf/////+AAAAB8AAH//////wAAAAPgAB//////+AAAAB8AAP//////wAAAAPgAD//////+AAAAB8AA///////wAAAAAAAP//////+AAAAAAAB///////gAAAAAAAf//////8AAAAAAAH///////gAAAAAAB///////4AAAAAAAP///////AAAAAAAD///////wAAAAAAA///////+AAAAAAAH///////gAAAAAAB///////4AAAAAAAf//////+AAAAAAAD///////wAAAAAAA///////8AAAAAAAH///////AAAAAAAB///////wAAAAAAAP//////8AAAAAAAD///////AAAAAAAA///////wAAAAAAAH//////8AAAAAAAB///////gAAAAAAAf//////8AAAAAAAH///////gAAAAAAB///////4AAAAAAAf///////AAAAAAAD///////wAAAAAAAf///////4AAAAAAD////////gAAAAAAf///////8AAAAAAH///A////gAAAAAA///wA///8AAAAAAP//4AB///j4AAAAD//+AAf//+fAAAAA///AAD///z4AAAAP//wAAf//+fAAAAB//8AAD///z4AAAAf//AAAf8P+AAAAAH//wAAD+A/gAAAAB//+AAAPwH8AAAAAf//gAAAAA/AAAAAH//4AAAAAAAAAAAB///AAAAAAAAAAAAf//wAAAAAAAAAAAH//8AAAAAAAAAAAA///A+AAAAB8AAAAP//4HwAAAAPgAAAB//+A+AAAAB8AAAAP//gHwAAAAPgAAAB//8A+AAAAB8AAAAP//AHwAAAAAAAAAB//wAAAAAAAAAAAAP/8AAAAAAAAAAAAB//AAAAAAAAAAAAAB/4AAAAAAAAAAAAAP8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"icterus-parisorum":{"w":93,"h":44,"bits":"4AAAAAAAfz//8AAHAAAAAAB/////wAA4AAAAAB//////AAAAAAAAB//////+AAAAAAAAf//////+AAAAAAAf///////8AAAAAAP////////wAAAAAD////////+AAAAAB/////////wAAAAAf////////+AAAAAP/////////wAAAAD/////////+AAAAA/////////AAAAAAP////////gAAAAAH////////4AAAAAB////////+AA+AAAf////////gAHwAAH////////4AA+AAA////////+AAHwAAH////////gAA+AAA////////8AAAAAAH////////AAAAAAAf///////4AAAAAAH///////+AAAAAAD////////gAAAAAA////////4AAAAAAP///////8AAAAAAH////////AAAAAAB////////gAAAAAA////////wAAAAA8P///////4AAAAAHj///////8AAAAAA8////wP/+AAAAAAHv///wB/+AAAAAAA9///8AP/wAAAAAAAP///AA/+AAAAAAAB///wAB/wAAAAAAAP//8AAB+AAAAAAAB///AAAAAAAAAAAAP//wAAAAAAAAAAAB//8AAAA+AAAAAAAP/+AAAAHwAAAAAAB//gAAAA+AAAAAAAD/4AAAAHwAAAAAAA="},"ixoreus-naevius":{"w":93,"h":93,"bits":"PgAAP+AAAAAAHwAB8AAB/wAAAAAA+AAPgAAP+AAAAAAHwAAAAAAHwAAPgAAAAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAB8AAAAAAAAB/gAAAPgAAAAAAAD//wAAB8AAAAAAAB///AAAPgAA+AAAA///+AAB8AAHwAD/////4AAPgfA/4A//////gAH4D4H/wH/////8AA/AfA/+A//////wAH4D4AfwH//////AA/AfAD+A//////4AH4D4APwH//////gA+AAAA+AP/////8AAAAAAAAAf/////wAAAAAAAAA/////+AAAAAB8AAB/////4D4AAAPgAAH/////gfAAAB8AAAf/////D4AAAP/AfD/////8fAAAB/4H4P/////z4AAAA/A/B//////8AAAAH4H4P//////gAAAA/A/B//////+AAAfAAH4H//////4AAD8AA4A///////gAAfgAHAD//////+AAD+AA4Af//////8AAfwAHAD///////wAD+AA4Af///////AAPwAAAD///////8AB+AAAA////////wAPwAAAH////////gAAAAAA////////8AAAAAAH////////wPgAAAA/////////B8AAAAH////////8PgAPAA/////////58AD4AH/////////PgAfAA/////////98AD4AD/////////3w/fAAf//////////H74AD//////////4/fAAf//////////H4AB///////////4/AAP///////////HwAB///////////gAAAP//////////+AAAB///////////4AAAH///////////AAAAP//////////8AAAB///////////wAAAP///////////AAAAH///////////AAAAf//////////4AAAD///////////AAAAP//////////4AAAA///////////AAAAD//////////wAAAAf//////////wAAAB//////////+AAAAH//////////wAHwAf/////////+AA+AB//////////wAHwAD/////////+AA+AAP/////////wAHwAA/////////+AAAAB//////////gAAAAPn////////+AAAAB8P////////4AAAAPgf////////AAAA/8A////////8AAAHwAB////////wAAA+AAB////////AAAHwAAAf/4B///8+AA+AAAAAfAH///nwAAAAAAAD4Af//++AAAAAAAAfAB////wAAAAAAAD4AH///+AAAAAAAAAAAf///wAAAAAAAAAAB///AAAAAAAAAAAAP//4AAAAAAAAAAAA///AAAAAAAAAAAAD//4AAAAAAAAAAAAP//AAAAAAAAAAAAA//4AAAAAAAAAAAAAB/AAAAAAAAAAAAAAAAA="},"junco-hyemalis":{"w":93,"h":53,"bits":"D///4AAAAAAAAAAA////gAAAAAAAAAAH///+AAAAAAAAAAB////8AAAAAAAAAAf////wAAAAAAAAAH/////AAAAAAAAAA/////+AAAAAAAAAH/////4AAAAAAAAA//////wAAAAAAAAH//////AAAAAAAAA//////8AAAAAAAAH//////4AAAAAAAA///////gAAAAAAAD//////+AAAAAAAAf//////4AAAAAAAD///////gAAAAAAAf//////+AAAAAAAD///////8AAAAAAAf///////4AAAAAAD////////gAAAAAAf////////AAAAAAD////////8AAAAAAf////////4AAAAAD/////////gAAAAAf////////8AAAAAD/////////wAAAAAf/////////AAAAAD/////////+AAAAAf/////////4AAAAD//////////AAAAAf/////////8AAAAB//////////4AAAAP//////////gAAAB//////////+AAAAH//////////8AAAA///////////wAAAD///////////AAAAf///////////AAAB///////////+AAAH///////////+AAAf///////////+AAB////////////8AAP////////////4AA/////////////wAD/////////////gAP/////8AB////+AAf////8AAB////4AA////+AAAD////AAA////AAAAD///4AAAP//AAAAAD///AAAAf/gAAAAAD//4AAAD/4AAAAAAD//AAAAf+AAAAAAAD/4A="},"lanius-ludovicianus":{"w":68,"h":93,"bits":"4AAAAAAAAAAOAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/AAAAAAAAAf//AAAAAAAAP//8AAAAAAAH///gAAAAAAH///+AAAAAAf////wAAAAAP////8AAAAAH/////gAAAAB/////8AAAAAf/////AAAAAH/////4AAAAB/////+AAAAAf/////wAAAAB/////8AAAAAH/////AAAAAA/////4AAAAAH/////AAAAAB/////wAAAAAP////+AAAAAD/////wAAAAA/////8AAAAAP/////gAAAAD/////4AAAAA//////AAAAAP/////wAAAAD/////+AAAAA//////gAAAAP/////4AAAAD//////AAAAA//////wAAAAP/////8AAAAD//////AAAAA//////4AAAAH/////+AAAAB//////gAAAAf/////8AAAAD//////AAAAA//////wAAAAP/////8AAAAB//////gAAAAf/////4AAAAD/////+AAAAA//////gAAAAP/////8AAAAB//////AAAAAf/////wAAAAD/////8AAAAAf/////AAAAAH/////wAAAAA/////8AAAAAH/////AAAAAA/////wAAAAAP////+AAAAAD/////wAAAAAf////8AAAAAD/////gAAAAAfz///8AAAAAAAH///AAAAAAAAD//4AAAAAAAAf/+AAAAAAAAD//wAAAAAAAAf/+AAAAAAAAH//gAAAAAAAA//8AAAAAAAAH//AAAAAAAAA//4AAAAAAAAP//AAAAAAAAB//wAAAAAAAAP/+AAAAAAAAB//wAAAAAAAAf/8AAAAAAAAD//gAAAAAAAAf/4AAAAAAAAD//AAAAAAAAA//4AAAAAAAAH/+AAAAAAAAA//wAAAAAAAAP/8AAAAAAAAB//AAAAAAAAAf/wAAAAAAAAD/8AAAAAAAAAf/AAAAAAAAAD/wAAAAAAAAA/8AAAAAAAAAD+AAAAAAAAAAAAAAAAAAAAAAAA="},"larus-californicus":{"w":93,"h":72,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/8AAAAAAAAAAAAAf/wAAAAAAAAAAAAP//AAAAAAAAAAAAP//4AAAAAAAAAAAH///gAAAAAAAAAAB///8AAAAAAAAAAAP///gAAAAAAAAAAB///8AAAAAAAAAAAP///gAAAAAAAAAAB//z8AAAAAAAAAAAP/8fgAAAAAAAAAAB//j8AAAAAAAAAAAAH8fgAAAAAAAAAAAB/j8AAAAAAAAAAAAP4fgAAAAAAAAAAAB/D8AAAAAAAAAAAAP4fwAAAAAAAAAAAB+D/AAAAAAAAAAAAPwf+AAAAAAAAAAAD+D/8AAAAAAAAAAAfg///AAAAAAAAAAD8P//+AAAAAAAAAAfn///8AAAAAAAAAD8////4AAAAAAAAAfv////wAAAAAAAAD//////AAAAAAAAAf//////AAAAAAAAD//////+AAAAAAAA///////8AAAAAAAH///////wAAAAAAA////////AAAAAAAH///////8AAAAAAA////////gAAAAAAD///////8AAAAAAAP///////+AAAAAAB/////////gAAAAAH/////////gAAAAA/////////+AAAAAD/////////wAAAAAP////////+AAAAAA/////////wAAAAAD////////+AAAAAAP////////gAAAAAAf///////4AAAAAAA////////AAAAAAAB///wD//4AAAAAAAP//4AAAAAAAAAAAA/+AAAAAAAAAAAAAH/wAAAAAAAAAAAAA/8AAAAAAAAAAAAAH/gAAAAAAAAAAAAAf8AAAAAAAAAAAAD//gAAAAAAAAAAAAf/8AAAAAAAAAAAAP//gAAAAAAAAAAAB//8AAAAAAAAAAAAP//gAAAAAAAAAAAB//8AAAAAAAAAAAAP//AAAAAAAAAAAAB//wAAAAAAAAAAAAP/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"larus-delawarensis":{"w":93,"h":62,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/wAAAAAAAAAAAAB//gAAAAAAAAAAAAf/+AAAAAAAAAAAAH//4AAAAAAAAAAAB///gAAAAAAAAAAAf//+AAAAAAAAAAAH///wAAAAAAAAAAP//3+AAAAAAAAAAD//+fwAAAAAAAAAA///x/AAAAAAAAAAH//8P8AAAAAAAAAA///H/8AAAAAAAAAH//j//4AAAAAAAAA//5///wAAAAAAAAH//f///gAAAAAAAAf/z////AAAAAAAAAH+f///8AAAAAAAAA/n////wAAAAAAAAH9/////AAAAAAAAA/P////8AAAAAAAAH7/////wAAAAAAAA///////AAAAAAAAH//////8AAAAAAAA///////wAAAAAAAD//////+AAAAAAAAf//////8AAAAAAAD///////wAAAAAAAP///////AAAAAAAB///////+AAAAAAAH///////4AAAAAAA////////gAAAAAAD///////+AAAAAAAP///////4AAAAAAA////////gAAAAAAH///////8AAAAAAAf///////4AAAAAAB////////gAAAAAAD////////AAAAAAAP///////+AAAAAAAf///////4AAAAAAA////////wAAAAAAD////////AAAAAAAf///////8AAAAAAD//Af////gAAAAAAf/4Af///8AAAAAAD/+AAP///gAAAAAAf/wAAH//8AAAAAAD/+AAAP//gAAAAAAf/wAAAP/8AAAAAAP/+AAAAAPgAAAAAf//wAAAAAAAAAAAf//+AAAAAAAAAAAD///wAAAAAAAAAAAf//+AAAAAAAAAAAD///wAAAAAAAAAAAf//+AAAAAAAAAAAB//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"larus-glaucescens":{"w":93,"h":62,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAD/4AAAAAAAAAAAAA//wAAAAAAAAAAAAf//AAAAAAAAAAAAD//8AAAAAAAAAAAA///gAAAAAAAAAAAH//+AAAAAAAAAAAA///8AAAAAAAAAAAP///4AAAAAAAAAAB/P//gAAAAAAAAAAPx//8AAAAAAAAAAB+D//wAAAAAAAAAAPwf/+AAAAAAAAAAD+D//wAAAAAAAAAA/wf/+AAAAAAAAAA/+D//wAAAAAAAAAf/gfn8AAAAAAAAAP/8D8AAAAAAAAAA///AfgAAAAAAAAAf//wD8AAAAAAAAAf//8APgAAAAAAAAP///gB8AAAAAAAAD///8AfgAAAAAAAB////gD8AAAAAAAAf///8AfgAAAAAAAH////gD8AAAAAAAH/////AfgAAAAAAH/////4D8AAAAAAB//////A/gAAAAAA//////4H8AAAAAAP//////B/gAAAAAB//////4P4AAAAAAf//////D/AAAAAAH//////w/4AAAAAP//////+P+AAAAAf///////j/wAAAAf///////4/8AAAAH///////4P/AAAAA///////+H/4AAAAH///////j/+AAAAB///////j//gAAAAP/////////wAAAAB/////////8AAAAAP////////+AAAAAB/////////gAAAAAP////////gAAAAAAB/8A////gAAAAAAAAAAA///8AAAAAAAAAAAAH//gAAAAAAAAAAAAP/+AAAAAAAAAAAAB//wAAAAAAAAAAAAH/+AAAAAAAAAAAAA//wAAAAAAAAAAAAH//AAAAAAAAAAAAA///gAAAAAAAAAAAH///gAAAAAAAAAAA////AAAAAAAAAAAH///4AAAAAAAAAAA////AAAAAAAAAAAH///4AAAAAAAAAAA////AAAAAAAAAAAH///4AAAAA=="},"larus-heermanni":{"w":93,"h":72,"bits":"8+AAAAAAAAAAAAAHv/wAAAAAAAAAAAA9//AAAAAAAAAAAAHv/8AAAAAAAAAAAA9//gAAAAAAAAAAAH///AAAAAAAAAAAA///4AAAAAAAAAAAH///AAAAAAAAAAAA7//4AAAAAAAAAAAHf//AAAAAAAAAAAA7//AAAAAAAAAAAAHP/wA/+AAAAAAAAAB/+Af/8AAAAAAAAAP8AH//wAAAAAAAAB/gB//+AAAAAAAAAP4AP//4AAAAAAAAB8AD///AAAAAAAAAAAD///4AAAAAAAAAAB////AAAAAAAAAAAP///4AAAAAAAAAAD////wAAAAAAAAAAf//7+AAAAAAAAAAD//4f+AAAAAAAAAAf//D//AAAAAAAAAD//4f//AAAAAAAAAf//D//+AAAAAAAAAD/A///4AAAAAAAAAfwP///gAAAAAAAAD+H////AAAAAAAAAfg////8AAAAAAAAD8P////wAAAAAAAAfn/////AAAAAAAAD9/////8AAAAAAAAf//////gAAAAAAAD///////AAAAAAAAf//////8AAAAAAAB///////4AAAAAAAP///////gAAAAAAB///////8AAAAAAAH///////wAAAAAAA////////gAAAAAAD////////AAAAAAAP///////+AAAAAAB////////8AAAAAAH////////wAAAAAAf///////+AAAAAAB////////wAAAAAAD///////+AAAAAAAP///////8AAAAAAAf///////wAAAAAAA////////AAAAAAAH///////8AAAAAAA//wD////gAAAAAAH/8AP///8AAAAAAA//AAf///gAAAAAAD/4AA//v8AAAAAAA//AAB/wAAAAAAAAH/4AAAAAAAAAAAAB/+AAAAAAAAAAAAf//wAAAAAAAAAAAD///AAAAAAAAAAAAf//4AAAAAAAAAAAD///AAAAAAAAAAAAf//4AAAAAAAAAAAD///AAAAAAAAAAAAD//wAAAAAAAAAAAAB/8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"larus-occidentalis":{"w":93,"h":68,"bits":"AA//4AAAAAAAAAAAAH//wAAAAAAAAAAAA///AAAAAAAAAAAD///8AAAAAAAAAAB//+/gAAAAAAAAAB///38AAAAAAAAAA///+/gAAAAAAAAAH///z8AAAAAAAAAA///4fgAAAAAAAAAH//8D8AAAAAAAAAA///gfgAAAAAAAAAH//8D8AAAAAAAAAA//+AfgAAAAAAAAAH//wD8AAAAAAAAAA//+A/gAAAAAAAAAH8/gH8AAAAAAAAAAAP8A/gAAAAAAAAAAB/AH8AAAAAAAAAAAf4A/gAAAAAAAAAAD+AH8AAAAAAAAAAAfwA/4AAAAAAAAAAD+AH/wAAAAAAAAAAf8A//AAAAAAAAAAD/wD/+AAAAAAAAAAf+Af//gAAAAAAAAD/4A///gAAAAAAAAf/gB///gAAAAAAAD/8A////AAAAAAAAf/gf////AAAAAAAD/8D/////AAAAAAAf//f////+AAAAAAD////////8AAAAAAf////////wAAAAAD/////////AAAAAAf/////////AAAAAD//////////AAAAAf/////////+AAAAD//////////8AAAAf//////////4AAAD///////////gAAAf//////////+AAAD///////////4AAAf///////////AAAB///////////4AAAP///////////AAAB///////////4AAAH//P////////gAAA//wf///////8AAAD/4A////////gAAAf/AD///////8AAAB/4Af///////4AAAH/gA////////4AAAf+AP////////8AAB/+B/////////8AAH/+P/////////4AAf////////////AAB////////////4AAD////////////AAAH///////////4AAAP///////////AAAAf//////////4AAAAf////D/////AAAAAf//wAAP///4AAAAB//AAAAAP//AAAAAP/AAAAAAAAAAAAAB/wAAAAAAAAAAAAAP+AAAAAAAAAAAAAB/wAAAAAAAAA="},"leiothlypis-celata":{"w":87,"h":93,"bits":"AAAAAAAAH///8AAAAAAAAAB////wAAAAAAAAA/////AAAAAAAAAP////8AAAAAAAAH/////wAAAAAAAB/////+AAAAAAAAf/////4AAAAAAAD//////gAAAAAAA//////8AAAAAAAP//////4AAAAAAD///////4AAAAAAf///////AAAAAAH///////4AAAAAB////////AAAAAAf///////4AAAAAH////////AAAAAD////////4AAAAA/////////AAAAAP////////4AAAAD////////4AAAAA////////4AAAAAP////////AAAAAD////////wAAAAA////////8AAAAAP////////gAAAAD////////4AAAAAf///////+AAAAAH////////gAAAAB////////8AAAAAf////////AAAAAD////////4AAAAA////////+AAAAAH////////wAAAAB////////+AAAAAf////////wAAAAD////////+AAAAA/////////wAAAAP////////+AAAAB/////////wAAAAP////////+AAAAD/////////wAAAA/////////+AAAAH/////////gAAAB/////////8AAAAP/////////gAAAB/////////8AAAAf/////////AAAAD/////////4AAAAf/////////AAAAH/////////wAAAA/////////+AAAAH/////////gAAAA/////////8AAAAH/////////AAAAA/////////wAAAAH////////+AAAAB/////////gAAAAP////////4AAAAD////////+AAAAAf////////wAAAAH////////8AAAAA/////////AAAAAH////////wAAAAB////////8AAAAAP////////AAAAAB////////wAAAAAP///////4AAAAAB///////+AAAAAAP///////gAAAAAB///////8AAAAAAP///////gAAAAAB/////8AAAAAAAAf////4AAAAAAAAH/////AAAAAAAAA////AAAAAAAAAAP///wAAAAAAAAAD///4AAAAAAAAAAf//+AAAAAAAAAAH///AAAAAAAAAAB///4AAAAAAAAAAP//+AAAAAAAAAAD///gAAAAAAAAAA///8AAAAAAAAAAH///AAAAAAAAAAA///4AAAAAAAAAAH//+AAAAAAAAAAA///wAAAAAAAAAAH//8AAAAAAAAAAA///AAAAAAAAAAAH//4AAAAAAAAAAA//+AAAAAAAAAAAH//wAAAAAAAAAAA//8AAAAAAAAAAAAA=="},"leiothlypis-lucidae":{"w":58,"h":93,"bits":"4AAAAAAAADgAAAAAAAAOAAAAAAAAA4AAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/8AAAAAAAf/4AAAAAAD//wAAAAAP///gAAAAA///+AAAAAD///4AAAAAP///wAAAAA////gAAAAH///+AAAAAf///4AAAAB////wAAAAH////AAAAAf///8AAAAA////wAAAAB////AAAAAH///8AAAAAfz//wAAAAB/P//gAAAAP////AAAAA////+AAAAD////8AAAAf////wAAAB/////gAAAH/+f/+AAAAf/B//8AAAB/8H//wAAAH/wP//gAAAf/A///AAAB/+D//8AAAH/4P//wAAAf/w///gAAB//j//+AAAH/+P//4AAAf/8///wAAA//////AAAD/////8AAAP/////wAAAf/////gAAB/////+AAAD/////8AAAH/////wAAAf/////AAAA/////8AAAB/////wAAAD/////AAAAD////+AAAAD////4AAAAP////wAAAB/////gAAAH////+AAAAf////8AAAB/////wAAAH/////gAAAf9/n//AAAAAAAf/8AAAAAAA//4AAAAAAD//gAAAAAAH/+AAAAAAAf/4AAAAAAA//gAAAAAAB/+AAAAAAAH/4AAAAAAAP/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"leucophaeus-atricilla":{"w":93,"h":62,"bits":"//wAAAAPgAA+AAD///+AAAB+AAHz4Af///wAAAPwAA+fAD7//+AB/5+AAAD4Aff//wA///wAAAfAAD///AP//+AAAD4AA///4D//8AAAAfAAH///A///wAAAAAAA///4f//+AAAAAAAH///////wAAAAAAA///P////AAAA/AAH///////4AAAH4AA////////74AA/AAH/////////gAH4AA//////////AA/AAH/////////+AAAAAf/////////8AAA/D///+//////wAAH4f/wD///////AAA/B/8Af///////D/n4P/AD/////////8/B/4Af/////////n4P/AD//////////4B/4Af//////////AB+AAP/////////4AfwAB//////////A//gAP/////////4H/8AB//////////A//gAP/////////4H/8AB////////+A+//gAH////////gH3/A/+////////4A+H8H/7///////wAHz/g//f//////wAA+f///5//////4AAAD////H/////+AAAA////4//////vgAAH////B//////8AAA////+H//////gAH3////wf////f8AA+////+A////j/gB/3////wA///wf8AP+////+AD//4D8Af/4///AAAf/+AAAD//H//wAAD//gAAB//4/3+AAD//8AAAP//D//wAAf//gAAB//4f/+AAD//8AAAP//B//wAAf//AAAB//4D/+AAD//4AAAA//Af/wAAf//AAAAHwAD/4AAB//4AAAA+AAfgAAP///AAAAHwAD8AAB///4AAAAAAAAAAAP///AAAAAAAAAAPh///8AAAAAAAAAB8P///gAAAAAAAAAPh///8AAAAAAAAAB8D///vgAAAAAAAAPgff/98AAAAAAAAB8AA//vgAAAAAAAAAAAH/98AAAAAA=="},"leucophaeus-pipixcan":{"w":93,"h":93,"bits":"AAAAAAAD8AAAAAAAAAAAAAAfgAAAAAAAAAAAAAD8AAAAAAAAAAAAAAfgAAAAAAAAAAAAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/8AAAAAAAAAAAAA//4AAAAAAAAAAAAf//gAAAAAAAAAAAH//+AAAAAAAAAAAB///wAAAAAAAAAAAf///AAAAAAAAAAB////4AAAAAAAAAA/////gAAAAAAAAAP////8AAAAD4AAAB/////gAAAAfAAAAP////8AAAAD4AAAB/////gAAAAfAAAAP////8AAAAD4AAAB/////gAAAAAAAAAB+///8AAAAAAAAAAAB///gAAAAAAAAAAAP//8AAAAAAAAAAAD//vwAAAAAAAAAAAf///gAAAAAAAAAAD/7//AAAAAAAAAAA/4f//AAAAAAAAAAH8D///gAAAAAAAAA/gf///gAAAAAAAAH4D////AAAAAAAAB/Af///+AAAAAAAAP4D////8AAAAAAAB+Af////4AAAAAAAPwD/////wAAAAAAB+B//////AAAAAAAPwf//////gAAAAAB+D///////gAAAAAP4f///////AAAAAB/D///////+AAAAAP4f///////4AAAAA/j////////gAAAAH8f////////gAAAA/z//////////wAAH+P//////////gAAf4//////////8AAD/j//////////gAAP+P/////////8AAB/4f/////////gAAH/wf////////8AAAf/Af////////gAAB/+D////////8AAAH/+H////////gAAAf/+P///////8AAAB//9////////AAAAD/////////wAAAAAH//////gAAAAAAAAP/////AAAAAAAAAAf////gAAAAAAAAAAf///wAAAAAAAAAAA///wAAAAAAAAAAAH/4AAAAAAAAAAAAAf/AAAAAAAAAAAAAD/4AAAAAAAAAAAAAf/AAAAAAAAAAAAAD/4AAAAAAAAAAAAA//AAAAAAAAAAAAAH/4AAAAAAAAAAAAA/+AAAAAAAAAAAAAH/wAAAAAAAAAAAAA/+AAAAAAAAAAAAAH/wAAAAAAAAAAAAA/+AAAAAAAAAAAAAH/gAAAAAAAAAAAAA/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"leucosticte-tephrocotis":{"w":93,"h":77,"bits":"4AAAAAPgAAA/AAAHAAAAAB8AAAH4AAA58AAAAPgAAA/AAAHPgAAAB8AAAH4AAAB8AAAAPgAAA/AAAAPgAAA+AAAAAAAAAB8AAAHwA/4AAAAAAAAAAA+Af/wAAAAAAAAAAHwH//AAAAD4AAAAA+B//8AAAAfAAAAAAAP//wAAAD4AAAAAAD//+AAAAfAAAAAAA///4+HwD4AAAAAAH///P++AAAAAAAAA///9/3wAAAAAAAAH///v++AAAAAAAAA///9/3wAAAAAAAAH////++AAAAAAAAA/////wAAAAAAAAAf////gfAAAAAAAAH////8D4AAAAAAAB/////gfAAAAAAAAf///+AD4AAAAAAAf////wAfAAAAAAAD////+AAAAAAAAAA/////wAB+AAAAAAH////+AAPwAAAAAA/////wAB+AAAAAD/////8AAPwAAAAAf/////gAf+AAAAD7/////8AD4AAAAAff/////gAfAAAAAD7/////8AD4AAAAAff/////AAfAAAAAD///////gAAAAAAAB//////8AAAAAAAAf//////gAAAAAAAH//////8AAAAAAAA///////gAAAAAD8P/////98AAAAAAfj//////PgAAAAPj8//////4AAAAAB8fv/////+AAAAAAPj////8//gAAAAAB8A//////4AAAAAAPgP/////+AfAAAAD4D//////gD4AAAAfA//////4A/AAAAD4P/////8AH4AAAAfB/////+AA/AAAAD4P////+AAHwAAAAAB////+AAD+AAAAAAP///x8AAfAAAAAAA///8Pg+D4AAAAAAAf/+B8HwfAAAAAAAH//wPg+D4AAAAAAA//+B8HwAAAAAAAAP//wAA+AAAAAAAAD/++AAAAAAAAAAAA//gAAAAAAAAAAAAH/4AAAAAfAH4AAAB/+AAAAAD4A/AAAAf/wAAAAAfAH4AAAD/8AAAAAD4A/AAAA//AAAAAAfAH4AAAH/wAfAAAAAAAAAAA/+AD4AAAAAAAAAAH/gAfAAAAAAAAAAA/4AD4AAAAAAAAAAB+AAfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8AAAAAAHwAAAAAAHgAAAAAA+AAAAAAA8AAAAAAHwAAAAAAHgAAAAAA+AAAAAAA8AAAAAAHwAAAAAAAA="},"limosa-fedoa":{"w":93,"h":92,"bits":"AAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgAAAAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH8AAAAAAAAAAAAAH/8AAAAAAAAAAAAB//wAAAAAAAAAAAAf//AAAAAAAAAAAAH//8AAAAAAAAAAAA///gAAAAAAAAAAAH//+AAAAAAAAAAAB///wAAAAAAAAAAA///+AAAAAAAAAAAP///4AAAAAAAAAAH////AAAAAAAAAAB/////wAAAAAAAAA//////wAAAAAAAAf///////AAAAAAAP///////8AAAAAAD////////8AAAAAB/////////wAAAAA//////////wAAAAP//z///////AAAAD//4f//////+AAAA//8D///////4AAAH/+Af///////wAAA//AD////////gAAH/gAf////////AAA/wAD////////+AAH8AAf////////4AAAAAD/////////wAAAAAf/////////8AAAAD//////////8AAAAP//////////gAAAB//////////8AAAAH//////////wAAAAf/////////+AAAAf//////////wAAAD//////////+AAAAf//////////wAAAD7/////////8AAAAfP/////////gAAAD4/////////4B8AAAB//////4AAAfgAAAD/////wAAAD8AAAAH////4AAAAfgAAAAH///4AAAAD8AAAAAH//AAAAAAfAAAAAAf/AAAAAAAAAAAAAPnwAAAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAB8AAAAAAAAAAAfAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgAAAAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAPgAAAAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAA="},"lophodytes-cucullatus":{"w":93,"h":68,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAf+AAAAAAAAAAAAAD/wAAAAAAAAAAAAAf+AAAAAAAAAAAAAD/wAAAAAAAAAAAAAfAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfgAAAAAAAAAAAAAD8AAAAAAAAAAAAAAfgAAAAAAAAAAAAAD8AAH+AAAAAAAAAAfgD5//wAAAAAAAAAAAff//gAAAAAAAAAAD////AAAAAAAAAAAf///8AAAAAAAAAAD////gAAAAAAAAAAB///+AAAAAAAAAAAf///wAAAAAAAAAAD///+AAAAAD8AAAAf///4AAAAA/8AD//////4AAAAH/4D///////8AAAA///////////gAAAH//////////8AAAA///////////gAHAH//////////8AA4A///////////gAHAH/////////4AAA4A//////////gAAHAH/////////8AAAAAB/////////gAAAAAH////////8AAAAAAP////////gAAAAAA////////8AAAAAAH////////gAAAAAA////////8AAAAAAH////////gAAAAAA////////8AAAAAAH3///////AAAAAAAAP//////wAAAAAAAAP/////8AAAAAAAAAB////8AAAAAAAAAAAf//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAB8AAAAAAAAHwAAAAPgAAAAAAfAAAAAAB8AAAAAAD4AAAAAAPgAAAAAAfAAAAAAB8AAAAAAD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"loxia-curvirostra":{"w":93,"h":53,"bits":"4AAAAAAAAD4AAAAHAPgAAAAB8fAAAAA4B8AAAAAPj4AAAAHAPgAAAAB/8AAAAAAB8AAAAAf/8B8AAAAPgAfAAH//wPgAAAAB8D4AB///B8AAAAAPgfAA///8PgAAAAB8D4AP///x8AAAAAPgfAD////AAAAAAB8AAAf///8AAAAAAPg+AH////wAAAAAAAHwD////+AAAAAAAA+A/////wAA/AAAAHwf////+AA/4AAAA+H/////wAH/AAAAAD/////8AA/4AAAAA/////4AAH/AAAAAP////+AAA+AAAAAD/////wAAAAAAAAA/////8AAAAAAAAAf/////gAAAAAAAAH/////8AAAAAAAAB//////gAAB+AAAAf/////8AAAPwAAAH//////gAAB+AAAB//////4AAAPwAAAf//////AAAB+AAAD//////4AAAPwAAA//////+AAAAAAAAP//////wAAAAAAAD//////+AAAAAAAB///////gAAAAAAAf//////4AAAAAAAH//////+AAfAAAAB///////gAD4AAAAP//////4AAfAAAAB//////+AAD4AAAAf//////gAAfAAAAP//////8AAAAAAAD///////gAAAAAAB////////AAAAAAAf//+f///8AAAAH4H//8AP///gAAAA/A//+AB///8AAAAH4H//gAB///gAAAA/A//4AAP///8AAAH4H/+AAB////gAAAAAf/AAAP///8AAAAAB/wAAAfAAfgAAAAAH8AAAD4AD8AAAAAAAAAAAfAAAAAAAAAAAAAAAAAAAAAAAAA="},"mareca-americana":{"w":93,"h":62,"bits":"+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB+AAAAAAAAAAAAAAPwAAAAAAAAAAAAAB+AAAAAAAAAAAAAAPwAAAAAAAAAAAAAB+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH+AAAAAAAAAAAAAH/+AAAAAAAAAAAAB//4AAAAAAAAAAAAP//gAAAAAAAAAAAD//+AAAAAAAAAAAAf//wAAAAAAAAAAAH/////+AAAAAAAAA////////wAAAAAAP/////////8AAAAD//////////wAAAB///////////8AAAf///////////wAAH///////////+AAA////////////wAAH///////////+AAA////////////wAAH///////////8AAAf///////////AAAAH//////////gAAAA//////////wAAAAH/////////wAAAAA/////////8AAAAAH/////////AAAAAA/////////wAAAAAH////////4AAAAAAf///////+AAAAAAD////////AAAAAAAP//////8AAAAAAAAP/////4AAAAAAAAAH////gAAAAAAAAAAAA//AAAAAAAAAAAAAAD4AAAAAAAAAAD4AAfAAAAAAAAAAAfAAD4AAAAAAAAAAD4AAfAAAAAAAAAAAfAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"mareca-strepera":{"w":93,"h":62,"bits":"8AAAAAAAAAAAAAAHgAAAAAAAAAAAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+AAAAAAAAAAAAAP/4AAAAAAAAAAAAD//gAAAAAAAAAAAA//+AAAAAAAAAAAAH//wAAAAAAAAAAAB///AAAAAAAAAAAAf//4AAAAAAAAAAAP///AAAAAAAAAAAD///4AAAAAAAAAAB////AAAAAAAAAAAP///4AAAAAAAAAAB////AAAAAAAAAAAP///4AAAAAAAAAAB////AAAAAAAAAAAP//////4AAAAAAAAAH////////gAAAAAB////////8AAAAAAf////////gAAAAAD////////+AAAAAA/////////4AAAAAH/////////AAAAAA//////////AAAAAH/////////4AAAAB//////////AAAAAP/////////4AAAAB//////////AAAAAP/////////4AAAAB/////////+AAAAAH////////+AAAAAA/////////AAAAAAH////////gAAAAAA////////4AAAAAAD///////8AAAAAAAP///////AAfAAAAA///////gAD4AAAAD//////wAAfAAAAAP/////8AAD4AAAAA/////+AAAfAAAAAD////+AAAAAAAAAAH////gAAAAAAAAAAP///wAAAAAAAAAAAH///AAAAAAAAAAAAA//4AAAAAAAAAAAA///AAAAAAAAAAAB///4AAAAAAAAAAAP///AAAAAAAAAAAB///4AAAAAAAAAAAP//AAAAAAAAAAAAB//gAAAAAAAAAAAAP/8AAAAAAAAAAAAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"megaceryle-alcyon":{"w":93,"h":68,"bits":"8AAAAAAAAAAAAAAHgAAAAAAAAAAAAAA8AAAAAAAAAAAAAAHgAAAAAAP4AAAAAA4AAAAAAB/wAAAAAHAAAAAAAP/AAAAAAAAAAAAAH/8AAAAAAAAAAAAH//wAAAAAAAAAAAB///AAAAAAAAAAAAf//8AAAAAAAAAAAD///gAAAAAAAAAAA///+AAAAAAAAAAAH///4AAAAAAAAAAA////8AAAAAAAAAAH/////AAAAAAAAAB//////AAAAAAAAAP/////8AAAAAAAAB//////gAAAAAAAAP/////8AAAAAAAAB//////gAAAAAAAAP/////8AAAAAAAAD//////AAAAAAAAA////4AAAAAAAAAAf///8AAAAAAAAAAH////AAAAAAAAAAB////4AAAAAAAAAAf///+AAAAAAAAAAH////wAAAAAAAAAB////+AAAAAAAAAAP////wAAAAAAAAAD////+AAAAAAAAAAf////wAAAAAAAAAH////+AAAAAAAAAA/////wAAAAAAAAAP////8AAAAAAAAAD/////gAAAAAAAAAf////4AAAAAAAAAH/////AAAAAAAAAA/////wAAAAAAAAAP////+AAAAAAAAAB/////gAAAAAAAAAP////4AAAAAAAAAD////+AAAAAAAAAAf////gAAAAAAAAAH////4AAAAAAAAAB////+AAAAAAAAAAf////wAAAAAAAAAD/////AAAAAAAAAAf////4AAAAAAAAAD/////AAAAAAAAAAf////4AAAAAAAAAH/////AAAAAAAAAB/////4AAAAAAAAAP///8AAAAAAAAAAD//wAAAAAAAAAAAA//8AAAAAAAAAAAAP/+AAAAAAAAAAAAB//gAAAAAAAAAAAAP/4AAAAAAAAAAAAB/+AAAAAAAAAAAAAP/gAAAAAAAAAAAAB/4AAAAAAAAAAAAAH8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"megascops-kennicottii":{"w":93,"h":62,"bits":"4PwAAAAAAAAAAAAHB/AAAAAAAAAAAAA4/4AAAAAAAAAAAAHP/AAAAAAAAAAAAAB/4AAAAAAAAAAAAAP/AAAAAAAAAAAAAB/wAAAAAAAAAAAAAf+AAAAAAfwAAAAAD/3wAAAA//4AAAAB/++AAAAf//gAAAAP/3wAAAH//+AAAAD/4+AAAB///4AAAAfgHwAAAf///AAAAD/gAAAAH///4AAAAf8AAAAA////AAAAD/gAAAAP///4AAAAD8AAAAB////AAAAAfgAAAAf///4AAAAB8AAAAH////AAAAAAAAAAD////4AAAAAAAAAA/////AAAAAAAAAAf////4AAAAAAAAAH/////AAAAAAAAAB/////4AAAAAAAAAf/////AAAAAAAAAD/////4AAAAAAAAB/////+AAAAAAAAAf/////wAAAAAAAAH/////+AAAAAAAAD//////wAAAAAAAA//////8AAAAAAAAP//////gAAAAAAAH//////8AAAAAAAB///////AAAAAAAAf//////4AAAAAAAP//////+AAAAAAAH///////wAAAAAAB///////8AAAAAAAf///////AAAAAAAD///////4AAAAAAAf//////+AAAAAAAD///////gAAAAAAAf//////4AAAAAAAD//////+AAAAAAAAAf/////gAAAAAAAAD/////4AAAAAAAAAf////+AAAAAAAAAD/////8AAAAAAAAA//////4AAAAAAAAH//////AAAAAAAAA//wf//4AAAAAAAAH/4D///AAAAAAAAA/+AP//4AAAAAAAAH/gB///AAAAAAAAAf4AP//4AAAAAAAAAAAB//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"melanerpes-formicivorus":{"w":58,"h":93,"bits":"8AAAAAAAADwAAAAAAAAPAAAAfAAAA8AAAB8AAADwAAAHwAAH/AAAAfAAAf4AAAB8AB//gAAAAAAf/+AAAAAAD//4AAAAAA//zgAAAAAH//OAAAAAA//84AAAAAP//4AAAAAP///uAAAAH///+4AAAA////7gAAAP////uAAAB////+4AAAH////jgAAA////4OAAAD////A4AAAf///wDgAAB///8AOAAAH///wA4AAAf//+AAAAAB///4AAAAAH///wAAAAAf///+AAAA/////4AAAD/////gAAAP////+8AAA/////7wAAD////+PAAAD////78AAAf////vwAAB////+/AAAP////78AAA/////vwAAH////+AAAAf////wAAAB/////AAAAP////8AAAA/////wAAAD/////AB+Af////4AH4B/////gAfgP////+AB+A/////4AH4H/////AAAAf////8AAAD/////gAAAP////+AAAA/////wAAAH/////AAAAf////4AAAB/////AAAAP////8AAAA/////gAAAH////8AAAAf////wAAAB/////AAAAH////8AAAA/////wAAAH/////AAAAf////8AAAf/////wAAB//////AAAH///5/4AAAf///H/gAAB///wf+AAAH//+B/wAAAH//wD+AAAA//+AAAAAAD//wAAAAAAf/+AAAAAAB//wAAAAAAH/+AAAAAAAf/4AAAAAAB//AAAAAAAH/8AAAAAAA//wAAAAAAD/+AAAAAAAf/wAAAAAAD/+AAAAAAAf/wAAAAAAB/+AAAAAAAH/wAAAAAAAf8AAAAAAAB/wAAAAAAAH+AAAAAAAAfwAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"melanerpes-lewis":{"w":62,"h":93,"bits":"8AAAAAAAAAPAAAAAAAAADwAAAAAAAAA4AAAAAAAAAP4AAAAAAAAA+AAAAAAAAAPgAAAAAAAAD4AAAAAAAAA+AAAB/8AAAAAAAB//wAAAAAAA///AAAAAAAf///+AAAAAP////gAAAAH////4AAAAB////+AAAAAf////gAAAAH////4AAAAB////+AAAAAf///4AAAAAH///wAAAAAB///4AAAAAAf//8AAAAAAH//+AAAAHwD///AAAAB8B///wAAAAfA///+AAAAHwP///gAAAB8H///8AAAAAD////AAAAAB////wAAAAAf///8AAAAAP////AAD4AD////wAA+AB////8AAPgAf////AAD4AH////wAA+AD////8AAPgA/////AAAAAP////wAAAAH////8AAAAB/////AAAAAf////wAAAAP////8AAAAD/////AAAAA/////wAAAAf////4AAAAH////+AAAAB/////AAAAA/////wAAAAP////8AAAAD////+AAAAA/////gAAAAP////wAAAAH////8AAAAB/////AABwAf////wAAcAH////8AAHAB////+AABwAf///8AAAcAP///+AAAHAD////AAAAAA////gAAAAAf///wAAAAAH///4AAAAAD///8AAAAAA///4AAAAAAP//8AAAAAAH//+AAAAAAB///gAAAAAAf//wAAAAAAH//8AAAAAAB//+AAAAAAAP//AAAAAAAB//wAAAAAAAB/8AAAAAAAA//AAAAAAAAP/wAAAAAAAD/4AAAAAAAB/+AAAAAAAAf/gAAAAAAAP/4AAAAAAAH/8AAAAAAAB/+AAAAAAAAf/AAAAAAAAH/AAAAAAAAB/wAAAAAAAA/4AAAAAAAAP+AAAAAAAAD/AAAAAAAAA+AAAAAAAAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"meleagris-gallopavo":{"w":93,"h":62,"bits":"/AAAAAAAAAAAAAAH4AAAAAAAH/+AAAA//AAAAAAB//8/AAH/////////////+AP/////////////8B//////////////gP/////////////8B//////////////wP/////////////+D///////////////f//////////////7///////////////f//////////////7///////////////f//////////////7///////////////f//////////////7///////////////f//////////////7///////////////f//////////////7//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////7///////////////f//////////////7///////////////f//////////////7///////////////f//////////////7///////////////f//////////////7///////////////f/////////////////////////////////////////////3//////////////+///////////////n//////////////4//////////////+H//////////////w//////////////+D//////////////wf/////////////+D//////////////gf/////////////8D//////////////gP/////////////wB/////////////+AH/////////////gA/////////////4AA///////////wAAAAfAAAH/////wAAAAAAAAAf/wAH8AAAAAAAAAAA+AAAAAAAA=="},"melospiza-georgiana":{"w":53,"h":93,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//gAAAAAH//wAAAAAf//wAAAAB///wAAAAH///wAAAA////wAAAH////wAAAf////wAAA/////wAAB/////gAAD/////gAAH/////wAAP/////wAAH/////wAAD/////wAAD/////wAAH/////wAAP/////gAAf/////gAA//////gAB//////AAD//////AAH//////AAP/////+AAf/////+AA//////8AB//////8AB//////4AD//////4AH//////wAH//////gAP//////gAf//////AAf/////+AA//////8AA//////4AA//////4AA//////wAB//////gAB//////AAB/////+AAB/////8AAB/////4AAB/////wAAB/////gAAH/////AAAP////+AAAf/z//+AAA/+D//8AAB/wB//8AAAD4B//8AAAHwD//4AAAPgD//wAAAfAH//gAAA+AH//AAAAAAP/+AAAAAAP/8AAAAAAf/4AAAAAAf/wAAAAAA//gAAAAAA//AAAAAAB/+AAAAAAB/8AAAAAAB/4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"melospiza-lincolnii":{"w":93,"h":40,"bits":"PgAAAAAAAAH///wH/wAAAAAAAD////A//wAAAAAAA////8H//gAAAAAAP////4///gAAAAAf/////3///gAAAAf//////////AAAD////////////AAf/////////////A/////////4f//////////////A//////////////4A/////////////4AB////////////4AAB////////////AAAD///////////4AAAP///////////AAAAf//////////4AAAB///////////AAAAH//////////wAAAAP/////////+AAAAA//////////wAAAAD/////////8AAAAAf/////////gAAAAD/////////8AAAAAf/////////8AAAAAf/////////gAAAAB/////////8AAAAAH/////////gAAA+Af////////8AAAHwB////////4AAAA+AP///////+AAAAHwA////////wAAAA+AD///////8AAAAAAAP///////AAAAAAfAf//////wAAAAAD4B//////8AAAAAAfAH//////AAAAAAD4AP/////wAAAAAAfAA/////4AAAAAAAAAD////8AAA"},"melospiza-melodia":{"w":93,"h":58,"bits":"AAAAAAAAAAAP///AAAAAAAAAAAD///4AAAAAAAAAAA////gAAAAAAAAAAP///+AAAAAAAAAAD////4AAAAAAAAAA/////AAAAAAAAAAP////4AAAAAAAAAD/////AAAAAAAAAB/////4AAAAAAAAA//////AAAAAAAAAf/////4AAAAAAAAH//////AAAAAAAAD//////4AAAAAAAA//////8AAAAAAAAP//////gAAAAAAAD//////8AAAAAAAA///////AAAAAAAAP//////4AAAAAAAH///////AAAAAAAB///////4AAAAAAA////////AAAAAAAP///////4AAAAAAD////////AAAAAAA////////4AAAAAAP////////AAAAAAD////////4AAAAAA/////////AAAAAAP////////wAAAAAD//////+/8AAAAAA///////j/AAAAAAH//////gf4AAAAAB//////4B8AAAAAAf/////+AAAAAAAAH//////gAAAAAAAB//////4AAAAAAAA//////+AAAAAAAAf//////AAAAAAAAP//////gAAAAAAAD//////8AAAAAAAB///////AAAAAAAAf//////wAAAAAAAP//////8AAAAAAAH//////+AAAAAAAB///////4AAAAAAA////H///+AAAAAAf///g////8AAAAAH///wH////4AAAAD///8Af////wAAAB///+AAH///+AAAAf///AAAD///wAAAP///AAAAH//+AAAD///gAAAA///wAAA///gAAAAH//+AAAH//4AAAAA///wAAA//8AAAAAH/AAAAAH/+AAAAAAAAAAAAA//gAAAAAAAAAAAAH/wAAAAAAAAAAAAAA"},"melozone-aberti":{"w":93,"h":44,"bits":"4AAAAAAAAAAP///3AAAAAAAAAAD////4AAAAAAAAAA////4AAAAAAAAAAf////AAAAAAAAAAP////4AAAAAAAAAP/////AAAAAAAAAD/////4AAAAAAAAB//////AAAAAAAAAf/////4AAAAAAAAH//////AAA+AAAAB//////4AAHwAAAAf/////8AAA+AAAAH//////wAAHwAAAB//////+AAA+AAAAf//////wAAAAAAAP//////+AAAAAAAD///////wAAAAAAB///////+AAAAAAAf///////wAAAAAAH///////8AAAAAAD////////gAAAB//////////8AA/////////////gD/////////////8P//////////////H//////////////4//////////////+H//////////////w//////////////8H//////////////A//////////////4H/////////////+A////////////v/gH/////////////4A////j////////+AH///gA////////gA///gAAA//////4AH//gAAAB/////+AA//gAAAAA/////AAH/AAAAAAA////wAA/gAAAAAAB///wAAAAAAAAAAAH///AAAAAAAAAAAAP//4AAAAAAAAAAAAf//AAAA="},"melozone-crissalis":{"w":93,"h":89,"bits":"AAAAAAAAAAP///AAAAAAAAAAAD///8AAAAAAAAAAA////wAAAAAAAAAAP////AAAAAAAAAAD////8AAAAAAAAAA/////gAAAAAAAAAP/////AAAAAAAAAB/////8AAAAAAAAAf/////4AAAAAAAAD//////AAAAAAAAA//////4AAAAAAAAH//////AAAAAAAAA//////4AAAAAAAAH//////AAAAAAAAB//////4AAAAAAAAP//////AAAAAAAAB//////4AAAAAAAAf/////4AAAAAAAAD/////8AAAAAAAAA//////gAAAAAAAAf/////4AAAAAAAAH//////AAAAAAAAB//////wAAAAAAAAf/////+AAAAAAAAH//////wAAAAAAAD//////8AAAAAAAA///////gAAAAAAAP//////8AAAAAAAD///////gAAAAAAA///////8AAAAAAAf///////gAAAAAAH///////8AAAAAAB////////gAAAAAAf///////8AAAAAAH////////gAAAAAB////////8AAAAAAf////////gAAAAAD////////8AAAAAA/////////gAAAAAP////////8AAAAAD/////////gAAAAA/////////8AAAAAP/////////AAAAAD/////////4AAAAA///////z//AAAAAH//////8AP4AAAAB///////AD/AAAAAf//////wAfwAAAAH//////8AH+AAAAA///////gB/wAAAAP//////4AP8AAAAD//////+AD/gAAAAf//////gA/4AAAAH//////wAP+AAAAA//////8AB/wAAAAP//////AAf8AAAAD//////4AH/AAAAA///////AB/4AAAAP//////4Af+AAAAD///////AP/gAAAA///////4D/4AAAAH///////D/+AAAAA///////5//gAAAAH/////////4AAAAA/////////+AAAAAP/////////AAAAAD/////////wAAAAAf////////4AAAAAH////////8AAAAAB/////////AAAAAAf///+///4AAAAAAD////A//8AAAAAAA////gB//wAAAAAAP///wAH//gAAAAAD///wAAP/+AAAAAA///4AAA//4AAAAAP//8AAAD//gAAAAD//8AAAA//+AAAAA//+AAAAP//4AAAAH//gAAAD///4AAAA//4AAAAf///gAAAH/+AAAAD///+AAAA//gAAAAf///4AAAH/wAAAAD////gAAA/8AAAAAf///8AAAH/AAAAAAAB//wAAA/wAAAAAAAH/+AAAH4AAAAAAAAf/wAAAAAAAAAAAAA/+AAAA"},"melozone-fusca":{"w":93,"h":82,"bits":"4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4D/8AAAAAAAAB8AAB//4AAAAAAAAPgAAf//gAAAAAAAB8AAP//+AAAAAAAAPgAB///4AAAAAAAB8AAf///gAAAAAAAAAPH///+AAAAAAAAAB4////8AAAAAAAAAPH////wAAAAAAAAB5/////gAAAAAAAAPf/////gAAAAAAAAH//////AAAAAAAAA//////+AAAAAAAAH//////4AAAAAAPg///////wAAAAAB8H///////gAAAAAPg///////8AAAAAB8H///////4AAAAAPg////////gAAAAAAB+D/////+AAAAAAAfwH/////8AAAAAAD+A//////4AAAAAAfwH//////gAAAAAD+A///////AAAAAAfgH//////8AAAAAD8AA//////wAAAAAfgAD//////AAAAAD+AAP/////8AAAAAfwAB//////wAAAAD+AAH//////AAAAAP/gA//////8AAAAB/8AH//////wAAAAP/gAf//////AAAAB/8AD//////8AAAAH/gAD//////wAAAA/4AH///////AAAAD/gA///////8AAAAP8f////////wAH4B/z/+P//////AA/AH/f/wP/////8AH4Af//AAH/////gD/AD//4AAD////+Af4AP/wAAAH////wD4AA//gAAD////+AfAAD//AAAf////wD4AAP/+AAD////+AAAAA//8AA/////gAAAAB//4A/////gAAAAAD////////+AAAAAAH////////4AAAAAAP////////AAAAAAAf///////8AAAAAAB///+P///wAAAAAAP///AP///AAAAAAB8AAAAP//8AAAAAAAAAAAAf//wAAAAAAAAAAAA///AAAAAAAAAAAAB//8AAAAAAAAAAAAH//wAAAAAA+AAAAAf//AAAAAAHwAAAAB//8AAAAAA+AAAAAD//wAAAAAHwAAAAAP//AAAAAA+AAAAAA//8AAAAAAAAAAAAD//wAAAAAAAAAAAAP//AAAAAAAAAAAAA//4AAAAAAAAAAAAD//gAAAAAB8AAAAAP/+AAAAAAPgAAAAA//4AAAAAB8AAAAAD//gAAAAAPgAAAAAP/8AAAAAB8AAAAAA//wAAAAAAAAAAAAD//AAAAAAAAAAAAAP/4AAAAAAAAAAAAB//AAAAAAAAAAAAAH/4AAAAAAAAAAAAAf/AAAAAAAAAAAAAB/4AAAAAAAAAAAAAH/A"},"mergus-merganser":{"w":93,"h":62,"bits":"4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/wAAAAAAAAAAAAH//gAAAAAAAAAAAB//+AAAAAAAAAAAAf//4AAAAAAAAAAAH///gAAAAAAAAAAB////wAAAAAAAAAAP////4AAAAAAAAAD/////gAAAAAAAAAf////8AAAAAAAAAD/////gAAAAAAf//f////8AAAAAB/////////gAAAAP/////////AAAAAP////////AAAAAB/////////4AAAAB//////////AAAAAf/////////8AAAH///////////gAAB//////////38AAAP///////////gAAB//////////78AAAP//////////fgAAB//////////78AAAP///////////gAAAf//////////8AAAA///////////gAAAAP/////////8AAAAAH/////////AAAAAAP////////wAAAAAAP///////8AAAAAAAAD/////4AAAAAAAAAAP+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"mimus-polyglottos":{"w":93,"h":51,"bits":"AAAAAAAAAAAP//8AAAAAAAAAAAD///+AAAAAAAAAAA////4AAAAAAAAAAP////AAAAAAAAAAD////4AAAAAAAAAB/////AAAAAAAAAA/////4AAAAAAAAAf/////AAAAAAAAAP/////4AAAAAAAAD/////4AAAAAAAAB/////+AAAAAAAAAf/////wAAAAAAAAP/////+AAAAAAAAD//////wAAAAAAAA//////8AAAAAAAAP//////gAAAAAAAD//////8AAAAAAAA///////gAAAAAAAP//////8AAAAAAAD///////gAAAAAAA///////8AAAAAAAH///////gAAAAAAD///////4AAAAAAA////////AAAAAAAP///////wAAAAAAD///////+AAAAAAA////////wAAAAAAf///////+AAAAAAH////////gAAAAAH////////8AAAAAH/////////AAAAAD/////////4AAAAD//////////AAAAD//////////wAAAD//////////+AAAB///////////gAAB///////////8AAA////////////AAA////////////gAAP///////////4AAH/////9/////+AAB////+AP/////gAA////+AB/////wAAH///+AAP////8AAA////AAD/////gAAH///AAA/////8AAA///gAAH/////gAAH//gAAA//+f/8AAA//gAAAH//B//gAAH/gAAAA//gP/8AAA/wAAAAH/wA//gAAA="},"mniotilta-varia":{"w":93,"h":58,"bits":"8AH/AAAAAAAAAAAHgH//AAAAAAAAAAA8D//+AAA+AAAAAAHg///8AAHwAAAAAAAP///wAA+AAAAAAAD////gAHwAAAAAAA////+AA+AAAAAAAP////+AAAAAAAAAP/////8AAAAAAAAH//////4AAAAAAAA///////wAAAAAAAH///////gAAAAAAA///////+AAAAAAAH///////8AAAAAAA////////8AAAAAAH////////4AAAAAAA////////wAAAAAAD////////AAAAAAAf///////+AAAAAAB////////8AAAAAAH////////wAAAAAA/////////AAAAAAH////////8AAAAAA/////////4AAAAAD/////////gAAAAAf/////////AAAAAD/////////+AAAAAf/////////8AAAAB//////////8AAAAP//////////+AAAB////////////AAAH////////////gAA/////////////AAD////////////+AAP////////////4AB/////////////AAH////////////4AAf////////////AAA////////////4AAD////////////AAAH///////////4AAAf//////////+AAAA////+AA/7//wAAAB////gAAAD/8AAAAD///wAAAAH/gAAAAH//4AAAAAAAAAAAAP/+AAAAAAAAAAAAAH4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAD4AAAAAAAAAHwAAAfAAAAAAAAAA+AAAD4AAAAAAAAAHwAAAfAAAAAAAAAAAAAAD4AAAAAAAAAAAA"},"molothrus-ater":{"w":93,"h":84,"bits":"AAAAAAAAAAP///gAAAAAAAAAAH////AAAAAAAAAAB////+AAAAAAAAAAf////8AAAAAAAAAH/////wAAAAAAAAB//////AAAAAAAAAP/////4AAAAAAAAD//////AAAAAAAAA//////4AAAAAAAAH//////AAAAAAAAB//////4AAAAAAAAf//////AAAAAAAAP//////4AAAAAAAH//////8AAAAAAAD//////4AAAAAAAA//////+AAAAAAAAf//////wAAAAAAAH//////8AAAAAAAD///////AAAAAAAA///////4AAAAAAAP//////+AAAAAAAD///////wAAAAAAA///////+AAAAAAAP///////wAAAAAAD///////+AAAAAAA////////wAAAAAAP///////+AAAAAAD////////wAAAAAA////////+AAAAAAP////////wAAAAAD////////+AAAAAA/////////wAAAAAP////////8AAAAAD/////////gAAAAA/////////8AAAAAP/////////AAAAAB/////////4AAAAAf////////+AAAAAH/////////wAAAAB/////////8AAAAAf/////////gAAAAD/////////4AAAAA//////////AAAAAH/////////wAAAAA/////////8AAAAAP/////////AAAAAB/////////wAAAAAf////////8AAAAAH/////////AAAAAA/////////wAAAAAP////////8AAAAAD/////////AAAAAAf////////wAAAAAH////////8AAAAAB/////////AAAAAAf////////wAAAAAH////////8AAAAAA////////+AAAAAAH////////gAAAAAA////////wAAAAAAH///////8AAAAAAB////////AAAAAAAf///////8AAAAAAH////4D//gAAAAAB////8Af/8AAAAAAf///+AB//gAAAAAH////AAH/8AAAAAB////gAAH/gAAAAAf///wAAAAAAAAAAH///4AAAAAAAAAAA////AAAAAAAAAAAH///wAAAAAAAAAAA///8AAAAAAAAAAAH///AAAAAAAAAAAA///4AAAAAAAAAAAH//+AAAAAAAAAAAA///gAAAAAAAAAAAH//8AAAAAAAAAAAA///AAAAAAAAAAAAH//wAAAAAAAAAAAA//+AAAAAAAAAAAAH//gAAAAAAAAAAAA//4AAAAAAAAAAAAH//AAAAAAAAAAAAAA="},"myadestes-townsendi":{"w":93,"h":72,"bits":"8AAAAAAAAAAAAAAHgP/8AAAAAAAAAAA8H//8AB8AAAAAAAAD///wAPgAAAAAAAP////AB8AAAAAAAH////8APgAAAAAAA/////wB8AAAAAAAH/////AAAAAAAAAA/////4AAAAAAAAAH/////gAAAAAAAAA/////+AAAAAAAAAD/////wAAAAAAAAAD/////AAAAAAAAAAH////8AAAAAAAAAAP////wAAAAAAAAAB/////AAAAAAAAAAH////8AAAAAAAAAA/////4AAAAAAAAAH/////gAAAAAAAAAf////+AAAAAAAAAD/////8AAAAAAAAAf/////wAAAAAAAAD//////gAAAAAAAAf/////+AAAAAAAAD//////4AAAAAAAAf//////wAAAAAAAD///////gAAAAAAAf//////+AAAAAAAD///////8AAAAAAAf///////wAAAAAAB////////AAAAAAAP///////8AAAAAAB////////4AAAAAAP////////AAAAAAA////////8AAAAAAH////////4AAAAAAf////////gAAAAAD/////////AAAAAAP////////8AAAAAB/////////4AAAAAH/////////gAAAAAf/////////AAAAAB/////////8AAAAAH/////////gAAAAAf////////+AAAAAA/////////wAAAAAH////////+AAAAAA/////////wAAAAAH////////+AAAAAA/////////4AAAAAH/////////gAAAAA/////////+AAAAAH////w////8AAAAAf//wAAP///wAAAAD//+AAAP///gAAAAH//wAAAP//+AAAAAD/+AAAAP//4AAAAAP/AAAAA///wAAAAA/gAAAAD///AAAAAAAAAAAAH//+AAAAAAAAAAAAf//4AAAAAAAAAAAB///AAAAAAAAAAAAH//4AAAAAAAAAAAAP//AAAAAAAAAAAAA//4AAAAAAAAAAAAD//AAAAAAAAAAAAAH/4AAAAAAAAAAAAAf/AAAAAAAAAAAAAA/4AAAAAAAAAAAAAA/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"myiarchus-cinerascens":{"w":93,"h":88,"bits":"AAAAAAAAAA+D4AAAAAAAAAAAAHwfAAAAAAAAAAAAA+D4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/AAAAAAAAAAAAAAf/AAAAAAAAAAAAAP/8AAAAAAAAAAAAD//wAAAAAAAAAAAA///AAAAAAAAAAAAH//8AAAAAAAAAAAB///gAAAAAAAAAAAf//+AAAAAAAAAAAH///wAAAAAAAAAAB///+AAAAAAAAAAAf///wAAAAAAAAAAH////AAAAAAAAAAA////+AAAAAAAAAAf////8AAAAAAAAAH/////wAAAAAAAAB/////+AAAAAAAAA//////wAAAAAAAAP/////+AAAAAAAAH//////wAAAAAAAB//////+AAAAAAAAf/////gAAAAAAAAH/////4AAAAAAAAA/////+AAAAAAAAAP/////gAAAAAAAAD/////8AAAAAAAAAf/////gAAAAAAAAH/////8AAAAAAAAA//////gAAAAAAAAH/////8AAAAAAAHw////+/gAAAAAAA+H/////8AAAAAAAHw//////AAAAAAAA+H/////4AAAAAAAHw/////+AAAAAAAA+H/////wAAAAAAAAA/////+AAAAAAAAAP/////gAAAAAAAAB/////+AAAA4AAAAP/////wAAAHAAAAD/////+AAAA4AAAAf/////4AAAHAAAAH//////AAAA4AAAA//////4AAAAAAAAP//////AAAAAAAAD//////4AAAAAAAH///////AAAAAAAP///////AAAAAAAf//////+AAAAAAA///////wAAAAAAA///////wAAAAAAAf//////+AAAAAAAD/////h+AAAAAAAAf////wAAAAAAAAAD////+AAAAAAAAAAf////gAAAAAAAAAAB///4AAAAAAAAAAAP7//AAAAAAAAAAAAA//wAAAAAAAAAAAAP/8AAAAAAAAAAAAB//gAAAAAAAAAAAAf/4AAAAAAAAAAAAD/+AAAAAAAAAAAAAf/wAAAAAAAAAAAAD/8AAAAAAAAAAAAAf/gAAAAAAAAAAAAD/4AAAAB8AAAAAAAf+AAAAAPgAAAAAAD8AAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAB8AAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAfAA"},"nucifraga-columbiana":{"w":93,"h":62,"bits":"////wB8AAAAAAAAH////APgAAAAAAAA////4B8AAAAAAAAH////gPgAAAAAAAA////8AAAAAAAAAAH////wAAAAAAAAAA////+AAAAAAAAAAH////4AAAAAAAAAAf////gAAAAAAAAAA////8AAAAAAAAAAD////wAAAAAAAAAAf///+AAAAAAAAAAD////4B+AAAAAAAAf////APwAAAAAAAD////8B+AAAAAAAAP////4PwAAAAAAAB/////h+AAAAAAAAP/////PgAAAAAAAD/////8AAAAAAAAAf/////wAAAAAAAAH//////gAAAAAAAA//////+AAAAAAAAH//////4AAAAAAAA///////gAAAAAAAH//////+AAAAAD4A///////4AAAAAfAH///////gAAAAD4A////////D8AAAfAH///////+fgAAD4A/////////8AAAAAH/////////gAAAAA/////////8AAAAAH/////////AAAAAA/////////8AAAAAH/////////wAAAAA//////////AAAAAD/////////8AAAAAf/////////wAAAAD//////////gAAAAP/////////+AAAAB//////////4AAAAH//////////gAAAA//////////+AAAAD//////////4AAAAP//////////wAAAA///////////gAAAD///////////AAAAP//////////8AAAA///////////8AAAD///////////4AAAP///////////gAAA////////////AAAD////////////AAPn////////////AB8f///////////4APx////////////AB+H///////////4APwf///////////AA+P////n//////4AHz////wAAAD///AAAf///4AAAAD//4AAD///+AAAAAB//A=="},"numenius-americanus":{"w":93,"h":93,"bits":"AAAAAAAAAAAAAAA4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfAAAAAAB8AAAAAAD4AAAAAAPgAAAAAAfAAAAAAB//wAAAAD4AAAAAAP//AAAAAfAAHwAAB//8AAAAAAAA+AAAP//wAAAAAAAHwAAB//+AAAAAAAA+AAAf//4AAAAAAAHwAAD///gAAAAAAA+AAAf///AAAAAAAAAAAD///+AAAD4AAAAB8f///8AAAfAAAAAPj////wAAD4AAAAB8f////gAAfAAAAAPj/////AAD4AAAfB8f////8AAfAAAD4Pj/////wAAAAAAfAH///f//gAAAAAD4P///8//+AAAAAAf/////h//4AAAAAB/////8D//gAAAAA//////wH/+AAAAA//////+Af/4AAAAP//////wA//AAAAH//////+AD/8AAAB///////wAP/gAAA///////+AAf8AAAP///////wAB/gAAH///////+AAP8AAD////////wAA/gAA////////+AAAAAAf////////wAAAAAH////////8AAAAAB/////////gAAAAA/////////8AAAAA//////////gAAAAf/////////8AAAAP/////////8AAAAB//////////AAAAAP/////////wAAAAB/////////8AAAAAP/////////gAAAAB/////////4AAAAAP////////+AAAAAB/////////AAAAAAH////////wAAAAAAf///////4AAAAAAD///////+AAAAAAAf/4P///+AAAAAfAB/4AP///AAAAAD4AAAAAB//gAAAAAfAAAAAAD/4AAAAAD4AAAAAAP+AAAAAAfAAAAAAB/wAAAAAAAAAAAAAP+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAPgAAAAAAAAAH/AAB8AAAAAAAAAA/4AAPgAAAAAAAAAH/AAB8AAAAAAAAAA/4AH/gAAAAAAAAAHwAB+AAAAAAAAAAA+AAPwAAAAAAAAAAAAAB+AAAAAAAAAAAAAAPwAAAAAAAAAAAAAB+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"nycticorax-nycticorax":{"w":93,"h":77,"bits":"4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/4AAAAAAAAAAAAP////gAAAAAAAAAH/////AAAAAAAAAB/////4AAAAAAAAAf/////wAAAAAAAAH//////AAAAAAAAA//////4AAAAAAAAf//////wAAAAAAAH///////gAAAAAAD///////+AAAAAAB////////8AAAAAAf////////wAAAAfn/////////AAAAD9/////////8AAAAfv/////////wAAAD9//////////gAAAfv/////////+AAAAB/8D///////4AAAAP4Af///////gAAAAAAB////////AAAAAAAH///////8AAAAAAAf///////wA4AAAAB////////AHAAAAAD///////8A4AAAAAP///////wHAAAAAAP//////+A4AAAAfAf//////wAAAAAD4A//////+AAAAAAfAB//////4AAAAAD4AH//////AAAAAAfAA//////4AAAAAAAAD//////AAAAAAAAAP/////4AAAAAAAAA//wB//AAAAAAAAAH/+AD/wAAAAAAAAAf/wAH8AAAAAAAAAD/+AAAAAAAAAAAAAP/wAAAAAAAAAAAAB/+AAAAAAAAAAAAAP/wAAAAAAAAAAAAB/+AAAAAAAAAAAAAf/wAAAAAAAPgAAAD/8AAAAAAAB8AAAAf/gAAAAAAAPgAAAD/8AAAAAAAB8AAAAf/AAAAAAAAPgAAAD/4AAAAAAAAAAAAA//AAAAAAAAAAAAAP/wAAAAAAAAAAAAB/+AAAAAAAAD4AAAP/wAAAAAAAAfAAAB/8AAAAAAAAD4AAAP/gAAAAAAAAfAAAB/gAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"oreothlypis-ruficapilla":{"w":62,"h":93,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/8AAAAAAAH//wAAAAAAD//+AAAAAAB////AAAAAA////wAAAAAf///8AAAAAP////AAAAAH////wAAAAD////8AAAAB////+AAAAAf///+AAAAAf////AAAAAf////wAAAAP////8AAAAH////+AAAAD/////gAAAB/////4AAAA/////8AAAAf/////AAAAP/////4AAAH/////+AAAD//////gAAB//////4AAA//////+AAAf//////AAAP//////wAAD//////8AAB///////AAAf//////gAAP//////4AAD//////+AAB///////AAA///////gAAf//////4AAf//////8AAP//////+AAD///////AAA///////gAAP//////wAAD//////4AAA//////+AAAP//////wAAH//////8AAD///////AAB//+H///wAAf/8AD//8AAP/+AA///AAH//AAP//wAD//gAD//4AA//wAAf/8AAP/4AAA/8AAD/8AAAD4AAA//AAAAAAAAP/gAAAAAAAD/wAAAAAAAA/4AAAAAAAAPwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"pandion-haliaetus":{"w":93,"h":61,"bits":"4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAAAAAAAAAAAAD/+AAAAAAAAAAAAAf/4AAAAAAAAAAAAH//gAAAAAAAAAAAA//8AAAAAAAAAAAAH//wAAAAAAAAAAAA//+AAAAAAAAAAAAH//wAAAAAAAAAAAA///AAAAAAAAAAAAH//+AAAAAAAAAAAA///+AAAAAAAAAAAP///8AAAAAAAAAAB////wAAAAAAAAAAP////gAAAAAAAAAB////+AAAAAAAAAAP////4AAAAAAAAAB/////wAAAAAAAAAP/////AAAAAAAAAB/////4AAAAAAAAAP/////gAAAAAAAAA/////+AAAAAAAAAH/////4AAAAAAAAA//////AAAAAAAAAD/////8AAAAAAAAAf/////wAAAAAAAAB//////AAAAAAAAAH/////8AAAAAAAAA//////gAAAAAAAAD/////+AAAAAAAAAf/////wAAAAAAAAB/////+AAAAAAAAAD/////4AAAAAAAAAP/////AAAAAAAAAA/////+AAAAAAAAAD/////4AAAAAAAAAP/////wAAAAAAAAA//////AAAAAAAAAP/////8AAAAAAAAD//////gAAAAAAAA//////8AAAAAAAAH//////gAAAAAAAB//////+AAAAAAAAP/8f///wAAAAAAAB//gH//+AAAAAAAAP/8AB//wAAAAAAAB//gAH/+AAAAAAAAH/4AAf/wAAAAAAAA/8AAB/4AAAAAAAAA/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"passer-domesticus":{"w":93,"h":74,"bits":"AAAAAAAAAAA///8AAAAAAAAAAAf///wAAAAAAAAAAH////wAAAAAAAAAB/////AAAAAAAAAAf////4AAAAAAAAAD/////AAAAAAAAAA/////4AAAAAAAAAP/////AAAAAAAAAB/////4AAAAAAAAAf/////AAAAAAAAAD/////4AAAAAAAAA//////AAAAAAAAAP/////wAAAAAAAAD/////4AAAAAAAAA/////+AAAAAAAAAf/////wAAAAAAAAH/////+AAAAAAAAB//////wAAAAAAAA//////8AAAAAAAAP//////AAAAAAAAD//////4AAAAAAAA//////+AAAAAAAAP//////wAAAAAAAH//////+AAAAAAAB///////wAAAAAAAf//////+AAAAAAAH///////wAAAAAAB///////+AAAAAAA////////wAAAAAAP///////+AAAAAAD////////wAAAAAB////////+AAAAAAP////////gAAAAAH////////8AAAAAB/////////gAAAAAf////////4AAAAAH/////////AAAAAA/////////wAAAAAP////////+AAAAAD/////////gAAAAA/////////8AAAAAH/////////AAAAAD/////////4AAAAA/////////+AAAAAP/////////gAAAAD/////////4AAAAA/////////+AAAAAH/////////gAAAAA/////////4AAAAAH////////+AAAAAA/////////AAAAAAP////////wAAAAAD////////4AAAAAB////////+AAAAAAf////////AAAAAAH/////////4AAAAD//////////4AAAA///////////AAAAP///+AP////4AAAD///+AAP////wAAB///8AAB/////AAAf//8AAAP////4AAH//+AAAB/////AAB///gAAAP////4AAf//4AAAAf////AAH//+AAAAD////4AA///AAAAAf+f/gAAH//wAAAAAAAAAAAA//8AAAAAAAAAAAAH/+AAAAAAAAAAAAA//gAAAAAAAAAAAAH/4AAAAAAAAAAAAA/+AAAAAAAAAAAAAH/gAAAAAAAAAAAAAA"},"passerculus-sandwichensis":{"w":93,"h":90,"bits":"AP///gAAAAAAAAAAH///+AAAAAAAAAAH////4AAAAAAAAAD/////gAAAAAAAAA/////8AAAAAAAAAH/////wAAAAAAAAA/////+AAAAAAAAAH/////4AAAAAAAAA//////AAAAAAAAAH/////8AAAAAAAAA//////gAAAAAAAAH/////8AAAAAAAAA//////gAAAAAAAAH/////+AAAAAAAAA//////wAAAAAAAAH/////+AAAAAAAAAH/////4AAAAAAAAB//////AAAAAAAAAP/////8AAAAAAAAD//////wAAAAAAAAf//////AAAAAAAAH//////+AAAAAAAA///////4AAAAAAAH///////gAAAAAAA///////+AAAAAAAH///////4AAAAAAA////////gAAAAAAH///////+AAAAAAA////////4AAAAAAH////////gAAAAAA////////+AAAAAAH////////4AAAAAA/////////AAAAAAH////////8AAAAAA/////////wAAAAAH/////////AAAAAA/////////8AAAAAH/////////wAAAAA//////////AAAAAH/////////8AAAAA//////////gAAAAH/////////+AAAAA//////////4AAAAH//////////gAAAA//////////+AAAAD//////////wAAAAf//////////AAAAB//////////4AAAAP//////////gAAAA//////////+AAAAH//////////4AAAAf//////////AAAAB//////////8AAAAH//////////gAAAA//////////+AAAAD//////////4AAAAP//////////AAAAA//////////4AAAAB//////////AAAAAH/////////8AAAAAP/////////gAAAAA/////////+AAAAAB/////////4AAAAAH/////////gAAAAAf////////+AAAAH//////////4AAAD///////////gAAA//////8P///+AAAf/////8Af///4AAH////gAAA////gAA////+AAAB///+AAH////wAAAD///4AA////+AAAAH///gAH////wAAAAH//+AA//Af+AAAAAP//4AAAAAAAAAAAA///gAAAAAAAAAAAD//+AAAAAAAAAAAAP//wAAAAAAAAAAAA///AAAAAAAAAAAAD//8AAAAAAAAAAAAP//wAAAAAAAAAAAA///AAAAAAAAAAAAD//4AAAAAAAAAAAAP//AAAAAAAAAAAAA//4AAAAAAAAAAAAD//AAAAAAAAAAAAAP/4AAAAAAAAAAAAA//AAAAAAAAAAAAAD/4AAAAAAAAAAAAAP/A"},"passerella-iliaca":{"w":93,"h":58,"bits":"8///AAAAAAAAAAAHv//+AAAAAAAAAAA////4AAAAAAAAAAA////gAAAAAAAAAAP///+AAAAAAAAAAD////4AAAAAAAAAA/////gAAAAAAAAAH////+AAAAAAAAAA/////4AAAAAAAAAH/////gAAAAAAAAA/////+AAAAAAAAAH/////8AAAAAAAAA//////4AAAAAAAP3//////gAAAAAAB+P//////AAAAAAAPw//////8AAAAAAB+D//////4AAAAAAPwf//////wAAAAAB+D///////gAAAAAAAf///////AAAAAAAD///////+AAAAAAAf///////4AAAAAAD////////wAAAAAAf////////AAAHwAD////////8AAA+AAf////////4AAHwAB/////////wAA+AAP/////////gAHwAB//////////AA+AAP/////////8AAAAB//////////4AAAAP/9////////4AAAA//gH///////4AAAH/wAD///////4AAA/8AAAB//////4AAD/gAAAP//////4AAf+AAAD7//////4AB/4AAAfP//////4AH/gAAD4///////wAf/AAAf8///////AB/+AAP////////4AH/4AH/////////AAf/4f////wfH//4AB//z////gD4D//AAD//////wAAAD/4AAP/////4AAAAD/AAAf////8AAAAAAAAAA/////AAAAAAAAAAB////gAAAAAAAAAA////gAAAAAAAAAAf///wAAAAAAAAAAf///4AAAAAAAAAAf////gAAAAAAAAAH////+AAAAAAAAAA/////wAAAAAAAAAH////+AAAAAAAAAA/////wAAAAAAAAAH/+f/+AAAAAAAAA"},"passerina-amoena":{"w":93,"h":77,"bits":"4AAAAAAAAA/AAAH/AAAAAAAAAH4AAA/4AAAAAAAAA/AAAH4AAAAAAAAAD4AAA/AAAAAAAAAAAAAAH4AAAAAAAAAAAAAA/AAAAAAAAAAAAAAAAAAAAAAAAAA//gAAAAAAAAAAAA///gAAAAD4AAAAA///+AAAAAfAAAAAP///8AAAAD4AAAAH////wAAAAfAAAAB////+AAAAD4AAAAf////4AAAAAAAAAH/////AAAAAAAAAB/////+AAAAAAAAAf/////4AAAAAAAAH//////gAAAAA+AD//////+AAAAAHwB///////4AAAAA+Af///////AAAAAHx////////4AAAAA+P////////AAAAAAB////////4AAAAAAP////////AAAAAAD////////gAAAAAB////////gAAAAAAP///////4AAAAAAD////////AAAAAAA////////wAAAAAAf///////+AAAAAAH////////wAAAAAB/////////AAAAAAf////////4AAAAAH/////////AAAAAB/////////4AAAAAf/////////AAAAAH/////////4AAAAB//////////AAAAAf/////////4AAAAD//////////AAAAA//////////4AAAAH//////////AAAAA//////////4AAAAf//////////AAAAH//////////wAAAB///////8//+AAAAf///////P//wAAAH///////j//+AH8A///////4///gA/gf//////////4AH8P///////////AA/n///////////wAH////////////8AA/////////////gAB////////////4AAP///////////+AAD////////////gAA////////////z4AH///gB//////8fwA///wAH//////D+AH//4AA//////gfwA//8AAH/////wD+AH/+AAA/////4AfwA//AAAH////8AAAAH/gAAA+f///gAAAA+AAAAAB/+B8AAAAHwAAAAAD/wPgAAAA+AAAAAAP+B8AAAAAAAAAAAA/wPgAAAAAAAAAAAD+B8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfAAAAAAAAAAAAAAD8AAAAAAAAAAAAAAfgAAAAAAAAAAAAAD8AA="},"passerina-cyanea":{"w":93,"h":93,"bits":"AA//AP/wH34fgAD/gf//B/+A+/D8AAf8P///P/wH34fgAD/j///5/+A+/D+AAf8////A//H/4HwAD/v///4H/4/4A+AAfH////8f/H/AHwAD7/////h/4/4A+AAA/////8H/A/AHwAAH/////vgD/4+AAAA/////98Af//wAAAH/////PgD//+APgA/////58Af///5/wH/////PgD////v/w/////9/+//4P9/+H/////v////B/v/w/////9/////f8H+H////////////g/w////////////8D4H////////////AAAA///////////vgAHz///////4//98AA///////4AH/APj4H/////+AAPgAB8f+//////4AD+AAPn/3//////gAfwAAA/+f/////+AD+D8AH/z5/////4Af//gA//fP/////gD//8A//7//////+D///gH//f//////4fD/8A//7///////j///AH//f//////+f+H/A//7///////7/wD4f//f////////+AfD5+79////////wD4fP3AP///////+A/D5+4B////////wP4fP3AP///////+B/AB/wB////////wP4AP+AD///////+B/AAHwAf//////8AP4D/+AD///////wB+B//wAP//////+AAAP/gAB///////+D99/8AAP///////9/vv/g8A/////////99/wHgH/////////vn+A8+/////////9+fwHn//////////v/+A8/f////////x/vgAH5////////+P8AAA/P//////////gAAH4/////////78AAAAD/////////fAAAAH/////////4+AAfH//////////HwAD8/3////////A+AAfn+f///////8HwAD8/x////////5++Afn4H////////Pv/j8/Af////////9/8/nwB/////////v/n8AAH////////9/8/3wA/////////v///+AH////////g+f//wA////////8AD///wH3///////gAf//+AAP//////8D7///wAB/////////ffw+AAP////////7/8HwHx/////////f/g+A//////////4H/8AH/j/3//////A//gA/8f/n/////wHz8AH/h/+A////+A8f4AD8A/wB////5/j/AAAAH+AD/////Af4AA+A/wAf////4P/AAH4H+AD/////B/4Af/x//4f////4P/gD/+P//A/////B//4f/x//4H/////v//D/+P//P/////8B/4f/5//5//////gP/D//D4AP/D///8Hz4B/4AAB+AP///g+AAP/AAAPwA///8PwAAH4AAB/8f//4B+AAAfAD4Pv////APwAAD8AfAB////4B8AAAfgD4AP////APgAAD8AfAB////4A="},"patagioenas-fasciata":{"w":93,"h":83,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/gAAAAAAAAAAAAH//AAAAAAAAAAAAB//8AAAAAAAAAAAAf//wAAAAAAAAAAAD///AAAAAAAAAAAAf//4AAAAAAAAAAAH///gAAAAAAAAAAB///8AAAAAAAAAAAf///wAAAAAAAAAAD///+AAAAAAAAAAA////wAAAAAAAAAAH////AAAAAAAAAAA////8AAAAAAAAAAH////gAAAAAAAAAA////+AAAAAAAAAAD////wAAAAAAAAAAA////gAAAAAAAAAAH///+AAAAAAAAAAA////+AAAAAAAAAAH////8AAAAAAAAAA/////4AAAAAAAAAH/////4AAAAAAAAA//////wAAAAAAAAH//////gAAAAAAAA//////+AAAAAAAAH//////8AAAAAAAA///////wAAAAAAAD///////gAAAAAAAf///////gAAAAAAD////////AAAAAAAf///////8AAAAAAB////////wAAAAAAP////////AAAAAAB////////8AAAAAAP////////4AAAAAA/////////4AAAAAH/////////wAAAAAf/////////wAAAAD//////////gAAAAP//////////gAAAB//////////+AAAAH//////////wAAAAf/////////+AA8AB//////////wAHgAH/////////+AA8AAP/////////wAHgAA/////////+AA8AAB/////////4AAAAAD/////////gAAAAAH/////////AAAAAAf////////+AAAAAB/////////8AAAAAH/////////4AAAAAf/+AB/////gAAAD///AAAf////AAAD///wAAAf///4AAD///+AAAB////AAA////wAAAD///4AAH///+AAAAD///AAA////wAAAAH//4AAH///4AAAAAP//AAA///+AAAAAAf/wAAH///wAAAAAAHwAAAAf8AAAAAAAAAAAAAD/AAAAAAAAAAAAAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAA="},"pelecanus-erythrorhynchos":{"w":93,"h":52,"bits":"8AAAAAAAAAAAAA/ngAAAAAAAAAAAAP/8AAAAAAAAAAAAB//AAAAAAH/wAAAB//4AAAAAB/+AAAD//4AAAAAAf/4AAA///AAAAAAD//AAAP//4AAAAAB//4AAD///AAAAAAf//AAAf//4AAAAAH//4AAD///AAAAAB///AAA///4AAAAA///4AAH///AAAAAP///AAB///4AAAAD///4AAf///AAAAA////AAH///4AAAP////4AD////4AA//////H//////wAf///////////////////////////////////////////////////////////////////////////////////+f//////////////z//////////////+f//////////////3///////////////////////////////////////////////////////////////////P//////////////wP/////////////8Af/////////////AAA////////////AAAAf//////////AAAAAf/////////4AAAAAAA////////AAAAAAAAD//////8AAAAAAAAB//////gAAAAAAAAA/H///8AAAAAAAAAAA////gAAAAAAAAAAP///8AAAAAAAAAAD////gAAAAAAAAAA////8AAAAAAAAAAP////gAAAAAAAAAD////8AAAAAAAAAB//3//AAAAAAAAAAP/+f/wAAAAAAAAAB//x/+AAAAAAAAAAP/+H/gAAAAAAAAAB//gAAAAAAAAAAAAP/4AAAAA="},"pelecanus-occidentalis":{"w":93,"h":67,"bits":"+AAAAD/4AAAAAAAHwAAAAf/gAAAAAAA+AAAAP/+AAAAAAAAAAAAB//4AAAAAAAAAAAA///wAAAAAAAAAAAH///AAAAAAAAAAAA///8AAAAAAAAAAAH///wAAAAAAAAAAA////AAAAAAAAAAAH///4AAAAAAAAAAB////AAAAAAAAAAAf///4AAAAAAAAAAH////AAAAAAAAAAB////wAAAAAAAAAAP///8AAAAAAAAAAD////AAAAAAAAAAAf///wAAAAAAAAAAD///+AAAAAAAAAAA/////8AAAAAAAAAH/////wAAAAAAAAA//////AAAAAAAAAH/////+AAAAAAAAA//////4AAAAAAAAH//////wAAAAAAAA///////gAAAAAA////////+AAAAAAP////////8AAAAAD/////////4AAAAAf/////////wAAAAD//////////AAAAA//////////+AAAAH//////////8AAAA///////////gAAAH//////////8AAAA////////P//gAAAH///////gf/8AAAAf//////gAP/gAAAB//////AAAH8AAAAP/////4AAAAAAAAB8P////gAAAAAAAAAB////8AAAAAAAAAAH////gAAAAAAAAAA////8AAAAAAAAAAD////gAAAAAAAAAAP///4AAAAAAAAAAB////AAAAAAAAAAAH///wAAAAAAAAAAA///+AAAAAAAAAAAD///gAAAAAAAAAAAf//4AAAAAAAAAAAD///AAAAAAAAAAAAf//4AAAAAAAAAAAD//+AAAAAAAAAAAAf//wAAAAAAAAAAAH//8AAAAAAAAAAAB///gAAAAAAAAAAAP//4AAAAAAAAAAAB//+AAAAAAAAAAAAP//gAAAAAAAAAAAB//4AAAAAAAAAAAAP/+AAAAAAAAAAAAB//AAAAAAAAAAAAAH/wAAAAAAAAAAAAA/8AAAAAAAAAAAAAD+AAAAAAAAAAAAAAPgAAAAAAAAAAAAAAAAAAAAAAAAA="},"perisoreus-canadensis":{"w":93,"h":58,"bits":"AP//4AAAAAAAAAAAH///wAAAAAAAAAAB////AAAAAAAAAAAf///+AAAAAAAAAAD////4AAAAAAAAAA/////gAAAAAAAAAf////8AAAAAAAAAH/////gAAAAAAAAA/////8AAAAAAAAAH/////wAAAAAAAAA//////AAAAAAAAAH/////8AAAAAAAAA//////4AAAAAAAAH//////gAAAAAAAA///////AAAAAAAAAf/////8AAAAAAAAA//////4AAAAAAAAD//////gAAAAAAAAP/////+AAAAAAAAB//////4AAAAAAAAP//////gAAAAAAAB//////+AAAAAAAAP//////4AAAAAAAB///////gAAAAAAAP///////AAAAAAAB///////8AAAAAAAP///////wAAAAAAA///////+AAAAAAAH///////8AAAAAAAf///////wAAAAAAD///////+AAAAAAAf///////wAAAAAAB////////AAAAAAAP///////+AAAAAAA////////8AAAAAAH////////4AAAAAAf////////4AAAAAB/////////wAAAAAH/////////AAAAAAf////////+AAAAAB/////////8AAAAAH/////////4AAAAAf/////////wAAAAA//////////wAAAAD//////////gAAAAP//////////AAAAAf/////////+AAAAB///8AH////4AAAAP//8AAP////wAAAB//4AAAf////AAAAP/AAAAA////4AAAB/wAAAAB////AAAAP8AAAAAH///4AAAAAAAAAAAP///AAAAAAAAAAAAf//4AAAAAAAAAAAA///AAAAAAAAAAAAB//4AAAAAAAAAAAAD/+A"},"petrochelidon-pyrrhonota":{"w":93,"h":93,"bits":"AAAAfgAAAAAH3wAAAA+D8AAAAAA++AAAAHwfgAAAAAH3wAAAA+D8AAAAAHw+AAAD/wfgAAAAA+HwAAAf+AAAAAAAHwAAAAD8AAAAAAAA+AAAAAfgAAAAAAAHwAAAAD8AAAAAAAAD8AAAAfgAAAAAAfgfgAAAAAAAAAAAH8D8AAAAAAAAAAAA/gfgAAHwAAAAAAAP8D8AAA+AAAAA+AB/gAAAAHwAAAAHwAP8AAAfA+AAAAA+AB/AAAD4HwAAAAHwAPwAAAfAAAAAAA+AB8AAAD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+AAAAAAAAAAAAAP/+AAAAAAAAAAAAD//8AAAAAAAAB8AA///wAAAAAAAAPgAP///AAAAAAAAB8AP////gAAAAAAAPgH////8AAAAAAAB8A/////gAAAAAAAAAH////8AAAAAAAAAA/////gAAAAAAAAAH/////AAAAAAAAAAf////8AAAD8AAAAAP////4AAAfgAAAAB/////gAAD8AAAAAH/////wAAfgAAAAA/////+AAD8AAAAAH/////4AAfgAAAAA//////gAAAAAAAAH/////+AAAAAAAAA//////4AAAAAAAAH//////wAAAAAAAA///////AAAAAAAAH//////8AAAAAAAA///////wAAAAAAAD///////AAAAAAAAf//////8AAAAAAAB///////wAAAAAAAP///////AAAAAAAB///////+AAAAAAAH///////4AAAAAAAf///////gAAAAAAD////////AAAAAfgP///////8AAAAD8A////////wAAAAfgB////////gAAAD8AH////////AAAAfgAf///////8AAAD8AB////////4AAAAAAD////////AAAAAAAf///////4AAAAAAD////////AAAAPgAf///////4AAAB8AD//8/////AD8APgAf/4B////4AfgB8AD//AD////AD8APgAf34AH///4AfgAAAB+AAAP///AD8AAAAPwAAAP//wAAAAAAAAAAAA///AAAAAAAAAAAAD//8AAAAAAAAAAAAP//gAAAAAAAAAAAA//8AAAAAAAAAPgAD//gAAAAAAAAB8AAP/8AAAAAAAAAPgAA//AAAAAAAAAB8AAD/4AAAH4AAAAPgAAP/gAAA/AAAAAAAAA/8AAAH4AAAAAAAAD/gAAA/AAAAAAAAAP8AAAH4AAAAAAAAA/gAAAfAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAA+HwAAAAAAAAAAAAHw+AAAAAAAAAAAAA+AAAAAAAAAAAA="},"phainopepla-nitens":{"w":93,"h":77,"bits":"+f4AAAAAAAAAAAAH3/wAAAAAAAAAAAA+/+AAAAAAAAAAAAHH/4AAAAAAAAAAAAA//AAAAAAAAAAAAAH/+AAAAAAAAAAAAA//wAAAAAAAAAAAAP//gAAAAAAAAAAAB//8AAAAAAAAAAAAP//wAAAAAAAAAAAB///AAAAAAAAAAAAP//+AAAAAAAAAAAB///4AAAAAAAAAAAP///wAAAAAAAAAAD////AAAAAAAAAAAf///8AAAAAAAAAA/////gAAAAAAAAAH////+AAAAAAAAAA/////wAAAAAAAAAH/////AAAAAAAAAA/////4AAAAAAAAAH/////gAAAAAAAAA/////8AAAAAAAAAH/////4AAAAAAAAAP/////gAAAAAAAAB/////+AAAAAAAAAH/////8AAAAAAAAA//////wAAAAAAAAD//////AAAAAAAAAf/////8AAAAAAAAD//////wAAAAAAAAf//////AAAAAAAAD//////8AAAAAAAA///////wAAAAAAAH///////AAAAAAAA///////8AAAAAAAH///////wAAAAAAA////////AAAAAAAH///////8AAAAAAA////////wAAAAAAD////////gAAAAAAf///////+AAAAAAD////////wAAAAAAf////////AAAAAAD////////4AAAAAAP////////gAAAAAB////////8AAAAAAP////////wAAAAAA/////////AAAAAAH////////+AAAAAA/////////4AAAAAD/////////wAAAAAf/////////wAAAAB//////////gAAAAH//////////AAAAAP/////////+AAAAB//////////8AAAAD//////////8AAAAP//////////4AAAAP//////////wAAAAD//4B//////gAAAAD/8AB/////+AAAAAD+AAAD////8AAAAAAAAAAD////4AAAAAAAAAAH////wAAAAAAAAAAP////AAAAAAAAAAAf///4AAAAAAAAAAA////AAAAAAAAAAAB///4AAAAAAAAAAAB///AAAAAAAAAAAAD//4AAAAAAAAAAAAH/8AAAAAAAAAAAAAf/gAAAAAAAAAAAAA/8AAAAAAAAAAAAAB/gAAAAAAAAAAAAAB8AAAAAAAAAAAAAAAAA="},"phalacrocorax-auritus":{"w":81,"h":93,"bits":"8AAAAAAAAAAAAHgAAAAAAAAAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf8AAAAAAAAAAA//5/AAAAAAAAAP///8AAAAAAAAD////gAAAAAAAA////8AAAAAAAAH////gAAAAAAAB////8AAAAAAAAf////gAAAAAAAD////8AAAAAAAAf///wAAAAAAAAH///wAAAAAAAAA///4AAAAAAAAAH//+AAAAAAAAAA///AAAAAAAAAAH//wAAAAAAAAAA//8AAAAAAAAAAH//AAAAAAAAAAA//4AAAAAAAAAAH//gAAAAAAAAAA//+AAAAAAAAAAH//4AAAAAAAAAA///gAAAAAAAAAH//+AAAAAD/AAAf//wAAAAB/+AAD//+AAAAA//wAAP//4AAAAP//AAB///AAAAH//8AAP//4AAAB///wAD///AAAAf///gB///4AAAH////Af///AAAB////+P///4AAAf/////////AAAH/////////4AAA//////////AAAP/////////4AAD//////////AAAf/////////4AAH/////////+AAA//////////wAAH/////////+AAA//////////4AAP//////////AAB//////////4AAP//////////AAB//////////4AAP//////////AAB//////////wAAP/////////+AAB//////////gAAP/////////8AAB//////////AAAP/////////4AAAA////////+AAAAH////////wAAAAf///////+AAAAB////////gAAAAD///////8AAAAAD///////AAAAAAP//////4AAAAAAP/////+AAAAAAA//////gAAAAAAf/////8AAAAAAD//////AAAAAAA//////wAAAAAAP/////8AAAAAAP//////AAAAAAH//////wAAAAAH//////8AAAAAD///////AAAAAB///////wAAAAA///////8AAAAAf///////wAAAAH////////gAAAA/////////AAAAH///4/////gAAA///+AB///+AAAH///gAP///4AAA///4AB////AAAH//8AAP///4AAA///AAAD///AAAA/wAAAAD//4AAAAAAAAAAA//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"phalaenoptilus-nuttallii":{"w":93,"h":62,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//AAAAAAAAAAAAB//+AAAAAAAAAAAA///8AAAA+AAAAAAf///4AAAHwAAAAAP////wAAA+AAAAAf/////AAAHwAAAB//////8AAA+AAAB///////gAAAAAAD///////8AAAAAAH////////gAAAAAD////////8AAAAAD////////8AAAAAD/////////AAAAAP/////////wAAAAP/////////+AAAAD//////////wAAAAf/////////+AAAAD//////////wAAAAf/////////+AAAAD//////////wAAAAf/////////+AAAAD//////////wAAAD//////////+AB4D///////////wAPD///////////+AB5////////////gAPP///////////8AB5////////////AAAP///////////wAAB///////////8AAAP///////////vgAA///////////58AAH//H///////+PgAAf/AAH//////B8fAD+AAAP/////wPj4AAAAAAf////4AAfAAAAAAA////+AHz4AAAAAAB////AA+fAAAAAAAB//+AAHwAAAfAAAAAAAAAA+AAAD4AAAAAAAAAHwAAAfAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAA=="},"phasianus-colchicus":{"w":93,"h":68,"bits":"+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHgAAAAAAAAAAAAAA4AAAAAAAD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/AAAAAAAAAAAAAD/+AAAAAAAAAAAAA//8AAAAAAAAA+AAP//wAAAAAAAAHwAD//+AAAAAAAAA+AAf//wAAAAAAAAHwAD//+AAAAAAAAA+AAf//wAAAAAAAAAAAD//8AAAAAAAAAAAAD//gAAAAAAAAAH/gP/+AAAAAAAAA///A//wAAAAAAAD///4P//gAAAAAAH////B//+AAAAAAP////4P///AAAAAP/////B////gAAAP/////4P////gAAP//////B/////8AH////4AAP/////8H////8AAB///////////8AAAP//////////8AAAA//////////+AAAAH//////////AAAAA//////////AAAAAH/////////wAAAAA/////////wAAAAAD////////4AAAAAAf///////8AAAAAAB///////+AAAAAAAP//////+AAAAAAAA///////wAAAAAAAH//////8AAAAAAAAf//////gAAAAAAAB//////4AAAAAAAAH/////+AAAAAAAAAf/////gAAAAAAAAB/////gAAAAAAAAAH////8AAAAAAAAAAf///4AAAAAAAAAAA///8AAAAAAAAAAAB//+AAAAAAAAAAAAH//gAAAAAAAAAAAAf/wAAAAAAAAAAAAD/4AAAAAAAAAAAAAf+AAAAAAAAAAAAAD/wAAAAAAAAAAAAAf+AAAAAAAAAAAAAB/wAAAAAAAAAAAAAH8AAAAAAAAAAAAAA/gAAAAAAAAAAAAAHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"pheucticus-melanocephalus":{"w":93,"h":93,"bits":"AAf///AAAAAAAAAAAP////AAAAAAAAAAH////8AAAAAAAAAD/////4AAAAAAAAB//////gAAAAAAAA//////+AAAAAAAAP//////wAAAAAAAD///////AAAAAAAA///////8AAAAAAAH///////wAAAAAAA////////AAAAAAAH///////4AAAAAAA////////gAAAAAAH///////+AAAAAAA////////4AAAAAAH////////AAAAAAAP///////8AAAAAAAf///////wAAAAAAA///////+AAAAAAAA///////4AAAAAAAD///////gAAAAAAAP//////+AAAAAAAA///////4AAAAAAAD///////wAAAAAAAH///////AAAAAAAAf//////8AAAAAAAB///////wAAAAAAAH///////AAAAAAAA///////8AAAAAAAD///////wAAAAAAAf///////AAAAAAAB///////8AAAAAAAP///////wAAAAAAB////////AAAAAAAP///////8AAAAAAB////////wAAAAAAP///////+AAAAAAB////////4AAAAAAP////////gAAAAAB////////8AAAAAAP////////wAAAAAB/////////AAAAAAP////////4AAAAAA/////////gAAAAAH////////8AAAAAA/////////wAAAAAH////////+AAAAAA/////////4AAAAAD/////////AAAAAAf////////8AAAAAD/////////wAAAAAP////////+AAAAAB/////////4AAAAAP/////////AAAAAA/////////4AAAAAH/////////gAAAAAf////////8AAAAAD/////////wAAAAAP////////+AAAAAB/////////4AAAAAH/////////AAAD4A/////////8AAAfAD/////////gAAD4AP////////+AAAfAB/////////wAAD4AH////////+AAAAAAf////////4AAAAAB/////////AAAAAAH////////4AAAAAAf////////gAAAAAB////////8AAAAAAH////////gAAAAAA////////+AAAAAAD////////wAAAAAAP///////+AAAAAAA////////wAAAAAAD////////AAAAAAAP///////4AAAAAAB////////gAAAAAAH///////8AAAAAAAf////7//gAAAAAAB///////8AAAAAAAD///////wAAAAAAAf//////+AAAAAAAD///////wAAAAAAAf//////+AAAAAAAD///////wAAAAAAAP//////+AAAAAAAAPz/////wAAAAAAAAAAP///+AAAAAAAAAAB////gAAAAAAAAAAH///4AAAAAAAAAAAH///AA="},"pica-nuttalli":{"w":93,"h":53,"bits":"AAAAAAAAAAAA/+AAAAAAAAAAAAAf/8AAAAAAAAAAAAH//8AAAAAAAAAAAA////AAAAAAAAAAAP///4AAAAAAAAAAB////AAAAAAAAAAAf///4AAAAAAAAAAD////AAAAAAAAAAA////gAAAAAAAAAAH///8AAAAAAAAAAB///4AAAAAAAAAAAP//4AAAAAAAAAAAH///AAAAAAAAAAAB///4AAAAAAAAAAA///+AAAAAAAAAAAP///wAAAAAAAAAAD///+AAAAAAAAAAA////wAAAAAAAAAAP///+AAAAAAAAAAH////wAAAAAAAAAB////+AAAAAAAAAA/////wAAAAAAAAAf////+AAAAAAAAAP/////wAAAAAAAAD/////+AAAAAAAAB//////gAAAAAAAAf/////8+AAAAAAAH//////HwAAAAAAB//////4+AAAAAAA///////HwAAAAAA///////w+AAAAAAf//////+AAAAAAAH///////gAAAAAAD///////4AAAAAAD///////+AAAAAAD////////gAAAAAH////////4AAAAAH////////+AAAAAP/////v///gAAAAf////+Af//4AAAA/////+AA//+AAAD/////+AAA//gAAA/////+AAAH/8AAAH////8AAAA//wAAA////8AAAAH//AAAH///4AAAAA//4AAA///wAAAAAD//gAAD/4AAAAAAAf/8AAAAAAAAAAAAB//gAAAAAAAAAAAAH/8AAAAAAAAAAAAA//gAAAAAAAAAAAAD/8AAAAAAAAAAAAAAAAAAAA="},"picoides-arcticus":{"w":62,"h":93,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAAAAAAP/AAAAAAAAD//8AAAAAAA///4AAAAAAP///AAAAAAD///4AAAAAAP///AAAAAAB///wAAAAAAP//8AAAAAAB///gAAAAAAf//4AAAAAAP//+AAAAAAP///gAAAAAP///4AAAAAH///+AAAAAD////gAAAAB////4AAAAA////4AAAAAf///8AAAAAH///+AAAAAB////AAAAAA////gAAAAAP///wAAAAB////8AAAAAf////AAAAAH////wAAAAB////8AAAAAf////AAAAAH////wAAAAB////4AAAAAf///+AAAAAH////gAAAAB////4AAAAAf///8AAAAAH////AAAAAAf///gAAAAAH///4AAAAAA///8AAAAAAP///AAAAAAD///wAAAAAA///8AAAAAAH//+AAAAAAB///gAAAAAAf//wAAAAAAH//8AAAAAAB///AAAAAAAf//gAAAAAAP//4AAAAAAD//+AAAAAAB///AAAAAAA///gAAAAAAf//4AAAAAAH//8AAAAAAD///AAAAAAA///gAAAAAAP//4AAAAAAD//+AAAAAAA///gAAAAAAP//wAAAAAAD//4AAAAAAA//AAAAAAAAH/gAAAAAAAB/4AAAAAAAAf8AAAAAAAAH/AAAAAAAAB/wAAAAAAAAf8AAAAAAAAH+AAAAAAAAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"pinicola-enucleator":{"w":93,"h":62,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//AAAAAAAAAAAAAP/+AAAAAAAAAAAAH//4AAAAAAAAAAAB///gAAAAAAAAAAAf//+AAAAAAAAAAAD///4AAAAAAAAAAAf///AAAAAAAAAAAD///8AAAAAAAAAAAf///wAAAAAAAAAAD////gAAAAAAAAAAP///+AAAAAAAAAAAf///8AAAAAAAAAAD////wAAAAAAAAAAf////AD4AAAAAAAD////8AfAAAAAAAAP////wD4AAAAAAAB/////AfAAAAAAAAP////8D4AAAAAAAB/////4AAAAAAAAAP/////gAAAAAAAAB/////+AAAAAAAAAP/////4AAAAAAAAB//////gAAAAAAAAP/////+AAAAAAAAB//////4AAAAAAAAH//////gAAAAAAAA//////+AAAAAAAAD//////wAAAAAAAAf//////AAAAAAAAB//////8AAAAAAAAH//////wAAAAAAAA///////AAAAAAAAD//////8AAAAAAAAP//////gAAAAAAAA//////8AAAAAAAAD//////gAAAAAAAAH/////8AAAAAAAAA//////gAAAAAAAAf/////wAAAAAAAAH//////AAAAAAAAA//////4AAAAAAAAH//+f//gAAAAAAAA//+B//+AAAAAAAAH//wD//4AAAAAAAA/4AAH//gAAAAAAAAAAAA//+AAAAAAAAAAAAD//4AAAAAAAAAAAAP//gAAAAAAAAAAAA//8AAAAAAAAAAAAH//gAAAAAAAAAAAAf/8AAAAAAAAAAAAB//gAAAAAAAAAAAAH/8AAAAAAAAAAAAAf/gAAAAAAAAAAAAB/gAAAAAAAAAAAAAP4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"pipilo-chlorurus":{"w":93,"h":53,"bits":"4AAAAAAAAAH///wHAAAAAAAAAA////g4AAAAAAAAAH///+HAAAAAAAAAAP////AAAAAAAAAAP////4AAAAAAAAAB/////AAAAAAAAAAP////4AAAAAAAAAB/////AAAAAAAAHwf////4AAAAAAAA+H/////AAAAAAAAHw/////4AAHwAAAA+P/////AP++AAAAHx/////A///wAAAAAf////g////AAAAH/////4H////AAAf/////+A/////AAf//////gH////+Af//////8A//////////////gH/////////////+A//////////////wA/////////////+AAf////////////4AAf////////////AAB////////////4AAP////////////AAB8///////////4AAPg///////////AAAAA//////////4AAAAA//////////AAAAAB/////////wAAAAAD////////+AAAAAAP////////wAAAAAA////////8AAB8AAB////////gAAPgAD////////4AAB8AAfP///////AAAPgAD4///////wAAB98AfB//////8AHAPvgD4H//////gA4AB8AAAf/////98HAAPgAAB//////vg4AB8AAAP/////98HAAAAAAB/////wPgAAAAAAAP////8B8AAAAAAAB/////wP+AAAAAAAH/////AHwAAAAAAA//A//8A+AAAAAAAD/+H//gHwAAAAAAAH/w//8A+AAAAAAAAf/H//gHwAAAAAAAD/4H/8A+AAAAAAAAP/Af/gAAA="},"pipilo-erythrophthalmus":{"w":58,"h":93,"bits":"+AAAAAAAAD4AAAAAAAAPgAAAAAAAA+AAAAAAAADwAAAAAAAAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP+AAAAAAAD/+AAAAAAA//+AAAAAAD//8AAAAAAf//4AAAAAB///wAAAAAP///gAAAAA////AAAAAH///8AAAAA////4AAAAD////gAAB+P////AAAH4////8AAAfj////wAAB+P////AAAH4H///+AAAAA////4AAAAH////gAAAA/////AAAAH////8AAAAf////wAAAD/////AAAAf////+AAAB/////4AAAH/////gAAA/////+AAAD/////4AAAf/////gAAB/////+AAAP//P//4AAA//4P+/gAAD//gf3+AAAP/8AAf4AAB//wD7/gAAH/+Af/+AAAf/4B//4AAB//AP//gAAP/8D//+AAA//wP//wAAD//h///AAAP/////8AAA//////gAAD/////+AAAP/////wAAB/////+AAAH/////wAAA/////+AAAD/////wAAAf////+AAAD/////gAAAf////+AAAB//8f74AAAP//gAPgAAA//+AA+AAAH//wAD4AAA//+AAPgAAD//4AA+AAAP//AAAAAAA//8AAAAAAD//gAAAAAAP/8AAAAAAA//wAAAAAAD/+AAAAAAAAAAAAAAAAAAAAAAAAAAAAfAAAAAAAAB8AAAAAAAAHwAAAAAAAAfAAAAAAAAB8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"pipilo-maculatus":{"w":73,"h":93,"bits":"A////AAAAAAAD////wAAAAAAP////8AAAAAAH/////AAAAAAD/////wAAAAAB/////8AAAAAA//////AAAAAAf/////gAAAAAP/////4AAAAAH/////+AAAAAD//////AAAAAA//////wAAAAAH/////4AAAAAD/////+AAAAAB//////AAAAAA//////wAAAAAf/////8AAAAAP//////AAAAAH//////wAAAAD//////8AAAAD///////AAAAB///////wAAAA///////8AAAA////////AAAAf///////wAAAP///////8AAAH///////+AAAD////////gAAB////////4AAA////////8AAAf////////AAAP////////gAAH////////4AAD////////8AAB//z//////AAA//w//////wAAf/wf/////4AAP/4P/////8AAH/AD//////AAD/gB//////gAB/wAf/////4AA/8AP/////8AAP/AD//////AAH/gA//////gAD/wAP/////wAA/4AD/////8AAf+AAf////+AAP/AAH/////AAD/wAD/////gAB/8AA/////4AAf/gAf////8AAP/4AH/////AAD/8AB/////gAA//AAf////4AAP/gAH////8AAH/wAB/////AAB/8AAA////wAAf/AAAf///4AAH/wAAP///8AAB/+AAH///+AAAf/gAD////AAAH/wAB////gAAB/4AAH///wAAA/8AAD///gAAAP+AAAf//wAAAD+AAAH//8AAAAAAAAA//+AAAAAAAAAf//gAAAAAAAAH//wAAAAAAAAD//8AAAAAAAAA//+AAAAAAAAAf//gAAAAAAAAH//4AAAAAAAAD//8AAAAAAAAA///AAAAAAAAAf//gAAAAAAAAH//4AAAAAAAAD//8AAAAAAAAB///AAAAAAAAAf//gAAAAAAAAH//4AAAAAAAAD//8AAAAAAAAA//+AAAAAAAAAf//AAAAAAAAAP//gAAAAAAAAD//wAAAAAAAAB//4AAAAAAAAAf/8AAAAAAAAAP/+AAAAAAAAAD//AAAAAAAAAB//gAAAAAAAAAf/wAAAAAAAAAH/4"},"piranga-ludoviciana":{"w":48,"h":93,"bits":"4AAAAAAA4AAAAAAA4AAAAAAA4AAAAAAA4AAAAAAAAAAAAAAAAA+AAAAAAA+AAAAAAB+AAAAAAB+AAAAAAB+AAAAAAB8AAAAA4B8f+AAA4AD//gAA4AP//+AA4Af///4A4A////4AAB////4AAD////4AAD////4AAH////4AAH////wAAH////AAAP///8AAAP///4AAAP///wAAAP///wAAAP///gAAAf///wAAAf///wAAAf///4AAAf///4AAA////8AAA////+AAA////+AAA/////AAA/////AAA/////gAA/////gAA/////gAA/////wAA/////wAA/////wAA/////wAA/////wAA/////4AA/////4AA/////4AA/////4AA/////4AAf////8AAf////8AH/////8AH/////8AH3////8AH3////8AHz////8AAB////8AAB////8AAA/////AAAf////AAAf////AAAP////AAAH////AAAD///8AAAB///8AAAA///8AAD4f//+AAD4P//+AAD4H//+AAH4D///AAH4B///AAH4A///gAH4Af//wAH4AP//wAH4AH//4AHwAH//8AHwAD//8AHwAD//+AHwAD//+AAAAD///D4AAB///D4AAB///D4AAB///D4AAB///D4AAD///AAAAD///AAAAH//+AAAAH//4AAAAP/+AAAAAP/8AAAAAPwAAAAAAPwAA"},"piranga-rubra":{"w":93,"h":82,"bits":"8AAAAAAAAAAAAAAHgAAAAAAAAAAAAAA8AD/wAAAAAAAAAAHAAf+AAAAAf/AAAAAAD/wAAAAf//AAAAAAf+AAAAH//8AAAAAD/wAAAD////AAAAAA+AAAA////+AAAAAAAAAAP////4AAAAAAAAAD/////AAAAAAAAAAf////4AAAAAAAAAH/////AAAAAAAAAA/////4AAAAAAAAAP////+AAAAAAAAAD/////AAAAAAAAAA/////AAfAAAAAAAf////wAD4AAAAAAH////8AAfAAAAAAB/////AAD4AAAAAAf////wAAfAAAAAAP////8AAAAAAAAAD/////AAAAAAAAAA/////4AAAAAAAAAH/////AAAAAAAAAB/////4AAAAAAAAAf/////AAAAAAAAAH/////4AAAAAAAAA//////AAAAAAAAAP/////wAAAAAAAAD/////+AAAAAAAAA//////wAAAAAAAAP/////+AAAAAAAAB//////gAAAAAAAAf/////8AAAAA+AAH//////AAAAAHwAA//////4AAAAA+AAP/////+AAAAAHwAB//////gAAAAA+AAP/////8AAAAAAAAD//////AAAAAAPgAf/////wAAAAAB8AD/////8AAAAAAPgAf/////gAAAAAB8AH/////8AAAAAAPgA//////gAAAAAAAAP/////8AAAAAAAAD/////vgAAAAAAAA/////4AAAAAAAAAH////8AAAAAAAAAB////+AAAAAAAAAAf///+AAAAAAAAAAD////AAAAAAAAAAA////wAAAAAAAAAAH///wAAAAAAAAAAA///8AAAAAAAAAAAH///AAAAAAAAAAAA///wAAAAAAAAAAAD//8AAAAAAAAAAAAP//AAAAAAAAAAAAD//wAAAAAB8AAAAAf/8AAAAAAPgAAAAH//gAAAAAB8AAAAA//4AAAAAAPh8AAAP//AAAAAAB8PgAAB//wAAAAAAAB8AAAf/+AAAAAAAAPgAAD//gAAA+AAAB8AAA//8AAAHwAAAAAAAH//AAAA+AAAAAAAB//+AAAHwAAAAAAAP//wAAA+AAAAAAAB//+AAAAAAAAAAAAf//wAAAAAAAAAAAD//+AAAAAAAAAAAAf/4AAAAAAAAAAB8D//AAAAAAAAAAAPgf/wAAAAAAAAAAB8D/8AAAAAAAAAAAPgf/AAAAAAAAAAAB8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"plegadis-chihi":{"w":93,"h":62,"bits":"8AAAAAAAAAAAAAAHgAAAAAAAAAAAAAA8AAAAAAAAAAAAAAAAAAAP/AAAAAAAAAAAAAH/8AAAAAAAAAAAAB//wAAAAAAAAAAAAP//AAAAAAAAAAAAD//4AAAAAAAAAAAA///AAAAAAAAAAAAP//8AAAAAAAAAAAD///gAAAAAAAAAAA///8AAAAAAAAAAAf///gAAAAAAAAAAH///8AAAAAAAAAAB////gAAAAAAAAAAf///9/4AAAAAAAAH//////+AAAAAAAB////////AAAAAAAP///////+AAAAAAD/+//////8AAAAAA//H//////4AAAAAH/w///////wAAAAB/8H///////AAAAAP/A///////8AAAAD/wH///////4AAAAf8A////////wAAAD/AH////////gAAAf4A////////+AAAD+AH////////4AAAfwA/////////gAAD8AD////////+AAAfAAf////////4AAAAAB/////////wAAAAAH/////////AAAAAAf////////8AAAAAB/////////gAAAAAD////////8AAAAAAP////////gAAAAAA////////8AAAAAAD////////gAAAAAAP///////8AAAAAAAf///////gAAAAAAA///////8AAAAAAAB////wP/gAAAAAAAD///4AP4AAAAAAAAP/+AAAAAAAAAAAAA//wAAAAAAAAAAAAH/wAAAAAAAAAAAAAf8AAAAAAAAAAAAAB/gAAAAAAAAAAAAAP8AAAAAAAAAAAAAB/gAAAAAAAAAAAAAH8AAAAAAAAAAAAAA/gAAAAAAAAAAAAAH8AAAAAAAAAAAAAA/gAAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"podiceps-nigricollis":{"w":93,"h":62,"bits":"4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfgAAAAAAAAAAAAAP/AAAAAAAAAAAAAH/8AAAAAAAAAAAAD//4AAAAAAAAAAAA///AAAAAAAAAAAAP//8AAAAAAAAAAAD///gAAAAAAAAAAAf//8AAAAAAAAAAAH///gAAAAAAAAAAB///+AAAAAAAAAAA////wAAAAAAAAAAf///+AAAAAAAAAAH////wAAAAAAAAAA////+AAAAAAAAAAH////wAAAAAAAAAA////+AAAAAAAAAAH////AAAAAAAAAAA////4AAAAAAAAAAAA///AAAAAAAAAAAAB//4P//8AAAAAAAAH/+////8AAAAAAAB///////4AAAAAAAP////////wAAAAAD/////////gAAAAAf////////8AAAAAH/////////gAAAAA/////////8AAAAAH/////////gAAAAA/////////8AAAAAP/////////gAAAAB/////////8AAAAAP/////////wAAAAB/////////+AAAAAP/////////wAAAAA/////////+AAAAAH/////////4AAAAA//////////AAAAAH/////////4AAAAAf/////////AAAAAD/////////4AAAAAP////////gAAAAAAP///////gAAAAAAAAf////+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"podilymbus-podiceps":{"w":93,"h":62,"bits":"+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/4AAAAAAAAAAAAD//wAAAAAAAAAAAA///AAAAAAAAAAAAP//4AAAAAAAAAAAD///gAAAAAAAAAAAf///AAAAAAAAAAAD////AAAAAAAAAAA////8AAAAAAAAAAH////gAAAAAAAAAA////8AAAAAAAAAAH////gAAAAAAAAAA////8AAAAAAAAAAH////AAAAAAAAAD////wAAAAAAAAAD////4AAAAAAAAAD/////wAAAAAAAAA//////AAAAAAAAAf/////8AAAAAAAAH//////gAAAAAAAD//////+AAAAAAAB///////wAAAAAAD///////+AAAAAAA////////wAAAAAAP///////+AAAAAAB////////wAAAAAAP///////+AAAAAAB////////wAAAAAAP///////+AAAAAAB////////wAAAAAAD///////+AAAAAAAf///////wAAAAAAD///////8AAAAAAAf///////AAAAAAAD///////wAAAAAAAf//////4AAAAAAAB//////4AAAAAAAAH/////wAAAAAAAAAf////wAAAAAAAAAAH//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"poecile-gambeli":{"w":93,"h":58,"bits":"4AAAAAAAAAB+AAAHAAAAAAAAAAPwAAA4AB/+AAAAAB+AAAAAB//+AAAAAPwAAAAA///4AAAAAAAAAAAf///wAAAAAAAAAAH////AAAAAAAAAAA////+AAAAAAAAAAP////8AAAAAAAAAD/////wAAAAAAAAA/////+AAAAAAAAA//////4AAAAAAAAP//////gAAAAAAAB//////+AAAAAAAAP//////8AAAAAAAB///////wAAAAAAAP//+P///gAAAAAAB///z/f//gAAAAAAH////5//+AAAAAAAH///////8AAAAAAAf///////wAAAAAAD////////wAAAAAAf////////gAAAAAB/////////AAAAAAH////////8AAAAAAf////////4AAAAAD/////////wAAAAAP/////////AAAAAB/////////8AAAAAP/////////wAAAAB//////////AAAAAP/////////4AAAAB//////////wAAAAH+f////////AAAAA/7////////+AAAAH//////////4AAAA///////////8AAAD///////////+AAAf///////////+AAD////////////8AAP////////////4AA/////////////AAH////////////4AAf////////////AAB////////////4AAH///////+H///AAAf//////8AH//4AAB//////+AAD//AAAD//////wAAD/4AAAP/////4AAAD/AAAAf////+AAAAAAAAAA/////AAAAAAAAAAA////gAAAAAAAAAAAf//wAAAAAAAAAAAAA/4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"poecile-rufescens":{"w":93,"h":56,"bits":"AP///8AAAAAAAAAAD////wAAAAAAAAAA/////AAAAAAAAAAP////8AAAAAAAAAD/////wAAAAAAAAAf/////gAAAAAAAAH/////+AAAAAAAAA//////8AAAAAAAAH//////8AAAAAAAB///////4AAAAAAA////////gAAAAAAH////////gAAAAAA/////////gAAAAAH/////////AAAAAA/////////+AAAAAH/////////8AAAAA//////////wAAAAH//////////wAAAAD//////////AAAAAf/////////+AAAAB//////////wAAAAD//////////gAAAAP//////////AAAAA////////////gAAH////////////8AAf/////////////AD/////////////4Af/////////////AB/////////////4AP/////////////AB/////////////4AH/////////////AA/////////////4AD/////////7///AAf/////////Af/4AB/////////4AAAAAH///////3+AAAAAAf//////8AAAAAAAB///////AAAAAAAAH//////wAAAAAAAAf/////8AAAAAAAAB//////AAAAAAAAAD/////gAAAAAAAAAH////wAAAAAAAAAB////wAAAAAAAAAAf///+AAAAAAAAAAD////gAAAAAAAAAAf///4AAAAAAAAAAD////AAAAAAAAAAAf///wAAAAAAAAAAD/wP/AAAAAAAAAAAf8B/4AAAAAAAAAAD/gP/AAAAAAAAAAAf8B/4AAAAAAAAAAB+AP/AAAAAAAAAAAHwB/4AAAAAAA"},"polioptila-caerulea":{"w":93,"h":92,"bits":"AAAHwAAAfAAAAAAAAA++AAAD8AAHwAAAAH3wAAAfgAA+AAAAA+AAAAD8AAHz/AAAHwAAAAPgAA+f4AAA+AAAAB8AAHz/AAP//gAAAAAAAAf4AB/B8A+AAAAAAD/AAP4PgHwAAAAAPgAAB/B8A+AAAAAB8AAAP4PgHwAAAAB//gAB+AAA+AAAAAP/8AAAAAAAAAAAAB//gAAAAAAAAAAAAPz8AAAAAAAAAAAAB+fgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHwAAAAAAA/gAAAAA+AAAAAAAH8AAAAAHwAAAAAA+/gAAAAA+AAAAAAH38AAAAAHwAAAAAA+/gAAAAAAAAAAAAHx8AAAAAAAAAAAAA+PgAAAAAAAAA/AAAB8AAAAAAAAAH8AA+AAAAAAAAAAA/gAHwAAAAAAAfgAH8AA+AAAAH4A//wA/gAHwAfAA/Af//gB8AA+AD4PH4H///AAAAB8AfB//D///8AA+APgD4P/7////4AHwB8AfB/g/////4A+APgAA/8H/////4HwB8AAH3g//////w+AAAAA+8H//////gAAAAAHwA///////gAAAAA+AH///////AAAAAAAAD//////8AAAAAAAAP//////4AAAAAAAA///////wAAAAAAAD///////AAAAAB8Af///////4AAAAPgB////////AAAAB8AP///////4AAAAPgA////////AAAAB8AH///////8AAAAAAA////////4AAAAAAD////////4AAAAAAf////////+AAAAAB/////////wAAAAAP/////////wfAAfA//////////j4AD4D///////////4AfgP///////////AD+A///////////4AfwB////+A/////AD+AH////gA////4APx8P///8AB////AA+PgP//vgAB///4AAB8AA+AAAAD///AAAPgAAAAAAAH//4AAB8AAAAAAAAH//AAAPgAAfAAAAA+D4AAAAAP/4AAAAAAfAAAAAB//AAAAAAD/AAAAAP/4AAAAAH/4AAAAB//AAAAAB+HAAAAAP/4AAAAAfw4AAAAB8AAAAAAD+HAAAAAAAAAAAAAfwAAAAAAAAAAAAAD+AAAAAAAAAAAAAAf+AAAH/gAAAAAAAB/wD4A/8AAAAAfAAP+AfAH/gAAAAD4AB/wD4A/8AAAAAfAAP+AfAH/gAAAAD4AB8AD/8f4AAAAAfAAPgAA/g+AAAAAAAAAAAAH8AAAAAAAAAAAAAA/gAAAAAAAAAAAAB/8AAAAAAAAAAAAAPgAAAAAAAAAAAAAB8AAPgAAAAAAAAAAPgAB8AAAAAAAAAAB8AAPgAAAAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAB8AAAAAAAAAAAAAAAAAAAAAAAAAA="},"pooecetes-gramineus":{"w":93,"h":72,"bits":"4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAD/wAAAAAAAAAAAAD//wAAAAAAAAAAAA///AAAAAAAAAAAAP//8AHwAAAAAAAAH///wA+AAAAAAAAD////AHwAAAAAAAA////8A+AAAAAAAAH////gHwAAAAAAAA////+AB8AAAAAAAH////wAPgAAAAAAA////+AB8AAAAHwAH////4APgAAAA+AAP////AB8AAAAHwAAf///+APgAAAA+AAA////4AAAAAAHwAAH////gAAAAAAAAAAf////AAAAAAAAAAD////+AAAAAAAAAAf////4AAAAAAAAAD/////wAAAAAAfAAf/////AAAAAAD4AD/////8AAAAAAfAAf/////4AAAAAD4AD//////gAAAAAfAAf//////AAAAAAAAD//////8AAAAAAAAf//////4AAAAAAAD///////wAAAAAAAP///////wAAAAAAB////////gPgAAAAP////////h/AAAAA////////+P4AAAAH////////9/AAAAAf7////////4AAAAD/v////////AAAAAP/f///////4AAAAB/8////////4AAAAH/4////////4AAAAf/x////////wAAAB//x////////wAAAH//5////////gAAAf///////////AAAA///////////8AAAB///////////gAAAB////+P////8AAAA/////AAA///gAAAf////AAAA//8AAAH////4AAAA//gAAB////+AAAAB/4AAAP////wAAAAAAAAAD///8AAAAAAAAAAA///+AAAAAAAH4AAP///wAAAAAAA/AAB////8AAAAAAH4AAf////wAAAAAA/AAD/5///AAAAAAH4AA/8D//4AAAAAAAAAH/AD9/AAAAAAAAAA/4AfH4AAAAAAAAAP8AAAfAAAAAAAAAB/AAAD4AAAAAAAAAP4AAAAAAAAAAAAAB+AAAAAAAAAPgAAAPwAAAAAAAAB8AAAB8AAAAAAAAAPgAAAAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"progne-subis":{"w":52,"h":93,"bits":"4AAAAAAADgAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/wAAAAAB//wAAAAAP//gAAAAB///AAAAAP///AAAAA///+AAAAH///4AAAAf///gAAAB///+AAAAP///4AAAB///+AAAAH///gAAAA///8AAAAH///wAAAAf///gAAAD///+AAAAf///4AAAD////gAAAf///+AAAB////4AAAP////gAAA////8AAAD////wAAAf////AAAB////8AAAP////gAAA////+AAAH////4AAAf////gAAD////8AAAP////wAAA////+AAAD////wAAAf////AAAB////4AAAH////gAAA////8AAAD////4AAAf////gAAB////+AAAP////4AAA/////gAAH////+AAAf///8AAAD////AAAAP///4AAAB///wAAAAH//+AAAAA///4AAAAD///AAAAAf//4AAAAB///gAAAAH//8AAAAAf//gAAAAB//+AAAAAB//4AAAAAB//AAAAAAP/8AAAAAA//wAAAAAH/+AAAAAAf/4AAAAAB//gAAAAAP/8AAAAAA//wAAAAAH//AAAAAAf/4AAAAAB//gAAAAAH/+AAAAAAf/wAAAAAB//AAAAAAAH8AAAAAAAfgAAAAAAB+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"psaltriparus-minimus":{"w":93,"h":71,"bits":"Af///AAAAAAAAAAAP///8AAAAAAAAAAD////4AAAAAAAAAAf////gAAAAAAAAAH////+AAAAAAAAAA/////4AAAAAAAAAf/////AAAAAAAAAH/////8AAAAAAAAA//////wAAAAAAAAH/////+AAAAAAAAA//////4AAAAAAAAH//////AAAAAAAAA//////8AAAAAAAAH//////gAAAAAAAA//////+AAAAAAAAD//////8AAAAAAAAP//////wAAAAAAAB///////AAAAAAAAP//////8AAAAAAAB///////wAAAAAAAP///////AAAAAAAB///////4AAAAAAAP///////gAAAAAAD///////+AAAAAAAf///////4AAAAAAD////////AAAAAAAf///////8AAAAAAD////////wAAAAAAf////////AAAAAAD////////8AAAAAAf////////wAAAAAD/////////AAAAAAf////////4AAAAAD/////////gAAAAAf////////+AAAAAB/////////4AAAAAP/////////AAAAAB/////////8AAAAAP/////////gAAAAA/////////+AAAAAH/////////wAAAAA//////////AAAAAH/////////8AAAAAf/////////wAAAAD//////////AAAAAP/////////8AAAAA//////////gAAAAH/////////+AAAAAf/////////8AAAAB//////////wAAAAP//////////gAAAA///////////AAAAD//////////8AAAAP//////////4AAAA///////////gAAAB///////////AAAAH//////9///8AAAAP////+AH///4AAAA/////AAP///gAAAA////gAAf///AAAAB///wAAB///8AAAAH//wAAAD///wAAAA/8AAAAAP///gAAAH/AAAAAAf//+AAAA/gAAAAAB///4AAAAAAAAAAAD///AAAAAAAAAAAAP//4AAAAAAAAAAAAf//AAAAAAAAAAAAB//4AAAAAAAAAAAAD//AAAAAAAAAAAAAP/4A=="},"quiscalus-mexicanus":{"w":93,"h":44,"bits":"///+AAAAAAAAAAAH///8AAAAAAAAAAA////wAAAAAAAAAAH////wAAAAAAAAAA/////4AAAAAAAAAD/////wAAAAAAAAAD/////gAAAAAAAAAP/////AAAAAAAAAA/////8AAAAAAAAAD/////4AAAAAAAAAf/////wAAAAAAAAD//////wAAAAAAAAP//////gAAAAAAAA///////AAAAAAAAH//////8AAAAAAAAf//////4AAAAAAAD///////gAAAAAAAP///////AAAAAAAA///////8AAAAAAAD///////wAAAAAAAP///////gAAAAAAA////////AAAAAAAD///////+AAAAAAAP///////+AAAAAAB////////+AAAAAAH////////+AAAAAA/////////+AAAAAH//////////AAAAAf//////////AAAAB///////////gAAAD///////////gAAAP///////////AAAAf//8P//////4AAAB//+AA//////AAAAD//gAAf////4AAAAP/4AAA/////AAAAD/+AAAD////4AAAA//gAAAP////AAAH//8AAAAf///4AAH///4AAAA////AAA////AAAAD/v/4AAH///4AAAAH4f/AAA////AAAAAAAAAAAH///4AAAAAAAAA="},"recurvirostra-americana":{"w":44,"h":93,"bits":"4AAAAAAOAAAAAADgAAAAAA4AAAAAAOAAAAAADgAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgAAAAAP/AAAAAH/4AAAAD//AAAAA//wAAAAP/+AAAAH//gAAAH//4AAAD//+AAAD///gAAB///4AAA///+AAA////gAAP///wAAD///8AAA/7//gAAP8//+AAD8P//4AA+D///AAAA///8AAAP///gAAD///8AAA////gAAP///8AAD////gAAf///4AAH////AAB////wAAf///+AAH////wAB////+AAP////gAD////8AAf////AAH////4AA////+AAH////wAA////8AAH////AAA////wAAP///8AAB////APwf/z/wP+D/8f8f/g//D/H/4P/4AB//D/+AAf/w//gAH/8H/4AB//B/+AAf/wf/gAH/n3/4AAAB9/+AAAB/f/gAAAf3/4AAAH9/+AAAB/f/gAAAf3/4AAAAB//AAAAAf/wAAAAH/8AAAAD//AAAAf//wAAAH//+AAAB///gAAAf//4AAAH//+AAAB///gAAAP//wAAAD//8AAAAA//AAAAAAfwAAAAAH4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"regulus-calendula":{"w":82,"h":93,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAAAAAAAAPgAAAAAAAAfgAA+AAAAAAAAH/AAD4AAAAAAAA/8AAPgAAAAAAAH/8AAAAAAAAAAB//8AAAAAAAAAAP//wAAAAAAAAAB///AAAAAAAAAAP//8AAAAAAAAAD///wAAP/9/gAAf///AAH//////////8AA///////////gAP//////////8AB///////////AAP//////////4AB//////////+AAH//////////wAA//////////8AAD//////////gAAf//////////gAB///////////AAP//////////8AD///////////wAf///////////AD///////////8AP///////////wA///////////+AD///////////AAP//////////wAA//////////8AAAP/////////gAAAf////////+AAAA/////////wAAAB/////////AAAAH////////4AAAAP////////AAAAAf///////4AAAAB////////gAAAAD///////8AAAAAP///////wAAAAAf////n/+AAAAAA///////4AAAAAD///////AAAAAAD//////4AAAAAAP//////AAAAAAAf/////4AAAAAAAf////+AAAAAAAA/////wAAAAAAAAf///8AAAAAAAAAP//4AAAAAAAAAAAPwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAAAAAAAAPgAAAAAAAAAAAA+AAAAAAAAAAAAD4AAAAAAAAAAAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"regulus-satrapa":{"w":77,"h":93,"bits":"4B8AAAAAAAAABwD4AAAAAAAAADgHwAAAAAAAAAAAPgAAAAAAAAAAAfAAAAAAAAPgAA+AAAAAAAAfA4AAAAAAAAAA+BwAAAAAAAAAB8DgAAAAAAAAAD4HAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgAAAAAAAAAAAfAAAAAAAAAAAA+AAAAAAD//AAB8AAAAAAP//gAD4AAAAAB///gAAAAAAAAH///wAAAAAAAP////wAAAAAAA/////gAAAAAAB/////gAAAAAAD/////gfAAAAAH/////A+AAAAAP/////B8AAAAAf////+D4AAAAAP////+HwAAAAAH////8AAAAAAAP////8AAAAAAAf////4AAAAAAAf////4AAAAAAA/////4AAAAAAB/////4AAAAAAD/////8AAAAAAH/////8AAAAAAP/////8AAAAAAf/////4AAAAAA/3////4AAAAAD/j////4AAAAAH+D////4AAAAAP+H////4AAAAAf8f/////AAAAA/4/////+AAAAB/x/////8AAAAB/j/////4AAAAD/H/////4AAAAH/P/////4AAAAP/f/////4AAAAf+//////wAAAA/+//////wAAAA/9//////gAAAB/9//////gAAAB/8//////gAAAD/8//////gAAAD//f/////gAAAH//H/////gAAAH//x/////AAAAP////////gAAAP////////wAAAP////////4AAAP////////8AAAP////////8AAAP////////8AAAP////////8AAAP////////4AAAf////gD//wAAA////+AD//gAAAA///gAB//AAAAAP/4AAA/+AAAAAD/AAAA/+AAAAAH8AAAAf8AAAAAAAAAAAD4AAAAAAAAAAAHwAAAAAAAAAAAPgAfAAAAAAAAAAAA+AAAAAAAAAAAB8AAAAAAAAAAAD4AAAAAAAAAAAHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAAAAAAAHwAAAAAAAAAAAPgAAAAAAAAAAAfAAAAAAAAAAAA+AAAAAAD4AAAAAAAAAAAHwAAAAAAAAAAAPgAAAAAAAAAAAfAAAAAAAAAAAA+AAAAAAAAAAAAAAAAAAAAAAAA="},"riparia-riparia":{"w":93,"h":82,"bits":"AAAAAAAAAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfwAAAAAAAAAAAAAf/wAAAAAAAAAAAAP//AAAAAAAAAAAAD//+AAAAAAAAAAAA///4AAAAAAAAAAAP///gAAAAAAAAAAD////AAAAAAAAAAA////8AAAAAAAAAAH////gAAAAAAAAAA////8AAAAAAAAAAP////gAAAAAAAAAD////8AAAAAAAAAA////+AAAAAAAAAAP////AAAAAAAAAAD////wAAAAAAAAAA////+AAAAAAAAAAP////wAAAAAAAAAD////+AAAAAAAAAA/////wAB8AAAAAAP////+AAPgAAAAAD/////wAB8AAAAAA/////+AAPgAAAAAP/////wAB8AAAAAH/////+AAPgAAAAA//////gAAAAAAAAf/////8AAD4AAAAH//////gAAfAAAAA//////4AAD4AAAAP//////AAAfAAAAD//////wAAD4AAAA//////8AAAAAAAAf//////gfAAAAAAH//////4D4AAAAAB//////+AfAAAAAA///////gD4AAAAAP//////4AfAAAAAD///////AAAAAAAB///////wAAAAAAA///////4AAAAAAAP//////+AAAAAAAH///////gAAAD4AD///////wAAAAfAA///////4AAAAD4AP//////+AAAAAfAH//////+AAAAAD4D///////AAAAAAAA///////AAAAAAAAH//////wAAAAAAAA//////8AAAAAAAAH//////AAAAAAAAA//8P//wAAAAAAAAD/wD//4AAAAAAAAAAAA//+AAAAAAAAAAAAP//gAAAAAAAAAAAD//wAAAAAAAAAAAAf/+AAAAAAAAAAAAH//gAAAAAAAAAAAB//8AAAAAAAAAAAAf//AAAAAAAAAAAAD//wAAAAAAAAAAAAf/+AAAAAAAAAAAAD//gAAAAAAAAAAAAf/4AAAAAAAAAAAAD//AAAAAAAAAAAAAD/wAAAAAAAAAAAAAf+AAAAAAAAAAAAAD/gAAAAAAAAAAAAAf4AAAAAAAAAAAAAD/AAAAAAAAAAAAAAfwAAAAAAAAAAAAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"rynchops-niger":{"w":93,"h":62,"bits":"8AAH+AAAHwAAfwAHgAA/wAAA+AAD+AA8fAH+AAAHwAAfwAHD4APwAAA+AAAAAAAfAB+AAAHwAAAAAAD4APgAAAAAAAAAAAfAAAAAAAAAAAAAAAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAAAAAAAAf+AAAAAAAAAAAAAH/8AAAAAAAAAAAAD//x8AAAAAHwAAAB//+PwAAAAA+AAAA///5+AAAAAHwAAAf///PwAAAAA+AAAH///5+AAAAAHwAAB////HwAAAAAAAAA////4AAAAAAAAfAH////AAAAfAAAH4B////+AAAD4AAA/AP////wAAAfAAAH4B/+P//8AAD4AAA/AP+B///+AB/AAAHwf/AP///+APgAAAAD8AB////8B8AAA4AfgAP//////gAAHAD8AB/////////A4AfgAP////////8PAAAAB/////////h4AA/AP////////8PfgH4A/////////h78A/AH////////8PfgH4Af////////wD/A/AD////////+Af4AAAP////////wD/AAAA////////+AP4AAAD////////4B/AAAAP//////AfAPgAAAAf///AAAD4B8AAAAAf//AAAAfA/gAAA/D/gAAAAD4HgAAAH4f8AAA+A+A8AAAA/D/AAAHwHwHgAAAH4f4AAA+P+A8AAAH/f/AAAHx/wAAAAA/7//wAA+P+AAAAAHwfh+AAAB8AAAAAA+D8PwAAAPgAAAAAHwfh+AAAB8AAAAAAAD8PwAAAAAAAAAAB8fv+AAAAAAAB8AAPgB/wAAPgAAAPgAB8APgAAB8AAAB8AAPgB8AAAPgAAAPgAB8APgAAB8AAAB/AAAAAAAAH/gAAAP4AAAAAAAA+AAAAAfAAAAAAAAHwAAAA=="},"salpinctes-obsoletus":{"w":93,"h":77,"bits":"4Af/4AAAAAAAAAAHAP//wAAAAAAAAAA/////4AAAAAAAAAH/////AAAAAAAAAA/////4AAAAAAAAAH/////gAAAAAAAAA/////+AAAAAAAAA//////wAAAAAAAAH//////AAAAAAAAA4f////8AAAAAAAAHA/////gAAAAAAAA4B////+AAAAAAAAAAP////4AAAAAAAAAA/////gAAAAAAAAAH////+AAAAAAAAAA/////4AAAAAAAAAH/////gAAAAAAAAA/////+AAAAAAAAAH+////4AAAAAAAAAf/////gAAAAAAAAH/////+AAAAAAAAA//////4AAAAAAAAH//////gAAAAAAAA//////+AAAAAAAAH//////4AAAAAAAA///////gAAAAAAAH//////8AAAAAAAA///////wAAAAAAAH///////AAAAAAAA///////8AAAAAAAH///////wAAAAAAA////////AAAAAAAD///////8AAAAAAAf///////wAAAAAAD////////AAAAAAAf///////8AAAAAAB////////gAAAAAAP///////+AAAAAAA////////4AAAAAAH////////AAAAAAAf///////8AAAAAAD////////wAAAAAAP///////+AAAAAAB////////4AAAAAAH////////gAAAAAA////////8AAAAAAD////////wAAAAAAP////////gAAAAAB////////+AAAAAAH////////4AAAAAAf////////AAAAAAB////////4AAAAAAD////////gAAAAAAP///////+AAAAAAAf///////8AAAAAAB////////wAAAAAAB////////gAAAAAAD//P////+AAAAAAAf/wAf///4AAAAAAH/8AAB///wAAAAAA//AAAB///AAAAAAP/4AAAD//8AAAAA///+AAAH//wAAAAP///4AAAf//AAAAD////AAAB//8AAAAf///4AAAH//gAAAD////AAAAP/8AAAAf///4AAAA//gAAAD////AAAAD/8AAAP///gAAAAAP/gAAP////AAAAAAf8AAH////4AAAAAA/gAA/////AAAAAAAAAAH/////AAAAAAAAAA/////4AAAAAAAAAH/////AAAAAAAAAA//4Af4AAAAAAAAA="},"sayornis-nigricans":{"w":51,"h":93,"bits":"AAA///4AAAAP///gAAA////+AAA/////4AAH/////gAA/////8AAH/////wAA//////AAH/////8AA//////gAAf////+AAA/////wAAD/////AAAf////8AAB/////wAAP////+AAB/////4AAH/////AAB/////4AAP/////AAD/////4AAf/////AAH/////4AA//////AAH/////4AB//////AAP/////4AD//////AAf/////4AD//////AA//////4AH//////AA//////4AH//////AB//////4AP//////AB//////4Af//////AD//////wAf/////+AD//////gA//////8AH//////AA//////4AH/////+AA//////wAH/////+AA//////gAP/////8AB//////AAP/////4AB//////AAP/////8AB//////gAP/////+AB//////wAP/////+AB//////wAP/////+AA//////wAH/////+AA//////wAP/////4AB////98AAP////AAAD////wAAAf///+AAAH////gAAA////4AAAP///+AAAB////gAAAf///4AAAD//+AAAAA///wAAAAH//8AAAAA///gAAAAP//8AAAAB///AAAAAf//4AAAAD///AAAAA///wAAAAH//+AAAAA///wAAAAH//8AAAAA///gAAAAH//8AAAAA///gAAAAH//4AAAAA///AAAAAH//wAAAAA//+AAAAAH//wAAAAA//8AAAAAA="},"sayornis-saya":{"w":77,"h":93,"bits":"+P//AAAAAAAAB9///AAAAAAAAD///+AAAAAAAAH///+AAAAAAAAP///+AAAAAAAH////8AAAAAAAP////8AAAAAAAf////4AAAAAAA/////4AAAAAAB/////wAAAAAAAP////gAAAAAAAf////gAAAAAAA/////AAfAAAAB////+AA+AAAAD////8AB8AAAAA////4AD4AAAAB////wAHwAAAAD////gAPgAAAAH////AAAAAAAAP////AAAAAAAAf///+AAAAAAAAf///8AAAAAAAA////8AAAAAAAB////4AAAAAAAH////4AAAAAAAP////4AAAAAAA/////wAAAAAAD/////wAAAAAAH/////wAAAAAAf/////gAAAAAA//////gAAAAD5//////gAAAAHz//////AAAAAPn//////AAAAAfP//////AAAAA+f//////AAAAAA//////+AAAAAB//////+AAAAAD//////+AAAAAH//////8AAAAAP//////8AAAAAf//////4AAAAA///////4AAAAB///////wAAAAD///////wAAAAH///////wAAAAP///////gAAAAf///////gAAAA////////AAAAB////////AAAAB///////+AAAAB///////+AAAAB///////8AAAAA///////8AAAAB///////4AfAAB///////4A+AAD///////wB8AAA///////wD4AAA///////gHwAAAf//////AAAAAAf//////AAAAAAf/////+AAAAAAf/////8AAAAAAf/////8AAAAAAf/////8AAAAAAf/////8AAAAAAf/////8AAAAAP//////8AAAAA///////8AAAAB///////8AAAAD///////8AAAAH///////8AAAAP///////8AAAAP///////8AAAAD///////8AAAAB///////8AAAAD///////8AAAAA/5/////8AAAAAAA/////8AAAAAAA/////8AAAAAAA/////8AAAAAAA/9///8AAAAAAAf5///8AAAAAAAAB///8AAAAAAAAB///8AAAAAAAAB///8AAAAAAAAD///4AAAAAAAAD///wAAAAAAAAD///gAAAAAAAAD///AAAAAAAAAD//+AAAAAAAAAD//8AAAAAAAAAD//4A="},"selasphorus-platycercus":{"w":93,"h":82,"bits":"AAPgD4HwAAAAAAAAAB8AfA/8AAAAAAAAAPgD4H/gAAAAAAAAAAAfA/8AAAAAAAAAAAD4H/gAAAAfgAAAAAAA/8AAAAD8AAAAAAAAAAAAAAfgAAAAAAAAAAAAAD8AAAAAAAAAAAAAAfgAAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAf/j4AAAAAAAfgAAH/////AAAAAD8AAA/////+AAAAAfgAAH/////4AAAAD8AAA//////gAAAAfgAAH/////+AAAAAAAPgP/////wAAAAAAB8AD/////AAAAAAAPgAA////4AAAAAAB8AAA////AAAAAAAPgAAB///4AAAPgAAAAAAP///AAAB8AHwAAAB///4AAAPgA+AAAAH///AAAB8AHwAAAB///4AAAPgA+AAAAP///gAAAAAHwAAAB///8AAAAAA+AHwAP///wAAAAAAAA+AB////AAAAAAAAHwAP///8AAAAAD4A+AB////wAAAAAfAH3wP///+AAAAAD4A++B////4AAAAAfAAHwP////gAAAAD4AA+f////+AAAAAAAAHz/////4AAAAAAAAH//////AAAAAAAAA//////8AAAAAAAAH///////AAAAAAAA///////4AAAAAAAHx//////PgAAB8AAAP/////58AAAPgAAB//////PgAAB8AAAP/////h8AAAP4AAA/////8PgAAB/AAAH/////wAAAAD4AAAf////+AAAAAfAAAD/////4AAAAD4AAAP/////AAAAAAAAAB/////8AAAAAAAAAH/////gAAAAAAAAAf////+AAAAAAAAAA/////wAAAAAAAAAH/////AAAAAAAAAA/////+AAAAAAAAAH/////wAAAAAAPwA/////+AAAAAAB+AD/////+AAAAAAPwAf/////wAAAAAB+AAPj///+AAAAAAPwAAAH///wAAAAAAAAAAAf///AAAAAAAAAAAB///4AAAAAAAAD4AH///gAAAAAAAAfAAP//+AAAAAAAAD4AA///4AD4AAAAAfAAB///AA/AAAAAD4AAD//8AH4AAAAAfAAAP//wA/wAAAAAAAAAP/+AH+AAAAAAAAAAf/wA/wAAAAAAAAAB/+AA+AAAAAAAAAAH/wAPwAAAAAAAAAAf/wB8AAAAAAAAAAB++APgAAAAAAAAAAPnwB8AAAAAAAAAAB8+APgAAAAAAAAAAAHwAHwAAAAAAAAAB8+AA+AAAAAAAAAAPgAAHwAAAAAAAAAB8AAA"},"selasphorus-rufus":{"w":93,"h":72,"bits":"4AAAAHwAA+AAAAAHAAAAA+AfHwAAAAA4AAAAHwD4+AAAAAAAAAAA+AfAAAAAAAAAAAAHwD4AAAAAAAAB8AAB8fAAAAAAAAAPgAAPgAAAAAAAAAB8APh8AAAAAAAAAAPgf8PgAAAAAAAAAB8D/h8AAAAAAAAAAAA/8PgAAAAAAAAAAAH/gAAAAAAAAAAAAA/AAAAD8AAAAAAAAHwAAAAfgAAAAAAAA+AAAAD8AAAAAAAAAAAAAB/gA+AAAAAAAAAAAP8AHwAAAAAB8AAAB8AA+AAAAAAf/AAAPgAHwAAAAAD/+AD/8AA+AAAAAAf/8Af///+AAAAAAD///z////wAAAAA/f//+////+AAAAB//////////wfAAAP/////////+D8AAB//////////wfg4AP////////8AD8HPh////////4AAfg58P///////8AAD8HPg////////gAAAA5+B///////4AAAAAPwH///////AAAAAA+AP//////x+AAAAHwAf/////8PwAAAA+AA//////h+AAAAAAAH/////4PwAAAAAAA//////B+AAAAAAAH3////wPwAAAAAAA+H///+A+AAAAAAAHx////wHwAAAAAAAAf///8AAAAAAAAAAD////gAAAAAAAAAA////4AAAAAAAAAAP///+AAB/4AAAAAD////wAAP/AAAAAA////8AAB/4AAAAAf////AAAP/AAAAAH////gAAB/4AAAAB////wAAAAAAAAAAf///8AAAAAAAAAAD////AAAAAPgAAAA//4AAAAAAB8AAAAH/8AAAD8AAPgAAAA/+AAAAfgAB8AAfAH/AAAAD8AAPgAD8A+AAAAAfgAAAAAfgAAAAAAD8AAAAAD8AAAAAAAAAAAAAAfgAAAAAAAAAAAAAD8AfAAAAAAAAAAAB8AD4AAAAAAAAAAAPgAf8AAAAAAAAAAB8AD/gAAAAAAAAAAPgAf8AfAAAAAAAAB8AAPgD4AAAAAAAAPj4B8AfAAAAAAAAAAfAAAD4AAAAAAAD4D4AAAfAAAAAAAAfAfAAAAAAAAAAAAD4D4AAAAAAAAAAAAfAfAAAAAAAAAAAAD4AAAAAAAAAAAAAA"},"selasphorus-sasin":{"w":72,"h":93,"bits":"///AAAAAAAAA///4D//AAAAA///////wAAAA///////8AAAAf///////AAAAD///////AAAAAP//////gAAAAB//////wAAAAAP/////4AAAAAD/////4AAAAAA/////8AAAAAAf////8AAAAAAP////+AAAAAAH////+AAAAAAH////+AAAAAAH////+AAAAAAH/////AAAAAAH/////AAAAAAH/////gAAAAAH/////gAAAAAH/////wAAAAAH/////4AAAAAH/////8AAAAAH/////+AAAAAH/////+AAAAAH//////AAAAAH//////gAAAAH//////gAAAAH//////wAAAAH//////4AAAAH//////4AAAAH//////8AAAAH//////8AAAAH//////+AAAAH//////+AAAAH//////+AAAAH///////AAAAD///////AAAAD///////AAAAD///////gAAAD///////gAAAD///////wAAAB///////wAAAB///////wAAAB///////wAAAA///////4AAAA///////4AAAAf//////4AAAAf//////4AAAAP//////8AAAAP//////8AAAAH//////8AAAAD//////8AAAAB//////8AAAAB//////8AAAAA//////8AAAAAf/////8AAAAAH/////+AAAAAD/////+AAAAAD/////+AAAAAD/////+AAAAAD/////+AAAAAD/////+AAAAAD/////+AAAAAB/////+AAAAAA/////+AAAAAAAB///+AAAAAAAA///+AAAAAAAA///+AAAAAAAAf//+AAAAAAAAP///AAAAAAAAP///AAAAAAAAH///AAAAAAAAD///AAAAAAAAD///AAAAAAAAB///AAAAAAAAA///AAAAAAAAAf//AAAAAAAAAf//AAAAAAAAAP//AAAAAAAAAH//AAAAAAAAAD//AAAAAAAAAB//AAAAAAAAAA//AAAAAAAAAAP/AAAAAAAAAAP/AAAAAAAAAAH/AAAAAAAAAAH/AAAAAAAAAAH/AAAAAAAAAAD/AAAAAAAAAAD/AAAAAAAAAAB/AAAAAAAAAAB/"},"setophaga-coronata":{"w":76,"h":93,"bits":"////8AAAAAAAD////4AAAAAAAP////wAAAAAAA/////gAAAAAAD/////AAAAAAAP////8AAAAAAA/////4AAAAAAD/////wAAAAAAP/////AAAAAAAP////8AAAAAAAf////4AAAAAAB/////gAAAAAAH////+AAAAAAAP////8AAAAAAA/////4AAAAAAD/////wAAAAAAP/////gAAAAAA//////AAAAAAH/////+AAAAAAf/////8AAAAAD//////4AAAAAP//////gAAAAA///////AAAAAD//////+AAAAAP//////8AAAAA///////wAAAAD///////gAAAAP//////+AAAAA///////8AAAAD///////4AAAAP///////wAAAAf///////AAAAB///////+AAAAH///////4AAAAP///////wAAAA////////AAAAB///////+AAAAH///////4AAAAf///////wAAAA////////gAAAD///////+AAAAP///////8AAAAf///////4AAAB////////gAAAD////////AAAAP///////8AAAAf///////4AAAA////////gAAAB////////AAAAH///////8AAAAH///////4AAAAP///////gAAAAf///////AAAAA///////+AAAAB///////4AAAAB///////wAAAAB///////gAAAAH///////AAAAAf//////+AAAAD///////4AAAAf///9///wAAAH////7///gAAAf////j///AAAB////+P//+AAAH/+P/8f//8AAA//4f/w///4AAD//w//B///gAAP//B/8D///AAA//8D/wH//+AAD//wH/AH//8AAP//AP4AH//wAB//4AAAAP//AAH//gAAAAf/8AA//8AAAAA//wAD//AAAAAB//AAf/4AAAAAH/8AD//gAAAAAP/wAP/8AAAAAAf/AB//wAAAAAA/8AH/+AAAAAAB/wA//wAAAAAAD/AD//AAAAAAAAAAf/4AAAAAAAAAB//AAAAAAAAAAP/8AAAAAAAAAB//gAAAAAAAAAH/+AAAAAAAAAA//wAAAAAAAAAD/+AAAAAAAAAAP/4AAAAAAAAAA//AAAAAAAAAAD/8AAAAAAAAAAP/gAAAAAAAAAA="},"setophaga-magnolia":{"w":93,"h":44,"bits":"4AAAAAAAAAB///wHAAAAAAAAAA////A4AAAAAAAAAP///8AAAAAAAAAAH////gAAAAAAAAAD////+AAAAAAAAAD/////4AAAAAAAAD//////wAAAAAAAB///////AAAAAAAA///////4AAAAAAAf///////AAAAAAAH///////4AAAAAAH////////AAAAAAD////////4AAAAAH/////////AAAAAH/////////AAAAAA/////////wAAAAAP////////8AAAAAD/////////gAAAAB/////////4AAAAB/////////+AAAAH//////////gAAD///////////8AB/////////////AH/////////////4A/////////////+AH/////////////gA/////////////8AH/////////////AA/////////////4AH/////////////AA//A//////////wAH4AAP////////8AAAAAAD////////gAAAAAAD///////4AAAAAAAD//////+AAAAAAAAB//////AAAAAAAAAB/////gAAAAAAAAAP////wAAAAAAAAAA////4AAAAAAAAAAB///8AAAAAAAAAAAD//+AAAAAAAAAAAAP/wAAAAAAAAAAAAA/+AAAAAAAAAAAAAD/wAAAAAA="},"setophaga-nigrescens":{"w":93,"h":58,"bits":"AD//4AAAAAAAAAAAB///wAAAAAAAAAA/////AAAAAAAAAAH////8AAAAAAAAAA/////wAAAAAAAAAH/////AAAAAAAAAA/////8AAAAAAAAAH/////gAAAAAAAAA/////+AAAAAAAAAB/////4AAAAAAAAAB/////AAAAAAAAAAP////8AB8AAAAAAA/////4APgAAAAAAD/////gB8AAAAAAAf/////APgAAAAAAB/////8B8AAAAAAAP/////4AAAAAAAAA//////gAAAAAAAAH/////+AAAAAAAAAf/////4AAAAAAAAD//////wAAAAAAAAf//////gAAAAAAAD///////AAAAAAAAf//////8AAAAAAAD///////4AAAAAAAf///////gAAAAAAD///////+AAAAAAAf///////8AAAAAAD////////wAAAAAAf////////AAAAAAD////////8AAAAAAf/3//////+AAAAAD/+f////////AAAAP/5//////////gAB//P//////////4AH/8///////////AA//5//////////4AD//n//////////AAP//AAD///////4AB//+AB////////AAH//+H////////4AAf////////8B/8AAB/////////AAAAAAH///////4AAAAAAAf//////gAAAAAAAB//////gAAAAAAAAH/////w+AAAAAAAAf////4HwAAAAAAAA////8A+AAAAAAAAB///8AHwAAAAAAAAD///AA+AAAAAAAAAH//4AAAAAAAAAAAAH//AAAAAAAAAAAAAA/4APwAAAAAAAAAAD/AB+AAAAAAAAAAAfwAPwAPgAAAAAAAD+AB+AB8AAAAAAAAfgAPwAPgAA"},"setophaga-occidentalis":{"w":93,"h":61,"bits":"8AD4AAAAAAAAAAAHgAfAAAAAAAAAAAA8AD4AAAAAAAAAAAHgAAAAAAAAAAAAAA4AAAAAAAAAH/AAAAAAAAAAAAAP//AAAAAAAAAAAAH//+AAAAAAAAAAAB///8AAAAAAAAAAA////wAAAAAAAAAAP////AAAAAAAAAAD/////gAAAAAAAAA//////AAAAAAAAAf/////8AAAAAAAAP//////gAAAAAAAH//////8AAAAAAAD///////gAAAAAAB///////8AAAAAAAf//////+AAAAAAAP//////4AAAAAAAD//////+AAAAAAAA///////gAAAAAAAP//////4AAAAAAAH///////AAAAAAAB///////wAAAAAAA///////8AAAAAAAP///////gAAAAAAD///////4AAAAAAA////////AAAAAAAP///////4AAAAAAD///////+AAAAAAA////////wAAAAAAP///////+AAAAAAB////////wAAAAAA////////8AAAAAAP////////gAAAAAD////////4AAAAAB/////////AAAAAAf////////wAAAAAD////////8AAAAAAf////////AAAAAAH////////wAAAAAB////////8AAAAAA/////////AAAAAAf////////wAAAAAH////////4AAAAAB////////+AAAAAA/////////AAAAAAP///AP///AAAAAAD///AAP//AAAAAAA///gAAfwAAAAAAAH//4AAB8AAAAAAAA//8AAAAAAAAAAAAH//AAAAAAAAAAAAA//gAAAAAAAAAAAAH/4AAAAAAAAAAAAA/8AAAAAAAAAAAAAH+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"setophaga-palmarum":{"w":73,"h":93,"bits":"8AAAAB//+AAAeAAAAD///wAAPAAAAD///+AAHgAAAD////gAAAAAAD////8AAAAAAD/////AAAAAP//////gAAAAf//////4AAAAP///////wAAAH///////4AAAD///////8AAAB///////+AAAA////////AAAAH///////gAAAD///////wAAAB8//////8AAAA+f/////+AAAAfH//////gAAAPj//////wAAAAB//////4AAAAAf/////+AAAAAP//////gAAAAH//////wAAAAD//////8AAAAB///////AAAAB///////wAAAB///////4APgB///////8AHwB///////+AD4B////////AB8A////////gA+A////////wAAAf///////4AAAf///////8AAAP///////+AAAP///////PAAAH///////ngAAH///////zwAAD///////x4AAD///////w8AAB///////4eAAB///////8PAAA///////+HgAAf/////8fDwAAf/////4AB4AAP/////8AA8AAP/////8AAeAAH/////+AAfAAD///7//AAfgAD///4f4PgPwAB///8P8HwP4AB///8H4D4P8AA///+D8B8H+AAf///B+A+H/AAf///AAAAH/gAP///AAAAP/gAH///gAAAP/gAD///wAAAP/gAD///wAAAf/wAB///wAAB//wAA///wAAB//wAAf//wAAB//wAAf//8AAH//gAAP//+AAf//wAAH///4A///8AAD////////+AAD/////////gAD/////////4AB/////////8AB/////////+AB//////+f//AB///////H//gA///7/wAAD/wA///4/4AAAf4A///4f+AAAH8A///8H/gAAD+Af//8D/4AAB/Af//8A//+AA/gf//8AP//AAPgf//+AH//wAAAP//+AB//4AAAH///AA//8AAAD///AAP/+AAAB///APn//AAAA///gHx//gAAAf//gD4//gAAAP//gB8P/gAAAH//gA+H/wAAAD//AAAB/4AAAB/gAAAA/8AHwA+AAAAAf8A/4AAAAAAAP8Af8AAAAAAAH+AP+AA"},"setophaga-petechia":{"w":93,"h":44,"bits":"4AAAAAAAAAAAAAAHAAP/8AAAAAAAAAA4AH//4AAAAAAAAAAAB///wAAAAAAAAAAA////AAAAAAAAAAAP///+AAAAAAAAAAP////4AAAAAAAAAH/////4AAAAAAAAA//////8AAAAAAAAH//////8AAAAAAAA///////4AAAAAAAH///////wAAAAAAA////////gAAAAAAA////////gAAAAAAA////////AAAAAAAD///////+AAAAAAAP///////8AAAAAAA////////wAAAAAAH////////gAAAAAAf///////+AAAAAAB////////4AAAAAAH////////gAAAAAA/////////AAAAAAH////////+AAAAAAf////////4AAAAAD/////////gAAAAAP/////////AAAAAB//////////AAAAAH//////////AAAAAf//////////AAAAD///////////AAAAP//////////+AAAAf//////////4AAAB///////////AAAAH//////////4AAAAP/////wH///AAAAAf////gAH//4AAAAAf///gAAH//AAAAAAf//gAAAP/wAAAAAD//4AAAAH8AAAAAAP/+AAAAAAAAAAAAAf/AAAAAAAAAAAAAD/gAAAAAAAAAAAAAHwAAAAAAAA="},"setophaga-ruticilla":{"w":93,"h":48,"bits":"4AAAAAAAAAAP////AAAAAAAAAAD////4AAAAAAAAAA////4AAAAAAAAAAP////AAAAAAAAAAD////4AAAAAAAAAA/////AAAAAAAAAAP////4AAAAAAAAAB////8AAAAAAAAAAf////AAAAAAAAAAP////wAAAAAAAAAH////+AAAAAAAAAH/////gAAAAAAAAD/////4AAAAAAAAB//////AAAAAAAAA//////wAAAAAAAAf/////+AAAAAAAAH//////wAAAAAAAD//////8AAAAAAAB///////gAAAAAAA///////8AAAAAAAf///////gAAAAAAP///////8AAAAAAH////////gAAAAAD////////8AAAAAB/////////gAAAAAf////////+AAAAAP/////////wAAAAH/////////+AAAAB//////////wAAAA//////////+AAAA//////////8AAAA///////////gAAAf//////////4AAAf//////////+AAAP///////////gAAH///////////4AAD////////////AAB////////////4AA/////////////AAH///////////74AA///+D//////+AAAH//8A///////AAAA//8AP//////gAAAH/8AB//////4AAAA/+AAf//////AAAAH+AAD///4APwAAAAAAAAf//4AAAAAAAAAAAD//8AAAAAAAA"},"setophaga-townsendi":{"w":93,"h":69,"bits":"AAAAAAAAAAf///gAAAAAAAAAAH///+AAAAAAAAAAB////4AAAAAAAAAA/////gAAAAAAAAAP////+AAAAAAAAAD/////+AAAAAAAAAf/////4AAAAAAAAH//////AAAAAAAAB//////4AAAAAAAAP//////AAAAAAAAD//////4AAAAAAAB///////AAAAAAAA///////4AAAAAAAf//////+AAAAAAAH//////8AAAAAAAD///////AAAAAAAB///////wAAAAAAAf//////+AAAAAAAH///////gAAAAAAB///////8AAAAAAA////////AAAAAAAP///////wAAAAAAD///////+AAAAAAA////////gAAAAAAP///////8AAAAAAD////////gAAAAAB////////8AAAAAAf////////AAAAAAH////////4AAAAAB/////////AAAAAAf////////4AAAAAH/////////AAAAAA/////////4AAAAAP/////////AAAAAD/////////wAAAAA/////////+AAAAAH/////////gAAAAA/////////8AAAAAf/////////gAAAAH/////////4AAAAB//////////AAAAA//////////4AAAAP/////////+AAAAD//////////gAAAA//////////8AAAAP//////////AAAAD//////////wAAAAf/////////8AAAAD//////////AAAAAf/////////wAAAAD/////////8AAAAA//////////AAAAAP/////////gAAAAD/////////4AAAAB/////////8AAAAAf////////+AAAAAH///8H////AAAAAB///4AD///gAAAAAf//4AAP/+AAAAAAH//+AAA/8AAAAAAA///AAAAAAAAAAAAH//wAAAAAAAAAAAA//8AAAAAAAAAAAAH//AAAAAAAAAAAAA//wAAAAAAAAAAAAH/4AAAAAAAAAAAAA/+AAAAAAAAAAAAAH/gAAAAAAAAAAAAA/4AAAAAAAAAAAAAAA="},"sialia-currucoides":{"w":93,"h":93,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/4AAAAAAAAAAAAD//wAAAAAAAAAAAB///gAAAAAAAAAAAf//+AAAAAAAAAAAP///4AAAAAAAAAAP////gAAAAAAAAAH////+AAAAAAAAAA/////4AAAAAAAAAH/////gAAAAAAAAA/////8AAAAAAAAAH/////wAAAAAAAAA//////AAAAAAAAAB/////+AAAAAAAAAD/////4AAAAAAAAAf/////wAAAAAAAAD//////gAAAAAAAAD/////+AAAAAAAAAf/////8AAAAAAAAB//////wAAAAAAAAP//////AAAAAAAAA//////8AAAAAAAAH//////wAAAAAAAA///////gAAAAAAAH//////+AAAAAAAA///////8AAAAAAAH///////wAAAAAAA////////AAAAAAAH///////+AAAAAAAf///////wAAAAAAD////////gAAAAAAf///////+AAAAAAD////////4AAAAAAP////////AAAAAAB////////8AAAAAAP////////wAAAAAA/////////AAAAAAD////////+AAAAAAf////////4AAAAAB/////////wAAAAAH/////////AAAAAAf////////+AAAAAB/////////4AAAAAH/////////AAAAAAf////////4AAAAAB/////////gAAAAAD/////////AAAAAAH////////+AAAAAAf////////4AAAAAAf///3////wAAAAAAf//wB////AAAAAAAf/gAAf//8AAAAAAD/gAAB///gAAAAAAD8AAAD//8AAAAAAAAAAAAH//gAAAAAAAAAAAAP/8AAAAAAAAAAAAAf/gAAAAAAAAAAAAD/4AAAAAAAAAAAAAf/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"sialia-mexicana":{"w":93,"h":61,"bits":"AAAAAAAAAAP///gAAAAAAAAAAP///+AAAAAAAAAAf////4AAAAAAAAAf/////gAAAAAAAAf/////+AAAAAAAAf//////wAAAAAAAP///////AAAAAAAH///////8AAAAAAB////////4AAAAAA/////////AAAAAB/////////4AAAAB//////////AAAAA//////////4AAAAf//////////AAAAD//////////4AAAA///////////AAAAP/////////+AAAAB//////////wAAAA//////////8AAAA///////////gAAA///////////4AAB////////////AAD////////////wAf////////////+A//////////////wH/////////////+A//////////////wH/////////////+A//////////////wH/////////////8A//////////////gH/////////////8A//////////////AAAAD//////////4AAAAD/////////+AAAAAD/////////wAAAAAB////////8AAAAAAD////////gAAAAAAP///////4AAAAAAA///////+AAAAAAAD///////gAAAAAAAP//////4AAAAAAAB///////AAAAAAAAH//////gAAAAAAAAP/////4AAAAAAAAA/////+AAAAAAAAAB/////AAAAAAAAAAH////gAAAAAAAAAAP///+AAAAAAAAAAAH///4AAAAAAAAAAA////gAAAAAAAAAAH///8AAAAAAAAAAA////gAAAAAAAAAAAH//8AAAAAAAAAAAA///gAAAAAAAAAAAD//4AAAAAAAAAAAAP//AAAAAAAAAAAAB//wAAAAAAAAAAAAP/+AAAAAAAAAAAAB//wAAAAAAAAAAAAH/+AAAAA="},"sitta-canadensis":{"w":93,"h":63,"bits":"/AAP//gAAAAAAAAH4AH///AAAAAAAAA/AD///+AAAAAAAAAAA////8AAAAAAAAAAf////wAAAAAAAAAH/////AAAAAAAAAA/////+AAAAAAAAAP/////8AAAAAAAAD//////4AAAAAAAA///////wAAAAAAAP///////gAAAAAAP///////+AAAAAAH////////4AAAAAD/////////wAAAAA//////////AAAAAH/////////+AA+AA//////////4AHwAH//////////gA+AA//////////+AHwAH//////////4A+AA/D/////////gAAAAAB/////////AAAAAAD////////8AAAAAAP////////wAAAAAAf////////AAAAAAD////////8AAAHwAP////////wAAA+AA/////////gfAHwAH////////+D4A+AAf////////wfAHwAB/////////74AAAAP/////////fAAAAA/////////4AAAAAH/////////AAAAAAf////////8AAAAAD/////////wAAAAAP/////////AAAAAA/////////8AAAAAD/////////wAAAAAP/////////AAAAAA/////////8AAAAAD/////////wAAAAAP/////////4AAAAA//////////AAAAAD/////////4AAAAAf/////////AAAAH//////////4AAAD//////////+AAAA///////////4AAAf///////B///+AAD///////wB///wAAf//////gAD//+AAD//////gPgH//wAAf/////wD/Af/+AAB/+AP/wAf4B/4AAAH/gB/8AD/AD/AAAA/8AP/gAf4AAAPgAH/gB/8AD/AAAB8AA/8AP/gAAAAAAPgAAPgB/8AAAAAAB8AAAAAD/gAAAAfAPgAAAAAf4AAAAD4AAAAAAAD+AAAAAfAA=="},"sitta-carolinensis":{"w":72,"h":93,"bits":"4AAAAAAAAAAA4AAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/+AAAAAAAAAB/+AAAAAAAAAD/+AAAAAAAAAD/+AAAAAAAAAD/+AAAAAAAAAD/+AAAAAAAAAD/+AAAAAAAAAD/+AAAAAAAAAD/+AAAAAAAAAD/+AAAAAAAAAD/8AAAAAAAAAD//gAAAAAAAAD//gAAAAAAAAH//gAAAAAAAAP//gAAAAAAPgP//gAAAAAAPgf//gAAAAAAPgf//gAAAAAAPg///gAAAAAAPg///gAAAAAAAB///AAAAPgAAB///AAAAPgAAD///AAAAPgAAH///AAAAPgAAH///gAAAPgAAP///gAAAAAAAP///wAAAAAAAf///wAAAAAAAf///wAAAAAAA////wAAAAAAA////4AAAAAAA////4AAAAAAB////4AAAAAAB////4AAAAAAD////4AAAAAAD////4AAAAAAD////4AAAAAAD////4AAAAAAH////4AAAAAAH////4AAAAAAH////4AAAAAAH////wAAAAAAH////wAAAAAAH////wAAAAAAP////wAAAAAAP////gAAAAAAP////gAAAAAAf////AAAAAAAf////AAAAAAAf///+AAAAAAAf///8AAAAAAAf///8AAAAAAAf///4AAAAAAAf///wAAAAAAAf///AAAAAAAAf//+AAAAAAAAf//wAAAAAAAAf//gAAAAAAAAf//AAAAAAAAAP/8AAAAAAAAAP/4AAAAAAAAAH/wAAAAAAAAAD/wAAAAAAAAAD/gAAAAAAAAAD/AAAAAAAAAAD/AAAAAAAAAAD/AAAAAAAAAAD+AAAAAAAAAAD+AAAAAAAAAAD+AAAAAAAAAAD8AAAAAAAAAAD8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"sitta-pygmaea":{"w":93,"h":67,"bits":"AAB//gAAAAAAAAAHAA///AAAAAAAAAA4Af//+AAAAAAAAAHAH///4AAAAAAAD44B////wAAAAAAAfHAf////AAAAAAAD4AH////+AAAAAAAfAA//////AAAAAAD4AP//////AAAAAAfAB//////+AAHwAAAAP//////8AA+AAAAD///////4AHwAAAAf///////wA+fAAAH////////AHz4AAD////////8A+fAAA/////////wHz4AAf/////////A+fAAD/////////8AAAAAf///n/////4AAAAD///D//////AAAAAf//g//////8A+APj//////////wHwB8f//////////A+APgA/////////+HwB8AH/////////4+APgAf/////////AAAHAB/////////8AAA4AP//v//////wAA/AA//x///////AAH4AH/+H//////8AA/AAf/w///////wAHwAD/+D///////AA+AAP/4f//////4AHwAB//j///////gAAAAP/+P///////AAAAA//w///////8AAAAD//H///////wAAAAf/+f///////wAAAA//8////////gAAAD//4///////+AAAAP//7///////8AAAA///////////wAAAD///////////AAAAP//////////8+AAA///////////3wAAD///////////+AAAH///////////wAAA///////////+AAAf//////////4AAAH//////8D///AAAA//////+AA//4AAAH//////AAB//AAAA//////4AAH/4AAAH/////4AAAA/AAAA/////+AAAAAAAAAH////4AB8AAAAAAAf/P/gAAPgAAAAfAB/wH4AAB8AAAAD4AP+A/AAAPgAAAAfAB/8AAAAB8AAAAD4AP/gAAAAAAAAAAfAA/8AAAAAAAAAAAAAH/gAAAAAAAAAAAAAf8AAAAAAAAAAAAAA/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"spatula-clypeata":{"w":93,"h":68,"bits":"8AAAAAAAAAAAAAAHgAAAAAAAAAAAAAA8AAAAAAAAAAAAAAHgAAAAAAAAAAAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/gAAAAAAAAAAAAD/8AAAAAAB8AAAAB//gAD4AAAPgAAAAP/8AAfAAAB8AAAAB//gAD4AAAPgAAAAP/4AAfAAAB8AAAAB/+AAD4AAAAAAAAAD/wAAAAAAAAAAAAAD+AAAAAAAAAAAAAAfwAAAAAAD4AAAAAD4AAAAAAAfAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAfAAAAAAAAP/gAAAD4AAAAAAAD/+AAAAAAAAAAAAA//8AAAAAAAAAAAAP//gAAAAAAAAAAAD//+AAAAAAAAAAAAf//4AAAAA/AAAAAH///AAAAB/8AAAAD///4P/7///gAAAA////f/////+AAAAP//////////wAAAH//////////+AAAD///////////8AAB////////////wAAP////////////AAB////////////4AAP////////////AAB////////////4AAP/3//////////AAA/4//////////wAAAAH/////////4AAAAA/B///////4AAAAAH8P//////8AAAAAA/5///////AAAAAAH////////gAAAAAA////////wAAAAAAD///////4AAAAAAAf//////wAAAAAAAA//////AAAAAAAAAA/////AAAAAAAAAAAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"spatula-discors":{"w":93,"h":82,"bits":"AAAP+AAAAAAAAAAAAAf/+AAAAAAAAAAAAP//4AAAAAAAAAAAD///gAAAAAAAAAAA///+AAAAAAAAAAAP///4AAAAAAAAAAB////gAAAAAAAAAAf///+AAAAAAAAAAD////wAAAAAAAAAA////+AAAAAAAAAAH////4AAAAAAAA4A//////wAAAAAAHAH/////////+AAA4B///////////AAHAP//////////8AA4D///////////wAAA///////////+AAAP///////////8AAD////////////wAA////////////+AAf////////////8AH/////////////wA//////////////wH//////////////g//////////////8H//////////////g//////////////8H//////////////g//////////////8H//////////////g+/////////////4AH/////////////wA//////////////wH//////////////B//////////////4P//////////////B//////////////4P//////////////B//////////////4P//////////////A//////////////4H//////////////A/////////////4AH////////////+AAf////////////gAD////////////4AAP///////////+AAB////////////AAAH///////////wAAAf//////////4AAAB//////////8AAAAH/////////+AAAAAf/////////AAAAAB/////////gAAAAAD////////wAAAAAAP///////4AAAAAAAf//////8AAAAAAAA//////8AAAAAAAAB/////+AAAAAAAAAB/////AAAAAAAAAAB////4AAAAAAAAAAD/wP/AAAAAAAAAAAP+B/4AAAAAAAAAAB/wP/AAAAAAAAAAAP/x/wAAAAAAAAAAB/+f+AAAAAAAAAAAP/z/wAAAAAAAAAAB/+f8AAAAAAAAAAAf/3/gAAAAAAAAAA//+/8AAAAAAAAAB/////gAAAAAAAAAP////8AAAAAAAAAB/////gAAAAAAAAAP////8AAAAPgAAAB/////AAAAB8AAAAP////4AAAAPgAAAAf///+AAAAB8AAAAAf///wAAAAPgAAAAD///+AAAAAAAAAAAA///gAAAAAAAAAAAH//8AAAAAAAAAAAA///AAAAAAAA"},"sphyrapicus-ruber":{"w":93,"h":93,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/8AAAAAAAAAAAAB//4AAAAAAAAAAAA////8AAAAAAAAAAP////8AAAAAAAAAD/////gAAAAAAAAA/////8AAAAAAAAAH/////gAAAAAAAAB/////8AAAAAAAAAP/////AAAAAAAAAD/////gAAAAAAAAAf////gAAAAAAAAAH////gAAAAAAAAAB////4AAAAAAAAAA////+AAAAAAAAAAP////gAAAAAAAAAH////8AAAAAAAAAB/////AAAAAAAAAAf////wAAAAAAAAAH////+AAAAAAAAAB/////wAAAAAAAAAf////+AAAAAAAAAH/////wAAAAAAAAB/////+AAAAAAAAAf/////wAAAAAAAAH/////+AAAAAAAAA//////wAAAAAAAAP/////+AAAAAAAAD//////gAAAAAAAA//////8AAAAAAAAH//////gAAAAAAAB//////8AAAAAAAAf//////AAAAAAAAD//////4AAAAAAAA//////+AAAAAAAAH//////wAAAAAAAB//////8AAAAAAAAP//////AAAAAAAAB//////4AAAAAAAAP/////+AAAAAAAAD//////gAAAAAAAAf/////4AAAAAAAAH/////+AAAAAAAAB//////gAAAAAAAAP/////4AAAAAAAAD/////8AAAAAAAAA//////AAAAAAAAAH/////wAAAAAAAAB/////8AAAAAAAAAf////+AAAAAAAAAD/////gAAAAAAAAA/////wAAAAAAAAAH///8AAAAAAAAAAA////AAAAAAAAAAAH///gAAAAAAAAAAA///4AAAAAAAAAAAA//+AAAAAAAAAAAAH//gAAAAAAAAAAAB//4AAAAAAAAAAAAf//AAAAAAAAAAAAD//wAAAAAAAAAAAA//+AAAAAAAAAAAAH//gAAAAAAAAAAAB//8AAAAAAAAAAAAf//AAAAAAAAAAAAD//4AAAAAAAAAAAA//+AAAAAAAAAAAAH//gAAAAAAAAAAAA//4AAAAAAAAAAAAH/+AAAAAAAAAAAAA//AAAAAAAAAAAAAA/gAAAAAAAAAAAAAH4AAAAAAAAAAAAAA+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"sphyrapicus-thyroideus":{"w":62,"h":93,"bits":"4AAAAAAAAAOAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgAAAAAAAAD4AAAAAAAAA+AAAB8AAAAPgAAAfAAAAD4AAAHwAAAAAAAAB8AAAAAAAAAfAAAAAAAAAAAAAAAAAAAAAAAAAAAB+AAAAAAAAAfgAAAAAAAAH5///AAAAAB+f//+AAAAAfn///wAfAAAB///+AHwAAAf///gB8AAAD///8AfAAAAf///AHwAAAB///wB8AAAAP//8AfAAAAB///AHwAAAAP//4B8AAAAD//+AAAAAAAf//wAAAAAAP//+AAAAAAD///wAAD4AA///+AAA+AAP///gAAPgAD///8AAD4AA////gAA+AAP///4AAAAAD////AAAAAA////wAAAAAP///+AAAAAD////gAAAAA////8AAAAAP////AAAAAB////4AAHwAf///+AAB8AD////wAAfAA////8AAHwAH////AAB8AB////4AAAAAP///+AAAAAB////gAAAPgP///8AAAD4B////AAAA+AP///wAAAPgA///8AAAD4AH///gAAAAAAf//8AAAAAAB///AAAAAAAP//4AAAAAAB//+AAAAAAAP//gAAAAAAD//4AAAAAAAf/+AAAAAAAH//gAAAAAAA//wAAAAAAAP/AAAAAAAAD/wAAAAAAAA/8AAAAAAAAP/AAAAAAAAD/wAAAAAAAAf+AAAAAAAAH/gAAAAAAAB/4AAAAAAAAP+AAAAAAAAB/gAAAAAAAAf4AAAAAAAAD+AAAAAAB/A/gAAAAAA/wH4AAAAAAP8AAAAAAAAD/AAAAAAAAA/wAAAAAAAAP8AAAAAAP8AAAAAAAAD/AB+AAAAAA/wAfgAAAAAP8AH4AAAA=="},"spinus-lawrencei":{"w":93,"h":62,"bits":"4AAAAAfAAAAAAAP3AAAAAD4AAAAAAB+4AAAAAfAAAAAAAPz4AAAAD4AAAAAAB+fAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAA+AAAD4AAAAAAAAAHwfAAfAAAAAAAAfA+D4D//gAAAAAAD4HwfB//8AAAAAAAfA+D4f//gAAAAHgD4HwfH//8AAAAA8AfAAAB///wAAAAH+AAAAAf///8AAAA/wAAAAH////gAAAH+AAAAA////8AAAAPwAAAAf////gAAAB+AAAAP////8AAfAAAAAAD/////gAD4AAAAAA////+AAAfAAAAAAf////wAAD4AAAAAH////+AAAfAAAAAB/////wAAAAAAAAAf////gAAAAAAAAAP////8AAAAAAAAAD/////gAAAAAHwAA/////8AAAAAA+AAP/////gAAAAAHwAD/////8AAAAAA+AA//////gAAAAAHwAP/////4AAAAB4AAD//////AAAAAPAAA//////4AAAAB4AAf/////+/AAAAPAAH//////n4AAAB74B//////8/AAAAAfAP//////H4AAAAD4B//////w/AAAAAfAP/////8H4AAAAD4H//////8AAAAAAAB////////AA+AAAA////////4AHwAAAP////////AA+AAAD///H////4AHwAAB//+AD////AA+AAAP//AAH//+AAHwAAB//wAAf//wAAAAAAP/4AAD//8AAAAAAB/+AAAAAAAAAAAAAP/AAAAAAAAAAB8AB/wAAAAAAAAAAPgAP8AAAAAAAAAAB8AA+AAAAAAAAAAAPgAAHwAAAAAAAAAB8AAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"spinus-pinus":{"w":93,"h":86,"bits":"AAAAAAAAAAH///wAAAAAAAAAAB////AAAAAAAAAAAf///8AAAAAAAAAAH////wAAAAAAAAAB/////AAAAAAAAAAf////8AAAAAAAAAH/////wAAAAAAAAA//////AAAAAAAAAP/////4AAAAAAAAD//////AAAAAAAAAf/////4AAAAAAAAH//////AAAAAAAAA//////4AAAAAAAAP//////AAAAAAAAB//////4AAAAAAAAf//////AAAAAAAAH//////gAAAAAAAD//////4AAAAAAAA///////AAAAAAAAP//////4AAAAAAAD///////AAAAAAAB///////wAAAAAAAf//////+AAAAAAAH///////wAAAAAAB///////+AAAAAAAf///////wAAAAAAH///////+AAAAAAA////////wAAAAAAP///////+AAAAAAD////////wAAAAAA////////+AAAAAAP////////wAAAAAD////////+AAAAAAf////////wAAAAAH////////+AAAAAB/////////wAAAAAf////////+AAAAAH/////////wAAAAB/////////+AAAAAf/////////wAAAAH/////////+AAAAB//////////wAAAAf/////////8AAAAD//////////gAAAA//////////8AAAAP//////////AAAAD//////////4AAAAf/////////+AAAAH//////////wAAAA//////////8AAAAP//////////AAAAB//////////4AAAAf/////////+AAAAH//////////wAAAB//////////8AAAAf//////////AAAAH//////////wAAAB//////////8AAAAf//////////AAAAH//////////wAAAB//////////8AAAAf//////////AAAAD//////////wAAAA//////////4AAAAH/////////+AAAAA//////////AAAAAH/////////wAAAAB/////////wAAAAAf////////8AAAAAH////g////gAAAAB////wAf//8AAAAAf///gAAAD/gAAAAH///AAAAAP8AAAAB///wAAAAAAAAAAAf//8AAAAAAAAAAAH///AAAAAAAAAAAA///wAAAAAAAAAAAH//8AAAAAAAAAAAA///AAAAAAAAAAAAH//wAAAAAAAAAAAA//8AAAAAAAAAAAAH//AAAAAAAAAAAAA//wAAAAAAAAAAAAH/8AAAAAAAAAAAAA//AAAAAAAAAAAAAH/wAAAAAAAAAAAAAA=="},"spinus-psaltria":{"w":93,"h":91,"bits":"Af///gAAAAAAAAAAH///+AAAAAAAAAAB////4AAAAAAAAAAf////gAAAAAAAAAH////+AAAAAAAAAD/////4AAAAAAAAA//////gAAAAAAAAH/////8AAAAAAAAA//////wAAAAAAAAH/////+AAAAAAAAA//////4AAAAAAAAH//////AAAAAAAAA//////8AAAAAAAAH//////wAAAAAAAA///////AAAAAAAAD//////8AAAAAAAAH//////wAAAAAAAAP//////AAAAAAAAB//////+AAAAAAAAH//////4AAAAAAAA///////gAAAAAAAD//////+AAAAAAAAf//////8AAAAAAAD///////wAAAAAAAP///////AAAAAAAB///////8AAAAAAAP///////wAAAAAAB////////AAAAAAAP///////4AAAAAAB////////gAAAAAAP///////+AAAAAAB////////4AAAAAAP////////gAAAAAB////////+AAAAAAP////////4AAAAAB/////////gAAAAAP////////+AAAAAB/////////4AAAAAP/////////AAAAAA/////////8AAAAAH/////////wAAAAA//////////AAAAAD/////////8AAAAAf/////////gAAAAD/////////+AAAAAP/////////4AAAAA//////////AAAAAH/////////8AAAAAf/////////gAAAAD/////////+AAAAAP/////////wAAAAA//////////AAAAAD/////////8AAAAAP/////////wAAAAA//////////AAAAAD/////////8AAAAAP/////////gAAAAA/////////+AAAAAD/////////4AAAAAH/////////gAAAAAf////////8AAAAAA/////////gAAAAAB////////8AAAAAAD////////gAAAAAAH///////8AAAAAAH////////gAAAAAB////////wAAAAAAP////////AAAAAAB//+AP///8AAAAAAP//gA////wAAAAAB//4AB////AAAAAAP//AAD///8AAAAAB//4AAD///wAAAAAH//AAAH///AAAAAAf/4AAAf//4AAAAAAH/AAAB///gAAAAAAH4AAAH//+AAAAAAAAAAAAf//4AAAAAAAAAAAB///gAAAAAAAAAAAH//+AAAAAAAAAAAA///4AAAAAAAAAAAD///AAAAAAAAAAAAP//4AAAAAAAAAAAA///AAAAAAAAAAAAD//4AAAAAAAAAAAAP//AAAAAAAAAAAAB//4AAAAAAAAAAAAH//AAAAAAAAAAAAAf/4AAAAAAAAAAAAB//AAAAAAAAAAAAAH/g="},"spinus-tristis":{"w":89,"h":93,"bits":"AAAAAAAAAD///4AAAAAAAAAAP///8AAAAAAAAAA////8AAAAAAAAAD////4AAAAAAAAAP////4AAAAAAAAA/////8AAAAAAAAD/////8AAAAAAAAP/////8AAAAAAAAf/////4AAAAAAAB//////wAAAAAAAH//////gAAAAAAAP//////AAAAAAAAf/////+AAAAAAAB//////8AAAAAAAH//////4AAAAAAAP//////wAAAAAAA//////8AAAAAAAD//////gAAAAAAAP/////+AAAAAAAB//////8AAAAAAAH//////4AAAAAAAf//////gAAAAAAB///////AAAAAAAH//////+AAAAAAAf//////8AAAAAAB///////4AAAAAAH///////wAAAAAAP///////gAAAAAA////////AAAAAAD///////+AAAAAAP///////8AAAAAAf///////4AAAAAB////////wAAAAAH////////gAAAAAf////////AAAAAB////////+AAAAAH////////8AAAAAP////////4AAAAA/////////gAAAAD/////////AAAAAP////////+AAAAA/////////4AAAAB/////////wAAAAH/////////AAAAAP////////+AAAAA/////////4AAAAD/////////wAAAAH/////////AAAAAf////////+AAAAA/////////4AAAAD/////////gAAAAH/////////AAAAAP////////8AAAAA/////////wAAAAD/////////gAAAAP////////+AAAAA/////////4AAAAD/////////gAAAAP////////+AAAAA/////////+AAAAD/////////+AAAAP/////////+AAAAf/////////+AAAB//////////8AAAD//////////4AAAP//////////wAAAf//////////gAAB///////////AAAD///////////AAAH///////////AAAP//////////+AAAf///4B/////8AAA////gAH////4AAA///8AAP////wAAD///gAAf////gAAP//8AAA/4APwAAAf//gAAB/gAfgAAB//8AAAB+AAAAAAH//wAAAD8AAAAAAf//AAAAAAAAAAAB//8AAAAAAAAAAAD//wAAAAAAAAAAAP//AAAAAAAAAAAAf/8AAAAAAAAAAAA//wAAAAAAAAAAAB//AAAAAAAAAAAAD/+AAAAAAAAAAAAH/4AAAAAAAAAAAAP/gAAAAAAAAAAAAf+AAAAAAAAAAAAA/4AAAAAAAAAAAAB/gAAAAAAAAAAAAD+AAAAAAAAAAAAAA"},"spizella-atrogularis":{"w":41,"h":93,"bits":"8AAAAAB4B/4AADwP/8AAAA//+AAAH//+AAA///8AAD///8AAP///4AAf///4AA////wAB////gAD////gAD////AAB///+AAD///8AAH///4AAH///4AAf///wAA////wAB////wAD////gAP////gAf////AA/////AB////+AD////8AH////8AP////4Af////wA/////gB/////gB/////AD/////AH////+AP////8AP////4Af////wAf////gA/////gA/////AB////+AB////8AD////4AD////wAD////gAD////AAD///+AAD///8AAD///4AAD///wAAD///gAAD///AAAH//+AAAH//8AAAP//4AAAf/8AAAAf/4AAAA//wAAAA//gAAAB//AAAAD/+AAAAH/8AAAAP/4AAAAf/4AAAA//wAAAD//gAAAP//AAAAf/+AAAA//8AAAB//4AAAD//wAAAH//wAAAB//gAAAD//AAAAH/+AAAAP/8AAAAf/4AAAA//wAD8B//gAH4D//AAPwH/+AAfgP/8AA/Af/4AAAA//wAAAB//gAAAB//AAAAD/+AAAAH/8AAAAP/4AAAAP/wAAAAf/gAAAAf+AAAAAAAA"},"spizella-breweri":{"w":93,"h":92,"bits":"AAAAAfAAAAAAAAAAAAAAD4AAAAAAAPgAAAAAfAAAAAAAB8AAAAAD4AAAAAAAPgD4AAAfAAAAAAAB8AfAAAAAAAAAAAAPgD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAD4AAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAB8HwAAAAAAAAAAAAB8+AAAAAAAAAAAAAPnwAAAAAAAAAAAAB8+AAAAAAAAAAAAAPnwAB8//AAHAAAAB8AAAP//+AA4AAAAAAAAB///4AHAAAfAAAAAP///gA4AAD4AAAAB///+AHAAAfAAAAAf///8AAAAD4AAAAH////4AAAAfAAAAB/////gAAAAAAAAAP////8AAAAAAAAAD/////gAAAAAAAAA/////8AAAAAAAAA//////gAAAAAAAAf/////8AAAAAAAAH//////AAAAAAAAD//////AAAAAAAAA//////wAAAAAAAAP/////+AAAAAAAAH//////gAAAAAAAB//////8AAAHwAAAf//////gAAA+AAAP//////4AAAHwAAD///////AAAA+AAA///////4AAAHwAAf///////AAAAAAAH///////4AAAAAAB////////AAAAAAAP///////wAAA+AAD///////+AAAHwAA////////w+AA+AAP///////8HwAHx8B////////g+AA/Pgf///////4HwAD58P////////A+AAfPj////////wAAAD58////////8AAAAfAP////////gAAAAAB////////4AAAAAAP///////+AAAAAAD////////gAAAPgA////////4AAAB8Af///////+AAAAPgH////////AAAAB8D////////wAAAAPg////////4AAAAAAf////////wAAAAAH///wH////gAAAAD///gAD///+AAAAA///4AAP///+AAAAP//8AAB////4AAAH///AAAP////AAAB///gAAB////4AAAP//4AAAP////AAAD//+AAAAH///4AAAf//AAAAA///4AAAD//wAAAAAAB/AAAAf/4AAAAAAAAAAAAD/+AAAAAAAAAAAAAP/gAAAAAAAAAAAAB/wAAAAAAAAAAA+AH8AAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAA+AAB8AHwAAAAAAAHwAAPgA+AAAAAAAA+APh8AAAAAAAAAAHwH8PgAAAAAAAAAA+A/h8AAAAAAAAAAAAH8AAAAAAAAAAAAHw/gAAAAAAAAAAAA+H8AAAAAAAAAAAAHwPgAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAD4AAAAAAAAAAB8AAfnwAAAAAAAAAPgAD8+AAAAAAAAAB8AAfnwAAAAAAAAAPgAA="},"spizella-passerina":{"w":93,"h":53,"bits":"/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4A="},"spizelloides-arborea":{"w":93,"h":72,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//AAAAAAAAAAAAAf/+AAAAAAAAAAAAP//8AAAAAAAAAAAD///wAAAAAAAAAAA///+AAAAAAAAAAAP///8AAAAAAAAAAD////wAAAAAAAAAA/////AAAAAAAAAAP////4AAAAAAAAAD/////AAAAAAAAAA/////4AAAAAAAAAP/////AAD4AAAAAH/////4AAfAAAAAB/////+AAD4AAAAAf/////gAAfAAAAAH/////8AAD4AAAAB//////gA4AAAAAAf/////8AHAAAAAAH//////gA4AAAAAB//////+AHAAAAAAf//////wA4AAAAAP//////+AAAAAAAD///////wAAAAAAA///////+AAAAAAAH///////wAAAAAAD///////+AAAAAAAf///////wAAAAAAH///////+AAAAAAB////////wAAAAAAf///////+AAAAAAD////////gAAAAAA////////8AAAAAAP////////gAAAAAD////////8AAAAAA/////////AAAAAAP////////4AAAAAH////////+AAAAAD/////////gAAAAD/////////8AAAAB//////////AAAAA//////////wAAAAf/////////8AAAAP//////////AAAAH//////////wAAAD//////////8AAAA////AD/////AAAAP///gAP////gAAAB///wAAf///wAAAAP//4AAA///8AAAAB//4AAAB///4AAAAP/8AAAAAP//gAAAA/+AAAAAB//8AAAAD/AAAB8AP//gAAAAAAAAAPgB//8AAAAAAAAAB8AP//gAAAAAAAAAPgAAAAAAAAAAAAAB8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAA"},"stelgidopteryx-serripennis":{"w":93,"h":93,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAAAAAAAA+AfAAH/8PgAAAAAHwD4AH//58AAAAAA+AfAB///vgAAAAAHwD4Af///8AAAAAA+AAAH////gAAAAAAAAAP////gAAA+AAAAAH////+AAAHwAAAAA/////wAA++AAAAAH/////AAP3wAAAAA/////4AB++AAAAAH/////AAPwAAAAAA/////4AB+AAA+AAA/////gAPgAAPwAAB////8AB8AAB+AAAH////gAPgAAPwAAAf///+AB8AAB+AAA/////4AAAA+PwAAH/////gAAAHwAAAA/////+AAAA+AAAAH3////4AAAHwAAAA//////gAAA+AAAAAP////+AAAAAAAAAB/////4AAAAAAAAAP/////gAAAAAAAAB/////+AAAAAAAAAP/////4AAAAAAAAB//////gAAD4AAAAP/////+AAAf+AAAB//////4AAD/wAAAP//////gAAf+AAAB//////+AAD/wAAAP//////4AAP+AAAB///////g+AAAAAAP//////+HwAAAAAB///////4+AAAD4AH///////nwAAD/AA///////++AAAf4AH///////x8AAD/AA////////PgAAf4AD///////58AAD4AAf///////vgAAAAAD////////8AAAAAAP///////4AAAAAAB////////gAAAAAAH///////+AAAAAAA////////4AAAAAAD////////gPgAAAAP///////8B8AAAAB////////wPgAfAAH///////+B8AD4AAf///////4PgAfAAB////////gAAD4AB////////+AAAfAAP////////4AAD4AB9////////gAAAAAPv///////+AAAAAB9////////4AAAAAAB////////gAAAAAAD///////+AAAAAAAP////////wAAAAAAf///////+AAAAAAD////////z4AAAAAf///////+fAAAAAD////////z4AAAAAAf///////fAAAAAAA////////4AAAAAAB///////wAAAAAAD4P//////AAAAAAAfAf/////8AAAAAAD4A//////4AAAAAAfAD//////gAAAAAD4AP/////+AAAAAAAAAf/////8AAAAAAAAB//////wAAAAAAAAD//////AAB8AAAAAH/////4AAPgAAAAAf/////AAB8AAAA+A/////4AAPgAAAHwD/////AAB8AAAA+AH////4AAAAAAAHwAP////AAAAAAAA+AAf//8AAAAAAAAPwAA///gAAAAAAAB+AAB//+AAAAAAAAPwAAH//wAAAAAAAB+AAAP/+AAAAAAAAPwAPg//wAAAAAAAB8AB8Af+AAAAAAAAAAAPgAfgAAAAAAAAAAB8AAAAA="},"sterna-forsteri":{"w":93,"h":62,"bits":"4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH4AAAAAAAAAAAAAA/AAAAAAAAAAAAAAH4AAAAAAAAAAAAAA/AAAAAAAAAAAAAAH4AAAAAAAAAAAAAAAAAAAAAAAAAAB/wAAAAAAAAAAAAA//gAAAAAAAAAAAf//+AAAAAAAAAAAP///5///wAAAAAAB////////+AAAAAAP/////////gAAAAB//////////gAAAAP//////////gAAAA///////////AAAAD//////////+AAAAf//////////wAAAD//////////+AAAAf//////////wAAAD/j9///////+AAAAfgfv///////wAAAAAD9///////8AAAAAAfv///////wAAAAAB/////////gAAAAAP3///////+AAAAAB+f///////4AAAAAPz////////gAAAAB+f///////8HAAAAPz////P///g4AAAB+f///wB//8HAAAAP/////w///g4AAAB/z///////8HAAAAP////////8A4AAAA/+f///////gAAAAH/4///////8AAAAAf/////////gAAAAB/////////8AAAPgH/////////gAAB8AP///////+AAAAPgAf////AAAAAAAB8AA////AAAAAAAAPgAB//+AAAAAAAAAAAAP/wAAAAAAAAAAAAD/wAAAAAAAAAAAAH/+AAAAAAAAAAAAB//wAAAAAAAAAAAAP/+AAAAAAAAAAAAB//wAAAAAAAAAAAAP/+AAAAAAAAAAAAB//gAAAAAAAAAAAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"sterna-hirundo":{"w":93,"h":68,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/+AAAAAAA+AAAAAf/4AAAAAAHwAAAAH//gAAAAAA+AAAAP//+AAAAAAHwAAAP///4AAAAAA+AAAD////AAAAAAHwAAAf///4AAAAAAAAAAD////gAAAAAAAAAAf///8AAAAAAAAAAD////4AAAAAAAAAAAH///wAAAAAAAAAAAP///wAAAAAAAAAAB////gAAAAAA4AAAP///+AAAAAAHAAAB////8AAAAAA4AAAP////wAAAAAHAAAB/////AAAAAA4AAAP////8AAAAAAAAAB/////4AAAAAAPgAP/////gAAAAAB8AB//////gAAAAAPgAH//////AAAAAB8AA///////4AAAAPgAH//////////wAAAAf/////////+AAAAB//////////wAAAAP/////////+AAAAA//////////wAAAAD/////////+AAAAAH/////////gAAAAAf////////8AAAAAA/////////4AAAAAD/////////AAAAAB////A////4AAAAAP///AAP///AAAAAB//gAAAB//4AAAAAP/8AAAAA//AAAAAB//AAAAAAfwAAAAAP/wAAAAAAAAAAAAB/4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHgAAAAAAAAAAAAAA8AAAAAAAAAAAAAAHgAAAAAAAAAAAAAA8AAAAAAAAAAAAAAHgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"streptopelia-decaocto":{"w":93,"h":65,"bits":"AAAAAAAAAAAAf//gAAAAAAAAAAAH//+AAAAAAAAAAAA///wAAAAAAAAAAAP//+AAAAAAAAAAAB///4AAAAAAAAAAAf///AAAAAAAAAAAD///4AAAAAAAAAAA////AAAAAAAAAAAH///4AAAAAAAAAAB////AAAAAAAAAAAP///4AAAAAAAAAAD////AAAAAAAAAAA///+AAAAAAAAAAAP///gAAAAAAAAAAD///4AAAAAAAAAAA///+AAAAAAAAAAAf///wAAAAAAAAAAH///+AAAAAAAAAAB////wAAAAAAAAAAf///+AAAAAAAAAAH////wAAAAAAAAAD////8AAAAAAAAAA/////gAAAAAAAAAf////8AAAAAAAAAP/////gAAAAAAAAD/////8AAAAAAAAB//////gAAAAAAAAf/////8AAAAAAAAP//////gAAAAAAAD//////8AAAAAAAA///////gAAAAAAAf//////8AAAAAAAH///////gAAAAAAD///////8AAAAAAA////////gAAAAAAf///////8AAAAAAH////////gAAAAAB////////8AAAAAAf////////AAAAAAP////////4AAAAAH/////////AAAAAB/////////wAAAAAf////////+AAAAAH/////////wAAAAB/////////8AAAAAP/////////gAAAAH/////////4AAAAB/////////+AAAAAf/////////gAAAAP/////////8AAAAH//////////AAAAD//////////wAAAB//////////4AAAA//////////+AAAAf/////////+AAAAP///////////AAAD///////////4AAB//////wH////wAA/////gAAD///+AAH////AAAAP///wAA///8AAAAB///+AAH//+AAAAAP///wAA//+AAAAAAf//+AAH/8AAAAAAAH/8AAA/+AAAAAAAAPwAAAA"},"strix-occidentalis":{"w":93,"h":92,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAHPwAAAAAAAAAAAf+5/8AAAAAAAAAAH/3P/wAAAAAAAAAB/+///AAAAAAAAAAf/+//8AAAAAAAAAH//3//wAAAAAAAAB//+///AAAAAAAAAf//3//+AAAAAAAAH//+///4AAAAAAAB///////4AAAAAAD////////gAAAAAA////////+AAAAAAH////////4AAAAAD/////////gAAAAA//////////AAAAAP////3////8AAAAH////+/////wAAAB/////3/////AAAAf////+/////8AAAH/////h/////wAAA/////4P/////AAAf/////B/////8AAH/////4H/////////////+Af/////////////gD/////////////4Af/////////////AB/////////////wAD////////////8AAf////////////gAB////////////4AAH///////////+AAA////////////gAAB///////////4AAAP//////////+AAAA///////////wAAAD//////////4AAAAP//////////AAAAA//////////gAAAAD/////////8AAAAAH////////8AAAAAAf////////gAAAAAA////////wAAAAAAD///////8AAAAAAAH//////+AAAAAAAAP//////gAAAAAAAAf/////gAAAAAAAAAD////AAAAAAAAAAA////AAAAAAAAAAAP///8AAAAAAAAAAD////wAAAAAAAAAA/////AAAAAAAAAAH////4AAAAAAAAAA/////AAAAAAAAAAH////4AAAAAAAAAA/////AAAAAAAAAAH////4AAAAAAAAAA/////AAAAAAAAAAD////4AAAAAAAAAAP///8AAAAAAAAAAAf///AAAAAAAAAAAB///gAAAAAAAAAAAB//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwAAAAAAAAAAAAAA+AAAAAAAAAAAAAAHwA="},"sturnella-neglecta":{"w":53,"h":93,"bits":"8AP///gAP4f////AAf//////gA///////gB///////AD///////AA//////+AB//////+AD//////+AH//////8AAP/////4AAA/////4AAA/////wAAA/////gAAA/////AAAA////+AAAB////+AAAD////8AAAD////4AAfn////+AA/P////8AB+/////4AD//////wAH//////wAB//////wAD//////wAP//////gA///////gD///////AH///////Af//////+A///////8D///////4H///////wP///////gf///////B///////+D///////8H///////4P///////wf///////g////////B///////+H///////8P///////4f///////w////////h////////D///////+H///////8P///////4P///////wf///////g////////A///////+B///////8D///////4D///////gH///////AP//////+AP//////4Af//////wP///////n////////P///////8f///////4////////x4P//////DwH/////+AAP/////8AAP/////wAAP/////gAAf////+AAAf////4AAA/////wAAA/////AAAB////+AAAB////4AAAH////wAAAP////vwAAf////fwAA////+/gAD////9/AAH////7+AAP////38AA/////nwAB/////PgAD////8fAAH////A+AAP///+B8AAf///8D4AA////4AAAB///vwAAA="},"sturnus-vulgaris":{"w":93,"h":90,"bits":"AAAAAAAAAP///gAAAAAAAAAAH////AAAAAAAAAAB////8AAAAAAAAAAf////wAAAAAAAAAH/////AAAAAAAAAB/////+AAAAAAAAAP/////+AAAAAAAAD//////+AAAAAAAAf//////4AAAAAAAH///////AAAAAAAA///////4AAAAAAAP///////AAAAAAAB///////4AAAAAAAf///////AAAAAAAD///////4AAAAAAA////////AAAAAAAP/////+AAAAAAAAH//////gAAAAAAAB//////8AAAAAAAA///////AAAAAAAAP//////4AAAAAAAD//////+AAAAAAAB///////wAAAAAAAf///////AAAAAAAH///////4AAAAAAB////////gAAAAAAf///////8AAAAAAH////////gAAAAAB////////8AAAAAAf////////gAAAAAH////////8AAAAAA/////////gAAAAAP////////8AAAAAD/////////gAAAAA/////////8AAAAAP/////////gAAAAD/////////8AAAAAf/////////gAAAAH/////////8AAAAB//////////gAAAAf/////////8AAAAH//////////AAAAB//////////4AAAAf/////////+AAAAH//////////wAAAA//////////+AAAAP//////////gAAAB//////////8AAAAf//////8H//gAAAH///////gH/4AAAA///////8AH/AAAAP///////gA/wAAAB///////8AP+AAAAP///////gD/gAAAD///////4A/8AAAAf///////AH/AAAAH///////4B/wAAAB///////+A/+AAAAP///////gP/gAAAD///////4D/4AAAA////////A/+AAAAP///////4P/gAAAD///////+H/4AAAA////////h/+AAAAP///////8f/gAAAD////////v/4AAAA//////////+AAAAH//////////AAAAA//////////wAAAAH/////////4AAAAA/////////+AAAAAH/////////AAAAAA/////////wAAAAAH/////////AAAAAA/////////4AAAAAH////v////AAAAAA////g////4AAAAAH///wD////AAAAAA///4AH///4AAAAAH//+AAf//+AAAAAA///AAB//AAAAAAAH//gAA//8AAAAAAA//wAAP//wAAAAAAH/8AAB//+AAAAAAA//AAAP//wAAAAAAH/wAAB//+AAAAAAA/8AAAP//wAAAAAAH/gAAB//8AAAAAAA/4AAAP/8AAAAAAAH+AAAAAAAAAAAAAAA"},"tachycineta-bicolor":{"w":62,"h":93,"bits":"8AAAAAAAAAPAAAAAAAAADwAAAAAAAAA4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/wAAAAAAAH//AAAAAAAD//4AAAAAAB///AAAAAAA///8AAAAAAP///gAAAAAH///4AAAAAB///+AAAAAAf///gAAAAAP///4AAAAAD///8AAAAAA///8AAAfAAf///AAAHwAH//vwAAB8AD///+AAAfAB////gAAHwA////4AAAAAP///+AAAAAH////gAAAAf////4AAAAH////+AAAAB/////gAAAAf////4AAAAH////+AAAAB/////gAAAA////v4AAAAf///78AAAAH///+/AAAAD////vwAAAA////78AAAAP/////AAAAH/////wAAAB/////8AAAA/////+AAAAf///9/gAAAH/////wAAAB////v8AAAA////3+AAAAP///7/gAAAD/////wAAAB/////4AAAAf////+AAAAH/////AAAAD/////gAAAA/////wAAAAP////4AAAAH////8AAAAB////+AAAAA/////AAAAAf////gAAAAP////wAAAAH///+AAAD4D////AAAA+B////gAAAPg////wAAAD4f///4AAAA+P///8AAAAAH///+AAAAAH////AAAAAD////gAAAAB////wAAAAA////4AAAAAP///8AAAAAD////AAAAAA////gAAAAAP///4AAAAPz///8AAAAD8H///AAAAA/D///g+AAAPx///4PgAAD8f//8D4AAA/H///A+AAAAB///gPgAAAAf//4AAAAAAH//+AAAAAAAB//AAAAAAAAf/wAAAAAAAH/4AAAAAAAB/+AAAAAAAAB/AAAAAAAAAfwAAAAAAAAH4AAAAAAAAB8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="},"tachycineta-thalassina":{"w":93,"h":72,"bits":"4AAAAAAAPgAAAAAHAAAAAAAB8AAAAAA4AAAAAAAPgAAAAAAAAAAAAAB8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAAAAAAAAAAAAB4AA/8AAAAAAAAAAPAA//8AAAAAAAAAB4AP//wAAAAAAAAAPAD///gAAAAAAAAAAA///+AAAAAAAAAAAP///4AAAAAAAAAAD////AAAAAAAAAAB////8AAAAAAAAAAf////wAAAAAAAAAD/////AAAAAAAAAAf////+AAAAAAAAAD//////4AAAAAAAAf//////AAAAAAAAD//////4AAAAAAAAB//////AAAAAAAAAH/////+AAAAAAAAA//////8AAAAAAAAD//////8AAAAAAAAf//////+AAAAAAAD///////+AAAAAAAf///////8AAAAAAD////////wAAAAAAf////////wAAAAAD/////////gAAAAAf/////////4AAAAB//////////8AAAAP///////////gAAB////////////4AAP////////////wAA/////////////AAH////////////4AAf////////////AAD////////////4AAP////////////AAA/////////////AAD////////////4AAP////////////AAA////////////4AAD////////////AAAP///////////4AAAf///////////AAAB//////wH//+AAAAB/////gAAAAAAAAAP////gAAAAAAAAAD////wAAAAAAAAAAf///wAAAAAAAHwAD///gAAAAAAAA+AAf//wAAAAAAAAHwAD//+AAAAAAAAA+AAH+AAAAAAAAAAHwAAAAAAAD4AA+AAAAAAAAAAAfAAHwAAAAAAAAAAD4AA+AAAAAAAAAAAfAAHwAAAAAAAAAAD4AA+AAAAAAAAAAAfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"thalasseus-elegans":{"w":93,"h":67,"bits":"8D4AAAAAAAAAAAAHgfAAAAAAAAAAAAA8D4AAAAAAAAAAAAHAfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/AAAAAAAAAAAAAP/+AAAAAAAAAAAAD//4AAAAAAAAAAAH///wAAAAAAAAAAP////AAAAAAAAAAH////8AAAAAAAAAB/////gAAAAAAAAAP////8AAAAAAAAAB/////gAAAAAAAAAP////+AAAAAAAAAB//////gAAAAAAAAAAf////wAAAAAAAAAD/////gAAAAAAAAAf/////AAAAAAAAAD+P/////AD/gAAAAfx/////8H/8AAAAD//////////gAAAAf/////////8AAAAD//////////gAAAAf/////////4AAAAD//////////gAAAAP/////////8AAAAB//////////gAAAAH/////////8AAAAA//////////gAAAAD/////////4AAAAAP////////AAAAAAA//////4AAAAAAAAD/////8AAAAAAAAAP////+AAAAAAAAAAf////AAAAAAAAAAA////gAAAAAAAAAAAf//wAAAAAAAAAAAA//4AAAAAAAAAAAAD/gAAAAAAAAAAAAAf4AAAAAAAAAAAAAD/AAAAAAAAAAAAAAf4AAAAAAAAAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"thryomanes-bewickii":{"w":93,"h":43,"bits":"AAAAAAAAAD/////4AAAAAAAAA///////+AAAAAAAf////////gAAAAAH/////////wAAAAB//////////wAAAA//////8////wAAAf/////8H////gAAf/////+A/////gAP//////gB/////gH//////wAD/////D//////8AAD////////////gAAD///////////4AAAH//////////+AAAAH/////////+AAAAAP/////////gAAAAAP////////8AAAAAAf////////gAAAAAB////////8AAAAAAH////////gAAAAAAf///////8AAAAAAD////////gAAAAAAP///////8AAAAAAD////////AAAAAAA////////4AAAAAAH////////AAAAAAA////////4AAAAAAH////////AAAAAAA////////wAAAAAAH///////8AAAAAAAD//////8AAAAAAAAf/////8AAAAAAAAB////4AAAAAAAAAAP///+AAAAAAAAAAA////8AAAAAAAAAAD////wAAAAAAAAAAf////AAAAAAAAAAA////8AAAAAAAAAAB////gAAAAAAAAAAH///8AAAAAAAAAAAf///gAAAAAAAAAAB///8AAAAAAAAAAAH///AAAAAA="},"toxostoma-redivivum":{"w":93,"h":49,"bits":"AAAAAAAAAAB///wAAAAAAAAAAAf///AAAAAAAAAAAH///8AAAAAAAAAAB////wAAAAAAAAAAf///+H//8AAAAAAH////w////AAAAA//////H////gAAA//////4/////wAAf//////H/////4AP//////8//////4H///////3/////////////////////////////////////////////////////////////5///////////////AP///////////8/4AB///////////D/AAAf/////////4H4AAAH/////////A/AAAAP////////4D4AAAAf///////+APAAAAB////////wB4AAAAH///////+APAAAAAf///////gAAAAAAD///////8AAAAAAAf///////AAAAAAAD///////wAAAAAAAf//////8AAAAAAAD///////AAAAAAAAA//////wAAAAAAAAD/////8AAAAAAAAAP////+AAAAAAAAAB/////gAAAAAAAAAH////4AAAAAAAAAAP///+AAAAAAAAAAA///+AAAAAAAAAAAD//+AAAAAAAAAAAAf//AAAAAAAAAAAAD/8AAAAAAAAAAAAAf+AAAAAAAAAAAAAD/gAAAAAAAAAAAAAf8AAAAAAAAAAAAAB/gAAAAAAAAAAAAAP8AAAAAAAAAAAAAB/gAAAAAAAAAAAAAH8AAAAAAAAAAAAAA/gAAAAAAAAAAAAAH8AAAAAAA"},"tringa-semipalmata":{"w":93,"h":77,"bits":"///4B8AAAAAAAP/n///+PgAAAAAB//+/////8AAAPwAP////////gAAB+AD////////8B+Af4Af////////8P+//gD/////////7///8Af/////////////gD/////////////8Af/////////////gD/////////////8Af/////////3///gD/////////////wAf/////////4//+AD//////////H//gB//////////4P/8AP//////////B//gD///////////v//H////////////w/4///////////////H/////////////74///////////////H//////////////wP//////////////h///////////////H//////////////+D//////////////4f//7///////////7///f////////////////////////////////////////////////////////////////////////////n//////////////8f//////////////x//////////////+P//////////////x//////////////+f//////////////z//////////////8f//////////////j//////+P//////wf///////3////8AD/////////////wAf/////////////+D///////////7///f//////////+D//7//////////wAf/////////3//+Af/////////+/3/wD//////////3+f+Af/////////+/x/wD7/////////3+H+Af/////////8/w/wD//////////n+D+Af/////////9/wf4D//////////v+D/Af/////////9/gf4D//////////v8D/Af/////////9/gP4H///////////8B/A////////////AP4P///////////4B/h////////////AP8P///////////wB/z///////////+AP/////////////wB/////////////+AP/////////////gB/////////////8AH/////////////AAAD///3///////wAAA///+///////+AAAH///3///////wAAA///+///////+AAAH///3///////wAAA///+///////+AAAAf/vwA="},"troglodytes-aedon":{"w":93,"h":82,"bits":"4AAB+AAAAAAAAAAHAAPv/gAAAAAAAAA4AB//8AAAAA+AAAAAAP//wAAAAHwAAAAAB//+AAAAA+AAAAAAP//wAAAAHwAAA8AAH/+APgAA+AAAHgAA//wB8AAAAAAA8AAH/+f/gAAAAPgHgAAAPz/8AAAAB8H8AAAAAf/gD4AAPg/+AAAAD/8A/AAB8H//gAAAfwAf4AAPg//8AAAAAAD/AAB8H//gAAAAAAf4AAAA4/8AAAAAAD/AAAAPH/gP/wAAAfgAAAB4/AH//wAAB+AAAAPH4D///gAAPwAAfx4/B///+AAB+AAf+PAH////8AAPwAH/x4D/////wAB+AD/+PAf/////AAPwA//x/j/////+AAAAP/+A8f/////4AAAH//wHj//////4AAB///w8f//////wAAP//+Hh///////wAD///wAD///////AB///+AAf///////Af///wAD///////8H///AAAP///////5///wAAAH//////////+AAAA/v/////////wAAAH//////////+AAAAf///////////nAAD/////////+/84AAP/////////wPnAAB/////////+B84AAP/////////gPnAAB//////////wA4AAP/////////+AAAAB/v////////wAAAAP9/////////8AAAB/3/////////gAAAH//////////8A4AA///////////gHgAD///////////w8AAP/////////B+H8AB/////////4Pw/j4H////////fB+H+fA////////4APw/z/z////////AB//+f+P///////4AH//z/w///////8AA//+A+D///////gAH//wHw//////4AAA//+AAP//////AAAD+/AAB//////gAAAD74AAP/////wAAB+ffAAB/////4AAAPz4AAAP////+AAAB+fAAAB/////gAAAP/4AAAAf///8AAAB/gAAAAH////gAAAH8B8AA+////8AB+H/gPgAH3////AAP4/8B8AA///+PwAB/HwAPgAH///B8B+P4+AB8AA//+APgPx/HwAAAAD9/8B8B+H4fAAAAAfgPgPgP4AD4AAAAD8B8B8B/AAfAAAAAAAPgAAD4AD4AAAAAAB8D/4fAAfAAAAAPgPgf/D4AAAAAAAB8AAD///AAAAAAAAPgAAf/8AAAAPAAAB8AA///gAAAB4AAAPgAHwD+AAAAPAAAAAAA+AfwAAAB4AAAAAAHwD+AAAAPA"},"troglodytes-pacificus":{"w":93,"h":67,"bits":"/////8AAAAAAAAAH/////4AAAAAAAAA//////gAAAAAAAAH/////+AAAAAAAAA//////4AAAAAAAAH//////wAAAAAAAA///////AAAAAAAAH//////8AAAAAAAA///////wAAAAAAAH///////AAAAAAAAP//////8AAAAAAAAP//////wAAAAAAAA///////AAAAAAAAH//////8AAAAAAAA///////4AAAAAAAH///////wAAAAAAA////////gAAAAAAD////////AAAAAAAf///////+AAAAH4D////////8AAAD/Af////////4AAB/4D/////////wAA//AP/////////gAf/4B//////////wP//AP//////////n//4B//////////////AP/////////////4A//////////////AH/////////////4A/////////////+AH/////////////gA/////////////wAH////////////+AA/////////////wAH////////////8AA////////////+AAH////////////gAAf///////////4AAD///////////+AAAf///////////wAAB///////////8AAAP///////////gAAB///////////4AAAH//////////+AAAA///////////wAAAD//////////8AAAAf//////////wAAAB///////////AAAAP//////////4AAAA///////////gAAAD//////////8AAAAP//////////gAAAA//////////8AAAAD//////////gAAAAP/////////8AAAAA////////8AAAAAAD////////AAAAAAAP///////gAAAAAAAf//////wAAAAAAAB//////4AAAAAAAAD/////+AAAAAAAAAP////+AAAAAAAAAAf///+AAAAAAAAAAAf///gAAAAAAAAAAA///gAAAAAAAAAAAH//4AAAAAAAAAAAA//+AAAAAAA="},"turdus-migratorius":{"w":93,"h":67,"bits":"AAAAAAAAAAf///gAAAAAAAAAAH/////AAAAAAAAAB/////4AAAAAAAAAf/////AAAAAAAAAH/////4AAAAAAAAA//////AAAAAAAAAP/////4AAAAAAAAB//////AAAAAAAAAf/////4AAAAAAAAD/////8AAAAAAAAA/////4AAAAAAAAAH////8AAAAAAAAAB/////gAAAAAAAAAP////4AAAAAAAAAD////+AAAAAAAAAAf////wAAAAAAAAAH////8AAAAAAAAAD/////gAAAAAAAAA/////8AAAAAAAAAf/////gAAAAAAAAH/////+AAAAAAAAB//////wAAAAAAAA//////+AAAAAAAAP//////wAAAAAAAB///////AAAAAAAAf//////4AAAAAAAH///////AAAAAAAB///////4AAAAAAAP///////AAAAAAAD///////4AAAAAAA////////AAAAAAAP///////4AAAAAAD////////AAAAAAA////////4AAAAAAP////////AAAAAAD////////4AAAAAAf////////AAAAAAH////////4AAAAAB////////+AAAAAAf////////wAAAAAD////////+AAAAAA/////////wAAAAAP////////8AAAAAB/////////gAAAAAf////////4AAAAAP/////////AAAAAP/////////wAAAAH/////////+AAAAH//////////gAAAD//////////8AAAD///////////AAAB///////////wAAA///////////+AAAf///////////gAAf///////////4AAH///////////+AAA////////////gAAH///////////4AAA///////////8AAAH///+f//////AAAA///+D//////gAAAH///Af5////4AAAA///AAAH////gAAAAD/gAAAP/j/8AAAAAAAAAAA/+P/gAAAAAAAAAAD/w/8AAAAAAAAAAAP+B/gAAAA="},"tyrannus-verticalis":{"w":93,"h":93,"bits":"AAAAAAAAAAAPgAAAAAAAAAAAAAB8AAAAfAAAAAAAAAPgAAAD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAAAAAAAAAAAAAfAAAAAAAAAAAAAAD4AAAAAAAAAAAAAAfAAAAAAAAAAAAAAD4AAAAAAAB8AAAAAfAAAAAAAAPgAAAAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAA/gB8AAAAAAAAAAB//wAAAAAAAAAAAA///gAAAAAAAAAAAf//+AAAAAAAAAA+////4AAAAAAD4AH/////gAAAAAAfAA/////8AAAAAAD4AH/////wAAAAAAfAA//////AAAAAAD4AH/////8AAAAAAAAAf/////j8AAAAAAAD/////+fgAHwAAAAB/////78AA+AAAAAB//////gAHwAAAAAH/////8AA+AAAAAAf/////AAHwAAAAAD/////8AAA+AAAAAP/////4AAHwAAAAB//////gAA+AAAAAH/////+AAHwAAAAA//////4AA+fgAAAD//////gAAD8D4AAf/////+AfAfgfAAD//////4D4D8D/gAf//////wfAfgf8AD///////D4AAD/gH///////8fAAAA8A////////wAAAAHgH////////AAAAAAA////////8AAAAAAH////////wAAAAAAB////////AAAAAAAP///////8AAAAAAA////////wAAAAAAH///////+AAAAAAAf///////4AAAAAAB////////AAAAAAAP///////8AAAAAAA////////4AAAAAAD////////gAAAAAAP///////+HwAAAAA////////4+AAAAAD////////nwAAAAAH///////++AAAAAAf////////wPAAAAA////////AB4AAAAD///////4APAAAAAH///////AB4AAAAAH//////4APAAAAAAH//////AAAAAAAAAP/f///8AAAAAAAAAH7////wAAAAAAAAAAAP///AAAAAAAAAAAAH//8AAAAAAAAAAAAP//wAAAAAAAAAAAAf//AAAAAAAAAAAAB//8AAAAAAAAAAAAH//wAAAAAAAAAAAAf//AAAAAAAAAAAAB//8AAAAAAAAAAAAH//wAAAAAAAAAAAAf/+AAAAAAAAAAAAB//4AAAAAAAAAAAAH//AAAAAAAAAAAAAf/4AAAAAAAAAAAAB//AAAAAAAAAAAAAH/4AAAAAAAAAAAAAf/AAAAAD4AAAAAAB/4AAAAAfAAAAAAAH+AAAAAD4AAAAAAAPgAAAAAfAAAAAAAAAAAAAAD4AA/AAAAAAAAAAAAAAH4AAAAAAAAAAH4AA/AAAAAAAAAAA/AAH4AAAAAAAAAAH4AA/AAAAAAAAAAA/AAAAAAAAAAA="},"tyrannus-vociferans":{"w":82,"h":93,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/gAAAAAAAAAAB//gAAAAAAAAAAf//gAAAAAAAAAH///AAAAAAAAAD///+AAAAAAAAAf///4AAAAAAAAB////wAAAAAAAAH////AAAAAAAAAf///+AAAAAAAAB////4AAAAAAAAH////wAAAAAAAAD////gAAAAAAAAH////AAAAAAAAAP///+AAAAAAAAAf///8AAAAAAAAB////4AAAAAAAAH////wAAAAAAAAf////gAAAAAAAB/////AAAAAAAAH////+AAAAAAAAf////4AAAAAAAB/////wAAAAAAAH/////AAAAAAAAf////+AAAAAAAB/////8AAAAAAAH/////4AAAAAAAP/////wAAAAAAA//////AAAAAAAD/////+AAAAAAAP/////4AAAAAAAf/////wAAAAAAB//////AAAAAAAD/////+AAAAAAAP/////4AAAAAAAf/////wAAAAAAA//////gAAAAAAB//////AAAAAAAH/////+AAAAAAAP/////8AAAAAAAf/////wAAAAAAAf/////AAAAAAAA/////8AAAAAAAP/////wAAAAAAB//////AAAAAAAH/////8AAAAAAAf/////wAAAAAAB//8f//gAAAAAAH//w//+AAAAAAAf//A//8AAAAAAB//8B//4AAAAAAH//wD//wAAAAAAf/+AH//AAAAAAAf8AAP/+AAAAAAB/wAAf/8AAAAAAD8AAB//4AAAAAAAAAAD//gAAAAAAAAAAH//AAAAAAAAAAAf/+AAAAAAAAAAA//4AAAAAAAAAAB//wAAAAAAAAAAD//AAAAAAAAAAAP/8AAAAAAAAAAAf/wAAAAAAAAAAA//AAAAAAAAAAAB/8AAAAAAAAAAAD/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"tyto-alba":{"w":93,"h":77,"bits":"4AAAAAAAAAAAB8AHAAAAAAAAAAAAPgA4AAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAP/+AAAAAAAAB8AAP//8AAAAAAAAAAAD///4AAAAAAAAAAB////gAAAAAAAAAAP///+AAAAAAAAAAD////4AAAAAAAAAA/////gAAAAAAAAAH////+AAAAAAAAAA/////8AAAAAAAAAH/////4AAAAAAAAA//////wAAAAAAAAH//////wAAAAAAAA////////4AAAAAAH////////4AAAAAA/////////4AAAAAH/////////wAAAAA//////////wAAAAH//////////AAAAA//////////4AAAAH//////////wAAAA///////////AAAAH//////////4AAAA///////////AAAAH//////////4AAAA///////////AAAAH//////////4AAAAf//////////gAAAB///////////AAAAP///////////AAAA////////////AAAD///////////8AAAP///////////gAAA///////////8AAAB///////////gAAAP//////////+AAAA///////////+AAAH////////////AAA/////////////AAD////////////+AAP////////////8AA/////////////4AD/////////////AAP////////////4AA/////////////AAD////////////4AAP////////////AAB////////////4AAH////////////AAAf///////////4AAB////////////AAAH///////////wAAAf//////////4AAAA//////////8AAAAB/////////8AAAAAB////////+AAAAAAH////////wAAAAAA////////+AAAAAAD///////8AAAAAAAA///////AAAAAAAAP//////gAAAAAAAD///8f/8AAAAAAAAf///B//gAAAAAAAD///4H/4AAAAAAAAf//gAf+AAAAAAAAD//AAB/gAAHAAAAAB/4AAAAAAA4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAA4AAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"urile-penicillatus":{"w":49,"h":93,"bits":"4AAAAAAAcAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/+AAAAAD//4AAAf///+AAAf////gAAf////wAAP////8AAH////+AAD/////gAB/////wAA/////4AAAH///8AAAAf//+AAAAD///AAAAD///gAAAD///wAAAB///4AAAB///8AAAA///8AAAAf///AAAAP///wAAAH///8AAAD///+AAAB////gAAA////4AAAf///+AAAP////gAAH////4AAB////8AAA/////AAAf////wAAH////4AAD////+AAB/////AAA/////wAAf////4AAP////8AAH/////AAD/////gAA/////wAAf////4AAP////+AAD/////AAB/////gAAf////wAAP////4AAH////8AAB////+AAA/////gAAP////wAAH////4AAB////8AAAf///+AAAP////AAAD////gAAB////wAAAf///4AAAP///8AAAH///+AAAD////AAAA////AAAAf///gAAAf///wAAD////4AAD////+AAD/////AAD/////gAP/////4AH/////8AD///v/+AB///3//gA///z//wAf//x//4AP//A//8AH/4AP/+AD/AAH//AAAAAD//gAAAAA//wAAAAAP/4AAAAAD/8AAAAAA/+AAAAAAH/AAAAAAAAAAAAAAAAAAAAAAAAA"},"vireo-bellii":{"w":93,"h":93,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/wAAAAAAAAAAAAH//wAAAAAAAAAAAB///gAAAAAAAAAAA///+AAAAAAAfgAAP///4AAAAAAf+AAH////gAAAAAP/8AH/////AAB8AH//wD/////4AAPgB//+Af/////wAB8A///wD//////4APgf//+Af//////wB8H///wD///////wAD///+Af///////gB////wAP///////B////8AAf///////////+AAB////////////AAAP///////////gAAA///////////wAAAH//////////wAAAAf/////////4AAAAD/////////8AAAAAf/////////AAAAAB/////////wAAAAAP////////+AAAAAB/////////gAAAAAH////////4AAAAAA////////+AAAAAAH////////gAAAAAA////////8AAAAAAD////////wAAAAAAf////////gAAAAAB////////8AAAAAAP////////wAAAAAA////////+AAAAAAD////////wAAAAAAP///////+AAAAAAA//////3/wAAAAAAD/////8D+AAAAAAAP////+AAAAAAAAAAf////gAAAAAAAAAB////wAAAAAAAAAAB///8AAAAAAAAAAAB//4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"vireo-cassinii":{"w":93,"h":53,"bits":"8AAAAAAAAAAAAAAHgAAAAAAAAAAAAAA8AAAAAAAAAAH/+AHgAHwAAAAAAD//8AAAA+AAAAAAB///4AAAHwAAAAAAf///gAAA+AAAAAAH///+AAAHwAAAAAD////wAAAAAAAAAA/////AAAAAAAAAA/////8AAAAAAAAA//////4AAAAAAAA///////AAAAAAAAf//////4AAAAAAAP///////AAAAAAAP///////4AAAAAAH////////AAAAAAH////////4AAAAAH/////////AAAAAD/////////AAAAAB/////////wAAAAAf////////8AAAAAP/////////gAAAAP/////////4AAAAf//////////AAH////////////wH/////////////+A//////////////gH/////////////8A//////////////gH/////////////8A//////////////AH/////////////4A//////////////AH/////////////wA//+D/////////8AB8AAD/////////gAAAAAB////////4AAAAAAD////////AAAAAAAH///////wAAAAAAAP//////8AAAAAAAA///////AAAAAAAAB//////gAAAAAAAAH/////4AAAAAAAAAf////+AAAAAAAAAB/////gAAAAAAAAAD////wAAAAAAAAAAH///wAAAAAAAAAAAH//4AAAAAAAAAAAAAf/AAAAAAAAAAAAAA/4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"vireo-gilvus":{"w":77,"h":93,"bits":"AAAAAAAAAAAPgAAAAAAAAAAAfAAAAAAAAAAAA+AAAB8AAAAAAAAAAAD4AAAAAAAAAAAHwAAAAAAAAAAAPgAAAAAAAAAAAfAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH//+AAAAAAAAAP///gAAAAAAAAf///gAAAAAAAA////wAAAAAAAB////wAAAAAAAD////wAAAAAAAB////wAAAAAAAA////gAAAAAAAH////gAAAAAAB/////gAAAAAAD/////AAAAAAAH/////AAAAAAAP////+AAAAAAAf////+AAAAAAA/////+AAAAAAAD////+AAAAAAAH////+AAAAAAAH////+AAAAAAAP////+AAAAAAAf/////AAAAAAAf/////AAAAAAAf/////D4AAAAA/////+HwAAAAB/////+PgAAAAD/////+fAAAAAH/////8+AAAAAP/////8AAAAAAf/////8AAAAAA//////8AAAAAB//////8AAAAAB//////4AAAAAD//////4AAAAAH//////wAAAAAP//////wAAAAAf//////gAAAAA///////gAAAAA///////AAAAAB///////AAAAAD//////+AAAAAD//////+AAAAAH//////8AAAAAH//////4AAAAAH//////wAAAHwH//////wAAAPgP//////gAAAfAP//////gAAA+AP//////AAAB8AP/////+AAAAAH//////+AAAAAP//////8AAAAAf//////4AAAAA///////wAAAB9///////wAAAD////////gAAAH////////gAAAP////////gAAAf/////f//gAAAf/5//+f//AAAAA/w//8f//AAAAB/h//4///AAAAD+D//w//+AAAAD8H//h//+AAAAD4P/AB//8AAAAAAf+AB//8AAAAAAf8AD//4AAAAAA/4AD//4AAAAAB/wAH//wAAAAAD/AAH//gAAAAAD8AAP//gAAAAAAAAAP//AAAAAAAAAAP/+AAAAAAAAAAf/8AAAAAAAAAAf/4AAAAAAAAAAAfgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"vireo-huttoni":{"w":68,"h":93,"bits":"4AAAAAAAAAAOAAAAAAAAAADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/+AAAAAAAAD//4AAAAAAAD///AAAAAAAD////AAAAAAA////+AAAAAAf////gAAAAAP////4AAAAAH////+AAAAAD/////gAAAAB/////4AAAAAf////8AAAAAP////+AAAAAD/////AAAAAA/////wAAAAAf////8AAAAAH/////AAAAAB/////wAAAAA/////8AAAAAP/////AAAAAD/////4AAAAB/////+AAAAA//////wAAAAf/////8AAAAH//////gAAAD//////4AAAA//////+AAAAf//////wAAAH//////8AAAD///////AAAA///////wAAAf//////8AAAH///////AAAD///////wAAA///////8AAAP///////AAAH///////wAAB///////8AAA////////AAAP///////wAAD///////8AAB///////+AAAf///////gAAH///////4AAB///////8AAAf///////AAAP////H//wAAD////h//4AAA////w//+AAAP///4f//AAAD///+P//wAAA////v//4AAAf///3//8AAAH///7///AAAB///////gAAAf//+///wAAAH//////4AAAD//////8AAAB//////+AAAAf/////+AAAAP//////AAAAH//////AAAAB/////AAAAAA///8AAAAAAAf//8AAAAAAAP//8AAAAAAAD///AAAAAAAB///gAAAAAAAf//4AAAAAAAP//8AAAAAAAH///AAAAAAAB///gAAAAAAAf//4AAAAAAAP//8AAAAAAAD///AAAAAAAA///gAAAAAAAP//4AAAAAAAD//8AAAAAAAA//+AAAAAAAAH//AAAAAAAAAB/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"xanthocephalus-xanthocephalus":{"w":48,"h":93,"bits":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/wAAAAAf/8AAAAA//+AAAAB///AAAAD///4AAAH///+AAAP////AAAP////AAAf////AAAf////AAAf////AAA/////AAB////wAAD////gAAH////AAAP////gAAf////gAA/////gAA/////gAB/////gAB/////gAD/////gAD/////gAH/////gAH/////gAP/////gAP/////gAf/////gAf/////gAf/////AA//////AA//////AA/////+AP/////+AP/////8AP/////8AP/////8AP/////4AB/////4AD/////wAD/////wAD/////gAD/////AAH/////AAH////+AAH////8AAH////4AAP////wAAP////wAAP////gAAP///AAAAP//+AAAAP//8AAAAD//8AAAAH//4AAAAH//4AAAAH//4AAAAP//4AAAAP//4AAAAf//wAAAAf//wAAAA///wAAAA///wAAAA///wAAAA///wAAAA///wAAAA///wAAAA///wAAAA///gAAAA///gAAAA///gAAAAf//gAAAAP//AAAAAAf+AAAAAAD4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"},"zenaida-asiatica":{"w":93,"h":93,"bits":"A/AAAAAAAAAAAAAAH4AAAAAAAAAAAAAA/AAAAAAAAAAAAAAH4AAAAAAAAAAAAAA/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/4AAAAAAAAAAAAAf/wAAAAAAAAAAAAH//gAAAAAAAAAAAB//+AAAAAAAAAAAAf//wAAAAAAAAAAAD///AAAAAAAAD4AAf//4AAAAAAAAfAAH///gAHwAAAAD4AB///8AA+AAAAAfAAf///wAHwAAAAD4AH///+AA+AAAAAAAA////4AHwAAAAAAAP////gAAAAAAAAAB////+AAAAAAAAAAP////8AAAAAAAAAB/////4AAAAAAfgAP/////wAAAAAD8AA+f////wAAAAAfgAAH/////wAAAAD8AAA//////gAAAAfgAAH/////+AAAAAAAAA//////8AAAAAAAAH//////wAAAAAAAA///////AAAAAAAAH//////8AAAAAAAA///////4AAAAAAAH///////wAAAAAAA////////AAAAAAAH///////8AAAAAAA////////4AAAAAAH////////AAAAAAA////////+AAAAAAH////////4AAAAAAf////////AAAAAAD////////+AAAHAAf////////8AAA4AB/////////4AAHAAP/////////wAA4AB//////////AAHAAH/////////4AAAAA//////////gAAAAD/////////8AAAAAP/////////gAAAAA/////////8AAAAAD/////////gAAAAAP////////4AAAAAA/////////AAAAAAB////////4AAAAAAD////////gAAAAAAH///////+AAAAAAAP///////4AAAAAAA////f///gAAAAAAH//wA///+AAAAAAA//4AA///wAAAAAAAAAAAB///gAAA+AAAAAAAH//+AAAHwAAAAAAAf//wAAA+AAAAAAAA///4AAHwAAAAAAAD///AAA+AAAAAAAAP//4AAHwAAAAAAAA///AAAAAAAAAAAAD//4AAAAAAAAAAAAH//gAAAAAAAAAAAAf/8AAAAAAAAAAAAB//gAAAAAAAAAAAAH/8AAAAAAAAAAAAAP/gAAAAAAAAAAAAAf4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAB8AAAAAAAAAAAAAAPgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="},"zenaida-macroura":{"w":87,"h":93,"bits":"P//wAAAAAAAAAAB///AAAAAAAAAAAf//4AAAAAAAAAAD///gAAAAAAAAAAf//8AAAAAAAAAAH///gAAAAAAAAAA///+AAAAAAAAAAH///wAAAAAAAAAA///+AAAAAAAAAAH///4AAAAAAAAAA////AAAAAAAAAAH///8AAAAAAAAAA////gAAAAAAAAAH///+AAAAAAAAAA4f//4AAAAAAAAAAD///gAAAAAAAAAAf//+AAAAAAAAAAD///4AAAAAAAAAAf///wAAAAAAAAAH////AAAAAAAAAA////8AAAAAAAAAH////4AAAAAAAAA/////wAAAAAAAAH/////AAAAAAAAA/////+AAAAAAAAH/////4AAAAAAAA//////gAAAAAAAH/////+AAAAAAAA//////4AAAAAAAH//////gAAAAAAA//////+AAAAAAAH//////4AAAAAAA///////gAAAAAAH//////8AAAAAAA///////wAAAAAAH///////AAAAAAA///////4AAAAAAH///////gAAAAAA///////+AAAAAAH///////4AAAAAA////////gAAAAAD///////8AAAAAAf///////wAAAAAD////////AAAAAAP///////8AAAAAB////////gAAAAAH///////+AAAAAA////////4AAAAAD////////AAAAAAP///////8AAAAAA////////gAAAAAD///////8AAAAAAf///////wAAAAAB////////AAAAAAD///////4AAAAAAP///////gAAAAAA///////8AAAAAAD///////wAAAAAAH//////+AAAAAAB///////4AAAAAAP///////gAAAAAB///////+AAAAAAP///////wAAAAAB////////AAAAAAP/f/////8AAAAAAAAAB////gAAAAAAAAAB///+AAAAAAAAAAB///4AAAAAAAAAAH///gAAAAAAAAAAf//+AAAAAAAAAAB///4AAAAAAAAAAD///AAAAAAAAAAAP//8AAAAAAAAAAA///wAAAAAAAAAAB///AAAAAAAAAAAH//8AAAAAAAAAAAf//wAAAAAAAAAAB///AAAAAAAAAAAH//4AAAAAAAAAAAf//gAAAAAAAAAAB//+AAAAAAAAAAAH//4AAAAAAAAAAAf//gAAAAAAAAAAB//8AAAAAAAAAAAD//wAAAAAAAAAAAP//AAAAAAAAAAAA//4AAAAAAAAAAAD//AAAAAAAAAAAAP/4AAAAAAAAAAAA//AAAAAAAAAAAAB/4AAAAAAAAAAAAH/AAAAAAAAAAAAAf4A=="},"zonotrichia-atricapilla":{"w":93,"h":39,"bits":"AAAAAAAAAB/////wAAAAAAAAA//////AAAAAAAAA//////4AAAAAAAAf//////AAAAAAAAH//////4AAAAAAAD///////AAAAAAAB///////4AAAAAAA////////AAAAAAAP///////4AAAAAAH////////AAAAAAB////////4AAAAAA/////////AAAAAAP////////4AAAAAH/////////AAAAAB/////////4AAAAAf/////////AAAAAH/////////4AAAAB/////////4AAAAA/////////+AAAAAP/////////gAAAAH/////////4AAAAD/////////+AAAAA//////////gAAAAf/////////8AAAAf//////////AAAAP//////////wAAAH//////////+AAAH///////////gAAD///////////4AAB///////////+AAA////////////AAAf///////////gAAP///AAP/////wAAH///gAAf////4AAA///AAAAP///4AAAH//gAAAAP///gAAA//wAAAAAAD/8AAAH/4AAAAAAAf/gAAA/8AAAAAAAA/8AAAAA=="},"zonotrichia-leucophrys":{"w":93,"h":52,"bits":"H//+AAAAAAAAAAAA///4AAAAAAAAAAAP///gAAAAAAAAAAB///+AAAAAAAAAAAf///wAAAAAAAAAAH////AAAAAAAAAAA////8AAAAAAAAAAH////wAAAAAAAAAA/////AAAAAAAAAAH////8AAAAAAAAAA/////4AAAAAAAAAH/////wAAAAAAAAA//////gAAAAAAAAB/////+AAAAAAAAAH/////4AAAAAAAAAf/////wAAAAAAAAD//////AAAAAAAAAP/////8AAAAAAAAB//////wAAAAAAAAH//////AAAAAAAAA//////4AAAAAAAAH//////gAAAAAAAA//////+AAAAAAAAH//////4AAAAAAAA///////wAAAAAAAD//////+AAAAAAAAf//////4AAAAAAAD///////gAAAAAAAP///////AAAAAAAB////////wAAAAAAH/////////8AAAAA///////////wAAAD////////////AAAP/////////////AA/////////////4AD/////////////AAP////////////4AA/////////////AAD////////////4AAH////////////AAAP///////////4AAAf/////+P////AAAA//////wAP//4AAAB///9/wAAAf/AAAAB//AAAAAAAD4AAAAH/wAAAAAAAAAAAAB/8AAAAAAAAAAAAAP/gAAAAAAAAAAAAD/4AAAAAAAAAAAAAf+AAAAAAAAAAAAAD/gAAAAAAAAAAAAAf4AAAAAAAAAA="},"zonotrichia-querula":{"w":93,"h":49,"bits":"/D//8AAAB8+AAAAH7///gAAAPnwAAAA////8AAAB8+AAAAHv///gAAAPgAAAAAD///8AAAB8AAAAAAf///wAAAAAAAAAAH////AAAAAAAAAAD////8AAAAAAAAAA/////wAAAAAAAAAH/////AAAPwAAAAA//////AAB+AAAAAH//////AAPwAAAAA//////+AB+AAH4AH//////8APwAA/AA//+////wB+AAH4AH///////AAAAA/AfH///////AAAAH4/4///////+AAAAAH/D///////8AAAAA/4f///////wAAAAH/f////////AAAAA/7/////////+AAAH8f/////////wAAAPn/////////+AAAB8//////////wAAAPn/////////+AAAB8//////////wAAPgH//////////wA/8AD//////////AH/gAP/////////8A/8AB//////////gH/gAP//////////A/AAB///////////z8AAH//n/////////gAA//4+f///////8AAH//AD4f//////8AA//4AfA///////94H//AH4Af///////A//wA/AP///////4Af/gH4H////////AB//A/D////////4AH//P5/////////AAf//8f//gf////4AA//////AAAf///AAD/////h8AA///4AAH////wPgAH3//AAAH////x8AA///gAAAH//++PgAAPgAAAAAP/8Hx8AAB8AA"}};

  // Tunables - Galliformes-poster-inspired. Raster-mask nesting.
  //
  // Layout discipline: tile areas are NORMALISED against a viewport
  // budget (sum of areas ≈ packingBudgetFrac × vpArea) rather than
  // each tile being clamped to a per-tile maxArea. The old per-tile
  // cap made every loud bird look identical (Anna n=398, Crow n=31
  // and Phoebe n=26 all hit ceiling and rendered the same size) AND
  // it allowed total area to overflow narrow viewports so birds got
  // dropped off-screen. Normalising fixes both - relative size
  // tracks the relative call ratio, and total area can never exceed
  // what the iterative shrink loop is willing to scale into the
  // viewport.
  function tuning(n) {
    return {
      // Soft area budget the whole cluster aims to fill, as a
      // fraction of viewport area. Lower = sparser collage with more
      // breathing room (and more headroom for packing efficiency).
      // Steps down as species count grows so a busy plate doesn't
      // try to claim the entire viewport.
      packingBudgetFrac: n <= 4  ? 0.46 :
                          n <= 12 ? 0.40 :
                          n <= 24 ? 0.34 :
                                    0.28,
      // Count -> area exponent. ~0.65 keeps the visual hierarchy
      // legible (n=400 reads ~5× bigger than n=30) without the
      // loudest bird drowning everything else.
      countExp: 0.65,
      // Floor: every species in the dataset must be visible, even
      // n=1. Tracks species count so a tiny rare bird stays
      // recognisable on a crowded plate.
      minTileAreaFrac: n <= 8 ? 0.0100 :
                        n <= 20 ? 0.0075 :
                                  0.0055,
      // Wider clusters for landscape viewports, more so as n grows.
      ellipseAspectBias: 2.1,
    };
  }
  var GRID_STRIDE = 4; // viewport px per occupancy cell; smaller = slower

  // Decode and cache each mask once. Sparse cell-list form (only "on"
  // cells) makes collision tests linear in opaque area, not total area.
  var maskCache = {};
  function loadMask(slug) {
    if (maskCache[slug]) return maskCache[slug];
    var rec = MASKS[slug];
    if (!rec) return null;
    var bytes = atob(rec.bits);
    var w = rec.w, h = rec.h;
    var cells = [];
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var i = y * w + x;
        var b = bytes.charCodeAt(i >> 3);
        if ((b >> (7 - (i & 7))) & 1) cells.push([x, y]);
      }
    }
    return (maskCache[slug] = { w: w, h: h, cells: cells });
  }

  function slugify(sci) {
    return sci.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  function aspect(sci) {
    var d = DIMS[slugify(sci)];
    return d ? d[0] / d[1] : 1.4;
  }

  // Mask-aware nester. tiles: { fullW, fullH, mask, data }. Returns the
  // same tiles with .x, .y assigned (top-left in viewport coords).
  function maskPack(tiles, W, H, ellipseBias) {
    var GW = Math.ceil(W / GRID_STRIDE) + 2;
    var GH = Math.ceil(H / GRID_STRIDE) + 2;
    var grid = new Uint8Array(GW * GH);

    function cellRange(tile, tx, ty, c) {
      // For mask cell (c[0], c[1]), return [gx0, gy0, gx1, gy1] (inclusive)
      // in grid coords, clamped to the grid.
      var sx = tile.fullW / tile.mask.w;
      var sy = tile.fullH / tile.mask.h;
      var x0 = (tx + c[0] * sx) / GRID_STRIDE | 0;
      var y0 = (ty + c[1] * sy) / GRID_STRIDE | 0;
      var x1 = (tx + (c[0] + 1) * sx) / GRID_STRIDE | 0;
      var y1 = (ty + (c[1] + 1) * sy) / GRID_STRIDE | 0;
      if (x0 < 0) x0 = 0; if (y0 < 0) y0 = 0;
      if (x1 >= GW) x1 = GW - 1; if (y1 >= GH) y1 = GH - 1;
      return [x0, y0, x1, y1];
    }
    function collides(tile, tx, ty) {
      var cells = tile.mask.cells;
      for (var i = 0; i < cells.length; i++) {
        var r = cellRange(tile, tx, ty, cells[i]);
        for (var gy = r[1]; gy <= r[3]; gy++) {
          var off = gy * GW;
          for (var gx = r[0]; gx <= r[2]; gx++) {
            if (grid[off + gx]) return true;
          }
        }
      }
      return false;
    }
    function stamp(tile, tx, ty) {
      var cells = tile.mask.cells;
      for (var i = 0; i < cells.length; i++) {
        var r = cellRange(tile, tx, ty, cells[i]);
        for (var gy = r[1]; gy <= r[3]; gy++) {
          var off = gy * GW;
          for (var gx = r[0]; gx <= r[2]; gx++) grid[off + gx] = 1;
        }
      }
    }
    function offGrid(tile, tx, ty) {
      // True if the rendered tile bbox extends past the viewport.
      return tx < 0 || ty < 0 || tx + tile.fullW > W || ty + tile.fullH > H;
    }

    var cx = W / 2, cy = H / 2;
    // Largest first so the cluster grows around the anchor.
    tiles.sort(function (a, b) { return (b.fullW * b.fullH) - (a.fullW * a.fullH); });
    var placed = [];
    // Seeded PRNG keeps the layout stable across resizes.
    var seed = 0x9E3779B9;
    function rand() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }

    for (var i = 0; i < tiles.length; i++) {
      var t = tiles[i];
      var tx, ty;
      if (i === 0) {
        tx = cx - t.fullW / 2;
        ty = cy - t.fullH / 2;
        t.x = tx; t.y = ty;
        stamp(t, tx, ty);
        placed.push(t);
        continue;
      }
      // Spiral outward. Stop the first ring that yields any non-colliding
      // position - that ring is the tightest possible distance from
      // centre. Within the ring, pick the position closest to the centre
      // of mass of already-placed tiles (so cluster grows organically,
      // not in fixed directions).
      var comX = 0, comY = 0, comW = 0;
      placed.forEach(function (p) {
        var a = p.fullW * p.fullH;
        comX += (p.x + p.fullW / 2) * a;
        comY += (p.y + p.fullH / 2) * a;
        comW += a;
      });
      comX /= comW; comY /= comW;

      var best = null, bestCost = Infinity;
      var step = Math.max(GRID_STRIDE, Math.min(t.fullW, t.fullH) * 0.05);
      var maxR = Math.max(W, H);
      var foundRing = -1;
      var phase = rand() * Math.PI * 2;
      for (var r = 0; r <= maxR; r += step) {
        if (foundRing >= 0 && r > foundRing + step * 2) break;
        var samples = Math.max(36, Math.floor(r / 1.6));
        for (var k = 0; k < samples; k++) {
          var theta = phase + (k / samples) * Math.PI * 2;
          // Elliptical ring - x stretched.
          var px = cx + r * ellipseBias * Math.cos(theta) - t.fullW / 2;
          var py = cy + r * Math.sin(theta) - t.fullH / 2;
          if (offGrid(t, px, py)) continue;
          if (collides(t, px, py)) continue;
          // Distance to existing cluster centre of mass + small noise.
          var dxx = (px + t.fullW / 2 - comX);
          var dyy = (py + t.fullH / 2 - comY);
          var cost = Math.hypot(dxx / ellipseBias, dyy) + rand() * step * 0.5;
          if (cost < bestCost) { bestCost = cost; best = { x: px, y: py }; }
        }
        if (best && foundRing < 0) foundRing = r;
      }
      if (best) {
        t.x = best.x; t.y = best.y;
        stamp(t, best.x, best.y);
        placed.push(t);
      } else {
        // Couldn't fit anywhere - hide off-screen rather than overlap.
        t.x = -99999; t.y = -99999;
        placed.push(t);
      }
    }
    return placed;
  }

  function renderCollage(items) {
    collage.innerHTML = '';
    if (!items.length) {
      collage.innerHTML = '<p class="empty">' + esc(tr('noBirdsWindow')) + '</p>';
      return;
    }
    var W = collage.clientWidth, H = collage.clientHeight;
    if (!W || !H) { setTimeout(function () { renderCollage(items); }, 80); return; }

    // Tuning depends on bird count - same viewport, very different
    // pack densities for 6 vs 48 birds.
    var T = tuning(items.length);
    var vpArea = W * H;
    var budget  = vpArea * T.packingBudgetFrac;
    var minArea = vpArea * T.minTileAreaFrac;

    // Step 1: build tiles + assign each a count-weighted SCORE (not a
    // final area yet). area-from-count uses a sub-linear exponent so
    // a 400-detection bird is visibly larger than a 30-detection bird
    // without dwarfing it.
    var tiles = items.map(function (s) {
      var slug = slugify(s.sci);
      var mask = loadMask(slug);
      if (!mask) return null;
      var n = +s.n; if (!n || isNaN(n)) n = 1;
      return {
        mask: mask, data: s,
        ar: aspect(s.sci),
        score: Math.pow(Math.max(1, n), T.countExp),
      };
    }).filter(Boolean);

    // Step 2: normalise so sum(area) ≈ budget. Then floor each tile
    // at minArea so even a 1-call bird stays legible.
    var sumScore = tiles.reduce(function (a, t) { return a + t.score; }, 0) || 1;
    tiles.forEach(function (t) {
      t.area = Math.max(minArea, budget * t.score / sumScore);
    });
    // After flooring, total may exceed budget; squeeze the over-budget
    // remainder out of the LARGER tiles (the ones above minArea) so
    // the floor on rare birds stays intact.
    var sumA = tiles.reduce(function (a, t) { return a + t.area; }, 0);
    if (sumA > budget) {
      var fixedSum = tiles.filter(function (t) { return t.area <= minArea + 1e-9; })
        .reduce(function (a, t) { return a + t.area; }, 0);
      var flexSum  = sumA - fixedSum;
      var flexBudget = Math.max(0, budget - fixedSum);
      var shrink = flexSum > 0 ? Math.min(1, flexBudget / flexSum) : 1;
      tiles.forEach(function (t) {
        if (t.area > minArea + 1e-9) t.area *= shrink;
      });
    }
    // Step 3: derive width/height from area + per-species aspect.
    tiles.forEach(function (t) {
      t.fullW = Math.sqrt(t.area * t.ar);
      t.fullH = t.fullW / t.ar;
    });

    var placed = maskPack(tiles, W, H, T.ellipseAspectBias);

    // Scale-to-fit: iterate shrink + repack until every tile lands on
    // screen. The old single-pass version dropped birds when one pass
    // wasn't enough (narrow viewports + many species). Capped at 10
    // iterations - by then the linear scale is ~0.5 of original, more
    // than enough headroom for any viewport.
    function clusterBounds(arr) {
      var L = Infinity, R = -Infinity, T2 = Infinity, B = -Infinity;
      arr.forEach(function (t) {
        if (t.x < -1000) return;
        if (t.x < L) L = t.x;
        if (t.x + t.fullW > R) R = t.x + t.fullW;
        if (t.y < T2) T2 = t.y;
        if (t.y + t.fullH > B) B = t.y + t.fullH;
      });
      return { L: L, R: R, T: T2, B: B };
    }
    var b = clusterBounds(placed);
    for (var iter = 0; iter < 10; iter++) {
      var missing  = placed.some(function (t) { return t.x < -1000; });
      var overflow = b.L < 0 || b.T < 0 || b.R > W || b.B > H;
      if (!missing && !overflow) break;
      // Base 0.93 linear shrink (≈ 0.86 area). If overflow, take the
      // tighter of cluster-to-viewport ratios so we converge fast.
      var scale = 0.93;
      if (overflow) {
        var clW = b.R - b.L, clH = b.B - b.T;
        var sx = (W * 0.96) / Math.max(clW, W * 0.96);
        var sy = (H * 0.94) / Math.max(clH, H * 0.94);
        scale = Math.min(scale, sx, sy);
      }
      tiles.forEach(function (t) { t.fullW *= scale; t.fullH *= scale; });
      placed = maskPack(tiles, W, H, T.ellipseAspectBias);
      b = clusterBounds(placed);
    }

    // Re-centre the cluster in the viewport so a small cluster doesn't
    // drift to one side from the spiral's center-of-mass bias.
    var dx = W / 2 - (b.L + b.R) / 2;
    var dy = H / 2 - (b.T + b.B) / 2;
    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      placed.forEach(function (t) { if (t.x > -1000) { t.x += dx; t.y += dy; } });
    }

    placed.forEach(function (r) {
      var s = r.data;
      // com flows through so the worker's JIT Gemini job uses the right
      // common name in its prompt for a freshly-detected species.
      // &v=IMG_VERSION busts CF edge cache when we re-render any species.
      var comEn = speciesNameEn(s);
      var name = speciesName(s);
      var img = './avian/api/cutout.php?sci=' + encodeURIComponent(s.sci) +
        (comEn ? '&com=' + encodeURIComponent(comEn) : '') +
        '&pose=2' + cutoutCacheQuery();
      var btn = document.createElement('button');
      btn.className = 'gtile';
      btn.type = 'button';
      btn.setAttribute('data-sci', s.sci);
      btn.setAttribute('aria-label', name);
      // Fallback for keyboard / screen-reader users - the visible hover
      // pill below is the primary affordance for sighted mouse users.
      // "calls" (not "heard") because one bird can rack up dozens of
      // detections in a session; "heard" implies distinct individuals.
      var titleN = +s.n || 0;
      btn.title = name + ' · ' + fmtN(titleN) + ' ' +
        (titleN === 1 ? tr('callsOne') : tr('callsMany')) + ' ' + windowLabel(currentHours);
      btn.style.left   = r.x + 'px';
      btn.style.top    = r.y + 'px';
      btn.style.width  = r.fullW + 'px';
      btn.style.height = r.fullH + 'px';
      btn.innerHTML = '<img loading="lazy" decoding="async" src="' + esc(img) + '" alt="' + esc(name) + '">';
      r.el = btn;
      collage.appendChild(btn);
    });
    // Hover pill - created once per render so collage.innerHTML='' at
    // the top of this function doesn't strand a stale node. mousemove
    // populates its text from hit.data so the count is whatever the
    // current window's data says.
    var tip = document.createElement('div');
    tip.id = 'collageTip';
    tip.className = 'collage-tip';
    tip.setAttribute('aria-hidden', 'true');
    collage.appendChild(tip);
    // Stash the placed tiles so the alpha-mask hit-tester (below) can
    // resolve which silhouette the cursor is actually over.
    collagePlaced = placed.filter(function (t) { return t.x > -1000; });
  }

  // ---- Alpha-mask hover/click hit-testing ----
  // The .gtile buttons are rectangles and their bounding boxes overlap
  // (tight nesting). A plain :hover would light up whichever rectangle
  // is on top - often not the bird under the cursor. So we hit-test
  // the cursor against each tile's binary alpha mask and only the
  // genuinely-hit silhouette gets .is-hover / receives the click.
  var collagePlaced = [];
  var collageHovered = null;
  function maskHitTest(clientX, clientY) {
    var box = collage.getBoundingClientRect();
    var px = clientX - box.left, py = clientY - box.top;
    // Iterate topmost-first (later in DOM = painted on top).
    for (var i = collagePlaced.length - 1; i >= 0; i--) {
      var t = collagePlaced[i];
      if (px < t.x || py < t.y || px > t.x + t.fullW || py > t.y + t.fullH) continue;
      var mx = ((px - t.x) / t.fullW * t.mask.w) | 0;
      var my = ((py - t.y) / t.fullH * t.mask.h) | 0;
      // Build a fast lookup set once per mask.
      if (!t.mask._set) {
        var set = {};
        var cells = t.mask.cells;
        for (var c = 0; c < cells.length; c++) set[cells[c][0] + '|' + cells[c][1]] = 1;
        t.mask._set = set;
      }
      if (t.mask._set[mx + '|' + my]) return t;
    }
    return null;
  }
  collage.addEventListener('mousemove', function (ev) {
    var hit = maskHitTest(ev.clientX, ev.clientY);
    if (hit === collageHovered) return;
    if (collageHovered && collageHovered.el) collageHovered.el.classList.remove('is-hover');
    collageHovered = hit;
    if (hit && hit.el) hit.el.classList.add('is-hover');
    collage.style.cursor = hit ? 'pointer' : 'default';
    var tip = document.getElementById('collageTip');
    if (tip) {
      if (hit) {
        var s = hit.data;
        var n = +s.n || 0;
        var noun = (n === 1) ? tr('callsOne') : tr('callsMany');
        tip.innerHTML = '<span class="ct-name">' + esc(speciesName(s)) + '</span>'
          + '<span class="ct-w"> - </span>'
          + '<span class="ct-n">' + fmtN(n) + '</span>'
          + '<span class="ct-w"> ' + noun + ' ' + windowLabel(currentHours) + '</span>';
        tip.setAttribute('aria-hidden', 'false');
      } else {
        tip.setAttribute('aria-hidden', 'true');
      }
    }
  });
  collage.addEventListener('mouseleave', function () {
    if (collageHovered && collageHovered.el) collageHovered.el.classList.remove('is-hover');
    collageHovered = null;
    var tip = document.getElementById('collageTip');
    if (tip) tip.setAttribute('aria-hidden', 'true');
  });
  collage.addEventListener('click', function (ev) {
    var hit = maskHitTest(ev.clientX, ev.clientY);
    if (!hit) return;
    location.hash = '#sci=' + encodeURIComponent(hit.data.sci);
    go(2);
  });

  // Debug hook - call __layout({ slugs, weights, n }) from devtools to
  // re-render the collage with a custom item set. Lets us prove the
  // nester handles 6/12/24/48 birds and varied size hierarchies without
  // touching the source.
  window.__layout = function (opts) {
    opts = opts || {};
    var allSlugs = Object.keys({"acanthis-flammea":[560,372],"accipiter-cooperii":[558,560],"accipiter-gentilis":[558,560],"accipiter-striatus":[375,560],"actitis-macularius":[560,409],"aechmophorus-occidentalis":[525,560],"aegolius-acadicus":[560,558],"aeronautes-saxatalis":[560,439],"agelaius-phoeniceus":[276,560],"aix-sponsa":[560,378],"ammodramus-savannarum":[560,436],"amphispiza-bilineata":[560,559],"anas-crecca":[560,288],"anas-platyrhynchos":[558,560],"anser-albifrons":[560,439],"anthus-rubescens":[375,560],"aphelocoma-californica":[560,373],"aphelocoma-woodhouseii":[468,560],"aquila-chrysaetos":[437,560],"archilochus-alexandri":[560,344],"ardea-alba":[560,465],"ardea-herodias":[560,373],"artemisiospiza-belli":[560,435],"asio-flammeus":[560,560],"asio-otus":[404,560],"athene-cunicularia":[560,373],"aythya-affinis":[560,372],"aythya-americana":[560,553],"aythya-collaris":[560,373],"aythya-valisineria":[560,373],"baeolophus-inornatus":[560,311],"bombycilla-cedrorum":[339,560],"bombycilla-garrulus":[560,559],"branta-canadensis":[560,559],"bubo-virginianus":[373,560],"bubulcus-ibis":[267,560],"bucephala-albeola":[560,408],"bucephala-clangula":[560,242],"buteo-jamaicensis":[560,374],"buteo-lagopus":[560,244],"buteo-lineatus":[463,560],"buteo-regalis":[408,560],"buteo-swainsoni":[560,408],"butorides-virescens":[555,560],"calamospiza-melanocorys":[560,374],"calidris-alba":[560,371],"calidris-alpina":[560,374],"callipepla-californica":[560,372],"calothorax-lucifer":[465,560],"calypte-anna":[560,344],"calypte-costae":[560,409],"cardellina-pusilla":[560,281],"cardellina-rubrifrons":[527,560],"cathartes-aura":[376,560],"catharus-guttatus":[560,333],"catharus-ustulatus":[560,408],"catherpes-mexicanus":[320,560],"certhia-americana":[201,560],"chaetura-vauxi":[560,374],"charadrius-vociferus":[560,408],"chondestes-grammacus":[560,559],"chordeiles-minor":[560,319],"cinclus-mexicanus":[560,465],"circus-hudsonius":[372,560],"cistothorus-palustris":[437,560],"coccothraustes-vespertinus":[560,466],"colaptes-auratus":[560,560],"columba-livia":[560,327],"columbina-passerina":[560,559],"contopus-sordidulus":[560,502],"coragyps-atratus":[560,557],"corvus-brachyrhynchos":[560,503],"corvus-corax":[343,560],"cyanocitta-stelleri":[363,560],"cygnus-buccinator":[560,370],"cypseloides-niger":[560,356],"dryobates-nuttallii":[560,321],"dryobates-pubescens":[560,558],"dryobates-villosus":[268,560],"dryocopus-pileatus":[492,560],"egretta-caerulea":[560,321],"egretta-thula":[560,374],"elanus-leucurus":[560,378],"empidonax-difficilis":[268,560],"empidonax-hammondii":[558,560],"empidonax-oberholseri":[495,560],"empidonax-traillii":[371,560],"empidonax-wrightii":[560,527],"eremophila-alpestris":[560,529],"euphagus-cyanocephalus":[560,371],"falco-columbarius":[560,408],"falco-mexicanus":[349,560],"falco-peregrinus":[465,560],"falco-sparverius":[560,370],"gavia-immer":[560,374],"geothlypis-tolmiei":[560,406],"geothlypis-trichas":[560,316],"glaucidium-gnoma":[560,560],"gymnogyps-californianus":[466,560],"haemorhous-mexicanus":[523,560],"haemorhous-purpureus":[560,387],"haliaeetus-leucocephalus":[560,434],"himantopus-mexicanus":[458,560],"hirundo-rustica":[560,410],"hydroprogne-caspia":[560,373],"icteria-virens":[560,293],"icterus-bullockii":[560,214],"icterus-cucullatus":[391,560],"icterus-galbula":[560,528],"icterus-parisorum":[560,266],"ixoreus-naevius":[560,558],"junco-hyemalis":[560,320],"lanius-ludovicianus":[408,560],"larus-californicus":[560,437],"larus-delawarensis":[560,376],"larus-glaucescens":[560,374],"larus-heermanni":[560,436],"larus-occidentalis":[560,412],"leiothlypis-celata":[522,560],"leiothlypis-lucidae":[351,560],"leucophaeus-atricilla":[560,373],"leucophaeus-pipixcan":[560,560],"leucosticte-tephrocotis":[560,465],"limosa-fedoa":[560,556],"lophodytes-cucullatus":[560,409],"loxia-curvirostra":[560,319],"mareca-americana":[560,375],"mareca-strepera":[560,372],"megaceryle-alcyon":[560,409],"megascops-kennicottii":[560,374],"melanerpes-formicivorus":[351,560],"melanerpes-lewis":[372,560],"meleagris-gallopavo":[560,373],"melospiza-georgiana":[320,560],"melospiza-lincolnii":[560,245],"melospiza-melodia":[560,352],"melozone-aberti":[560,268],"melozone-crissalis":[560,538],"melozone-fusca":[560,495],"mergus-merganser":[560,374],"mimus-polyglottos":[560,310],"mniotilta-varia":[560,351],"molothrus-ater":[560,505],"myadestes-townsendi":[560,436],"myiarchus-cinerascens":[560,532],"nucifraga-columbiana":[560,373],"numenius-americanus":[558,560],"nycticorax-nycticorax":[560,465],"oreothlypis-ruficapilla":[372,560],"pandion-haliaetus":[560,371],"passer-domesticus":[560,444],"passerculus-sandwichensis":[560,542],"passerella-iliaca":[560,350],"passerina-amoena":[560,465],"passerina-cyanea":[560,560],"patagioenas-fasciata":[560,500],"pelecanus-erythrorhynchos":[560,316],"pelecanus-occidentalis":[560,406],"perisoreus-canadensis":[560,349],"petrochelidon-pyrrhonota":[558,560],"phainopepla-nitens":[560,464],"phalacrocorax-auritus":[490,560],"phalaenoptilus-nuttallii":[560,373],"phasianus-colchicus":[560,409],"pheucticus-melanocephalus":[559,560],"pica-nuttalli":[560,320],"picoides-arcticus":[374,560],"pinicola-enucleator":[560,372],"pipilo-chlorurus":[560,318],"pipilo-erythrophthalmus":[352,560],"pipilo-maculatus":[443,560],"piranga-ludoviciana":[293,560],"piranga-rubra":[560,495],"plegadis-chihi":[560,372],"podiceps-nigricollis":[560,374],"podilymbus-podiceps":[560,374],"poecile-gambeli":[560,350],"poecile-rufescens":[560,339],"polioptila-caerulea":[560,557],"pooecetes-gramineus":[560,436],"progne-subis":[313,560],"psaltriparus-minimus":[560,428],"quiscalus-mexicanus":[560,269],"recurvirostra-americana":[268,560],"regulus-calendula":[496,560],"regulus-satrapa":[464,560],"riparia-riparia":[560,494],"rynchops-niger":[560,374],"salpinctes-obsoletus":[560,465],"sayornis-nigricans":[308,560],"sayornis-saya":[463,560],"selasphorus-platycercus":[560,497],"selasphorus-rufus":[560,436],"selasphorus-sasin":[434,560],"setophaga-coronata":[461,560],"setophaga-magnolia":[560,268],"setophaga-nigrescens":[560,350],"setophaga-occidentalis":[560,367],"setophaga-palmarum":[438,560],"setophaga-petechia":[560,268],"setophaga-ruticilla":[560,293],"setophaga-townsendi":[560,416],"sialia-currucoides":[558,560],"sialia-mexicana":[560,371],"sitta-canadensis":[560,379],"sitta-carolinensis":[436,560],"sitta-pygmaea":[560,407],"spatula-clypeata":[560,408],"spatula-discors":[560,493],"sphyrapicus-ruber":[560,558],"sphyrapicus-thyroideus":[374,560],"spinus-lawrencei":[560,373],"spinus-pinus":[560,516],"spinus-psaltria":[560,548],"spinus-tristis":[536,560],"spizella-atrogularis":[246,560],"spizella-breweri":[560,557],"spizella-passerina":[560,320],"spizelloides-arborea":[560,436],"stelgidopteryx-serripennis":[558,560],"sterna-forsteri":[560,373],"sterna-hirundo":[560,411],"streptopelia-decaocto":[560,393],"strix-occidentalis":[560,553],"sturnella-neglecta":[320,560],"sturnus-vulgaris":[560,545],"tachycineta-bicolor":[375,560],"tachycineta-thalassina":[560,435],"thalasseus-elegans":[560,407],"thryomanes-bewickii":[560,263],"toxostoma-redivivum":[560,298],"tringa-semipalmata":[560,464],"troglodytes-aedon":[560,494],"troglodytes-pacificus":[560,407],"turdus-migratorius":[560,402],"tyrannus-verticalis":[559,560],"tyrannus-vociferans":[495,560],"tyto-alba":[560,464],"urile-penicillatus":[296,560],"vireo-bellii":[560,559],"vireo-cassinii":[560,319],"vireo-gilvus":[464,560],"vireo-huttoni":[410,560],"xanthocephalus-xanthocephalus":[293,560],"zenaida-asiatica":[560,558],"zenaida-macroura":[522,560],"zonotrichia-atricapilla":[560,238],"zonotrichia-leucophrys":[560,313],"zonotrichia-querula":[560,294]});
    var slugs = opts.slugs || allSlugs.slice(0, opts.n || 12);
    var weights = opts.weights;
    var items = slugs.map(function (slug, i) {
      // Recover a sci name from the slug - capitalize first segment.
      var parts = slug.split('-');
      var sci = parts.slice(0, 2).map(function (p, j) { return j === 0 ? p[0].toUpperCase() + p.slice(1) : p; }).join(' ');
      var n;
      if (weights === 'uniform') n = 10;
      else if (weights === 'extreme') n = i === 0 ? 500 : 1;
      else if (Array.isArray(weights)) n = weights[i] || 1;
      else n = Math.pow(0.55, i) * 100; // default hierarchy
      return { sci: sci, com: sci, n: n };
    });
    renderCollage(items);
    return { rendered: items.length, mode: weights || 'hierarchy' };
  };

  // Collage renders whatever is in DATA.recent.species. When the picker
  // changes, refreshRecent() refetches and re-renders. Empty state shows
  // a "no detections in this window" message.
  function renderCollageFromData() {
    var items = (DATA.recent && DATA.recent.species) || [];
    renderCollage(items);
  }
  var rTimer;
  window.addEventListener('resize', function () {
    clearTimeout(rTimer);
    rTimer = setTimeout(function () {
      renderCollageFromData();
      drawHistograms();
    }, 120);
  });

  // ---- Stats / Atlas data ----
  function setRow(id, label, val) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = '<span>' + label + '</span><span>' + (val == null || val === '' ? '-' : val) + '</span>';
  }
  function liRow(yr, label, ct, sci) {
    var attr = sci ? ' data-sci="' + sci.replace(/"/g, '&quot;') + '"' : '';
    return '<li' + attr + '><span class="yr">' + esc(yr) + '</span><span>' + esc(label) + '</span><span class="ct">' + esc(ct == null ? '-' : ct) + '</span></li>';
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function fmtN(n) {
    if (n == null) return '-';
    if (n >= 10000) return (n / 1000).toFixed(1) + 'k';
    return n.toLocaleString(currentLang === 'zh-CN' ? 'zh-CN' : undefined);
  }
  // Human label for the current time-window picker selection - replaces
  // a bare "window" with the span it actually covers. Thresholds match
  // the winPick buttons (1H / 12H / 24H / 7D / ALL).
  function windowLabel(h) {
    if (h <= 1) return tr('thisHour');
    if (h <= 12) return tr('past12h');
    if (h <= 24) return tr('today');
    if (h <= 168) return tr('thisWeek');
    return tr('allTime');
  }

  // ---- Live Pi data layer ----
  // All views read from this DATA object. Populated by fetchAll() on page
  // load and by refreshRecent() when the window picker changes.
  var STATS_DAYS = 30;
  var DATA = {
    stats: null,        // ./avian/api/birdnet-api.php?action=stats (totals/today/week/last_hour/started)
    lifelist: null,     // ./avian/api/birdnet-api.php?action=lifelist (every species ever detected)
    timeseries: null,   // ./avian/api/birdnet-api.php?action=timeseries (daily + hourly aggregates)
    firstseen: null,    // ./avian/api/birdnet-api.php?action=firstseen (newest lifelist additions)
    recent: null,       // ./avian/api/birdnet-api.php?action=recent&hours=N (refetched on picker change)
  };

  // Derived chart arrays, backfilled so 30 buckets always exist.
  var STATS = {
    detPerDay:  new Array(STATS_DAYS).fill(0), // [day] total detections
    specPerDay: new Array(STATS_DAYS).fill(0), // [day] unique species
    byHour:     new Array(24).fill(0),         // [hour-of-day] detections
  };

  // Map sci -> all-time detection count, populated from lifelist for atlas.
  var speciesTotals = {};

  function fetchJson(url) {
    return fetch(url, { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); });
  }

  function backfillDaily(daily, days) {
    // Build a continuous array of (days) length, ending today.
    var byDate = {};
    (daily || []).forEach(function (row) { byDate[row.date] = row; });
    var out = new Array(days).fill(null).map(function () { return { detections: 0, species: 0 }; });
    var today = new Date();
    for (var i = 0; i < days; i++) {
      var d = new Date(today);
      d.setDate(today.getDate() - (days - 1 - i));
      var key = d.toISOString().slice(0, 10);
      if (byDate[key]) {
        out[i].detections = +byDate[key].detections || 0;
        out[i].species    = +byDate[key].species    || 0;
      }
    }
    return out;
  }

  function recomputeDerived() {
    var ts = DATA.timeseries || { daily: [], by_hour: [] };
    var ll = DATA.lifelist || { species: [] };
    var rows = backfillDaily(ts.daily, STATS_DAYS);
    STATS.detPerDay  = rows.map(function (r) { return r.detections; });
    STATS.specPerDay = rows.map(function (r) { return r.species; });
    var byHour = new Array(24).fill(0);
    (ts.by_hour || []).forEach(function (r) { byHour[+r.hour] = +r.detections; });
    STATS.byHour = byHour;
    speciesTotals = {};
    (ll.species || []).forEach(function (s) { speciesTotals[s.sci] = +s.total; });
  }

  // ---- Chart palette ----
  // Monochromatic ink, matching the title text (--ink). Bars positioned
  // toward the "recent" end of the gradient render in deeper ink; older
  // bars fade to a warm light grey. Same hue family throughout.
  function barColor(t) {
    // t = 0 (outer / newest) -> 1 (inner / oldest).
    // Monochromatic ink palette: same warm hue as the title text
    // (--ink: #1a1612 ≈ HSL 25, 14%, 9%). Newest hours render in deep
    // ink so the outer perimeter reads bold; older hours fade to a
    // warm light grey, the chart looks like a hand-pulled engraving.
    var hue = 25;                    // warm-grey hue, matches --ink family
    var sat = 12 - t * 8;             // 12% -> 4%
    var light = 14 + t * 50;          // 14% (near-black) -> 64% (light grey)
    return 'hsl(' + hue + ', ' + sat.toFixed(0) + '%, ' + light.toFixed(0) + '%)';
  }

  // Editorial detection timeline. One column per species; the black
  // square's height up the column encodes detection count (y axis),
  // columns run left->right oldest->newest detection (x axis). A
  // rotated species label sits just above each square. Y-axis count
  // ticks on the left, X-axis time labels on the bottom. Always fits
  // the viewport - column widths flex, square size steps down as the
  // species count climbs.
  function drawHistograms() {
    var tl = document.getElementById('statsTimeline');
    if (!tl) return;
    var all = ((DATA.recent && DATA.recent.species) || []).slice();

    // X-axis = the FULL selected time window, so quiet stretches show
    // as actual empty space. windowStart/now span everything; species
    // squares get placed within by their last_seen timestamp.
    var now = Date.now();
    var isAllWindow = currentHours >= 1000000;
    var windowStart;
    if (isAllWindow) {
      // ALL = since the earliest known first_seen. Fall back to 'now'
      // if the firstseen list hasn't loaded yet, which collapses to an
      // empty span - the empty-state branch below catches that.
      var oldest = now;
      var first = (DATA.firstseen && DATA.firstseen.species) || [];
      first.forEach(function (s) {
        var t = Date.parse((s.first_seen || '').replace(' ', 'T'));
        if (!isNaN(t) && t < oldest) oldest = t;
      });
      ((DATA.lifelist && DATA.lifelist.species) || []).forEach(function (s) {
        var t = Date.parse((s.first_seen || '').replace(' ', 'T'));
        if (!isNaN(t) && t < oldest) oldest = t;
      });
      windowStart = oldest;
    } else {
      windowStart = now - currentHours * 3600000;
    }
    var windowSpan = Math.max(1, now - windowStart);

    if (!all.length) {
      tl.innerHTML = '<div class="stats-tl-empty">' + esc(tr('noDetectionsWindow')) + '</div>';
      return;
    }

    // Cap species count so labels don't pile up. Same rule as before -
    // ~28 px per visible mark - but applied to the count of marks, not
    // the column layout (which is now time-positioned).
    var plotW = Math.max(140, (tl.clientWidth || window.innerWidth || 800) - 40);
    var cap = Math.max(4, Math.floor(plotW / 28));
    var trimmed = all.length > cap;
    var species = all.slice();
    if (trimmed) {
      species.sort(function (a, b) { return (+b.n || 0) - (+a.n || 0); });
      species = species.slice(0, cap);
    }

    var maxN = species.reduce(function (m, s) { return Math.max(m, +s.n || 0); }, 1);
    var C = species.length;
    var tier = C <= 5 ? 24 : C <= 12 ? 18 : C <= 24 ? 13 : 9;
    var sq = Math.max(7, Math.min(tier, Math.round((plotW / C) * 0.62)));
    var LABEL_GAP = 7;
    var SPAN = 0.52; // bottom slice of plot for squares; rest is label headroom.

    // Y-axis: 0..maxN with maxN pinned on the top tick. Same as before.
    var ticks = [];
    if (maxN <= 8) {
      for (var v = 0; v <= maxN; v++) ticks.push(v);
    } else {
      var divs = 4;
      for (var i = 0; i <= divs; i++) ticks.push(Math.round(maxN * i / divs));
      ticks[ticks.length - 1] = maxN;
    }
    var yaxis = ticks.map(function (v) {
      var pct = (v / maxN) * SPAN * 100;
      return '<span class="stats-tl-ytick" style="bottom:' + pct.toFixed(1) + '%">' + v + '</span>';
    }).join('');

    // Marks - each species placed by its last_seen time on the x-axis.
    function parseTs(s) {
      if (!s) return NaN;
      return Date.parse(s.replace(' ', 'T'));
    }
    var cols = species.map(function (s) {
      var ts = parseTs(s.last_seen);
      var leftPct;
      if (isNaN(ts)) {
        leftPct = 50;
      } else {
        var clamped = Math.max(windowStart, Math.min(now, ts));
        leftPct = ((clamped - windowStart) / windowSpan) * 100;
      }
      var n = +s.n || 0;
      var bottomPct = (n / maxN) * SPAN * 100;
      return ''
        + '<div class="stats-tl-col" data-sci="' + esc(s.sci) + '" style="left:' + leftPct.toFixed(2) + '%">'
        +   '<div class="stats-tl-square" style="bottom:' + bottomPct.toFixed(1) + '%;width:' + sq + 'px;height:' + sq + 'px"></div>'
        +   '<div class="stats-tl-label" style="bottom:calc(' + bottomPct.toFixed(1) + '% + ' + (sq + LABEL_GAP) + 'px)">'
        +     '<span class="com">' + esc(speciesName(s)) + '</span>'
        +     '<span class="sci">' + esc(s.sci) + '</span>'
        +   '</div>'
        + '</div>';
    }).join('');

    // X-axis ticks + gridlines at regular boundaries that span the
    // window - every 15 min for 1H, every 4-6 h for 24H, every day for
    // 7D, etc. Both are children of the plot so left:% aligns.
    function pickStepMs(span) {
      var h = span / 3600000;
      if (h <= 1.2) return 15 * 60000;
      if (h <= 6) return 60 * 60000;
      if (h <= 14) return 2 * 3600000;
      if (h <= 36) return 6 * 3600000;
      if (h <= 9 * 24) return 24 * 3600000;
      if (h <= 75 * 24) return 7 * 24 * 3600000;
      return 30 * 24 * 3600000;
    }
    function fmtTick(ms, span) {
      var d = new Date(ms);
      var p2 = function (n) { return n < 10 ? '0' + n : '' + n; };
      if (span <= 36 * 3600000) return p2(d.getHours()) + ':' + p2(d.getMinutes());
      if (span <= 75 * 86400000) return (d.getMonth() + 1) + '/' + d.getDate();
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }
    var stepMs = pickStepMs(windowSpan);
    var firstTick = Math.ceil(windowStart / stepMs) * stepMs;
    var xaxis = '', gridlines = '';
    for (var t = firstTick; t <= now; t += stepMs) {
      var pct = ((t - windowStart) / windowSpan) * 100;
      xaxis += '<span class="stats-tl-xtick" style="left:' + pct.toFixed(2) + '%">' + fmtTick(t, windowSpan) + '</span>';
      gridlines += '<i class="stats-tl-gridline" style="left:' + pct.toFixed(2) + '%"></i>';
    }

    var note = trimmed
      ? '<div class="stats-tl-cap">' + esc(currentLang === 'zh-CN'
          ? (C + ' / ' + all.length + ' 高频物种')
          : (C + ' most-heard of ' + all.length)) + '</div>'
      : '';
    tl.innerHTML =
      '<div class="stats-tl-yaxis">' + yaxis + '</div>'
      + '<div class="stats-tl-plot">' + gridlines + cols + xaxis + '</div>'
      + note;
  }

  // Cross-highlight between the timeline squares and the right-side
  // species lists. Delegated off the stats view so it survives the
  // periodic re-render of both halves.
  (function wireStatsHighlight() {
    var v1 = document.getElementById('v1');
    if (!v1) return;
    function setHi(sci, on) {
      if (!sci) return;
      var esc = sci.replace(/"/g, '\"');
      v1.querySelectorAll('.stats-tl-col[data-sci="' + esc + '"], .stats-side li[data-sci="' + esc + '"]')
        .forEach(function (el) { el.classList.toggle('sync-hi', on); });
    }
    v1.addEventListener('mouseover', function (ev) {
      var el = ev.target.closest && ev.target.closest('[data-sci]');
      if (el) setHi(el.getAttribute('data-sci'), true);
    });
    v1.addEventListener('mouseout', function (ev) {
      var el = ev.target.closest && ev.target.closest('[data-sci]');
      if (el) {
        // Only clear if we're actually leaving the element (not moving
        // to a child).
        var to = ev.relatedTarget;
        if (to && el.contains(to)) return;
        setHi(el.getAttribute('data-sci'), false);
      }
    });
  })();

  // ---- Side text lists (real Pi data) ----
  function renderStatsLists() {
    var stats = DATA.stats || {};
    var recent = DATA.recent || { species: [] };
    var firstseen = DATA.firstseen || { species: [] };

    // By Period - pulled directly from ./avian/api/birdnet-api.php?action=stats so the numbers
    // are authoritative (BirdNET-Pi's own counts).
    var last_hour = (stats.last_hour && stats.last_hour.detections) || 0;
    var today_det = (stats.today && stats.today.detections) || 0;
    var week_det = (stats.week && stats.week.detections) || 0;
    var all_det = (stats.totals && stats.totals.detections) || 0;
    document.getElementById('statsByPeriod').innerHTML =
        liRow(tr('nowTag'),   tr('lastHour'),  fmtN(last_hour))
      + liRow(tr('todayTag'), tr('today'),     fmtN(today_det))
      + liRow(tr('weekTag'),  tr('last7Days'), fmtN(week_det))
      + liRow(tr('allTag'),   tr('allTime'),   fmtN(all_det));

    // Top Species - top 5 species in the current window. ./avian/api/birdnet-api.php?action=recent
    // already returns species sorted by last_seen DESC; re-sort by count.
    var ranked = (recent.species || [])
      .slice()
      .sort(function (a, b) { return (+b.n) - (+a.n); })
      .slice(0, 5);
    document.getElementById('statsTopSpec').innerHTML = ranked.length
      ? ranked.map(function (s, i) { return liRow(pad(i + 1), speciesName(s), fmtN(+s.n), s.sci); }).join('')
      : liRow('-', tr('noDetectionsWindow'), '');
    document.getElementById('statsTopSpecCap').textContent =
      tr('topSpeciesHintPrefix') + windowLabel(currentHours);

    // First Detections - newest additions to the life list, with a
    // "Xd ago" label computed from first_seen.
    var fs = (firstseen.species || []).slice(0, 5);
    var now = Date.now();
    document.getElementById('statsFirstSeen').innerHTML = fs.length
      ? fs.map(function (s) {
          var t = Date.parse((s.first_seen || '').replace(' ', 'T'));
          var label = '-';
          if (!isNaN(t)) {
            var daysAgo = Math.floor((now - t) / 86400000);
            label = daysAgo === 0 ? tr('todayAgo') : daysAgo + tr('daysAgo');
          }
          return liRow(label, speciesName(s), '', s.sci);
        }).join('')
      : liRow('-', tr('noDetectionsYet'), '');
  }

  // ---- Atlas: field-guide card grid ----
  // eBird species codes for placeholder birds. eBird's URL scheme is
  // https://ebird.org/species/<code>/, where <code> is a stable 6-char
  // taxonomy code. Hardcoded here for the local-California demo set;
  // a real implementation can look these up via the eBird taxon API.
  var EBIRD_CODES = {
    'Calypte anna':           'annhum',
    'Passer domesticus':      'houspa',
    'Haemorhous mexicanus':   'houfin',
    'Turdus migratorius':     'amerob',
    'Zenaida macroura':       'moudov',
    'Spinus psaltria':        'lesgol',
    'Zonotrichia leucophrys': 'whcspa',
    'Aphelocoma californica': 'cascj1',
    'Mimus polyglottos':      'normoc',
    'Sayornis nigricans':     'blkpho',
    'Larus occidentalis':     'wegull',
    'Corvus brachyrhynchos':  'amecro'
  };

  function wikiUrl(sci) {
    return 'https://en.wikipedia.org/wiki/' + encodeURIComponent(sci.replace(/ /g, '_'));
  }
  function ebirdUrl(sci) {
    var code = EBIRD_CODES[sci];
    return code ? 'https://ebird.org/species/' + code : 'https://ebird.org/explore';
  }

  // Tiny inline icons - monochrome, ink-only, match the page palette.
  var ICON_PLAY = '<svg viewBox="0 0 12 12" fill="currentColor"><path d="M3 2 L10 6 L3 10 Z"/></svg>';
  var ICON_PAUSE = '<svg viewBox="0 0 12 12" fill="currentColor"><rect x="3" y="2" width="2.5" height="8"/><rect x="6.5" y="2" width="2.5" height="8"/></svg>';

  function renderAtlas() {
    var grid = document.getElementById('atlasGrid');
    if (!grid) return;

    var lifelist = (DATA.lifelist && DATA.lifelist.species) || [];
    var recent = (DATA.recent && DATA.recent.species) || [];
    // Window count lookup: sci -> count in current window.
    var winBySci = {};
    recent.forEach(function (s) { winBySci[s.sci] = +s.n; });

    if (!lifelist.length) {
      grid.innerHTML = '<div class="atlas-empty">' +
        '<p>' + esc(tr('noBirdsDetected')) + '</p>' +
        '<p class="hint">' + esc(tr('atlasHint')) + '</p>' +
        '</div>';
      return;
    }

    // Time-window filter: when a windowed view is selected, only show
    // species heard in that window. ALL preserves the full lifelist.
    var isAllWindow = currentHours >= 1000000;
    var filtered = isAllWindow
      ? lifelist
      : lifelist.filter(function (s) { return (winBySci[s.sci] || 0) > 0; });
    if (!filtered.length) {
      grid.innerHTML = '<div class="atlas-empty">' +
        '<p>' + esc(tr('noDetectionsWindowSentence')) + '</p>' +
        '<p class="hint">' + esc(tr('atlasLongerHint')) + '</p>' +
        '</div>';
      return;
    }

    // Sort by the atlas-sort segmented control (defaults to "count" =
    // most-heard all time).
    var sortMode = (window.__atlasSort) || 'count';
    var species = filtered.slice();
    if (sortMode === 'count') {
      species.sort(function (a, b) { return (+b.total) - (+a.total); });
    } else if (sortMode === 'recent') {
      species.sort(function (a, b) {
        return (b.last_seen || '').localeCompare(a.last_seen || '');
      });
    } else if (sortMode === 'alpha') {
      species.sort(function (a, b) {
        return speciesName(a).localeCompare(speciesName(b), currentLang === 'zh-CN' ? 'zh-CN' : undefined);
      });
    }

    grid.innerHTML = species.map(function (s) {
      var total = +s.total || 0;
      var win = winBySci[s.sci] || 0;
      var comEn = speciesNameEn(s);
      var name = speciesName(s);
      var sketchSrc = './avian/api/cutout.php?sci=' + encodeURIComponent(s.sci) +
        (comEn ? '&com=' + encodeURIComponent(comEn) : '') +
        cutoutCacheQuery();
      var audioSrc = './avian/api/recording.php?sci=' + encodeURIComponent(s.sci);
      var spectroSrc = './avian/api/spectrogram.php?sci=' + encodeURIComponent(s.sci);
      // The "all time" window makes the windowed count identical to the
      // all-time count - collapse to a single stat rather than print the
      // same number twice. Otherwise label the count with its span.
      var statRows = currentHours >= 1000000
        ? '<div><span class="n">' + fmtN(total) + '</span><span class="lbl-inline">' + esc(tr('allTimeShort')) + '</span></div>'
        : '<div><span class="n">' + fmtN(win) + '</span><span class="lbl-inline">' + esc(windowLabel(currentHours)) + '</span></div>'
          + '<div><span class="n">' + fmtN(total) + '</span><span class="lbl-inline">' + esc(tr('allTimeShort')) + '</span></div>';
      return ''
        + '<article class="bird-card" data-sci="' + esc(s.sci) + '" data-audio="' + esc(audioSrc) + '" data-spectro="' + esc(spectroSrc) + '">'
        +   '<div class="stat">' + statRows + '</div>'
        +   '<div class="img-wrap">'
        +     '<img loading="lazy" decoding="async" src="' + esc(sketchSrc) + '" alt="' + esc(name) + '">'
        +   '</div>'
        +   '<div class="spectro-wrap" aria-hidden="true"></div>'
        +   '<h3>' + esc(name) + '</h3>'
        +   '<div class="sci">' + esc(s.sci) + '</div>'
        +   '<div class="actions">'
        +     '<button type="button" class="chip play" data-action="play" aria-label="' + esc(tr('playRecording')) + '">'
        +       ICON_PLAY + '<span>' + esc(tr('play')) + '</span>'
        +     '</button>'
        +     '<a class="chip ext" href="' + esc(wikiUrl(s.sci)) + '" target="_blank" rel="noopener" aria-label="Wikipedia">' + esc(tr('wiki')) + '</a>'
        +     '<a class="chip ext" href="' + esc(ebirdUrl(s.sci)) + '" target="_blank" rel="noopener" aria-label="eBird">' + esc(tr('ebird')) + '</a>'
        +   '</div>'
        + '</article>';
    }).join('');

    // Wire audio playback + spectrogram load.
    // - Only one card plays at a time. Clicking play on a different card
    //   stops the current one first.
    // - The spectrogram is lazily fetched on first play (saves a Pi hit
    //   for every card visible on initial render).
    // - If the recording endpoint 404s (no detection yet for this
    //   species), the button reverts and shows "no audio".
    var currentAudio = null;
    var currentBtn = null;
    function setBtnState(btn, state) {
      btn.setAttribute('data-state', state);
      if (state === 'playing') {
        btn.setAttribute('data-active', 'true');
        btn.innerHTML = ICON_PAUSE + '<span>' + esc(tr('stop')) + '</span>';
      } else if (state === 'loading') {
        btn.setAttribute('data-active', 'true');
        btn.innerHTML = ICON_PLAY + '<span>...</span>';
      } else if (state === 'missing') {
        btn.setAttribute('data-active', 'false');
        btn.innerHTML = ICON_PLAY + '<span>' + esc(tr('noAudio')) + '</span>';
        setTimeout(function () {
          if (btn.getAttribute('data-state') === 'missing') {
            btn.innerHTML = ICON_PLAY + '<span>' + esc(tr('play')) + '</span>';
            btn.setAttribute('data-state', 'idle');
          }
        }, 2200);
      } else {
        btn.setAttribute('data-active', 'false');
        btn.innerHTML = ICON_PLAY + '<span>' + esc(tr('play')) + '</span>';
      }
    }
    function clearProgressOn(card) {
      if (!card) return;
      var sw = card.querySelector('.spectro-wrap');
      if (sw) sw.style.setProperty('--prog', '0%');
      card.removeAttribute('data-playing');
    }
    function stopCurrent() {
      if (currentAudio) {
        try { currentAudio.pause(); } catch (e) {}
        currentAudio = null;
      }
      if (currentBtn) {
        var card = currentBtn.closest('.bird-card');
        clearProgressOn(card);
        setBtnState(currentBtn, 'idle');
        currentBtn = null;
      }
    }
    grid.querySelectorAll('[data-action="play"]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('.bird-card');
        if (btn === currentBtn) { stopCurrent(); return; }
        stopCurrent();
        setBtnState(btn, 'loading');
        currentBtn = btn;
        // Kick off spectrogram load in parallel (it's a separate request).
        var spectroWrap = card.querySelector('.spectro-wrap');
        if (spectroWrap && !spectroWrap.firstChild) {
          var img = document.createElement('img');
          img.loading = 'lazy';
          img.alt = '';
          img.src = card.dataset.spectro;
          img.addEventListener('error', function () { spectroWrap.removeChild(img); });
          spectroWrap.appendChild(img);
        }
        // Start audio.
        var audio = new Audio(card.dataset.audio);
        audio.addEventListener('canplay', function () {
          if (currentBtn !== btn) return; // user clicked away
          setBtnState(btn, 'playing');
          card.setAttribute('data-playing', 'true');
          audio.play();
        });
        // Progress bar on the spectrogram strip.
        audio.addEventListener('timeupdate', function () {
          if (currentBtn !== btn) return;
          var pct = audio.duration ? (audio.currentTime / audio.duration * 100) : 0;
          if (spectroWrap) spectroWrap.style.setProperty('--prog', pct.toFixed(1) + '%');
        });
        audio.addEventListener('ended', function () {
          if (currentBtn === btn) stopCurrent();
        });
        audio.addEventListener('error', function () {
          if (currentBtn === btn) {
            setBtnState(btn, 'missing');
            clearProgressOn(card);
            currentAudio = null; currentBtn = null;
          }
        });
        currentAudio = audio;
        audio.load();
      });
    });

    // Spectrogram click = scrub to that position (if playing) or restart.
    grid.addEventListener('click', function (ev) {
      var sw = ev.target.closest && ev.target.closest('.spectro-wrap');
      if (!sw || !sw.firstChild) return;
      var card = sw.closest('.bird-card');
      var btn = card.querySelector('[data-action="play"]');
      // If this card is the active one, scrub.
      if (currentBtn === btn && currentAudio && currentAudio.duration) {
        var rect = sw.getBoundingClientRect();
        var pct = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
        currentAudio.currentTime = pct * currentAudio.duration;
      } else {
        // Otherwise start playback from the top.
        btn.click();
      }
    });
  }

  function renderWindowDependent() {
    // Things that change with the time-window picker. drawHistograms is
    // here too now that its X-axis spans the selected window (was only
    // re-drawn on full refreshAll before).
    renderCollageFromData();
    drawHistograms();
    renderStatsLists();
    renderAtlas();
  }
  function renderTimeIndependent() {
    // Stats charts + atlas/stats lists that derive from non-window data
    // (totals, lifelist, timeseries).
    drawHistograms();
    renderStatsLists();
    renderAtlas();
  }

  function refreshRecent() {
    // Capture the window this fetch was issued for. If the user
    // changes the picker again before it resolves - or a slower poll
    // lands later - we discard the stale response so the collage
    // never reverts to a different window.
    var forHours = currentHours;
    return fetchJson('./avian/api/birdnet-api.php?action=recent&hours=' + forHours + apiLangParam())
      .then(function (j) {
        if (forHours !== currentHours) return; // window changed mid-flight
        DATA.recent = j; renderWindowDependent();
      })
      .catch(function (e) { console.warn('recent fetch failed', e); });
  }
  function refreshAll() {
    var forHours = currentHours;
    return Promise.all([
      fetchJson('./avian/api/birdnet-api.php?action=stats').catch(function () { return null; }),
      fetchJson('./avian/api/birdnet-api.php?action=lifelist' + apiLangParam()).catch(function () { return null; }),
      fetchJson('./avian/api/birdnet-api.php?action=timeseries&days=30').catch(function () { return null; }),
      fetchJson('./avian/api/birdnet-api.php?action=firstseen&limit=10' + apiLangParam()).catch(function () { return null; }),
      fetchJson('./avian/api/birdnet-api.php?action=recent&hours=' + forHours + apiLangParam()).catch(function () { return null; }),
    ]).then(function (parts) {
      DATA.stats = parts[0];
      DATA.lifelist = parts[1];
      DATA.timeseries = parts[2];
      DATA.firstseen = parts[3];
      // Only accept the recent slice if the window hasn't changed
      // since this poll started - otherwise keep what's there.
      if (forHours === currentHours && parts[4]) DATA.recent = parts[4];
      recomputeDerived();
      renderTimeIndependent();
      renderCollageFromData();
    });
  }

  // Kick off the initial fetch. Renders pull from DATA as soon as it
  // populates; until then the page sits with empty histograms + lists.
  refreshAll();

  // Hook into the window picker so the data refetches on change.
  winBtns.forEach(function (b) {
    b.addEventListener('click', function () { refreshRecent(); });
  });

  // ---- Realtime polling ----
  // Every POLL_MS the page refetches the live data set so the collage,
  // stats, and atlas reflect new detections without a manual reload.
  // We use refreshAll() (cheap: 5 small JSON fetches) so the dependent
  // text/charts update too. Polling pauses when the tab is hidden and
  // resumes (with an immediate fetch) when it becomes visible again.
  var POLL_MS = 30 * 1000;
  var pollTimer = null;
  function startPolling() {
    stopPolling();
    pollTimer = setInterval(function () {
      if (document.hidden) return;
      refreshAll();
    }, POLL_MS);
  }
  function stopPolling() { if (pollTimer) { clearInterval(pollTimer); pollTimer = null; } }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      stopPolling();
    } else {
      // Force an immediate refresh on return so the user sees fresh
      // data right away, then resume normal polling cadence.
      refreshAll();
      startPolling();
    }
  });
  startPolling();

  // ---- Menu dropdown ----
  var dd = document.getElementById('menu-dd');
  var menuBtn = document.getElementById('menuBtn');
  var locked  = document.getElementById('dd-locked');
  var items   = document.getElementById('dd-items');
  var lockHint= document.getElementById('lockHint');
  applyStaticLanguage();
  function openDd()  { dd.classList.add('open'); dd.setAttribute('aria-hidden','false'); setTimeout(function () { document.getElementById('lockPass').focus(); }, 100); }
  function closeDd() { dd.classList.remove('open'); dd.setAttribute('aria-hidden','true'); }
  function toggleDd(){ dd.classList.contains('open') ? closeDd() : openDd(); }
  menuBtn.addEventListener('click', function (e) { e.stopPropagation(); toggleDd(); });
  document.addEventListener('click', function (e) { if (!dd.contains(e.target) && e.target !== menuBtn) closeDd(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDd(); });

  // Probe menu.php with no Authorization header. On a LAN deploy
  // (AV_REQUIRE_AUTH=0) it returns 200 immediately so the drawer
  // renders directly. On a forwarded deploy with Caddy basic_auth in
  // front, Caddy will already have validated credentials before this
  // request reaches PHP - so a 200 here means we're authed, a 401
  // means Caddy rejected and we need the lock-screen flow.
  function tryAutoUnlock() {
    fetch('./avian/api/menu.php', { credentials: 'same-origin' }).then(function (r) {
      if (r.status === 200) {
        return r.json().then(function (j) { renderMenu(j.items || []); });
      }
    }).catch(function () {});
  }
  tryAutoUnlock();

  document.getElementById('unlockForm').addEventListener('submit', function (e) {
    e.preventDefault();
    // BirdNET-Pi's upstream Caddyfile basicauth user is `birdnet`.
    // If your install changed it (custom Caddyfile), set window.AV_AUTH_USER
    // before this script loads - e.g. an inline <script> in index.html.
    var u = (window.AV_AUTH_USER || 'birdnet');
    var p = document.getElementById('lockPass').value;
    var hdr = 'Basic ' + btoa(u + ':' + p);
    // POST to menu.php with the header so the browser caches the basic
    // creds for every subsequent request. If Caddy basic_auth accepts
    // them we get a 200 and the drawer renders; 401 means wrong password.
    fetch('./avian/api/menu.php', {
      method: 'POST',
      headers: { 'Authorization': hdr },
      credentials: 'same-origin',
    }).then(function (r) {
      if (r.status === 200) {
        return r.json().then(function (j) { renderMenu(j.items || []); });
      } else if (r.status === 401) {
        lockHint.textContent = tr('wrongPassword');
        lockHint.classList.add('lock-err');
      } else {
        lockHint.textContent = tr('authUnavailable');
        lockHint.classList.add('lock-err');
      }
    }).catch(function () {
      lockHint.textContent = tr('networkError');
      lockHint.classList.add('lock-err');
    });
  });

  // Render the unlocked drawer:
  //   - inline LIVE AUDIO player (streams icecast through the worker tunnel)
  //   - collapsible SETTINGS section (closed by default to avoid mis-clicks)
  //   - small ADVANCED TOOLS grid for the rest of BirdNET-Pi (still
  //     opens externally; rebuilding all of these in our design is on
  //     the follow-up list)
  function renderMenu(menu) {
    locked.style.display = 'none';
    items.classList.add('show');
    var liveAudioIcon = '<svg viewBox="0 0 12 12" fill="currentColor"><path d="M3 2 L10 6 L3 10 Z"/></svg>';
    var stopIcon = '<svg viewBox="0 0 12 12" fill="currentColor"><rect x="3" y="3" width="6" height="6"/></svg>';
    var specOnIcon = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 9 L4 5 L6 8 L8 3 L10 7"/></svg>';
    // Build the diagnostic shortcuts (system / logs / tools). With
    // native:true they navigate in-page; otherwise they keep the old
    // open-in-new-tab behavior for the legacy BirdNET-Pi screens.
    var linksHtml = menu.map(function (it) {
      var label = (it.label || '');
      var attrs = it.native ? '' : ' target="_blank" rel="noopener"';
      var cls = it.native ? '' : ' class="ext"';
      return '<a' + cls + ' href="' + it.href + '"' + attrs + '><span>' + label + '</span></a>';
    }).join('');
    items.innerHTML =
      '<div class="live-audio" id="liveAudio" data-on="false">'
      + '  <div class="pulse"></div>'
      + '  <div class="label">' + esc(tr('liveAudio')) + '<span class="hint">' + esc(tr('streamFromMic')) + '</span></div>'
      + '  <button type="button" id="liveAudioBtn">'
      +     liveAudioIcon + '<span>' + esc(tr('listen')) + '</span>'
      + '  </button>'
      + '</div>'
      // Spectrogram canvas is always present; it stays a dark inert
      // strip until the stream is on, then the FFT loop paints it in
      // real time. No separate toggle.
      + '<canvas class="live-spectro" id="liveSpectro" width="600" height="120" aria-label="live spectrogram"></canvas>'
      + '<div class="live-status" id="liveStatus"></div>'
      + '<div class="menu-links">' + linksHtml + '</div>';

    // Live audio + realtime spectrogram. The audio element and the
    // FFT analyser share one AudioContext; once .play() is called the
    // analyser starts painting the canvas via rAF. No timeout - we
    // surface the natural error event or success ("playing") only.
    var liveBox = document.getElementById('liveAudio');
    var liveBtn = document.getElementById('liveAudioBtn');
    var spectroEl = document.getElementById('liveSpectro');
    var statusEl = document.getElementById('liveStatus');
    var liveEl = null, audioCtx = null, srcNode = null, analyser = null;
    var specRaf = null;

    function setStatus(msg, isErr) {
      statusEl.textContent = msg || '';
      statusEl.className = 'live-status' + (isErr ? ' err' : '');
    }
    function startAudio() {
      // Create the Audio element and resolve on the first "playing"
      // event (success). The browser will hang the network request
      // open for an icecast stream - that's normal - and "playing"
      // fires as soon as the first audio frame is decoded. We don't
      // race a timeout because icecast can take 1-10s to warm up
      // depending on tunnel + bitrate.
      return new Promise(function (resolve, reject) {
        liveEl = new Audio('/stream?t=' + Date.now());
        // No crossOrigin - the stream is same-origin via the worker
        // and crossOrigin='anonymous' would require CORS headers
        // icecast doesn't send.
        var settled = false;
        liveEl.addEventListener('playing', function () {
          if (settled) return;
          settled = true; resolve();
        });
        liveEl.addEventListener('error', function () {
          if (settled) return;
          settled = true;
          reject(new Error(tr('streamErrorCheckSystem')));
        });
        liveEl.play().catch(function (e) {
          if (settled) return;
          settled = true; reject(e);
        });
      });
    }
    function stopAudio() {
      if (specRaf) { cancelAnimationFrame(specRaf); specRaf = null; }
      if (liveEl) { try { liveEl.pause(); } catch (e) {} liveEl.src = ''; liveEl = null; }
      if (srcNode) { try { srcNode.disconnect(); } catch (e) {} srcNode = null; }
      if (analyser) { try { analyser.disconnect(); } catch (e) {} analyser = null; }
      liveBox.setAttribute('data-on', 'false');
      liveBtn.innerHTML = liveAudioIcon + '<span>' + esc(tr('listen')) + '</span>';
      // Clear the spectrogram canvas so it returns to its quiet state.
      var ctx = spectroEl.getContext('2d');
      ctx.fillStyle = getComputedStyle(document.documentElement)
        .getPropertyValue('--paper-2').trim() || '#efe8d8';
      ctx.fillRect(0, 0, spectroEl.width, spectroEl.height);
    }
    function attachSpectrogram() {
      if (!liveEl) return;
      if (!audioCtx) {
        var Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        audioCtx = new Ctx();
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();
      try {
        srcNode = audioCtx.createMediaElementSource(liveEl);
      } catch (e) {
        // MediaElementSource throws if the Audio is already wired up
        // (e.g. user toggled listen off then on). Best effort - let
        // the audio still play, just skip the spectrogram.
        return;
      }
      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.7;
      srcNode.connect(analyser);
      analyser.connect(audioCtx.destination);
      drawSpectrogram();
    }
    function drawSpectrogram() {
      var ctx = spectroEl.getContext('2d');
      var W = spectroEl.width, H = spectroEl.height;
      // Read palette tokens for ink + paper so the live spectrogram
      // visually matches the recording-row spectrograms.
      var cs = getComputedStyle(document.documentElement);
      var paper = cs.getPropertyValue('--paper-2').trim() || '#efe8d8';
      ctx.fillStyle = paper;
      ctx.fillRect(0, 0, W, H);
      var bins = new Uint8Array(analyser.frequencyBinCount);
      function tick() {
        if (!analyser) return;
        var img = ctx.getImageData(1, 0, W - 1, H);
        ctx.putImageData(img, 0, 0);
        ctx.clearRect(W - 1, 0, 1, H);
        analyser.getByteFrequencyData(bins);
        var n = bins.length;
        var lo = Math.floor(n * 250 / 24000);
        var hi = Math.floor(n * 12000 / 24000);
        for (var y = 0; y < H; y++) {
          var t = 1 - y / H;
          var idx = Math.round(lo + (hi - lo) * Math.pow(t, 1.6));
          var v = (bins[idx] || 0) / 255;
          var e = v * v * (3 - 2 * v);
          // Paper (245,240,230) -> ink (26,22,18) ramp.
          var r = 245 + Math.round((26 - 245) * e);
          var g = 240 + Math.round((22 - 240) * e);
          var b = 230 + Math.round((18 - 230) * e);
          ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
          ctx.fillRect(W - 1, y, 1, 1);
        }
        specRaf = requestAnimationFrame(tick);
      }
      tick();
    }

    // Paint the spectrogram in its quiet/initial state.
    (function () {
      var ctx = spectroEl.getContext('2d');
      var paper = getComputedStyle(document.documentElement)
        .getPropertyValue('--paper-2').trim() || '#efe8d8';
      ctx.fillStyle = paper;
      ctx.fillRect(0, 0, spectroEl.width, spectroEl.height);
    })();

    liveBtn.addEventListener('click', function (ev) {
      // Important: stop the click from propagating up to the
      // document-level "click outside drawer" handler, which would
      // close the dropdown.
      ev.stopPropagation();
      var on = liveBox.getAttribute('data-on') === 'true';
      if (on) { setStatus(''); stopAudio(); return; }
      liveBox.setAttribute('data-on', 'true');
      liveBtn.innerHTML = stopIcon + '<span>' + esc(tr('stop')) + '</span>';
      setStatus(tr('connecting'));
      startAudio()
        .then(function () { setStatus(tr('streamingFromPi')); attachSpectrogram(); })
        .catch(function (err) {
          stopAudio();
          var msg = (err && err.message) || tr('streamUnavailable');
          if (msg.indexOf('NotAllowed') !== -1 || msg.indexOf('user') !== -1) {
            setStatus(tr('autoplayBlocked'), true);
          } else {
            setStatus(msg, true);
          }
        });
    });
  }

  // Pending changes (key -> value), saved on click of the Save button.
  var pending = {};

  function setSaveState(msg, cls) {
    var el = document.getElementById('saveState');
    if (el) { el.textContent = msg || ''; el.className = 'save-state' + (cls ? ' ' + cls : ''); }
    var btn = document.getElementById('saveBtn');
    if (btn) btn.disabled = Object.keys(pending).length === 0;
  }

  function loadSettings() {
    fetch('./avian/api/config.php', { credentials: 'same-origin', cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (cfg) {
        var v = cfg.values || {};
        var preserve = cfg.preserve;
        var html = ''
          + settingsToggle('preserve', tr('preserveAllRecordings'), tr('dontAutoDelete'), preserve)
          + settingsSlider('CONFIDENCE',  tr('confidenceThreshold'), tr('minScoreDetection'),  v.CONFIDENCE,  0.1, 0.95, 0.05, 2)
          + settingsSlider('SENSITIVITY', tr('sensitivity'),         tr('analyzerSensitivity'), v.SENSITIVITY, 0.5, 1.5,  0.05, 2)
          + settingsSlider('OVERLAP',     tr('chunkOverlap'),        tr('secondsAnalyzed'),     v.OVERLAP,     0,   2.5,  0.1,  1)
          + settingsSegmented('FULL_DISK', tr('whenDiskFills'), '', v.FULL_DISK, [
              { v: 'keep',  label: tr('keep') },
              { v: 'purge', label: tr('purge') },
            ])
          + '<div class="menu-save-row">'
          + '  <span class="save-state" id="saveState"></span>'
          + '  <button type="button" id="saveBtn" disabled>' + esc(tr('save')) + '</button>'
          + '</div>';
        var body = document.getElementById('settingsBody');
        if (body) body.innerHTML = html;
        wireSettingsControls();
        var saveBtn = document.getElementById('saveBtn');
        if (saveBtn) saveBtn.addEventListener('click', saveSettings);
      })
      .catch(function (err) {
        var body = document.getElementById('settingsBody');
        if (body) body.innerHTML =
          '<div class="menu-row"><span class="label">Failed to load <small class="hint">' + err + '</small></span></div>';
      });
  }

  function settingsToggle(key, label, hint, on) {
    return ''
      + '<div class="menu-row">'
      + '  <div><span class="label">' + esc(label) + '</span>'
      +     (hint ? '<span class="hint">' + esc(hint) + '</span>' : '')
      + '  </div>'
      + '  <button type="button" class="switch" role="switch" aria-checked="' + (on ? 'true' : 'false') + '" data-key="' + key + '"></button>'
      + '</div>';
  }
  function settingsSlider(key, label, hint, val, min, max, step, digits) {
    return ''
      + '<div class="slider-row">'
      + '  <div class="head">'
      + '    <div class="label-block">'
      + '      <span class="label">' + esc(label) + '</span>'
      +       (hint ? '<span class="hint">' + esc(hint) + '</span>' : '')
      + '    </div>'
      + '    <span class="value" data-value-for="' + key + '">' + (+val).toFixed(digits) + '</span>'
      + '  </div>'
      + '  <div class="slider-track">'
      + '    <input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + val + '" data-key="' + key + '" data-digits="' + digits + '">'
      + '  </div>'
      + '</div>';
  }
  function settingsSegmented(key, label, hint, val, opts) {
    var btns = opts.map(function (o) {
      return '<button type="button" data-v="' + esc(o.v) + '" aria-current="' + (o.v === val ? 'true' : 'false') + '">' + esc(o.label) + '</button>';
    }).join('');
    return ''
      + '<div class="menu-row">'
      + '  <div><span class="label">' + esc(label) + '</span>'
      +     (hint ? '<span class="hint">' + esc(hint) + '</span>' : '')
      + '  </div>'
      + '  <div class="seg" data-key="' + esc(key) + '">' + btns + '</div>'
      + '</div>';
  }
  function wireSettingsControls(scope) {
    scope = scope || document;
    scope.querySelectorAll('.switch').forEach(function (sw) {
      sw.addEventListener('click', function () {
        var on = sw.getAttribute('aria-checked') !== 'true';
        sw.setAttribute('aria-checked', on ? 'true' : 'false');
        pending[sw.dataset.key] = on;
        setSaveState(tr('changePending'));
      });
    });
    scope.querySelectorAll('input[type="range"]').forEach(function (sl) {
      sl.addEventListener('input', function () {
        var v = +sl.value;
        var digits = +sl.dataset.digits || 2;
        var label = scope.querySelector('[data-value-for="' + sl.dataset.key + '"]');
        if (label) label.textContent = v.toFixed(digits);
        pending[sl.dataset.key] = v;
        setSaveState(tr('changePending'));
      });
    });
    scope.querySelectorAll('.seg').forEach(function (seg) {
      seg.querySelectorAll('button').forEach(function (b) {
        b.addEventListener('click', function () {
          seg.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-current', x === b ? 'true' : 'false'); });
          pending[seg.dataset.key] = b.dataset.v;
          setSaveState(tr('changePending'));
        });
      });
    });
  }

  function saveSettings() {
    if (Object.keys(pending).length === 0) return;
    var body = JSON.stringify(pending);
    setSaveState(tr('saving'));
    fetch('./avian/api/config.php', {
      method: 'POST', body: body,
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok && res.j.ok) {
          pending = {};
          setSaveState(tr('saved'), 'ok');
          setTimeout(function () { setSaveState(''); }, 1800);
        } else {
          setSaveState(tr('saveFailed'), 'err');
        }
      })
      .catch(function () { setSaveState(tr('networkError'), 'err'); });
  }

  // ---- Hash routing + atlas detail modal ----
  // When a collage tile or stats row is clicked it sets
  // location.hash = '#sci=<name>'. On arrival we switch to the atlas
  // view, highlight the matching card, AND open the detail modal with
  // expanded info (Wikipedia summary, taxonomy, all past recordings).
  function readHash() {
    var m = location.hash.match(/^#sci=([^&]+)/);
    if (!m) return null;
    return decodeURIComponent(m[1]);
  }
  function highlightAtlas(sci) {
    var grid = document.getElementById('atlasGrid');
    if (!grid) return;
    grid.querySelectorAll('.bird-card[data-active="true"]').forEach(function (c) {
      c.removeAttribute('data-active');
    });
    if (!sci) return;
    var attempts = 0;
    (function find() {
      var card = grid.querySelector('.bird-card[data-sci="' + sci.replace(/"/g, '\"') + '"]');
      if (!card) {
        if (attempts++ < 10) return setTimeout(find, 80);
        return;
      }
      card.setAttribute('data-active', 'true');
      card.setAttribute('data-pulse', 'true');
      setTimeout(function () { card.removeAttribute('data-pulse'); }, 520);
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    })();
  }

  // ---- Detail modal ----
  // Caches per-sci species info so opening the same modal twice doesn't
  // re-fetch. Wikipedia + per-species endpoints are slow over the
  // tunnel; one fetch per session is plenty.
  var SPECIES_CACHE = {};
  var WIKI_CACHE = {};
  var modalAudio = null;
  var modalRecBtn = null;
  function fmtRecTime(d, t) {
    // d="2026-05-15", t="20:25:29"
    if (!d) return '-';
    var date = new Date((d || '') + 'T' + (t || '00:00:00'));
    if (isNaN(date.getTime())) return d + ' ' + (t || '');
    var now = Date.now();
    var ago = Math.floor((now - date.getTime()) / 1000);
    if (ago < 60) return fmtAgo(ago, 'secAgo');
    if (ago < 3600) return fmtAgo(Math.floor(ago / 60), 'minAgo');
    if (ago < 86400) return fmtAgo(Math.floor(ago / 3600), 'hourAgo');
    return fmtAgo(Math.floor(ago / 86400), 'daysAgo');
  }
  function fmtDateLine(d, t) {
    if (!d) return '';
    try {
      var date = new Date(d + 'T' + (t || '00:00:00'));
      return date.toLocaleDateString(currentLang === 'zh-CN' ? 'zh-CN' : undefined, { month: 'short', day: 'numeric' }) +
        ' · ' + (t ? t.slice(0, 5) : '');
    } catch (e) { return d + ' ' + (t || ''); }
  }
  function rarityLabel(total, firstSeenIso) {
    if (!total) return '-';
    var days = 1;
    if (firstSeenIso) {
      var t = Date.parse((firstSeenIso || '').replace(' ', 'T'));
      if (!isNaN(t)) days = Math.max(1, Math.ceil((Date.now() - t) / 86400000));
    }
    var perDay = total / days;
    if (perDay >= 5) return tr('common');
    if (perDay >= 1) return tr('regular');
    if (perDay >= 0.2) return tr('occasional');
    return tr('rare');
  }
  // rAF-driven cursor smoothing. timeupdate fires ~4Hz which feels
  // janky; we sample audio.currentTime every animation frame and
  // interpolate to a 60Hz update so the playback knob glides.
  var modalCursorRaf = null;
  function startCursorLoop() {
    if (modalCursorRaf) return;
    var tick = function () {
      if (!modalAudio || !modalRecBtn) { modalCursorRaf = null; return; }
      var row = modalRecBtn.closest('.rec-row');
      if (row && modalAudio.duration) {
        var strip = row.querySelector('.rec-spectro');
        var played = strip && strip.querySelector('.rec-spectro-played');
        var cursor = strip && strip.querySelector('.rec-spectro-cursor');
        var pct = (modalAudio.currentTime / modalAudio.duration) * 100;
        if (played) played.style.width = pct.toFixed(3) + '%';
        if (cursor) cursor.style.left = pct.toFixed(3) + '%';
      }
      modalCursorRaf = requestAnimationFrame(tick);
    };
    modalCursorRaf = requestAnimationFrame(tick);
  }
  function stopCursorLoop() {
    if (modalCursorRaf) { cancelAnimationFrame(modalCursorRaf); modalCursorRaf = null; }
  }

  // Pause the currently-playing modal recording but KEEP the audio
  // element alive so the user can scrub (audio.currentTime is still
  // mutable on a paused element) and then resume from the same spot.
  // The cursor stays visible at its last position.
  function pauseModalAudio() {
    stopCursorLoop();
    if (modalAudio) { try { modalAudio.pause(); } catch (e) {} }
    if (modalRecBtn) {
      modalRecBtn.removeAttribute('data-active');
      modalRecBtn.innerHTML = ICON_PLAY;
    }
  }
  // Hard-stop: pause + tear down the audio + clear cursor. Used when
  // switching rows or closing the modal.
  function stopModalAudio() {
    stopCursorLoop();
    if (modalAudio) { try { modalAudio.pause(); } catch (e) {} modalAudio = null; }
    if (modalRecBtn) {
      var prevRow = modalRecBtn.closest('.rec-row');
      if (prevRow) {
        var strip = prevRow.querySelector('.rec-spectro');
        if (strip) {
          strip.classList.remove('armed');
          var played = strip.querySelector('.rec-spectro-played');
          var cur = strip.querySelector('.rec-spectro-cursor');
          if (played) played.style.width = '0%';
          if (cur) cur.style.left = '0%';
        }
      }
      modalRecBtn.removeAttribute('data-active');
      modalRecBtn.innerHTML = ICON_PLAY;
      modalRecBtn = null;
    }
  }

  function sketchSrc(sci, pose) {
    // Look up the common name from the lifelist so the worker's JIT
    // Gemini prompt is right for a never-pre-rendered species.
    var sp = ((DATA.lifelist && DATA.lifelist.species) || [])
      .find(function (s) { return s.sci === sci; });
    var com = sp ? speciesNameEn(sp) : '';
    var base = './avian/api/cutout.php?sci=' + encodeURIComponent(sci) +
      (com ? '&com=' + encodeURIComponent(com) : '') +
      cutoutCacheQuery();
    var n = +pose || 1;
    return n > 1 ? base + '&pose=' + n : base;
  }
  function openDetailModal(sci) {
    if (!sci) return;
    var modal = document.getElementById('detail-modal');
    var img = document.getElementById('modalImg');
    var poseToggle = document.getElementById('modalPoseToggle');
    var poseBtns = [].slice.call(poseToggle.querySelectorAll('button'));

    // Reset the toggle: assume nothing's available, set pose 1 (perched
    // cutout - every species has it) as the optimistic default. HEAD
    // probes below toggle each button on/off and pick the best default.
    poseToggle.removeAttribute('data-unavailable');
    poseBtns.forEach(function (b) {
      b.setAttribute('data-unavailable', 'true');
      b.setAttribute('aria-current', 'false');
    });
    var p1 = poseToggle.querySelector('button[data-pose="1"]');
    if (p1) {
      p1.removeAttribute('data-unavailable');
      p1.setAttribute('aria-current', 'true');
    }
    img.src = sketchSrc(sci, 1);
    img.alt = sci;

    // Probe each pose's image with HEAD. Build a list of available
    // poses, then pick the highest-numbered as the default (in-flight
    // > perched, etc.). When only one pose remains, hide the toggle
    // entirely - no choice means no UI.
    var probes = poseBtns.map(function (b) {
      var pose = +b.dataset.pose;
      return fetch(sketchSrc(sci, pose), { method: 'HEAD', cache: 'no-store' })
        .then(function (r) { return { pose: pose, btn: b, ok: r.ok }; })
        .catch(function () { return { pose: pose, btn: b, ok: false }; });
    });
    Promise.all(probes).then(function (results) {
      var available = results.filter(function (r) { return r.ok; });
      available.forEach(function (r) { r.btn.removeAttribute('data-unavailable'); });
      results.filter(function (r) { return !r.ok; }).forEach(function (r) {
        r.btn.setAttribute('data-unavailable', 'true');
      });
      // Default to the highest-numbered available pose (in-flight if
      // present, else fall back to perched).
      var pick = available.sort(function (a, b) { return b.pose - a.pose; })[0];
      if (pick) {
        poseBtns.forEach(function (b) {
          b.setAttribute('aria-current', b === pick.btn ? 'true' : 'false');
        });
        img.src = sketchSrc(sci, pick.pose);
      }
      // Single-option => hide the chrome.
      if (available.length <= 1) {
        poseToggle.setAttribute('data-unavailable', 'true');
      }
      // Slide the white pill to the active button.
      syncPill(poseToggle);
    });
    document.getElementById('modalSci').textContent = sci;
    document.getElementById('modalGenus').textContent = (sci.split(' ')[0] || '-');
    document.getElementById('modalCommon').textContent = '-';
    document.getElementById('modalAllTime').textContent = '-';
    document.getElementById('modalWindow').textContent = '-';
    // Window stat label tracks the picker; the whole stat is hidden for
    // the "all time" window since it would just echo the all-time count.
    var modalWinStat = document.getElementById('modalWindowStat');
    if (currentHours >= 1000000) {
      modalWinStat.style.display = 'none';
    } else {
      modalWinStat.style.display = '';
      document.getElementById('modalWindowLbl').textContent = windowLabel(currentHours);
    }
    document.getElementById('modalFirstSeen').textContent = '-';
    document.getElementById('modalRarity').textContent = '-';
    document.getElementById('modalRarity').classList.remove('rare');
    document.getElementById('modalDesc').textContent = tr('loadingDescription');
    document.getElementById('modalDesc').classList.add('placeholder');
    document.getElementById('modalRecordings').innerHTML = '<li class="rec-empty">' + esc(tr('loadingRecordings')) + '</li>';
    document.getElementById('modalRecCount').textContent = '';
    document.getElementById('modalWiki').href = wikiUrl(sci);
    document.getElementById('modalEbird').href = ebirdUrl(sci);
    // FLIP-style morph: scale + translate the modal-card from the
    // clicked atlas card's position to its natural centered size, so
    // the card *expands* into the detail view instead of just fading
    // in. The outer modal MUST become visible (aria-hidden=false)
    // before we apply the initial transform - the browser skips
    // layout for opacity-0 trees, which would freeze the morph at the
    // starting frame.
    var sourceCard = atlasGridEl
      ? atlasGridEl.querySelector('.bird-card[data-sci="' + sci.replace(/"/g, '\"') + '"]')
      : null;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    morphModalOpen(modal.querySelector('.modal-card'), sourceCard);

    // Species detail (lifelist row + every detection).
    var speciesCacheKey = currentLang + '|' + sci;
    var loadSpecies = SPECIES_CACHE[speciesCacheKey]
      ? Promise.resolve(SPECIES_CACHE[speciesCacheKey])
      : fetchJson('./avian/api/birdnet-api.php?action=species&sci=' + encodeURIComponent(sci) + apiLangParam()).then(function (j) {
          SPECIES_CACHE[speciesCacheKey] = j;
          return j;
        });
    loadSpecies.then(function (j) {
      var s = j.summary || {};
      document.getElementById('modalCommon').textContent = speciesName({ sci: sci, com: s.com, com_en: s.com_en });
      document.getElementById('modalAllTime').textContent = fmtN(+s.total || 0);
      var winRow = ((DATA.recent && DATA.recent.species) || []).filter(function (x) { return x.sci === sci; })[0];
      document.getElementById('modalWindow').textContent = fmtN(winRow ? +winRow.n : 0);
      document.getElementById('modalFirstSeen').textContent = s.first_seen ? fmtRecTime(s.first_seen.split(' ')[0], s.first_seen.split(' ')[1]) : '-';
      var rar = rarityLabel(+s.total || 0, s.first_seen);
      var rarEl = document.getElementById('modalRarity');
      rarEl.textContent = rar;
      if (rar === tr('rare')) rarEl.classList.add('rare');
      var dets = j.detections || [];
      document.getElementById('modalRecCount').textContent = dets.length + tr('captured');
      document.getElementById('modalRecordings').innerHTML = dets.length
        ? dets.map(function (d) {
            return '<li class="rec-row" data-file="' + esc(d.file || '') + '" data-date="' + esc(d.d || '') + '">'
              + '<button class="play" type="button" aria-label="' + esc(tr('play')) + '">' + ICON_PLAY + '</button>'
              + '<span class="when">' + fmtRecTime(d.d, d.t) + '<small>' + fmtDateLine(d.d, d.t) + '</small></span>'
              + '<span class="conf">' + ((+d.conf || 0) * 100).toFixed(0) + '%</span>'
              + '<div class="rec-spectro" aria-hidden="true">'
              +   '<div class="rec-spectro-loading">' + esc(tr('loadingSpectrogram')) + '</div>'
              +   '<div class="rec-spectro-played"></div>'
              +   '<div class="rec-spectro-cursor"></div>'
              +   '<div class="rec-spectro-scrub" role="slider" aria-label="' + esc(tr('scrub')) + '" tabindex="0"></div>'
              + '</div>'
              + '</li>';
          }).join('')
        : '<li class="rec-empty">' + esc(tr('noRecordings')) + '</li>';
    }).catch(function () {
      document.getElementById('modalRecordings').innerHTML = '<li class="rec-empty">' + esc(tr('failedRecordings')) + '</li>';
    });

    // Wikipedia summary (description + genus / family).
    var loadWiki = WIKI_CACHE[sci]
      ? Promise.resolve(WIKI_CACHE[sci])
      : fetchJson('./avian/api/wiki.php?sci=' + encodeURIComponent(sci)).then(function (j) {
          WIKI_CACHE[sci] = j; return j;
        });
    loadWiki.then(function (j) {
      var desc = document.getElementById('modalDesc');
      desc.textContent = j.extract || tr('noDescription');
      desc.classList.toggle('placeholder', !j.extract);
    }).catch(function () {
      var desc = document.getElementById('modalDesc');
      desc.textContent = tr('noDescription');
      desc.classList.add('placeholder');
    });
  }
  function closeDetailModal() {
    var modal = document.getElementById('detail-modal');
    stopModalAudio();
    // Reverse-morph back into the source atlas card so the modal
    // appears to *retract* to where it came from. Look the card up
    // fresh - the user may have switched the time window or sort
    // since opening the modal, so the source card may have moved.
    var sci = (document.getElementById('modalSci').textContent || '').trim();
    var sourceCard = sci && atlasGridEl
      ? atlasGridEl.querySelector('.bird-card[data-sci="' + sci.replace(/"/g, '\"') + '"]')
      : null;
    morphModalClose(modal.querySelector('.modal-card'), sourceCard, function () {
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  }

  // FLIP morph helpers. We never resize/reposition the modal-card
  // permanently - we apply an inline transform that places it at the
  // source-card's position+scale, then clear it next frame so the
  // browser interpolates to the natural state. The same trick runs in
  // reverse on close.
  var atlasGridEl = document.getElementById('atlasGrid');
  function morphFromRect(cardEl) {
    if (!cardEl) return null;
    var r = cardEl.getBoundingClientRect();
    var winCx = window.innerWidth / 2;
    var winCy = window.innerHeight / 2;
    var dx = (r.left + r.width / 2) - winCx;
    var dy = (r.top + r.height / 2) - winCy;
    // Scale relative to the natural max width of the modal (~920px).
    var ratio = Math.max(0.18, Math.min(0.95, r.width / 920));
    return { dx: dx, dy: dy, ratio: ratio };
  }
  function morphModalOpen(modalCard, sourceCard) {
    if (!modalCard) return;
    modalCard.classList.remove('is-morphing');
    var from = morphFromRect(sourceCard);
    if (from) {
      modalCard.style.transformOrigin = '50% 50%';
      modalCard.style.transform =
        'translate3d(' + from.dx + 'px, ' + from.dy + 'px, 0) scale(' + from.ratio + ')';
      modalCard.style.opacity = '0';
    } else {
      modalCard.style.transform = 'translate3d(0, 8px, 0) scale(.96)';
      modalCard.style.opacity = '0';
    }
    // Force a layout flush so the starting state is committed, then
    // schedule the destination on the next tick. setTimeout(0) is
    // more reliable than rAF in some embedded/headless contexts.
    void modalCard.offsetWidth;
    setTimeout(function () {
      modalCard.classList.add('is-morphing');
      // Explicit identity matrix - browsers won't interpolate
      // between a matrix() and the keyword "none".
      modalCard.style.transform = 'translate3d(0px, 0px, 0px) scale(1)';
      modalCard.style.opacity = '1';
      setTimeout(function () {
        modalCard.classList.remove('is-morphing');
        modalCard.style.transform = '';
        modalCard.style.opacity = '';
      }, 420);
    }, 0);
  }
  function morphModalClose(modalCard, sourceCard, done) {
    if (!modalCard) { if (done) done(); return; }
    var from = morphFromRect(sourceCard);
    modalCard.classList.add('is-morphing');
    if (from) {
      modalCard.style.transform =
        'translate3d(' + from.dx + 'px, ' + from.dy + 'px, 0) scale(' + from.ratio + ')';
    } else {
      modalCard.style.transform = 'translate3d(0, 8px, 0) scale(.96)';
    }
    modalCard.style.opacity = '0';
    // After the transition, reset state for next open.
    var settle = function () {
      modalCard.classList.remove('is-morphing');
      modalCard.style.transform = '';
      modalCard.style.opacity = '';
      if (done) done();
    };
    setTimeout(settle, 380);
  }

  // Pose toggle inside the modal - swaps the sketch between perched
  // (default) and in-flight alt pose. A short opacity transition makes
  // the swap feel intentional rather than a hard cut.
  document.getElementById('modalPoseToggle').addEventListener('click', function (ev) {
    var btn = ev.target.closest && ev.target.closest('button');
    if (!btn || btn.getAttribute('data-unavailable') === 'true') return;
    var pose = +btn.dataset.pose;
    var toggle = document.getElementById('modalPoseToggle');
    [].slice.call(toggle.querySelectorAll('button')).forEach(function (b) {
      b.setAttribute('aria-current', b === btn ? 'true' : 'false');
    });
    syncPill(toggle);
    var img = document.getElementById('modalImg');
    var sci = document.getElementById('modalSci').textContent;
    img.classList.add('swapping');
    setTimeout(function () {
      img.src = sketchSrc(sci, pose);
      img.addEventListener('load', function once() {
        img.classList.remove('swapping');
        img.removeEventListener('load', once);
      });
    }, 180);
  });

  // Expose for debugging during dev - also lets the modal be opened
  // from outside the IIFE if needed.
  window.__openDetailModal = openDetailModal;
  window.__closeDetailModal = closeDetailModal;

  // ===== Admin overlay (settings / system / logs / tools) =====
  // Lives in the same shell as the rest of the app - the menu button
  // and return-to-atlas pill stay put. The slider hides; this overlay
  // takes over the body. Navigation is via the drawer menu, NOT
  // internal tabs (the drawer is the canonical nav surface).
  var adminEl = document.getElementById('adminScreen');
  var adminBody = document.getElementById('adminBody');
  var adminTitle = document.getElementById('adminTitle');
  var adminPollT = null;
  var adminSect = null;
  var ADMIN_TITLES = {
    settings: 'Settings',
    system: 'System',
    logs: 'Logs',
    tools: 'Tools',
  };
  function adminEsc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function adminFmtBytes(n) {
    if (!n) return '0 B';
    var u = ['B','KB','MB','GB','TB'];
    var i = 0; while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
    return n.toFixed(n < 10 && i > 0 ? 1 : 0) + ' ' + u[i];
  }
  function adminFmtAge(s) {
    if (s == null) return '-';
    if (s < 60) return s + 's';
    if (s < 3600) return Math.round(s / 60) + 'm';
    if (s < 86400) return Math.round(s / 3600) + 'h';
    return Math.round(s / 86400) + 'd';
  }
  // Admin endpoints rely on the session cookie set by /api/auth/login -
  // no Authorization header needed (and nothing sensitive in JS-readable
  // storage). credentials: 'same-origin' is the default but spelled out
  // for clarity.
  function adminApi(url) {
    return fetch(url, { credentials: 'same-origin', cache: 'no-store' });
  }
  function openAdmin(section) {
    document.body.classList.add('admin-on');
    adminEl.setAttribute('aria-hidden', 'false');
    adminTitle.textContent = ADMIN_TITLES[section] || section;
    if (adminPollT) { clearInterval(adminPollT); adminPollT = null; }
    adminSect = section;
    if (section === 'settings') renderAdminSettings();
    else if (section === 'system') renderAdminSystem();
    else if (section === 'logs') renderAdminLogs();
    else if (section === 'tools') renderAdminTools();
  }
  function closeAdmin() {
    document.body.classList.remove('admin-on');
    adminEl.setAttribute('aria-hidden', 'true');
    if (adminPollT) { clearInterval(adminPollT); adminPollT = null; }
    adminSect = null;
  }

  function adminCard(title, value, sub, cls) {
    return '<div class="admin-card ' + (cls || '') + '">'
      + '<h3>' + adminEsc(title) + '</h3>'
      + '<div class="v">' + adminEsc(value) + '</div>'
      + (sub ? '<div class="sub">' + adminEsc(sub) + '</div>' : '')
      + '</div>';
  }
  function adminUnreachableHtml(reason) {
    return '<div class="admin-unreachable">Pi unreachable - ' + adminEsc(reason || 'no data') + '</div>';
  }

  function renderAdminSettings() {
    adminBody.innerHTML = '<p style="font:11px ui-monospace,monospace;color:var(--ink-soft);text-align:center">' + esc(tr('loadingSettings')) + '</p>';
    fetch('./avian/api/config.php', { credentials: 'same-origin', cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(r.status); })
      .then(function (cfg) {
        var v = cfg.values || {};
        var preserve = cfg.preserve;
        adminBody.innerHTML =
          '<div class="admin-settings">'
          + settingsToggle('preserve', tr('preserveAllRecordings'), tr('dontAutoDelete'), preserve)
          + settingsSlider('CONFIDENCE',  tr('confidenceThreshold'), tr('minScoreDetection'),  v.CONFIDENCE,  0.1, 0.95, 0.05, 2)
          + settingsSlider('SENSITIVITY', tr('sensitivity'),         tr('analyzerSensitivity'), v.SENSITIVITY, 0.5, 1.5,  0.05, 2)
          + settingsSlider('OVERLAP',     tr('chunkOverlap'),        tr('secondsAnalyzed'),     v.OVERLAP,     0,   2.5,  0.1,  1)
          + settingsSegmented('FULL_DISK', tr('whenDiskFills'), '', v.FULL_DISK, [
              { v: 'keep',  label: tr('keep') },
              { v: 'purge', label: tr('purge') },
            ])
          + '<div class="menu-save-row">'
          + '  <span class="save-state" id="saveState"></span>'
          + '  <button type="button" id="saveBtn" disabled>' + esc(tr('save')) + '</button>'
          + '</div>'
          + '</div>';
        wireSettingsControls(adminBody);
        var saveBtn = document.getElementById('saveBtn');
        if (saveBtn) saveBtn.addEventListener('click', saveSettings);
      })
      .catch(function (err) {
        adminBody.innerHTML = adminUnreachableHtml('settings load failed (' + err + ')');
      });
  }

  function renderAdminSystem() {
    adminBody.innerHTML = '<p style="font:11px ui-monospace,monospace;color:var(--ink-soft);text-align:center">loading...</p>';
    function tick() {
      adminApi('./avian/api/birdnet-status.php?action=diag')
        .then(function (r) { return r.text().then(function (raw) { return { status: r.status, raw: raw }; }); })
        .then(function (res) {
          var j = null;
          try { j = JSON.parse(res.raw); } catch (e) {}
          if (res.status !== 200 || !j) {
            adminBody.innerHTML = adminUnreachableHtml(
              !j ? 'birdnet-status.php not installed on the pi' : (j.error || 'HTTP ' + res.status)
            );
            return;
          }
          adminBody.innerHTML = adminSystemMarkup(j);
          wireAdminRestarts();
        })
        .catch(function (e) { adminBody.innerHTML = adminUnreachableHtml(e.message); });
    }
    tick();
    adminPollT = setInterval(tick, 6000);
  }
  function adminSystemMarkup(j) {
    var sys = j.system || {}, svc = j.services || {}, recLogs = j.recent_logs || {};
    var stream = sys.stream_data || {}, db = sys.birds_db || {};
    var streamAlert = !stream.exists || stream.newest_age_s == null || stream.newest_age_s > 600;
    var dbAlert = db.exists && db.modified_s > 3600;
    var keySvcs = ['birdnet_recording', 'birdnet_analysis', 'birdnet_log'];
    var dead = keySvcs.filter(function (n) { return svc[n] && svc[n].active !== 'active'; });
    var html = '<div class="admin-grid">';
    html += adminCard('recording pipeline', dead.length === 0 ? 'live' : (dead.length + ' down'),
      dead.length === 0 ? 'all services active' : dead.join(', '),
      dead.length === 0 ? '' : 'alert');
    html += adminCard('newest live audio',
      stream.newest_age_s == null ? 'no chunks' : adminFmtAge(stream.newest_age_s) + ' ago',
      stream.newest_name || '',
      streamAlert ? 'alert' : '');
    html += adminCard('birds.db updated',
      db.exists ? adminFmtAge(db.modified_s) + ' ago' : 'missing',
      db.mtime || '',
      dbAlert ? 'warn' : '');
    html += adminCard('uptime', (sys.uptime || {}).pretty || '-',
      'load ' + ((sys.uptime || {}).load || []).map(function (n) { return n.toFixed(2); }).join(' / '));
    html += adminCard('cpu temp',
      sys.temp_c != null ? sys.temp_c.toFixed(1) + '°C' : '-',
      sys.hostname + ' · ' + sys.kernel,
      sys.temp_c != null && sys.temp_c > 75 ? 'warn' : '');
    html += adminCard('memory used', sys.mem ? sys.mem.used_pct + '%' : '-',
      sys.mem ? adminFmtBytes(sys.mem.used_bytes) + ' / ' + adminFmtBytes(sys.mem.total_bytes) : '',
      sys.mem && sys.mem.used_pct > 92 ? 'warn' : '');
    html += adminCard('disk (birdsongs)', sys.disk_birds ? sys.disk_birds.used_pct + '%' : '-',
      sys.disk_birds ? adminFmtBytes(sys.disk_birds.total_bytes - sys.disk_birds.free_bytes) + ' / ' + adminFmtBytes(sys.disk_birds.total_bytes) : '',
      sys.disk_birds && sys.disk_birds.used_pct > 92 ? 'warn' : '');
    var audio = sys.audio || {}, cards = audio.arecord_l || [];
    var mic = cards.find ? cards.find(function (c) { return /usb-audio|microphone|mic/i.test(c); }) : null;
    // Without a USB mic, /proc/asound/cards only lists the Pi's HDMI
    // audio outputs - which aren't an input source. Flag that clearly
    // rather than showing "audio device: vc4hdmi0" as if it were a mic.
    html += adminCard('audio device',
      mic || (cards.length ? 'no microphone attached' : 'no audio devices'),
      mic ? '' : (cards[0] || ''),
      mic ? '' : 'warn');
    html += '</div>';

    html += '<h2 class="admin-section-head">services</h2>';
    html += '<table class="admin-tbl"><thead><tr><th>unit</th><th>state</th><th>enabled</th><th>since</th><th></th></tr></thead><tbody>';
    Object.keys(svc).forEach(function (name) {
      var s = svc[name];
      var pill = (s.active === 'active') ? 'active' : (s.active === 'failed' ? 'failed' : 'inactive');
      html += '<tr>'
        + '<td>' + adminEsc(name) + '</td>'
        + '<td><span class="pill ' + pill + '">' + adminEsc(s.active) + '</span></td>'
        + '<td>' + adminEsc(s.enabled) + '</td>'
        + '<td>' + adminEsc(s.since || '-') + '</td>'
        + '<td><button class="restart" data-unit="' + adminEsc(name) + '">restart</button></td>'
        + '</tr>';
    });
    html += '</tbody></table>';

    var conf = (sys.conf || {}).values || {};
    var rows = Object.keys(conf).map(function (k) {
      return '<tr><td>' + adminEsc(k) + '</td><td>' + adminEsc(conf[k]) + '</td></tr>';
    }).join('');
    if (rows) {
      html += '<h2 class="admin-section-head">birdnet.conf</h2>';
      html += '<table class="admin-tbl"><tbody>' + rows + '</tbody></table>';
    }
    if (Object.keys(recLogs).length) {
      html += '<h2 class="admin-section-head">recent journal</h2>';
      Object.keys(recLogs).forEach(function (u) {
        html += '<h3 style="font:9.5px ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-soft);margin:12px 0 6px">' + adminEsc(u) + '</h3>';
        html += '<div class="admin-logs-pane">' + adminEsc(recLogs[u] || '(empty)') + '</div>';
      });
    }
    return html;
  }
  function wireAdminRestarts() {
    adminBody.querySelectorAll('button.restart').forEach(function (b) {
      b.addEventListener('click', function () {
        var unit = b.dataset.unit;
        if (!confirm('Restart ' + unit + '?')) return;
        b.disabled = true; var old = b.textContent; b.textContent = '...';
        fetch('./avian/api/birdnet-status.php?action=restart&unit=' + encodeURIComponent(unit), {
          method: 'POST', credentials: 'same-origin',
        })
          .then(function (r) { return r.json(); })
          .then(function (j) {
            b.textContent = j.ok ? 'ok' : 'fail';
            setTimeout(function () { b.disabled = false; b.textContent = old; renderAdminSystem(); }, 1200);
          })
          .catch(function () { b.textContent = 'err'; b.disabled = false; setTimeout(function () { b.textContent = old; }, 1500); });
      });
    });
  }

  function renderAdminLogs() {
    var unit = 'birdnet_recording', lines = 120, autoScroll = true;
    adminBody.innerHTML =
      '<div class="admin-logs-toolbar">'
      + '  <label>unit</label><select id="adminLogsUnit">'
      // php-fpm unit name differs per Debian version (8.2 on Bookworm,
      // 8.4 on Trixie). List all three so the dropdown has the right one
      // regardless of host - birdnet-status.php's ALLOWED_UNITS already
      // skips ones systemd doesn't know about.
      + ['birdnet_recording','birdnet_analysis','birdnet_log','birdnet_stats','spectrogram_viewer','livestream','icecast2','caddy','php8.4-fpm','php8.3-fpm','php8.2-fpm']
          .map(function (u) { return '<option value="' + u + '">' + u + '</option>'; }).join('')
      + '  </select>'
      + '  <label>lines</label><input id="adminLogsLines" type="number" value="120" min="20" max="500" step="20">'
      + '</div>'
      + '<div class="admin-logs-pane" id="adminLogsOut">loading...</div>';
    var pane = document.getElementById('adminLogsOut');
    var sel = document.getElementById('adminLogsUnit');
    var linesIn = document.getElementById('adminLogsLines');
    sel.addEventListener('change', function () { unit = sel.value; tick(); });
    linesIn.addEventListener('change', function () { lines = +linesIn.value || 120; tick(); });
    pane.addEventListener('scroll', function () {
      autoScroll = pane.scrollTop + pane.clientHeight >= pane.scrollHeight - 20;
    });
    function tick() {
      adminApi('./avian/api/birdnet-status.php?action=logs&unit=' + encodeURIComponent(unit) + '&lines=' + lines)
        .then(function (r) { return r.text().then(function (raw) { return { status: r.status, raw: raw }; }); })
        .then(function (res) {
          var j = null;
          try { j = JSON.parse(res.raw); } catch (e) {}
          if (res.status !== 200 || !j) {
            pane.textContent = 'pi unreachable - ' + (j && j.error ? j.error : 'no data');
            return;
          }
          pane.textContent = j.text || '(empty)';
          if (autoScroll) pane.scrollTop = pane.scrollHeight;
        });
    }
    tick();
    adminPollT = setInterval(tick, 4000);
  }

  function renderAdminTools() {
    var actions = [
      ['restart birdnet_recording', 'picks up live audio from the mic. restart this first if detections stall.', 'birdnet_recording'],
      ['restart birdnet_analysis',  'runs the neural net on recorded chunks. restart if detections are stuck.', 'birdnet_analysis'],
      ['restart birdnet_log',       'writes the sqlite db. restart if api/stats stops updating.', 'birdnet_log'],
      ['restart spectrogram_viewer','live fft view (legacy) - used by /birdnet/spectrogram.', 'spectrogram_viewer'],
      ['restart livestream',        'icecast feed for the drawer live-audio button.', 'livestream'],
      ['restart icecast2',          'web audio streaming server (fronts livestream).', 'icecast2'],
    ];
    var html = '<div class="admin-actions-grid">';
    actions.forEach(function (a) {
      html += '<div class="admin-action">'
        + '<h4>' + adminEsc(a[0]) + '</h4>'
        + '<p>' + adminEsc(a[1]) + '</p>'
        + '<button class="run" type="button" data-unit="' + adminEsc(a[2]) + '">run</button>'
        + '<div class="out" data-out="' + adminEsc(a[2]) + '"></div>'
        + '</div>';
    });
    html += '</div>';
    html += '<h2 class="admin-section-head">heal / update</h2>';
    html += '<div class="admin-actions-grid">';
    function deployCard(title, desc, lines) {
      return '<div class="admin-action deploy">'
        + '<h4>' + adminEsc(title) + '</h4>'
        + '<p>' + adminEsc(desc) + '</p>'
        + '<pre>' + adminEsc(lines.join('\n')) + '</pre>'
        + '<button class="copy" type="button">copy</button>'
        + '</div>';
    }
    html += deployCard('pull latest from github',
      'fetches the newest AvianVisitors + BirdNET-Pi changes; the symlinks already in /BirdSongs/Extracted/ pick up new code on the next request.',
      [
        'cd ~/BirdNET-Pi && git pull',
        '# substitute the right php-fpm unit if your debian ships a different version:',
        'sudo systemctl reload caddy "$(systemctl list-unit-files \'php*-fpm.service\' --no-legend | awk \'{print $1; exit}\')"',
      ]);
    html += deployCard('rerun install_services.sh',
      'refreshes every symlink + service file. safe to run anytime; only takes ~10 seconds.',
      [
        'cd ~/BirdNET-Pi && ./scripts/install_services.sh',
      ]);
    html += '</div>';
    adminBody.innerHTML = html;
    // Wire restart buttons + copy buttons.
    adminBody.querySelectorAll('.admin-action button.run').forEach(function (b) {
      b.addEventListener('click', function () {
        var unit = b.dataset.unit;
        if (!confirm('restart ' + unit + '?')) return;
        b.disabled = true; var old = b.textContent; b.textContent = '...';
        var out = adminBody.querySelector('.out[data-out="' + unit.replace(/[^a-z0-9_.-]/gi,'_') + '"]');
        fetch('./avian/api/birdnet-status.php?action=restart&unit=' + encodeURIComponent(unit), {
          method: 'POST', credentials: 'same-origin',
        })
          .then(function (r) { return r.json(); })
          .then(function (j) {
            b.textContent = j.ok ? 'restarted' : 'failed';
            if (out) out.textContent = (j.ok ? 'ok' : 'rc=' + j.rc) + (j.out ? '\n' + j.out : '');
            setTimeout(function () { b.disabled = false; b.textContent = old; }, 2000);
          })
          .catch(function (e) {
            b.textContent = 'error'; b.disabled = false;
            if (out) out.textContent = e.message || 'request failed';
            setTimeout(function () { b.textContent = old; }, 2000);
          });
      });
    });
    adminBody.querySelectorAll('.admin-action button.copy').forEach(function (b) {
      b.addEventListener('click', function () {
        var pre = b.previousElementSibling;
        if (!pre) return;
        navigator.clipboard.writeText(pre.textContent).then(function () {
          var old = b.textContent; b.textContent = 'copied ✓';
          setTimeout(function () { b.textContent = old; }, 1400);
        });
      });
    });
  }

  // Initial load: if URL has a sci hash, jump to atlas, highlight, and
  // open the modal.
  if (readHash()) { go(2); highlightAtlas(readHash()); openDetailModal(readHash()); }
  // Admin overlay routing: #admin=system|logs|tools opens the admin
  // screen with that sub-tab. Clearing the hash closes it.
  function readAdminHash() {
    var m = location.hash.match(/^#admin=([a-z]+)/);
    return m ? m[1] : null;
  }
  // #about - brief explainer popup; reached via /about (302 -> /#about)
  // or the masthead eyebrow. aria-hidden drives the CSS fade/slide.
  function openAbout()  { document.getElementById('about-modal').setAttribute('aria-hidden', 'false'); }
  function closeAbout() { document.getElementById('about-modal').setAttribute('aria-hidden', 'true'); }
  function syncRouter() {
    window.__lastHashchange = Date.now();
    var sci = readHash();
    var adm = readAdminHash();
    if (location.hash === '#about') openAbout(); else closeAbout();
    if (adm) { openAdmin(adm); return; }
    closeAdmin();
    if (sci) { go(2); highlightAtlas(sci); openDetailModal(sci); }
    else     { highlightAtlas(null); closeDetailModal(); }
  }
  if (readAdminHash()) openAdmin(readAdminHash());
  if (location.hash === '#about') openAbout();
  window.addEventListener('hashchange', syncRouter);

  // Modal interactions: backdrop / close button -> clear the hash.
  document.getElementById('detail-modal').addEventListener('click', function (ev) {
    if (ev.target.dataset && ev.target.dataset.close === '1') {
      if (location.hash) { location.hash = ''; } else { closeDetailModal(); }
    }
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' &&
        document.getElementById('detail-modal').getAttribute('aria-hidden') === 'false') {
      if (location.hash) { location.hash = ''; } else { closeDetailModal(); }
    }
  });

  // About popup: backdrop / close / explore button all carry data-close,
  // which clears the hash and routes through syncRouter -> closeAbout.
  // The masthead eyebrow opens it; Escape dismisses it.
  document.getElementById('about-modal').addEventListener('click', function (ev) {
    if (ev.target.dataset && ev.target.dataset.close === '1') {
      if (location.hash) { location.hash = ''; } else { closeAbout(); }
    }
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape' &&
        document.getElementById('about-modal').getAttribute('aria-hidden') === 'false') {
      if (location.hash) { location.hash = ''; } else { closeAbout(); }
    }
  });
  document.getElementById('aboutLink').addEventListener('click', function () {
    location.hash = '#about';
  });

  // Shared decode context for spectrogram generation. Lives once for
  // the page; lazily created on first expand to avoid bootstrapping
  // WebAudio if no one ever opens a row.
  var _specAudioCtx = null;
  function getSpecCtx() {
    if (!_specAudioCtx) {
      var C = window.AudioContext || window.webkitAudioContext;
      if (C) _specAudioCtx = new C();
    }
    return _specAudioCtx;
  }

  // Cache decoded AudioBuffers per file so repeated expand/collapse on
  // the same row doesn't re-fetch + re-decode the mp3.
  var _decodedCache = {};

  // Minimal in-place Cooley-Tukey radix-2 FFT (n must be a power of 2).
  // Operates on parallel real/imag Float32Array buffers. ~30 lines and
  // fast enough for our ~1024-sample windows of 3-second clips.
  function _fft(real, imag) {
    var n = real.length;
    var j = 0;
    for (var i = 0; i < n - 1; i++) {
      if (i < j) {
        var tr = real[i]; real[i] = real[j]; real[j] = tr;
        var ti = imag[i]; imag[i] = imag[j]; imag[j] = ti;
      }
      var k = n >> 1;
      while (k <= j) { j -= k; k >>= 1; }
      j += k;
    }
    for (var stage = 2; stage <= n; stage *= 2) {
      var half = stage >> 1;
      var ang = -2 * Math.PI / stage;
      var wR = Math.cos(ang), wI = Math.sin(ang);
      for (var sBase = 0; sBase < n; sBase += stage) {
        var cR = 1, cI = 0;
        for (var sb = 0; sb < half; sb++) {
          var a = sBase + sb;
          var b = a + half;
          var trA = real[b] * cR - imag[b] * cI;
          var tiA = real[b] * cI + imag[b] * cR;
          real[b] = real[a] - trA;
          imag[b] = imag[a] - tiA;
          real[a] = real[a] + trA;
          imag[a] = imag[a] + tiA;
          var nR = cR * wR - cI * wI;
          cI = cR * wI + cI * wR;
          cR = nR;
        }
      }
    }
  }

  // Paint an STFT spectrogram onto the strip's canvas. y-axis is the
  // bird audible band (~200 Hz - ~10 kHz) on a mildly compressed log
  // scale; x-axis is time across the whole clip; colour is dB
  // magnitude mapped to our warm ink palette over the dark paper-ink
  // ground.
  function paintSpectrogram(canvas, audioBuffer) {
    // Defer to the next animation frame so the canvas has been laid out
    // (the parent strip may still be mid-transition expanding from 0).
    // Without this, subsequent expansions paint onto a zero-sized canvas.
    requestAnimationFrame(function () {
      _paintSpectrogramNow(canvas, audioBuffer);
    });
  }
  function _paintSpectrogramNow(canvas, audioBuffer) {
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    // Read parent strip's box, not the canvas (canvas might be 0-sized
    // briefly during expansion). The strip's expanded height is 88px;
    // width is the row width.
    var strip = canvas.parentElement;
    var cssW = strip ? strip.clientWidth : (canvas.clientWidth || 600);
    var cssH = strip ? strip.clientHeight : (canvas.clientHeight || 88);
    if (cssW < 32 || cssH < 32) {
      // Strip still collapsing in. Retry a frame later.
      requestAnimationFrame(function () { _paintSpectrogramNow(canvas, audioBuffer); });
      return;
    }
    var W = Math.max(1, Math.floor(cssW * dpr));
    var H = Math.max(1, Math.floor(cssH * dpr));
    canvas.width = W; canvas.height = H;

    var ctx = canvas.getContext('2d');
    var samples = audioBuffer.getChannelData(0);
    var sr = audioBuffer.sampleRate;
    var FFT_SIZE = 1024;
    var bins = FFT_SIZE >> 1;
    var nyquist = sr / 2;

    // Frequency-band mapping (Hz -> bin) for the bird-relevant band.
    // Most North American songbirds + corvids range 250 Hz - 8 kHz, but
    // hummingbirds, kinglets, and warblers reach 12 kHz. Push the cap
    // up so we don't miss the high-frequency tail.
    var fLo = 200, fHi = Math.min(12000, nyquist);
    var binLo = Math.max(1, Math.floor(fLo / nyquist * bins));
    var binHi = Math.min(bins - 1, Math.ceil(fHi / nyquist * bins));

    // Hann window
    var win = new Float32Array(FFT_SIZE);
    for (var i = 0; i < FFT_SIZE; i++) {
      win[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (FFT_SIZE - 1));
    }

    // Choose a hop that lays exactly W columns over the whole clip.
    var hop = Math.max(1, Math.floor((samples.length - FFT_SIZE) / Math.max(1, W - 1)));
    var real = new Float32Array(FFT_SIZE);
    var imag = new Float32Array(FFT_SIZE);

    var imgData = ctx.createImageData(W, H);
    var data = imgData.data;

    // Page-paper ground; ink intensifies where there's audio energy.
    // Matches the sketch palette (paper #f5f0e6 background, ink
    // #1a1612 strokes).
    var BG_R = 245, BG_G = 240, BG_B = 230;
    var FG_R = 26,  FG_G = 22,  FG_B = 18;
    for (var p = 0; p < data.length; p += 4) {
      data[p] = BG_R; data[p + 1] = BG_G; data[p + 2] = BG_B; data[p + 3] = 255;
    }

    // Precompute row -> bin map (log-ish so low freqs get more space).
    var rowToBin = new Int32Array(H);
    for (var row = 0; row < H; row++) {
      var t = 1 - row / (H - 1); // 1 at top, 0 at bottom
      var bin = Math.round(binLo + (binHi - binLo) * Math.pow(t, 1.55));
      rowToBin[row] = Math.max(binLo, Math.min(binHi, bin));
    }

    for (var col = 0; col < W; col++) {
      var start = col * hop;
      if (start + FFT_SIZE > samples.length) break;
      for (var s = 0; s < FFT_SIZE; s++) {
        real[s] = samples[start + s] * win[s];
        imag[s] = 0;
      }
      _fft(real, imag);
      for (var row2 = 0; row2 < H; row2++) {
        var bin2 = rowToBin[row2];
        var re = real[bin2], im = imag[bin2];
        var mag = Math.sqrt(re * re + im * im);
        // log compress; -75 .. -10 dB -> 0 .. 1
        var db = 20 * Math.log10(mag + 1e-9);
        var v = (db + 75) / 65;
        if (v < 0) v = 0; else if (v > 1) v = 1;
        // Ink-on-paper palette: low energy -> paper, high energy -> ink.
        // Smoothstep for a softer falloff between the two extremes.
        var e = v * v * (3 - 2 * v);
        var r = BG_R + Math.round((FG_R - BG_R) * e);
        var g = BG_G + Math.round((FG_G - BG_G) * e);
        var b = BG_B + Math.round((FG_B - BG_B) * e);
        var px = (row2 * W + col) * 4;
        data[px] = r; data[px + 1] = g; data[px + 2] = b; data[px + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);
    canvas.classList.add('ready');
  }

  // Lazy-add + paint the canvas-based spectrogram for a row's strip.
  // Decoded buffers are cached per file so re-expanding is instant.
  function ensureSpectroImage(row) {
    var file = row && row.dataset.file;
    if (!file) return;
    var strip = row.querySelector('.rec-spectro');
    if (!strip) return;
    var loadingEl = strip.querySelector('.rec-spectro-loading');
    var canvas = strip.querySelector('canvas');
    if (canvas && canvas.classList.contains('ready')) {
      if (loadingEl) loadingEl.style.display = 'none';
      return;
    }
    if (!canvas) {
      canvas = document.createElement('canvas');
      var played = strip.querySelector('.rec-spectro-played');
      strip.insertBefore(canvas, played);
    }
    if (loadingEl) {
      loadingEl.style.display = '';
      loadingEl.textContent = tr('renderingSpectrogram');
    }

    function done() {
      if (loadingEl) loadingEl.style.display = 'none';
    }
    function fail(reason) {
      if (loadingEl) {
        loadingEl.style.display = '';
        loadingEl.textContent = reason || tr('spectrogramUnavailable');
      }
    }

    if (_decodedCache[file]) {
      paintSpectrogram(canvas, _decodedCache[file]);
      done();
      return;
    }
    var ctx = getSpecCtx();
    if (!ctx) { fail(tr('webAudioUnavailable')); return; }
    fetch('./avian/api/recording.php?file=' + encodeURIComponent(file))
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.arrayBuffer();
      })
      .then(function (buf) { return ctx.decodeAudioData(buf); })
      .then(function (audioBuffer) {
        _decodedCache[file] = audioBuffer;
        paintSpectrogram(canvas, audioBuffer);
        done();
      })
      .catch(function (e) {
        fail(tr('spectrogramFailedPrefix') + (e && e.message ? e.message : ''));
      });
  }

  // Per-recording row interactions in the modal:
  //   - Clicking anywhere on the row toggles the spectrogram strip
  //     (independent of playback). Click again to collapse.
  //   - Clicking the play button toggles audio playback. Playback shows
  //     the moving cursor on whatever strip is already expanded; if the
  //     strip is collapsed, playing also expands it.
  //   - Clicking on the spectrogram itself scrubs (handled in the
  //     mousedown/touchstart wiring further down).
  document.getElementById('modalRecordings').addEventListener('click', function (ev) {
    if (!ev.target.closest) return;
    // Scrub-region clicks are handled by the mousedown wiring below.
    if (ev.target.closest('.rec-spectro-scrub')) return;

    var playBtn = ev.target.closest('.play');
    if (playBtn) {
      // Play / pause toggle. Three cases:
      //   (a) clicking the playing row's button -> pause (KEEP audio
      //       alive so the user can scrub then resume).
      //   (b) clicking a paused row's button (it's still modalRecBtn,
      //       audio still alive, just paused) -> resume from cursor.
      //   (c) clicking a different row's button -> stop the old, start
      //       the new.
      var prow = playBtn.closest('.rec-row');
      var pfile = prow && prow.dataset.file;
      if (!pfile) return;

      if (modalRecBtn === playBtn && modalAudio) {
        // Same row's button - toggle pause/resume.
        if (modalAudio.paused) {
          playBtn.setAttribute('data-active', 'true');
          playBtn.innerHTML = ICON_PAUSE;
          modalAudio.play().catch(function () {});
        } else {
          pauseModalAudio();
        }
        return;
      }

      // Different row (or no current playback) - stop any current,
      // start fresh.
      stopModalAudio();
      playBtn.setAttribute('data-active', 'true');
      playBtn.innerHTML = ICON_PAUSE;
      modalRecBtn = playBtn;
      prow.classList.add('expanded');
      ensureSpectroImage(prow);
      var strip = prow.querySelector('.rec-spectro');
      var audio = new Audio('./avian/api/recording.php?file=' + encodeURIComponent(pfile));
      modalAudio = audio;
      audio.addEventListener('loadedmetadata', function () {
        strip.classList.add('armed');
      });
      audio.addEventListener('playing', startCursorLoop);
      audio.addEventListener('pause', stopCursorLoop);
      audio.addEventListener('ended', function () {
        // Natural end: rewind cursor + keep audio so user can replay.
        stopCursorLoop();
        var p = strip.querySelector('.rec-spectro-played');
        var c = strip.querySelector('.rec-spectro-cursor');
        if (p) p.style.width = '0%';
        if (c) c.style.left = '0%';
        if (modalAudio) modalAudio.currentTime = 0;
        if (modalRecBtn) {
          modalRecBtn.removeAttribute('data-active');
          modalRecBtn.innerHTML = ICON_PLAY;
        }
      });
      audio.addEventListener('error', function () {
        stopModalAudio();
        playBtn.innerHTML = '<span style="font-size:8px">!</span>';
        setTimeout(function () { playBtn.innerHTML = ICON_PLAY; }, 1500);
      });
      audio.play().catch(function () { stopModalAudio(); });
      return;
    }

    // Row click anywhere else -> toggle strip open/closed.
    var row = ev.target.closest('.rec-row');
    if (!row) return;
    var willExpand = !row.classList.contains('expanded');
    if (willExpand) {
      row.classList.add('expanded');
      ensureSpectroImage(row);
    } else {
      // Collapsing the row where playback is happening also stops audio
      // (the cursor would just be hidden otherwise).
      if (modalRecBtn && modalRecBtn.closest('.rec-row') === row) stopModalAudio();
      row.classList.remove('expanded');
    }
  });

  // Scrub by clicking / dragging on the spectrogram strip.
  (function () {
    var dragRow = null;
    function seekFromEvent(row, clientX) {
      if (!modalAudio || !modalAudio.duration) return;
      var rowBtn = row.querySelector('.play');
      if (rowBtn !== modalRecBtn) return;
      var strip = row.querySelector('.rec-spectro');
      var rect = strip.getBoundingClientRect();
      var pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      modalAudio.currentTime = pct * modalAudio.duration;
      // Repaint cursor + played immediately so the user sees the scrub
      // even when audio is paused (rAF loop isn't running then).
      var pctStr = (pct * 100).toFixed(2) + '%';
      var played = strip.querySelector('.rec-spectro-played');
      var cur = strip.querySelector('.rec-spectro-cursor');
      if (played) played.style.width = pctStr;
      if (cur) cur.style.left = pctStr;
    }
    document.getElementById('modalRecordings').addEventListener('mousedown', function (ev) {
      var s = ev.target.closest && ev.target.closest('.rec-spectro-scrub');
      if (!s) return;
      var row = s.closest('.rec-row');
      if (!row || !row.classList.contains('expanded')) return;
      dragRow = row;
      seekFromEvent(row, ev.clientX);
      ev.preventDefault();
    });
    document.addEventListener('mousemove', function (ev) {
      if (!dragRow) return;
      seekFromEvent(dragRow, ev.clientX);
    });
    document.addEventListener('mouseup', function () { dragRow = null; });
    // Touch.
    document.getElementById('modalRecordings').addEventListener('touchstart', function (ev) {
      var s = ev.target.closest && ev.target.closest('.rec-spectro-scrub');
      if (!s) return;
      var row = s.closest('.rec-row');
      if (!row || !row.classList.contains('expanded')) return;
      dragRow = row;
      seekFromEvent(row, ev.touches[0].clientX);
      ev.preventDefault();
    }, { passive: false });
    document.addEventListener('touchmove', function (ev) {
      if (!dragRow) return;
      seekFromEvent(dragRow, ev.touches[0].clientX);
    });
    document.addEventListener('touchend', function () { dragRow = null; });
  })();

  // Any element with data-sci is a "jump to that bird's atlas card"
  // affordance: atlas cards themselves, stats list rows (top species /
  // first detections), and any future surface that wants to point at a
  // bird. Action chips inside cards stop propagation themselves.
  function jumpToSci(sci) {
    if (!sci) return;
    if (location.hash !== '#sci=' + encodeURIComponent(sci)) {
      location.hash = '#sci=' + encodeURIComponent(sci);
    } else {
      // Same hash -> still re-highlight (the user clicked it again).
      go(2); highlightAtlas(sci);
    }
  }
  document.addEventListener('click', function (ev) {
    if (!ev.target.closest) return;
    var card = ev.target.closest('.bird-card');
    if (card) {
      if (ev.target.closest('.actions, .spectro-wrap')) return;
      return jumpToSci(card.dataset.sci);
    }
    var row = ev.target.closest('li[data-sci]');
    if (row) return jumpToSci(row.dataset.sci);
  });

  // After the atlas re-renders (window change, fresh fetch), re-apply
  // any active hash so the highlight survives a rebuild.
  var _origRenderAtlas = renderAtlas;
  renderAtlas = function () {
    _origRenderAtlas();
    var s = readHash();
    if (s) highlightAtlas(s);
  };
})();
