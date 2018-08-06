import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import styles from './Next.scss';

export default class Next extends PureComponent {
    constructor (props) {
        super(props);

        this.state = {
            show: false
        };

        this.el = document.createElement('div');
        Object.assign(this.el.style, {
            position: 'absolute',
            right: 0,
            top: 0,
            whiteSpace: 'nowrap'
        });
    }

    animationEnd = () => {
        if (!this.props.mount) {
            this.setState({show: false});
        }
    };

    componentWillUnmount() {
        document.getElementById('footer-right').removeChild(this.el)
    }

    componentWillReceiveProps (nextProps) {
        setTimeout(() => {
            if (nextProps.mount && !this.state.show) {
                this.setState({show: true});
                document.getElementById('footer-right').appendChild(this.el)
            }
        });
    }

    render () {
        const { mount, ...restProps } = this.props;
        const { show } = this.state;

        const className = styles.text + ' ' + (mount ? styles.open : styles.close);

        if (show) return ReactDOM.createPortal(
            <div {...restProps}
                 className={className}
                 onTransitionEnd={this.animationEnd}>
                {this.props.children}
            </div>
            , this.el);

        return null
    }
}

