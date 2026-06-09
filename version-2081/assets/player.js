import { H as Hls } from "./hls-vendor-dru42stk.js";

const players = new WeakMap();

function attachStream(video) {
  const url = video.dataset.video;

  if (!url || players.has(video)) {
    return;
  }

  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = url;
    players.set(video, { mode: "native" });
    return;
  }

  if (Hls.isSupported()) {
    const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
    hls.loadSource(url);
    hls.attachMedia(video);
    players.set(video, hls);
  }
}

function playVideo(video, button) {
  attachStream(video);
  if (button) {
    button.classList.add("hidden");
  }
  const playPromise = video.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      if (button) {
        button.classList.remove("hidden");
      }
    });
  }
}

document.querySelectorAll("video[data-video]").forEach((video) => {
  const button = document.querySelector(`[data-target="${video.id}"]`);

  if (button) {
    button.addEventListener("click", () => playVideo(video, button));
  }

  video.addEventListener("click", () => {
    if (video.paused) {
      playVideo(video, button);
    }
  });

  video.addEventListener("play", () => {
    if (button) {
      button.classList.add("hidden");
    }
  });
});
