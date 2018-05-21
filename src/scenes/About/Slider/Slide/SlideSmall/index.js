import React, { Component } from 'react';
import styles from './SlideSmall.scss';
import stylesSlideBig from '../SlideBig/SlideBig.scss';
import loader from '../../../../../generals/photoLoader/index';

export default class SlideSmall extends Component {
    constructor (props) {
        super(props);

        this.state = {
            imgLoaded: props.imgLoaded
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
            this.imgTeg.classList.add(stylesSlideBig.show)
        }, 15)
    };

    render () {
        const { text, name, img } = this.props;
        const { imgLoaded } = this.state;

        return (
            <div className={styles.slide}>
                {img && <div className={styles.imageContainer}>
                    {imgLoaded && <img className={stylesSlideBig.image + ' ' + styles.image}
                                       ref={imgTeg => this.imgTeg = imgTeg}
                                       src={img}
                                       alt={name}
                                       onLoad={this.imgLoad}/>}

                    <img className={stylesSlideBig.loader + (imgLoaded ? ' ' + stylesSlideBig.hide : '')}
                         src={loader}
                         alt="loader"/>
                </div>}
                {name && text && <div className={styles.line}/>}
                {name && <p className={styles.name}>{name}</p>}
                <p className={styles.text}>{text}</p>
            </div>
        )
    }
}

export class SlideSmallWrapper extends Component {
    slidePosition () {
        const { slide, currentSlide } = this.props;

        if (slide > currentSlide + 1) return stylesSlideBig.doubleRight;
        if (slide < currentSlide - 1) return stylesSlideBig.doubleLeft;

        if (slide > currentSlide) return stylesSlideBig.right;
        if (slide < currentSlide) return stylesSlideBig.left;

        return ''
    }

    render () {
        return (
            <div className={stylesSlideBig.slide + ' ' + this.slidePosition()}>
                {this.props.children}
            </div>
        )
    }
}