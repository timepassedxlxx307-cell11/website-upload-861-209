import { H as Hls } from './hls.esm.js';

function attachMoviePlayer(player) {
  const video = player.querySelector('video');
  const trigger = player.querySelector('[data-play-trigger]');

  if (!video || !trigger) {
    return;
  }

  const source = video.dataset.src;
  let isReady = false;
  let hls = null;

  function prepareSource() {
    if (isReady || !source) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      isReady = true;
      return;
    }

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      isReady = true;
      return;
    }

    video.src = source;
    isReady = true;
  }

  function playVideo() {
    prepareSource();
    video.controls = true;
    trigger.classList.add('is-hidden');
    const playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        trigger.classList.remove('is-hidden');
      });
    }
  }

  trigger.addEventListener('click', playVideo);

  video.addEventListener('click', function () {
    if (!isReady || video.paused) {
      playVideo();
    } else {
      video.pause();
    }
  });

  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
      hls = null;
    }
  });
}

Array.from(document.querySelectorAll('[data-video-player]')).forEach(attachMoviePlayer);
