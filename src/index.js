import React, {Component} from 'react';
import {render} from 'react-dom';
import App from './js/app';

    
render(
    <App />, document.getElementById('root')
);

module.hot.accept();
