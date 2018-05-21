import React, { Component } from 'react';
import GradientText from '../../GradientText';
import styles from './Email.scss';

export default class Email extends Component {
    constructor (props) {
        super(props);

        this.state = {
            show: false
        }
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.mount) this.setState({show: true})
    }

    animationEnd = () => {
        if (!this.props.mount) this.setState({show: false})
    };

    render () {
        const { mount } = this.props;
        const { show } = this.state;

        if (show) return (
            <div className={styles.wrapper + (!mount ? ' ' + styles.close : '')} onAnimationEnd={this.animationEnd}>
                <a href="mailto:info@sw-agency.net">
                    <GradientText textClass={styles.mailText}>
                        info@sw-agency.net
                    </GradientText>
                </a>
            </div>
        );

        return null
    }
}