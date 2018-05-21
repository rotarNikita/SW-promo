import React, { PureComponent } from 'react';
import styles from './BackgroundTitle.scss';

const BACKGROUND_TITLE_MAX_OFFSET_X = 10;
const BACKGROUND_TITLE_MAX_OFFSET_Y = 5;
const SUBTITLE_DELTA_SPEED = 2;

export default class BackgroundTitle extends PureComponent {
    constructor (props) {
        super(props);

        this.state = {
            dx: 0,
            dy: 0
        }
    }

    componentDidMount () {
        window.addEventListener('mousemove', this.mouseMove)
    }

    componentWillUnmount () {
        window.removeEventListener('mousemove', this.mouseMove)
    }

    mouseMove = (event) => {
        const dx = event.clientX / window.innerWidth * BACKGROUND_TITLE_MAX_OFFSET_X;
        const dy = event.clientY / window.innerHeight * BACKGROUND_TITLE_MAX_OFFSET_Y;

        this.setState({dx, dy})
    };

    render () {
        const { dx, dy } = this.state;
        const { subTitle } = this.props;

        return (
            <div className={styles.text}>
                <div style={{transform: `translate(${dx}px, ${dy}px)`}}>
                    {this.props.children}
                </div>
                {subTitle &&
                    <div className={styles.sub}
                         style={{transform: `translate(${dx * SUBTITLE_DELTA_SPEED}px, ${dy * SUBTITLE_DELTA_SPEED}px)`}}>
                        {subTitle}
                    </div>
                }
            </div>
        )
    }

}
