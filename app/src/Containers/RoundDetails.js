import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
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


class RoundDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            roundKey: null,
        };
    }

    componentDidMount() {
        console.log('# $$$$$ INSIDE COMPONENT DID MOUNT $$$$$');
        this.updateRoundData(this.props.gameID, this.props.currentRound);
    }

    shouldComponentUpdate(nextProps) {
        console.log('inside componentDidUpdate :: ');
        if (
            this.props.gameID !== nextProps.gameID ||
            this.props.currentRound !== nextProps.currentRound ||
            this.props.isGameLocked !== nextProps.isGameLocked
        ) {
            this.updateRoundData(nextProps.gameID, nextProps.currentRound);
        }
        return true;
    }

    updateRoundData(gameID, currentRound) {
        const { drizzle } = this.props
        console.log('drizzle:: ', drizzle);
        // compute roundData and save key in state
        const roundKey = drizzle.contracts.Multiprizer.methods
            .viewRoundInfo.cacheCall(gameID, currentRound);
        console.log('roundkey: ', roundKey);
        this.setState({ roundKey: roundKey });
        console.log('roundkey in state: ', this.state.roundKey);
    }

    render() {
        console.log(' inside RoundDetails render: ');
        const { drizzle, drizzleState, classes } = this.props;
        const { gameID, currentRound, isGameLocked } = this.props;
        const { roundKey } = this.state;
        const { Multiprizer } = drizzleState.contracts;
        console.log('# Multiprizer: ', Multiprizer);
        const logEvents = Multiprizer.events;
        console.log('logevents: ', logEvents);
        console.log('# roundKey inside RoundDetails is : ', roundKey);

        const roundData = Multiprizer.viewRoundInfo[roundKey];
        console.log('# roundData inside RoundDetails is : ', roundData && roundData);

        let gameStats = null;
        let gameContainer = null;
        let gameLogs = null;
        let gameLogEvents = [];
        let playerList = null;
        let playerTokensList = null;

        console.log('gameID is :::::: ', gameID);
        console.log('current round is :::::: ', currentRound);
        console.log('is game locked? : ', isGameLocked);
        console.log('expression value: ', isGameLocked !== true && currentRound !== 0);

        if (isGameLocked !== true && currentRound !== 0) {
            if (roundData && roundData.value) {
                playerList = roundData.value._playerList;
                playerTokensList = roundData.value._playerTokensList;
                logEvents.forEach((logEvent, index) => {
                    if ((logEvent.event === 'LogPlayGame'
                        || logEvent.event === 'LogRevertGame')
                        && parseInt(logEvent.returnValues.gameID, 10) === gameID
                        && parseInt(logEvent.returnValues.roundNumber, 10) === currentRound) {
                        if (!(logEvents.findIndex(i => i.id === logEvent.id) < index)) {
                            gameLogEvents.push(logEvent);
                        }
                    }
                });

                console.log("gameLogEvents: ", gameLogEvents);

                gameStats = (
                    <GameStats
                        playerList={playerList}
                        playerTokensList={playerTokensList}
                    />
                );
                gameLogs = (
                    <GameLogs
                        events={gameLogEvents}
                    />
                );
            }
        }

        gameContainer = (
            <GameContainer
                gameID={gameID}
                drizzleState={drizzleState}
                drizzle={drizzle}
            />
        );

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

export default withStyles(styles)(RoundDetails);
