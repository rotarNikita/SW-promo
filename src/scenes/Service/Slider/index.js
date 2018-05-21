import React, { Component } from 'react';
import styles from './Slider.scss';
// import animate from '../../../generals/animate';
import NaNimate from '../../../generals/NaNimate';
import Dots from './Dots';
import Scroll from "../../../actions/Scroll";
import { PAGE_TRANSITION_TIME } from "../../../data/constants";

const ANIMATION_DURATION = {
    scroll: PAGE_TRANSITION_TIME,
    swipe: 300
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
            timingFunction: ANIMATION_TIMING_FUNCTION.swipe,
            progressFunction: () => {},
            callback: () => { this.positionX = this.newPositionX }
        });

        this.currentSlide = 1;
        this.width = 0;
        this.dataSlides = [];
        this.stopAnimation = null;

        this.startX = 0;
        this.newStartX = 0;
        this.positionX = 0;
        this.newPositionX = 0;

        this.pageTitle = null;
        this.pageTitleMask = null;
        this.pageTitleMaskWidth = 67;
        this.pageTitleMaskHeight = 11;
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

        try {
            this.titlePrevMaskLeft = (window.innerWidth - document.querySelector('.container').offsetWidth) / 2 + 20;
            this.menuButtonMaskLeft = this.titlePrevMaskLeft - 10;
        } catch (e) {
            document.addEventListener('DOMContentLoaded', () => {
                this.titlePrevMaskLeft = (window.innerWidth - document.querySelector('.container').offsetWidth) / 2 + 20;
                this.menuButtonMaskLeft = this.titlePrevMaskLeft - 10;
            })
        }
    }

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

    initTitlePrevMask() {
        this.titlePrev = document.getElementById('titlePrev').children[0];

        this.titlePrevMask = document.createElement('span');
        this.titlePrevMask.innerHTML = this.titlePrev.innerHTML;
        this.titlePrevMask.style.position = 'absolute';
        this.titlePrevMask.style.top = '50%';
        this.titlePrevMask.style.left = '50%';
        this.titlePrevMask.style.transform = 'translate(-50%, -50%)';
        this.titlePrevMask.style.color = '#000000';
        this.titlePrevMask.style.zIndex = '1';
        this.titlePrevMask.style.clip = `rect(0, ${this.titlePrevMaskWidth}px, ${this.titlePrevMaskHeight}px, ${this.titlePrevMaskWidth}px)`;

        this.titlePrev.appendChild(this.titlePrevMask);
    }

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

    pageTitleMaskSetClip() {
        const left = this.dataSlides[0].width + this.newPositionX - this.pageTitleMaskLeft;

        this.pageTitleMask.style.clip = `rect(0, ${this.pageTitleMaskWidth}px, ${this.pageTitleMaskHeight}px, ${left}px)`;
    }

    componentDidMount() {
        setTimeout(() => {
            this.trackWidthCalc();

            this.initPageTitleMask();
            this.initTitlePrevMask();
            this.initMenuButtonMask();

            window.addEventListener('mouseup', this.dragStop);
        }, 15);

        this.dataScroll.timeout = setTimeout(() => {
            Scroll.action = this.changeSlideByScroll;
        }, PAGE_TRANSITION_TIME)
    }

    changeSlideByScroll = event => {
        const { dataScroll, dataAnimation } = this;

        dataScroll.globalRight = false;
        dataScroll.globalLeft = false;

        if (dataScroll.scroll) {
            dataScroll.scroll = false;

            dataAnimation.duration = ANIMATION_DURATION.scroll;
            dataAnimation.timingFunction = ANIMATION_TIMING_FUNCTION.scroll;

            if (event.deltaY > 0 && (this.currentSlide + 1 <= this.dataSlides.length - 1)) this.goTo(this.currentSlide);
            else if (this.currentSlide + 1 > this.dataSlides.length - 1) dataScroll.globalRight = true;

            if (event.deltaY < 0 && (this.currentSlide - 1)) this.goTo(this.currentSlide - 2);
            else if (!(this.currentSlide - 1)) dataScroll.globalLeft = true;

            dataScroll.timeout = setTimeout(() => {
                dataScroll.scroll = true;
                dataScroll.globalRight = true;
                dataScroll.globalLeft = true;
            }, PAGE_TRANSITION_TIME)
        }
    };

    trackWidthCalc() {
        const { children } = this.track;
        let width = 0;

        for (let i = 0; i < children.length; i++) {
            let slideWidth = children[i].offsetWidth;
            let slideLeft = width;

            width += slideWidth;
            children[i].style.width = slideWidth + 'px';

            let dataSlide = {
                width: slideWidth,
                left: slideLeft
            };

            this.dataSlides.push(dataSlide);
        }

        this.width = width;
        this.track.style.width = width + 'px';
    };

    dragStart = event => {
        this.dataAnimation.stop(true);
        this.dataAnimation.callback();

        this.startX = event.clientX;
        this.newStartX = 0;
        this._dragStartBool = true;
        this.dataScroll.scroll = false;

        window.addEventListener('mousemove', this.move)
    };

    dragStop = () => {
        window.removeEventListener('mousemove', this.move);

        if (this._dragStartBool) {
            this.dataAnimation.duration = ANIMATION_DURATION.swipe;
            this.dataAnimation.timingFunction = ANIMATION_TIMING_FUNCTION.swipe;

            this._dragStartBool = false;
            this.dataScroll.scroll = true;
            this.positionX = this.newPositionX;
            this.chooseCurrentSlide();
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
            } catch (e) {
                dataAnimation.stop(true);
            }
        };

        dataAnimation.start()
    }

    chooseCurrentSlide() {
        for (let i = this.dataSlides.length - 1; i >= 1; i--) {
            this.currentSlide = i;
            if (window.innerWidth - this.positionX >= this.dataSlides[i].left + this.dataSlides[i].width / 2)
                break;
        }
    }

    move = event => {
        let newPositionX = this.positionX + (event.clientX - this.startX) * 0.7;

        if (newPositionX >= 0 || this.width + newPositionX <= window.innerWidth) {
            if (!this.newStartX) this.newStartX = event.clientX
        }

        if (newPositionX >= 0) {
            newPositionX = 0 + (event.clientX - this.newStartX) / 5;
        }

        if (this.width + newPositionX <= window.innerWidth) {
            newPositionX = window.innerWidth - this.width + (event.clientX - this.newStartX) / 5;
        }

        this.newPositionX = newPositionX;
        this.track.style.left = newPositionX + 'px';

        this.pageTitleMaskSetClip();
        this.titlePrevMaskSetClip();
        this.menuButtonMaskSetClip();
    };

    componentWillUnmount() {
        window.removeEventListener('mouseup', this.dragStop);

        this.menuButton.removeChild(this.menuButtonMask);

        Scroll.action.remove(this.changeSlideByScroll);
        clearTimeout(this.dataScroll.timeout);
        this.dataScroll.scroll = false;
        this.dataScroll.globalRight = true;
        this.dataScroll.globalLeft = true;

        this.dataAnimation.stop();
    }

    render() {
        const { currentSlide } = this.state;
        const { children } = this.props;
        const currentPage = window.location.pathname === '/service';

        return (
            <div onMouseDown={this.dragStart}
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
