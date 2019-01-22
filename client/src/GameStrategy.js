import React, { Component } from 'react'
import { DrizzleContext } from "drizzle-react";
import GameInput from "./GameInput";

class GameStrategy extends Component {
    static contextType = DrizzleContext.Consumer;
    constructor(props, context) {
        super(props);
        this.state = { dataKey: null };
        console.log(this.props.gameID, ": ___ inside GameStrategy constructor___");
        this.context = context;
    }

    componentDidMount() {
        console.log(this.props.gameID, " $$$$$ INSIDE COMPONENT DID MOUNT $$$$$");
        const multiprizer = this.context.drizzle.contracts.Multiprizer;
        // get and save the key for the variable we are interested in
        const dataKey = multiprizer.methods["gameStrategies"].cacheCall(this.props.gameID);
        console.log("datakey value is:" + dataKey);
        this.setState({ dataKey });
    }

    render() {

        /* console.log("!!!!!!!!! Context inside GameStrategy:  this.context is : ");
        console.log(this.context);
        console.log("this.state.datakey : ", this.props.dataKey); */

        const initialized = this.context.initialized;
        /* console.log("initialized value: ");
        console.log(initialized); */

        if (!initialized) {
            return "Loading...";
        }

        const { Multiprizer } = this.context.drizzleState.contracts;
        console.log(this.props.gameID, ": Multiprizer contract initialized? : ");
        console.log(this.props.gameID, " : ", Multiprizer.initialized);
        const _gameObj = Multiprizer.gameStrategies[this.state.dataKey];

        const gameID = _gameObj && _gameObj.value["gameID"];
        const maxTokens = _gameObj && _gameObj.value["maxTokens"];
        const tokenValue = _gameObj && _gameObj.value["tokenValue"];
        const gameDurationInEpoch = _gameObj && _gameObj.value["gameDurationInEpoch"];
        const gameDurationInBlocks = _gameObj && _gameObj.value["gameDurationInBlocks"];
        const maxTokensPerPlayer = _gameObj && _gameObj.value["maxTokensPerPlayer"];
        const houseEdge = _gameObj && _gameObj.value["houseEdge"];
        const megaPrizeEdge = _gameObj && _gameObj.value["megaPrizeEdge"];
        const totalValueForGame = _gameObj && _gameObj.value["totalValueForGame"];
        const totalWinnings = _gameObj && _gameObj.value["totalWinnings"];
        const directPlayTokenValue = _gameObj && _gameObj.value["directPlayTokenValue"];
        const currentRound = _gameObj && _gameObj.value["currentRound"];
        const isGameLocked = _gameObj && (_gameObj.value["isGameLocked"] ? "true" : "false");
        const isGameLateLocked = _gameObj && (_gameObj.value["isGameLateLocked"] ? "true" : "false");

        /*         console.log("@@@@@@@@ props inside DrizzleApp:  this.props is : ");
                console.log(this.context);
                console.log("____ gameObj value ______");
                console.log(_gameObj);
         */

        return (
            <div className="col-sm-3" >
                <ul>
                    <li> {gameID} </li>
                    <li> {maxTokens} </li>
                    <li> {tokenValue} </li>
                    <li> {gameDurationInEpoch} </li>
                    <li> {gameDurationInBlocks} </li>
                    <li> {maxTokensPerPlayer} </li>
                    <li> {houseEdge} </li>
                    <li> {megaPrizeEdge} </li>
                    <li> {totalValueForGame} </li>
                    <li> {totalWinnings} </li>
                    <li> {directPlayTokenValue} </li>
                    <li> {currentRound} </li>
                    <li> {isGameLocked} </li>
                    <li> {isGameLateLocked} </li>
                </ul>
                <div className="GameInput"><GameInput gameID={this.props.gameID} gameStrategy={_gameObj} /></div>
            </div>
        );
    }

}

export default GameStrategy;