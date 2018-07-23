import React, { Component } from 'react';
import styles from './Ticker.scss';
import { MAIN_PAGE_TEXT } from '../../../data/constants';
import Lng from '../../../components/Header/Menu/Lng';
import generateKey from '../../../generals/generateKey';
import MQC from '../../../actions/MediaQueryChecker';

const DELTA_Y_PARALLAX = 15;
const DELTA_X_PARALLAX = 15;

export default class Ticker extends Component {
    constructor(props) {
        super(props);

        this.tickerTimeout = null;
    }

    state = {
        textData: {},
        deltaY: 0,
        deltaX: 0
    };

    addText = () => {
        const textIndex = Math.floor(Math.random() * MAIN_PAGE_TEXT.data.length);

        const depth = Math.random();

        const id = generateKey();
        const text = MAIN_PAGE_TEXT.data[textIndex];
        const top = Math.random() * 100 + '%';
        const animationDuration = MAIN_PAGE_TEXT.animationDurationRange[0] + (1 - depth) * (MAIN_PAGE_TEXT.animationDurationRange[1] - MAIN_PAGE_TEXT.animationDurationRange[0]) + 'ms';
        const fontSize = MAIN_PAGE_TEXT.fontSizeRange[0] + depth * (MAIN_PAGE_TEXT.fontSizeRange[1] - MAIN_PAGE_TEXT.fontSizeRange[0]) + 'px';
        const animationEnd = this.createAnimationEndFunctionByID(id);

        this.setState(prevState => {
            prevState.textData[id] = {text, animationDuration, fontSize, animationEnd, top, depth};

            return {textData: prevState.textData}
        })
    };

    textMove = ({ clientX, clientY, beta, gamma }) => {
        let deltaX;
        let deltaY;

        if (typeof beta === 'number' && typeof gamma === 'number') {
            deltaY = (-Math.abs(beta) / 180 - 1) * 2 * DELTA_Y_PARALLAX;
            deltaX = (-gamma / 180) * 2 * DELTA_X_PARALLAX;
        } else {
            deltaY = (-clientY / window.innerHeight - 1) * 2 * DELTA_Y_PARALLAX;
            deltaX = (-clientX / window.innerWidth - 1) * 2 * DELTA_X_PARALLAX;
        }

        this.setState({
            deltaX,
            deltaY
        })
    };

    createAnimationEndFunctionByID(id) {
        return () => {
            this.setState(prevState => {
                delete prevState.textData[id];

                return {textData: prevState.textData}
            })
        }
    }

    static calcIntensityTicker() {
        // 3000ms - 1366px
        return 3000 * 1366 / window.innerWidth
    }

    startTicker = () => {
        this.addText();

        requestAnimationFrame(() => {
           this.tickerTimeout = setTimeout(this.startTicker, Ticker.calcIntensityTicker())
        })
    };

    finishTicker() {
        clearTimeout(this.tickerTimeout);
    }

    componentDidMount() {
        Lng.relativeComponentOrCallback = this;

        if (MQC.isTouchDevice)
            window.addEventListener('deviceorientation', this.textMove);
        else
            window.addEventListener('mousemove', this.textMove);

        this.startTicker();
    }

    componentWillUnmount() {
        Lng.relativeComponentOrCallback.remove(this);

        window.removeEventListener('mousemove', this.textMove);
        window.removeEventListener('deviceorientation', this.textMove);

        this.finishTicker();
    }

    render() {
        const { textData, deltaY, deltaX } = this.state;

        return (
            <div className={styles.wrapper} style={{}}>
                {Object.keys(textData).map(key => {
                    const { animationEnd, text, depth, ...inlineStyles } = textData[key];

                    return (
                        <div key={key}
                             style={{
                                 ...inlineStyles,
                                 transform: `translate(${depth * deltaX}px, ${depth * deltaY}px)`
                             }}
                             onAnimationEnd={animationEnd}
                             className={styles.text}>
                            {text}
                        </div>
                    )
                })}
            </div>
        )
    }
}