import React, { PureComponent } from 'react'

class GameComponent extends PureComponent {
    constructor(props) {
        super(props);
        console.log("# Inside GameComponent constructor : ");

    }

    render() {

        console.log("# Inside GameComponent render : ");
        const gameData = this.props.gameData;

        console.log("# gameobj inside gameComponent is : ", gameData && gameData);
        console.log("# is gameobj null ? ", (gameData == null));

        const gameID = gameData && gameData.value["gameID"];
        const maxTokens = gameData && gameData.value["maxTokens"];
        const tokenValue = gameData && gameData.value["tokenValue"];
        const gameDurationInEpoch = gameData && gameData.value["gameDurationInEpoch"];
        const gameDurationInBlocks = gameData && gameData.value["gameDurationInBlocks"];
        const maxTokensPerPlayer = gameData && gameData.value["maxTokensPerPlayer"];
        const houseEdge = gameData && gameData.value["houseEdge"];
        const megaPrizeEdge = gameData && gameData.value["megaPrizeEdge"];
        const totalValueForGame = gameData && gameData.value["totalValueForGame"];
        const totalWinnings = gameData && gameData.value["totalWinnings"];
        const directPlayTokenGas = gameData && gameData.value["directPlayTokenGas"];
        const currentRound = gameData && gameData.value["currentRound"];
        const isGameLocked = gameData && (gameData.value["isGameLocked"] ? "true" : "false");
        const isGameLateLocked = gameData && (gameData.value["isGameLateLocked"] ? "true" : "false");

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
            </div>
        );
    }

}

export default GameComponent;