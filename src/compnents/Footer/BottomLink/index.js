import React, { Component } from 'react';
import styles from './BottomLink.scss';

export default class BottomLink extends Component {
    constructor (props) {
        super(props);

        this.state = {
            show: false
        }
    }

    animationEnd = () => {
        if (!this.props.mount) this.setState({ show: false })
    };

    componentWillReceiveProps (nextProps) {
        if (nextProps.mount) this.setState({show: true});
    }

    render () {
        const { show } = this.state;
        const { mount } = this.props;

        if (show) return (
            <div className={styles.text + (!mount ? ' ' + styles.close : '')} onAnimationEnd={this.animationEnd}>
                {this.props.children}
            </div>
        );

        return null
    }


}