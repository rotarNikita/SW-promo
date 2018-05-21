import React, { PureComponent } from 'react';
import { Redirect } from 'react-router-dom';
import { PAGE_TRANSITION_TIME } from "../../data/constants";
import pages from '../../data/pages';

const CALLBACKS = Symbol('Scroll.callbacks');

export default class Scroll extends PureComponent {
    constructor (props) {
        super(props);

        this.state = {
            page: null
        };

        this.scrollData = {
            allow: true
        };

        this.pathnames = [];

        for (let i = 0; i < pages.length; i++)
            this.pathnames.push(pages[i].link);
    }

    static rightScrollAllow = true;
    static leftScrollAllow = true;
    static callbacksScrollAllow = true;

    static [CALLBACKS] = [];

    static set action(callback) {
        if (this[CALLBACKS].indexOf(callback) === -1 && typeof callback === 'function')
            this[CALLBACKS].push(callback);
        else console.error('this callback has already listened or is not a function');
    }

    static get action() {
        return {
            remove: callback => {
                const callbackIndex = this[CALLBACKS].indexOf(callback);

                if (callbackIndex !== -1)
                    this[CALLBACKS].splice(callbackIndex, 1);
            },
            log: () => console.log(this[CALLBACKS])
        }
    }

    componentDidMount () {
        window.addEventListener('wheel', this.changePage)
    }

    componentWillUnmount () {
        window.removeEventListener('wheel', this.changePage)
    }

    changePage = (event) => {
        if (Scroll.callbacksScrollAllow)
            for (let i = 0; i < Scroll[CALLBACKS].length; i++)
                Scroll[CALLBACKS][i](event);

        if (this.scrollData.allow) {
            this.scrollData.allow = false;
            let timeout = false;

            if (event.deltaY > 0 && Scroll.rightScrollAllow)
                timeout = this.chooseNextPageByChangeType('next');
            else if (event.deltaY < 0 && Scroll.leftScrollAllow)
                timeout = this.chooseNextPageByChangeType('prev');

            if (timeout) setTimeout(() => {
                this.scrollData.allow = true
            }, PAGE_TRANSITION_TIME);
            else this.scrollData.allow = true
        }
    };

    chooseNextPageByChangeType(changeType) {
        const currentPageIndex = this.pathnames.indexOf(window.location.pathname);
        let nextPage = undefined;

        switch (changeType) {
            case 'next': nextPage = this.pathnames[currentPageIndex + 1]; break;
            case 'prev': nextPage = this.pathnames[currentPageIndex - 1]; break;
            default: console.error('not correct changeType: ' + changeType)
        }

        if (nextPage === this.state.page && nextPage !== window.location.pathname) this.setState({
            page: null
        });
        else if (nextPage) this.setState({
            page: nextPage
        });

        return !!nextPage
    }

    render () {
        const { page } = this.state;

        if (page) return <Redirect to={page}/>;
        return null
    }
}
