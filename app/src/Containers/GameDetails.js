import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { DrizzleContext } from 'drizzle-react';
import GameContainer from './GameContainer';
import NotificationBar from '../Components/NotificationBar';
import GameStats from '../Components/GameStats';
import GameLogs from '../Components/GameLogs';

const styles = theme => ({
    flexContainer: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        width: '100%',
        height: 'auto',
        // maxWidth: '85%',
        margin: 'auto',
        // backgroundColor: "rgba(162,54,176,0.7)",
        boxSizing: 'border-box',

    },
    flexChild: {
        flexGrow: 1,
        width: '100%',
        height: 'auto',
        margin: '1.5rem auto 1.5rem auto',
        // padding: theme.spacing.unit * 1,
        // backgroundColor: "rgba(32,114,76,0.7)",
        boxSizing: 'border-box',
        alignItems: 'center',
        [theme.breakpoints.down(425)]: {
            width: '100%',
        },
        [theme.breakpoints.up(425)]: {
            width: '90%',
        },
        [theme.breakpoints.up(525)]: {
            width: '75%',
        },
        [theme.breakpoints.up(theme.breakpoints.keys[1])]: {
            width: '75%',
        },
        [theme.breakpoints.up(700)]: {
            width: '60%',
        },
        [theme.breakpoints.up(800)]: {
            width: '60%',
        },
        [theme.breakpoints.up(theme.breakpoints.keys[2])]: {
            width: '100%',
        },
        [theme.breakpoints.up(1440)]: {
            width: '90%',
        },
        [theme.breakpoints.up(1720)]: {
            width: '75%',
        },
        [theme.breakpoints.up(theme.breakpoints.keys[4])]: {
            width: '50%',
        },

    },
});


class GameDetails extends React.Component {
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
        const multiprizer = this.context.drizzle.contracts.Multiprizer;
        // get and save the key for the variable we are interested in
        const gameKey = multiprizer.methods.gameStrategies.cacheCall(gameID);
        console.log('gameKey value is:' + gameKey);
        this.setState({ gameKey: gameKey });
    }

    componentDidUpdate() {
        console.log('inside componentDidUpdate :: ');
        console.log('gameKey: ', this.state.gameKey, ' gameID: ', this.gameID, ' currentRound: ', this.currentRound);
        console.log('expression: ', this.currentRound && this.state.gameKey && this.gameID && !this.state.roundKey && this.currentRound !== 0);
        if (this.currentRound && this.state.gameKey && this.gameID
            && (!this.state.roundKey || this.currentRound !== this.prevRound) && this.currentRound !== 0) {
            console.log('inside if loop');
            const multiprizer = this.context.drizzle.contracts.Multiprizer;
            // get and save the key for the variable we are interested in
            const roundKey = multiprizer.methods.viewRoundInfo.cacheCall(this.gameID, this.currentRound);
            this.setState({ roundKey: roundKey });
            console.log('roundkey in state: ', this.state.roundKey);
        }
    }

    render() {
        console.log(' inside GameDetails render: ');
        this.gameID = this.props.gameID;
        const { classes } = this.props;
        const gameKey = this.state.gameKey;
        const roundKey = this.state.roundKey;
        const multiprizer = this.props.drizzleState.contracts.Multiprizer;
        const drizzleState = this.props.drizzleState;
        const logEvents = this.props.drizzleState.contracts.Multiprizer.events;

        console.log('logevents: ', logEvents);
        console.log('# multiprizer: ', multiprizer);
        console.log('# gameKey inside GameDetails is : ', gameKey);

        const gameData = multiprizer.gameStrategies[gameKey];
        console.log('# gameobj inside GameDetails is : ', gameData && gameData);
        console.log('# is gameobj null? ', (gameData == null));

        const roundData = multiprizer.viewRoundInfo[roundKey];
        console.log('# roundData inside GameDetails is : ', roundData && roundData);

        let gameStats = null;
        let gameContainer = null;
        let gameLogs = null;
        let isGameLocked = null;

        if (this.gameID) {
            gameContainer = <GameContainer key={this.gameID} gameID={this.gameID} drizzleState={drizzleState} />;
        }

        if (gameData) {
            const gameLogEvents = [];
            this.prevRound = this.currentRound;
            this.currentRound = gameData.value.currentRound;
            isGameLocked = (gameData.value.isGameLocked ? 'true' : 'false');
            console.log('is game locked? : ', isGameLocked);
            console.log('current round is :::::: ', this.currentRound);
            console.log('expression value: ', isGameLocked !== true && this.currentRound !== 0);

            if (isGameLocked !== true && this.currentRound !== 0) {
                if (roundData) {
                    console.log('rounddata: ', roundData);

                    logEvents.forEach((logEvent, index) => {
                        if ((logEvent.event === 'LogPlayGame'
                            || logEvent.event === 'LogRevertGame')
                            && logEvent.returnValues.gameID === this.gameID
                            && logEvent.returnValues.roundNumber === this.currentRound) {
                            if (!(logEvents.findIndex(i => i.id === logEvent.id) < index)) {
                                gameLogEvents.push(logEvent);
                            }
                        }
                    });

                    /*
                                        const gameLogEvents = logEvents.filter((eventLog, index, arr) => {
                                            console.log("INSIDE EVENT FILTER _____________________");
                                            if (index > 0 && eventLog.id == arr[index - 1].id) {
                                                return false;
                                            }
                                            if ((eventLog.event == "LogPlayGame" ||
                                                eventLog.event == "LogRevertGame") &&
                                                eventLog.returnValues.gameID == this.gameID &&
                                                eventLog.returnValues.roundNumber == this.currentRound)
                                                return true;
                                            else
                                                return false

                                        });
                     */


                    gameStats = <GameStats roundData={roundData} roundNumber={this.currentRound} />;
                    gameLogs = <GameLogs events={gameLogEvents} />;
                }
            }
        }

        return (
            <div className={classes.flexContainer}>
                <NotificationBar events={logEvents} />
                <Grid container spacing={0} className={classes.flexChild} direction="row">
                    <Grid item xs={12} sm={12} md={5} lg={5}>
                        {gameLogs}
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                        {gameStats}
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} lg={3}>
                        {gameContainer}
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(GameDetails);
