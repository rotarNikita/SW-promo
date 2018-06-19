import React, { Component } from 'react';
import pages from '../../../data/pages';
import styles from './PageTitle.scss';
import Lng from '../Menu/Lng';

export default class PageTitle extends Component {
    constructor(props) {
        super(props);

        const currentPageIndex = PageTitle.currentPageIndex();
        const animateClass = PageTitle.checkAnimationClass();

        this.state = {
            currentPageIndex,
            animateClass
        };

        this.prevPageIndex = undefined;
    }

    static currentPageIndex () {
        const { pathname } = window.location;

        for (let i = 0; i < pages.length; i++)
            if (pages[i].link === pathname)
                return i;

        return undefined
    }

    static checkAnimationClass (currentPageIndex, prevPageIndex) {
        if (currentPageIndex === undefined || prevPageIndex === undefined)
            return styles.slideDown;

        if (currentPageIndex > prevPageIndex)
            return styles.nextPage;

        if (currentPageIndex < prevPageIndex)
            return styles.prevPage;

        return ''
    }

    componentDidMount() {
        Lng.relativeComponentOrCallback = this
    }

    componentWillUnmount() {
        Lng.relativeComponentOrCallback.remove(this)
    }

    shouldComponentUpdate (nextProps, nextState) {
        if (this.state.currentPageIndex !== undefined)
            return window.location.pathname !== pages[this.state.currentPageIndex].link ||
                nextProps.active !== this.props.active ||
                nextState.animateClass !== this.state.animateClass;

        return true
    }

    componentWillUpdate () {
        const currentPageIndex = PageTitle.currentPageIndex();
        const animateClass = PageTitle.checkAnimationClass(currentPageIndex, this.prevPageIndex);

        this.setState({
            currentPageIndex,
            animateClass
        })
    }

    removeAnimationClass = () => {
        this.setState({
            animateClass: ''
        })
    };

    render () {
        const { currentPageIndex, animateClass } = this.state;
        const { active } = this.props;

        this.prevPageIndex = currentPageIndex;

        return (
            <div id="pageTitle" onAnimationEnd={this.removeAnimationClass}
                 className={styles.title + ' ' + (active ? styles.active : '') + ' ' + animateClass}>
                {currentPageIndex !== undefined ? pages[currentPageIndex].text : 'Такой страныца нэту'}
            </div>
        )
    }

}