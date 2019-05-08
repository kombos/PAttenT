import React from 'react';
import RoundDetails from './RoundDetails';
import PageNotFound from '../Components/PageNotFound';

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

    shouldComponentUpdate(nextProps) {
        if (!isNaN(parseInt(nextProps.gameID)) && nextProps.gameID !== this.props.gameID) {
            const { drizzle } = this.props;
            const { Multiprizer } = drizzle.contracts;
            const gameKey = Multiprizer.methods.gameStrategies.cacheCall(nextProps.gameID);
            console.log(`re-rendered gameKey value is:${gameKey}`);
            this.setState({ gameKey: gameKey });
        }
        return true;
    }

    render() {
        console.log(' inside GameDetails render: ');
        const { gameID, drizzle, drizzleState } = this.props;
        if (isNaN(parseInt(gameID))) return <PageNotFound />;
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
        let gameIDofGameStrategy = null;

        if (gameData && gameData.value) {
            console.log('gameID is :::::: ', gameID);
            gameIDofGameStrategy = parseInt(gameData.value.gameID);
            console.log('gameIDofGameStrategy is :::::: ', gameIDofGameStrategy);
            currentRound = parseInt(gameData.value.currentRound, 10);
            console.log('current round is :::::: ', currentRound);
            isGameLocked = gameData.value.isGameLocked;
            console.log('is game locked? : ', isGameLocked);
            if (
                gameID !== 0
                && gameIDofGameStrategy !== 0
                && currentRound !== 0
                && isGameLocked !== true
                && gameID === gameIDofGameStrategy
            ) {
                roundDetails = (
                    <RoundDetails
                        gameID={gameID}
                        currentRound={currentRound}
                        isGameLocked={isGameLocked}
                        drizzle={drizzle}
                        drizzleState={drizzleState}
                    />
                );
            } else {
                roundDetails = (
                    <PageNotFound />
                );
            }

        }

        return (roundDetails);
    }
}

export default GameDetails;
