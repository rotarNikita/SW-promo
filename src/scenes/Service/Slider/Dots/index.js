import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import styles from './Dots.scss';
import MQC from '../../../../actions/MediaQueryChecker';

export default class Dots extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            showNumbers: window.innerWidth >= 426
        };

        this.container = document.createElement('div');

        this.MQCIDs = MQC.addResizeChecker({
            to: 425,
            callback: () => {
                this.setState({showNumbers: false})
            }
        },
        {
            from: 426,
            callback: () => {
                this.setState({showNumbers: true})
            }
        })
    }

    componentWillUnmount() {
        MQC.removeResizeChecker(this.MQCIDs);
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
        const { show, showNumbers } = this.state;
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
            <div className={className}
                 style={{paddingBottom: !showNumbers ? '10px' : 0}}
                 onAnimationEnd={this.animationEnd}>
                <ul>
                    {dots}
                </ul>
                {showNumbers && <div className={styles.numbers}>
                    {current + length}
                </div>}
            </div>
            , this.container
        );

        return null
    }
}

