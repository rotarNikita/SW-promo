import React, { Component } from 'react';
import styles from './Lng.scss';
import { createPortal } from 'react-dom';
import lngData from './lngData';

const allLngRelativeComponentsOrCallbacks = Symbol('Lng.allLngRelativeComponentsOrCallbacks');
const currentLng = Symbol('Lng.currentLng');

export default class Lng extends Component {
    constructor(props) {
        super(props);

        const currentLng = window.navigator.language.substr(0, 2).toLowerCase();
        const languageIndex = lngData.indexOf(currentLng) !== -1 ? lngData.indexOf(currentLng) : 1;

        this.state = {
            show: this.props.mount,
            currentLanguage: lngData[languageIndex]
        };

        Lng.currentLng = lngData[languageIndex];
    }
    
    static [allLngRelativeComponentsOrCallbacks] = [];

    static set currentLng(val) {
        this[currentLng] = val;

        this.relativeComponentOrCallback.update();
    }

    static get currentLng() {
        return this[currentLng]
    }
    
    static set relativeComponentOrCallback(component) {
        if (this[allLngRelativeComponentsOrCallbacks].indexOf(component) === -1)
            this[allLngRelativeComponentsOrCallbacks].push(component);
    };

    static get relativeComponentOrCallback() {
        return {
            remove: component => {
                const index = this[allLngRelativeComponentsOrCallbacks].indexOf(component);
                
                if (index !== -1) this[allLngRelativeComponentsOrCallbacks].splice(index, 1)
            },
            update: () => {
                this[allLngRelativeComponentsOrCallbacks].forEach(component => {
                    try {
                        component.forceUpdate()
                    } catch(e) {
                        component()
                    }
                })
            }
        }
    }

    wrapper = document.createElement('div');

    componentWillReceiveProps(nextProps) {
        if (nextProps.mount) this.setState({show: true})
    }

    chooseLng = currentLanguage => {
        this.setState({currentLanguage});

        Lng.currentLng = currentLanguage;
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