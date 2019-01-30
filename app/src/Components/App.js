import React, { Fragment } from "react";
import { DrizzleContext } from "drizzle-react";
import GameStrategies from "../GameStrategies";
import { Header, Footer } from './Layouts'

export default () => (
    <DrizzleContext.Consumer>
        {drizzleContext => {
            const { drizzle, drizzleState, initialized } = drizzleContext;

            if (!initialized) {
                return "Loading...";
            }

            console.log("value of initialized: ", initialized);
            console.log("drizzleState: ", drizzleState);
            console.log("drizzle: ", drizzle);

            return (
                <Fragment>
                    <Header />
                    <GameStrategies initialized={initialized} drizzleState={drizzleState} />
                    <Footer />
                </Fragment>
            );
        }}
    </DrizzleContext.Consumer>
)

