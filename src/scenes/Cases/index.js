import React, { Component } from 'react';
import BackgroundTitle from '../../components/BackgroundTitle';
import Slider from './Slider';
import Slide from './Slider/Slide';
import { VIDEOS } from "../../data/casesContent";
import Lng from '../../components/Header/Menu/Lng';

export default class Cases extends Component {
    componentDidMount() {
        Lng.relativeComponentOrCallback = this;
    }

    componentWillUnmount() {
        Lng.relativeComponentOrCallback.remove(this)
    }

    static loadedSlides = {};

    static addToLoadedSlides(id) {
        Cases.loadedSlides[id] = true;
    }

    static checkLoadById(id) {
        return Cases.loadedSlides[id] || false;
    }

    render() {
        const slidesRefs = [];

        const slides = VIDEOS.map((data, i) => <Slide loaded={Cases.checkLoadById(data.id)}
                                                 onLoad={Cases.addToLoadedSlides.bind(null, data.id)}
                                                 ref={slide => {if (slide !== null) slidesRefs.push(slide)}}
                                                 slideIndex={i}
                                                 key={data.id}
                                                 data={data}/>);

        return (
            <div className="container">
                <BackgroundTitle>
                    Cases
                </BackgroundTitle>
                <Slider slidesRefs={slidesRefs}>
                    {slides}
                </Slider>
            </div>
        )
    }
}