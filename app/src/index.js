import React from 'react';
import ReactDOM from 'react-dom';
import { Drizzle, generateStore } from 'drizzle';
import { DrizzleContext } from 'drizzle-react';
import './index.css';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import App from './Components/App';
// import * as serviceWorker from './serviceWorker';
import drizzleOptions from './drizzleOptions';

console.log('inside index.js');

const drizzleStore = generateStore(drizzleOptions);
console.log('drizzlestore: ', drizzleStore);
console.log('drizzleoptions: ', drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, drizzleStore);
const theme = createMuiTheme({
    palette: {
        secondary: {
            light: '#00ffff',
            main: '#33ccff',
            dark: '#00b8e6',
        },
    },
    typography: { useNextVariants: true },
});
console.log('drizzle: ', drizzle);

ReactDOM.render(
    (
        <ThemeProvider theme={theme}>
            <DrizzleContext.Provider drizzle={drizzle}>
                <App />
            </DrizzleContext.Provider>
        </ThemeProvider>

    ), document.getElementById('root'),
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
