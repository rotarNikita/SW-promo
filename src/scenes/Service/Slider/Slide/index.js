import React from 'react';
import styles from './Slide.scss'

export default function Slide(props) {
    const list = props.list.map((item, index) => (<li key={index} className={styles.listItem}>{item}</li>));

    let slideNumber = props.slideNumber + 1;
    slideNumber = (slideNumber + '').length >= 2 ? slideNumber : '0' + slideNumber;

    return (
        <div className={styles.wrapper}>
            <div className={styles.content}>
                <h3 className={styles.title}>
                    <span className={styles.num}>{slideNumber}</span>
                    {props.title}
                </h3>

                <ul>
                    {list}
                </ul>
            </div>
        </div>
    )
}