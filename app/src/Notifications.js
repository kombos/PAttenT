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
        this.flag = true;

    }

    getEvents() {
        //const logEvents = this.props.drizzleState.contracts.Multiprizer.events;
        const logEvents = this.props.events;
        console.log("logevents: ", logEvents);

        if (logEvents) {
            let gameNotificationsLogs = [];
            let gameWinnersLogs = [];
            let gameMegaPrizeWinnersLogs = [];

            logEvents.forEach((logEvent, index) => {
                if (logEvents.findIndex(i => i.id === logEvent.id) < index) {
                    return false;
                }
                if (
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

            console.log("gamenotificationslogs: ", gameNotificationsLogs);

            this.gameNotifications = <GameNotifications events={gameNotificationsLogs} />;
            this.gameWinners = <GameWinners events={gameWinnersLogs} />;
            this.gameMegaPrizeWinners = <GameMegaPrizeWinners events={gameMegaPrizeWinnersLogs} />;
        }
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

    /* shouldComponentUpdate(nextProps, nextState) {
        console.log("************** inside shouldcomponentupdate ((((((((((((((((((((((( ");
        console.log("this props: ", this.props.events.length, " next props: ", nextProps.events.length);
        console.log("expression: ", (this.props.events.length != nextProps.events.length))
        if (this.props.events.length != nextProps.events.length) {
            this.flag = true;
            return true;
        }
        else {
            if (this.flag) {
                console.log("inside if");
                this.flag = false;
                this.getEvents();
                return true;
            }
            return false;
        }
    } */

    render() {

        console.log(" inside Notifications render: ");
        this.gameID = this.props.gameID;
        const { classes } = this.props;
        const initialized = this.context.initialized;
        this.getEvents();

        if (!initialized) {
            return "Loading...";
        }

        return (
            <Grid container spacing={0} className={classes.flexChild}>
                <Grid item xs={12} sm={12} md={4} lg={4} >
                    {this.gameNotifications}
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} >
                    {this.gameWinners}
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} >
                    {this.gameMegaPrizeWinners}
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(Notifications);