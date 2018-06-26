import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './MenuItem.scss';
import Lng from "../Lng";
import glitch from '../../../HOCs/glitch';

export default class MenuItem extends Component {
    constructor (props) {
        super(props);

        this.x1 = undefined;
        this.x2 = undefined;
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
        return this.props.location !== nextProps.location
    }

    positionCalc = () => {
        setTimeout(() => {
            this.x1 = this.linkWrapper.offsetLeft;
            this.x2 = this.x1 + this.linkWrapper.offsetWidth;

            this.getDefaultMenuItemPosition();
        }, 30)
    };

    componentWillUnmount() {
        Lng.relativeComponentOrCallback.remove(this);
        Lng.relativeComponentOrCallback.remove(this.positionCalc);
    }

    componentDidMount () {
        Lng.relativeComponentOrCallback = this;
        Lng.relativeComponentOrCallback = this.positionCalc;

        if (document.readyState === 'complete') this.positionCalc();
        else window.addEventListener('load', this.positionCalc)
    }

    componentDidUpdate () {
        this.getDefaultMenuItemPosition();
    }

    render () {
        const { exact, close, to, children, setActiveMenuItemPosition, toggleGradient } = this.props;

        const element = () => (
            <React.Fragment>
                <span>{children}</span>
                <div className={styles.inner}>
                    {children}
                </div>
            </React.Fragment>
        );

        const GlitchElement = glitch(element, {
            onlyOnHover: true
        });

        return (
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
        )
    }
}