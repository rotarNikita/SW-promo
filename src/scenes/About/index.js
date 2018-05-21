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

    render () {
        const { mountGradientContent } = this.state;

        return (
            <div className="container">
                <BackgroundTitle>
                    About us
                </BackgroundTitle>

                <GradientContent mount={mountGradientContent}/>

                <Slider gradientContentVisibility={this.gradientContentVisibility}/>
            </div>
        )
    }
}