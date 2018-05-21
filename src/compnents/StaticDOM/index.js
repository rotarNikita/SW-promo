import React from 'react';
import ReactDOM from 'react-dom';

class StaticDOM {
    constructor () {
        this.elements = [];
    }

    add (element) {
        const { elements } = this;

        if (elements.indexOf(element) === -1) elements.push(element);
    }

    render () {
        ReactDOM.render(
            <div>
                {this.elements.map((Element, index) => <Element key={Element.id}/>)}
            </div>
            , document.getElementById('static'))
    }
}

const staticDOM = new StaticDOM();

export default staticDOM;