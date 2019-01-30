import React, { Component, PureComponent } from 'react'
import { DrizzleContext } from "drizzle-react";
import GameInput from "../GameInput";


class GameStrategy extends PureComponent {
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

/* 
    componentDidUpdate() {
        console.log("# GameStrategy: INSIDE COMPONENTDIDUPDATE : ");
        console.log("# _gameObj value now is : ", this._gameObj);
        if (this._gameObj == null) {
            console.log("null value verified");
            //this.forceUpdate();
            let _dataKey = this.state.dataKey;
            this.setState({ _dataKey });
        }
    }
     */

    render() {

        console.log(" inside gamestrategy render: ")
        const initialized = this.context.initialized;

        if (!initialized) {
            return "Loading...";
        }

        const contractState = this.props.contractState;
        console.log("contractState: ", contractState);
        const _gameID = this.props.gameID;
        console.log("# this.props.gameID : ", _gameID);

        console.log("datakey inside GameStrategy is : ",  this.state.dataKey);
        const _gameObj = contractState.gameStrategies[this.state.dataKey];
        console.log("gameobj inside GameStrategy is : ",  _gameObj && _gameObj);
        console.log(" is gameobj null ? ", (_gameObj == null));

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
        const directPlayTokenGas = _gameObj && _gameObj.value["directPlayTokenGas"];
        const currentRound = _gameObj && _gameObj.value["currentRound"];
        const isGameLocked = _gameObj && (_gameObj.value["isGameLocked"] ? "true" : "false");
        const isGameLateLocked = _gameObj && (_gameObj.value["isGameLateLocked"] ? "true" : "false");

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
                    <li> {directPlayTokenGas} </li>
                    <li> {currentRound} </li>
                    <li> {isGameLocked} </li>
                    <li> {isGameLateLocked} </li>
                </ul>
                <div className="GameInput"><GameInput gameID={_gameID} gameData={_gameObj} /></div>
            </div>
        );

    }

}

export default GameStrategy;