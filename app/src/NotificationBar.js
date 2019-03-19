import React, { Fragment } from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { DrizzleContext } from 'drizzle-react';
import { Route, Link } from "react-router-dom";
import ButtonBase from '@material-ui/core/ButtonBase';
import Tooltip from '@material-ui/core/Tooltip';
import { withRouter } from "react-router";
import InfoIcon from '@material-ui/icons/Info';

const styles = theme => ({
    container: {
        //padding: theme.spacing.unit * 0.5,
        display: 'flex',
        lineHeight: '1.2em',
        [theme.breakpoints.down(theme.breakpoints.keys[2])]: {
            height: '4.8em',
        },
        [theme.breakpoints.up(theme.breakpoints.keys[2])]: {
            height: '2.4em',
        },
        margin: '0.3em auto auto auto',
        flexGrow: 1,
        width: "100%",
        overflow: 'hidden',
        boxSizing: 'border-box',
        //backgroundColor: "rgba(1,5,76,0.7)"
        //textAlign: 'center',
        //color: theme.palette.text.secondary,
    },
    child: {
        //padding: theme.spacing.unit * 0.7,
        //display: 'inline-block',
        flexGrow: 1,
        //lineHeight: '1.2em',
        //margin:'auto',
        //width: "100%",
        //height: 'auto',
        boxSizing: 'border-box',
        //minHeight:"50px",
        backgroundColor: "rgba(17,210,254,0.9)",
        textOverflow: 'ellipsis',
        //whiteSpace: 'nowrap',
        //overflowWrap:'break-word',
        wordBreak: 'break-all',
        overflowY: 'hidden',
        //borderRadius: theme.shape.borderRadius * 6,
        fontSize: "0.85rem",
        fontFamily: theme.typography.fontFamily,
        textAlign: 'left',
        //color: theme.palette.text.secondary,
    },
    infoIcon: {
        fontSize: "0.9em",
    },
});


class NotificationBar extends React.Component {

    static contextType = DrizzleContext.Consumer;

    constructor(props, context) {
        super(props);
        this.context = context;
        this.flag = true;
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log("************** inside shouldcomponentupdate ((((((((((((((((((((((( ");
        console.log("this props: ", this.props.events.length, " next props: ", nextProps.events.length);
        console.log("expression: ", (this.props.events.length != nextProps.events.length));
        console.log("flag: ", this.flag);
        if (this.props.events.length != nextProps.events.length){
            this.flag = true;
            return true;
        }
        else {
            if(this.flag){
                console.log("inside if");
                this.flag = false;
                this.getLatestNotifications();
                return true;
            }
            return false;
        }
    }

    componentDidUpdate() {
        console.log("did update  notificationDIV: ", document.getElementById('notificationDiv').clientHeight);
        console.log("notificationDIV(ext): ", document.getElementById('notificationDiv').offsetHeight);
        console.log("bounding obj:", document.getElementById('notificationDiv').getBoundingClientRect());
        console.log("did update  notificationDIV: ", document.getElementById('container').clientHeight);
        console.log("notificationDIV(ext): ", document.getElementById('container').offsetHeight);
        console.log("bounding obj:", document.getElementById('container').getBoundingClientRect());
    }

    componentDidMount() {
        console.log("did mount  notificationDIV: ", document.getElementById('notificationDiv').clientHeight);
        console.log("notificationDIV(ext): ", document.getElementById('notificationDiv').offsetHeight);
        console.log("bounding obj:", document.getElementById('notificationDiv').getBoundingClientRect());
        console.log("did update  notificationDIV: ", document.getElementById('container').clientHeight);
        console.log("notificationDIV(ext): ", document.getElementById('container').offsetHeight);
        console.log("bounding obj:", document.getElementById('container').getBoundingClientRect());
    }

    getLatestNotifications() {
        let serial = 0;
        this.notificationsJSX = [];
        let gameEvent = null;
        let gameEvents = [];
        const web3 = this.context.drizzle.web3;
        const { classes } = this.props;
        // filter only relevant events first
        this.logEvents.forEach((logEvent, index) => {

            if (
                logEvent.event == "logCompleteRound" ||
                logEvent.event == "logGameLocked" ||
                logEvent.event == "logWinner" ||
                logEvent.event == "logMegaPrizeWinner") {
                if (!(this.logEvents.findIndex(i => i.id === logEvent.id) < index)) {
                    this.gameNotificationLogs.push(logEvent);
                }
            }
        });
        // prune the events and reformat

        for (let i = this.gameNotificationLogs.length - 1; i >= 0; i--) {

            gameEvent = this.gameNotificationLogs[i].returnValues;
            gameEvent.transactionHash = this.gameNotificationLogs[i].transactionHash;
            console.log("transaction hashes: ", gameEvent.transactionHash);
            gameEvent.serial = ++serial;
            gameEvent.logID = this.gameNotificationLogs[i].id;
            gameEvent.timeStamp = new Date(parseInt(gameEvent.timeSecs) * 1000).toLocaleString();
            switch (this.gameNotificationLogs[i].event) {

                case "logCompleteRound":
                    gameEvent.notification = `Round ${gameEvent.roundNumber} of Game: ${gameEvent.gameID} has completed. Winners will be announced soon.`;
                    break;

                case "logGameLocked":
                    gameEvent.notification = `Game: ${gameEvent.gameID} has been locked by Admin and will resume soon. Meanwhile all your funds are safe.`;
                    break;

                case "logWinner":
                    gameEvent.notification = `Game: ${gameEvent.gameID}, Round: ${gameEvent.roundNumber} winner is ${gameEvent.winnerAddress}. Prize: ${(web3.utils.fromWei((parseInt(gameEvent.winnerAmount)).toString(), 'ether') + " eth")}.`;

                    break;

                case "logMegaPrizeWinner":
                    gameEvent.notification = `MegaPrize: ${gameEvent.megaPrizeNumber} winner is ${gameEvent.megaPrizeWinner}. Prize: ${(web3.utils.fromWei((parseInt(gameEvent.megaPrizeAmount)).toString(), 'ether') + " eth")}.`;
                    break;

                case "logPlayGame":
                    gameEvent.notification = `Game: ${gameEvent.gameID}, Round: ${gameEvent.roundNumber} player is ${gameEvent.playerAddress}. Prize: ${gameEvent.playerTokens}`;
                    break;
            }
            gameEvents.push(gameEvent);
            this.notificationsJSX.push(<span key={gameEvent.logID}><InfoIcon className={classes.infoIcon} />&nbsp;{gameEvent.notification}&nbsp;&nbsp;</span>)
            console.log("gameevents:: ", gameEvents);
            console.log("$$$$$$$$$$$$$$$$$$$$$$ condition: ", (i > 0 && this.gameNotificationLogs[i].transactionHash == this.gameNotificationLogs[i - 1].transactionHash));
            //this.notificationsJSX.push(<InfoIcon className={classes.infoIcon} />&nbsp;{gameEvent.notification}&nbsp;&nbsp;)
            //this.notificationsJSX.push(<span>&#9432;&nbsp;{gameEvent.notification}&nbsp;&nbsp;</span>);
            //notification = notification.concat(String.fromCharCode(8505)+". "+gameEvent.notification+"  ");
            if (i > 0 && this.gameNotificationLogs[i].transactionHash == this.gameNotificationLogs[i - 1].transactionHash) {
                continue;
            }
            else {
                break;
            }
        }
    }

    render() {

        const { classes, history } = this.props;
        this.logEvents = this.props.events;
        this.gameNotificationLogs = [];
        let defaultNotification = "  Welcome! Input number of tokens to purchase and click 'Pay' to play!"

        console.log("logss: ", this.logEvents);

        /*  const this.gameNotificationLogs = this.logEvents.filter((eventLog, index, arr) => {
             console.log("INSIDE gameNotif EVENT FILTER _____________________");
             if (index > 0 && eventLog.id == arr[index - 1].id) {
                 return false;
             }
             if (eventLog.event == "logPauseGames" ||
                 eventLog.event == "logResumeGames" ||
                 eventLog.event == "logRevertFunds" ||
                 eventLog.event == "logCompleteRound" ||
                 eventLog.event == "logGameLocked" ||
                 eventLog.event == "logWinner" ||
                 eventLog.event == "logPlayGame" ||
                 eventLog.event == "logMegaPrizeWinner")
                 return true;
             else
                 return false
 
         }); */



        console.log("this.logEvents: ", this.gameNotificationLogs);




        console.log("this.notificationsJSX: ", this.notificationsJSX);
        console.log("notification: : ", this.notificationsJSX);

        const renderLink = () => {
            history.push(`/notifications`);
        };

        return (
            <ButtonBase onClick={renderLink}>
                <Tooltip title="Notification Bar" placement="top">
                    <div id="container" className={classes.container}>
                        <div id="notificationDiv" className={classes.child}>
                            {(this.notificationsJSX && this.notificationsJSX.length != 0) ? this.notificationsJSX : defaultNotification}
                        </div>
                    </div >
                </Tooltip>
            </ButtonBase >
        );
    }
}


export default withRouter(withStyles(styles)(NotificationBar));