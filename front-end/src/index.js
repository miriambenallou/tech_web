import React from 'react';
import ReactDOM from 'react-dom';
import { CookiesProvider } from 'react-cookie';
import './index.css';
import App from './App';
import { Provider as ContextProvider } from './Context';
import * as serviceWorker from './serviceWorker';
import 'typeface-roboto'
// Layout
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import {
  BrowserRouter as Router,
} from "react-router-dom";

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  }
});

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <ContextProvider>
        <ThemeProvider theme={theme}>
          <Router>
            <App />
          </Router>
        </ThemeProvider>
      </ContextProvider>
    </CookiesProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
