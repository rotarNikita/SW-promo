import Lng from '../components/Header/Menu/Lng';

export const GRADIENT_COLOR_1 = '#0b58a3';
export const GRADIENT_COLOR_2 = '#fc2324';

export const MAIN_COLOR_1 = '#ff6666';
export const MAIN_COLOR_2 = '#004da2';

export const MENU_TRANSITION_TIME = 500;
export const PAGE_TRANSITION_TIME = 1500;

export const HEADER_LOGO_SVG_DEF_ID = 'header-logo';

export const MAIN_PAGE_TEXT = {
    get data() {return ({
        ru: [
            'Купи сайт',
            'Делаем сайты не хуже других',
            'Нам на вас похуй',
            'Шмелик магнитный',
            'Получится говно',
            'Помогите! Меня держат в подвале'
        ],
        en: [
            'Effective Web Solutions'
        ]
    })[Lng.currentLng]},
    fontSizeRange: [100, 200],
    speedRange: [2, 4]
};