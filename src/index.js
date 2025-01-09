import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, StyleSheetManager } from 'styled-components';
import { theme } from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StyleSheetManager shouldComponentUpdate={true}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <App />
      </ThemeProvider>
    </StyleSheetManager>
  </React.StrictMode>
);
