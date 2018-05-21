import React, { Component } from 'react';
import styles from './Slider.scss';
import Scroll from '../../../actions/Scroll';
import { PAGE_TRANSITION_TIME } from "../../../data/constants";
import Navigation from './Navigation';
import NaNimate from '../../../generals/NaNimate';

const ANIMATION_DURATION = {
    scroll: PAGE_TRANSITION_TIME,
    swipe: 300
};

const ANIMATION_TIMING_FUNCTION = {
    scroll: t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    swipe: t => -t * t + 2 * t
};

export default class Slider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            position: 0,
            menuOpened: false
        };

        this.movementData = {
            move: false,
            startX: undefined,
            currentX: undefined,
            endX: undefined,
            position: 0,
            slow: false
        };

        this.sliderData = {
            width: window.innerWidth,
            currentSlide: 0,
            trackWidth: 0,
            slidesWidths: [],
            slidesPositions: [],
            slides: props.slidesRefs,
            length: 0,
            animation: new NaNimate({
                duration: ANIMATION_DURATION.swipe,
                timingFunction: ANIMATION_TIMING_FUNCTION.swipe,
                progressFunction: () => {},
                callback: () => {
                    this.movementData.position = this.state.position;
                }
            })
        };

        this.scrollData = {
            scroll: true,
            scrollTimeout: null,
            get globalRight() { return Scroll.rightScrollAllow },
            set globalRight(val) { Scroll.rightScrollAllow = val },
            get globalLeft() { return Scroll.leftScrollAllow },
            set globalLeft(val) { Scroll.leftScrollAllow = val }
        };

        this.scrollData.globalRight = false;
        this.scrollData.globalLeft = false;

        this.menuButton = null;
        this.menuLinks = [];
    }

    componentDidMount() {
        this.menuButton = document.getElementById('menuButton');
        this.menuLinks = document.querySelectorAll('[class^="MenuItem__item"]');

        window.addEventListener('mousemove', this.move);
        window.addEventListener('mouseup', this.moveEnd);

        this.menuButton.addEventListener('click', this.menuClick);
        this.menuLinkListener('addEventListener');

        this.scrollData.scrollTimeout = setTimeout(() => {
            Scroll.action = this.slideScroll;
        }, PAGE_TRANSITION_TIME);

        setTimeout(() => {
            this.slideDataCalc();
            this.animatingSlideChange();
        }, 15)
    }

    menuLinkListener(action) {
        for (let i = 0; i < this.menuLinks.length; i++)
            this.menuLinks[i][action]('click', this.menuClick)
    }

    menuClick = () => {
        this.setState({
            menuOpened: !/opened/.test(this.menuButton.className)
        })
    };

    slideScroll = event => {
        const { scrollData, sliderData } = this;

        scrollData.globalRight = false;
        scrollData.globalLeft = false;

        if (scrollData.scroll) {
            scrollData.scroll = false;

            this.sliderData.animation.duration = ANIMATION_DURATION.scroll;
            this.sliderData.animation.timingFunction = ANIMATION_TIMING_FUNCTION.scroll;

            if (event.deltaY > 0 && sliderData.currentSlide + 1 <= sliderData.length - 1) this.goTo(sliderData.currentSlide + 1);
            else if (sliderData.currentSlide + 1 > sliderData.length - 1) scrollData.globalRight = true;

            if (event.deltaY < 0 && sliderData.currentSlide - 1 >= 0) this.goTo(sliderData.currentSlide - 1);
            else if (sliderData.currentSlide - 1 < 0) scrollData.globalLeft = true;

            scrollData.scrollTimeout = setTimeout(() => {
                scrollData.scroll = true;
            }, PAGE_TRANSITION_TIME)
        }
    };

    goTo = slide => {
        const { sliderData, movementData, state } = this;

        movementData.position = state.position;
        sliderData.currentSlide = slide;
        this.animatingSlideChange();
    };

    slideDataCalc() {
        const { slides, width } = this.sliderData;
        const slidesWidths = [];
        const slidesPositions = [];
        let trackWidth = 0;

        for (let i = 0; i < slides.length; i++) {
            let slideWidth = slides[i].DOMElement.offsetWidth;
            let slidePosition = (width - slideWidth) / 2 - trackWidth ;

            slidesPositions.push(slidePosition);
            slidesWidths.push(slideWidth);
            trackWidth += slideWidth;
        }

        this.sliderData.length = slides.length;
        this.sliderData.slidesWidths = slidesWidths;
        this.sliderData.slidesPositions = slidesPositions;
        this.sliderData.trackWidth = trackWidth;
    };

    moveStart = event => {
        const { sliderData, movementData } = this;

        sliderData.animation.stop(true);

        movementData.startX = event.clientX;
        movementData.currentX = event.clientX;
        movementData.position = this.state.position;
        movementData.move = true;
        movementData.slow = false;
    };

    moveEnd = event => {
        if (this.movementData.move) {
            this.movementData.endX = event.clientX;
            this.movementData.currentX = event.clientX;
            this.movementData.move = false;
            this.movementData.position = this.state.position;

            this.sliderData.animation.duration = ANIMATION_DURATION.swipe;
            this.sliderData.animation.timingFunction = ANIMATION_TIMING_FUNCTION.swipe;

            this.chooseCurrentSlide();
            this.animatingSlideChange();
        }
    };

    animatingSlideChange() {
        const { position } = this.movementData;
        const { slidesPositions, currentSlide, animation } = this.sliderData;

        animation.stop(true);

        const delta = slidesPositions[currentSlide] - position;

        animation.progressFunction = (progress) => {
            this.setState({position: position + delta * progress});
        };

        animation.start();
    }

    chooseCurrentSlide() {
        const { length, slidesWidths, width } = this.sliderData;
        const { endX, startX, position } = this.movementData;


        if (startX > endX) { // right
            for (let i = length - 1; i >= 0; i--) {
                let widthPrevSlides = 0;

                for (let j = 0; j < i; j++)
                    widthPrevSlides += slidesWidths[j];

                if (width - position > widthPrevSlides + slidesWidths[i] / 2) {
                    this.sliderData.currentSlide = i;
                    break;
                }
            }
        } else { // left
            for (let i = 0; i < length; i++) {
                let widthPrevSlides = 0;

                for (let j = 0; j < i; j++)
                    widthPrevSlides += slidesWidths[j];

                if (-position < widthPrevSlides + slidesWidths[i] / 2) {
                    this.sliderData.currentSlide = i;
                    break;
                }
            }
        }
    }

    move = event => {
        const { movementData } = this;

        if (movementData.move) {
            const { position } = this.state;
            const { slidesPositions, length } = this.sliderData;

            if ((-position > -slidesPositions[length - 1] && movementData.endX > event.clientX) ||
                (-position < -slidesPositions[0] && movementData.endX < event.clientX)) {
                movementData.slow = true;
            } else {
                if (movementData.slow) {
                    this.movementData.startX = event.clientX;
                    this.movementData.position = position;

                    movementData.slow = false;
                }

                movementData.currentX = event.clientX;
            }

            movementData.endX = event.clientX;

            this.setState({
                position: movementData.position + movementData.currentX - movementData.startX +
                (movementData.slow ? (movementData.endX - movementData.currentX) / 5 : 0)
            })
        }
    };

    dotClick = slide => {
        this.sliderData.animation.duration = ANIMATION_DURATION.scroll;
        this.sliderData.animation.timingFunction = ANIMATION_TIMING_FUNCTION.scroll;
        this.goTo(slide)
    };

    componentWillUnmount() {
        window.removeEventListener('mousemove', this.move);
        window.removeEventListener('mouseup', this.moveEnd);

        Scroll.action.remove(this.slideScroll);
        clearTimeout(this.scrollData.scrollTimeout);
        this.scrollData.scroll = false;
        this.sliderData.animation.stop();

        this.menuButton.removeEventListener('click', this.menuClick);
        this.menuLinkListener('removeEventListener');

        this.scrollData.globalRight = true;
        this.scrollData.globalLeft = true;
    }

    render() {
        const { children } = this.props;
        const { position, menuOpened } = this.state;
        const { currentSlide, slides } = this.sliderData;

        const showNavigation = window.location.pathname === '/cases' && !menuOpened;

        return (
            <div onMouseDown={this.moveStart} className={styles.wrapper}>
                <div className={styles.track}
                     style={{left: `${position}px`}}>
                    {children}
                </div>
                <Navigation mount={showNavigation}
                            slides={slides}
                            dotClick={this.dotClick}
                            currentSlide={currentSlide}/>
            </div>
        )
    }
}