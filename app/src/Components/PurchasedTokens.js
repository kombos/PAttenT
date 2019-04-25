import React from 'react';
import { DrizzleContext } from 'drizzle-react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


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

class PurchasedTokens extends React.Component {
    static contextType = DrizzleContext.Consumer;

    constructor(props, context) {
        super(props);
        console.log('inside PurchasedTokens');
        this.state = {
            stackID: null,
            isDialogOpen: false,
        };
        this.context = context;
        this.revertTokens = this.revertTokens.bind();
        this.handleClose = this.handleClose.bind();
    }

    handleClickOpen = () => {
        this.setState({ isDialogOpen: true });
    }

    handleClose = () => {
        this.setState({ isDialogOpen: false });
    }

    revertTokens = () => {
        console.log('inside revertTokens() ');
        const { gameID } = this.props;
        const { drizzle, drizzleState } = this.context;
        const playerAddress = drizzleState.accounts[0];
        const { Multiprizer } = drizzle.contracts;

        console.log('playeraddr: ', playerAddress, ' and gameID: ', gameID);
        const stackID = Multiprizer.methods.revertGame.cacheSend(gameID, playerAddress, {
            from: drizzleState.accounts[0],
        });
        this.handleClickOpen();
        console.log('stackID: ', stackID, 'this.state.stackID: ', this.state.stackID);
        this.setState({ stackID: stackID });
    }

    render() {
        const { playerTokens, maxTokensPerPlayer, roundNumber, classes, fullScreen } = this.props;
        console.log('roundnumber: ', roundNumber);
        console.log('playerTokens: ', playerTokens);
        console.log('maxTokensPerPlayer: ', maxTokensPerPlayer);

        return (
            <div className={classes.purchasedTokens}>
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
                    </div>
                </div>
                <Dialog
                    fullScreen={fullScreen}
                    open={this.state.isDialogOpen}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">Wait for Revert Confirmation</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Once you have given request to revert tokens, please wait till your transaction is confirmed.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withMobileDialog()(withStyles(styles)(PurchasedTokens));
