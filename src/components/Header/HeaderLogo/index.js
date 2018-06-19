import React, { Component } from 'react';
import styles from './HeaderLogo.scss';
import HeaderLogoDefs from './HeaderLogoDefs';
import StaticDOM from '../../StaticDOM';
import { MENU_TRANSITION_TIME, HEADER_LOGO_SVG_DEF_ID } from "../../../data/constants";

export default class HeaderLogo extends Component {
    componentWillMount () {
        StaticDOM.add(HeaderLogoDefs);
        StaticDOM.render();
    }

    componentDidMount () {
        this.checkVisibility();
    }

    componentDidUpdate () {
        this.checkVisibility();
    }

    checkVisibility () {
        setTimeout(this.animTimeout);

        if (this.props.opened) {
            this.logoWrapper.style.display = 'block';
            this.animTimeout = setTimeout(() => {
                this.logoWrapper.style.opacity = 1;
            })
        } else {
            this.logoWrapper.style.opacity = 0;
            this.animTimeout = setTimeout(() => {
                this.logoWrapper.style.display = 'none';
            }, MENU_TRANSITION_TIME);
        }
    }

    render () {
        return (
            <div ref={logoWrapper => this.logoWrapper = logoWrapper}
                 className={styles.logo}>
                <svg width={82} height={48}>
                    <use href={`#${HEADER_LOGO_SVG_DEF_ID}`} xlinkHref={`#${HEADER_LOGO_SVG_DEF_ID}`} />
                </svg>
            </div>
        )
    }
}