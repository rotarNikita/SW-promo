import React, { Component } from 'react';
import styles from './Lng.scss';
import { createPortal } from 'react-dom';
import lngData from './lngData';

export default class Lng extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        show: this.props.mount,
        currentLanguage: lngData[0]
    };

    wrapper = document.createElement('div');

    componentWillReceiveProps(nextProps) {
        if (nextProps.mount) this.setState({show: true})
    }

    chooseLng = currentLanguage => {
        this.setState({currentLanguage})
    };

    componentDidMount() {
        document.getElementById('headerRight').appendChild(this.wrapper);
    }

    componentWillUnmount() {
        document.getElementById('headerRight').removeChild(this.wrapper);
    }

    static createTextAnimation(text) {
        const deltaDuration = 100;

        return Array.prototype.map.call(text, (char, index) => (
            <span style={{transitionDelay: `${index * deltaDuration}ms`}}
                  key={index}
                  className={styles.char}>
                {char}
            </span>)
        )
    }

    transitionEnd = () => {
        if (!this.props.mount)
            this.setState({show: false})
    };

    render() {
        const { show, currentLanguage } = this.state;
        const { mount } = this.props;

        const languages = lngData.map((item, index) => (
            <li className={[styles.lngItem, currentLanguage === item ? styles.active : undefined].join(' ')}
                onClick={this.chooseLng.bind(null, item)}
                key={index}>
                {Lng.createTextAnimation(item)}
            </li>
        ));

        const listClassNames = [styles.lngList, mount ? styles.opened : undefined].join(' ');

        if (show) return createPortal(
            <ul className={listClassNames} onTransitionEnd={this.transitionEnd}>
                {languages}
            </ul>,
            this.wrapper
        );

        return null
    }
}