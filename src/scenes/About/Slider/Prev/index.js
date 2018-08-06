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
        Object.assign(this.el.style, {
            position: 'absolute',
            left: 0,
            top: 0,
            whiteSpace: 'nowrap'
        });
    }

    static defaultProps = {
        needAnimationState: true
    };

    animationEnd = () => {
        let state = {animation: false};

        if (!this.props.mount) {
            state.show = false;
            state.animation = true;
        }

        this.setState(state)
    };

    componentWillUnmount() {
        const parent = document.getElementById('footer-left');

        if (parent.contains(this.el)) parent.removeChild(this.el)
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.mount && !this.state.show) {
            this.setState({ show: true });
            document.getElementById('footer-left').appendChild(this.el);
        }
    }

    render () {
        const { mount, needAnimationState, ...restProps } = this.props;
        const { show, animation } = this.state;

        let className;
        if (needAnimationState) className = styles.text + ' ' + (mount ? animation ? styles.open : '' : styles.close);
        else className = styles.text + ' ' + (mount ? styles.open : styles.close);

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