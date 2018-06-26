import React, { PureComponent } from 'react';
import styles from './Mail.scss';
import NaNimate from '../../../../generals/NaNimate';

const EMAIL = 'info@sw-agency.net';
const DELAY_FUNCTION = NaNimate.getTimingFunction('linear');
const DURATION = 1000;

export default class Mail extends PureComponent {
    email = Array.prototype.map.call(EMAIL, (char, index, {length}) =>
        <span key={index}
              className={styles.char}
              style={{transitionDelay: `${DURATION * DELAY_FUNCTION(index / (length - 1))}ms`}}>
            {char}
        </span>);
    
    render() {
        return (
            <a className={styles.link}
               href={`mailto:${EMAIL}`}>
                {this.email}
            </a>
        )
    }
}