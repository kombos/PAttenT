import React, { Fragment } from 'react'
import { DrizzleContext } from "drizzle-react";
import TextField from '@material-ui/core/TextField';
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
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
        //backgroundColor: "rgba(122,54,16,0.99)",
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
        fontFamily: "Orbitron",
        color: "#17d4fe",
        //padding: theme.spacing.unit * 0.5,
    },
    textField: {
        flexGrow: 1,
        //fontSize:16
        //alignItems: 'center',
        //textAlign: 'center',
        //backgroundColor: "rgba(12,54,126,0.99)",
        //boxSizing: 'border-box',
        margin: "0.5rem auto 0.5rem auto",
        //margin:'auto',
        width: "70%",
        //color: theme.palette.text.primary
        //height: "100%",
    },
    textFieldStyles: {
        padding: theme.spacing.unit * 1,
        fontSize: "0.9rem",
        backgroundColor: "rgba(255,255,255,0.69)",
    },
    textLabelStyles: {
        //padding: theme.spacing.unit * 0.8,
        fontSize: "0.8rem",
        color: theme.palette.text.primary,
    },
    button: {
        flexGrow: 1,
        width: "100%",
        margin: "auto",
        //padding: theme.spacing.unit * 0.5,
        fontSize: "0.8rem"
        //color: theme.palette.text.primary
    }
});

class GameInput extends React.Component {
    static contextType = DrizzleContext.Consumer;

    constructor(props, context) {
        super(props);

        this.state = {
            stackID: null,
            numTokens: "",
            isDialogOpen: false
        };
        this.context = context;
        //this.valueRef = React.createRef();
        this.MINTOKENS = 1;

        //this.getTxStatus = this.getTxStatus.bind();
        this.handleSubmit = this.handleSubmit.bind();
        this.handleChange = this.handleChange.bind();
        this.handleFocus = this.handleFocus.bind();
    }


    handleFocus = e => {
        console.log("handle focus called");
    }
    /* 
    handleChange = e => {
        console.log("target value: ", e.target.value);
        if (parseInt(e.target.value) > this.maxTokensPerPlayer) {
            this.setState({ numTokens: this.maxTokensPerPlayer });
            return;
        }

        if (e.target.value < 0) {
            this.setState({ numTokens: 1 });
            return;
        }

        this.setState({ numTokens: Math.floor(e.target.value) });
        //console.log("value variable in handleChange(): ", (this.value));
        console.log("target variable in handleChange(): ", (this.state.numTokens));
        console.log("target variable in handleChange(): ", (this.state.numTokens));
        console.log("max tokens value", this.maxTokensPerPlayer);

    }
 */

    handleChange = (e) => {
        /* 
        const playerTokens = this.props.playerTokens;
        const remainingTokens = this.maxTokensPerPlayer - playerTokens;
        console.log("player tokens: ", playerTokens);
 */
        console.log("target value: ", e.target.value);
        /* 
                if (parseInt(e.target.value) > remainingTokens) {
                    this.setState({ numTokens: remainingTokens });
                    return;
                }
        
                if (e.target.value < 0) {
                    this.setState({ numTokens: 1 });
                    return;
                }
         */
        this.setState({ numTokens: Math.floor(e.target.value) });
        //console.log("value variable in handleChange(): ", (this.value));
        console.log("target variable in handleChange(): ", (this.state.numTokens));

    }


    handleSubmit = e => {
        // only works with the input value provided via form
        console.log("inside handle submit: : : ");

        if (this.state.numTokens == "" || isNaN(this.state.numTokens)) {
            console.log("is NAN ", this.state.numTokens);
            return;
        }

        //let numTokens = Math.floor(parseInt(this.valueRef.current.value));
        let numTokens = Math.floor(parseInt(this.state.numTokens));
        console.log("-----------------------numtokens:------------------------------- ", numTokens);
        console.log("state value: ", this.state.numTokens);
        //console.log(" ref: ", this.valueRef.current.value, "  numTokens: ", numTokens);
        this.setValue(numTokens);
        this.handleClickOpen();

        // if submitted, set the value with the string
        e.preventDefault();
    };

    setValue = numTokens => {
        console.log("inside setvalue() ");
        const gameData = this.props.gameData;
        const tokenValue = gameData.value.tokenValue;
        const gameID = gameData.value.gameID;

        const { drizzle, drizzleState } = this.context;
        const multiprizer = drizzle.contracts.Multiprizer;
        const tokenAmount = numTokens * tokenValue;

        console.log("# tokenvalue: ", tokenValue, "  gameID: ", gameID, "  numtokens: ", numTokens);
        console.log("# token amount: ", tokenAmount);

        const stackID = multiprizer.methods.playGame.cacheSend(gameID, numTokens, {
            from: drizzleState.accounts[0],
            value: tokenAmount
        });

        this.setState({
            stackID: stackID,
            numTokens: ""
        });
    };

    /* getTxStatus = () => {
        // get the transaction states from the drizzle state
        const { transactions, transactionStack } = this.context.drizzleState;

        // get the transaction hash using our saved `stackID`
        const txHash = transactionStack[this.state.stackID];
        console.log("inside gameinput gettxstatus() value of stackID is : ", this.state.stackID);
        // if transaction hash does not exist, don't display anything
        if (!txHash) return null;

        if (transactions[txHash]) {
            // otherwise, return the transaction status
            console.log("value of txHash status: ", transactions[txHash].status);
            return `Transaction status: ${transactions[txHash].status}`;
        }
        else {
            return null;
        }
    }; */

    handleClickOpen = () => {
        this.setState({ isDialogOpen: true });
    }

    handleClose = () => {
        this.setState({ isDialogOpen: false });
    }

    render() {
        const { classes } = this.props;
        const gameData = this.props.gameData;
        const web3 = this.context.drizzle.web3;
        const isGameLocked = (gameData.value.isGameLocked ? true : false);
        const currentRound = gameData.value.currentRound;
        const tokenValue = gameData.value.tokenValue;
        this.maxTokensPerPlayer = gameData.value.maxTokensPerPlayer;
        this.playerTokens = this.props.playerTokens;
        this.remainingTokens = (this.maxTokensPerPlayer - this.playerTokens);
        console.log("tokenvalue: ", tokenValue);

        const isDisabled = (
            isGameLocked == true ||
            currentRound == 0 ||
            this.remainingTokens == 0
        ) ? true : false;

        const { fullScreen } = this.props;

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
                        inputProps={{
                            min: this.MINTOKENS,
                            max: this.remainingTokens,
                            step: "1",
                        }}
                        InputLabelProps={{
                            shrink: true,
                            classes: {
                                root: classes.textLabelStyles,
                            }
                        }}
                        placeholder={"(max: " + this.remainingTokens + ")"}
                        margin="normal"
                        className={classes.textField}
                        //inputRef={this.valueRef}
                        margin="normal"
                        variant="outlined"
                        className={classes.textField}
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
                        Pay {this.state.numTokens == "" ?
                            "(" + (web3.utils.fromWei((1 * tokenValue).toString(), 'ether') + " eth per token") + ")" :
                            (web3.utils.fromWei((this.state.numTokens * tokenValue).toString(), 'ether') + " ethers")}
                    </Button>
                </form>
                <Dialog
                    fullScreen={fullScreen}
                    open={this.state.isDialogOpen}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">{"Use Google's location service?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Let Google help apps determine location. This means sending anonymous location data to
                            Google, even when no apps are running.
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

//export default GameInput;
GameInput.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withMobileDialog()(withStyles(styles)(GameInput)); 
