import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
//import { browserHistory } from 'react-router';
import { DrizzleContext } from 'drizzle-react';
import Header from './Components/Header';
import Footer from './Components/Footer';
import VideoSection from './Containers/VideoSection';

import './css/App.css';

export default () => (
    <DrizzleContext.Consumer>
        {(drizzleContext) => {
            console.log('inside App.js');
            const { drizzle, drizzleState, initialized } = drizzleContext;
            console.log('initialized: ', initialized);
            console.log('drizzleState: ', drizzleState);
            console.log('drizzle: ', drizzle);
            if (!initialized) {
                {/* return <Web3NotFound />; */}
                return("loading...");
            }
            let header = null;
            if (drizzleState) {
                const playerAddress = drizzleState.accounts[0];
                console.log('playeraddress: ', playerAddress);
                header = <Header playerAddress={playerAddress} />;
            }
            console.log('value of initialized: ', initialized);
            console.log('drizzleState: ', drizzleState);
            console.log('drizzle: ', drizzle);
            const logEvents = drizzleState.contracts.Pattent.events;

            return (
                <Router basename={process.env.PUBLIC_URL}>
                    <div className="App">
                        {header}

                        <Switch>
                            <Route
                                exact
                                path="/"
                                render={() => (
                                    <VideoSection
                                        drizzleState={drizzleState}
                                        drizzle={drizzle}
                                    />
                                )}

                            />
                        </Switch>

                        <Footer />
                    </div>
                </Router>
            );
        }}
    </DrizzleContext.Consumer>
);
