import generateKey from '../../generals/generateKey';

class MediaQueryChecker {
    constructor() {
        window.addEventListener('resize', this.resize);
    }

    windowWidth = window.innerWidth;
    resizeCheckers = {};

    isTouchDevice = ('ontouchstart' in window)
        || (navigator.MaxTouchPoints > 0)
        || (navigator.msMaxTouchPoints > 0);

    addResizeChecker(...addingCheckers) {
        const IDs = [];

        addingCheckers.forEach(query => {
            const from = query.from || 0;
            const to = query.to || Infinity;
            const callback = query.callback;

            const ID = generateKey();
            IDs.push(ID);

            if (callback) this.resizeCheckers[ID] = {from, to, callback}
        });

        return IDs
    }

    removeResizeChecker(IDs) {
        IDs.forEach(id => delete this.resizeCheckers[id])
    }

    resize = () => {
        this.windowWidth = window.innerWidth;

        for (let key in this.resizeCheckers) {
            let {from, to, callback} = this.resizeCheckers[key];

            if (this.windowWidth >= from && this.windowWidth <= to)
                callback();
        }
    }
}

const MQC = new MediaQueryChecker();

export default MQC;