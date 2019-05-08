import React from 'react';
import RoundContainer from './RoundContainer';

class GameContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            gameKey: null,
        };
    }

    componentDidMount() {
        console.log('# $$$$$ INSIDE COMPONENT DID MOUNT $$$$$');
        const { gameID, drizzle } = this.props;
        // get and save the key for the variable we are interested in
        const gameKey = drizzle.contracts.Multiprizer.methods.gameStrategies.cacheCall(gameID);
        console.log('gameKey: ', gameKey);
        this.setState({ gameKey: gameKey });
    }

    render() {
        console.log('inside GameContainer');
        const { gameID, drizzle, drizzleState } = this.props;
        const { gameKey } = this.state;
        console.log('GameStrategy is : ', gameKey);
        const { Multiprizer } = drizzleState.contracts;
        console.log('Multiprizer: ', Multiprizer);
        const gameData = Multiprizer.gameStrategies[gameKey];
        console.log('gameobj inside GameStrategy is : ', gameData && gameData);
        console.log('is gameobj null? ', (gameData == null));

        let roundContainer = null;
        let currentRound = 0;
        let gameDurationInEpoch = 0;
        let maxTokens = 0;
        let maxTokensPerPlayer = 0;
        let tokenValue = 0;
        let isGameLocked = null;
        let totalWinnings = 0;
        let totalValueForGame = 0;

        if (gameData && gameData.value) {
            currentRound = parseInt(gameData.value.currentRound, 10);
            console.log("currentRound typeof: ", typeof currentRound, " and value: ", currentRound);
            maxTokens = parseInt(gameData.value.maxTokens, 10);
            console.log("maxTokens typeof: ", typeof maxTokens, " and value: ", maxTokens);
            maxTokensPerPlayer = parseInt(gameData.value.maxTokensPerPlayer, 10);
            console.log("maxTokensPerPlayer typeof: ", typeof maxTokensPerPlayer, " and value: ", maxTokensPerPlayer);
            tokenValue = gameData.value.tokenValue;
            console.log("tokenvalue typeof: ", typeof tokenValue, " and value: ", tokenValue);
            isGameLocked = gameData.value.isGameLocked;
            console.log("isgamelocked typeof: ", typeof isGameLocked, " and value: ", isGameLocked);
            totalValueForGame = gameData.value.totalValueForGame;
            console.log("totalValueForGame typeof: ", typeof totalValueForGame, " and value: ", totalValueForGame);
            totalWinnings = gameData.value.totalWinnings;
            console.log("totalWinnings typeof: ", typeof totalWinnings, " and value: ", totalWinnings);
            gameDurationInEpoch = gameData.value.gameDurationInEpoch;
            console.log("gameDurationInEpoch typeof: ", typeof gameDurationInEpoch, " and value: ", gameDurationInEpoch);
            roundContainer = (
                <RoundContainer
                    gameID={parseInt(gameID, 10)}
                    currentRound={parseInt(currentRound, 10)}
                    maxTokens={parseInt(maxTokens, 10)}
                    maxTokensPerPlayer={parseInt(maxTokensPerPlayer, 10)}
                    tokenValue={tokenValue}
                    totalValueForGame={totalValueForGame}
                    totalWinnings={totalWinnings}
                    gameDurationInEpoch={parseInt(gameDurationInEpoch, 10)}
                    isGameLocked={isGameLocked}
                    drizzle={drizzle}
                    drizzleState={drizzleState}
                />
            );
        }

        return (roundContainer);
    }
}

export default GameContainer;
