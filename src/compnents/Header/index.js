import React, { Component } from 'react';
import styles from './Header.scss';
import { MENU_TRANSITION_TIME } from "../../data/constants";
import Burger from './Burger';
import Menu from './Menu';
import HeaderLogo from './HeaderLogo';
import glitch from "../HOCs/glitch";
import { Link } from 'react-router-dom';
import PageTitle from './PageTitle';
import Scroll from '../../actions/Scroll';

const GlitchHeaderLogo = glitch(HeaderLogo, {
    classNames: {
        glitchWrapper: styles.logoFloatRight
    },
    onlyOnHover: true
});

export default class Header extends Component {
    constructor () {
        super();

        this.state = {
            opened: false
        };
    }

    open = () => {
        Scroll.leftScrollAllow = false;
        Scroll.rightScrollAllow = false;
        Scroll.callbacksScrollAllow = false;

        this.setState({
            opened: true
        })
    };

    close = () => {
        Scroll.leftScrollAllow = true;
        Scroll.rightScrollAllow = true;
        Scroll.callbacksScrollAllow = true;

        this.setState({
            opened: false
        })
    };

    componentDidUpdate () {
        this.checkHeight()
    }

    componentDidMount () {
        this.checkHeight()
    }

    checkHeight () {
        clearTimeout(this.animTimeout);

        if (this.state.opened) {
            this.header.style.height = '100%'
        } else {
            this.animTimeout = setTimeout(() => {
                this.header.style.height = 'auto'
            }, MENU_TRANSITION_TIME)
        }
    }

    render () {
        const { opened } = this.state;

        return (
            <header ref={header => this.header = header}
                    className={styles.header + ' ' + (opened ? styles.open : '')}>
                <div className="container clearfix" style={{position: 'relative'}}>
                    <Burger opened={opened}
                            open={this.open}
                            close={this.close}/>
                    <PageTitle active={opened}/>
                    <Link to="/" onClick={this.close}>
                        <GlitchHeaderLogo opened={opened} close={this.close}/>
                    </Link>
                    <div id="headerRight"/>
                </div>
                <Menu opened={opened} close={this.close}/>
            </header>
        )
    }
}