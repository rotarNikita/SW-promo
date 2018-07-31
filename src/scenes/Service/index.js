import React, { PureComponent } from 'react';
import styles from './Service.scss';
import TextBlock from './TextBlock';
import { PAGE_TRANSITION_TIME } from "../../data/constants";
import { TEXT_BLOCK_TEXT, TEXT_BLOCK_TITLE, SLIDES } from "../../data/serviceContent";
import Slider from './Slider';
import Slide from './Slider/Slide';
import Lng from '../../components/Header/Menu/Lng'

export default class Service extends PureComponent {
    constructor (props) {
        super(props);

        this.mainBlock = null;
        this.mainBlockTimeout = null;

        this.pageTitle = null;
        this.burger = null;
        this.titlePrev = null;
        this.titleNext = null;
        this.menuLink = null;
    }

    componentDidMount () {
        Lng.relativeComponentOrCallback = this;

        setTimeout(() => {
            this.mainBlock = document.getElementById('main');
            this.burger = document.getElementById('menuButton');
            this.pageTitle = document.getElementById('pageTitle');
            this.titlePrev = document.getElementById('titlePrev');
            this.titleNext = document.getElementById('titleNext');
            this.menuLink = document.querySelector('[class^="MenuItem__link"][href="/service"]');

            this.mainBlockChange();
            this.burgerChange();
            this.pageTitleChange();
            this.titlePrevChange();
            this.titleNextChange()

            this.menuLink.addEventListener('click', this.burgerClick);
            this.burger.addEventListener('click', this.burgerClick);
        });
    }

    titleNextChange () {
        [].forEach.call(this.titleNext.children, child => {
            child.style.color = '#FFFFFF'
        })
    }

    titleNextReset () {
        [].forEach.call(this.titleNext.children, child => {
            child.setAttribute('style', '')
        })
    }

    titlePrevChange () {
        [].forEach.call(this.titlePrev.children, child => {
            child.style.color = '#FFFFFF'
        })
    }

    titlePrevReset () {
        [].forEach.call(this.titlePrev.children, child => {
            child.setAttribute('style', '')
        })
    }

    pageTitleChange () {
        this.pageTitle.style.color = '#FFFFFF'
    }

    pageTitleReset () {
        this.pageTitle.setAttribute('style', '')
    }

    burgerClick = () => {
        if (/opened/.test(this.burger.className)) {
            this.burgerChange();
            this.pageTitleChange();
        }
        else {
            this.burgerReset();
            this.pageTitleReset();
        }
    };

    burgerChange () {
        [].forEach.call(this.burger.children, (child, i) => {
            if (i < 3)
                child.style.backgroundColor = '#FFFFFF';
        })
    }

    burgerReset () {
        [].forEach.call(this.burger.children, (child, i) => {
            if (i < 3)
                child.setAttribute('style', '')
        })
    }

    mainBlockChange () {
        this.mainBlock.style.transition = `all ${PAGE_TRANSITION_TIME}ms`;
        this.mainBlock.style.backgroundColor = '#000000';
    }

    mainBlockReset () {
        clearTimeout(this.mainBlockTimeout);

        this.mainBlock.style.backgroundColor = 'transparent';

        this.mainBlockTimeout = setTimeout(() => {
            if (window.location.pathname !== '/service')
                this.mainBlock.setAttribute('style', '')
        }, PAGE_TRANSITION_TIME)
    }

    componentDidUpdate () {
        if (window.location.pathname !== '/service') {
            this.mainBlockReset();
            this.burgerReset();
            this.pageTitleReset();
            this.titlePrevReset();
            this.titleNextReset();

            this.burger.removeEventListener('click', this.burgerClick);
            this.menuLink.removeEventListener('click', this.burgerClick);
        }
    }

    componentWillUnmount() {
        Lng.relativeComponentOrCallback.remove(this);
    }

    render () {
        const slides = SLIDES().map((slide, index) => (<Slide {...slide}
                                                            key={slide.id}
                                                            slideNumber={index}/>));

        return (
            <div className={styles.wrapper}>
                <Slider>
                    <TextBlock title={TEXT_BLOCK_TITLE()} text={TEXT_BLOCK_TEXT()}/>
                    {slides}
                </Slider>
            </div>
        )
    }
}