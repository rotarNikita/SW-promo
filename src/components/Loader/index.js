import React, { Component } from 'react';
import styles from './Loader.scss';
import { MAIN_COLOR_1 } from "../../data/constants";
import Scroll from '../../actions/Scroll';

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
    }

    static [callbacks] = {
        startLoad: [],
        finishLoad: [],
        showMessage: [],
        startHide: [],
        unmount: [],
    };

    static load = false;
    static mount = true;

    state = {
        load: false,
        showMsg: false,
        hide: false,
        mount: true
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
        Scroll.leftScrollAllow = true;
        Scroll.rightScrollAllow = true;
        Scroll.callbacksScrollAllow = true;

        this.setState({hide: true});

        Loader[callbacks].startHide.forEach(callback => callback());
    }

    load = () => {
        this.setState({load: true});
        Loader.load = true;

        Loader[callbacks].finishLoad.forEach(callback => callback());

        if (this.shortLoader)
            this.hideLoader();
    };

    svgAnimationEnd = () => {
        if (!this.state.showMsg)
            Loader[callbacks].showMessage.forEach(callback => callback());

        this.setState({showMsg: true});
    };

    clickOnPulse = () => {
        if (this.state.showMsg) {
            this.hideLoader();
        }
    };

    wrapperTransitionEnd= () => {
        if (this.state.hide) {
            this.setState({mount: false});

            Loader.mount = false;
            Loader[callbacks].unmount.forEach(callback => callback());
        }
    };

    render() {
        const { load, showMsg, hide, mount } = this.state;

        const pulsarClasses = [styles.pulsar, showMsg ? styles.showClick : undefined].join(' ');

        if (mount) return (
            <div className={styles.wrapper}
                 style={hide ? {opacity: 0} : {}}
                 onTransitionEnd={this.wrapperTransitionEnd}>
                <svg className={styles.loader}
                     onAnimationEnd={this.shortLoader ? null : this.svgAnimationEnd}
                     style={load ? {animationIterationCount: this.animationIterationCount} : {}}>
                    <defs>
                        <symbol id="loader-symbol" viewBox={"61.4 194.3 323.1 187"}>
                            <polygon style={load ? {animationIterationCount: this.animationIterationCount * 2} : {}}
                                     className={styles.polygon}
                                     fill={MAIN_COLOR_1}
                                     points={'183.3,226.3 123.4,194.3 123.4,258.2'}/>
                        </symbol>
                    </defs>
                    <use xlinkHref="#loader-symbol" href="#loader-symbol"/>
                </svg>
                <div onClick={this.clickOnPulse}
                     style={hide ? {
                         width: this.radius + 'px',
                         height: this.radius + 'px',
                         animation: 'none'
                     } : {}}
                     className={pulsarClasses} />
            </div>
        );

        return null
    }
}