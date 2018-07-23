import React, { Component } from 'react';
import { MAIN_COLOR_1, MAIN_COLOR_2 } from "../../../data/constants";
import styles from './Logo.scss';
import generateKey from '../../../generals/generateKey';
import NaNimate from '../../../generals/NaNimate';
import Loader from '../../../components/Loader';
import MQC from '../../../actions/MediaQueryChecker';

const DELTA_ANGLE = 30;
const DELTA_TRANSLATE = 70;


export default class Logo extends Component {
    constructor (props) {
        super(props);

        this.movementData.progressByPx = this.polygonsQueue.length / window.innerWidth
    }

    state = {
        update: false,
        polygons: [],
        rotateX: 0,
        rotateY: 0,
        translateX: 0,
        translateY: 0
    };

    animationData = {
        queue: [],
        globalProgress: 0,
    };

    movementData = {
        startX: 0,
        relativePositionX: 0,
        endX: 0,
        canMove: false,
        startProgress: 0,
        endProgress: 0,
        progressByPx: 0,
    };

    logoId = 'mainPageLogo__' + generateKey();

    componentWillUnmount() {
        this.eventListeners('remove');

        this.actionOnCurrentQueueAnimation('stop');
    }

    eventListeners(action) {
        if (MQC.isTouchDevice) {
            window[action + 'EventListener']('deviceorientation', this.rotateLogo);
            window[action + 'EventListener']('touchstart', this.mouseDown);
            window[action + 'EventListener']('touchmove', this.mouseMove);
            window[action + 'EventListener']('touchend', this.mouseUp);
        } else {
            window[action + 'EventListener']('mousemove', this.rotateLogo);
            window[action + 'EventListener']('mousedown', this.mouseDown);
            window[action + 'EventListener']('mousemove', this.mouseMove);
            window[action + 'EventListener']('mouseup', this.mouseUp);
        }
    }

    startLogoAnimation = () => {
        this.animatePolygonsQueue();

        this.eventListeners('add');
    };

    componentDidMount () {
        if (!Loader.addListener('startHide', this.startLogoAnimation)) {
            this.eventListeners('add');

            const length = this.polygonsQueue.length;

            this.animatePolygonsQueue();
            this.actionOnCurrentQueueAnimation('pause');

            for (let i = 0; i < length; i++)
                this.addStream(i)

            this.animationData.globalProgress = length;
        }
    }

    createStarterCasePolygon(fill, from) {
        const idInPolygons = generateKey();

        this.setState(prevState => {
            prevState.polygons[idInPolygons] = {
                fill,
                points: from
            };

            return { polygons: prevState.polygons }
        });

        return idInPolygons
    }

    static calcDeltaBetweenPoints(from, to) {
        const delta = [];

        for (let i = 0; i < from.length; i++) {
            delta[i] = [];

            for (let j = 0; j < from[i].length; j++)
                delta[i][j] = to[i][j] - from[i][j]
        }

        return delta
    }

    createProgressFunctionForPolygonAnimation(from, to, idInPolygons, queueIndex, stream) {
        const delta = Logo.calcDeltaBetweenPoints(from, to);
        const { animationData } = this;

        if (stream === 0) animationData.globalProgress = queueIndex;

        return progress => {
            const newPoints = [];

            for (let i = 0; i < delta.length; i++) {
                newPoints[i] = [];

                for (let j = 0; j < delta[i].length; j++)
                    newPoints[i][j] = from[i][j] + delta[i][j] * progress;
            }

            if (stream === 0) animationData.globalProgress = queueIndex + progress;

            this.setState(prevState => {
                try {
                    prevState.polygons[idInPolygons].points = newPoints;
                } catch(e) {}

                return { polygons: prevState.polygons }
            })
        }
    }

    animatePolygonsQueue(queueIndex = 0, stream = 0) {
        const polygon = this.polygonsQueue[queueIndex] && this.polygonsQueue[queueIndex][stream];

        if (!polygon) return;

        if (stream === 0)
            for (let i = 1; i < this.polygonsQueue[queueIndex].length; i++)
                this.animatePolygonsQueue(queueIndex, i)

        const needAnimate = polygon.animate;
        const { from, to, fill } = polygon;
        const idInPolygons = this.createStarterCasePolygon(fill, from);

        if (needAnimate) {
            const { queue } = this.animationData;

            queue[queueIndex] = queue[queueIndex] || [];

            queue[queueIndex][stream] = new NaNimate({
                duration: 500,
                progressFunction: this.createProgressFunctionForPolygonAnimation(from, to, idInPolygons, queueIndex, stream),
                timingFunction: 'easeInOutQuad',
                callback: () => {
                    if (stream === 0)
                        this.animatePolygonsQueue(queueIndex + 1, stream)
                }
            });

            queue[queueIndex][stream].idInPolygons = idInPolygons;

            queue[queueIndex][stream].start()
        } else if (stream === 0) this.animatePolygonsQueue(queueIndex + 1, stream)
    }

    static pointsToArray(str) {
        return str.split(' ').map(item => item.split(',').map(item => +item))
    }

    polygonsQueue = [
        [
            {
                fill: MAIN_COLOR_1,
                from: Logo.pointsToArray('183.3,226.3 123.4,194.3 123.4,258.2'),
                to: Logo.pointsToArray('183.3,226.3 123.4,194.3 123.4,258.2'),
                animate: false
            }
        ],
        [
            {
                fill: MAIN_COLOR_1,
                from: Logo.pointsToArray('183.3,226.3 123.4,194.3 123.4,258.2'),
                to: Logo.pointsToArray('123.4,194.3 61.4,226.3 123.4,258.2'),
                animate: true
            },
            {
                fill: MAIN_COLOR_2,
                from: Logo.pointsToArray('123.4,194.3 123.4,258.2 183.3,226.3'),
                to: Logo.pointsToArray('220.8,194.1 188.1,257.6 253.6,257.6'),
                animate: true
            }
        ],
        [
            {
                fill: MAIN_COLOR_2,
                from: Logo.pointsToArray('61.4,226.3 123.4,194.3 123.4,258.2'),
                to: Logo.pointsToArray('61.4,226.3 123.4,258.2 61.4,288.3'),
                animate: true
            },
            {
                fill: MAIN_COLOR_2,
                from: Logo.pointsToArray('188.1,257.6 253.6,257.6 220.8,194.1'),
                to: Logo.pointsToArray('188.1,257.6 220.8,321 253.6,257.6'),
                animate: true
            }
        ],
        [
            {
                fill: MAIN_COLOR_2,
                from: Logo.pointsToArray('61.4,226.3 61.4,288.3 123.4,258.2'),
                to: Logo.pointsToArray('123.4,258.2 61.4,288.3 123.4,319.3'),
                animate: true
            },
            {
                fill: MAIN_COLOR_2,
                from: Logo.pointsToArray('253.6,257.6 188.1,257.6 220.8,321'),
                to: Logo.pointsToArray('286.3,321 253.6,257.6 220.8,321'),
                animate: true
            }
        ],
        [
            {
                fill: MAIN_COLOR_2,
                from: Logo.pointsToArray('61.4,288.3 123.4,258.2 123.4,319.3'),
                to: Logo.pointsToArray('123.4,258.2 183.3,290.2 123.4,319.3'),
                animate: true
            },
            {
                fill: MAIN_COLOR_2,
                from: Logo.pointsToArray('253.6,257.6 286.3,321 220.8,321'),
                to: Logo.pointsToArray('286.3,321 253.6,382.5 220.8,321'),
                animate: true
            },
            {
                fill: MAIN_COLOR_1,
                from: Logo.pointsToArray('220.8,321 286.3,321 253.6,257.6'),
                to: Logo.pointsToArray('253.6,257.6 286.3,321 319,257.6'),
                animate: true
            }
        ],
        [
            {
                fill: MAIN_COLOR_2,
                from: Logo.pointsToArray('123.4,258.2 123.4,319.3 183.3,290.2'),
                to: Logo.pointsToArray('183.3,290.2 123.4,319.3 183.3,350.6'),
                animate: true
            },
            {
                fill: MAIN_COLOR_1,
                from: Logo.pointsToArray('286.3,321 253.6,257.6 319,257.6'),
                to: Logo.pointsToArray('253.6,257.6 286.3,194.1 319,257.6'),
                animate: true,

            },
            {
                fill: MAIN_COLOR_2,
                from: Logo.pointsToArray('319,257.6 253.6,257.6 286.3,321'),
                to: Logo.pointsToArray('351.8,321 319,257.6 286.3,321'),
                animate: true
            }
        ],
        [
            {
                fill: MAIN_COLOR_1,
                from: Logo.pointsToArray('123.4,319.3 183.3,290.2 183.3,350.6'),
                to: Logo.pointsToArray('123.4,319.3 183.3,350.6 123.4,381.3'),
                animate: true
            },
            {
                fill: MAIN_COLOR_2,
                from: Logo.pointsToArray('319,257.6 351.8,321 286.3,321'),
                to: Logo.pointsToArray('351.8,321 319,382.5 286.3,321'),
                animate: true
            },
            {
                fill: MAIN_COLOR_2,
                from: Logo.pointsToArray('286.3,321 351.8,321 319,257.6'),
                to: Logo.pointsToArray('319,257.6 351.8,321 384.5,257.6'),
                animate: true
            }
        ],
        [
            {
                fill: MAIN_COLOR_1,
                from: Logo.pointsToArray('183.3,350.6 123.4,319.3 123.4,381.3'),
                to: Logo.pointsToArray('123.4,319.3 61.4,350.6 123.4,381.3'),
                animate: true
            },
            {
                fill: MAIN_COLOR_2,
                from: Logo.pointsToArray('351.8,321 319,257.6 384.5,257.6'),
                to: Logo.pointsToArray('319,257.6 351.8,194.1 384.5,257.6'),
                animate: true
            }
        ]
    ];

    rotateLogo = event => {
        const { clientX, clientY, beta, gamma } = event;
        let varX;
        let varY;

        if (typeof beta === 'number' && typeof gamma === 'number') {
            varY = Math.abs(beta) / 180 - .5;
            varX = gamma / 180;
        } else {
            varX = clientX / window.innerWidth - .5;
            varY = clientY / window.innerHeight - .5;
        }

        const rotateX = -varY * DELTA_ANGLE;
        const rotateY = varX * DELTA_ANGLE;
        const translateX = varX * DELTA_TRANSLATE;
        const translateY = varY * DELTA_TRANSLATE;

        this.setState({rotateX, rotateY, translateX, translateY})
    };

    actionOnCurrentQueueAnimation(action) {
        const { animationData, polygonsQueue } = this;

        const currentQueueIndex = Math.floor(animationData.globalProgress);

        if (currentQueueIndex !== polygonsQueue.length)
            animationData.queue[currentQueueIndex].forEach(item => item[action]())
    }

    mouseDown = event => {
        this.movementData.startX = event.clientX !== undefined ? event.clientX : event.touches[0].clientX;
        this.movementData.canMove = true;
        this.movementData.startProgress = this.animationData.globalProgress;

        this.actionOnCurrentQueueAnimation('pause');
    };

    deleteStreamsAfter(currentQueueIndex) {
        const { queue } = this.animationData;

        this.setState(prevState => {
            if (!queue[currentQueueIndex + 1]) return;

            for (let queueIndex  = currentQueueIndex + 1; queueIndex < queue.length; queueIndex++) {
                if (queue[queueIndex])
                    for (let stream = 0; stream < queue[queueIndex].length; stream++)
                        delete prevState.polygons[queue[queueIndex][stream].idInPolygons];

                delete queue[queueIndex];
            }

            return {polygons: prevState.polygons}
        })
    }

    resetToInitialState() {
        this.animationData.queue = [];
        this.animationData.globalProgress = 0;
        this.setState({polygons: []});

        this.animatePolygonsQueue();
        this.actionOnCurrentQueueAnimation('pause');
    }

    addStream(currentQueueIndex) {
        const streams = this.animationData.queue[currentQueueIndex - 1];

        if (streams)
            for (let i = 0; i < streams.length; i++) {
                streams[i].callback();
                streams[i].progress = 1;
            }
    }

    setQueueProgress(newProgress) {
        newProgress = newProgress <= 0 ? 0 : newProgress;
        const currentQueueIndex = Math.floor(newProgress);

        const streams = this.animationData.queue[currentQueueIndex];
        const progress = newProgress - currentQueueIndex;

        if (streams) {
            for (let i = 0; i < streams.length; i++)
                streams[i].progress = progress;

            this.deleteStreamsAfter(currentQueueIndex);
        } else if (currentQueueIndex) this.addStream(currentQueueIndex);
        else this.resetToInitialState();
    }

    mouseMove = event => {
        const { movementData } = this;

        if (movementData.canMove) {
            const clientX = event.clientX !== undefined ? event.clientX : event.touches[0].clientX;
            movementData.relativePositionX = clientX - movementData.startX;

            const newProgress = movementData.startProgress + movementData.relativePositionX * movementData.progressByPx;

            this.setQueueProgress(newProgress);
        }
    };

    mouseUp = event => {
        this.movementData.endX = event.clientX !== undefined ? event.clientX : event.changedTouches[0].clientX;
        this.movementData.canMove = false;

        this.actionOnCurrentQueueAnimation('start');
    };

    render () {
        const { rotateX, rotateY, translateX, translateY, polygons } = this.state;

        return (
            <svg style={{transform: `translate(${translateX}px, ${translateY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`}}
                 onTouchMove={event => event.preventDefault()}
                 onTouchStart={event => event.preventDefault()}
                 onTouchEnd={event => event.preventDefault()}
                 className={styles.logo}>
                <defs>
                    <symbol id={this.logoId} viewBox={"61.4 194.3 323.1 187"}>
                        <g>
                            {
                                Object.keys(polygons).reverse().map(function(key) {
                                    return <polygon key={key}
                                                    onTouchMove={event => event.preventDefault()}
                                                    onTouchStart={event => event.preventDefault()}
                                                    onTouchEnd={event => event.preventDefault()}
                                                    fill={polygons[key].fill}
                                                    points={polygons[key].points.map(item => item.join(',')).join(' ')}/>
                                })
                            }
                        </g>
                    </symbol>
                </defs>
                <use xlinkHref={`#${this.logoId}`} href={`#${this.logoId}`}/>
            </svg>
        )
    }
}