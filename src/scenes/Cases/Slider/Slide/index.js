import React, { PureComponent } from 'react';
import styles from './Slide.scss';
import loader from '../../../../generals/photoLoader';
import PropsTypes from 'prop-types';
import MQC from '../../../../actions/MediaQueryChecker';

export default class Slide extends PureComponent {
    constructor(props, context) {
        super(props, context);

        this.state = {
            load: props.loaded,
            size: 'M'
        };

        if (window.innerWidth > 768) this.state.size = 'M';
        else this.state.size = 'S';

        this.resources = {
            videos: [],
            image: null
        };

        this.checkResources();

        this.MQCIDs = MQC.addResizeChecker({
            from: 769,
            callback: this.setState.bind(this, {size: 'M'})
        }, {
            to: 768,
            callback: this.setState.bind(this, {size: 'S'})
        })
    }

    componentDidMount() {
        if (this.resources.image) {
            this.loadImage();
        }
    }

    componentWillUnmount() {
        MQC.removeResizeChecker(this.MQCIDs)
    }

    loadImage() {
        const image = new Image();

        image.addEventListener('load', this.hideLoader);

        image.src = this.resources.image;
    }

    checkResources() {
        const { sources } = this.props.data;
        const { resources } = this;

        for (let i = 0; i < sources.length; i++) {
            if (/video/.test(sources[i].type))
                resources.videos.push(<source key={sources[i].src}
                                              src={sources[i].src}
                                              type={sources[i].type}/>);

            if (/image/.test(sources[i].type))
                resources.image = sources[i].src
        }
    }

    hideLoader = () => {
        this.setState({load: true});
        this.props.onLoad();
    };

    static contextTypes = {
        slideClick: PropsTypes.func
    };

    static renderDescription({ data }) {
        return (
            <div className={`${window.innerWidth > 768 ? styles.media : ''} ${styles.description}`}>
                <div className={styles.title}>
                    {data.title}
                    <br/>
                    <div className={styles.subtitle}>{data.subtitle}</div>
                </div>
                {data.link && <a className={styles.link}
                                 target="_blank"
                                 href={data.link}>DISCOVER</a>}
            </div>
        )
    }

    render() {
        const { data, slideIndex } = this.props;
        const { resources } = this;
        const { load , size } = this.state;
        const { slideClick } = this.context;

        return (
            <div className={styles.slide} ref={slide => this.DOMElement = slide}>
                <div onClick={slideClick.bind(null, slideIndex)} className={styles.inner}>
                    {resources.videos.length !== 0 &&
                    (!MQC.isTouchDevice || !resources.image) &&
                    <video className={styles.media}
                           onCanPlayThrough={this.hideLoader}
                           autoPlay
                           muted
                           loop
                           playsInline>
                        {resources.videos}
                    </video>}
                    {(!resources.videos.length || MQC.isTouchDevice) &&
                    resources.image &&
                    <img className={`${styles.media} ${styles.image}`}
                         alt={data.title}
                         src={load ? resources.image : ''}/>}
                    {!load && <div className={`${styles.media} ${styles.loader}`}>
                        <div className={styles.loaderInner} style={{backgroundImage: `url(${loader})`}}/>
                    </div>}
                    {size === 'M' && load && Slide.renderDescription(this.props)}
                </div>
                {size === 'S' && Slide.renderDescription(this.props)}
            </div>
        )
    }
}