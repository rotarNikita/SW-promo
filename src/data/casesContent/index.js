import generateKey from '../../generals/generateKey';

export const VIDEOS = [
    {
        id: generateKey(),
        title: 'Гефест',
        link: '#',
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
        link: 'http://lawyers.com.ua/',
        sources: [
            {
                type: 'video/mp4',
                src: require('./APgotmp4.mp4')
            }
        ]
    },
    {
        id: generateKey(),
        title: 'Комплимент',
        link: 'http://compliment.ua/',
        sources: [
            {
                type: 'video/mp4',
                src: require('./komplimentgot1.mp4')
            }
        ]
    },
    {
        id: generateKey(),
        title: 'Стандарт-Оил',
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
        title: 'Skad',
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
        link: 'http://polishchukproject.com/',
        sources: [
            {
                type: 'video/mp4',
                src: require('./ppmp4.mp4')
            }
        ]
    }
];