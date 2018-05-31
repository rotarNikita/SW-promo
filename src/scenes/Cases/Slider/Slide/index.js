import React, { PureComponent } from 'react';
import styles from './Slide.scss';
import loader from '../../../../generals/photoLoader';

export default class Slide extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            load: props.loaded
        };

        this.resources = {
            videos: [],
            image: null
        };

        this.checkResources();
    }

    componentDidMount() {
        if (!this.resources.videos.length) {
            this.loadImage();
        }
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
            if (/video/.test(sources[i].type)) {
                resources.videos.push(<source key={sources[i].src}
                                              src={sources[i].src}
                                              type={sources[i].type}/>)
            } else if (/image/.test(sources[i].type)) {
                resources.image = sources[i].src
            }
        }
    }

    hideLoader = () => {
        this.setState({load: true});
        this.props.onLoad();
    };

    render() {
        const { data } = this.props;
        const { resources } = this;
        const { load } = this.state;

        return (
            <div className={styles.slide} ref={slide => this.DOMElement = slide}>
                <div className={styles.inner}>
                    {resources.videos.length &&
                    <video className={`${styles.media} ${styles.video}`}
                           onCanPlayThrough={this.hideLoader}
                           autoPlay
                           muted
                           loop
                           playsInline>
                        {resources.videos}
                    </video>}
                    {!resources.videos.length &&
                    resources.image &&
                    <img className={`${styles.media} ${styles.image}`}
                         src={load ? resources.image : ''}
                         alt={data.title}/>}
                    {!load && <div className={`${styles.media} ${styles.loader}`}>
                        <div className={styles.loaderInner} style={{backgroundImage: `url(${loader})`}}/>
                    </div>}
                    {load && <div className={`${styles.media} ${styles.description}`}>
                        <div className={styles.title}>
                            {data.title}
                            <br/>
                            <div className={styles.subtitle}>{data.subtitle}</div>
                        </div>
                        {data.link && <a className={styles.link} href={data.link}>DISCOVER</a>}
                    </div>}
                </div>
            </div>
        )
    }
}