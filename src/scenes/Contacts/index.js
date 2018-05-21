import React, { Component } from 'react';
import styles from './Contacts.scss';
import BackgroundTitle from '../../compnents/BackgroundTitle';

export default class Contacts extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="container">
                <BackgroundTitle subTitle={'Let\'s do this'}>
                    CONTACTS
                </BackgroundTitle>
            </div>
        )
    }
}