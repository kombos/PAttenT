import React from "react";
import { DrizzleContext } from "drizzle-react";
import DrizzleApp from './DrizzleApp';

export default () => (
    <DrizzleContext.Consumer>
        {drizzleContext => {
            const { drizzle, drizzleState, initialized } = drizzleContext;

            if (!initialized) {
                return "Loading...";
            }

            console.log("value of initialized: ");
            //console.log(initialized);
            {/*  <DrizzleApp /> */}
            return (
                <div><p>What's good?</p></div>
                
               
            );
        }}
    </DrizzleContext.Consumer>
)

