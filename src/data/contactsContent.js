import Lng from '../components/Header/Menu/Lng';

export const COLS = () => ({
    ru: [
        {
            id: 0,
            title: 'Основной',
            mail: 'info@sw-agency.net',
            tel: '+38 (063) 344-45-51'
        },
        {
            id: 1,
            title: 'Отдел продаж Одесса',
            mail: 'yav@sw-agency.net',
            tel: '+38 (063) 344-45-51',
            address: 'Украина, Одесса<br>ул. Базарная, 56'
        },
        {
            id: 2,
            title: 'Отдел продаж Канада',
            mail: 'info@sw-agency.net',
            tel: '+38 (063) 344-45-51',
            address: 'Canada, City<br>St. Blabla, 56'
        },
        {
            id: 3,
            title: 'Отдел продаж Эстония',
            mail: 'info@sw-agency.net',
            tel: '+38 (063) 344-45-51',
            address: 'Canada, City<br>St. Blabla, 56'
        }
    ],
    en: [
        {
            id: 0,
            title: 'Canada',
            mail: 'h.b@sw.agency',
            tel: '+1 226 973 9035',
            address: '1235 Richmond St.<br/>London, ON N6A 3L5'
        },
        {
            id: 1,
            title: 'Estonia',
            mail: 'h.b@sw.agency',
            tel: '+1 226 973 9035',
            address: 'Sepapaja tn 6<br/>Tallinn, 15551'
        }
    ]
})[Lng.currentLng];