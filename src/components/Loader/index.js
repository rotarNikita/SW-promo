import React, { Component } from 'react';
import styles from './Loader.scss';
import { MAIN_COLOR_1 } from "../../data/constants";
import Scroll from '../../actions/Scroll';
import NaNimate from '../../generals/NaNimate';

const callbacks = Symbol('Loader.callbacks');

export default class Loader extends Component {
    constructor(props) {
        super(props);

        Scroll.leftScrollAllow = false;
        Scroll.rightScrollAllow = false;
        Scroll.callbacksScrollAllow = false;

        this.radius = Math.sqrt(window.innerWidth * window.innerWidth + window.innerHeight * window.innerHeight);

        this.shortLoader = window.location.pathname !== '/';

        this.animation = null;
    }

    static [callbacks] = {
        startLoad: [],
        finishLoad: [],
        startHide: [],
        unmount: [],
    };

    static load = false;
    static mount = true;

    state = {
        hide: false,
        mount: true,

        rotate: 0
    };

    static addListener(listener, callback) {
        if (this[callbacks][listener].indexOf(callback) === -1 && this.mount) {
            this[callbacks][listener].push(callback);
            return true
        }

        return false
    }

    static removeListener(listener, callback) {
        const index = this[callbacks][listener].indexOf(callback);

        if (index !== -1)
            this[callbacks][listener].splice(index, 1);
    }

    createAnimation() {
        const animation = new NaNimate({
            duration: 5000,
            progressFunction: progress => {
                const rotate = Math.round(360 * progress);

                if (rotate !== this.state.rotate)
                    this.setState({rotate})
            },
            timingFunction: 'linear',
            callback: () => {
                if (!Loader.load) animation.start();
                else if (!this.shortLoader) this.hideLoader();
            }
        });

        animation.start();

        return animation
    }

    componentDidMount() {
        Loader[callbacks].startLoad.forEach(callback => callback());

        this.animation = this.createAnimation();

        window.addEventListener('load', this.load);
    }

    componentWillUnmount() {
        window.removeEventListener('load', this.load)
    }

    static checkLoad() {
        return document.readyState === 'complete'
    }

    hideLoader() {
        if (!this.state.hide) {
            Scroll.leftScrollAllow = true;
            Scroll.rightScrollAllow = true;
            Scroll.callbacksScrollAllow = true;

            this.setState({hide: true});

            Loader[callbacks].startHide.forEach(callback => callback());
        }
    }

    load = () => {
        Loader.load = true;

        Loader[callbacks].finishLoad.forEach(callback => callback());

        if (this.shortLoader)
            this.hideLoader();
    };

    svgAnimationEnd = () => {
        this.hideLoader();
    };

    wrapperTransitionEnd= () => {
        if (this.state.hide) {
            this.setState({mount: false});

            if (this.shortLoader)
                this.animation.stop();

            Loader.mount = false;
            Loader[callbacks].unmount.forEach(callback => callback());
        }
    };

    render() {
        const { hide, mount, rotate } = this.state;

        if (mount) return (
            <div className={styles.wrapper}
                 style={hide ? {opacity: 0} : {}}
                 onTransitionEnd={this.wrapperTransitionEnd}>
                <svg className={styles.loader}
                     viewBox={"61.4 194.3 323.1 187"}
                     style={{transform: `rotate(${rotate}deg)`}}>
                    <polygon fill={MAIN_COLOR_1}
                             transform={`rotate(${rotate * 2} 153.35 226.25)`}
                             points={'183.3,226.3 123.4,194.3 123.4,258.2'}/>
                </svg>
                <div style={hide ? {
                         width: this.radius + 'px',
                         height: this.radius + 'px',
                         animation: 'none'
                     } : {}}
                     className={styles.pulsar} />
            </div>
        );

        return null
    }
}