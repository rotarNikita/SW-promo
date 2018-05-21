import React, { Component } from 'react';
import styles from './SlideBig.scss';
import loader from '../../../../../generals/photoLoader/index';

export default class SlideBig extends Component {
    constructor (props) {
        super(props);

        this.state = {
            imgLoaded: props.imgLoaded
        }
    }

    slidePosition () {
        const { slide, currentSlide } = this.props;

        if (slide > currentSlide + 1) return styles.doubleRight;
        if (slide < currentSlide - 1) return styles.doubleLeft;

        if (slide > currentSlide) return styles.right;
        if (slide < currentSlide) return styles.left;

        return ''
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
            <div className={styles.slide + ' ' + this.slidePosition()}>
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