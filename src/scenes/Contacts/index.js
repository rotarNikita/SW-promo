import React, { Component } from 'react';
import styles from './Contacts.scss';
import ContactsButton from './ContactsButton';
import BackgroundTitle from '../../components/BackgroundTitle';
import { COLS } from "../../data/contactsContent";
import Content from './Content';
import Form from './Form';
import Lng from '../../components/Header/Menu/Lng';

export default class Contacts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showForm: false
        }
    }

    componentDidMount() {
        Lng.relativeComponentOrCallback = this;
    }

    toggleFormVisibility = () => {
        this.setState(prevState => ({showForm: !prevState.showForm}))
    };

    componentWillUnmount() {
        Lng.relativeComponentOrCallback.remove(this);
    }

    render() {
        const { showForm } = this.state;
        const currentPage = window.location.pathname === '/contacts';

        return (
            <div className="container">
                <BackgroundTitle subTitle={'Let\'s do this'}>
                    CONTACTS
                </BackgroundTitle>
                <Content data={COLS()}/>
                <ContactsButton onClick={!showForm ? this.toggleFormVisibility : null} mount={currentPage}>
                    {({rus: 'Начать проект', eng: 'Discuss the project'})[Lng.currentLng]}
                </ContactsButton>
                <Form mount={showForm && currentPage} close={showForm ? this.toggleFormVisibility : null}/>
            </div>
        )
    }
}