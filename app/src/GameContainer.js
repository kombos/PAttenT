import React, { Fragment } from 'react'
import { DrizzleContext } from "drizzle-react";
import GameComponent from './GameComponent';
import GameInput from "./GameInput";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Timer from "./Components/Timer";
import { Route, Link } from "react-router-dom";
import Indicator from "./Indicator";
import TokensData from './TokensData';
import PurchasedTokens from './PurchasedTokens';
import GameProps from './GameProps';
import MastHead from './MastHead';
//import bg from './img/gameBG3.jpg';


const styles = theme => ({
    root: {
        //backgroundImage: `url("https://i.pinimg.com/originals/31/61/6c/31616c298eb3e33eeb461bdb857e515e.jpg")`,
        backgroundSize: 'cover',
        display: 'flex',
        flexGrow:1,
        //minHeight:'70%',
        boxSizing: 'border-box',
        flexDirection: "column",
        padding: theme.spacing.unit * 0.5,
        margin: '0.75rem 0.75rem 0.75rem 0.75rem',
        borderRadius: `${theme.shape.borderRadius * 3}px`,
        //filter: 'brightness(105%)',
    },
    components: {
        flexGrow: 1,
        //borderRadius:'12px',
        //margin:"0.4rem",
        //marginTop:"0.5rem",
        //height:"100%",
        //height:"auto",
        //backgroundImage: `url("https://www.justpushstart.com/wp-content/uploads/2011/10/Batman_arkham_city_logo.jpg")`
    },

});


class GameContainer extends React.Component {
    static contextType = DrizzleContext.Consumer;
    constructor(props, context) {
        super(props);
        this.state =
            {
                gameKey: null,
                roundKey: null,
            };
        this.context = context;
    }

    componentDidMount() {
        console.log("# $$$$$ INSIDE COMPONENT DID MOUNT $$$$$");
        const gameID = this.props.gameID;
        const multiprizer = this.context.drizzle.contracts.Multiprizer;
        // get and save the key for the variable we are interested in
        const gameKey = multiprizer.methods["gameStrategies"].cacheCall(gameID);
        console.log("gameKey value is:" + gameKey);
        this.setState({ gameKey: gameKey });
    }

    componentDidUpdate() {
        console.log("inside componentDidUpdate :: ");
        console.log("gameKey: ", this.state.gameKey, " gameID: ", this.gameID, " currentRound: ", this.currentRound, " roundkey: ", this.state.roundKey);
        console.log("expression: ", this.currentRound && this.state.gameKey && this.gameID && !this.state.roundKey && this.currentRound != 0);
        if (this.currentRound && this.prevRound && this.state.gameKey && this.gameID && (!this.state.roundKey || this.currentRound != this.prevRound) && this.currentRound != 0) {
            console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@inside if loop");
            const multiprizer = this.context.drizzle.contracts.Multiprizer;
            // get and save the key for the variable we are interested in
            const roundKey = multiprizer.methods["viewRoundInfo"].cacheCall(this.gameID, this.currentRound);
            this.setState({ roundKey: roundKey });
            console.log("roundkey in state: ", this.state.roundKey);
        }

    }

    render() {

        console.log(" inside GameContainer render: ");
        this.gameID = this.props.gameID;
        const { classes } = this.props;
        const initialized = this.context.initialized;

        if (!initialized) {
            return "Loading...";
        }
        const gameKey = this.state.gameKey;
        const roundKey = this.state.roundKey;
        const multiprizer = this.props.drizzleState.contracts.Multiprizer;

        console.log("# multiprizer: ", multiprizer);
        console.log("# gameKey inside GameStrategy is : ", gameKey);

        const gameData = multiprizer.gameStrategies[gameKey];
        console.log("# gameobj inside GameStrategy is : ", gameData && gameData);
        console.log("# is gameobj null? ", (gameData == null));

        const roundData = multiprizer.viewRoundInfo[roundKey];
        console.log("# roundData inside GameStrategy is : ", roundData && roundData);

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
        let defaultAccount = this.context.drizzleState.accounts[0];

        console.log("default account: ", defaultAccount);

        if (gameData) {
            this.prevRound = this.currentRound;
            this.currentRound = gameData.value["currentRound"];
            maxTokens = gameData.value["maxTokens"];
            maxTokensPerPlayer = gameData.value["maxTokensPerPlayer"];
            tokenValue = gameData.value["tokenValue"];
            isGameLocked = (gameData.value["isGameLocked"] ? true : false);
            totalValueForGame = gameData.value["totalValueForGame"];
            totalWinnings = gameData.value["totalWinnings"];
            console.log("is game locked? : ", isGameLocked);
            console.log("current round is :::::: ", this.currentRound);
            console.log("expression value: ", isGameLocked != true && this.currentRound != 0);
            mastHead = <MastHead gameID={this.gameID} />
            gameProps = <GameProps gameID={this.gameID} currentRound={this.currentRound}
                totalValueForGame={totalValueForGame} totalWinnings={totalWinnings} />

            if (isGameLocked != true && this.currentRound != 0) {
                if (roundData) {
                    gameDurationInEpoch = gameData.value["gameDurationInEpoch"];
                    totalTokensPurchased = roundData.value["_totalTokensPurchased"];
                    iterationStartTimeSecs = roundData.value["_roundStartTimeSecs"];
                    tokenData = <TokensData maxTokens={maxTokens}
                        tokensLeft={(maxTokens - totalTokensPurchased)} />;

                    if (defaultAccount) {
                        console.log("updated default account: ", this.context.drizzleState.accounts[0]);
                        playerList = roundData.value["_playerList"];
                        playerTokensList = roundData.value["_playerTokensList"];
                        if (playerList.indexOf(defaultAccount) > -1) {
                            playerTokens = playerTokensList[playerList.indexOf(defaultAccount)];
                        }

                        if (playerTokens > 0) {
                            indicator = <PurchasedTokens playerTokens={playerTokens}
                                maxTokensPerPlayer={maxTokensPerPlayer} gameID={this.gameID} roundNumber={this.currentRound} />
                        }
                        else {
                            indicator = <Indicator userTokens={maxTokensPerPlayer} gameTokens={maxTokens}
                                duration={gameDurationInEpoch} tokenValue={tokenValue} isGameLocked={isGameLocked} />
                        }

                        if (this.gameID == 104) {

                            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
                            console.log("game duration: ", gameDurationInEpoch, " startTime: ", iterationStartTimeSecs, "gameID: ", this.gameID);
                            console.log("total tokens purchased: ", totalTokensPurchased);
                            console.log("playerLIst : ", playerList);
                            console.log(" tokenslist: ", playerTokensList);
                            console.log("playerTokens: ", playerTokens);
                            console.log("gameID: ", this.gameID, " round: ", this.currentRound);
                            console.log("%%%%%%%%%%%%%%%%%%%%%%%%% tokens left: ", (maxTokens - totalTokensPurchased));
                            console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");

                        }
                    }

                    timer = <Timer duration={gameDurationInEpoch} startTime={iterationStartTimeSecs} />;
                }

            }

            else {
                tokenData = <TokensData maxTokens={0}
                    tokensLeft={0} />;
                timer = <Timer duration={0} startTime={0} />;
                indicator = <Indicator userTokens={0} gameTokens={0}
                    duration={0} tokenValue={0} isGameLocked={isGameLocked} />
            }
            gameInput = <GameInput gameData={gameData} playerTokens={playerTokens} />;

        }

        return (
            <div className={classes.root} style={{
                backgroundImage: `url(${require(`./img/bg${this.gameID}.jpg`)})`,
                //backgroundImage: 'url("./img/gameBG3.jpg")',
            }}>
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

//export default GameContainer;
GameContainer.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(GameContainer);