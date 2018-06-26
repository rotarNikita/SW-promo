import React, { PureComponent } from 'react';
import styles from './Inputs.scss';
import generateKey from '../../generals/generateKey';
import PropTypes from 'prop-types';
import Lng from '../Header/Menu/Lng';

const ERROR_MESSAGES = {
    get EMPTY() {
        return ({
            ru: 'Это поле не должно быть пустым',
            en: 'This field must not be empty'
        })[Lng.currentLng]
    },
    get NOT_VALID() {
        return ({
            ru: 'Тут что-то не так',
            en: 'There\'s something wrong'
        })[Lng.currentLng]
    }
};

const MAIL_REGEXP_PATTERN = /[\w\d]+?@[\w\d]+?\.[\w\d]/;

export class DefaultInput extends PureComponent {
    constructor(props, context) {
        super(props, context);

        this.id = 'Input__' + generateKey();

        this.state = {
            value: '',
            valid: false,
            error: false,
        };

        context.addToData(props.name, '', false, props.required);
        context.addToReset(this.reset);
    }

    static contextTypes = {
        addToData: PropTypes.func,
        addToReset: PropTypes.func
    };

    reset = () => {
        this.setState({value: '', valid: false, error: false})
    };

    componentWillReceiveProps(nextProps) {
        this.setState({error: nextProps.error})
    }

    static validate(type, value) {
        if (type === 'email') return this.emailValidate(value);
        return this.textValidate(value);
    }

    static emailValidate(value) {
        return MAIL_REGEXP_PATTERN.test(value);
    }

    static textValidate(value) {
        return !!value;
    }

    handleChange = event => {
        event.preventDefault();

        const { name, type, required } = this.props;
        const { value } = event.target;
        const valid = DefaultInput.validate(type, value);

        const state = {value, valid};
        if (valid) state.error = false;

        this.context.addToData(name, value, valid, required);

        this.setState(state)
    };
    
    render() {
        const { label, type, required } = this.props;
        const { value, valid, error } = this.state;

        return (
            <div className={styles.wrapper}>
                <label className={styles.label} htmlFor={this.id}>
                    <span>
                        {label}
                    </span>
                </label>
                <div className={styles.inputWrapper}>
                    <input className={`${styles.input} ${required ? styles.required : ''} ${valid ? styles.valid : styles.invalid}`}
                           id={this.id}
                           type="text"
                           value={value}
                           onBlur={this.blur}
                           onChange={this.handleChange}/>
                    <div className={styles.line}/>
                </div>
                {error && <div className={styles.error}>
                    {ERROR_MESSAGES[error]}
                </div>}
            </div>
        )
    }
}

const TELEPHONE_PATTERN = '+ XX (XXX) XXX XX XX';
const CHAR_SAMPLE = 'X';
const REGEXP_PATTERN = /\+ \d{2} \(\d{3}\) \d{3} \d{2} \d{2}/;
const MIN_LENGTH = TELEPHONE_PATTERN.indexOf(CHAR_SAMPLE) + 1;

export class TelInput extends DefaultInput {
    constructor(props, context) {
        super(props, context);
    }

    blur = () => {
        if (this.state.value.length < MIN_LENGTH)
            this.setState({value: ''})
    };

    static parseToPattern(value) {
        let newValue = value;

        for (let i = 0; i < newValue.length; i++)
            if (newValue[i] !== TELEPHONE_PATTERN[i] && TELEPHONE_PATTERN[i] !== CHAR_SAMPLE) {
                newValue = newValue.split('');
                newValue.splice(i, 0, TELEPHONE_PATTERN[i]);
                newValue = newValue.join('');
            } else if (TELEPHONE_PATTERN[i] === CHAR_SAMPLE && !/\d/.test(newValue[i])) return false;

        return newValue;
    }

    handleChange = event => {
        event.preventDefault();

        const { value } = event.target;
        const { name, required } = this.props;
        const newValue = TelInput.parseToPattern(value);
        const valid = REGEXP_PATTERN.test(newValue);

        const state = {value: newValue, valid};
        if (valid) state.error = false;

        if (newValue.length <= TELEPHONE_PATTERN.length && newValue !== false) {
            this.context.addToData(name, newValue, valid, required);

            this.setState(state);
        }
    }
}

export class Select extends PureComponent {
    constructor(props, context) {
        super(props, context);

        this.state = {
            opened: false,
            value: ''
        };

        this.id = 'Input__' + generateKey();
        this.children = [];

        context.addToData(props.name, '', false, props.required);
        context.addToReset(this.reset);
    }

    static childContextTypes = {
        select: PropTypes.object
    };

    static contextTypes = {
        addToData: PropTypes.func,
        addToReset: PropTypes.func
    };

    reset = () => {
        this.unselectAll();
        this.setState({value: ''})
    };

    getChildContext() {
        return {select: this}
    }

    addToChildren(child) {
        if (this.children.indexOf(child) === -1)
            this.children.push(child)
    }

    unselectAll() {
        const { children } = this;

        for (let i = 0; i < children.length; i++)
            children[i].setState({selected: false})
    }

    setValue(value) {
        this.context.addToData(this.props.name, value, !!value, this.props.required);

        this.setState({value})
    }

    handleFocus = () => {
        this.setState({opened: true})
    };

    handleBlur = () => {
        this.setState({opened: false})
    };

    render() {
        const { label, children } = this.props;
        const { value, opened } = this.state;

        return (
            <div className={styles.wrapper}>
                <label className={styles.label} htmlFor={this.id}>
                    <span>
                        {label}
                    </span>
                </label>
                <div className={`${styles.inputWrapper} ${styles.select}`}>
                    <input className={styles.input}
                           readOnly
                           type="text"
                           id={this.id}
                           onBlur={this.handleBlur}
                           onFocus={this.handleFocus}
                           value={value}/>
                    <div className={styles.line}/>
                    <div className={`${styles.dropdown} ${opened ? styles.opened : ''}`}>
                        {children}
                    </div>
                </div>
            </div>
        )
    }
}

export class Option extends PureComponent {
    constructor(props, context) {
        super(props);

        this.state = {
            selected: props.selected
        };

        context.select.addToChildren(this);
    }

    static contextTypes = {
        select: PropTypes.object
    };

    handleClick = () => {
        this.context.select.unselectAll();

        this.setState({selected: true});
        this.context.select.setValue(this.props.children);
    };

    render() {
        const { children } = this.props;
        const { selected } = this.state;

        return (
            <div className={`${styles.option} ${selected ? styles.selected : ''}`}
                 onMouseDown={this.handleClick}>
                {children}
            </div>
        )
    }
}

export class TextArea extends PureComponent {
    constructor(props, context) {
        super(props, context);

        this.state = {
            value: '',
            showLabel: true
        };

        this.id = 'Input__' + generateKey();

        context.addToData(props.name, '', false, props.required);
        context.addToReset(this.reset);
    }

    static contextTypes = {
        addToData: PropTypes.func,
        addToReset: PropTypes.func
    };

    reset = () => {
        this.setState({value: ''})
    };

    handleChange = event => {
        event.preventDefault();

        const { value } = event.target;
        const { name, required } = this.props;

        this.context.addToData(name, value, !!value, required);

        this.setState({value})
    };

    handleFocus = () => {
        this.setState({showLabel: false})
    };

    handleBlur = () => {
        this.setState(prevState => ({showLabel: !prevState.value}))
    };

    render() {
        const { value, showLabel } = this.state;
        const { label } = this.props;

        return (
            <div className={styles.wrapper}>
                <div className={`${styles.inputWrapper} ${styles.textarea}`}>
                    {showLabel && <label htmlFor={this.id} className={styles.textareaLabel}>
                        {label}
                    </label>}
                    <textarea className={styles.input}
                              id={this.id}
                              onBlur={this.handleBlur}
                              onFocus={this.handleFocus}
                              onChange={this.handleChange}
                              value={value}/>
                    <div className={styles.line}/>
                </div>
            </div>
        )
    }
}

export class InputFile extends PureComponent {
    constructor(props, context) {
        super(props, context);

        this.id = 'Input__' + generateKey();

        this.state = {
            files: [],
            loading: false
        };

        context.addToData(props.name, [], false, props.required);
        context.addToReset(this.reset)
    }

    static contextTypes = {
        addToData: PropTypes.func,
        addToReset: PropTypes.func
    };

    reset = () => {
        this.setState({files: []})
    };

    handleChange = () => {
        const { files } = this.input;
        const { name, required } = this.props;

        let loadFiles = [];

        this.setState({loading: true});

        for (let i = 0; i < files.length; i++) {
            let reader = new FileReader();

            reader.addEventListener('load', event => {
                loadFiles.push(event.target.result);

                if (loadFiles.length === files.length) {
                    this.context.addToData(name, loadFiles, !!files.length, required);

                    this.setState({files, loading: false})
                }
            });

            reader.readAsDataURL(files[i]);
        }
    };

    render() {
        const { label } = this.props;
        const { files, loading } = this.state;

        const plusClassNames = [styles.fileLabelPlus, loading ? styles.loading : undefined].join(' ');

        return (
            <div className={`${styles.wrapper} ${styles.right}`}>
                <label className={styles.fileLabel} htmlFor={this.id}>
                    <span className={plusClassNames}>+</span>{' ' + label}
                </label>
                <input onChange={this.handleChange}
                       ref={input => this.input = input}
                       className={styles.file}
                       multiple
                       type="file"
                       id={this.id}/>
                <div className={styles.fileName}>
                    {[].map.call(files, file => file.name).join(', ')}
                </div>
            </div>
        )
    }
}