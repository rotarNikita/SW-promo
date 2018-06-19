import React, { PureComponent } from 'react';
import styles from './TitlePrev.scss';
import { Link } from 'react-router-dom';
import pages from "../../../data/pages";
import Lng from '../../Header/Menu/Lng';

export default class TitlePrev extends PureComponent {
    constructor (props) {
        super(props);

        this.state = this.animationSettings(props);
        this.historyPrevPageIndex = -1;
    }

    componentDidMount() {
        Lng.relativeComponentOrCallback = this
    }

    componentWillUnmount() {
        Lng.relativeComponentOrCallback.remove(this)
    }

    componentWillReceiveProps (nextProps) {
        this.setState(this.animationSettings(nextProps))
    }

    animationSettings (props) {
        const { currentPage, historyPrevPage } = props;

        const currentPageIndex = pages.indexOf(currentPage);
        const historyPrevPageIndex = pages.indexOf(historyPrevPage);

        this.historyPrevPageIndex = historyPrevPageIndex;

        return {
            prevLink: historyPrevPageIndex !== -1 ? historyPrevPageIndex < currentPageIndex : false,
            animateClass: TitlePrev.checkAnimationClass(historyPrevPageIndex, currentPageIndex)
        }
    }

    static checkAnimationClass (historyPrevPageIndex, currentPageIndex) {
        if (historyPrevPageIndex === -1)
            return styles.slideRight;

        if (currentPageIndex > historyPrevPageIndex)
            return styles.nextPage;

        if (currentPageIndex < historyPrevPageIndex)
            return styles.prevPage;

        if (currentPageIndex === historyPrevPageIndex)
            return '';

        return styles.slideRight
    }

    removeAnimateClass = () => {
        this.setState({
            animateClass: '',
            prevLink: false
        })
    };

    render () {
        const { prevLink, animateClass } = this.state;
        const { prevPage } = this.props;
        const { historyPrevPageIndex } = this;

        return (
            <div id="titlePrev">
                <Link className={styles.text + ' ' + animateClass}
                      onAnimationEnd={this.removeAnimateClass}
                      to={prevPage.link}>
                    {prevPage.text}
                </Link>
                {prevLink &&
                historyPrevPageIndex > 0 &&
                <Link className={styles.text + ' ' + styles.slideLeft}
                      to={pages[historyPrevPageIndex - 1].link}>
                    {pages[historyPrevPageIndex - 1].text}
                </Link>}
            </div>
        )
    }
}