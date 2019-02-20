import React, { Fragment } from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { DrizzleContext } from 'drizzle-react';
import NotificationBar from './NotificationBar';
import GameWinners from './GameWinners';
import GameMegaPrizeWinners from './GameMegaPrizeWinners';
import GameNotifications from './GameNotifications';
import Paper from '@material-ui/core/Paper';

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


class Notifications extends Component {

    static contextType = DrizzleContext.Consumer;
    constructor(props, context) {
        super(props);
        this.context = context;
    }

    render() {

        console.log(" inside GameDetails render: ");
        this.gameID = this.props.gameID;
        const { classes } = this.props;
        const initialized = this.context.initialized;
        let gameNotifications = null;
        let gameWinners = null;
        let gameMegaPrizeWinners = null;

        if (!initialized) {
            return "Loading...";
        }
        const web3 = this.context.drizzle.web3;
        const logEvents = this.props.drizzleState.contracts.Multiprizer.events;
        console.log("logevents: ", logEvents);

        if (logEvents) {

            const gameNotificationsLogs = logEvents.filter((eventLog, index, arr) => {
                console.log("INSIDE EVENT FILTER _____________________");
                if (index > 0 && eventLog.id == arr[index - 1].id) {
                    return false;
                }
                if (eventLog.event == "logPauseGames" ||
                    eventLog.event == "logResumeGames" ||
                    eventLog.event == "logRevertFunds" ||
                    eventLog.event == "logCompleteRound" ||
                    eventLog.event == "logGameLocked")
                    return true;
                else
                    return false

            });
            // prune the events and reformat
            let serial = 0;
            var gameNotificationsEvents = gameNotificationsLogs.map((value, index) => {
                let gameEvent = value.returnValues;
                gameEvent.transactionHash = value.transactionHash;
                gameEvent.serial = ++serial;
                gameEvent.logID = value.id;
                gameEvent.timeStamp = new Date(parseInt(gameEvent.timeSecs) * 1000).toLocaleString();
                switch (value.event) {
                    case "logPauseGames":
                        gameEvent.notification =
                            `All games are paused by Admin, until resumed. You can still revert your played tokens`;
                        break;

                    case "logResumeGames":
                        gameEvent.notification =
                            `All games are resumed by Admin now.`;
                        break;

                    case "logRevertFunds":
                        gameEvent.notification = `All played tokens have been reverted. Please click on withdraw button on top right corner to withdraw your funds.`;
                        break;

                    case "logCompleteRound":
                        gameEvent.notification = `Round ${gameEvent.roundNumber} of Game: ${gameEvent.gameID} has completed. Winners will be announced soon.`;
                        break;

                    case "logGameLocked":
                        gameEvent.notification = `Game: ${gameEvent.gameID} has been locked by Admin and will resume soon. Meanwhile all your funds are safe.`;
                        break;
                }

                return gameEvent;
            });

            const gameWinnersLogs = logEvents.filter((eventLog, index, arr) => {
                console.log("INSIDE EVENT FILTER _____________________");
                if (index > 0 && eventLog.id == arr[index - 1].id) {
                    return false;
                }
                if (eventLog.event == "logWinner")
                    return true;
                else
                    return false

            });

            // prune the events and reformat
            serial = 0;
            var gameWinnersEvents = gameWinnersLogs.map((value, index) => {
                let gameEvent = value.returnValues;
                gameEvent.transactionHash = value.transactionHash;
                gameEvent.serial = ++serial;
                gameEvent.logID = value.id;
                gameEvent.timeStamp = new Date(parseInt(gameEvent.timeSecs) * 1000).toLocaleString();
                gameEvent.playerAddressAbbr = value.returnValues.winnerAddress.toString().substr(0,12) + "..";
                gameEvent.prize = (web3.utils.fromWei((value.returnValues.winnerAmount).toString(), 'ether') + " eth");

                return gameEvent;
            });


            const gameMegaPrizeWinnersLogs = logEvents.filter((eventLog, index, arr) => {
                console.log("INSIDE EVENT FILTER _____________________");
                if (index > 0 && eventLog.id == arr[index - 1].id) {
                    return false;
                }
                if (eventLog.event == "logMegaPrizeWinner")
                    return true;
                else
                    return false

            });

            // prune the events and reformat
            serial = 0;
            var gameMegaPrizeEvents = gameMegaPrizeWinnersLogs.map((value, index) => {
                let gameEvent = value.returnValues;
                gameEvent.transactionHash = value.transactionHash;
                gameEvent.serial = ++serial;
                gameEvent.logID = value.id;
                gameEvent.timeStamp = new Date(parseInt(gameEvent.timeSecs) * 1000).toLocaleString();
                gameEvent.playerAddressAbbr = value.returnValues.megaPrizeWinner.toString().substr(0,12) + "..";
                gameEvent.prize = (web3.utils.fromWei((value.returnValues.megaPrizeAmount).toString(), 'ether') + " eth");

                return gameEvent;
            });

            gameNotifications = <GameNotifications events={gameNotificationsEvents} />;
            gameWinners = <GameWinners events={gameWinnersEvents} />;
            gameMegaPrizeWinners = <GameMegaPrizeWinners events={gameMegaPrizeEvents} />;
        }

        return (
                <Grid container spacing={24} className={classes.root}>
                    <Grid item xs={12} sm={12} md={4} lg={4} >
                        {gameNotifications}
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} >
                        {gameWinners}
                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4} >
                        {gameMegaPrizeWinners}
                    </Grid>
                </Grid>
        );
    }
}

export default withStyles(styles)(Notifications);