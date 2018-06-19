import Main from '../scenes/Main';
import About from '../scenes/About';
import Service from '../scenes/Service';
import Cases from '../scenes/Cases';
import Contacts from '../scenes/Contacts';

import Lng from '../components/Header/Menu/Lng'

export default [
    {
        id: 0,
        link: '/',
        get text() {return ({
            rus: 'Главная',
            eng: 'Main'
        })[Lng.currentLng]},
        exact: true,
        template: Main
    },
    {
        id: 2,
        link: '/service',
        get text() {return ({
            rus: 'Услуги',
            eng: 'Services'
        })[Lng.currentLng]},
        template: Service
    },
    {
        id: 1,
        link: '/about',
        get text() {return ({
            rus: 'О студии',
            eng: 'About Us'
        })[Lng.currentLng]},
        template: About
    },
    {
        id: 3,
        link: '/cases',
        get text() {return ({
            rus: 'Кейсы',
            eng: 'Portfolio'
        })[Lng.currentLng]},
        template: Cases
    },
    {
        id: 4,
        link: '/contacts',
        get text() {return ({
            rus: 'Контакты',
            eng: 'Contacts'
        })[Lng.currentLng]},
        template: Contacts
    }
]