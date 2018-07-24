import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './MenuItem.scss';
import Lng from "../Lng";
import glitch from '../../../HOCs/glitch';
import MQC from '../../../../actions/MediaQueryChecker';

export default class MenuItem extends Component {
    constructor (props) {
        super(props);

        this.x1 = undefined;
        this.x2 = undefined;

        this.MQCIDs = MQC.addResizeChecker({
            callback: () => {
                this.forceUpdate();
            }
        });
    }

    getHoverMenuItemPosition = () => {
        this.props.setHoverMenuItemPosition(this.x1, this.x2);
    };

    getDefaultMenuItemPosition () {
        if (this.linkWrapper.parentNode.classList.contains(styles.active)) {
            this.props.setDefaultMenuItemPosition(this.x1, this.x2);
        }
    }

    shouldComponentUpdate (nextProps) {
        const { location, children } = this.props;

        return location !== nextProps.location || children !== nextProps.children
    }

    positionCalc = () => {
        clearTimeout(this._positionCalcTimeout);

        this._positionCalcTimeout = setTimeout(() => {
            this.x1 = window.innerWidth >= 1201 ?
                this.linkWrapper.offsetLeft :
                this.linkWrapper.offsetTop;

            this.x2 = this.x1 + (window.innerWidth >= 1201 ?
                this.linkWrapper.offsetWidth :
                this.linkWrapper.offsetHeight);

            this.getDefaultMenuItemPosition();
        }, 30)
    };

    componentWillUnmount() {
        Lng.relativeComponentOrCallback.remove(this);
        Lng.relativeComponentOrCallback.remove(this.positionCalc);

        MQC.removeResizeChecker(this.MQCIDs);
    }

    componentDidMount () {
        Lng.relativeComponentOrCallback = this;
        Lng.relativeComponentOrCallback = this.positionCalc;

        if (document.readyState === 'complete') this.positionCalc();
        else window.addEventListener('load', this.positionCalc)
    }

    componentDidUpdate () {
        this.positionCalc();
    }

    render () {
        const { exact, close, to, children, setActiveMenuItemPosition, toggleGradient } = this.props;

        const element = () => (
            <React.Fragment>
                <span>{children}</span>
                {!MQC.isTouchDevice && <div className={styles.inner}>
                    {children}
                </div>}
            </React.Fragment>
        );

        const GlitchElement = MQC.isTouchDevice ? element : glitch(element, {
            onlyOnHover: true
        });

        return (
            <React.Fragment>
                <li className={styles.item}>
                    <NavLink exact={exact}
                             onClick={close}
                             to={to}
                             className={styles.link}
                             activeClassName={styles.active}>
                        <div ref={linkWrapper => this.linkWrapper = linkWrapper}
                             className={styles.shadow}
                             onMouseEnter={() => {
                                 this.getHoverMenuItemPosition();
                                 toggleGradient();
                             }}
                             onMouseLeave={setActiveMenuItemPosition}>
                            <GlitchElement/>
                        </div>
                    </NavLink>
                </li>
                <br/>
            </React.Fragment>
        )
    }
}