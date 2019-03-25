import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { DrizzleContext } from 'drizzle-react';
import ButtonBase from '@material-ui/core/ButtonBase';
import Tooltip from '@material-ui/core/Tooltip';
import { withRouter } from 'react-router';
import InfoIcon from '@material-ui/icons/Info';

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: 'rgba(1,5,16,0.7)',
    },
    container: {
        // padding: theme.spacing.unit * 0.5,
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
        width: '100%',
        overflow: 'hidden',
        boxSizing: 'border-box',
        // backgroundColor: "rgba(1,5,76,0.7)"
        // textAlign: 'center',
        // color: theme.palette.text.secondary,
    },
    child: {
        paddingLeft: theme.spacing.unit * 0.7,
        paddingRight: theme.spacing.unit * 0.7,
        // display: 'inline-block',
        flexGrow: 1,
        // lineHeight: '1.2em',
        // margin:'auto',
        // width: "100%",
        // height: 'auto',
        boxSizing: 'border-box',
        // minHeight:"50px",
        backgroundColor: 'rgba(17,210,254,0.9)',
        // textOverflow: 'ellipsis',
        // whiteSpace: 'nowrap',
        // overflowWrap:'break-word',
        wordBreak: 'break-all',
        overflowY: 'hidden',
        // borderRadius: theme.shape.borderRadius * 6,
        fontSize: '0.85rem',
        fontFamily: theme.typography.fontFamily,
        textAlign: 'left',
        // color: theme.palette.text.secondary,
    },
    infoIcon: {
        fontSize: '0.9em',
    },
});


class NotificationBar extends React.Component {
    static contextType = DrizzleContext.Consumer;

    constructor(props, context) {
        super(props);
        this.context = context;
        this.flag = true;
    }

    componentDidMount() {
        console.log('did mount  notificationDIV: ', document.getElementById('notificationDiv').clientHeight);
        console.log('notificationDIV(ext): ', document.getElementById('notificationDiv').offsetHeight);
        console.log('bounding obj:', document.getElementById('notificationDiv').getBoundingClientRect());
        console.log('did update  notificationDIV: ', document.getElementById('container').clientHeight);
        console.log('notificationDIV(ext): ', document.getElementById('container').offsetHeight);
        console.log('bounding obj:', document.getElementById('container').getBoundingClientRect());
    }

    shouldComponentUpdate(nextProps) {
        console.log('************** inside shouldcomponentupdate ((((((((((((((((((((((( ');
        console.log('this props: ', this.props.events.length, ' next props: ', nextProps.events.length);
        console.log('expression: ', (this.props.events.length !== nextProps.events.length));
        console.log('flag: ', this.flag);
        if (this.props.events.length !== nextProps.events.length) {
            this.flag = true;
            return true;
        }
        if (this.flag) {
            console.log('inside if');
            this.flag = false;
            this.getLatestNotifications();
            return true;
        }
        return false;
    }

    componentDidUpdate() {
        console.log('did update  notificationDIV: ', document.getElementById('notificationDiv').clientHeight);
        console.log('notificationDIV(ext): ', document.getElementById('notificationDiv').offsetHeight);
        console.log('bounding obj:', document.getElementById('notificationDiv').getBoundingClientRect());
        console.log('did update  notificationDIV: ', document.getElementById('container').clientHeight);
        console.log('notificationDIV(ext): ', document.getElementById('container').offsetHeight);
        console.log('bounding obj:', document.getElementById('container').getBoundingClientRect());
    }

    getLatestNotifications() {
        let serial = 0;
        this.notificationsJSX = [];
        let gameEvent = null;
        const gameEvents = [];
        const web3 = this.context.drizzle.web3;
        const { classes } = this.props;
        // filter only relevant events first
        this.logEvents.forEach((logEvent, index) => {
            if (
                logEvent.event === 'LogCompleteRound'
                || logEvent.event === 'LogGameLocked'
                || logEvent.event === 'LogWinner'
                || logEvent.event === 'LogMegaPrizeWinner') {
                if (!(this.logEvents.findIndex(i => i.id === logEvent.id) < index)) {
                    this.gameNotificationLogs.push(logEvent);
                }
            }
        });
        // prune the events and reformat

        for (let i = this.gameNotificationLogs.length - 1; i >= 0; i--) {
            gameEvent = this.gameNotificationLogs[i].returnValues;
            gameEvent.transactionHash = this.gameNotificationLogs[i].transactionHash;
            console.log('transaction hashes: ', gameEvent.transactionHash);
            serial += 1;
            gameEvent.serial = serial;
            gameEvent.logID = this.gameNotificationLogs[i].id;
            gameEvent.timeStamp = new Date(parseInt(gameEvent.timeSecs, 10) * 1000).toLocaleString();
            switch (this.gameNotificationLogs[i].event) {
            case 'LogCompleteRound':
                gameEvent.notification = `Round ${gameEvent.roundNumber} of Game: ${gameEvent.gameID} has completed. Winners will be announced soon.`;
                break;

            case 'LogGameLocked':
                gameEvent.notification = `Game: ${gameEvent.gameID} has been locked by Admin and will resume soon. Meanwhile all your funds are safe.`;
                break;

            case 'LogWinner':
                gameEvent.notification = `Game: ${gameEvent.gameID}, Round: ${gameEvent.roundNumber} winner is ${gameEvent.winnerAddress}. Prize: ${(web3.utils.fromWei((parseInt(gameEvent.winnerAmount, 10)).toString(), 'ether') + ' eth')}.`;

                break;

            case 'LogMegaPrizeWinner':
                gameEvent.notification = `MegaPrize: ${gameEvent.megaPrizeNumber} winner is ${gameEvent.megaPrizeWinner}. Prize: ${(web3.utils.fromWei((parseInt(gameEvent.megaPrizeAmount, 10)).toString(), 'ether') + ' eth')}.`;
                break;

            case 'LogPlayGame':
                gameEvent.notification = `Game: ${gameEvent.gameID}, Round: ${gameEvent.roundNumber} player is ${gameEvent.playerAddress}. Prize: ${gameEvent.playerTokens}`;
                break;

            default:
                gameEvent.notification = '';
                break;
            }
            gameEvents.push(gameEvent);
            this.notificationsJSX.push(
                <span key={gameEvent.logID}>
                    <InfoIcon className={classes.infoIcon} />
                    &nbsp;
                    {gameEvent.notification}
                    &nbsp;&nbsp;
                </span>
            );
            console.log('gameevents:: ', gameEvents);
            console.log('$$$$$$$$$$$$$$$$$$$$$$ condition: ', (i > 0 && this.gameNotificationLogs[i].transactionHash === this.gameNotificationLogs[i - 1].transactionHash));
            // this.notificationsJSX.push(<InfoIcon className={classes.infoIcon} />&nbsp;{gameEvent.notification}&nbsp;&nbsp;)
            // this.notificationsJSX.push(<span>&#9432;&nbsp;{gameEvent.notification}&nbsp;&nbsp;</span>);
            // notification = notification.concat(String.fromCharCode(8505)+". "+gameEvent.notification+"  ");
            if (!(i > 0 && this.gameNotificationLogs[i].transactionHash === this.gameNotificationLogs[i - 1].transactionHash)) {
                break;
            }
        }
    }

    render() {
        const { classes, history } = this.props;
        this.logEvents = this.props.events;
        this.gameNotificationLogs = [];
        const defaultNotification = "  Welcome! Input number of tokens to purchase and click 'Pay' to play!";

        console.log('logss: ', this.logEvents);

        /*  const this.gameNotificationLogs = this.logEvents.filter((eventLog, index, arr) => {
             console.log("INSIDE gameNotif EVENT FILTER _____________________");
             if (index > 0 && eventLog.id == arr[index - 1].id) {
                 return false;
             }
             if (eventLog.event == "logPauseGames" ||
                 eventLog.event == "logResumeGames" ||
                 eventLog.event == "logRevertFunds" ||
                 eventLog.event == "LogCompleteRound" ||
                 eventLog.event == "LogGameLocked" ||
                 eventLog.event == "LogWinner" ||
                 eventLog.event == "LogPlayGame" ||
                 eventLog.event == "LogMegaPrizeWinner")
                 return true;
             else
                 return false

         }); */


        console.log('this.logEvents: ', this.gameNotificationLogs);


        console.log('this.notificationsJSX: ', this.notificationsJSX);
        console.log('notification: : ', this.notificationsJSX);

        const renderLink = () => {
            history.push('/notifications');
        };

        return (
            <ButtonBase onClick={renderLink}>
                <Tooltip title="Notification Bar" placement="top">
                    <div id="container" className={classes.container}>
                        <div id="notificationDiv" className={classes.child}>
                            {(this.notificationsJSX && this.notificationsJSX.length !== 0) ? this.notificationsJSX : defaultNotification}
                        </div>
                    </div>
                </Tooltip>
            </ButtonBase>
        );
    }
}


export default withRouter(withStyles(styles)(NotificationBar));
