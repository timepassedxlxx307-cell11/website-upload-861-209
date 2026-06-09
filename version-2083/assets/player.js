(function () {
  function startPlayer(frame) {
    if (!frame || frame.getAttribute('data-ready') === '1') {
      return;
    }
    var video = frame.querySelector('video');
    var url = frame.getAttribute('data-stream-url');
    if (!video || !url) {
      return;
    }
    frame.setAttribute('data-ready', '1');
    frame.classList.add('is-playing');
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.play().catch(function () {});
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch(function () {});
      });
      return;
    }
    video.src = url;
    video.play().catch(function () {});
  }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(function (frame) {
      var button = frame.querySelector('.play-overlay');
      var video = frame.querySelector('video');
      if (button) {
        button.addEventListener('click', function () {
          startPlayer(frame);
        });
      }
      if (video) {
        video.addEventListener('click', function () {
          startPlayer(frame);
        });
        video.addEventListener('play', function () {
          frame.classList.add('is-playing');
        });
      }
    });
  });
})();
