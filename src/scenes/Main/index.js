import React, { PureComponent } from 'react';
import Logo from './Logo';
import styles from './Main.scss';
import { MAIN_PAGE_TEXT } from "../../data/constants";
import generateKey from "../../generals/generateKey";
import LogoText from './Logo/LogoText';

const TIME_INTERVAL_RANGE = [3000, 5000];
const TEXT_COUNT_LIMIT = 1;

export default class Main extends PureComponent {
    constructor (props) {
        super(props);

        this.state = {
            textArray: [],
            logoWidth: undefined,
            logoHeight: undefined,
        }
    }

    checkLogoSize = (width, height) => {
        this.setState({
            logoWidth: width,
            logoHeight: height
        })
    };

    componentDidMount () {
        this.addText();
    }

    addText = () => {
        if (this.state.logoHeight &&
            this.state.logoWidth &&
            this.state.textArray.length < TEXT_COUNT_LIMIT) {
            const randomParalax = Math.random();

            const fontSize = Math.round(randomParalax * (MAIN_PAGE_TEXT.fontSizeRange[1] - MAIN_PAGE_TEXT.fontSizeRange[0]) + MAIN_PAGE_TEXT.fontSizeRange[0]);
            const y = Math.round(Math.random() * (this.state.logoHeight - 2 * fontSize) + fontSize);
            const phrase = MAIN_PAGE_TEXT.data[Math.floor(Math.random() * MAIN_PAGE_TEXT.data.length)];
            const id = generateKey();
            const speed = Math.round(randomParalax * (MAIN_PAGE_TEXT.speedRange[1] - MAIN_PAGE_TEXT.speedRange[0]) + MAIN_PAGE_TEXT.speedRange[0]);

            this.setState(prevState => {
                prevState.textArray.push({fontSize, y, phrase, id, speed});

                return {
                    textArray: prevState.textArray
                }
            });

            this.forceUpdate();

            this.animTimeout = setTimeout(
                this.addText,
                Math.round(Math.random() * (TIME_INTERVAL_RANGE[1] - TIME_INTERVAL_RANGE[0]) + TIME_INTERVAL_RANGE[0])
            )
        } else requestAnimationFrame(this.addText);
    };

    removeText = (textComponent) => {
        this.setState(prevState => {
            for (let i = 0; i < prevState.textArray.length; i++)
                if (prevState.textArray[i].id === textComponent.props.id) {
                    prevState.textArray.splice(i, 1);
                    i--;
                }

            return {
                textArray: prevState.textArray
            }
        })
    };

    componentWillUnmount () {
        clearInterval(this.animTimeout)
    }

    render () {
        const textArray = this.state.textArray.map(item => (
            <LogoText removeText={this.removeText}
                      key={item.id}
                      id={item.id}
                      fontSize={item.fontSize}
                      y={item.y}
                      width={this.state.logoWidth}
                      speed={item.speed}>
                {item.phrase}
            </LogoText>
        ));

        return (
            <section className={styles.wrapper}>
                <Logo checkLogoSize={this.checkLogoSize}>
                    {textArray}
                </Logo>
            </section>
        )
    }
}