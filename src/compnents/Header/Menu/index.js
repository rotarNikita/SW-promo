import React, { Component } from 'react';
import MenuItem from './MenuItem';
import { Route } from 'react-router-dom';
import styles from './Menu.scss';
import pages from '../../../data/pages';
import BallCanvas from './BallCanvas';
import { MENU_TRANSITION_TIME } from "../../../data/constants";

export default class Menu extends Component {
    constructor (props) {
        super(props);

        this.state = {
            hoverMenuItemPositionStart: undefined,
            hoverMenuItemPositionEnd: undefined,
            defaultMenuItemPositionStart: undefined,
            defaultMenuItemPositionEnd: undefined
        }
    }

    componentDidMount () {
        this.toggleVisible();
    }

    componentDidUpdate () {
        this.toggleVisible();
    }

    toggleVisible () {
        clearTimeout(this.animTimeout);

        if (this.props.opened) {
            this.nav.style.height = 'auto'
        } else {
            this.animTimeout = setTimeout(() => {
                this.nav.style.height = '0';
            }, MENU_TRANSITION_TIME)
        }
    }

    setHoverMenuItemPosition = (x1, x2) => {
        this.setState({
            hoverMenuItemPositionStart: x1,
            hoverMenuItemPositionEnd: x2,
        })
    };

    setDefaultMenuItemPosition = (x1, x2) => {
        this.setState({
            hoverMenuItemPositionStart: x1,
            hoverMenuItemPositionEnd: x2,
            defaultMenuItemPositionStart: x1,
            defaultMenuItemPositionEnd: x2
        })
    };

    setActiveMenuItemPosition = () => {
        this.setState({
            hoverMenuItemPositionStart: this.state.defaultMenuItemPositionStart,
            hoverMenuItemPositionEnd: this.state.defaultMenuItemPositionEnd
        })
    };

    render () {
        const { hoverMenuItemPositionStart, hoverMenuItemPositionEnd } = this.state;

        return (
            <nav ref={nav => this.nav = nav} className={`${styles.menu} ${this.props.opened ? styles.opened : ''}`}>
                <Route render={({ location }) =>
                    <ul className={styles.list}>
                        {pages.map((page) => {
                            return (
                                <MenuItem location={location.pathname}
                                          key={page.id}
                                          setHoverMenuItemPosition={this.setHoverMenuItemPosition}
                                          setDefaultMenuItemPosition={this.setDefaultMenuItemPosition}
                                          setActiveMenuItemPosition={this.setActiveMenuItemPosition}
                                          close={this.props.close}
                                          exact={!!page.exact}
                                          to={page.link}>
                                    {page.text}
                                </MenuItem>
                            )
                        })}
                    </ul>
                }/>
                <BallCanvas x1={hoverMenuItemPositionStart} x2={hoverMenuItemPositionEnd}/>
            </nav>
        )
    }
}