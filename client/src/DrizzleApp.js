import React from "react";
import PropTypes from 'prop-types';
import GameStrategy from './GameStrategy';
import { DrizzleContext } from 'drizzle-react';

class DrizzleApp extends React.Component {
    static contextType = DrizzleContext.Consumer;

    constructor(props, context) {
        super(props);
        this.state = { dataKey: null };
        console.log("___ inside constructor___");
        console.log(context);
        this.context = context;

    }

    componentDidMount() {
        const multiprizer = this.context.drizzle.contracts.Multiprizer;

        // get and save the key for the variable we are interested in
        const dataKey = multiprizer.methods["viewGameIDs"].cacheCall();
        console.log("datakey value is:" + dataKey);
        this.setState({ dataKey });
    }

    render() {

        const initialized = this.context.initialized;
        console.log("initialized value: ");
        console.log(initialized);

        if (!initialized) {
            return "Loading...";
        }

        const { Multiprizer } = this.context.drizzleState.contracts;
        console.log("Multiprizer contract initialized? : ");
        console.log(Multiprizer.initialized);
        const _gameObj = Multiprizer.viewGameIDs[this.state.dataKey];
        const _gameIDsArray = _gameObj && _gameObj.value["_gameIDs"];
        const _gameIDsLength = _gameObj && _gameObj.value["_gameIDsLength"];
        console.log("@@@@@@@@ props inside DrizzleApp:  this.props is : ");
        console.log(this.context);
        console.log("____ gameObj value ______");
        console.log(_gameObj);

        const gameIDsJSX = _gameObj && (_gameIDsArray.map((gameID) =>
            <GameStrategy key={gameID} gameID={gameID} />
        ))

        return (
            <div className="container" >
                {gameIDsJSX}
            </div>
        );
    }
}


export default DrizzleApp;