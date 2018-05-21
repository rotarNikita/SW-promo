import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import styles from './Prev.scss'

export default class Prev extends PureComponent {
    constructor (props) {
        super(props);

        this.state = {
            show: false,
            animation: true
        };

        this.el = document.createElement('div');
    }

    animationEnd = () => {
        let state = {animation: false};

        if (!this.props.mount) {
            state.show = false;
            state.animation = true;
            document.getElementById('footer-left').removeChild(this.el)
        }

        this.setState(state)
    };

    componentWillReceiveProps (nextProps) {
        if (nextProps.mount) {
            this.setState({ show: true });
            document.getElementById('footer-left').appendChild(this.el);
        }
    }

    render () {
        const { mount, ...restProps } = this.props;
        const { show, animation } = this.state;

        const className = styles.text + ' ' + (mount ? animation ? styles.open : '' : styles.close);

        if (show) return ReactDOM.createPortal(
            <div {...restProps}
                 className={className}
                 onAnimationEnd={this.animationEnd}>
                {this.props.children}
            </div>
            , this.el);

        return null
    }
}