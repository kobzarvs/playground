import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { theme } from './theme';
import './index.css';
import './lib/log';
import { App } from './app';
import { ThemeProvider } from '@mui/material';

const Application = () => {
  const [currentTheme, setTheme] = useState(theme);

  return (
    <ThemeProvider theme={currentTheme}>
      <App />
    </ThemeProvider>
  );
};

ReactDOM.render(
  <Application />,
  document.getElementById('app-root'),
);
