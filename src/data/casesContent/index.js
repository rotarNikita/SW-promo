import generateKey from '../../generals/generateKey';

export const VIDEOS = [
    {
        id: generateKey(),
        title: 'СТРОИТЕЛЬНАЯ КОМПАНИЯ «ГЕФЕСТ»',
        subtitle: 'Design, Development',
        link: false,
        sources: [
            {
                type: 'image',
                src: require('./gefest-2.jpg')
            }
        ]
    },
    {
        id: generateKey(),
        title: 'ALEXANDROV & PARTNERS',
        subtitle: 'Design, Development, Motion',
        link: 'http://lawyers.com.ua/',
        sources: [
            {
                type: 'video/mp4',
                src: require('./ap1.mp4')
            }
        ]
    },
    {
        id: generateKey(),
        title: 'Центр косметологии «КОМПЛИМЕНТ»',
        subtitle: 'Design, Development',
        link: 'http://compliment.ua/',
        sources: [
            {
                type: 'video/mp4',
                src: require('./kompliment1.mp4')
            }
        ]
    },
    {
        id: generateKey(),
        title: 'СТАНДАРТ ОИЛ УКРАИНА',
        subtitle: 'Design, Development',
        link: 'http://lubeoil1.com.ua/',
        sources: [
            {
                type: 'video/mp4',
                src: require('./mobil.mp4')
            }
        ]
    },
    {
        id: generateKey(),
        title: 'Интернет-магазин «СКАД»',
        subtitle: 'Design, Development',
        link: 'http://skad.in.ua/',
        sources: [
            {
                type: 'video/mp4',
                src: require('./Nokian1.mp4')
            }
        ]
    },
    {
        id: generateKey(),
        title: 'Polishchuk & Projects',
        subtitle: 'Design, Development, Сorporate identity',
        link: 'http://polishchukproject.com/',
        sources: [
            {
                type: 'video/mp4',
                src: require('./polishuk1.mp4')
            }
        ]
    },
    {
        id: generateKey(),
        title: 'АГЕНТСТВО НЕДВИЖИМОСТИ  «СЛОН»',
        subtitle: 'Design, Development, Сorporate identity',
        link: 'http://anslon.com.ua/',
        sources: [
            {
                type: 'video/mp4',
                src: require('./slon1.mp4')
            }
        ]
    },
    {
        id: generateKey(),
        title: 'Ресторан «MOONDEER»',
        subtitle: 'Design, Development, Сorporate identity',
        link: 'moon.swagency.xyz',
        sources: [
            {
                type: 'video/mp4',
                src: require('./moondeer.mp4')
            }
        ]
    },
    {
        id: generateKey(),
        title: 'СТРОИТЕЛЬНАЯ КОМПАНИЯ «DOMIRA»',
        subtitle: 'Design, Development',
        link: 'http://domira.com.ua/',
        sources: [
            {
                type: 'video/mp4',
                src: require('./domira1.mp4')
            }
        ]
    },
    {
        id: generateKey(),
        title: 'Портал недвижимости «VAN.UA»',
        subtitle: 'MANAGEMENT, Marketing, Сorporate identity',
        link: 'https://van.ua/',
        sources: [
            {
                type: 'video/mp4',
                src: require('./van1.mp4')
            }
        ]
    }
];