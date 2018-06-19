import React, { PureComponent } from 'react';
import GradientText from '../../../components/GradientText';
import styles from './GradientContent.scss';
import Button from './Button';
import Lng from '../../../components/Header/Menu/Lng';
import gradientContent from '../../../data/aboutUsSlider/gradientContent';

export default class GradientContent extends PureComponent {
    constructor (props) {
        super(props);

        this.state = {
            show: props.mount
        }
    }

    componentWillMount () {
        this.firstMount = true
    }

    componentDidMount () {
        Lng.relativeComponentOrCallback = this;

        this.firstMount = false
    }

    componentWillUnmount() {
        Lng.relativeComponentOrCallback.remove(this);
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.mount) this.setState({ show: true })
    }

    animationEnd = () => {
        if (!this.props.mount) this.setState({
            show: false
        })
    };

    render () {
        const { show } = this.state;
        const { mount, nextButtonClick } = this.props;
        const animateClass = !this.firstMount ? mount ? styles.slideRight : styles.slideLeft : '';

        if (show) return (
            <div onAnimationEnd={this.animationEnd}
                 className={styles.wrapper + ' ' + animateClass}>
                <GradientText textClass={styles.text}>
                    {gradientContent()}
                </GradientText>

                <Button style={{marginTop: '50px'}} onClick={nextButtonClick}>
                    {({rus: 'Наша команда', eng: 'Our team'})[Lng.currentLng]}
                </Button>
            </div>
        );

        return null
    }
}