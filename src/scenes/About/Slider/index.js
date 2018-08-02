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
import MQC from '../../../actions/MediaQueryChecker';

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

        let slidesInOneWrapper = 3;

        if (window.innerWidth > 1200) slidesInOneWrapper = 3;
        else if (window.innerWidth > 768) slidesInOneWrapper = 2;
        else slidesInOneWrapper = 1;

        this.state = {
            currentSlide: 0,
            sliderShow: false,
            sliderMount: false,
            prevButtonMount: false,
            slidesInOneWrapper
        };

        this.state.length = Math.ceil((slides.length - 1) / slidesInOneWrapper) + 1;

        this.sliderData = {
            width: window.innerWidth,
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

        this.MQCIDs = MQC.addResizeChecker({
            to: 768,
            callback: this.setSlidesInOneWrapper(1)
        }, {
            from: 769,
            to: 1200,
            callback: this.setSlidesInOneWrapper(2)
        }, {
            from: 1201,
            callback: this.setSlidesInOneWrapper(3)
        });

        props.syncNextButtonClick(this.nextButtonClick)
    }

    setSlidesInOneWrapper(count) {
        return () => {
            const slidesInOneWrapper = count;
            const length = Math.ceil((slides.length - 1) / slidesInOneWrapper) + 1;

            this.moveData.stateCurrentSlide = 0;

            this.setState({slidesInOneWrapper, length, currentSlide: 0});
        }
    }

    componentDidMount() {
        const { scrollData } = this;

        Scroll.action = this.scroll;

        scrollData.timeout = setTimeout(() => {
            scrollData.allow = true
        }, PAGE_TRANSITION_TIME);

        if (MQC.isTouchDevice) {
            window.addEventListener("touchend", this.endMove);
            window.addEventListener("touchmove", this.move);
        } else {
            window.addEventListener('mousemove', this.move);
            window.addEventListener('mouseup', this.endMove);
        }

        Lng.relativeComponentOrCallback = this;
    }

    startMove = event => {
        const { moveData } = this;
        const clientX = event.clientX !== undefined ? event.clientX : event.touches[0].clientX;

        this.sliderData.animation.stop();

        moveData.allow = true;
        moveData.startX = clientX;
        moveData.positionX = clientX;
        moveData.stateCurrentSlide = this.state.currentSlide;
    };

    move = event => {
        const { moveData, sliderData } = this;

        if (moveData.allow) {
            moveData.positionX = event.clientX !== undefined ? event.clientX : event.touches[0].clientX;

            const currentSlide = moveData.stateCurrentSlide + (moveData.startX - moveData.positionX) / sliderData.width;

            this.setState({currentSlide})
        }
    };

    endMove = event => {
        const { moveData, sliderData } = this;

        if (moveData.allow) {
            const clientX = event.clientX !== undefined ? event.clientX : event.changedTouches[0].clientX;

            moveData.allow = false;
            moveData.endX = clientX;
            moveData.positionX = clientX;

            sliderData.animation.timingFunction = ANIMATION_TIMING_FUNCTION.fast;
            sliderData.animation.duration = ANIMATION_DURATION.fast;

            if (MQC.isTouchDevice) {
                if (moveData.startX - moveData.endX > window.innerWidth * 0.1) this.animate('ceil');
                else if (moveData.startX - moveData.endX < -window.innerWidth * 0.1) this.animate('floor')
                else this.animate();
            } else this.animate();
        }
    };

    animate(method) {
        const { currentSlide } = this.state;

        let destinationSlide = Math[method || 'round'](currentSlide);
        this.animateTo(destinationSlide);
    }

    animateTo(destinationSlide) {
        const { currentSlide, length } = this.state;
        const { animation } = this.sliderData;

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
        const { length } = state;

        if (scrollData.allow && state.sliderMount) {
            scrollData.globalRightAllow = false;
            scrollData.globalLeftAllow = false;

            clearTimeout(scrollData.timeout);
            sliderData.animation.stop(true);

            const delta = event.deltaX !== 0 ? event.deltaX : -event.deltaY;

            this.setState(prevState => {
                let {currentSlide} = prevState;
                currentSlide -= delta / sliderData.width;

                if (currentSlide > length - 1)
                    currentSlide = length - 1;
                else if (currentSlide < 0)
                    currentSlide = 0;

                return {currentSlide}
            });

            scrollData.timeout = setTimeout(() => {
                scrollData.allow = false;

                if (this.state.currentSlide >= length - 1)
                    scrollData.globalRightAllow = true;
                else if (this.state.currentSlide <= 0)
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
        window.removeEventListener('mousemove', this.move);
        window.removeEventListener('mouseup', this.endMove);

        Lng.relativeComponentOrCallback.remove(this);

        MQC.removeResizeChecker(this.MQCIDs)
    }

    nextButtonClick = () => {
        if (this.state.sliderMount) {
            this.sliderData.animation.timingFunction = ANIMATION_TIMING_FUNCTION.slow;
            this.sliderData.animation.duration = ANIMATION_DURATION.slow;

            this.sliderData.animation.stop();

            if (this.state.currentSlide + 1 < this.state.length)
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

    slidesRenderM() {
        const { currentSlide, slidesInOneWrapper } = this.state;

        const slidesArray = [];

        slidesArray.push(<SlideBig {...slides[0]}
                                   key={slides[0].id}
                                   slide={0}
                                   onClick={this.setCurrentSlideByClick.bind(null, 0)}
                                   currentSlide={currentSlide}
                                   slideImageSetLoaded={Slider.slideImageSetLoaded}
                                   imgLoaded={true || Slider.slideImageGetLoaded(slides[0].id) || false}/>);

        for (let i = 1; i < slides.length; i = i + slidesInOneWrapper) {
            let slidesSubArray = [];

            for (let j = i; j < i + slidesInOneWrapper; j++) {
                if (slides[j])
                    slidesSubArray.push(<SlideSmall {...slides[j]}
                                                    key={slides[j].id}
                                                    slideImageSetLoaded={Slider.slideImageSetLoaded}
                                                    imgLoaded={true || Slider.slideImageGetLoaded(slides[j].id) || false}/>);
            }

            slidesSubArray.id = slides[i].id;
            slidesArray.push(slidesSubArray);
        }

        return slidesArray;
    }

    render () {
        const { sliderMount, sliderShow, prevButtonMount, currentSlide, slidesInOneWrapper } = this.state;
        const sliderClassName = styles.slider + ' ' + (sliderMount ? styles.open : styles.close);
        const currentLocation = window.location.pathname === '/about';

        const slidesArray = this.slidesRenderM();

        return (
            <div style={{height: '100%'}}>
                {sliderShow && <div className={styles.wrapper}
                                    onTouchStart={MQC.isTouchDevice ? this.startMove : () => {}}
                                    onMouseDown={!MQC.isTouchDevice ? this.startMove : () => {}}>
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

                                                for (let i = 0; i < slidesInOneWrapper - item.length; i++) {
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

                <Next onClick={this.nextButtonClick} mount={this.state.length - 1 > currentSlide && currentLocation}>
                    {sliderMount ? 'Next' : ({ru: 'Наша команда', en: 'Our team'})[Lng.currentLng]}
                </Next>
            </div>
        )
    }
}