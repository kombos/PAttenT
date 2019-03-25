import React from 'react';
import { DrizzleContext } from 'drizzle-react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import RestoreIcon from '@material-ui/icons/Restore';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
    purchasedTokens: {
        height: 'auto',
        maxWidth: '100%',
        boxSizing: 'border-box',
        // alignItems: 'center',
        textAlign: 'center',
        backgroundColor: 'rgba(12,54,76,0.90)',
        // backgroundColor: "rgba(12,54,6,0.99)",
        paddingTop: (theme.spacing.unit * 1.5),
        paddingBottom: (theme.spacing.unit * 1),
        // paddingLeft: (theme.spacing.unit * 1),
        // paddingRight: (theme.spacing.unit * 1),
    },
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        boxSizing: 'border-box',
        height: 'auto',
        width: '100%',
        // margin: 'auto',
        color: '17d4fe',
        padding: theme.spacing.unit * 1.5,
        /* paddingTop: theme.spacing.unit * 1.5,
        paddingBottom: theme.spacing.unit * 1.5,
        paddingLeft: theme.spacing.unit * 0.5,
        paddingRight: theme.spacing.unit * 0.5, */
        fontFamily: theme.typography.fontFamily,
        // backgroundColor: "rgba(12,54,7,0.99)",
    },
    flexChild: {
        flexGrow: 2.5,
        // backgroundColor: "#17d4fe",
        backgroundColor: '#11d2fe',
        // fontFamily: 'Helvetica, sans-serif',
        padding: theme.spacing.unit * 0.75,
        // minHeight: '40px',
    },
    buttonContainer: {
        flexGrow: 1,
        // backgroundColor: "#12f4fe",
        fontFamily: 'Helvetica, sans-serif',

        height: 'auto',
    },
    button: {
        flexGrow: 1,
        color: theme.palette.secondary,
        fontSize: '0.7rem',
    },
    smallText: {
        fontSize: '0.7rem',
    },
    largeText: {
        fontSize: '1rem',
    },
    mediumText: {
        fontSize: '0.8rem',
    },
});

class PurchasedTokens extends React.PureComponent {
    static contextType = DrizzleContext.Consumer;

    constructor(props, context) {
        super(props);
        console.log('inside PurchasedTokens');
        this.state = { stackID: null };
        this.context = context;
        this.revertTokens = this.revertTokens.bind();
    }

    revertTokens = () => {
        console.log('inside revertTokens() ');
        const gameID = this.props.gameID;
        const playerAddress = this.context.drizzleState.accounts[0];

        console.log('playeraddr: ', playerAddress, ' and gameID: ', gameID);

        const { drizzle, drizzleState } = this.context;
        const multiprizer = drizzle.contracts.Multiprizer;

        const stackID = multiprizer.methods.revertGame.cacheSend(gameID, playerAddress, {
            from: drizzleState.accounts[0]
        });
        console.log('stackID: ', stackID);

        this.setState({ stackID: stackID });
    }

    render() {
        const { playerTokens, maxTokensPerPlayer, roundNumber, classes } = this.props;
        console.log('roundnumber: ', roundNumber);
        console.log('playerTokens: ', playerTokens);
        console.log('maxTokensPerPlayer: ', maxTokensPerPlayer);
        let revertConfirm = null;
        if (this.state.stackID != null) {
            const { transactions, transactionStack } = this.context.drizzleState;
            const txHash = transactionStack[this.state.stackID];
            console.log('inside gameinput gettxstatus() value of stackID is : ', this.state.stackID);
            // if transaction hash does not exist, don't display anything
            if (txHash && transactions[txHash] && transactions[txHash].status === 'success') {
                revertConfirm = <div className={classes.button}><RestoreIcon /></div>;
            } else {
                revertConfirm = null;
            }
        }
        return (
            <div className={classes.purchasedTokens}>
                {/* <div style={
                    {
                        minHeight: '10px',
                    }
                }></div> */}

                <div className={classes.flexContainer}>
                    <div className={classNames(classes.flexChild, classes.smallText)}>
                        {'Purchased: '}
                        &nbsp;
                        <span className={classes.largeText}>
                            {playerTokens}
                        </span>
                        &nbsp;
                        {' of '}
                        &nbsp;
                        <span className={classes.largeText}>
                            {maxTokensPerPlayer}
                        </span>
                    </div>
                    <div className={classes.buttonContainer}>
                        <Tooltip title="Revert Purchased Tokens">
                            <Button
                                variant="outlined"
                                size="small"
                                color="secondary"
                                className={classes.button}
                                onClick={this.revertTokens}
                            >
                                Revert
                            </Button>
                        </Tooltip>
                        {revertConfirm}
                    </div>
                    {

                    }
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(PurchasedTokens);
