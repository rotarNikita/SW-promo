import Main from '../scenes/Main';
import About from '../scenes/About';
import Service from '../scenes/Service';
import Cases from '../scenes/Cases';
import Contacts from '../scenes/Contacts';

export default [
    {
        id: 0,
        link: '/',
        text: 'Главная',
        exact: true,
        template: Main
    },
    {
        id: 2,
        link: '/service',
        text: 'Услуги',
        template: Service
    },
    {
        id: 1,
        link: '/about',
        text: 'О студии',
        template: About
    },
    {
        id: 3,
        link: '/cases',
        text: 'Кейсы',
        template: Cases
    },
    {
        id: 4,
        link: '/contacts',
        text: 'Контакты',
        template: Contacts
    }
]