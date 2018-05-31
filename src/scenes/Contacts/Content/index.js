import React from 'react';
import styles from './Content.scss'
import Col from  './Col';

export default function Content(props) {
    const cols = props.data.map(col => <Col key={col.id} data={col}/>);

    return (
        <div className={styles.row}>
            {cols}
        </div>
    )
}