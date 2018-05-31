import React, { Component } from 'react';
import styles from './Contacts.scss';
import ContactsButton from './ContactsButton';
import BackgroundTitle from '../../compnents/BackgroundTitle';
import { COLS } from "../../data/contactsContent";
import Content from './Content';
import Form from './Form';

export default class Contacts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showForm: false
        }
    }

    toggleFormVisibility = () => {
        this.setState(prevState => ({showForm: !prevState.showForm}))
    };

    render() {
        const { showForm } = this.state;
        const currentPage = window.location.pathname === '/contacts';

        return (
            <div className="container">
                <BackgroundTitle subTitle={'Let\'s do this'}>
                    CONTACTS
                </BackgroundTitle>
                <Content data={COLS}/>
                <ContactsButton onClick={!showForm ? this.toggleFormVisibility : null} mount={currentPage}>
                    Начать проект
                </ContactsButton>
                <Form mount={showForm && currentPage} close={showForm ? this.toggleFormVisibility : null}/>
            </div>
        )
    }
}