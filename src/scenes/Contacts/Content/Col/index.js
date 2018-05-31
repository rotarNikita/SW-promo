import React from 'react';
import styles from './Col.scss'

export default function Col(props) {
    const { title, mail, tel, address } = props.data;

    return (
        <div className={styles.col}>
            <h3 className={styles.title}>{title}</h3>
            <a href={`mailto:${mail}`} className={styles.mail}>{mail}</a>
            <br/>
            <a href={`tel:${tel}`} className={styles.tel}>{tel}</a>
            <p className={styles.address} dangerouslySetInnerHTML={{__html: address}}/>
        </div>
    )
}