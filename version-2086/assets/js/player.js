import { H as Hls } from './hls-dru42stk.js';

const players = Array.from(document.querySelectorAll('[data-player]'));

players.forEach(function (player) {
    const video = player.querySelector('video');
    const startButton = player.querySelector('.player-start');

    if (!video) {
        return;
    }

    const stream = video.getAttribute('data-stream');
    let ready = false;

    const prepare = function () {
        if (ready || !stream) {
            return;
        }

        ready = true;

        if (Hls && Hls.isSupported()) {
            const hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true
            });

            hls.loadSource(stream);
            hls.attachMedia(video);

            hls.on(Hls.Events.ERROR, function (event, data) {
                if (!data || !data.fatal) {
                    return;
                }

                if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                    hls.startLoad();
                    return;
                }

                if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                    hls.recoverMediaError();
                    return;
                }

                hls.destroy();
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = stream;
        }
    };

    const play = function () {
        prepare();
        const result = video.play();

        if (result && typeof result.catch === 'function') {
            result.catch(function () {});
        }
    };

    if (startButton) {
        startButton.addEventListener('click', function () {
            startButton.classList.add('is-hidden');
            play();
        });
    }

    video.addEventListener('click', function () {
        if (video.paused) {
            if (startButton) {
                startButton.classList.add('is-hidden');
            }
            play();
        }
    });

    video.addEventListener('play', function () {
        if (startButton) {
            startButton.classList.add('is-hidden');
        }
    });

    video.addEventListener('loadedmetadata', function () {
        if (startButton) {
            startButton.classList.remove('is-hidden');
        }
    }, { once: true });
});
