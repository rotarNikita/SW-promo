import React, { PureComponent } from 'react';
import styles from './Socials.scss';
import socialsData from './socialsData';


export default class Socials extends PureComponent {
    constructor(props) {
        super(props);
    }

    socials = socialsData.map(item => <li className={styles.listItem} key={item.id}>
        <a href={item.href}
           className={styles.link}
           style={{
               maskImage: `url(${item.image})`,
               WebkitMaskImage: `url(${item.image})`,
           }} />
    </li>);

    render() {
        return (
            <ul className={styles.list}>
                {this.socials}
            </ul>
        )
    }
}