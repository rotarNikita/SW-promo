import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import styles from './Form.scss';
import BackgroundTitle from '../../../components/BackgroundTitle';
import { DefaultInput, TelInput, Select, Option, TextArea, InputFile } from "../../../components/Inputs";
import Button from '../../../components/Button';
import PropTypes from 'prop-types';
import Lng from '../../../components/Header/Menu/Lng';
import GradientText from '../../../components/GradientText';

export default class Form extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            errorsInValidation: {},
            success: false
        };

        this.container = document.createElement('div');

        this.formData = {};
    }

    static childContextTypes = {
        addToData: PropTypes.func,
        addToReset: PropTypes.func
    };

    resetCallbacks = [];

    addToReset = callback => {
        this.resetCallbacks.push(callback);
    };

    getChildContext() {
        return {
            addToData: this.addToData,
            addToReset: this.addToReset
        };
    }

    addToData = (key, value, isValid, required = false) => {
        const valid = isValid === undefined ? true : isValid;

        this.formData[key] = { value, valid, required };
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

    static checkForEmpty(value) {
        if (value.length !== undefined) return value.length === 0;
        return !value
    }

    reset = () => {
        this.form.reset();

        this.resetCallbacks.forEach(callback => callback());

        this.setState({success: false});
    };

    submit = event => {
        event.preventDefault();

        const { formData } = this;

        const errorsInValidation = {};
        let success = true;

        for (let key in formData) {
            let { value, valid, required } = formData[key];

            let valueIsEmpty = Form.checkForEmpty(value);

            if (required && valueIsEmpty) {
                errorsInValidation[key] = 'EMPTY';
                success = false;
                continue;
            }

            if (!valid && !valueIsEmpty) {
                errorsInValidation[key] = 'NOT_VALID';
                success = false;
            }
        }

        this.setState({errorsInValidation, success})
    };

    render() {
        const { show, errorsInValidation, success } = this.state;
        const { mount, close } = this.props;

        const animationClass = mount ? styles.showForm : styles.hideForm;

        if (show) return ReactDOM.createPortal(
            <div className={`${styles.wrapper} ${animationClass}`}
                 onAnimationEnd={this.animationEnd}>
                <div className="container">
                    <BackgroundTitle style={{top: '20px'}} subTitle={({ru: 'Ваша заявка', en: 'Send a Request'})[Lng.currentLng]}>
                        Hello
                    </BackgroundTitle>
                </div>
                <form ref={form => this.form = form} className={styles.form} onSubmit={this.submit}>
                    <div className="container">
                        <div className={styles.row}>
                            <div className={styles.col}>
                                <DefaultInput required
                                              name="name"
                                              type="text"
                                              error={errorsInValidation.name}
                                              label={({ru: 'Имя', en: 'Name'})[Lng.currentLng]}/>
                                <TelInput required
                                          name="tel"
                                          type="tel"
                                          error={errorsInValidation.tel}
                                          label={({ru: 'Телефон', en: 'Phone'})[Lng.currentLng]}/>
                                <DefaultInput required
                                              name="email"
                                              type="email"
                                              error={errorsInValidation.email}
                                              label="E-mail"/>
                                <DefaultInput name="company"
                                              error={errorsInValidation.company}
                                              type="text"
                                              label={({ru: 'ваша компания', en: 'Company name'})[Lng.currentLng]}/>
                            </div>
                            <div className={styles.col}>
                                <Select name="budget"
                                        error={errorsInValidation.budget}
                                        label={({ru: 'Бюджет', en: 'Estimate Budget'})[Lng.currentLng]}>
                                    <Option>2 000$ - 5 000$</Option>
                                    <Option>5 000$ - 10 000$</Option>
                                    <Option>10 000$ - 20 000$</Option>
                                    <Option>20 000$+</Option>
                                </Select>
                                <TextArea name="message"
                                          error={errorsInValidation.message}
                                          label={({ru: 'Сообщение', en: 'Message'})[Lng.currentLng]}/>
                                <InputFile name="file"
                                           error={errorsInValidation.file}
                                           label={({ru: 'Прикрепить файл', en: 'File(s)'})[Lng.currentLng]}/>
                            </div>
                        </div>
                    </div>
                    <div className={styles.submitWrapper}>
                        <div className="container">
                            {success || <Button type="submit">
                                {({ru: 'Отправить', en: 'Send'})[Lng.currentLng]}
                            </Button>}
                            {success && <div className={styles.success}>
                                {({ru: 'вы котичек! ваш запрос отправлен :)', en: 'your request was sent :)'})[Lng.currentLng]}
                                <br/>
                                <br/>
                                <span className={styles.resetButton} onClick={this.reset}>
                                    <GradientText textClass={styles.gradientText}>
                                        {({ru: 'Заполнить еще раз', en: 'Send one more message'})[Lng.currentLng]}
                                    </GradientText>
                                </span>
                            </div>}
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