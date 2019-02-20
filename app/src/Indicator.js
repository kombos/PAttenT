import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import roundButton from './img/roundButton.png';
import indicator0 from './img/Indicator0.png';
import indicator1 from './img/Indicator1.png';
import indicator2 from './img/Indicator2.png';
import indicator3 from './img/Indicator3.png';
import indicator4 from './img/Indicator4.png';
import indicator5 from './img/Indicator5.png';
import indicator6 from './img/Indicator6.png';


var durationBar = 0;

const styles = theme => ({
    indicator: {
        height: 'auto',
        maxWidth: '100%',
        alignItems: 'center',
        textAlign:'center',
        //flexGrow: 1,
        backgroundColor: "rgba(12,54,76,0.99)",
    },
    flexContainer: {
        display:'flex',
        alignItems:'center',
        align:'center',
        height: 'auto',
        maxWidth: '85%',
        margin: 'auto',
    },
    flexChild: {
        flexGrow: 1,

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

function Indicator(props) {
    console.log("inside indictor");

    const { userTokens, gameTokens, duration, tokenValue, classes } = props;

    let bountySize = Math.floor((tokenValue * gameTokens) / 5) + 1;
    bountySize = bountySize > 0 ? (bountySize > 6 ? 6 : bountySize) : 1;

    let winningChance = Math.floor(((userTokens / gameTokens) * 100) / 2) + 1;
    winningChance = winningChance > 0 ? (winningChance > 6 ? 6 : winningChance) : 1;

    // 2 hours to  days (72 hours)
    durationBar = Math.ceil(parseInt(duration) / (8 * 60 * 60));
    durationBar = durationBar > 0 ? (durationBar > 6 ? 6 : durationBar) : 1;

    Math.ceil(parseInt(duration) / (8 * 60 * 60));
    console.log("durationbar: ", durationBar);
    console.log("durationinsecs: ", duration);
    console.log("bountysize: ", bountySize);
    console.log("winningchance: ", winningChance);

    let winningChanceImg = `./img/Indicator${winningChance.toString()}.png`;
    let bountySizeImg = `indicator${bountySize}.png`;

    console.log("path : ", winningChanceImg);



    return (
        <div className={classes.indicator}>
            <div style={
                {
                    minHeight:'10px',
                }
            }></div>
            <div className={classes.flexContainer}>
                <div className={classes.flexChild}>
                    <img src={indicator4} alt="Winning Chance"
                        className={classes.winningChance}
                    />
                </div>
                <div className={classes.flexChild}>
                    <img src={roundButton} alt="Duration Indicator"
                        className={classes.duration}
                        style={
                            {
                                'animationDuration': `${(durationBar * 400)}ms`,
                            }
                        }
                    />
                </div>
                <div className={classes.flexChild}>
                    <img src={indicator4} alt="Bounty Size"
                        className={classes.bountySize}
                    />
                </div>
            </div>
        </div>
    );
}

export default withStyles(styles)(Indicator);