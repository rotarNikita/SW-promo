import React, { Component } from 'react';
import styles from './HeaderLogo.scss';
import HeaderLogoDefs from './HeaderLogoDefs';
import StaticDOM from '../../StaticDOM';
import { NavLink } from 'react-router-dom';
import glitch from '../../HOCs/glitch';
import { HEADER_LOGO_SVG_DEF_ID } from "../../../data/constants";
import MQC from '../../../actions/MediaQueryChecker';

export default class HeaderLogo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: props.mount,
            width: window.innerWidth > 768 ? 82 : 41,
            height: window.innerWidth > 768 ? 48 : 24
        };

        this.MQCIDs = MQC.addResizeChecker({
            from: 769,
            callback: () => {
                this.setState({
                    width: 82,
                    height: 48
                })
            }
        }, {
            to: 768,
            callback: () => {
                this.setState({
                    width: 41,
                    height: 24
                })
            }
        })
    }

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
        const { show, width, height } = this.state;
        const { mount } = this.props;

        const logoClassName = [styles.logo, mount ? styles.slideLeft : styles.slideRight].join(' ');

        const SVGElement = () => (
            <svg width={width} height={height}>
                <use href={`#${HEADER_LOGO_SVG_DEF_ID}`} xlinkHref={`#${HEADER_LOGO_SVG_DEF_ID}`} />
            </svg>
        );

        const GlitchWrapper = MQC.isTouchDevice ? SVGElement : glitch(SVGElement, {
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