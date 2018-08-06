import generateKey from '../../generals/generateKey';
import Lng from '../../components/Header/Menu/Lng';
import Loader from "../../components/Loader";

export const VIDEOS = [
    {
        id: generateKey(),
        get title() {
          return ({
              ru: 'СТРОИТЕЛЬНАЯ КОМПАНИЯ «ГЕФЕСТ»',
              en: 'Construction company Gefest'
          })[Lng.currentLng]
        },
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
        get title() {
            return ({
                ru: 'Центр косметологии «КОМПЛИМЕНТ»',
                en: 'Beauty center "Compliment"'
            })[Lng.currentLng]
        },
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
        get title() {
            return ({
                ru: 'СТАНДАРТ ОИЛ УКРАИНА',
                en: 'Standart Oil - Ukraine'
            })[Lng.currentLng]
        },
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
        get title() {
            return ({
                ru: 'Интернет-магазин «СКАД»',
                en: 'Online Store "Skad"'
            })[Lng.currentLng]
        },
        subtitle: 'Design, Development',
        link: 'http://skad.in.ua/',
        sources: [
            // {
            //     type: 'video/mp4',
            //     src: require('./Nokian1.mp4')
            // },
            {
                type: 'image/gif',
                src: require('./nokian111.gif')
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
        get title() {
            return ({
                ru: 'АГЕНТСТВО НЕДВИЖИМОСТИ «СЛОН»',
                en: 'Real Estate Agency "Elefant"'
            })[Lng.currentLng]
        },
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
        get title() {
            return ({
                ru: 'Ресторан «MOONDEER»',
                en: 'Restaurant "Moondeer"'
            })[Lng.currentLng]
        },
        subtitle: 'Design, Development, Сorporate identity',
        link: 'moon.swagency.xyz',
        sources: [
            // {
            //     type: 'video/mp4',
            //     src: require('./moondeer.mp4')
            // },
            {
                type: 'image/gif',
                src: require('./moonder1.gif')
            }
        ]
    },
    {
        id: generateKey(),
        get title() {
            return ({
                ru: 'СТРОИТЕЛЬНАЯ КОМПАНИЯ «DOMIRA»',
                en: 'Construction company Domira'
            })[Lng.currentLng]
        },
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
        get title() {
            return ({
                ru: 'Портал недвижимости «VAN.UA»',
                en: 'Real estate portal "VAN.ua"'
            })[Lng.currentLng]
        },
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

Loader.addListener('startLoad', () => {
    VIDEOS.forEach(video => {
        const videoDOM = document.createElement('video');
        const image = new Image();

        video.sources.forEach(src => {
            if (/video/.test(src.type)) {
                const sourceDOM = document.createElement('source');

                sourceDOM.setAttribute('type', src.type);
                sourceDOM.src = src.src;

                videoDOM.appendChild(sourceDOM);
            } else if (/image/.test(src.type))
                image.src = src.src;
        });

        videoDOM.load();
    })
});