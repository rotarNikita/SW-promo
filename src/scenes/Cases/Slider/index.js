import React, { Component } from 'react';
import styles from './Slider.scss';
import Scroll from '../../../actions/Scroll';
import { PAGE_TRANSITION_TIME } from "../../../data/constants";
import Navigation from './Navigation';
import NaNimate from '../../../generals/NaNimate';
import PropTypes from 'prop-types';

const ANIMATION_DURATION = {
    slow: PAGE_TRANSITION_TIME,
    fast: 600
};

const ANIMATION_TIMING_FUNCTION = {
    slow: t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    fast: t => -t * t + 2 * t
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
            leftBound: 0,
            rightBound: 0,
            slidesWidths: [],
            slidesPositions: [],
            slides: props.slidesRefs,
            length: 0,
            animation: new NaNimate({
                duration: ANIMATION_DURATION.fast,
                timingFunction: ANIMATION_TIMING_FUNCTION.fast,
                progressFunction: () => {},
                callback: () => {
                    this.movementData.position = this.state.position;
                    this.scrollData.scroll = true;
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

    static childContextTypes = {
        slideClick: PropTypes.func
    };

    getChildContext() {
        return {
            slideClick: slide => {
                const { startX, endX } = this.movementData;

                if (startX === endX) this.goTo(slide)
            }
        }
    };

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
        const { scrollData, sliderData, state } = this;

        scrollData.globalLeft = false;
        scrollData.globalRight = false;

        if (scrollData.scroll) {
            clearTimeout(scrollData.scrollTimeout);
            sliderData.animation.stop(true);

            const delta = event.deltaX !== 0 ? event.deltaX : -event.deltaY;

            this.setState(prevState => {
                let position = prevState.position + delta;

                if (position > sliderData.leftBound) position = sliderData.leftBound;
                else if (position < sliderData.rightBound) position = sliderData.rightBound;

                return {position}
            });

            if (state.position === sliderData.leftBound)
                scrollData.globalLeft = sliderData.currentSlide === 0;
            else if (state.position === sliderData.rightBound)
                scrollData.globalRight = sliderData.currentSlide === sliderData.length - 1;

            scrollData.scrollTimeout = setTimeout(() => {
                scrollData.scroll = false;

                let method;
                if (delta < 0) method = 'next';
                else if (delta > 0) method = 'prev';
                this.chooseCurrentSlide(method);

                sliderData.animation.timingFunction = ANIMATION_TIMING_FUNCTION.fast;
                sliderData.animation.duration = ANIMATION_DURATION.fast;
                this.goTo(sliderData.currentSlide);
            }, 50);
        }
    };

    goTo = slide => {
        const { sliderData, movementData, state } = this;

        movementData.position = state.position;
        sliderData.currentSlide = slide;
        this.animatingSlideChange();
    };

    slideDataCalc() {
        const { sliderData } = this;
        const { slides, width } = sliderData;
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

        sliderData.length = slides.length;
        sliderData.slidesWidths = slidesWidths;
        sliderData.slidesPositions = slidesPositions;
        sliderData.trackWidth = trackWidth;
        sliderData.leftBound = slidesPositions[0];
        sliderData.rightBound = slidesPositions[sliderData.length - 1]
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

            this.sliderData.animation.duration = ANIMATION_DURATION.fast;
            this.sliderData.animation.timingFunction = ANIMATION_TIMING_FUNCTION.fast;

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

    chooseCurrentSlide(type) {
        const { length, slidesWidths, width } = this.sliderData;
        const { endX, startX } = this.movementData;
        const { position } = this.state;


        if (startX > endX || type === 'next') { // right
            for (let i = length - 1; i >= 0; i--) {
                let widthPrevSlides = 0;

                for (let j = 0; j < i; j++)
                    widthPrevSlides += slidesWidths[j];

                if (width - position > widthPrevSlides + slidesWidths[i] / 2) {
                    this.sliderData.currentSlide = i;
                    break;
                }
            }
        } else if (startX < endX || type === 'prev') { // left
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
        this.sliderData.animation.duration = ANIMATION_DURATION.slow;
        this.sliderData.animation.timingFunction = ANIMATION_TIMING_FUNCTION.slow;
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