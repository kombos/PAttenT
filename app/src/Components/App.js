import React, { Fragment } from "react";
import { DrizzleContext } from "drizzle-react";
import GameStrategies from "../GameStrategies";
import { Header, Footer } from './Layouts';
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import GameDetails from '../GameDetails';
import Notifications from '../Notifications';

export default () => (
    <DrizzleContext.Consumer>
        {drizzleContext => {
            console.log("inside App.js");
            const { drizzle, drizzleState, initialized } = drizzleContext;
            //const gameStrategies = <GameStrategies initialized={initialized} drizzleState={drizzleState} />;
            //const gameDetails = <GameDetails gameID={gameID} drizzleState={drizzleState} />;
            //const notifications = <Notifications />;
            console.log("initialized: ", initialized);
            console.log("drizzleState: ", drizzleState);
            console.log("drizzle: ", drizzle);

            if (!initialized) {
                return "Loading...";
            }

            console.log("value of initialized: ", initialized);
            console.log("drizzleState: ", drizzleState);
            console.log("drizzle: ", drizzle);

            return (
                <Router>
                    <div>
                        <Header />

                        <Switch>
                            <Route exact path="/" render={
                                () => { return (<GameStrategies initialized={initialized} drizzleState={drizzleState} />); }} />
                            <Route path="/gameDetails/:gameID"
                                render={({ match }) => <GameDetails gameID={match.params.gameID} drizzleState={drizzleState} />} />
                            <Route path="/notifications" component={
                                () => <Notifications drizzleState={drizzleState} />} />
                            <Route render={() => <div><p> Error </p></div>} />
                        </Switch>

                        <Footer />
                    </div>
                </Router>
            );


        }}
    </DrizzleContext.Consumer>
)

