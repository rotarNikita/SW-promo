import React, { Component } from 'react';
import BackgroundTitle from '../../compnents/BackgroundTitle';
import GradientContent from './GradientContent';
import Slider from './Slider';

export default class About extends Component {
    constructor () {
        super();

        this.state = {
            mountGradientContent: true
        }
    }

    gradientContentVisibility = (mountGradientContent) => {
        this.setState({mountGradientContent})
    };

    syncNextButtonClick = value => {
        this.nextButtonClick = value;
        this.forceUpdate();
    };

    nextButtonClick() {}

    render () {
        const { mountGradientContent } = this.state;

        return (
            <div className="container">
                <BackgroundTitle>
                    About us
                </BackgroundTitle>

                <GradientContent mount={mountGradientContent} nextButtonClick={this.nextButtonClick}/>

                <Slider gradientContentVisibility={this.gradientContentVisibility}
                        syncNextButtonClick={this.syncNextButtonClick}/>
            </div>
        )
    }
}