import React, { Component } from 'react';
import styles from './Slider.scss';
import Next from './Next';
import Prev from './Prev';
import SlideBig from './Slide/SlideBig';
import SlideSmall, { SlideSmallWrapper } from './Slide/SlideSmall';
import slides from '../../../data/aboutUsSlider/slides';

export default class Slider extends Component {
    constructor (props) {
        super(props);

        this.state = {
            currentSlide: 0,
            sliderShow: false,
            sliderMount: false,
            prevButtonMount: false
        };

        Slider.slideImageLoaded = Slider.slideImageLoaded || {}
    }

    nextButtonClick = () => {
        if (this.state.sliderMount) {
            this.setState(prevState => ({
                currentSlide: prevState.currentSlide + 1
            }))
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

            this.setState({
                prevButtonMount: false,
                sliderMount: false
            });
        } else {
            this.setState(prevState => ({
                currentSlide: prevState.currentSlide - 1
            }))
        }
    };

    static slideImageSetLoaded (id) {
        Slider.slideImageLoaded[id] = true
    }

    static slideImageGetLoaded (id) {
        return Slider.slideImageLoaded[id]
    }

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
                {sliderShow && <div className={styles.wrapper}>
                    <div className={sliderClassName} onAnimationEnd={this.animationEnd}>
                        {slidesArray.map((item, index) => {
                                if (item instanceof Array)
                                    return (
                                        <SlideSmallWrapper key={item.id} slide={index} currentSlide={currentSlide}>
                                            {item}
                                        </SlideSmallWrapper>
                                    );
                                return item
                            }
                        )}
                    </div>
                </div>}

                <Prev onClick={this.prevButtonClick} mount={prevButtonMount && currentLocation}>
                    {currentSlide === 0 ? 'Верните текст!' : 'Prev'}
                </Prev>

                <Next onClick={this.nextButtonClick} mount={slidesArray.length - 1 > currentSlide && currentLocation}>
                    {sliderMount ? 'Next' : 'Наша команда'}
                </Next>
            </div>
        )
    }
}