import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import LockIcon from '@material-ui/icons/Lock';
import roundButton from '../img/roundButton.png';
import { BOUNTYSIZE_DIVISOR as BOUNTY_SIZE_DIVISOR } from '../Constants';
import Big from 'big.js';

const styles = theme => ({
    indicator: {
        height: 'auto',
        width: '100%',
        boxSizing: 'border-box',
        alignItems: 'center',
        textAlign: 'center',
        margin: 'auto',
        // flexGrow: 1,
        backgroundColor: 'rgba(12,54,76,0.90)',
        paddingTop: (theme.spacing.unit * 1.5),
        paddingBottom: (theme.spacing.unit * 1),
        paddingLeft: (theme.spacing.unit * 1),
        paddingRight: (theme.spacing.unit * 1),

    },
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
        height: 'auto',
        boxSizing: 'border-box',
        width: '75%',
        margin: 'auto',
        // backgroundColor: "rgba(11,54,7,0.99)",
    },
    flexChild: {
        flexGrow: 1,
    },
    gameLockContainer: {
        display: 'flex',
        alignItems: 'center',
        height: 'auto',
        boxSizing: 'border-box',
        width: '75%',
        margin: 'auto',
        backgroundColor: '#17d4fe',
        // border: '0.1rem solid #17d4fe',
        padding: theme.spacing.unit * 1.6,
    },
    duration: {
        maxWidth: '100%',
        height: 'auto',
        animationName: 'spin',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'linear',
    },
    '@keyframes spin': {
        '0%': {
            transform: 'rotate(0deg)',
        },
        '100%': {
            transform: 'rotate(360deg)',
        },
    },
    winningChance: {
        flexGrow: 1,
        height: 'auto',
        maxWidth: '100%',
        transform: 'scaleX(-1)',
    },
    bountySize: {
        flexGrow: 1,
        height: 'auto',
        maxWidth: '100%',
    },
});

class Indicator extends React.PureComponent {

    render() {
        console.log('inside indictor');
        const { userTokens, gameTokens, duration, tokenValue, isGameLocked, classes } = this.props;
        let indicatorJSX = null;
        console.log("tokenvalue typeof: ", typeof tokenValue, " and value: ", tokenValue);
        console.log('gamelocked? : ', isGameLocked);
        if (isGameLocked) {
            indicatorJSX = (
                <div className={classes.gameLockContainer}>

                    <div className={classes.flexChild}>
                        <LockIcon className={classes.lockIcon} />
                    </div>
                    <div className={classes.flexChild}>
                        <span>GAME LOCKED</span>
                    </div>
                    <div className={classes.flexChild}>
                        <LockIcon className={classes.lockIcon} />
                    </div>

                </div>
            );
        } else {
            let tokenValueEther = new Big(tokenValue).div(BOUNTY_SIZE_DIVISOR);
            console.log("tokenValueEther: ", tokenValueEther.toString());
            let bountySize = Math.floor(tokenValueEther * gameTokens) + 1;
            console.log('old bountysize: ', bountySize);
            bountySize = bountySize > 0 ? (bountySize > 6 ? 6 : bountySize) : 1;

            let winningChance = Math.floor(((userTokens / gameTokens) * 100) / 2) + 1;
            winningChance = winningChance > 0 ? (winningChance > 6 ? 6 : winningChance) : 1;

            // 2 hours to  days (72 hours)
            let durationBar = Math.ceil(parseInt(duration, 10) / (8 * 60 * 60));
            durationBar = durationBar > 0 ? (durationBar > 6 ? 6 : durationBar) : 1;

            console.log('durationbar: ', durationBar);
            console.log('durationinsecs: ', duration);
            console.log('bountysize: ', bountySize);
            console.log('winningchance: ', winningChance);
            console.log('path:: ', `../img/indicator${winningChance}.png`);

            indicatorJSX = (
                <div className={classes.flexContainer}>
                    <div className={classes.flexChild}>
                        <Tooltip title="Winning Chance">
                            <img
                                src={require(`../img/Indicator${winningChance}.png`)}
                                alt="Winning Chance"
                                className={classes.winningChance}
                            />
                        </Tooltip>
                    </div>
                    <div className={classes.flexChild}>
                        <Tooltip title="Duration Cycle">
                            <img
                                src={roundButton}
                                alt="Duration Indicator"
                                className={classes.duration}
                                style={{
                                    animationDuration: `${(durationBar * 400)}ms`,
                                }}
                            />
                        </Tooltip>
                    </div>
                    <div className={classes.flexChild}>
                        <Tooltip title="Bounty Size">
                            <img
                                src={require(`../img/Indicator${bountySize}.png`)}
                                alt="Bounty Size"
                                className={classes.bountySize}
                            />
                        </Tooltip>
                    </div>
                </div>
            );
        }

        return (
            <div className={classes.indicator}>
                {indicatorJSX}
            </div>
        );
    }
}

export default withStyles(styles)(Indicator);
