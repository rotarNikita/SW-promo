import React, { Component } from 'react';
import styles from './Loader.scss';
import { MAIN_COLOR_1 } from "../../data/constants";
import Scroll from '../../actions/Scroll';
import NaNimate from '../../generals/NaNimate';

const callbacks = Symbol('Loader.callbacks');

export default class Loader extends Component {
    constructor(props) {
        super(props);

        this.animationIterationCount = 0;
        this.addAnimationIterationCount();

        Scroll.leftScrollAllow = false;
        Scroll.rightScrollAllow = false;
        Scroll.callbacksScrollAllow = false;

        this.radius = Math.sqrt(window.innerWidth * window.innerWidth + window.innerHeight * window.innerHeight);

        this.shortLoader = window.location.pathname !== '/';

        this.triangleAnimation = null;
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
        load: false,
        showMsg: false,
        hide: false,
        mount: true,

        triangleRotate: 0
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

    addAnimationIterationCount = () => {
        if (!Loader.checkLoad()) {
            this.animationIterationCount++;

            setTimeout(this.addAnimationIterationCount, 5000)
        }
    };

    createTriangleAnimation() {
        const animation = new NaNimate({
            duration: 2500,
            progressFunction: progress => {
                const triangleRotate = Math.round(360 * progress);

                if (triangleRotate !== this.state.triangleRotate)
                    this.setState({triangleRotate})
            },
            timingFunction: 'linear',
            callback: () => {
                animation.start();
            }
        });

        animation.start();

        return animation
    }

    componentDidMount() {
        Loader[callbacks].startLoad.forEach(callback => callback());

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

            if (!this.shortLoader)
                this.triangleAnimation.stop(false, true);


            this.setState({hide: true});

            Loader[callbacks].startHide.forEach(callback => callback());
        }
    }

    load = () => {
        this.setState({load: true});
        Loader.load = true;

        Loader[callbacks].finishLoad.forEach(callback => callback());

        if (this.shortLoader)
            this.hideLoader();
    };

    svgAnimationStart = () => {
        this.triangleAnimation = this.createTriangleAnimation();
    };

    svgAnimationEnd = () => {
        this.hideLoader();
    };

    wrapperTransitionEnd= () => {
        if (this.state.hide) {
            this.setState({mount: false});

            if (this.shortLoader)
                this.triangleAnimation.stop(false, true);

            Loader.mount = false;
            Loader[callbacks].unmount.forEach(callback => callback());
        }
    };

    render() {
        const { load, hide, mount, triangleRotate } = this.state;

        if (mount) return (
            <div className={styles.wrapper}
                 style={hide ? {opacity: 0} : {}}
                 onTransitionEnd={this.wrapperTransitionEnd}>
                <svg className={styles.loader}
                     viewBox={"61.4 194.3 323.1 187"}
                     onAnimationEnd={this.shortLoader ? null : this.svgAnimationEnd}
                     onAnimationStart={this.svgAnimationStart}
                     style={load ? {animationIterationCount: this.animationIterationCount} : {}}>
                    <polygon fill={MAIN_COLOR_1}
                             transform={`rotate(${triangleRotate} 153.35 226.25)`}
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