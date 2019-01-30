import React, { Fragment } from 'react'
import { DrizzleContext } from "drizzle-react";
import GameComponent from './GameComponent';
import GameInput from "./GameInput";


class GameContainer extends React.Component {
    static contextType = DrizzleContext.Consumer;
    constructor(props, context) {
        super(props);
        this.state = { dataKey: null };
        this.context = context;
    }

    componentDidMount() {
        console.log("# $$$$$ INSIDE COMPONENT DID MOUNT $$$$$");
        const gameID = this.props.gameID;
        const multiprizer = this.context.drizzle.contracts.Multiprizer;
        // get and save the key for the variable we are interested in
        const dataKey = multiprizer.methods["gameStrategies"].cacheCall(gameID);
        console.log("datakey value is:" + dataKey);
        this.setState({ dataKey });
    }

    render() {

        console.log(" inside GameContainer render: ");
        const initialized = this.context.initialized;

        if (!initialized) {
            return "Loading...";
        }
        const dataKey = this.state.dataKey;
        const multiprizer = this.props.drizzleState.contracts.Multiprizer
        console.log("# multiprizer: ", multiprizer);
        console.log("# datakey inside GameStrategy is : ", dataKey);

        const gameData = multiprizer.gameStrategies[dataKey];
        console.log("# gameobj inside GameStrategy is : ", gameData && gameData);
        console.log("# is gameobj null? ", (gameData == null));

        return (
            <Fragment>
                <GameComponent gameData={gameData && gameData} />
                <GameInput gameData={gameData && gameData} />
            </Fragment>
        );

    }

}

export default GameContainer;