import React, { Fragment } from 'react'
import { DrizzleContext } from "drizzle-react";
import GameComponent from './GameComponent';
import GameInput from "./GameInput";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Timer from "./Components/Timer";

const styles = theme => ({
    root: {
        backgroundImage: `url("https://www.pixelstalk.net/wp-content/uploads/2016/03/Blue-Butterfly-Wallpaper-download-free.jpg")`,
        //height: 500
        //backgroundColor: "blue",
        //flexBasis:
        flexDirection: "column",
        padding: theme.spacing.unit * 1
    },
    paper: {
        flexGrow: 1,
        // padding: theme.spacing.unit * 2,
        textAlign: "center",
        color: theme.palette.text.primary
    },
    picture: {
        //backgroundImage: `url("https://www.justpushstart.com/wp-content/uploads/2011/10/Batman_arkham_city_logo.jpg")`,
        flexGrow: 1
    },
    components: {
        flexGrow: 1,
        backgroundImage: `url("https://www.justpushstart.com/wp-content/uploads/2011/10/Batman_arkham_city_logo.jpg")`
    },
    timer: {
        backgroundColor: "rgba(12,54,76,0.7)",
        fontFamily: "Orbitron",
        color: "#17d4fe",
        fontSize: 8
    }
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
        console.log("gameKey: ", this.state.gameKey, " gameID: ", this.gameID, " currentRound: ", this.currentRound);
        console.log("expression: ", this.currentRound && this.state.gameKey && this.gameID && !this.state.roundKey && this.currentRound != 0);
        if (this.currentRound && this.state.gameKey && this.gameID && !this.state.roundKey && this.currentRound != 0) {
            console.log("inside if loop");
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

        let timer = null;
        let gameInput = null;
        let indicator = null;
        let gameDurationInEpoch = 0;
        let totalTokensPurchased = 0;
        let iterationStartTimeSecs = 0;
        let maxTokens = 0;
        let maxTokensPerPlayer = 0;
        let tokenData = null;
        let playerList = null;
        let playerTokensList = null;
        let playerTokens = 0;
        let defaultAccount = this.context.drizzleState.accounts[0];
        console.log("default account: ", defaultAccount);

        if (gameData) {
            this.currentRound = gameData.value["currentRound"];
            maxTokens = gameData.value["maxTokens"];
            maxTokensPerPlayer = gameData.value["maxTokensPerPlayer"];
            const isGameLocked = (gameData.value["isGameLocked"] ? "true" : "false");
            console.log("is game locked? : ", isGameLocked);


            console.log("current round is :::::: ", this.currentRound);
            console.log("expression value: ", isGameLocked != true && this.currentRound != 0);

            if (isGameLocked != true && this.currentRound != 0) {
                if (roundData) {
                    gameDurationInEpoch = gameData.value["gameDurationInEpoch"];
                    totalTokensPurchased = roundData.value["_totalTokensPurchased"];
                    iterationStartTimeSecs = roundData.value["_iterationStartTimeSecs"];
                    tokenData = <div className={classes.tokenData}>
                        <p> Tokens Left : {(maxTokens - totalTokensPurchased)}</p>
                        <p> Out of: {maxTokens}</p>
                    </div>;


                    if (defaultAccount) {
                        console.log("updated default account: ", this.context.drizzleState.accounts[0]);

                        playerList = roundData.value["_playerList"];
                        playerTokensList = roundData.value["_playerTokensList"];
                        if (playerList.indexOf(defaultAccount) > -1) {
                            playerTokens = playerTokensList[playerList.indexOf(defaultAccount)];
                        }
                        /* else
                            playerTokens = 0; */
                        if (playerTokens > 0) {
                            indicator = <div className={classes.indicator}>
                                <p> Purchased : {playerTokens}</p>
                                <p> Out of: {maxTokensPerPlayer}</p>
                            </div>;
                        }

                    }
                    console.log("game duration: ", gameDurationInEpoch, " startTime: ", iterationStartTimeSecs);
                    timer = <Timer duration={gameDurationInEpoch} startTime={iterationStartTimeSecs} />;
                }

            }

            else {
                tokenData = <div className={classes.tokenData}>
                    <p> Tokens Left : {0}</p>
                    <p> Out of: {0}</p>
                </div>;
                timer = <Timer duration={0} startTime={0} />;

            }
            gameInput = <GameInput gameData={gameData} playerTokens={playerTokens} />;

        }

        return (
            <div className={classes.root}>
                <div className={classes.picture}>
                    <p>Game ID:  {this.gameID} | Round: {this.currentRound} </p>
                </div>
                <div className={classes.timer}>
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