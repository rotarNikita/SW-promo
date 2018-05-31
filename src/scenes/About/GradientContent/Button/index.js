import React from 'react';
import styles from './Button.scss';

export default function Button(props) {
    const { children, className, ...restProps } = props;

    return (
        <button className={`${styles.button} ${className ? className : ''}`} {...restProps}>
            <div className={styles.gradientWrapper}>
                <svg viewBox="0 0 100 100"
                     preserveAspectRatio="xMidYMid slice"
                     className={styles.gradient}>
                    <rect x="0"
                          y="0"
                          width="100"
                          height="100"
                          className={styles.rect}/>
                </svg>
            </div>
            {children}
            <div className={styles.textCopy}>
                <span>
                    {children}
                </span>
            </div>
        </button>
    )
}