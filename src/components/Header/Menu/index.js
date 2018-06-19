import React, { Component } from 'react';
import MenuItem from './MenuItem';
import { Route } from 'react-router-dom';
import styles from './Menu.scss';
import pages from '../../../data/pages';
import BallCanvas from './BallCanvas';
import Socials from './Socials';
import Mail from './Mail';
import Lng from './Lng';

export default class Menu extends Component {
    constructor (props) {
        super(props);

        this.state = {
            toggleGradient: false,
            hoverMenuItemPositionStart: undefined,
            hoverMenuItemPositionEnd: undefined,
            defaultMenuItemPositionStart: undefined,
            defaultMenuItemPositionEnd: undefined
        }
    }

    componentDidMount() {
        Lng.relativeComponentOrCallback = this;
    }

    componentWillUnmount() {
        Lng.relativeComponentOrCallback.remove(this);
    }

    toggleGradient = () => {
        this.setState(prevState => ({toggleGradient: !prevState.toggleGradient}))
    };

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

    render() {
        const { hoverMenuItemPositionStart, hoverMenuItemPositionEnd, toggleGradient } = this.state;
        const { opened } = this.props;

        const menuWrapperClassName = [
            styles.menuWrapper,
            opened ? styles.opened : undefined,
            toggleGradient ? styles.toggleGradient : undefined
        ].filter(item => !!item);

        const menuClassName = [styles.menu, opened ? styles.opened : undefined];

        const bottomMenuWrapperClassName = [
            'container',
            styles.bottom,
            opened ? styles.opened : undefined
        ];

        return (
            <div className={menuWrapperClassName.join(' ')}>
                <nav ref={nav => this.nav = nav} className={menuClassName.join(' ')}>
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
                                              toggleGradient={this.toggleGradient}
                                              to={page.link}>
                                        {page.text}
                                    </MenuItem>
                                )
                            })}
                        </ul>
                    }/>
                    <BallCanvas x1={hoverMenuItemPositionStart} x2={hoverMenuItemPositionEnd}/>
                </nav>

                <div className={bottomMenuWrapperClassName.join(' ')}>
                    <Mail/>
                    <Socials/>
                </div>

                <Lng mount={opened}/>
            </div>
        )
    }
}