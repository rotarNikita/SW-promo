export default function (options) {
    const duration = options.duration || 300;
    const timing = options.timing || function (timeFraction) { return timeFraction };
    const callback = options.callback || function () {};
    const start = performance.now();

    let stopImmediate = false;

    requestAnimationFrame(function animate(time) {
        if (!stopImmediate) {
            let timeFraction = (time - start) / duration;
            if (timeFraction > 1) timeFraction = 1;

            const progress = timing(timeFraction);

            options.do(progress);

            if (timeFraction < 1) requestAnimationFrame(animate);
            else callback()
        }
    });

    return function (stopWithCallback) {
        stopImmediate = true;

        if (stopWithCallback) callback();
    }
};