import React, { Component } from 'react';
import styles from './LogoText.scss';

export default class LogoText extends Component {
    constructor (props) {
        super(props);

        this.state = {
            x: this.props.width
        };

        this.clearAnimation = false;
    }

    componentDidMount () {
        setTimeout(() => {
            this.width = this.text.getBBox().width;

            this.animate();
        });
    }

    animate = () => {
        if (this.state.x < -this.width) this.props.removeText(this);
        else if (!this.clearAnimation) {
            this.setState(prevState => ({x: prevState.x - this.props.speed}));

            requestAnimationFrame(this.animate);
        }
    };

    componentWillUnmount () {
        this.clearAnimation = true
    }

    render () {
        return (
            <text className={styles.text}
                  ref={text => this.text = text}
                  fontSize={this.props.fontSize}
                  transform={`translate(${this.state.x} ${this.props.y})`}>
                {this.props.children}
            </text>
        )
    }
}