import React, { Component } from 'react';
import styles from './Slider.scss';
import Next from './Next';
import Prev from './Prev';
import SlideBig from './Slide/SlideBig';
import SlideSmall, { SlideSmallWrapper } from './Slide/SlideSmall';
import slideSmallStyles from './Slide/SlideSmall/SlideSmall.scss'
import slides from '../../../data/aboutUsSlider/slides';
import Scroll from '../../../actions/Scroll';
import NaNimate from '../../../generals/NaNimate'
import { PAGE_TRANSITION_TIME } from "../../../data/constants";
import Lng from '../../../components/Header/Menu/Lng';

const ANIMATION_DURATION = {
    slow: PAGE_TRANSITION_TIME,
    fast: 700
};

const ANIMATION_TIMING_FUNCTION = {
    slow: t => t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    fast: t => -t * t + 2 * t
};

export default class Slider extends Component {
    constructor (props) {
        super(props);

        this.state = {
            currentSlide: 0,
            sliderShow: false,
            sliderMount: false,
            prevButtonMount: false
        };

        const length = Math.ceil((slides.length - 1) / 3) + 1;
        this.sliderData = {
            length,
            width: window.innerWidth,
            leftBoundSlide: 0,
            rightBoundScroll: length - 1,
            animation: new NaNimate({
                duration: ANIMATION_DURATION.fast,
                timingFunction: ANIMATION_TIMING_FUNCTION.fast,
                progressFunction: () => {}
            })
        };

        this.scrollData = {
            allow: false,
            timeout: undefined,
            get globalRightAllow() { return Scroll.rightScrollAllow },
            set globalRightAllow(value) { Scroll.rightScrollAllow = value },
            get globalLeftAllow() { return Scroll.leftScrollAllow },
            set globalLeftAllow(value) { Scroll.leftScrollAllow = value }
        };

        this.moveData = {
            allow: false,
            startX: undefined,
            endX: undefined,
            positionX: undefined,
            stateCurrentSlide: this.state.currentSlide
        };

        props.syncNextButtonClick(this.nextButtonClick)
    }

    componentDidMount() {
        const { scrollData } = this;

        Scroll.action = this.scroll;

        scrollData.timeout = setTimeout(() => {
            scrollData.allow = true
        }, PAGE_TRANSITION_TIME);

        window.addEventListener('mousemove', this.move);
        window.addEventListener('mouseup', this.endMove);

        Lng.relativeComponentOrCallback = this;
    }

    startMove = event => {
        const { moveData } = this;
        const { pageX } = event;

        this.sliderData.animation.stop();

        moveData.allow = true;
        moveData.startX = pageX;
        moveData.positionX = pageX;
        moveData.stateCurrentSlide = this.state.currentSlide;
    };

    move = event => {
        const { moveData, sliderData } = this;

        if (moveData.allow) {
            moveData.positionX = event.pageX;

            const currentSlide = moveData.stateCurrentSlide + (moveData.startX - moveData.positionX) / sliderData.width;

            this.setState({currentSlide})
        }
    };

    endMove = event => {
        const { moveData, sliderData } = this;

        if (moveData.allow) {
            const { pageX } = event;

            moveData.allow = false;
            moveData.endX = pageX;
            moveData.positionX = pageX;

            sliderData.animation.timingFunction = ANIMATION_TIMING_FUNCTION.fast;
            sliderData.animation.duration = ANIMATION_DURATION.fast;

            this.animate();
        }
    };

    animate(method) {
        const { currentSlide } = this.state;

        let destinationSlide = Math[method || 'round'](currentSlide);
        this.animateTo(destinationSlide);
    }

    animateTo(destinationSlide) {
        const { currentSlide } = this.state;
        const { animation, length } = this.sliderData;

        if (destinationSlide > length - 1) destinationSlide = length - 1;
        else if (destinationSlide < 0) destinationSlide = 0;

        const delta = destinationSlide - currentSlide;

        animation.stop();
        animation.progressFunction = progress => {
            this.setState({currentSlide: currentSlide + delta * progress})
        };
        animation.start();
    }

    scroll = event => {
        const { scrollData, sliderData, state } = this;

        if (scrollData.allow && state.sliderMount) {
            scrollData.globalRightAllow = false;
            scrollData.globalLeftAllow = false;

            clearTimeout(scrollData.timeout);
            sliderData.animation.stop(true);

            const delta = event.deltaX !== 0 ? event.deltaX : -event.deltaY;

            this.setState(prevState => {
                let {currentSlide} = prevState;
                currentSlide -= delta / sliderData.width;

                if (currentSlide > sliderData.rightBoundScroll)
                    currentSlide = sliderData.rightBoundScroll;
                else if (currentSlide < sliderData.leftBoundSlide)
                    currentSlide = sliderData.leftBoundSlide;

                return {currentSlide}
            });

            scrollData.timeout = setTimeout(() => {
                scrollData.allow = false;

                if (this.state.currentSlide >= sliderData.rightBoundScroll)
                    scrollData.globalRightAllow = true;
                else if (this.state.currentSlide <= sliderData.leftBoundSlide)
                    scrollData.globalLeftAllow = true;

                sliderData.animation.timingFunction = ANIMATION_TIMING_FUNCTION.fast;
                sliderData.animation.duration = ANIMATION_DURATION.fast;

                if (delta > 0) this.animate('floor');
                else if (delta < 0) this.animate('ceil');

                sliderData.animation.callback = () => {
                    scrollData.allow = true;
                }
            }, 50);
        }
    };

    setCurrentSlideByClick = slide => {
        const { moveData, sliderData } = this;

        if (moveData.startX - moveData.positionX === 0){
            sliderData.animation.timingFunction = ANIMATION_TIMING_FUNCTION.slow;
            sliderData.animation.duration = ANIMATION_DURATION.slow;

            this.animateTo(slide);
        }
    };

    componentWillUnmount() {
        Scroll.action.remove(this.scroll);
        clearTimeout(this.scrollData.timeout);
        this.scrollData.globalRightAllow = true;
        this.scrollData.globalLeftAllow = true;
        this.sliderData.animation.stop(true);

        window.removeEventListener('mousemove', this.move);
        window.removeEventListener('mouseup', this.endMove);

        Lng.relativeComponentOrCallback.remove(this);
    }

    nextButtonClick = () => {
        if (this.state.sliderMount) {
            this.sliderData.animation.timingFunction = ANIMATION_TIMING_FUNCTION.slow;
            this.sliderData.animation.duration = ANIMATION_DURATION.slow;

            this.sliderData.animation.stop();

            if (this.state.currentSlide + 1 < this.sliderData.length)
                this.animateTo(this.state.currentSlide + 1)
        } else {
            this.props.gradientContentVisibility(false);
            this.setState({
                sliderMount: true,
                sliderShow: true,
                prevButtonMount: true
            })
        }
    };

    prevButtonClick = () => {
        if (this.state.currentSlide === 0) {
            this.props.gradientContentVisibility(true);

            this.scrollData.globalLeftAllow = true;
            this.scrollData.globalRightAllow = true;

            this.setState({
                prevButtonMount: false,
                sliderMount: false
            });
        } else {
            this.sliderData.animation.timingFunction = ANIMATION_TIMING_FUNCTION.slow;
            this.sliderData.animation.duration = ANIMATION_DURATION.slow;

            this.animateTo(this.state.currentSlide - 1)
        }
    };

    static slideImageLoaded = {};

    static slideImageSetLoaded = id => {
        Slider.slideImageLoaded[id] = true
    };

    static slideImageGetLoaded = id => {
        return Slider.slideImageLoaded[id]
    };

    animationEnd = () => {
        if (!this.state.sliderMount)
            this.setState({
                sliderShow: false
            })
    };

    render () {
        const { sliderMount, sliderShow, prevButtonMount, currentSlide } = this.state;
        const sliderClassName = styles.slider + ' ' + (sliderMount ? styles.open : styles.close);
        const currentLocation = window.location.pathname === '/about';

        const slidesArray = [];

        slidesArray.push(<SlideBig {...slides[0]}
                                   key={slides[0].id}
                                   slide={0}
                                   onClick={this.setCurrentSlideByClick.bind(null, 0)}
                                   currentSlide={currentSlide}
                                   slideImageSetLoaded={Slider.slideImageSetLoaded}
                                   imgLoaded={Slider.slideImageGetLoaded(slides[0].id) || false}/>);

        for (let i = 1; i < slides.length; i = i + 3) {
            let slidesSubArray = [];

            for (let j = i; j < i + 3; j++) {
                if (slides[j])
                    slidesSubArray.push(<SlideSmall {...slides[j]}
                                                    key={slides[j].id}
                                                    slideImageSetLoaded={Slider.slideImageSetLoaded}
                                                    imgLoaded={Slider.slideImageGetLoaded(slides[j].id) || false}/>);
            }

            slidesSubArray.id = slides[i].id;
            slidesArray.push(slidesSubArray);
        }

        return (
            <div>
                {sliderShow && <div className={styles.wrapper} onMouseDown={this.startMove}>
                    <div className={sliderClassName} onAnimationEnd={this.animationEnd}>
                        {slidesArray.map((item, index) => {
                                if (item instanceof Array)
                                    return (
                                        <SlideSmallWrapper key={item.id}
                                                           slide={index}
                                                           onClick={this.setCurrentSlideByClick.bind(null, index)}
                                                           currentSlide={currentSlide}>
                                            {item}
                                            {(() => {
                                                const additionalElements = [];

                                                for (let i = 0; i < 3 - item.length; i++) {
                                                    additionalElements.push(<div key={i} className={slideSmallStyles.slide}/>)
                                                }

                                                return additionalElements;
                                            })()}
                                        </SlideSmallWrapper>
                                    );
                                return item
                            }
                        )}
                    </div>
                </div>}

                <Prev onClick={this.prevButtonClick} mount={prevButtonMount && currentLocation}>
                    {currentSlide <= 0 ? ({ru: 'О нас', en: 'About us'})[Lng.currentLng] : 'Prev'}
                </Prev>

                <Next onClick={this.nextButtonClick} mount={slidesArray.length - 1 > currentSlide && currentLocation}>
                    {sliderMount ? 'Next' : ({ru: 'Наша команда', en: 'Our team'})[Lng.currentLng]}
                </Next>
            </div>
        )
    }
}