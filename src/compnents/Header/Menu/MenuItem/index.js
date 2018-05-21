import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import GradientText from '../../../GradientText';
import styles from './MenuItem.scss';

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

    componentDidMount () {
        if (document.readyState === 'complete') this.positionCalc();
        else window.addEventListener('load', this.positionCalc)
    }

    componentDidUpdate () {
        this.getDefaultMenuItemPosition();
    }

    render () {
        const { exact, close, to, children, setActiveMenuItemPosition } = this.props;

        return (
            <li className={styles.item}>
                <NavLink exact={exact}
                         onClick={close}
                         to={to}
                         activeClassName={styles.active}>
                    <div ref={linkWrapper => this.linkWrapper = linkWrapper}
                         style={{lineHeight: 0}}
                         onMouseEnter={this.getHoverMenuItemPosition}
                         onMouseLeave={setActiveMenuItemPosition}>
                        <GradientText textClass={styles.text}>
                            {children}
                        </GradientText>
                    </div>
                </NavLink>
            </li>
        )
    }
}