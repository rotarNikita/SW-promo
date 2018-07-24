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
        name: 'Сороченко Олег, CEO',
        img: require('./oleg.jpg')
    },
    {
        id: generateKey(),
        text: 'Head of international department',
        name: 'Геннадий Белый, Co-Founder',
        img: require('./genka.jpg')
    },
    {
        id: generateKey(),
        text: 'В ответе за всех кого приручила',
        name: 'Арина Чабанова, Deputy CEO',
        img: require('./arina.jpg')
    },
    {
        id: generateKey(),
        text: 'Любит говорить по телефону',
        name: 'Черкез Алла, Sales Partner',
        img: require('./alla.jpg')
    },
    {
        id: generateKey(),
        text: 'Самый везучий',
        name: 'Масюк Даниэль, Sales Partner',
        img: require('./danya.jpg')
    },
    {
        id: generateKey(),
        text: 'Приносит печеньки и управляет проектами',
        name: 'Мизина Анжелика, Project Manager',
        img: require('./ang.jpg')
    },
    {
        id: generateKey(),
        text: 'Играется со шрифтами',
        name: 'Марина Рубан, UI/UX Designer',
        img: require('./marina.jpg')
    },
    {
        id: generateKey(),
        text: 'Не любит jQuery',
        name: 'Ротарь Никита, Head of Front-end',
        img: require('./nikita.jpg')
    },
    {
        id: generateKey(),
        text: 'Не брезгует PHP',
        name: 'Шкапенко Леша, Head of Back-end',
        img: require('./alex.jpg')
    },
    {
        id: generateKey(),
        text: 'Подсела на Flex и Grid',
        name: 'Тесля Анна, Star of Front-end',
        img: require('./anya.jpg')
    },
    {
        id: generateKey(),
        text: 'Big Data Architect',
        name: 'Копельчук Сергей, Star of Back-end',
        img: require('./serg.jpg')
    },
    {
        id: generateKey(),
        text: 'Любит экспериментировать',
        name: 'Марга Игорь, Star of Front-end',
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