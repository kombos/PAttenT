import React from 'react';
import { DrizzleContext } from 'drizzle-react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import GameInput from '../Components/GameInput';
import Timer from '../Components/Timer';
import Indicator from '../Components/Indicator';
import TokensData from '../Components/TokensData';
import PurchasedTokens from '../Components/PurchasedTokens';
import GameProps from '../Components/GameProps';
import MastHead from '../Components/MastHead';

const styles = theme => ({
    root: {
        // backgroundImage: `url("https://i.pinimg.com/originals/31/61/6c/31616c298eb3e33eeb461bdb857e515e.jpg")`,
        backgroundSize: 'cover',
        display: 'flex',
        flexGrow: 1,
        // minHeight:'70%',
        boxSizing: 'border-box',
        flexDirection: 'column',
        padding: theme.spacing.unit * 0.5,
        margin: '0.75rem 0.75rem 0.75rem 0.75rem',
        borderRadius: `${theme.shape.borderRadius * 3}px`,
        // filter: 'brightness(105%)',
    },
    components: {
        flexGrow: 1,
        // borderRadius:'12px',
        // margin:"0.4rem",
        // marginTop:"0.5rem",
        // height:"100%",
        // height:"auto",
        // backgroundImage: `url("https://www.justpushstart.com/wp-content/uploads/2011/10/Batman_arkham_city_logo.jpg")`
    },
});

class GameContainer extends React.Component {
    static contextType = DrizzleContext.Consumer;

    constructor(props, context) {
        super(props);
        this.state = {
            gameKey: null,
            roundKey: null,
        };
        this.context = context;
    }

    componentDidMount() {
        console.log('# $$$$$ INSIDE COMPONENT DID MOUNT $$$$$');
        const { gameID } = this.props;
        const { drizzle } = this.context;
        // get and save the key for the variable we are interested in
        const gameKey = drizzle.contracts.Multiprizer.methods.gameStrategies.cacheCall(gameID);
        console.log(`gameKey value is:${gameKey}`);
        this.setState({ gameKey: gameKey });
    }

    componentDidUpdate() {
        const { gameID } = this.props;
        const { gameKey, roundKey } = this.state;
        console.log('inside componentDidUpdate :: ');
        console.log('gameKey: ', gameKey, ' gameID: ', gameID, ' currentRound: ', this.currentRound, ' roundkey: ', roundKey);
        console.log('expression: ', this.currentRound && gameKey && gameID && !roundKey && this.currentRound !== 0);
        if (this.currentRound && this.prevRound && gameKey && gameID
            && (!roundKey || this.currentRound !== this.prevRound) && this.currentRound !== 0) {
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@inside if loop');
            const { drizzle } = this.context;
            console.log('drizzle:: ', drizzle);
            // get and save the key for the variable we are interested in
            const roundKeyObj = drizzle.contracts.Multiprizer.methods.viewRoundInfo
                .cacheCall(gameID, this.currentRound);
            this.setState({ roundKey: roundKeyObj });
            console.log('roundkey in state: ', roundKey);
        }
    }

    render() {
        console.log(' inside GameContainer render: ');
        const { gameID, drizzleState, classes } = this.props;
        const { gameKey, roundKey } = this.state;
        const { Multiprizer } = drizzleState.contracts;

        console.log('# Multiprizer: ', Multiprizer);
        console.log('# gameKey inside GameStrategy is : ', gameKey);

        const gameData = Multiprizer.gameStrategies[gameKey];
        console.log('# gameobj inside GameStrategy is : ', gameData && gameData);
        console.log('# is gameobj null? ', (gameData == null));

        const roundData = Multiprizer.viewRoundInfo[roundKey];
        console.log('# roundData inside GameStrategy is : ', roundData && roundData);

        let mastHead = null;
        let timer = null;
        let gameInput = null;
        let indicator = null;
        let gameDurationInEpoch = 0;
        let totalTokensPurchased = 0;
        let iterationStartTimeSecs = 0;
        let maxTokens = 0;
        let maxTokensPerPlayer = 0;
        let tokenData = null;
        let tokenValue = 0;
        let playerList = null;
        let playerTokensList = null;
        let isGameLocked = null;
        let playerTokens = 0;
        let totalWinnings = 0;
        let totalValueForGame = 0;
        let gameProps = null;
        const defaultAccount = this.context.drizzleState.accounts[0];

        console.log('default account: ', defaultAccount);

        if (gameData) {
            this.prevRound = this.currentRound;
            this.currentRound = parseInt(gameData.value.currentRound, 10);
            console.log("currentRound typeof: ", typeof this.currentRound, " and value: ", this.currentRound);
            maxTokens = parseInt(gameData.value.maxTokens, 10);
            maxTokensPerPlayer = parseInt(gameData.value.maxTokensPerPlayer, 10);
            tokenValue = gameData.value.tokenValue;
            console.log("tokenvalue typeof: ", typeof tokenValue, " and value: ", tokenValue);
            isGameLocked = gameData.value.isGameLocked;
            console.log("isgamelocked typeof: ", typeof isGameLocked, " and value: ", isGameLocked);
            totalValueForGame = gameData.value.totalValueForGame;
            console.log("totalValueForGame typeof: ", typeof totalValueForGame, " and value: ", totalValueForGame);
            totalWinnings = gameData.value.totalWinnings;
            console.log("totalWinnings typeof: ", typeof totalWinnings, " and value: ", totalWinnings);
            console.log('is game locked? : ', isGameLocked);
            console.log('current round is :::::: ', this.currentRound);
            console.log('expression value: ', isGameLocked !== true && this.currentRound !== 0);
            mastHead = <MastHead gameID={gameID} />;
            gameProps = (
                <GameProps
                    gameID={gameID}
                    currentRound={this.currentRound}
                    totalValueForGame={totalValueForGame}
                    totalWinnings={totalWinnings}
                />
            );

            if (isGameLocked !== true && this.currentRound !== 0) {
                if (roundData) {
                    gameDurationInEpoch = gameData.value.gameDurationInEpoch;
                    totalTokensPurchased = roundData.value._totalTokensPurchased;
                    iterationStartTimeSecs = roundData.value._roundStartTimeSecs;
                    tokenData = (
                        <TokensData
                            maxTokens={maxTokens}
                            tokensLeft={(maxTokens - totalTokensPurchased)}
                        />
                    );

                    if (defaultAccount) {
                        console.log('updated default account: ', this.context.drizzleState.accounts[0]);
                        playerList = roundData.value._playerList;
                        playerTokensList = roundData.value._playerTokensList;
                        if (playerList.indexOf(defaultAccount) > -1) {
                            playerTokens = playerTokensList[playerList.indexOf(defaultAccount)];
                        }

                        if (playerTokens > 0) {
                            indicator = (
                                <PurchasedTokens
                                    playerTokens={playerTokens}
                                    maxTokensPerPlayer={maxTokensPerPlayer}
                                    gameID={gameID}
                                    roundNumber={this.currentRound}
                                />
                            );
                        } else {
                            indicator = (
                                <Indicator
                                    userTokens={maxTokensPerPlayer}
                                    gameTokens={maxTokens}
                                    duration={gameDurationInEpoch}
                                    tokenValue={tokenValue}
                                    isGameLocked={isGameLocked}
                                />
                            );
                        }
                    }

                    timer = (
                        <Timer
                            duration={gameDurationInEpoch}
                            startTime={iterationStartTimeSecs}
                        />
                    );
                }
            } else {
                tokenData = (
                    <TokensData
                        maxTokens={0}
                        tokensLeft={0}
                    />
                );
                timer = <Timer duration={0} startTime={0} />;
                indicator = (
                    <Indicator
                        userTokens={0}
                        gameTokens={0}
                        duration={0}
                        tokenValue={0}
                        isGameLocked={true}
                    />
                );
            }
            gameInput = <GameInput gameData={gameData} playerTokens={playerTokens} />;
        }

        return (
            <div
                className={classes.root}
                style={{
                    backgroundImage: `url(${require(`../img/bg${gameID}.jpg`)})`,
                    // backgroundImage: 'url("../img/gameBG3.jpg")',
                }}
            >
                <div className={classes.components}>
                    {mastHead}
                </div>
                <div className={classes.components}>
                    {gameProps}
                </div>
                <div className={classes.components}>
                    {timer}
                </div>
                <div className={classes.components}>
                    {indicator}
                </div>
                <div className={classes.components}>
                    {tokenData}
                </div>
                <div className={classes.components}>
                    {gameInput}
                </div>
            </div>

        );
    }
}

// export default GameContainer;
GameContainer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GameContainer);
