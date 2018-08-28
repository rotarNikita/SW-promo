import generateKey from '../../generals/generateKey';
import Lng from '../../components/Header/Menu/Lng';
import Loader from '../../components/Loader';

const slidesData = [
    {
        id: generateKey(),
        get text() {
            return ({
                ru: 'Наша работа приносит нам удовольствие, помимо этого  мы все следуем  одной цели - сделать лучшее для клиента. SW agency - больше, чем работа, это, прежде всего, наш образ жизни.',
                en: 'SW Agency is people. We build and innovate.' +
                    '<br/>' +
                    '<br/>' +
                    '26 young professionals with 7 years of experience that work with joy and passion.'
            })[Lng.currentLng]
        },
        title: 'SW AGENCY',
        get name() {
            return ({
                ru: 'Сороченко Олег, CEO',
                en: 'Oleg, CEO'
            })[Lng.currentLng]
        },
        img: require('./oleg.jpg')
    },
    {
        id: generateKey(),
        text: 'Head of international department',
        get name() {
            return ({
                ru: 'Геннадий Белый, Co-Founder',
                en: 'Gennady, Co-Founder'
            })[Lng.currentLng]
        },
        img: require('./genka.jpg')
    },
    {
        id: generateKey(),
        get text() {
            return ({
                ru: 'В ответе за всех кого приручила',
                en: 'The most responsible'
            })[Lng.currentLng]
        },
        get name() {
            return ({
                ru: 'Арина Чабанова, Deputy CEO',
                en: 'Arina, Deputy CEO'
            })[Lng.currentLng]
        },
        img: require('./arina.jpg')
    },
    {
        id: generateKey(),
        get text() {
            return ({
                ru: 'Любит говорить по телефону',
                en: 'Life and soul of our office'
            })[Lng.currentLng]
        },
        get name() {
            return ({
                ru: 'Черкез Алла, Sales Partner',
                en: 'Alla, Sales Partner'
            })[Lng.currentLng]
        },
        img: require('./alla.jpg')
    },
    {
        id: generateKey(),
        get text() {
            return ({
                ru: 'Самый везучий',
                en: 'The wolf from Wall Street'
            })[Lng.currentLng]
        },
        get name() {
            return ({
                ru: 'Масюк Даниэль, Sales Partner',
                en: 'Daniel, Sales Partner'
            })[Lng.currentLng]
        },
        img: require('./danya.jpg')
    },
    {
        id: generateKey(),
        get text() {
            return ({
                ru: 'Приносит печеньки и управляет проектами',
                en: 'Takes care of projects and chocolate chip cookies '
            })[Lng.currentLng]
        },
        get name() {
            return ({
                ru: 'Мизина Анжелика, Project Manager',
                en: 'Anjelica, Project Manager',
            })[Lng.currentLng]
        },
        img: require('./ang.jpg')
    },
    {
        id: generateKey(),
        get text() {
            return ({
                ru: 'Играется со шрифтами',
                en: 'Knows any font and color'
            })[Lng.currentLng]
        },
        get name() {
            return ({
                ru: 'Марина Рубан, UI/UX Designer',
                en: 'Marina, UI/UX Designer'
            })[Lng.currentLng]
        },
        img: require('./marina.jpg')
    },
    {
        id: generateKey(),
        get text() {
            return ({
                ru: 'Не любит jQuery',
                en: 'Dosn\'t like jQuery'
            })[Lng.currentLng]
        },
        get name() {
            return ({
                ru: 'Ротарь Никита, Head of Front-end',
                en: 'Nikita, Head of Front-end'
            })[Lng.currentLng]
        },
        img: require('./nikita.jpg')
    },
    {
        id: generateKey(),
        get text() {
            return ({
                ru: 'Не брезгует PHP',
                en: 'PHP monster'
            })[Lng.currentLng]
        },
        get name() {
           return ({
               ru: 'Шкапенко Леша, Head of Back-end',
               en: 'Alex, Head of Back-end'
           })[Lng.currentLng]
        },
        img: require('./alex.jpg')
    },
    {
        id: generateKey(),
        get text() {
            return ({
                ru: 'Подсела на Flex и Grid',
                en: 'Flex and Grid addict'
            })[Lng.currentLng]
        },
        get name() {
            return ({
                ru: 'Тесля Анна, Star of Front-end',
                en: 'Anna, Star of Front-end',
            })[Lng.currentLng]
        },
        img: require('./anya.jpg')
    },
    {
        id: generateKey(),
        get text() {
            return ({
                ru: 'Big Data Architect',
                en: 'Big Data Architect'
            })[Lng.currentLng]
        },
        get name() {
            return ({
                ru: 'Копельчук Сергей, Star of Back-end',
                en: 'Sergei, Star of Back-end'
            })[Lng.currentLng]
        },
        img: require('./serg.jpg')
    },
    {
        id: generateKey(),
        get text() {
            return ({
                ru: 'Любит экспериментировать',
                en: 'Increases a site speed'
            })[Lng.currentLng]
        },
        get name() {
            return ({
               ru: 'Марга Игорь, Star of Front-end',
               en: 'Igor, Star of Front-end'
            })[Lng.currentLng]
        },
        img: require('./ihor.jpg')
    }
];

Loader.addListener('startLoad', () => {
    slidesData.forEach(slide => {
        const image = new Image();
        image.src = slide.img;
    });
});

export default slidesData;