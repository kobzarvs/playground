import React from 'react';
import ReactDOM from 'react-dom';
import './lib/log';
import './index.css';
import { App } from './app';
import './examples/todo-list-with-validation';
import './examples/glitch';
import './examples/counter';
import './examples/inputName';
import './lib/load-effector-babel-plugin';

ReactDOM.render(
  <App />,
  document.getElementById('app-root'),
);
