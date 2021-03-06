import React, { PureComponent } from 'react';
import styles from './NavItem.scss';
import slideStyles from '../../Slide/Slide.scss';

export default class NavItem extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            load: props.slide.loaded
        }
    }

    componentDidMount() {
        if (this.props.slide.resources.image) {
            this.loadImage();
        }
    }

    loadImage() {
        const image = new Image();

        image.addEventListener('load', this.hideLoader);

        image.src = this.props.slide.resources.image;
    }

    hideLoader = () => {
        this.setState({load: true});
    };

    render() {
        const { slide, active, ...restProps } = this.props;
        const { load } = this.state;
        const { resources } = slide;

        return (
            <li {...restProps} className={`${styles.item} ${active ? styles.active : ''}`}>
                {resources.image &&
                <img className={`${slideStyles.media} ${slideStyles.image}`}
                     src={load ? resources.image : ''}/>}
                {resources.videos.length &&
                !resources.image &&
                <video className={`${slideStyles.media} ${slideStyles.video}`}
                       onCanPlayThrough={this.hideLoader}
                       autoPlay
                       muted
                       loop
                       playsInline>
                    {resources.videos}
                </video>}
            </li>
        )
    }
}