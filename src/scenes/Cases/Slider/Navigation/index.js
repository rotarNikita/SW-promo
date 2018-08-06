import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import styles from './Navigation.scss';
import NavItem from './NavItem';
import MQC from '../../../../actions/MediaQueryChecker';

export default class Navigation extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            show: props.mount,
            size: 'M'
        };

        if (window.innerWidth > 1200) this.state.size = 'M';
        else this.state.size = 'S';

        this.container = document.createElement('div');

        this.MQCIDs = MQC.addResizeChecker({
            from: 1201,
            callback: this.setState.bind(this, {size: 'M'})
        }, {
            to: 1200,
            callback: this.setState.bind(this, {size: 'S'})
        })
    }

    componentDidMount() {
        document.getElementById('headerRight').appendChild(this.container);

        setTimeout(() => {
            this.forceUpdate();
        }, 15)
    }

    componentWillUnmount() {
        document.getElementById('headerRight').removeChild(this.container);

        MQC.removeResizeChecker(this.MQCIDs);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.mount) this.setState({show: true})
    }

    animationEnd = () => {
        if (!this.props.mount) this.setState({show: false})
    };

    renderSizeM({ mount, slides, currentSlide, dotClick }) {
        const content = slides.map((slide, i) => <NavItem key={slide.props.data.id}
                                                          onClick={dotClick.bind(null, i)}
                                                          slide={slide}
                                                          active={i === currentSlide} />);

        const addingClass = mount ? styles.slideLeft : styles.slideRight;

        return (
            <ul className={`${styles.list} ${addingClass}`} onAnimationEnd={this.animationEnd}>
                {content}
            </ul>
        )
    }

    renderSizeS({ mount, slides, currentSlide }) {
        const { length } = slides;
        const addingClass = mount ? styles.slideLeft : styles.slideRight;

        return (
            <div className={`${styles.counter} ${addingClass}`} onAnimationEnd={this.animationEnd}>
                {currentSlide + 1}/{length}
            </div>
        )
    }

    render() {
        const { show, size } = this.state;

        if (show) return ReactDOM.createPortal(this[`renderSize${size}`](this.props), this.container);

        return null;
    }
}