import React from 'react';
import styles from './TextBlock.scss';

export default function TextBlock (props) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <p className={styles.title}>{props.title}</p>
                <p className={styles.text}>{props.text}</p>
            </div>
        </div>
    )
}