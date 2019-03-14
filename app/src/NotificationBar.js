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

    render() {

        const { classes, history } = this.props;
        const logEvents = this.props.events;
        const web3 = this.context.drizzle.web3;
        let gameNotificationsLogs = [];

        console.log("logss: ", logEvents);

       /*  const gameNotificationsLogs = logEvents.filter((eventLog, index, arr) => {
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

        logEvents.forEach((logEvent, index) => {

            if (
                /* logEvent.event == "logPauseGames" ||
                logEvent.event == "logResumeGames" ||
                logEvent.event == "logRevertFunds" || */
                logEvent.event == "logCompleteRound" ||
                logEvent.event == "logGameLocked" ||
                logEvent.event == "logWinner" ||
                logEvent.event == "logPlayGame" ||
                logEvent.event == "logMegaPrizeWinner") {
                if (!(logEvents.findIndex(i => i.id === logEvent.id) < index)) {
                    gameNotificationsLogs.push(logEvent);
                }
            }
        });

        console.log("logevents: ", gameNotificationsLogs);

        // prune the events and reformat
        let serial = 0;
        let notificationJSX = [];
        let defaultNotification = "  Welcome! Input number of tokens to purchase and click 'Pay' to play!"
        let gameEvent = null;
        let gameEvents = [];
        for (let i = gameNotificationsLogs.length - 1; i >= 0; i--) {
            if (gameNotificationsLogs[i].transactionHash == gameNotificationsLogs[gameNotificationsLogs.length - 1].transactionHash) {
                gameEvent = gameNotificationsLogs[i].returnValues;
                gameEvent.transactionHash = gameNotificationsLogs[i].transactionHash;
                gameEvent.serial = ++serial;
                gameEvent.logID = gameNotificationsLogs[i].id;
                gameEvent.timeStamp = new Date(parseInt(gameEvent.timeSecs) * 1000).toLocaleString();
                switch (gameNotificationsLogs[i].event) {
                   /*  case "logPauseGames":
                        gameEvent.notification =
                            `All games are temporarily paused by Admin. You can still revert your played tokens.`;
                        break;

                    case "logResumeGames":
                        gameEvent.notification =
                            `All games are resumed by Admin now.`;
                        break;

                    case "logRevertFunds":
                        gameEvent.notification = `All played tokens have been reverted. Please click on withdraw button on top right corner to withdraw your funds.`;
                        break; */

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
                notificationJSX.push(<span key={gameEvent.logID}><InfoIcon className={classes.infoIcon} />&nbsp;{gameEvent.notification}&nbsp;&nbsp;</span>)
                //notificationJSX.push(<InfoIcon className={classes.infoIcon} />&nbsp;{gameEvent.notification}&nbsp;&nbsp;)
                //notificationJSX.push(<span>&#9432;&nbsp;{gameEvent.notification}&nbsp;&nbsp;</span>);
                //notification = notification.concat(String.fromCharCode(8505)+". "+gameEvent.notification+"  ");
            }
            else {
                break;
            }
        }


        console.log("gameevents:: ", gameEvents);
        console.log("notificationJSX: ", notificationJSX);

        /* this.gameEvents = gameNotificationsLogs.map((value, index, arr) => {
            let gameEvent = value.returnValues;
            gameEvent.transactionHash = value.transactionHash;
            gameEvent.serial = ++serial;
            gameEvent.logID = value.id;
            gameEvent.timeStamp = new Date(parseInt(gameEvent.timeSecs) * 1000).toLocaleString();
            switch (value.event) {
                case "logPauseGames":
                    gameEvent.notification =
                        `All games are temporarily paused by Admin. You can still revert your played tokens.`;
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

            return gameEvent;
        });
 */

        console.log("notification: : ", notificationJSX);

        const renderLink = () => {
            history.push(`/notifications`);
        };

        return (
            <ButtonBase onClick={renderLink}>
                <Tooltip title="Notification Bar" placement="top">
                    <div id="container" className={classes.container}>
                        <div id="notificationDiv" className={classes.child}>
                            {notificationJSX.length != 0 ? notificationJSX : defaultNotification}
                        </div>
                    </div >
                </Tooltip>
            </ButtonBase >
        );
    }
}


export default withRouter(withStyles(styles)(NotificationBar));