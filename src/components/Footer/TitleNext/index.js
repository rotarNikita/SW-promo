import React, { PureComponent } from 'react';
import styles from './TitleNext.scss';
import { Link } from 'react-router-dom';
import pages from "../../../data/pages";

export default class TitleNext extends PureComponent {
    constructor (props) {
        super(props);

        this.state = this.animationSettings(props);
        this.historyPrevPageIndex = -1;
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
            prevLink: historyPrevPageIndex !== -1 ? historyPrevPageIndex > currentPageIndex : false,
            animateClass: TitleNext.checkAnimationClass(historyPrevPageIndex, currentPageIndex)
        }
    }

    static checkAnimationClass (historyPrevPageIndex, currentPageIndex) {
        if (historyPrevPageIndex === -1)
            return styles.slideLeft;

        if (currentPageIndex > historyPrevPageIndex)
            return styles.nextPage;

        if (currentPageIndex < historyPrevPageIndex)
            return styles.prevPage;

        if (currentPageIndex === historyPrevPageIndex)
            return '';

        return styles.slideLeft
    }

    removeAnimateClass = () => {
        this.setState({
            animateClass: '',
            prevLink: false
        })
    };

    render () {
        const { prevLink, animateClass } = this.state;
        const { nextPage } = this.props;
        const { historyPrevPageIndex } = this;

        const prevLinkOpacity = historyPrevPageIndex === -1;

        return (
            <div>
                <Link className={styles.text + ' ' + animateClass}
                      onAnimationEnd={this.removeAnimateClass}
                      to={nextPage.link}>
                    {nextPage.text}
                </Link>
                {prevLink &&
                historyPrevPageIndex < pages.length - 1 &&
                <Link className={styles.text + ' ' + (!prevLinkOpacity ? styles.slideRight : '')}
                      style={prevLinkOpacity ? {opacity: 0} : {}}
                      to={pages[historyPrevPageIndex + 1].link}>
                    {pages[historyPrevPageIndex + 1].text}
                </Link>}
            </div>
        )
    }
}