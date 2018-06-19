import React, { Component } from 'react';
import styles from './Button.scss';
import LinearGradient from "../GradientText/LinearGradient";
import StaticDOM from "../StaticDOM";

export default class Button extends Component {
    componentDidMount() {
        StaticDOM.add(LinearGradient);
        StaticDOM.render();
    }

    render() {
        const { children, className, ...restProps } = this.props;

        return (
            <button className={`${styles.button} ${className ? className : ''}`} {...restProps}>
                {children}
                <div className={styles.textCopy}>
                <span>
                    {children}
                </span>
                </div>
                <svg viewBox="0 0 100 100"
                     preserveAspectRatio="xMidYMid slice"
                     className={styles.gradient}>
                    <rect x="0"
                          y="0"
                          width="100"
                          height="100"
                          className={styles.rect}/>
                </svg>
            </button>
        )
    }
}