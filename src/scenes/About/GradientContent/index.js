import React, { PureComponent } from 'react';
import GradientText from '../../../compnents/GradientText';
import styles from './GradientContent.scss';

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
        const { mount } = this.props;
        const animateClass = !this.firstMount ? mount ? styles.slideRight : styles.slideLeft : '';

        if (show) return (
            <div onAnimationEnd={this.animationEnd}
                 className={styles.wrapper + ' ' + animateClass}>
                <GradientText textClass={styles.text}>
                    <tspan x={3}>
                        SW AGENCY - креативное диджитал агентство. Мы специализируемся на
                    </tspan>
                    <tspan x={0} dy="30px">
                        интернет-маркетинге, дизайне и разработке эффективных веб-ресурсов.
                    </tspan>
                    <tspan x={5} dy="30px">
                        Умеем слушать и слышать наших клиентов. Видим суть и находим яркие
                    </tspan>
                    <tspan x={60} dy="30px">
                        решения. Мы не завершаем проекты. Мы заботимся о них.
                    </tspan>
                </GradientText>
            </div>
        );

        return null
    }
}