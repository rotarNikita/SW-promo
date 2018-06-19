import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import pages from './data/pages';
import Layout from './components/Layout';
import layoutStyles from './components/Layout/Layout.scss';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { PAGE_TRANSITION_TIME } from "./data/constants";
import Scroll from './actions/Scroll';

export default class App extends Component {
    pageTransitionClassNames = {
        RTL: {
            appear: layoutStyles.pageInRTL,
            appearActive: layoutStyles.pageInRTLActive,
            enter: layoutStyles.pageInRTL,
            enterActive: layoutStyles.pageInRTLActive,
            exit: layoutStyles.pageOutRTL,
            exitActive: layoutStyles.pageOutRTLActive,
        },
        LTR: {
            appear: layoutStyles.pageInLTR,
            appearActive: layoutStyles.pageInLTRActive,
            enter: layoutStyles.pageInLTR,
            enterActive: layoutStyles.pageInLTRActive,
            exit: layoutStyles.pageOutLTR,
            exitActive: layoutStyles.pageOutLTRActive,
        }
    };

    render () {
        const routes = pages.map(page => {
            return <Route key={page.id} exact={!!page.exact} path={page.link} component={page.template} />
        });

        const pathnames = pages.map(page => page.link);

        return (
            <BrowserRouter>
                <div>
                    <Scroll/>
                    <PageTransition pathnames={pathnames}
                                    pageTransitionClassNames={this.pageTransitionClassNames}
                                    timeout={PAGE_TRANSITION_TIME}>
                        {routes}
                        <Route render={() => <div>Not Found</div>} />
                    </PageTransition>
                </div>
            </BrowserRouter>
        )
    }
}

function PageTransition (props) {
    return (
        <Route render={({ location }) => {
            const { pathnames, pageTransitionClassNames, timeout } = props;

            const classNames = pathnames.indexOf(PageTransition.previousPathname || '') > pathnames.indexOf(location.pathname) ?
                pageTransitionClassNames.LTR : pageTransitionClassNames.RTL;

            PageTransition.previousPathname = location.pathname;

            return (
                <Layout>
                    <TransitionGroup component="main"
                                     className={layoutStyles.main}
                                     id="main"
                                     childFactory={child => React.cloneElement(child, { classNames })}>
                        <CSSTransition key={location.pathname} timeout={timeout}>
                            <div className={layoutStyles.mainInner}>
                                <Switch location={location}>
                                    {props.children}
                                </Switch>
                            </div>
                        </CSSTransition>
                    </TransitionGroup>
                </Layout>
            )
        }}/>
    )
}
