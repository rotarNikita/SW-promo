import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import styles from './Navigation.scss';
import NavItem from './NavItem'

export default class Navigation extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            show: props.mount
        };

        this.container = document.createElement('div');
    }

    componentDidMount() {
        document.getElementById('headerRight').appendChild(this.container);

        setTimeout(() => {
            this.forceUpdate();
        }, 15)
    }

    componentWillUnmount() {
        document.getElementById('headerRight').removeChild(this.container)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.mount) this.setState({show: true})
    }

    animationEnd = () => {
        if (!this.props.mount) this.setState({show: false})
    };

    render() {
        const { show } = this.state;
        const { mount, slides, currentSlide, dotClick } = this.props;

        const content = slides.map((slide, i) => <NavItem key={slide.props.data.id}
                                                          onClick={dotClick.bind(null, i)}
                                                          slide={slide}
                                                          active={i === currentSlide} />);

        const addingClass = mount ? styles.slideLeft : styles.slideRight;

        if (show) return ReactDOM.createPortal(
            <ul className={`${styles.list} ${addingClass}`} onAnimationEnd={this.animationEnd}>
                {content}
            </ul>, this.container
        );

        return null;
    }
}