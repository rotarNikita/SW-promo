import React, { Component } from   'react';
import styles from './Footer.scss';
import TitleNext from './TitleNext';
import Email from './Email';
import pages from '../../data/pages';
import TitlePrev from './TitlePrev';
import BottomLink from './BottomLink';

export default class Footer extends Component {
    constructor (props) {
        super(props);

        this.state = {
            nextPage: undefined,
            prevPage: undefined,
            currentPage: undefined
        };

        this.history = []
    }

    componentWillMount () {
        setTimeout(() => this.currentPage());
    }

    shouldComponentUpdate () {
        const { currentPage } = this.state;

        return currentPage ? window.location.pathname !== currentPage.link : true;
    }

    componentWillUpdate () {
        this.currentPage();
    }

    currentPage () {
        const { location } = window;

        let nextPage;
        let prevPage;
        let currentPage;

        for (let i = 0; i < pages.length; i++) {
            if (pages[i].link === location.pathname) {
                nextPage = pages[i + 1];
                prevPage = pages[i - 1];
                currentPage = pages[i];
                break;
            }
        }

        this.historyRegistration(currentPage);
        this.setState({ nextPage, prevPage, currentPage })
    };

    historyRegistration (currentPage) {
        const { history } = this;

        if (history[history.length - 1] !== currentPage)
            history.push(currentPage);

        if (history.length > 2) history.shift();
    }

    render () {
        const { prevPage, nextPage, currentPage } = this.state;
        const { history } = this;

        const historyPrevPage = history[history.length - 2];

        return (
            <footer className={'container ' + styles.footer}>
                <div id="footer-left">
                    <Email mount={currentPage ? currentPage.link === '/' : false}/>
                    {prevPage &&
                    <TitlePrev prevPage={prevPage}
                               currentPage={currentPage}
                               historyPrevPage={historyPrevPage}/>}
                </div>
                <div id="footer-center">
                    <BottomLink mount={currentPage ? currentPage.link === '/about' : false}>Наши партнеры</BottomLink>
                </div>
                <div id="footer-right">
                    {nextPage &&
                    <TitleNext nextPage={nextPage}
                               historyPrevPage={historyPrevPage}
                               currentPage={currentPage}/>}
                </div>
            </footer>
        )
    }
}