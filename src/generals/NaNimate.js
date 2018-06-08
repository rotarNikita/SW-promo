const defaultTimingFunctions = Symbol('NaNimate.defaultAnimationTimingFunctions');
const defaultDuration = Symbol('NaNimate.defaultDuration');

const _callback = Symbol('NaNimate.callback');
const _progressFunction = Symbol('NaNimate.progressFunction');
const _timingFunction = Symbol('NaNimate.timingFunction');
const _duration = Symbol('NaNimate.duration');

const animate = Symbol('Nanimate.animate');

const startTime = Symbol('NaNimate.startTime');
const timeFractionBeforePause = Symbol('NaNimate.timeFractionBeforePause');
const timeFraction = Symbol('NaNimate.timeFraction');
const pauseBool = Symbol('NaNimate.pauseBool');


export default class NaNimate {
    constructor(option) {
        this.duration = option.duration;
        this.timingFunction = option.timingFunction;
        this.progressFunction = option.progressFunction;
        this.callback = option.callback;

        this[timeFraction] = 0; // from 0 to 1
        this[timeFractionBeforePause] = 0;
        this[startTime] = undefined;
        this[pauseBool] = true;
    }

    [animate] = time => {
        if (!this[pauseBool]) {
            this[timeFraction] = this[timeFractionBeforePause] + (time - this[startTime]) / this.duration;
            if (this[timeFraction] > 1) this[timeFraction] = 1;

            const progress = this.timingFunction(this[timeFraction]);

            this.progressFunction(progress);

            if (this[timeFraction] < 1) requestAnimationFrame(this[animate]);
            else this.stop(!!this.callback)
        }
    };

    start = () => {
        if (this[pauseBool]) {
            this[pauseBool] = false;
            this[startTime] = performance.now();

            requestAnimationFrame(this[animate])
        }
    };

    stop = (withCallback, toEnd) => {
        this[pauseBool] = true;
        this[timeFractionBeforePause] = 0;
        this[timeFraction] = 0;

        if (withCallback) this.callback();

        if (typeof toEnd === 'boolean') {
            if (toEnd) this[timeFraction] = 1;
            else this[timeFraction] = 0;

            this.progressFunction(this.timingFunction(this[timeFraction]));
        }
    };

    pause = (withCallback) => {
        this[pauseBool] = true;
        this[timeFractionBeforePause] = this[timeFraction];

        if (withCallback) this.callback();
    };

    set duration(val) {
        this[_duration] = NaNimate.checkDuration(val);
    }

    get duration() {
        return this[_duration]
    }

    set timingFunction(val) {
        this[_timingFunction] = NaNimate.checkTimingFunction(val);
    }

    get timingFunction() {
        return this[_timingFunction]
    }

    set progressFunction(val) {
        this[_progressFunction] = NaNimate.checkProgressFunction(val);
    }

    get progressFunction() {
        return this[_progressFunction]
    }

    set callback(val) {
        this[_callback] = NaNimate.checkCallback(val)
    }

    get callback() {
        return this[_callback]
    }

    static checkCallback(callback) {
        if (typeof callback === 'function')
            return callback;

        if (!callback)
            return () => {};

        throw new Error('callback is not a function');
    }

    static checkProgressFunction(progressFunction) {
        if (typeof progressFunction !== 'function')
            throw new Error('progressFunction is not a function');

        return progressFunction;
    }

    static checkTimingFunction(timingFunction) {
        if (typeof timingFunction === 'string') {
            if (NaNimate[defaultTimingFunctions][timingFunction]) return NaNimate[defaultTimingFunctions][timingFunction];
            else {
                console.warn(`timingFunction: ${timingFunction} is not correct and reset to default ('linear')`);
                return NaNimate[defaultTimingFunctions].linear
            }
        }

        if (typeof timingFunction === 'function')
            return timingFunction;

        console.warn(`timingFunction: ${timingFunction} is not a function and reset to default ('linear')`);
        return NaNimate[defaultTimingFunctions]['linear']
    }

    static checkDuration(duration) {
        if (typeof duration === 'number' || typeof duration === 'string') {
            if (+duration > 0) return +duration;
            else {
                console.warn(`duration: ${duration} is not correct and reset to 0`);
                return 0
            }
        }

        console.warn(`duration: ${duration} is not a number and reset to default (${NaNimate[defaultDuration]})`);
        return NaNimate[defaultDuration]
    }

    static [defaultDuration] = 300;

    static [defaultTimingFunctions] = {
        linear: t => t,
        easeInQuad: t => t * t,
        easeOutQuad: t => t * (2 - t),
        easeInOutQuad: t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInCubic: t => t * t * t,
        easeOutCubic: t => (--t) * t * t + 1,
        easeInOutCubic: t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t -2) + 1,
        easeInQuart: t => t * t * t * t,
        easeOutQuart: t => 1 - (--t) * t * t * t,
        easeInOutQuart: t => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
        easeInQuint: t => t * t * t * t * t,
        easeOutQuint: t => 1 + (--t) * t * t * t * t,
        easeInOutQuint: t => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
    };
}