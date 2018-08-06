import React, { Component } from 'react';
import styles from './Slider.scss';
import Scroll from '../../../actions/Scroll';
import { PAGE_TRANSITION_TIME } from "../../../data/constants";
import Navigation from './Navigation';
import NaNimate from '../../../generals/NaNimate';
import PropTypes from 'prop-types';
import MQC from '../../../actions/MediaQueryChecker';
import Next from '../../About/Slider/Next';
import Prev from '../../About/Slider/Prev';

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
            slow: false,
            sensitive: 10
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

        this.MQCIDs = MQC.addResizeChecker({
            callback: () => {
                this.sliderData.width = window.innerWidth;
                this.slideDataCalc();
                this.animatingSlideChange();
            }
        }, {
            to: 768,
            callback: () => {
                this.movementData.sensitive = 10
            }
        }, {
            from: 769,
            callback: () => {
                this.movementData.sensitive = 2
            }
        })
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

        if (MQC.isTouchDevice) {
            window.addEventListener('touchmove', this.move);
            window.addEventListener('touchend', this.moveEnd);
        } else {
            window.addEventListener('mousemove', this.move);
            window.addEventListener('mouseup', this.moveEnd);
        }

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
            let slidePosition = (width - slideWidth) / 2 - trackWidth;

            slidesPositions.push(slidePosition);
            slidesWidths.push(slideWidth);
            trackWidth += slideWidth;
        }

        sliderData.length = slides.length;
        sliderData.slidesWidths = slidesWidths;
        sliderData.slidesPositions = slidesPositions;
        sliderData.trackWidth = trackWidth;
        sliderData.leftBound = slidesPositions[0];
        sliderData.rightBound = slidesPositions[sliderData.length - 1];
    };

    moveStart = event => {
        const { sliderData, movementData } = this;

        sliderData.animation.stop(true);

        movementData.startX = event.clientX !== undefined ? event.clientX : event.touches[0].clientX;
        movementData.currentX = movementData.startX;
        movementData.position = this.state.position;
        movementData.move = true;
        movementData.slow = false;
    };

    moveEnd = event => {
        if (this.movementData.move) {
            this.movementData.endX = event.clientX !== undefined ? event.clientX : event.changedTouches[0].clientX;
            this.movementData.currentX = this.movementData.endX;
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
        const { endX, startX, sensitive } = this.movementData;
        const { position } = this.state;


        if (startX > endX || type === 'next') { // right
            for (let i = length - 1; i >= 0; i--) {
                let widthPrevSlides = 0;

                for (let j = 0; j < i; j++)
                    widthPrevSlides += slidesWidths[j];

                if (width - position > widthPrevSlides + slidesWidths[i] / sensitive) {
                    this.sliderData.currentSlide = i;
                    break;
                }
            }
        } else if (startX < endX || type === 'prev') { // left
            for (let i = 0; i < length; i++) {
                let widthPrevSlides = 0;

                for (let j = 0; j < i; j++)
                    widthPrevSlides += slidesWidths[j];

                if (-position < widthPrevSlides + slidesWidths[i] * (1 - 1 / sensitive)) {
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

            const clientX = event.clientX !== undefined ? event.clientX : event.touches[0].clientX;

            if ((-position > -slidesPositions[length - 1] && movementData.endX > clientX) ||
                (-position < -slidesPositions[0] && movementData.endX < clientX)) {
                movementData.slow = true;
            } else {
                if (movementData.slow) {
                    this.movementData.startX = clientX;
                    this.movementData.position = position;

                    movementData.slow = false;
                }

                movementData.currentX = clientX;
            }

            movementData.endX = clientX;

            this.setState({
                position: movementData.position + movementData.currentX - movementData.startX +
                (movementData.slow ? (movementData.endX - movementData.currentX) / 5 : 0)
            })
        }
    };

    nextClick = e => {
        const { currentSlide, length } = this.sliderData;

        e.stopPropagation();
        if (currentSlide + 1 < length) this.dotClick(currentSlide + 1);
    };

    prevClick = e => {
        const { currentSlide } = this.sliderData;

        e.stopPropagation();
        if (currentSlide > 0) this.dotClick(currentSlide - 1);
    };

    dotClick = slide => {
        this.sliderData.animation.duration = ANIMATION_DURATION.slow;
        this.sliderData.animation.timingFunction = ANIMATION_TIMING_FUNCTION.slow;
        this.goTo(slide)
    };

    componentWillUnmount() {
        window.removeEventListener('mousemove', this.move);
        window.removeEventListener('mouseup', this.moveEnd);
        window.removeEventListener('touchmove', this.move);
        window.removeEventListener('touchend', this.moveEnd);

        Scroll.action.remove(this.slideScroll);
        clearTimeout(this.scrollData.scrollTimeout);
        this.scrollData.scroll = false;
        this.sliderData.animation.stop();

        this.menuButton.removeEventListener('click', this.menuClick);
        this.menuLinkListener('removeEventListener');

        this.scrollData.globalRight = true;
        this.scrollData.globalLeft = true;

        MQC.removeResizeChecker(this.MQCIDs);
    }

    render() {
        const { children } = this.props;
        const { position, menuOpened } = this.state;
        const { currentSlide, slides, length } = this.sliderData;

        const currentPage = window.location.pathname === '/cases';
        const mountNavigation = currentPage && !menuOpened;

        return (
            <div onMouseDown={!MQC.isTouchDevice ? this.moveStart : () => {}}
                 onTouchStart={MQC.isTouchDevice ? this.moveStart : () => {}}
                 className={styles.wrapper}>
                <div className={styles.track}
                     style={{left: `${position}px`}}>
                    {children}
                </div>
                <Navigation mount={mountNavigation}
                            slides={slides}
                            dotClick={this.dotClick}
                            currentSlide={currentSlide}/>

                <Next onClick={this.nextClick} mount={currentSlide < length - 1 && currentPage}>Next</Next>
                <Prev onClick={this.prevClick}
                      needAnimationState={false}
                      mount={currentSlide > 0 && currentPage}>Prev</Prev>
            </div>
        )
    }
}