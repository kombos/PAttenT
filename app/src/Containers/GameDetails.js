import React from 'react';
import RoundDetails from './RoundDetails';


class GameDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            gameKey: null,
        };
    }

    componentDidMount() {
        console.log('# $$$$$ INSIDE COMPONENT DID MOUNT $$$$$');
        const { gameID, drizzle } = this.props;
        const { Multiprizer } = drizzle.contracts;
        // get and save the key for the variable we are interested in
        const gameKey = Multiprizer.methods.gameStrategies.cacheCall(gameID);
        console.log(`gameKey value is:${gameKey}`);
        this.setState({ gameKey: gameKey });
    }

    render() {
        console.log(' inside GameDetails render: ');
        const { gameID, drizzle, drizzleState } = this.props;
        const { gameKey } = this.state;
        const { Multiprizer } = drizzleState.contracts;
        console.log('# Multiprizer: ', Multiprizer);
        const logEvents = Multiprizer.events;
        console.log('logevents: ', logEvents);
        console.log('# gameKey inside GameDetails is : ', gameKey);
        const gameData = Multiprizer.gameStrategies[gameKey];
        console.log('# gameobj inside GameDetails is : ', gameData && gameData);
        console.log('# is gameobj null? ', (gameData == null));

        let roundDetails = null;
        let isGameLocked = null;
        let currentRound = null;

        if (gameData && gameData.value) {
            currentRound = parseInt(gameData.value.currentRound, 10);
            console.log('current round is :::::: ', currentRound);
            isGameLocked = gameData.value.isGameLocked;
            console.log('is game locked? : ', isGameLocked);
            roundDetails = (
                <RoundDetails 
                    gameID={gameID}
                    currentRound={currentRound}
                    isGameLocked={isGameLocked}
                    drizzle={drizzle}
                    drizzleState={drizzleState}
                />
            );
        }

        return (roundDetails);
    }
}

export default GameDetails;
