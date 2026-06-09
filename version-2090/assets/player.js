(function () {
  window.setupMoviePlayer = function (videoId, videoSource, overlayId) {
    const video = document.getElementById(videoId);
    const overlay = document.getElementById(overlayId);

    if (!video || !overlay || !videoSource) {
      return;
    }

    let started = false;
    let hlsInstance = null;

    const attach = function () {
      if (started) {
        return;
      }

      started = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSource;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hlsInstance.loadSource(videoSource);
        hlsInstance.attachMedia(video);
      } else {
        video.src = videoSource;
      }
    };

    const play = function () {
      attach();
      overlay.classList.add('is-hidden');
      const promise = video.play();

      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          overlay.classList.remove('is-hidden');
        });
      }
    };

    overlay.addEventListener('click', play);
    video.addEventListener('click', function () {
      if (!started) {
        play();
      }
    });
    video.addEventListener('play', function () {
      overlay.classList.add('is-hidden');
    });
    video.addEventListener('ended', function () {
      overlay.classList.remove('is-hidden');
    });
    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    });
  };
})();
