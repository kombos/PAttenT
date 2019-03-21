import React, { Fragment } from "react";
import { DrizzleContext } from "drizzle-react";
import GameStrategies from "../GameStrategies";
import { Header, Footer } from './Layouts';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import GameDetails from '../GameDetails';
import Notifications from '../Notifications';
import './App.css';

export default () => (
    <DrizzleContext.Consumer>
        {drizzleContext => {
            console.log("inside App.js");
            const { drizzle, drizzleState, initialized } = drizzleContext;
            let header = null;
            if (drizzleState) {
                const playerAddress = drizzleState.accounts[0];
                console.log("playeraddress: ", playerAddress);
                header = <Header playerAddress={playerAddress} />;
            }

            console.log("initialized: ", initialized);
            console.log("drizzleState: ", drizzleState);
            console.log("drizzle: ", drizzle);

            if (!initialized) {
                return "Loading...";
            }

            console.log("value of initialized: ", initialized);
            console.log("drizzleState: ", drizzleState);
            console.log("drizzle: ", drizzle);
            const logEvents = drizzleState.contracts.Multiprizer.events;


            return (
                <Router>
                    <div className="App">
                        {header}

                        <Switch>
                            <Route exact path="/" render={
                                () => { return (<GameStrategies initialized={initialized} drizzleState={drizzleState} />); }} />
                            <Route path="/gameDetails/:gameID"
                                render={({ match }) => <GameDetails gameID={match.params.gameID} drizzleState={drizzleState} />} />
                            <Route path="/notifications" render={
                                () => <Notifications drizzleState={drizzleState} events={logEvents} />} />
                            <Route render={() => <div><p> Error </p></div>} />
                        </Switch>

                        <Footer />
                    </div>
                </Router>
            );


        }}
    </DrizzleContext.Consumer>
)

