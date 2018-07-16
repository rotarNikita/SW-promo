import React, { Component } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import Loader from '../Loader';

export default class Layout extends Component {
    render () {
        return (
            <div>
                <Loader/>
                <Header/>
                {this.props.children}
                <Footer/>
            </div>
        )
    }
}