import React, { Component } from 'react';
import ContactsButton from './ContactsButton';
import BackgroundTitle from '../../components/BackgroundTitle';
import { COLS } from "../../data/contactsContent";
import Content from './Content';
import Form from './Form';
import Lng from '../../components/Header/Menu/Lng';
import MQC from '../../actions/MediaQueryChecker';

export default class Contacts extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showForm: false,
            subtitle: window.innerWidth > 748
        };

        this.MQCIDs = MQC.addResizeChecker({
            callback: () => this.setState({subtitle: window.innerWidth > 748})
        })
    }

    componentDidMount() {
        Lng.relativeComponentOrCallback = this;
    }

    toggleFormVisibility = () => {
        this.setState(prevState => ({showForm: !prevState.showForm}))
    };

    componentWillUnmount() {
        Lng.relativeComponentOrCallback.remove(this);

        MQC.removeResizeChecker(this.MQCIDs)
    }

    render() {
        const { showForm, subtitle } = this.state;
        const currentPage = window.location.pathname === '/contacts';

        return (
            <div className="container">
                <BackgroundTitle subTitle={subtitle ? 'Let\'s do this' : ''}>
                    CONTACTS
                </BackgroundTitle>
                <Content data={COLS()}/>
                <ContactsButton onClick={!showForm ? this.toggleFormVisibility : null} mount={currentPage}>
                    {({ru: 'Начать проект', en: 'Discuss the project'})[Lng.currentLng]}
                </ContactsButton>
                <Form mount={showForm && currentPage} close={showForm ? this.toggleFormVisibility : null}/>
            </div>
        )
    }
}