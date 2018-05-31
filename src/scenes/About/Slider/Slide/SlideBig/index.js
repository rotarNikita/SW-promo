import React, { Component } from 'react';
import styles from './SlideBig.scss';
import loader from '../../../../../generals/photoLoader/index';

const LEFT_BREAKPOINT = [200, 100, 0];
const SCALE_BREAKPOINT = [0.9, 0.9, 1];
const OPACITY_BREAKPOINT = [0, 0.7, 1];

export default class SlideBig extends Component {
    constructor (props) {
        super(props);

        this.state = {
            imgLoaded: props.imgLoaded
        }
    }

    slidePosition () {
        const { slide, currentSlide } = this.props;

        let multiplier = (slide - currentSlide);

        let left = 0;
        let scale = 1;
        let opacity = 1;

        if (multiplier >= 2 || multiplier <= -2) {
            left = Math.sign(multiplier) * LEFT_BREAKPOINT[0];
            scale = SCALE_BREAKPOINT[0];
            opacity = OPACITY_BREAKPOINT[0];
        } else if (multiplier > 1 || multiplier < -1) {
            multiplier = multiplier - Math.sign(multiplier) * 1;

            left = multiplier * (LEFT_BREAKPOINT[0] - LEFT_BREAKPOINT[1]) + Math.sign(multiplier) * LEFT_BREAKPOINT[1];
            scale = Math.abs(multiplier) * (SCALE_BREAKPOINT[0] - SCALE_BREAKPOINT[1]) + SCALE_BREAKPOINT[1];
            opacity = Math.abs(multiplier) * (OPACITY_BREAKPOINT[0] - OPACITY_BREAKPOINT[1]) + OPACITY_BREAKPOINT[1];
        } else {
            left = multiplier * (LEFT_BREAKPOINT[1] - LEFT_BREAKPOINT[2]) + Math.sign(multiplier) * LEFT_BREAKPOINT[2];
            scale = Math.abs(multiplier) * (SCALE_BREAKPOINT[1] - SCALE_BREAKPOINT[2]) + SCALE_BREAKPOINT[2];
            opacity = Math.abs(multiplier) * (OPACITY_BREAKPOINT[1] - OPACITY_BREAKPOINT[2]) + OPACITY_BREAKPOINT[2];
        }

        return {
            transform: `translateY(-50%) scale(${scale}, ${scale})`,
            left: `${left}%`,
            opacity: opacity
        }
    }

    componentDidMount () {
        const { img, slideImageSetLoaded, id } = this.props;

        if (img && !this.state.imgLoaded) {
            setTimeout(() => {
                const image = new Image();

                image.addEventListener('load', () => {
                    slideImageSetLoaded(id);

                    this.setState({
                        imgLoaded: true
                    })
                });

                image.src = img
            }, 1000)
        }
    }

    imgLoad = () => {
        setTimeout(() => {
            this.imgTeg.classList.add(styles.show)
        }, 15)
    };

    render () {
        const { text, title, name, img } = this.props;
        const { imgLoaded } = this.state;

        return (
            <div className={styles.slide} style={this.slidePosition()}>
                <div className={styles.content}>
                    <p className={styles.text}>{text}</p>
                    <div className={styles.description}>
                        <h3 className={styles.title}>{title}</h3>
                        {title && name && <div className={styles.line} />}
                        <p className={styles.name}>{name}</p>
                    </div>
                </div>
                {img && <div className={styles.imageContainer}>
                    {imgLoaded && <img className={styles.image}
                                       ref={imgTeg => this.imgTeg = imgTeg}
                                       src={img}
                                       alt={name}
                                       onLoad={this.imgLoad}/>}

                    <img className={styles.loader + (imgLoaded ? ' ' + styles.hide : '')}
                         src={loader}
                         alt="loader"/>
                </div>}
            </div>
        )
    }
}