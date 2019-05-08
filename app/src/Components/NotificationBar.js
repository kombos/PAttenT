import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { DrizzleContext } from 'drizzle-react';
import ButtonBase from '@material-ui/core/ButtonBase';
import Tooltip from '@material-ui/core/Tooltip';
import { withRouter } from 'react-router';
import InfoIcon from '@material-ui/icons/Info';

const styles = theme => ({
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
        flexGrow: 1,
        // lineHeight: '1.2em',
        // margin:'auto',
        // width: "100%",
        // height: 'auto',
        boxSizing: 'border-box',
        // minHeight:"50px",
        backgroundColor: '#17d4fe',
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
        /* console.log('did mount  notificationDIV: ', document.getElementById('notificationDiv').clientHeight);
        console.log('notificationDIV(ext): ', document.getElementById('notificationDiv').offsetHeight);
        console.log('bounding obj:', document.getElementById('notificationDiv').getBoundingClientRect());
        console.log('did update  notificationDIV: ', document.getElementById('container').clientHeight);
        console.log('notificationDIV(ext): ', document.getElementById('container').offsetHeight);
        console.log('bounding obj:', document.getElementById('container').getBoundingClientRect()); */
    }

    shouldComponentUpdate(nextProps) {
        console.log('************** inside shouldcomponentupdate ((((((((((((((((((((((( ');
        console.log('this props: ', this.props.events.length, ' next props: ', nextProps.events.length);
        console.log('expression: ', (this.props.events.length !== nextProps.events.length));
        if (this.props.events.length !== nextProps.events.length) {
            // this.flag = true;
            return true;
        }
        return false;
    }

    componentDidUpdate() {
        /* console.log('did update  notificationDIV: ', document.getElementById('notificationDiv').clientHeight);
        console.log('notificationDIV(ext): ', document.getElementById('notificationDiv').offsetHeight);
        console.log('bounding obj:', document.getElementById('notificationDiv').getBoundingClientRect());
        console.log('did update  notificationDIV: ', document.getElementById('container').clientHeight);
        console.log('notificationDIV(ext): ', document.getElementById('container').offsetHeight);
        console.log('bounding obj:', document.getElementById('container').getBoundingClientRect()); */
    }

    getLatestNotifications() {
        this.notificationsJSX = [];
        let gameEvent = null;
        let backEvent = null;
        const gameEvents = [];
        // const idArray = [];
        const { drizzle } = this.context;
        const { web3 } = drizzle;
        const { events, classes } = this.props;
        console.log('events:: ', events);
        if (events.length === 0) return;
        // filter only relevant events first
        for (var i = (events.length - 1); i >= 0; i--) {
            backEvent = events[i];
            if (!(backEvent.event === 'LogCompleteRound'
                || backEvent.event === 'LogCompleteMPRound'
                || backEvent.event === 'LogGameLocked'
                || backEvent.event === 'LogGameUnlocked'
                || backEvent.event === 'LogWinner'
                || backEvent.event === 'LogMegaPrizeWinner')) {
                continue;
            } else break;
        }

        console.log('txhash:: ', backEvent.transactionHash);
        console.log('events.length-1 : ', (events.length - 1));
        // if (idArray.findIndex(i => i === backEvent.id) !== -1) continue;
        // if (i < (events.length - 1) && gameEvents && backEvent.transactionHash !== gameEvents[0].transactionHash) break;
        // idArray.push(backEvent.id);
        gameEvent = backEvent.returnValues;
        gameEvent.transactionHash = backEvent.transactionHash;
        console.log('transaction hashes: ', gameEvent.transactionHash);
        gameEvent.logID = backEvent.id;
        switch (backEvent.event) {
            case 'LogCompleteRound':
                if (gameEvent.numPlayers > 1) {
                    gameEvent.notification = `Round ${gameEvent.roundNumber} of Game: ${gameEvent.gameID} has completed. Winners will be announced soon. Click to know more.`;
                    break;
                } else {
                    if (gameEvent.numPlayers === 1) {
                        gameEvent.notification = `Round ${gameEvent.roundNumber} of Game: ${gameEvent.gameID} has completed. Amount refunded to player due to no competitors. Click to know more.`;
                        break;
                    } else {
                        gameEvent.notification = `Round ${gameEvent.roundNumber} of Game: ${gameEvent.gameID} has completed. No contenders participated. Click to know more.`;
                        break;
                    }
                }

            case 'LogCompleteMPRound':
                if (gameEvent.numPlayers > 1) {
                    gameEvent.notification = `MegaPrize: ${gameEvent.megaPrizeNumber} has completed. Winners will be announced soon. Click to know more.`;
                    break;
                } else {
                    gameEvent.notification = `MegaPriz: ${gameEvent.megaPrizeNumber} has completed. Amount carried forward to next round due to no contenders.`;
                    break;
                }

            case 'LogGameLocked':
                gameEvent.notification = `Game: ${gameEvent.gameID} has been locked by Admin and will resume soon. Meanwhile all your funds are safe. Click to know more.`;
                break;

            case 'LogGameUnlocked':
                gameEvent.notification = `Game: ${gameEvent.gameID} has been unlocked now! Please resume your plays.`;
                break;

            case 'LogWinner':
                gameEvent.notification = `Game: ${gameEvent.gameID}, Round: ${gameEvent.roundNumber} winner is ${gameEvent.winnerAddress}. Prize: ${(web3.utils.fromWei((parseInt(gameEvent.winnerAmount, 10)).toString(), 'ether') + ' eth')}. Click to know more.`;

                break;

            case 'LogMegaPrizeWinner':
                gameEvent.notification = `MegaPrize: ${gameEvent.megaPrizeNumber} winner is ${gameEvent.megaPrizeWinner}. Prize: ${(web3.utils.fromWei((parseInt(gameEvent.megaPrizeAmount, 10)).toString(), 'ether') + ' eth')}. Click to know more.`;
                break;

            case 'LogMegaPrizeUpdate':
                gameEvent.notification = `Extra Amount added to MegaPrize making it a total: ${(web3.utils.fromWei((parseInt(gameEvent.megaPrizeAmount, 10)).toString(), 'ether') + ' eth')}. Play any game at least once to be eligible for MegaPrize pick!`;
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
            </span>,
        );
        console.log('gameevents:: ', gameEvents);
        // prune the events and reformat
    }

    render() {
        const { classes, history } = this.props;
        const defaultNotification = "  Welcome! Input number of tokens to purchase and click 'Pay' to play!";
        this.getLatestNotifications();
        console.log('this.notificationsJSX: ', this.notificationsJSX);
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
