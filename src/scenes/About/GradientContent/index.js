import React, { PureComponent } from 'react';
import GradientText from '../../../compnents/GradientText';
import styles from './GradientContent.scss';
import Button from './Button';

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
        this.firstMount = false
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
                    <tspan x={59}>
                        SW AGENCY - креативное digital агентство. Мы специализируемся на
                    </tspan>
                    <tspan x={0} dy="30px">
                        интернет-маркетинге, айдентике, мобильной и веб разработке. Умеем слушать и
                    </tspan>
                    <tspan x={2} dy="30px">
                        слышать наших клиентов. Наша команда нацелена на построение долгосрочных
                    </tspan>
                    <tspan x={13} dy="30px">
                        партнерских отношений, основанных на взаимном доверии. Мы не завершаем
                    </tspan>
                    <tspan x={255} dy="30px">
                        проекты - мы заботимся о них.
                    </tspan>
                </GradientText>

                <Button style={{marginTop: '50px'}} onClick={nextButtonClick}>
                    Наша команда
                </Button>
            </div>
        );

        return null
    }
}