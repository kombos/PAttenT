import React from 'react';
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
        //filter: 'blur(5px)',
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

class RoundContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            roundKey: null,
        };
    }

    componentDidMount() {
        if (this.props.gameID === 106) {
            console.log('# $$$$$ INSIDE COMPONENT DID MOUNT $$$$$');
        }
        this.updateRoundData(this.props.gameID, this.props.currentRound);
    }

    shouldComponentUpdate(nextProps) {
        if (this.props.gameID === 106) {
            console.log("inside shouldComponentUpdate()");
            console.log("currentRound: ", this.props.currentRound, " nextRound: ", nextProps.currentRound);
            if (this.props.currentRound !== nextProps.currentRound)
                console.log("%%%%%%%%%%%%%%%%%%% different here! %%%%%%%%%%%%%%%%%%%");
        }
        if (
            this.props.gameID !== nextProps.gameID ||
            this.props.currentRound !== nextProps.currentRound ||
            // this.props.maxTokens !== nextProps.maxTokens ||
            // this.props.maxTokensPerPlayer !== nextProps.maxTokensPerPlayer ||
            // this.props.tokenValue !== nextProps.tokenValue ||
            // this.props.totalValueForGame !== nextProps.totalValueForGame ||
            // this.props.totalWinnings !== nextProps.totalWinnings ||
            // this.props.gameDurationInEpoch !== nextProps.gameDurationInEpoch ||
            this.props.isGameLocked !== nextProps.isGameLocked
        ) {
            this.updateRoundData(nextProps.gameID, nextProps.currentRound);
        }
        return true;
    }

    updateRoundData(gameID, currentRound) {
        const { drizzle } = this.props
        // compute roundData and save key in state
        const roundKey = drizzle.contracts.Multiprizer.methods
            .viewRoundInfo.cacheCall(gameID, currentRound);
        this.setState({ roundKey: roundKey });
        if (gameID === 106) {
            console.log("inside updateRoundData()");
            console.log('drizzle:: ', drizzle);
            console.log('roundkey: ', roundKey);
            console.log('roundkey in state: ', this.state.roundKey);
        }
    }

    render() {
        const { drizzleState, classes } = this.props;
        const { gameID, currentRound, maxTokens, maxTokensPerPlayer, tokenValue, totalValueForGame,
            totalWinnings, gameDurationInEpoch, isGameLocked } = this.props;
        const { roundKey } = this.state;
        const { Multiprizer } = drizzleState.contracts;
        const roundData = Multiprizer.viewRoundInfo[roundKey];
        // declare variables representing components
        let mastHead = null;
        let gameProps = null;
        let tokenData = null;
        let indicator = null;
        let timer = null;
        let gameInput = null;
        // declare variables for calculations and component props
        let totalTokensPurchased = 0;
        let roundStartTimeSecs = 0;
        let playerList = null;
        let playerTokensList = null;
        let playerTokens = 0;
        const defaultAccount = drizzleState.accounts[0];
        if (gameID === 106) {
            console.log(' inside RoundContainer render: ');
            console.log('# Multiprizer: ', Multiprizer);
            console.log('# roundData inside GameStrategy is : ', roundData && roundData);
            console.log('default account: ', defaultAccount);
        }
        mastHead = <MastHead gameID={gameID} />;
        gameProps = (
            <GameProps
                gameID={gameID}
                currentRound={currentRound}
                totalValueForGame={totalValueForGame}
                totalWinnings={totalWinnings}
            />
        );
        if (gameID === 106)
            console.log('expression value: ', !isGameLocked && currentRound !== 0);
        if (!isGameLocked && currentRound !== 0) {
            if (roundData && roundData.value) {
                totalTokensPurchased = parseInt(roundData.value._totalTokensPurchased, 10);
                roundStartTimeSecs = parseInt(roundData.value._roundStartTimeSecs, 10);
                if (gameID === 106) {
                    console.log("inside if condition block");
                    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&   roundStartTimeSecs: ", roundStartTimeSecs);
                    console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&   gameDurationInEpoch: ", gameDurationInEpoch);
                }
                playerList = roundData.value._playerList;
                playerTokensList = roundData.value._playerTokensList;
                tokenData = (
                    <TokensData
                        maxTokens={maxTokens}
                        tokensLeft={(maxTokens - totalTokensPurchased)}
                    />
                );
                if (playerList.indexOf(defaultAccount) > -1) {
                    playerTokens = playerTokensList[playerList.indexOf(defaultAccount)];
                }
                if (playerTokens > 0) {
                    indicator = (
                        <PurchasedTokens
                            playerTokens={playerTokens}
                            maxTokensPerPlayer={maxTokensPerPlayer}
                            gameID={gameID}
                            roundNumber={currentRound}
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
                timer = (
                    <Timer
                        duration={gameDurationInEpoch}
                        startTime={roundStartTimeSecs}
                    />
                );
                gameInput = (
                    <GameInput
                        gameID={gameID}
                        maxTokens={maxTokens}
                        tokenValue={tokenValue}
                        isGameLocked={isGameLocked}
                        currentRound={currentRound}
                        maxTokensPerPlayer={maxTokensPerPlayer}
                        playerTokens={playerTokens}
                        totalTokensPurchased={totalTokensPurchased}
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
            gameInput = (
                <GameInput
                    gameID={gameID}
                    maxTokens={0}
                    tokenValue={0}
                    isGameLocked={true}
                    currentRound={0}
                    maxTokensPerPlayer={0}
                    playerTokens={0}
                    totalTokensPurchased={0}
                />
            );
        }

        return (
            <div
                className={classes.root}
                style={{
                    backgroundImage: `url(${require(`../img/bg${gameID}.jpg`)})`,
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

RoundContainer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RoundContainer);
