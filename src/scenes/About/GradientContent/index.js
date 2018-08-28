import React, { PureComponent } from 'react';
import GradientText from '../../../components/GradientText';
import styles from './GradientContent.scss';
import Button from './Button';
import Lng from '../../../components/Header/Menu/Lng';
import gradientContent from '../../../data/aboutUsSlider/gradientContent';
import MQC from '../../../actions/MediaQueryChecker';
import StaticDOM from "../../../components/StaticDOM";
import LinearGradient from "../../../components/GradientText/LinearGradient";
import Video from './Video';

export default class GradientContent extends PureComponent {
    constructor (props) {
        super(props);

        this.state = {
            show: props.mount
        };

        this.MQCIDs = MQC.addResizeChecker({
            callback: this.forceUpdate.bind(this)
        })
    }

    componentWillMount () {
        this.firstMount = true;

        if (window.innerWidth <= 768) {
            StaticDOM.add(LinearGradient);
            StaticDOM.render();
        }
    }

    setTimeoutUpdating = () => {
        this.forceUpdate();

        setTimeout(this.forceUpdate.bind(this), 30)
    };

    componentDidMount () {
        Lng.relativeComponentOrCallback = this.setTimeoutUpdating;

        this.firstMount = false
    }

    componentWillUnmount() {
        Lng.relativeComponentOrCallback.remove(this.setTimeoutUpdating);

        MQC.removeResizeChecker(this.MQCIDs);
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
                <div style={{position: 'relative'}}>
                    {window.innerWidth > 768 && <GradientText textClass={styles.text} alignCenter={true}>
                        {gradientContent()()}
                    </GradientText>}
                    {window.innerWidth <= 768 && <p className={styles.text}>
                        {gradientContent()()}
                    </p>}
                    <Video/>
                </div>
                <br/>
                <Button style={{marginTop: '20px'}} onClick={nextButtonClick}>
                    {({ru: 'Наша команда', en: 'Our team'})[Lng.currentLng]}
                </Button>
            </div>
        );

        return null
    }
}