import React from 'react';
import { DrizzleContext } from 'drizzle-react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import ZoomOutMapButton from '@material-ui/icons/ZoomOutMap';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';

const styles = theme => ({
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
        height: 'auto',
        boxSizing: 'border-box',
        width: '90%',
        margin: 'auto',
        fontFamily: theme.typography.fontFamily,
        // backgroundColor: "rgba(121,124,27,0.99)",
        // paddingTop: (theme.spacing.unit * 1),
        paddingBottom: (theme.spacing.unit * 1),
        // paddingLeft: (theme.spacing.unit * 1),
        // paddingRight: (theme.spacing.unit * 1),
    },
    flexChild: {
        flexGrow: 1,
        // backgroundColor: "rgba(11,54,7,0.99)",
        margin: 'auto',
    },
    iconButton: {
        // backgroundColor: "rgba(71,24,73,0.99)",
        // border:`${theme.shape.borderRadius / 4}px solid`,
        // border: theme.shape.borderRadius,
        // marginTop: 'auto',
        boxShadow: theme.shadows[4],
    },
    smallText: {
        fontSize: '0.7rem',
    },
    largeText: {
        fontSize: '1.0rem',
    },
    mediumText: {
        fontSize: '0.8rem',
    },
});

class GameProps extends React.PureComponent {
    static contextType = DrizzleContext.Consumer;

    constructor(props, context) {
        super(props);
        this.context = context;
    }

    render() {
        console.log('inside gameProps');
        const web3 = this.context.drizzle.web3;
        const BN = web3.utils.BN;
        let isRoundZero = false;
        let currentRoundText = '';

        const { gameID, currentRound, totalValueForGame, totalWinnings, classes } = this.props;
        const renderLink = itemProps => <Link to={`/gameDetails/${gameID}`} {...itemProps} />;

        console.log('currentRound? : ', currentRound);
        if (parseInt(currentRound, 10) === 0) {
            isRoundZero = true;
            currentRoundText = 'NA';
        } else {
            currentRoundText = currentRound;
        }

        return (
            <div className={classes.flexContainer}>
                <div
                    className={classNames(classes.flexChild, classes.smallText)}
                    style={{
                        textAlign: 'left',
                    }}
                >
                    <span className={classes.largeText}>
                        {`Round : ${currentRoundText}`}
                    </span>
                    <br />
                    {`GameID : ${gameID}`}
                    <br />
                </div>
                <div
                    className={classes.flexChild}
                    style={{
                        margin: 'auto',
                        textAlign: 'center',
                        // alignItems: 'flex-end',
                        // backgroundColor: "rgba(111,154,7,0.99)",
                    }}
                >
                    <Tooltip title="View Game Details">
                        <IconButton aria-label="details" disabled={isRoundZero} className={classes.iconButton} component={renderLink}>
                            <ZoomOutMapButton />
                        </IconButton>
                    </Tooltip>
                </div>
                <div
                    className={classNames(classes.flexChild, classes.smallText)}
                    style={{
                        textAlign: 'right',
                    }}
                >
                    {`Total Plays : ${(web3.utils.fromWei((new BN(totalValueForGame)).toString(), 'ether') * 1).toFixed(3)} eth`}
                    <br />
                    {`Total Wins : ${(web3.utils.fromWei((new BN(totalWinnings)).toString(), 'ether') * 1).toFixed(3)} eth`}
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(GameProps);
