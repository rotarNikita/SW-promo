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
            ru: 'Главная',
            en: 'Main'
        })[Lng.currentLng]},
        exact: true,
        template: Main
    },
    {
        id: 2,
        link: '/service',
        get text() {return ({
            ru: 'Услуги',
            en: 'Services'
        })[Lng.currentLng]},
        template: Service
    },
    {
        id: 1,
        link: '/about',
        get text() {return ({
            ru: 'О студии',
            en: 'About Us'
        })[Lng.currentLng]},
        template: About
    },
    {
        id: 3,
        link: '/cases',
        get text() {return ({
            ru: 'Кейсы',
            en: 'Portfolio'
        })[Lng.currentLng]},
        template: Cases
    },
    {
        id: 4,
        link: '/contacts',
        get text() {return ({
            ru: 'Контакты',
            en: 'Contacts'
        })[Lng.currentLng]},
        template: Contacts
    }
]