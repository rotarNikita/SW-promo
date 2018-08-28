import React, { Component, Fragment } from 'react';
import styles from './Video.scss';
import { createPortal } from 'react-dom';
import video from '../../../../data/main-video.mp4';

export default class Video extends Component {
    constructor(props) {
        super(props);

        this.state = {
            play: false,
            modalMount: false
        };

        this.modal = document.createElement('div')
    }

    openVideo = () => {
      this.setState({play: true, modalMount: true})
    };

    stopVideo = () => {
      this.setState({play: false})
    };

    closeVideo = () => {
        if (this.state.play === false)
            this.setState({
                modalMount: false
            })
    };

    componentDidMount() {
        document.getElementById('popups').appendChild(this.modal)
    }

    componentWillUnmount() {
        document.getElementById('popups').removeChild(this.modal)
    }

    render() {
        const { play, modalMount } = this.state;

        return (
            <Fragment>
                <div className={styles.button} onClick={this.openVideo}/>
                {modalMount && createPortal((
                    <div className={styles.wrapper + ' ' + (!play ? styles.close : '')} onTransitionEnd={this.closeVideo}>
                        <div className={styles.overlay} onClick={this.stopVideo}/>
                        <div className={styles.videoBlock}>
                            <video autoPlay controls>
                                <source src={video} type="video/mp4"/>
                            </video>
                        </div>
                    </div>
                ), this.modal)}
            </Fragment>
        )
    }
}