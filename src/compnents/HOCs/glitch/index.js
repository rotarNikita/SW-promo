import React, { Component } from 'react';
import styles from './glitch.scss';

export default function glitch (Element, options) {
    const _options = options || {};
    
    const _classNames = _options.classNames || {};
    const _onlyOnHover = _options.onlyOnHover || false;
    
    const _addGlitchWrapperClass = _classNames.glitchWrapper || '';
    const _addGlitchAfterClass = _classNames.glitchAfter || '';
    const _addGlitchBeforeClass = _classNames.glitchBefore || '';
    const _addGlitchElementClass = _classNames.glitchElement || '';


    return class extends Component {
        constructor (props) {
            super(props);

            this.state = {
                hover: !_onlyOnHover
            }
        }

        hover = () => {
            if (_onlyOnHover) {
                this.setState({
                    hover: true
                })
            }
        };

        unHover = () => {
            if (_onlyOnHover) {
                this.setState({
                    hover: false
                })
            }
        };

        render () {
            const hover = this.state.hover ? styles.hover : '';

            return (
                <div onMouseLeave={this.unHover}
                     onMouseEnter={this.hover}
                     className={styles.glitchWrapper + ' ' + _addGlitchWrapperClass + ' ' + hover}>
                    <div className={styles.glitchElement + ' ' + _addGlitchElementClass}>
                        <Element {...this.props} />
                    </div>
                    <div className={styles.glitchBefore + ' ' + _addGlitchBeforeClass}>
                        <Element {...this.props} />
                    </div>
                    <div className={styles.glitchAfter + ' ' + _addGlitchAfterClass}>
                        <Element {...this.props} />
                    </div>
                </div>
            )
        }
    }
}