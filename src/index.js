import React, {Component} from 'react';
import {render} from 'react-dom';
import App from './js/app';
import { browserHistory } from 'react-router'

render(
    
    <App />, document.getElementById('root')
    
);

module.hot.accept();
