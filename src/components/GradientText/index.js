import React, { Component } from 'react';
import LinearGradient from './LinearGradient';
import styles from './GradientText.scss';
import StaticDOM from '../StaticDOM';

const DELTA_HEIGHT_FONT_SIZE_MULTIPLIER = 4 / 14;

export default class GradientText extends Component {
    constructor (props) {
        super(props);

        this.width = 0;
        this.height = 0;
    }
    componentWillMount () {
        StaticDOM.add(LinearGradient);
        StaticDOM.render();
    }

    componentDidMount () {
        if (document.readyState === 'complete') this.sizeCalc();
        else window.addEventListener('load', this.sizeCalc)
    }

    componentDidUpdate() {
        this.sizeCalc();
    }

    alignCenterAllTspan() {
        const tspans = this.textBlock.querySelectorAll('tspan');
        const tspanSizes = [];

        for (let i = 0; i < tspans.length; i++)
            tspanSizes.push(tspans[i].textLength.baseVal.value)

        const maxWidth = Math.max.apply(null, tspanSizes);

        for (let i = 0; i < tspanSizes.length; i++) {
            console.log('' + (maxWidth - tspanSizes[i]) / 2);

            tspans[i].setAttribute('x', '' + (maxWidth - tspanSizes[i]) / 2)
        }
    }

    sizeCalc = () => {
        setTimeout(() => {
            const textSize = this.textBlock.getBoundingClientRect();

            const width = textSize.width;
            const height = textSize.height;

            const fontSize = parseInt(getComputedStyle(this.textBlock).fontSize, 10);

            const dHeight = fontSize * DELTA_HEIGHT_FONT_SIZE_MULTIPLIER;

            this.SVGBlock.setAttribute('width', width + 'px');
            this.SVGBlock.setAttribute('height', height + 'px');

            this.SVGBlock.setAttribute('viewBox', `0 0 ${width} ${height}`);

            this.textBlock.setAttribute('transform', `translate(0 ${fontSize - dHeight})`);

            if (this.props.alignCenter) this.alignCenterAllTspan();
        }, 15)
    };

    render () {
        const textClass = this.props.textClass || '';

        return (
            <div className={styles.wrapper}>
                <svg ref={SVGBlock => this.SVGBlock = SVGBlock}
                     width="0"
                     height="0"
                     className={styles.svg}>
                    <text className={styles.text + ' ' + textClass}
                          ref={textBlock => this.textBlock = textBlock}>
                        {this.props.children}
                    </text>
                </svg>
            </div>
        )
    }
}