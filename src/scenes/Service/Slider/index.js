import React, { Component } from 'react';
import styles from './Slider.scss';
import NaNimate from '../../../generals/NaNimate';
import Dots from './Dots';
import Scroll from "../../../actions/Scroll";
import { PAGE_TRANSITION_TIME } from "../../../data/constants";
import Header from '../../../components/Header';
import Lng from '../../../components/Header/Menu/Lng';
import MQC from '../../../actions/MediaQueryChecker';
import Loader from '../../../components/Loader';

const ANIMATION_DURATION = {
    scroll: PAGE_TRANSITION_TIME,
    swipe: 500
};

const ANIMATION_TIMING_FUNCTION = {
    scroll: 'easeInOutQuad',
    swipe: t => -t * t + 2 * t
};

export default class Slider extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentSlide: 1
        };

        this.dataScroll ={
            scroll: true,
            timeout: null,
            get globalRight() { return Scroll.rightScrollAllow },
            set globalRight(val) { Scroll.rightScrollAllow = val },
            get globalLeft() { return Scroll.leftScrollAllow },
            set globalLeft(val) { Scroll.leftScrollAllow = val }
        };

        this.dataScroll.globalRight = false;
        this.dataScroll.globalLeft = false;

        this.dataAnimation = new NaNimate({
            duration: ANIMATION_DURATION.swipe,
            timingFunction: ANIMATION_TIMING_FUNCTION.scroll,
            progressFunction: () => {},
            callback: () => {
                this.positionX = this.newPositionX;
                this.dataScroll.delta = 0;
            }
        });

        this.currentSlide = 1;
        this.width = 0;
        this.dataSlides = [];
        this.stopAnimation = null;
        this.slideFrom = window.innerWidth >= 1201 ? 1 : 0;
        this.sensitiveTouch = window.innerWidth >= 1201 ? 2 : 10;

        this.startX = 0;
        this.newStartX = 0;
        this.positionX = 0;
        this.newPositionX = 0;

        this.pageTitle = null;
        this.pageTitleMask = null;
        this.pageTitleMaskWidth = ({ru: 67, en: 83})[Lng.currentLng];
        this.pageTitleMaskHeight = 14;
        this.pageTitleMaskLeft = (window.innerWidth - this.pageTitleMaskWidth) / 2;

        this.titlePrev = null;
        this.titlePrevMask = null;
        this.titlePrevMaskWidth = 102;
        this.titlePrevMaskHeight = 24;
        this.titlePrevMaskLeft = 0;

        this.menuButton = null;
        this.menuButtonMask = null;
        this.menuButtonMaskWidth = 38;
        this.menuButtonMaskHeight = 25;
        this.menuButtonMaskLeft = 0;

        this.titleNext = null;
        this.titleNextMask = null;
        this.titleNextMaskWidth = ({ru: 109, en: 108})[Lng.currentLng];
        this.titleNextMaskHeight = 24;
        this.titleNextMaskRight = 0;

        try {
            this.titlePrevMaskLeft = (window.innerWidth - document.querySelector('.container').offsetWidth) / 2 + 20;
            this.titleNextMaskRight = this.titlePrevMaskLeft;
            this.menuButtonMaskLeft = this.titlePrevMaskLeft - 10;
        } catch (e) {
            document.addEventListener('DOMContentLoaded', () => {
                this.titlePrevMaskLeft = (window.innerWidth - document.querySelector('.container').offsetWidth) / 2 + 20;
                this.titleNextMaskRight = this.titlePrevMaskLeft;
                this.menuButtonMaskLeft = this.titlePrevMaskLeft - 10;
            })
        }

        this.MQCIDs = MQC.addResizeChecker({
            callback: () => {
                this.trackWidthCalc();

                this.pageTitleMaskLeft = (window.innerWidth - this.pageTitleMaskWidth) / 2;
                this.titlePrevMaskLeft = (window.innerWidth - document.querySelector('.container').offsetWidth) / 2 + 20;
                this.menuButtonMaskLeft = this.titlePrevMaskLeft - 10;

                this.pageTitleMaskSetClip();

                this.slideFrom = window.innerWidth >= 1201 ? 1 : 0;
                this.sensitiveTouch = window.innerWidth >= 1201 ? 2 : 10;

                this.goTo(this.currentSlide - 1);
            }
        })
    }
    
    menuOpenCallback = () => {
        this.pageTitleMask.style.clip = `rect(0, ${this.pageTitleMaskWidth}px, ${this.pageTitleMaskHeight}px, 100vw)`;
        this.menuButtonMask.style.clip = `rect(0, ${this.menuButtonMaskWidth}px, ${this.menuButtonMaskHeight}px, 100vw)`;
    };
    
    menuCloseCallback = () => {
        this.titleNextMaskWidth = ({ru: 109, en: 108})[Lng.currentLng];
        this.initTitleNextMask();

        this.dragStart({clientX: 0});
        this.move({clientX: 0});
        this.dragStop({clientX: 0});
        this.dataAnimation.stop(true);

        this.pageTitleMaskWidth = ({ru: 67, en: 83})[Lng.currentLng];
        this.pageTitleMaskLeft = (window.innerWidth - this.pageTitleMaskWidth) / 2;

        let left = this.dataSlides[0].width + this.newPositionX - this.pageTitleMaskLeft;

        left = left > 0 ? '100vw' : '-100vw';

        this.pageTitleMask.style.clip = `rect(0, ${this.pageTitleMaskWidth + 100}px, ${this.pageTitleMaskHeight}px, ${left})`;
    };

    initMenuButtonMask() {
        this.menuButton = document.getElementById('menuButton');

        this.menuButtonMask = document.createElement('span');
        this.menuButtonMask.innerHTML = this.menuButton.innerHTML;
        this.menuButtonMask.style.position = 'absolute';
        this.menuButtonMask.style.top = '0';
        this.menuButtonMask.style.left = '0';
        this.menuButtonMask.style.right = '0';
        this.menuButtonMask.style.bottom = '0';
        this.menuButtonMask.style.zIndex = '1';
        this.menuButtonMask.style.clip = `rect(0, ${this.menuButtonMaskWidth}px, ${this.menuButtonMaskHeight}px, ${this.menuButtonMaskWidth}px)`;

        for (let i = 0; i < this.menuButtonMask.children.length; i++)
            this.menuButtonMask.children[i].style.backgroundColor = '#000000';

        this.menuButton.appendChild(this.menuButtonMask);
    }

    menuButtonMaskSetClip() {
        const left = this.dataSlides[0].width + this.newPositionX - this.menuButtonMaskLeft;

        this.menuButtonMask.style.clip = `rect(0, ${this.menuButtonMaskWidth}px, ${this.menuButtonMaskHeight}px, ${left}px)`;
    }

    initTitleNextMask() {
        this.titleNext = document.getElementById('titleNext').children[0];

        this.titleNextMask = document.createElement('span');
        this.titleNextMask.innerHTML = this.titleNext.innerHTML;
        this.titleNextMask.style.position = 'absolute';
        this.titleNextMask.style.top = '50%';
        this.titleNextMask.style.left = '50%';
        this.titleNextMask.style.whiteSpace = 'nowrap';
        this.titleNextMask.style.transform = 'translate(-50%, -50%)';
        this.titleNextMask.style.color = '#000000';
        this.titleNextMask.style.zIndex = '1';
        this.titleNextMask.style.clip = `rect(0, ${this.titleNextMaskWidth}px, ${this.titleNextMaskHeight}px, ${this.titleNextMaskWidth}px)`;

        this.titleNext.appendChild(this.titleNextMask);
    }

    titleNextMaskSetClip() {
        const left = this.dataSlides[0].width + this.newPositionX - (window.innerWidth - this.titleNextMaskWidth);

        this.titleNextMask.style.clip = `rect(0, ${this.titleNextMaskWidth}px, ${this.titleNextMaskHeight}px, ${left}px)`;
    }

    initTitlePrevMask() {
        this.titlePrev = document.getElementById('titlePrev').children[0];

        this.titlePrevMask = document.createElement('span');
        this.titlePrevMask.innerHTML = this.titlePrev.innerHTML;
        this.titlePrevMask.style.position = 'absolute';
        this.titlePrevMask.style.top = '50%';
        this.titlePrevMask.style.left = '50%';
        this.titlePrevMask.style.whiteSpace = 'nowrap';
        this.titlePrevMask.style.transform = 'translate(-50%, -50%)';
        this.titlePrevMask.style.color = '#000000';
        this.titlePrevMask.style.zIndex = '1';
        this.titlePrevMask.style.clip = `rect(0, ${this.titlePrevMaskWidth}px, ${this.titlePrevMaskHeight}px, ${this.titlePrevMaskWidth}px)`;

        this.titlePrev.appendChild(this.titlePrevMask);
    }

    initTitlePrevMaskTimeout = () => {
        setTimeout(() => {
            this.initTitlePrevMask();
        }, 15)
    };

    titlePrevMaskSetClip() {
        const left = this.dataSlides[0].width + this.newPositionX - this.titlePrevMaskLeft;

        this.titlePrevMask.style.clip = `rect(0, ${this.titlePrevMaskWidth}px, ${this.titlePrevMaskHeight}px, ${left}px)`;
    }

    initPageTitleMask() {
        this.pageTitle = document.getElementById('pageTitle');

        this.pageTitleMask = document.createElement('span');
        this.pageTitleMask.innerHTML = this.pageTitle.innerHTML;
        this.pageTitleMask.style.position = 'absolute';
        this.pageTitleMask.style.top = '50%';
        this.pageTitleMask.style.left = '50%';
        this.pageTitleMask.style.transform = 'translate(-50%, -50%)';
        this.pageTitleMask.style.color = '#000000';
        this.pageTitleMask.style.zIndex = '1';
        this.pageTitleMask.style.clip = `rect(0, ${this.pageTitleMaskWidth}px, ${this.pageTitleMaskHeight}px, ${this.pageTitleMaskWidth}px)`;

        this.pageTitle.appendChild(this.pageTitleMask);
    }

    initPageTitleMaskTimeout = () => {
        setTimeout(() => {
            this.initPageTitleMask();
        }, 15)
    };

    pageTitleMaskSetClip() {
        const left = this.dataSlides[0].width + this.newPositionX - this.pageTitleMaskLeft;

        this.pageTitleMask.style.clip = `rect(0, ${this.pageTitleMaskWidth}px, ${this.pageTitleMaskHeight}px, ${left}px)`;
    }

    onLoad = () => {
        this.trackWidthCalc();

        this.initPageTitleMask();
        this.initTitlePrevMask();
        this.initMenuButtonMask();
        this.initTitleNextMask();

        this.titleNextMaskSetClip();

        Header.openCallback = this.menuOpenCallback;
        Header.closeCallback = this.menuCloseCallback;

        if (MQC.isTouchDevice) window.addEventListener('touchend', this.dragStop);
        else window.addEventListener('mouseup', this.dragStop);
    };

    componentDidMount() {
        if (!Loader.addListener('startHide', this.onLoad)) setTimeout(this.onLoad, 30);

        Lng.relativeComponentOrCallback = this.initPageTitleMaskTimeout;
        Lng.relativeComponentOrCallback = this.initTitlePrevMaskTimeout;

        this.dataScroll.timeout = setTimeout(() => {
            Scroll.action = this.changeSlideByScroll;
        }, PAGE_TRANSITION_TIME)
    }

    changeSlideByScroll = event => {
        const { dataScroll, dataAnimation, dataSlides, currentSlide} = this;

        clearTimeout(dataScroll.timeout);
        dataAnimation.stop(true);

        dataScroll.globalRight = false;
        dataScroll.globalLeft = false;

        const delta = event.deltaX !== 0 ? event.deltaX : -event.deltaY;

        this.positionX += delta;

        const leftBound = 0;
        const rightBound = -dataSlides[dataSlides.length - 1].left - dataSlides[dataSlides.length - 1].width + window.innerWidth;

        if (this.positionX < rightBound) {
            if (currentSlide === dataSlides.length - 1 && dataScroll.scroll)
                dataScroll.globalRight = true;

            this.positionX = rightBound;

            dataScroll.timeout = setTimeout(() => {
                dataScroll.scroll = true;
            }, 30);
        } else if (this.positionX > leftBound) {
            if (currentSlide === this.slideFrom && dataScroll.scroll)
                dataScroll.globalLeft = true;

            this.positionX = leftBound;

            dataScroll.timeout = setTimeout(() => {
                dataScroll.scroll = true;
            }, 30);
        } else {
            dataScroll.timeout = setTimeout(() => {
                this.animateSlide()
            }, 30)
        }

        dataScroll.scroll = false;

        if (delta < 0) this.chooseCurrentSlideNext();
        else if (delta > 0) this.chooseCurrentSlidePrev();
        else this.chooseCurrentSlide();

        this.setState({currentSlide: this.currentSlide});

        this.newPositionX = this.positionX;
        this.track.style.left = this.positionX + 'px';

        this.pageTitleMaskSetClip();
        this.titlePrevMaskSetClip();
        this.menuButtonMaskSetClip();
        this.titleNextMaskSetClip();
    };

    trackWidthCalc() {
        const { children } = this.track;
        let width = 0;

        this.track.style.width = 'unset';
        this.dataSlides = [];

        for (let i = 0; i < children.length; i++) {
            let slideWidth = children[i].offsetWidth;
            let slideLeft = width;

            width += slideWidth;

            let dataSlide = {
                width: slideWidth,
                left: slideLeft
            };

            this.dataSlides.push(dataSlide);
        }

        this.width = width;
    };

    dragStart = event => {
        this.dataAnimation.stop(true);
        this.dataAnimation.callback();

        this.startX = event.clientX !== undefined ? event.clientX : event.touches[0].clientX;
        this.newStartX = 0;
        this._dragStartBool = true;
        this.dataScroll.scroll = false;

        if (MQC.isTouchDevice) window.addEventListener('touchmove', this.move);
        else window.addEventListener('mousemove', this.move)
    };

    dragStop = event => {
        if (MQC.isTouchDevice) window.removeEventListener('touchmove', this.move);
        else window.removeEventListener('mousemove', this.move);

        if (this._dragStartBool) {
            const endX = event.clientX !== undefined ? event.clientX : event.changedTouches[0].clientX;

            this.dataAnimation.duration = ANIMATION_DURATION.swipe;
            this.dataAnimation.timingFunction = ANIMATION_TIMING_FUNCTION.swipe;

            this._dragStartBool = false;
            this.dataScroll.scroll = true;
            this.positionX = this.newPositionX;
            this.chooseCurrentSlide(this.startX - endX);
            this.animateSlide();
            this.setState({currentSlide: this.currentSlide})
        }
    };

    goTo = slide => {
        this.currentSlide = slide + 1;
        this.animateSlide();
        this.setState({currentSlide: this.currentSlide})
    };

    animateSlide() {
        const { dataAnimation } = this;

        dataAnimation.stop(true);

        const deltaX = -(this.dataSlides[this.currentSlide].left + this.dataSlides[this.currentSlide].width - window.innerWidth) - this.positionX;

        dataAnimation.progressFunction = progress => {
            try {
                this.newPositionX = this.positionX + deltaX * progress;
                this.track.style.left = this.newPositionX + 'px';
                this.pageTitleMaskSetClip();
                this.titlePrevMaskSetClip();
                this.menuButtonMaskSetClip();
                this.titleNextMaskSetClip();
            } catch (e) {
                dataAnimation.stop(true);
            }
        };

        dataAnimation.start()
    }

    chooseCurrentSlide(swipeLeftOrRight) {
        for (let i = this.dataSlides.length - 1; i >= this.slideFrom; i--) {
            this.currentSlide = i;
            if (window.innerWidth - this.positionX >= this.dataSlides[i].left + this.dataSlides[i].width / (swipeLeftOrRight >= 0 ? this.sensitiveTouch : this.sensitiveTouch / (this.sensitiveTouch - 1)))
                break;
        }
    }

    chooseCurrentSlideNext() {
        for (let i = this.dataSlides.length - 1; i >= this.slideFrom; i--) {
            this.currentSlide = i;
            if (window.innerWidth - this.positionX >= this.dataSlides[i].left)
                break;
        }
    }

    chooseCurrentSlidePrev() {
        for (let i = this.dataSlides.length - 1; i >= this.slideFrom; i--) {
            this.currentSlide = i - 1;
            if (window.innerWidth - this.positionX >= this.dataSlides[i].left)
                break;
        }
    }

    move = event => {
        const clientX = event.clientX !== undefined ? event.clientX : event.touches[0].clientX;

        let newPositionX = this.positionX + (clientX - this.startX) * 0.7;

        if (newPositionX >= 0 || this.width + newPositionX <= window.innerWidth) {
            if (!this.newStartX) this.newStartX = clientX
        }

        if (newPositionX >= 0) {
            newPositionX = 0 + (clientX - this.newStartX) / 5;
        }

        if (this.width + newPositionX <= window.innerWidth) {
            newPositionX = window.innerWidth - this.width + (clientX - this.newStartX) / 5;
        }

        this.newPositionX = newPositionX;
        this.track.style.left = newPositionX + 'px';

        this.pageTitleMaskSetClip();
        this.titlePrevMaskSetClip();
        this.menuButtonMaskSetClip();
        this.titleNextMaskSetClip();
    };

    componentWillUnmount() {
        window.removeEventListener('mouseup', this.dragStop);
        window.removeEventListener('touchend', this.dragStop);

        this.menuButton.removeChild(this.menuButtonMask);

        Scroll.action.remove(this.changeSlideByScroll);
        clearTimeout(this.dataScroll.timeout);
        this.dataScroll.scroll = false;
        this.dataScroll.globalRight = true;
        this.dataScroll.globalLeft = true;

        this.dataAnimation.stop();

        Header.openCallback.remove(this.menuOpenCallback);
        Header.closeCallback.remove(this.menuCloseCallback);

        Lng.relativeComponentOrCallback.remove(this.initPageTitleMaskTimeout);
        Lng.relativeComponentOrCallback.remove(this.initTitlePrevMaskTimeout);

        MQC.removeResizeChecker(this.MQCIDs);
    }

    render() {
        const { currentSlide } = this.state;
        const { children } = this.props;
        const currentPage = window.location.pathname === '/service';

        return (
            <div onMouseDown={this.dragStart}
                 onTouchStart={this.dragStart}
                 draggable={false}
                 onDrag={() => false}
                 className={styles.wrapper}
                 ref={track => this.track = track}>
                {children}
                <Dots currentSlide={currentSlide - 1}
                      sliderLength={children[1].length}
                      mount={currentPage}
                      goTo={slide => {
                          this.dataAnimation.timingFunction = ANIMATION_TIMING_FUNCTION.swipe;
                          this.dataAnimation.duration = ANIMATION_DURATION.swipe;
                          this.goTo(slide)
                      }}/>
            </div>

        )
    }
}
