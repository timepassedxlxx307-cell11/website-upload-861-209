(function () {
  var loadLocalHls = function () {
    return import('./hls-vendor.js').then(function (module) {
      return module.H;
    });
  };

  var attachHls = function (HlsClass, video, source) {
    if (!HlsClass || !HlsClass.isSupported()) {
      return false;
    }

    var hls = new HlsClass({
      enableWorker: true,
      lowLatencyMode: true
    });

    hls.loadSource(source);
    hls.attachMedia(video);
    return true;
  };

  window.initMoviePlayer = function (source) {
    var video = document.querySelector('.movie-video');
    var poster = document.querySelector('.player-poster');
    var ready = false;

    if (!video || !poster || !source) {
      return;
    }

    var load = function () {
      if (ready) {
        return Promise.resolve();
      }

      ready = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        return Promise.resolve();
      }

      if (window.Hls && attachHls(window.Hls, video, source)) {
        return Promise.resolve();
      }

      return loadLocalHls().then(function (HlsClass) {
        attachHls(HlsClass, video, source);
      }).catch(function () {
        video.src = source;
      });
    };

    var start = function () {
      load().then(function () {
        poster.classList.add('is-hidden');
        video.setAttribute('controls', 'controls');
        var playPromise = video.play();

        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise.catch(function () {});
        }
      });
    };

    poster.addEventListener('click', start);
    video.addEventListener('click', function () {
      if (video.paused) {
        start();
      }
    });
  };
})();
