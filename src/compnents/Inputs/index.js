import React, { PureComponent } from 'react';
import styles from './Inputs.scss';
import generateKey from '../../generals/generateKey';
import PropTypes from 'prop-types';

const MAIL_REGEXP_PATTERN = /[\w\d]+?@[\w\d]+?\.[\w\d]/;

export class DefaultInput extends PureComponent {
    constructor(props) {
        super(props);

        this.id = 'Input__' + generateKey();

        this.state = {
            value: '',
            valid: false
        };
    }

    static contextTypes = {
        addToData: PropTypes.func
    };

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

        const { name, type } = this.props;
        const { value } = event.target;
        const valid = DefaultInput.validate(type, value);

        this.context.addToData(name, value, valid);

        this.setState({value, valid})
    };
    
    render() {
        const { label, type, required } = this.props;
        const { value, valid } = this.state;

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
            </div>
        )
    }
}

const TELEPHONE_PATTERN = '+ XX (XXX) XXX XX XX';
const CHAR_SAMPLE = 'X';
const REGEXP_PATTERN = /\+ \d{2} \(\d{3}\) \d{3} \d{2} \d{2}/;
const MIN_LENGTH = TELEPHONE_PATTERN.indexOf(CHAR_SAMPLE) + 1;

export class TelInput extends DefaultInput {
    constructor(props) {
        super(props);
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
        const { name } = this.props;
        const newValue = TelInput.parseToPattern(value);
        const valid = REGEXP_PATTERN.test(newValue);

        if (newValue.length <= TELEPHONE_PATTERN.length && newValue !== false) {
            this.context.addToData(name, newValue, valid);

            this.setState({value: newValue, valid});
        }
    }
}

export class Select extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            opened: false,
            value: ''
        };

        this.id = 'Input__' + generateKey();
        this.children = [];
    }

    static childContextTypes = {
        select: PropTypes.object
    };

    static contextTypes = {
        addToData: PropTypes.func
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
        this.context.addToData(this.props.name, value);

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
    constructor(props) {
        super(props);

        this.state = {
            value: '',
            showLabel: true
        };

        this.id = 'Input__' + generateKey();
    }

    static contextTypes = {
        addToData: PropTypes.func
    };

    handleChange = event => {
        event.preventDefault();

        const { value } = event.target;
        const { name } = this.props;

        this.context.addToData(name, value);

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
    constructor(props) {
        super(props);

        this.id = 'Input__' + generateKey();

        this.state = {
            files: []
        }
    }

    static contextTypes = {
        addToData: PropTypes.func
    };

    handleChange = () => {
        const { files } = this.input;
        const { name } = this.props;

        this.context.addToData(name, files);

        this.setState({files})
    };

    render() {
        const { label } = this.props;
        const { files } = this.state;

        return (
            <div className={`${styles.wrapper} ${styles.right}`}>
                <label className={styles.fileLabel} htmlFor={this.id}>
                    <span className={styles.fileLabelPlus}>+ </span>{label}
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