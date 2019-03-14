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
    flexChild: {
        flexGrow: 1,
        width: '100%',
        height: 'auto',
        margin: '1.5rem auto 1.5rem auto',
        //padding: theme.spacing.unit * 1,
        //backgroundColor: "rgba(32,114,76,0.7)",
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


class Notifications extends React.Component {

    static contextType = DrizzleContext.Consumer;
    constructor(props, context) {
        super(props);
        this.context = context;
    }

    componentDidUpdate() {
        console.log("inside componentDidUpdate ::::::::::::::::::::::::::::::::::::::::::::: ");

    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log("************** inside shouldcomponentupdate ((((((((((((((((((((((( ");
        console.log("this props: ", this.props.events.length, " next props: ", nextProps.events.length);
        console.log("expression: ", (this.props.events.length != nextProps.events.length))
        if (this.props.events.length != nextProps.events.length)
            return true;
        else
            return false;
    }

    render() {

        console.log(" inside Notifications render: ");
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
        //const logEvents = this.props.events;
        console.log("logevents: ", logEvents);

        if (logEvents) {
            let gameNotificationsLogs = [];
            let gameWinnersLogs = [];
            let gameMegaPrizeWinnersLogs = [];



            logEvents.forEach((logEvent, index) => {
                if (logEvents.findIndex(i => i.id === logEvent.id) < index) {
                    return false;
                }
                if (logEvent.event == "logPauseGames" ||
                    logEvent.event == "logResumeGames" ||
                    logEvent.event == "logRevertFunds" ||
                    logEvent.event == "logCompleteRound" ||
                    logEvent.event == "logGameLocked") {
                    gameNotificationsLogs.push(logEvent);
                }
                if (logEvent.event == "logWinner") {
                    gameWinnersLogs.push(logEvent);
                }
                if (logEvent.event == "logMegaPrizeWinner") {
                    gameMegaPrizeWinnersLogs.push(logEvent);
                }

            });

            /* const gameNotificationsLogs = logEvents.filter((eventLog, index, arr) => {
                console.log("INSIDE gameNotif EVENT FILTER _____________________");
                console.log("equal? :: ", index > 0 && eventLog.id == arr[index - 1].id);
                
                if (eventLog.event == "logPauseGames" ||
                    eventLog.event == "logResumeGames" ||
                    eventLog.event == "logRevertFunds" ||
                    eventLog.event == "logCompleteRound" ||
                    eventLog.event == "logGameLocked") {
                        
                    }
                else
                    return false

            });
            

            const gameWinnersLogs = logEvents.filter((eventLog, index, arr) => {
                console.log("INSIDE  Winner EVENT FILTER _____________________");
                if (index > 0 && eventLog.id == arr[index - 1].id) {
                    return false;
                }
                if (eventLog.event == "logWinner")
                    return true;
                else
                    return false

            });


            const gameMegaPrizeWinnersLogs = logEvents.filter((eventLog, index, arr) => {
                console.log("INSIDE MegaPrize winner EVENT FILTER _____________________");
                if (index > 0 && eventLog.id == arr[index - 1].id) {
                    return false;
                }
                if (eventLog.event == "logMegaPrizeWinner")
                    return true;
                else
                    return false

            }); */


            gameNotifications = <GameNotifications events={gameNotificationsLogs} />;
            gameWinners = <GameWinners events={gameWinnersLogs} />;
            gameMegaPrizeWinners = <GameMegaPrizeWinners events={gameMegaPrizeWinnersLogs} />;
        }

        return (
            <Grid container spacing={0} className={classes.flexChild}>
                <Grid item xs={12} sm={12} md={4} lg={4} >
                    {gameNotifications}
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={5} >
                    {gameWinners}
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={3} >
                    {gameMegaPrizeWinners}
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(Notifications);