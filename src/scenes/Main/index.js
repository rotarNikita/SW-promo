import React, { PureComponent } from 'react';
import Logo from './Logo';
import styles from './Main.scss';
import Ticker from './Ticker';

export default class Main extends PureComponent {
    constructor (props) {
        super(props)
    }

    render () {
        return (
            <section className={styles.wrapper}>
                <Ticker/>
                <Logo/>
            </section>
        )
    }
}