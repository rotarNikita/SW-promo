import React, { Component } from 'react';
import styles from './HeaderLogo.scss';
import HeaderLogoDefs from './HeaderLogoDefs';
import StaticDOM from '../../StaticDOM';
import { NavLink } from 'react-router-dom';
import glitch from '../../HOCs/glitch';
import { MENU_TRANSITION_TIME, HEADER_LOGO_SVG_DEF_ID } from "../../../data/constants";

export default class HeaderLogo extends Component {
    constructor(props) {
        super(props)
    }

    state = {
        show: this.props.mount
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.mount) this.setState({show: true})
    }

    componentWillMount () {
        StaticDOM.add(HeaderLogoDefs);
        StaticDOM.render();
    }

    animationEnd = () => {
        if (!this.props.mount) this.setState({show: false})
    };

    render () {
        const { show } = this.state;
        const { mount } = this.props;

        const logoClassName = [styles.logo, mount ? styles.slideLeft : styles.slideRight].join(' ');

        const GlitchWrapper = glitch(() => (
            <svg width={82} height={48}>
                <use href={`#${HEADER_LOGO_SVG_DEF_ID}`} xlinkHref={`#${HEADER_LOGO_SVG_DEF_ID}`} />
            </svg>), {
                onlyOnHover: true
            }
        );

        if (show) return (
            <div className={logoClassName} onAnimationEnd={this.animationEnd}>
                <NavLink to="/">
                    <GlitchWrapper/>
                </NavLink>
            </div>
        );

        return null
    }
}