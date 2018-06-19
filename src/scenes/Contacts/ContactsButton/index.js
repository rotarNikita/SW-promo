import ReactDOM from "react-dom";
import React, { PureComponent } from "react";
import Button from '../../../components/Button';
import styles from './ContactsButton.scss';

export default class ContactsButton extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            show: true,
            mouseDown: false
        };

        this.container = document.createElement('div')
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.mount) this.setState({show: true})
    }

    componentDidMount() {
        document.getElementById('footer-right').appendChild(this.container);
    }

    componentWillUnmount() {
        document.getElementById('footer-right').removeChild(this.container);
    }

    animationEnd = () => {
        if (!this.props.mount) this.setState({show: false})
    };

    mouseDown = () => {
        this.setState({mouseDown: true});
    };

    mouseUp = () => {
        this.setState({mouseDown: false});
    };

    render() {
        const { children, mount, ...restProps } = this.props;
        const { show, mouseDown } = this.state;

        const mountAnimation = mount ? styles.slideLeft : styles.slideRight;
        const mouseDownClass = mouseDown ? styles.mouseDown : '';

        if (show) return ReactDOM.createPortal(
            <Button onAnimationEnd={this.animationEnd}
                    onMouseDown={this.mouseDown}
                    onMouseUp={this.mouseUp}
                    onMouseLeave={this.mouseUp}
                    className={`${styles.button} ${mountAnimation} ${mouseDownClass}`}
                    {...restProps}>
                {children}
            </Button>,
            this.container
        );

        return null
    }
}