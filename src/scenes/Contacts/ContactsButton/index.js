import ReactDOM from "react-dom";
import React, { PureComponent } from "react";
import Button from '../../../components/Button';
import styles from './ContactsButton.scss';
import MQC from '../../../actions/MediaQueryChecker';

export default class ContactsButton extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            show: true,
            mouseDown: false,
            portal: window.innerWidth > 425
        };

        this.container = document.createElement('div');

        this.MQCIDs = MQC.addResizeChecker({
            callback: () => this.setState({portal: window.innerWidth > 425})
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.mount) this.setState({show: true})
    }

    componentDidMount() {
        document.getElementById('footer-right').appendChild(this.container);
    }

    componentWillUnmount() {
        document.getElementById('footer-right').removeChild(this.container);

        MQC.removeResizeChecker(this.MQCIDs)
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
        const { show, mouseDown, portal } = this.state;

        const mountAnimation = mount ? styles.slideLeft : styles.slideRight;
        const mouseDownClass = mouseDown ? styles.mouseDown : '';

        const button = (
            <Button onAnimationEnd={this.animationEnd}
                    onMouseDown={this.mouseDown}
                    onMouseUp={this.mouseUp}
                    onMouseLeave={this.mouseUp}
                    className={`${styles.button} ${mountAnimation} ${mouseDownClass}`}
                    {...restProps}>
                {children}
            </Button>
        );

        if (show) return portal ?
            ReactDOM.createPortal(button, this.container) :
            button;

        return null
    }
}