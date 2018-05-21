import React, { Component } from 'react';
import styles from './Burger.scss';

export default class Burger extends Component {
    constructor (props) {
        super(props);

        this.state = {
            opened: this.props.opened
        }
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            opened: nextProps.opened
        })
    }

    toggle = () => {
        if (this.state.opened) {
            this.props.close();

            this.setState({
                opened: false
            })
        } else {
            this.props.open();

            this.setState({
                opened: true
            })
        }
    };

    render () {
        return (
            <div onClick={this.toggle}
                 id='menuButton'
                 className={`${styles.burger} ${this.state.opened ? styles.opened : ''}`}>
                <div className={styles.lineBefore}/>
                <div className={styles.line} />
                <div className={styles.lineAfter}/>
            </div>
        )
    }
}