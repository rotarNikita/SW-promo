import React, { Component } from 'react';
import styles from './BallCanvas.scss';
import NaNimate from '../../../../generals/NaNimate';
import Header from '../../../Header';
import Lng from '../Lng';
import MQC from '../../../../actions/MediaQueryChecker';

const BALL_RADIUS = 6;
const BALL_RADIUS_SMALL = 4.5;

export default class BallCanvas extends Component {
    constructor() {
        super();

        this.MQC_IDs = MQC.addResizeChecker({
            to: 1200,
            callback: () => {
                this.reset();
                this.setBoundaryWithGradient();
                this.initBall(BALL_RADIUS_SMALL);
                this.startSettings();
                this.initAnimation(this.animateSmall);
            }
        }, {
            from: 1201,
            callback: () => {
                this.reset();
                this.setBoundaryWithGradient();
                this.initBall(BALL_RADIUS);
                this.startSettings();
                this.initAnimation(this.animate);
            }
        })
    }

    sizeCalc = () => {
        setTimeout(() => {
            const { canvas } = this;

            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }, 45)
    };

    reset() {
        const { canvas } = this;

        if (this.animation) {
            this.animation.stop();
            Header.openCallback.remove(this.animation.start);
            Header.closeCallback.remove(this.animation.stop);
        }

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        this.ctx = canvas.getContext('2d');
    }

    initBall(ballRadius) {
        this.ball = new Ball(
            this.ctx,
            ballRadius + Math.random() * (this.canvas.width - 2 * ballRadius),
            ballRadius,
            ballRadius,
            '#FFFFFF'
        );
    }

    initAnimation(animation) {
        this.animation = new NaNimate({
            duration: Infinity,
            progressFunction: animation,
            timingFunction: 'linear',
        });

        if (Header.opened) this.animation.start();

        Header.openCallback = this.animation.start;
        Header.closeCallback = this.animation.pause;
    }

    startSettings() {
        this.dx = window.innerWidth >= 1201 ? 2.5 : 1.5;
        this.ddy = 0.10;
        this.ball.dx = this.dx;
        this.ball.dy = window.innerWidth >= 1201 ? 0 : this.dx;
    }

    initCanvas = () => {
        setTimeout(() => {
            this.reset();

            this.setBoundaryWithGradient();

            if (window.innerWidth >= 1201) this.initBall(BALL_RADIUS);
            else this.initBall(BALL_RADIUS_SMALL);

            this.startSettings();

            if (window.innerWidth >= 1201) this.initAnimation(this.animate);
            else this.initAnimation(this.animateSmall);

            Header.openCallback = this.animation.start;
            Header.closeCallback = this.animation.pause;
        }, 45)
    };

    animateSmall = () => {
        const { ctx, ball, canvas, dx, x1, x2 } = this;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (ball.y >= x2 - BALL_RADIUS_SMALL) ball.dy = -dx;
        else if (ball.y <= x1 + BALL_RADIUS_SMALL) ball.dy = dx;

        if (ball.x <= BALL_RADIUS_SMALL) ball.dx = dx;
        else if (ball.x >= canvas.width - BALL_RADIUS_SMALL) ball.dx = -dx;

        ball.update();
    };

    animate = () => {
        const { ctx, ball, canvas, dx, ddy, x1, x2 } = this;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (ball.y + BALL_RADIUS >= canvas.height - ball.dy) ball.dy = -ball.dy;
        else ball.dy += ddy;

        if (ball.x <= x1 + BALL_RADIUS) ball.dx = dx;
        else if (ball.x >= x2 - BALL_RADIUS) ball.dx = -dx;

        ball.update();
    };

    setBoundaryWithGradient () {
        this.x1 = this.props.x1 || 0;
        this.x2 = this.props.x2 || (window.innerWidth >= 1201 ? this.canvas.width : this.canvas.height);
    }

    componentDidMount () {
        Lng.relativeComponentOrCallback = this.sizeCalc;

        if (document.readyState === 'complete') this.initCanvas();
        else window.addEventListener('load', this.initCanvas)
    }

    componentDidUpdate () {
        this.setBoundaryWithGradient();
    }

    componentWillUnmount () {
        Lng.relativeComponentOrCallback.remove(this.sizeCalc);

        this.animation.stop();
        Header.openCallback.remove(this.animation.start);
        Header.closeCallback.remove(this.animation.pause);

        MQC.removeResizeChecker(this.MQC_IDs);
    }

    render () {
        return (
            <canvas ref={canvas => this.canvas = canvas} className={styles.canvas}>
                Update your browser :)
            </canvas>
        )
    }
}

class Ball {
    constructor (ctx, x, y, radius, color) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.dx = 0;
        this.dy = 0;
        this.radius = radius;
        this.color = color;
    }

    update () {
        this.x += this.dx;
        this.y += this.dy;

        this.draw();
    }

    draw () {
        const { ctx, x, y, radius, color } = this;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }
}