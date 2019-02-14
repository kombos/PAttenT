import React, { Fragment } from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { DrizzleContext } from 'drizzle-react';
import NotificationBar from './NotificationBar';
import GameContainer from './GameContainer';
import GameStats from './GameStats';
import GameLogs from './GameLogs';

const styles = theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing.unit * 1,
        textAlign: 'center',
        color: theme.palette.text.secondary
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    notification: {
        //padding: theme.spacing.unit * 1,
        flexGrow: 1,
        //textAlign: 'center',
        //color: theme.palette.text.secondary,
    },
});


class GameDetails extends Component {

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

        console.log(" inside GameDetails render: ");
        this.gameID = this.props.gameID;
        const { classes } = this.props;
        const initialized = this.context.initialized;

        if (!initialized) {
            return "Loading...";
        }
        const gameKey = this.state.gameKey;
        const roundKey = this.state.roundKey;
        const multiprizer = this.props.drizzleState.contracts.Multiprizer;
        const drizzleState = this.props.drizzleState;
        const logEvents = this.props.drizzleState.contracts.Multiprizer.events;
        
        console.log("logevents: ", logEvents);

        console.log("# multiprizer: ", multiprizer);
        console.log("# gameKey inside GameDetails is : ", gameKey);

        const gameData = multiprizer.gameStrategies[gameKey];
        console.log("# gameobj inside GameDetails is : ", gameData && gameData);
        console.log("# is gameobj null? ", (gameData == null));

        const roundData = multiprizer.viewRoundInfo[roundKey];
        console.log("# roundData inside GameDetails is : ", roundData && roundData);

        let gameStats = null;
        let gameContainer = null;
        let gameLogs = null;
        let isGameLocked = null;

        if (this.gameID) {
            gameContainer = <GameContainer key={this.gameID} gameID={this.gameID} drizzleState={drizzleState} />;
            
        }

        if (gameData) {

            this.currentRound = gameData.value["currentRound"];
            isGameLocked = (gameData.value["isGameLocked"] ? "true" : "false");
            console.log("is game locked? : ", isGameLocked);
            console.log("current round is :::::: ", this.currentRound);
            console.log("expression value: ", isGameLocked != true && this.currentRound != 0);

            /* 
            this.context.drizzle.contracts.Multiprizer.events
            .logPlayGame({
                filter: { gameID: this.gameID, roundNumber: this.currentRound },
                fromBlock: 0
            }, (error, event) => {
                console.log("error value is : ",error);
                console.log("event obj value is: ", event);
            });
             */

             
            /* .on('data', (event) => console.log(event))
            .on('changed', (event) => console.log(event))
            .on('error', (error) => console.log(error)); */

            if (isGameLocked != true && this.currentRound != 0) {
                if (roundData) {
                    console.log("rounddata: ", roundData);

                    gameStats = <GameStats roundData={roundData} />;
                    //gameLogs = <GameLogs gameID={this.gameID} roundNumber={this.currentRound} />;
                }
            }

        }

        return (
            <Fragment>
                <NotificationBar />
                <Grid container spacing={24} className={classes.root}>
                    <Grid item xs={12} sm={12} md={5} lg={5} >
                        {gameLogs}
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} >
                        {gameStats}
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} lg={3} >
                        {gameContainer}
                    </Grid>
                </Grid>
            </Fragment>
        );
    }
}

export default withStyles(styles)(GameDetails);