import React from "react";
import { PureComponent } from 'react';
import { DrizzleContext } from "drizzle-react";
import DrizzleApp from './DrizzleApp';


class App extends PureComponent {
    static contextType = DrizzleContext.Consumer;

    constructor(props, context) {
        super(props);
        this.state = { dataKey: null };
        console.log("___ inside constructor___");
        console.log(context);
        this.context = context;

    }


    render() {

        const { drizzle, drizzleState, initialized } = this.context;

        if (!initialized) {
            return "Loading...";
        }

        console.log("value of initialized: ");
        //console.log(initialized);

        return (
            <DrizzleApp drizzle={drizzle} drizzleState={drizzleState} />
        );

    }
}

export default App;


