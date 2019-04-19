import React from "react";
import { DrizzleContext } from "drizzle-react";
import Header from './Components/Header';
import Footer from './Components/Footer';
import GameStrategies from './Containers/GameStrategies';
import GameDetails from './Containers/GameDetails';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Notifications from './Containers/Notifications';
import Web3NotFound from "./Components/Web3NotFound";
import './css/App.css';

export default () => (
    <DrizzleContext.Consumer>
        {drizzleContext => {
            console.log("inside App.js");
            const { drizzle, drizzleState, initialized } = drizzleContext;
            if (!initialized) {
                return <Web3NotFound/>;
            }
            let header = null;
            if (drizzleState) {
                const playerAddress = drizzleState.accounts[0];
                console.log("playeraddress: ", playerAddress);
                header = <Header playerAddress={playerAddress} />;
            }

            console.log("initialized: ", initialized);
            console.log("drizzleState: ", drizzleState);
            console.log("drizzle: ", drizzle);
            console.log("value of initialized: ", initialized);
            console.log("drizzleState: ", drizzleState);
            console.log("drizzle: ", drizzle);
            const logEvents = drizzleState.contracts.Multiprizer.events;


            return (
                <Router basename={process.env.PUBLIC_URL}>
                    <div className="App" >
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

