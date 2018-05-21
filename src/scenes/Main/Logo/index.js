import React, { Component } from 'react';
import HeaderLogoDefs from '../../../compnents/Header/HeaderLogo/HeaderLogoDefs';
import glitch from '../../../compnents/HOCs/glitch';
import StaticDOM from '../../../compnents/StaticDOM';
import { HEADER_LOGO_SVG_DEF_ID } from "../../../data/constants";
import styles from './Logo.scss';


class Logo extends Component {
    constructor (props) {
        super(props);

        this.state = {
            update: false
        }
    }

    componentWillMount () {
        StaticDOM.add(HeaderLogoDefs);
        StaticDOM.render();
    }

    componentDidMount () {
        setTimeout(() => {
            this.props.checkLogoSize(this.svg.width.baseVal.value, this.svg.height.baseVal.value)
        });
    }

    render () {
        return (
            <svg ref={svg => this.svg = svg} className={styles.logo}>
                <defs>
                    <mask id="main-logo-mask">
                        <use xlinkHref={`#${HEADER_LOGO_SVG_DEF_ID}`} href={`#${HEADER_LOGO_SVG_DEF_ID}`}/>
                    </mask>
                </defs>
                <use xlinkHref={`#${HEADER_LOGO_SVG_DEF_ID}`} href={`#${HEADER_LOGO_SVG_DEF_ID}`}/>

                <g mask="url(#main-logo-mask)">
                    {this.props.children}
                </g>
            </svg>
        )
    }
}

export default glitch(Logo, {
    classNames: {
        glitchWrapper: styles.glitchWrapper,
        glitchElement: styles.glitchElement,
        glitchAfter: styles.glitchAfter,
        glitchBefore: styles.glitchBefore
    }
});