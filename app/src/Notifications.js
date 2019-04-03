import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { DrizzleContext } from 'drizzle-react';
import GameWinners from './GameWinners';
import GameMegaPrizeWinners from './GameMegaPrizeWinners';
import GameNotifications from './GameNotifications';

const styles = theme => ({
    flexChild: {
        flexGrow: 1,
        width: '100%',
        height: 'auto',
        boxSizing: 'border-box',
        alignItems: 'center',
        [theme.breakpoints.down(425)]: {
            width: '100%',
        },
        [theme.breakpoints.up(425)]: {
            width: '100%',
        },
        [theme.breakpoints.up(525)]: {
            width: '100%',
        },
        [theme.breakpoints.up(theme.breakpoints.keys[1])]: {
            width: '90%',
        },
        [theme.breakpoints.up(700)]: {
            width: '80%',
        },
        [theme.breakpoints.up(800)]: {
            width: '80%',
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
            width: '65%',
        },
        margin: '1.5rem auto 1.5rem auto',
        // padding: theme.spacing.unit * 1,
        // backgroundColor: "rgba(32,114,76,0.7)",
    },
});


class Notifications extends React.Component {
    static contextType = DrizzleContext.Consumer;

    constructor(props, context) {
        super(props);
        this.context = context;
        this.flag = true;
    }

    shouldComponentUpdate(nextProps) {
        console.log('************** inside shouldcomponentupdate ((((((((((((((((((((((( ');
        console.log('this props: ', this.props.events.length, ' next props: ', nextProps.events.length);
        console.log('expression: ', (this.props.events.length !== nextProps.events.length));
        if (this.props.events.length !== nextProps.events.length) {
            return true;
        }
        return false;
    }

    componentDidUpdate() {
        console.log('inside componentDidUpdate ::::::::::::::::::::::::::::::::::::::::::::: ');
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

    getEvents() {
        // const logEvents = this.props.drizzleState.contracts.Multiprizer.events;
        const logEvents = this.props.events;
        console.log('logevents: ', logEvents);

        if (logEvents) {
            const gameNotificationsLogs = [];
            const gameWinnersLogs = [];
            const gameMegaPrizeWinnersLogs = [];

            logEvents.forEach((logEvent, index) => {
                if (!(logEvents.findIndex(i => i.id === logEvent.id) < index)) {
                    if (
                        logEvent.event === 'LogCompleteRound'
                        || logEvent.event === 'LogCompleteMPRound'
                        || logEvent.event === 'LogGameUnlocked'
                        || logEvent.event === 'LogGameLocked') {
                        gameNotificationsLogs.push(logEvent);
                    }
                    if (logEvent.event === 'LogWinner') {
                        gameWinnersLogs.push(logEvent);
                    }
                    if (logEvent.event === 'LogMegaPrizeWinner') {
                        gameMegaPrizeWinnersLogs.push(logEvent);
                    }
                }
            });

            console.log('gamenotificationslogs: ', gameNotificationsLogs);

            this.gameNotifications = <GameNotifications events={gameNotificationsLogs} />;
            this.gameWinners = <GameWinners events={gameWinnersLogs} />;
            this.gameMegaPrizeWinners = <GameMegaPrizeWinners events={gameMegaPrizeWinnersLogs} />;
        }
    }


    render() {
        console.log(' inside Notifications render: ');
        this.gameID = this.props.gameID;
        const { classes } = this.props;
        const initialized = this.context.initialized;
        this.getEvents();

        if (!initialized) {
            return 'Loading...';
        }

        return (
            <Grid container spacing={0} className={classes.flexChild}>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    {this.gameNotifications}
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    {this.gameWinners}
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                    {this.gameMegaPrizeWinners}
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles)(Notifications);
