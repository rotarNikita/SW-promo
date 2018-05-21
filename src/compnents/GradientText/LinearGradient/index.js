import React, { Component } from 'react';
import { GRADIENT_COLOR_1, GRADIENT_COLOR_2 } from '../../../data/constants';
import generateKey from '../../../generals/generateKey';

export default class LinearGradient extends Component {
    constructor (props) {
        super(props);

        this.state = {
            controlPoint: 50
        }
    }

    componentDidMount () {
        window.addEventListener('mousemove', this.changeGradient);
    }

    changeGradient = (event) => {
        this.setState({
            controlPoint: event.clientX / window.innerWidth * 100
        })
    };

    render () {
        return (
            <svg width={0} height={0}>
                <defs>
                    <linearGradient id="GradientText" x1="0" y1="0" x2="100%" y2="0">
                        <stop offset={this.state.controlPoint - 50 + '%'}
                              stopColor={GRADIENT_COLOR_1} />
                        <stop offset={this.state.controlPoint + 50 + '%'}
                              stopColor={GRADIENT_COLOR_2} />
                    </linearGradient>
                </defs>
            </svg>
        )
    }
}

LinearGradient.id = generateKey();