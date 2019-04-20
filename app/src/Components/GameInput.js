import React, { Fragment } from 'react';
import { DrizzleContext } from 'drizzle-react';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


const styles = theme => ({

    flexContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // backgroundColor: "rgba(122,54,16,0.99)",
        boxSizing: 'border-box',
        height: 'auto',
        width: '100%',
        margin: 'auto',
        padding: theme.spacing.unit * 0.5,
    },
    flexChild: {
        flexGrow: 1,
        textAlign: 'center',
        alignItems: 'center',
        fontFamily: 'Orbitron',
        color: '#17d4fe',
        // padding: theme.spacing.unit * 0.5,
    },
    textField: {
        flexGrow: 1,
        // fontSize:16
        // alignItems: 'center',
        // textAlign: 'center',
        // backgroundColor: "rgba(12,54,126,0.99)",
        // boxSizing: 'border-box',
        margin: '0.5rem auto 0.5rem auto',
        // margin:'auto',
        width: '70%',
        // color: theme.palette.text.primary
        // height: "100%",
    },
    textFieldStyles: {
        padding: theme.spacing.unit * 1,
        fontSize: '0.9rem',
        backgroundColor: 'rgba(255,255,255,0.69)',
    },
    textLabelStyles: {
        // padding: theme.spacing.unit * 0.8,
        fontSize: '0.8rem',
        color: theme.palette.text.primary,
    },
    button: {
        flexGrow: 1,
        width: '100%',
        margin: 'auto',
        // padding: theme.spacing.unit * 0.5,
        fontSize: '0.8rem',
        // color: theme.palette.text.primary
    },
});

class GameInput extends React.Component {
    static contextType = DrizzleContext.Consumer;

    constructor(props, context) {
        super(props);

        this.state = {
            stackID: null,
            numTokens: '',
            isDialogOpen: false,
        };
        this.context = context;
        this.txHash = null;
        this.MINTOKENS = 1;
        this.handleSubmit = this.handleSubmit.bind();
        this.handleChange = this.handleChange.bind();
        this.handleClose = this.handleClose.bind();
        //this.getTxStatus = this.getTxStatus.bind();
        //this.handleFocus = this.handleFocus.bind();
    }

    handleChange = (e) => {
        console.log('target value: ', e.target.value);
        this.setState({ numTokens: Math.floor(e.target.value) });
        console.log('target variable in handleChange(): ', (this.state.numTokens));
    }

    handleSubmit = (e) => {
        // only works with the input value provided via form
        console.log('inside handle submit: ');

        if (this.state.numTokens === '' || isNaN(this.state.numTokens)) {
            console.log('is NAN ', this.state.numTokens);
            return;
        }

        // let numTokens = Math.floor(parseInt(this.valueRef.current.value));
        const numTokens = Math.floor(parseInt(this.state.numTokens, 10));
        console.log('numtokens: ', numTokens);
        console.log('state value: ', this.state.numTokens);
        this.setValue(numTokens);
        // if submitted, set the value with the string
        e.preventDefault();
    };

    setValue = (numTokens) => {
        console.log('inside setvalue() ');
        const { gameData } = this.props;
        const { drizzle, drizzleState } = this.context;
        const {tokenValue, gameID} = gameData.value;
        const multiprizer = drizzle.contracts.Multiprizer;
        const tokenAmount = numTokens * tokenValue;

        console.log('# tokenvalue: ', tokenValue, '  gameID: ', gameID, '  numtokens: ', numTokens);
        console.log('# token amount: ', tokenAmount);

        const stackID = multiprizer.methods.playGame.cacheSend(gameID, numTokens, {
            from: drizzleState.accounts[0],
            value: tokenAmount,
        });
        this.handleClickOpen();
        this.setState({
            stackID: stackID,
            numTokens: '',
        });
    };

    handleClickOpen = () => {
        this.setState({ isDialogOpen: true });
    }

    handleClose = () => {
        this.setState({ isDialogOpen: false });
    }

    render() {
        const { drizzle } = this.context;
        const web3 = drizzle.web3;
        const { gameData, playerTokens, classes, fullScreen } = this.props;
        const { isGameLocked, currentRound, tokenValue, maxTokensPerPlayer } = gameData.value;
        const remainingTokens = (maxTokensPerPlayer - playerTokens);
        //console.log('tokenvalue: ', remainingTokens);
        const isDisabled = (
            isGameLocked === true
            || currentRound === 0
            || remainingTokens === 0
        );

        /* Pay routine:
        '(' + (web3.utils.fromWei((1 * tokenValue).toString(), 'ether') + ' eth per token') + ')' :
        (web3.utils.fromWei((this.state.numTokens * tokenValue).toString(), 'ether') + ' ethers')} */

        return (
            <Fragment>
                <form onSubmit={this.handleSubmit} className={classes.flexContainer}>
                    <TextField
                        id="standard-number"
                        label="Buy Tokens"
                        value={this.state.numTokens}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        type="number"
                        InputProps={{
                            classes: {
                                input: classes.textFieldStyles,
                            },
                        }}
                        // eslint-disable-next-line
                        inputProps={{
                            min: this.MINTOKENS,
                            max: remainingTokens,
                            step: '1',
                        }}
                        InputLabelProps={{
                            shrink: true,
                            classes: {
                                root: classes.textLabelStyles,
                            },
                        }}
                        placeholder={`(max: ${remainingTokens})`}
                        margin="normal"
                        className={classes.textField}
                        // inputRef={this.valueRef}
                        variant="outlined"
                        disabled={isDisabled}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        size="small"
                        color="primary"
                        className={classes.button}
                        disabled={isDisabled}
                    >
                        Pay { this.state.numTokens === '' ?
                            `(${web3.utils.fromWei((1 * tokenValue).toString(), 'ether') + ' eth per token'})` :
                            `${web3.utils.fromWei((this.state.numTokens * tokenValue).toString(), 'ether') + ' ethers'}` }
                            
                    </Button>
                </form>
                <Dialog
                    fullScreen={fullScreen}
                    open={this.state.isDialogOpen}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">Wait for Purchase Confirmation</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Once you have given request to purchase tokens, please wait till your transaction is confirmed.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </Fragment>
        );
    }
}

GameInput.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withMobileDialog()(withStyles(styles)(GameInput));
