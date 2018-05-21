import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import styles from './Dots.scss';

export default class Dots extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            show: false
        };

        this.container = document.createElement('div');
    }

    componentDidMount() {
        setTimeout(this.show, 15)
    }

    show = () => {
        if (this.props.mount) {
            this.setState({ show: true });
            document.getElementById('footer-right').appendChild(this.container);
        }
    };

    animationEnd = () => {
        if (!this.props.mount) {
            this.setState({ show: false });
            document.getElementById('footer-right').removeChild(this.container);
        }

    };

    render() {
        const { show } = this.state;
        const { sliderLength, goTo, currentSlide, mount } = this.props;

        const length = sliderLength > 9 ? sliderLength : ' / 0' + sliderLength;
        const current = currentSlide + 1;
        const className = styles.dots + (mount ?  '' : ' ' + styles.hide);

        const dots = [];
        for (let i = 0; i < sliderLength; i++) {
            let addingClass = ' ';

            if (i === currentSlide) addingClass += styles.active;

            dots.push((<li className={styles.dot + addingClass}
                           key={i}
                           onMouseDown={event => event.stopPropagation()}
                           onClick={() => goTo(i)}/>))
        }

        if (show) return ReactDOM.createPortal(
            <div className={className} onAnimationEnd={this.animationEnd}>
                <ul>
                    {dots}
                </ul>
                <div className={styles.numbers}>
                    {current + length}
                </div>
            </div>
            , this.container
        );

        return null
    }
}

