import React, { Component } from 'react';
import styles from './BallCanvas.scss';
import NaNimate from '../../../../generals/NaNimate';
import Header from '../../../Header';
import { GRADIENT_COLOR_1, GRADIENT_COLOR_2 } from '../../../../data/constants';
import Lng from '../Lng';

const BALL_RADIUS = 6;

export default class BallCanvas extends Component {
    sizeCalc = () => {
        setTimeout(() => {
            const { canvas } = this;

            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }, 45)
    };

    initCanvas = () => {
        setTimeout(() => {
            const { canvas } = this;

            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
            this.ctx = canvas.getContext('2d');

            this.setBoundaryWithGradient();

            this.ball = new Ball(
                this.ctx,
                BALL_RADIUS + Math.random() * (canvas.width - 2 * BALL_RADIUS),
                BALL_RADIUS,
                BALL_RADIUS,
                '#FFFFFF'
            );

            this.dx = 2.5;
            this.ddy = 0.10;
            this.ball.dx = this.dx;

            this.animation = new NaNimate({
                duration: Infinity,
                progressFunction: this.animate,
                timingFunction: 'linear',
            });

            Header.openCallback = this.animation.start;
            Header.closeCallback = this.animation.pause;
        }, 45)
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
        this.x2 = this.props.x2 || this.canvas.width;

        // try {
        //     if (!this.ballGradient)
        //         this.ballGradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, 0);
        //     this.ballGradient.addColorStop(this.x1 / this.canvas.width, GRADIENT_COLOR_1);
        //     this.ballGradient.addColorStop(this.x2 / this.canvas.width, GRADIENT_COLOR_2);
        // } catch (e) {}
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