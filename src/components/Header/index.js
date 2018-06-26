import React, { Component } from 'react';
import styles from './Header.scss';
import Burger from './Burger';
import Menu from './Menu';
import HeaderLogo from './HeaderLogo';
import PageTitle from './PageTitle';
import Scroll from '../../actions/Scroll';

const openCallback = Symbol('Symbol.openCallback');
const closeCallback = Symbol('Symbol.closeCallback');

export default class Header extends Component {
    constructor (props) {
        super(props);

        this.state = {
            opened: false
        };
    }

    static [openCallback] = [];

    static set openCallback(val) {
        if (typeof val === 'function' && this[openCallback].indexOf(val) === -1)
            this[openCallback].push(val)
    }

    static get openCallback() {
        return {
            remove: val => {
                const index = this[openCallback].indexOf(val);

                if (index !== -1) this[openCallback].splice(index, 1);
            }
        }
    }

    static [closeCallback] = [];

    static set closeCallback(val) {
        if (typeof val === 'function' && this[closeCallback].indexOf(val) === -1)
            this[closeCallback].push(val)
    }

    static get closeCallback() {
        return {
            remove: val => {
                const index = this[closeCallback].indexOf(val);

                if (index !== -1) this[closeCallback].splice(index, 1);
            }
        }
    }

    open = () => {
        Scroll.leftScrollAllow = false;
        Scroll.rightScrollAllow = false;
        Scroll.callbacksScrollAllow = false;

        this.setState({
            opened: true
        });

        Header[openCallback].forEach(callback => callback())
    };

    close = () => {
        Scroll.leftScrollAllow = true;
        Scroll.rightScrollAllow = true;
        Scroll.callbacksScrollAllow = true;

        this.setState({
            opened: false
        });

        Header[closeCallback].forEach(callback => callback())
    };

    render () {
        const { opened } = this.state;

        const headerLogoMount = ['/service', '/about', '/contacts'].indexOf(window.location.pathname) > -1 && !opened;

        return (
            <header ref={header => this.header = header}
                    className={styles.header}>
                <div className={`container clearfix ${styles.container}`}>
                    <Burger opened={opened}
                            open={this.open}
                            close={this.close}/>
                    <PageTitle active={opened}/>
                    <div id="headerRight">
                        <HeaderLogo mount={headerLogoMount}/>
                    </div>
                </div>
                <Menu opened={opened} close={this.close}/>
            </header>
        )
    }
}