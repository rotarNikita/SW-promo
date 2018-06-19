import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import styles from './Form.scss';
import BackgroundTitle from '../../../components/BackgroundTitle';
import { DefaultInput, TelInput, Select, Option, TextArea, InputFile } from "../../../components/Inputs";
import Button from '../../../components/Button';
import PropTypes from 'prop-types';
import Lng from '../../../components/Header/Menu/Lng';

export default class Form extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            show: false
        };

        this.container = document.createElement('div');

        this.formData = {};
    }

    static childContextTypes = {
        addToData: PropTypes.func
    };

    getChildContext() {
        return {
            addToData: this.addToData
        };
    }

    addToData = (key, value, isValid) => {
        const valid = isValid === undefined ? true : isValid;

        this.formData[key] = { value, valid };
    };

    componentDidMount() {
        Lng.relativeComponentOrCallback = this;

        document.getElementById('popups').appendChild(this.container)
    }

    componentWillUnmount() {
        Lng.relativeComponentOrCallback.remove(this);

        document.getElementById('popups').removeChild(this.container)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.mount) this.setState({show: true})
    }

    animationEnd = () => {
        if (!this.props.mount) this.setState({show: false})
    };

    submit = event => {
        event.preventDefault();

        console.log(this.formData);
    };

    render() {
        const { show } = this.state;
        const { mount, close } = this.props;

        const animationClass = mount ? styles.showForm : styles.hideForm;

        if (show) return ReactDOM.createPortal(
            <div className={`${styles.wrapper} ${animationClass}`}
                 onAnimationEnd={this.animationEnd}>
                <div className="container">
                    <BackgroundTitle style={{top: '20px'}} subTitle={({rus: 'Ваша заявка', eng: 'Send a Request'})[Lng.currentLng]}>
                        Hello
                    </BackgroundTitle>
                </div>
                <form className={styles.form} onSubmit={this.submit}>
                    <div className="container">
                        <div className={styles.row}>
                            <div className={styles.col}>
                                <DefaultInput required
                                              name="name"
                                              type="text"
                                              label={({rus: 'Имя', eng: 'Name'})[Lng.currentLng]}/>
                                <TelInput required
                                          name="tel"
                                          type="tel"
                                          label={({rus: 'Телефон', eng: 'Phone'})[Lng.currentLng]}/>
                                <DefaultInput required
                                              name="email"
                                              type="email"
                                              label="E-mail"/>
                                <DefaultInput name="company"
                                              type="text"
                                              label={({rus: 'ваша компания', eng: 'Company name'})[Lng.currentLng]}/>
                            </div>
                            <div className={styles.col}>
                                <Select name="budget" label={({rus: 'Бюджет', eng: 'Estimate Budget'})[Lng.currentLng]}>
                                    <Option>{({rus: 'от', eng: 'from'})[Lng.currentLng]} 10.000 1</Option>
                                    <Option>{({rus: 'от', eng: 'from'})[Lng.currentLng]} 10.000 2</Option>
                                    <Option>{({rus: 'от', eng: 'from'})[Lng.currentLng]} 10.000 3</Option>
                                </Select>
                                <TextArea name="message" label={({rus: 'Сообщение', eng: 'Message'})[Lng.currentLng]}/>
                                <InputFile name="file" label={({rus: 'Прикрепить файл', eng: 'File(s)'})[Lng.currentLng]}/>
                            </div>
                        </div>
                    </div>
                    <div className={styles.submitWrapper}>
                        <div className="container">
                            <Button type="submit">
                                {({rus: 'Отправить', eng: 'Send'})[Lng.currentLng]}
                            </Button>
                        </div>
                    </div>
                </form>
                <div className={styles.crossWrapper}>
                    <div className="container">
                        <div className={styles.cross} onClick={close}/>
                    </div>
                </div>
            </div>
            , this.container
        );

        return null
    }
}