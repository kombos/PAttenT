import React from 'react'
import { DrizzleContext } from "drizzle-react";
import TextField from '@material-ui/core/TextField';
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';



const styles = theme => ({
    root: {
        backgroundImage: `url("https://www.pixelstalk.net/wp-content/uploads/2016/03/Blue-Butterfly-Wallpaper-download-free.jpg")`,
        //height: 500
        //backgroundColor: "blue",
        //flexBasis:
        flexDirection: "column",
        padding: theme.spacing.unit * 1
    },
    component: {
        flexGrow: 1,
        //backgroundColor: "blue",
        // padding: theme.spacing.unit * 2,
        //textAlign: "center",
        //fontSize:16,
        margin:"auto",
        height:"100%"
    },
    textField: {
        flexGrow: 1,
        //backgroundColor: "blue",
        // padding: theme.spacing.unit * 2,
        //textAlign: "center",
        //fontSize:16,
        width: "45%",
        //color: theme.palette.text.primary
        height:"100%",
        //margin:"auto"
    },
    button: {
        flexGrow: 1,
        //backgroundColor: "blue",
        // padding: theme.spacing.unit * 2,
        //textAlign: "center",
        //fontSize:16,
        width: "30%",
        height:"100%",
        margin:"auto",
        //padding:"20px"
        //color: theme.palette.text.secondary
    }
});

class GameInput extends React.Component {
    static contextType = DrizzleContext.Consumer;

    constructor(props, context) {
        super(props);

        this.state = { stackID: null, numTokens: "" };
        this.context = context;
        //this.valueRef = React.createRef();
        this.MINTOKENS = 1;

        this.getTxStatus = this.getTxStatus.bind();
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
            console.log("is NAN ",this.state.numTokens);
            return;
        }

        //let numTokens = Math.floor(parseInt(this.valueRef.current.value));
        let numTokens = Math.floor(parseInt(this.state.numTokens));
        console.log("-----------------------numtokens:------------------------------- ", numTokens);
        console.log("state value: ", this.state.numTokens);
        //console.log(" ref: ", this.valueRef.current.value, "  numTokens: ", numTokens);
        this.setValue(numTokens);

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

        this.setState({ stackID: stackID, numTokens: "" });
    };

    getTxStatus = () => {
        // get the transaction states from the drizzle state
        const { transactions, transactionStack } = this.context.drizzleState;

        // get the transaction hash using our saved `stackID`
        const txHash = transactionStack[this.state.stackID];
        console.log("inside gameinput gettxstatus() value of stackID is : ", this.state.stackID);
        // if transaction hash does not exist, don't display anything
        if (!txHash) return null;

        // otherwise, return the transaction status
        console.log("value of txHash status: ", transactions[txHash].status);
        return `Transaction status: ${transactions[txHash].status}`;

    };

    render() {
        const { classes } = this.props;
        const gameData = this.props.gameData;
        const web3 = this.context.drizzle.web3;
        const isGameLocked = (gameData.value.isGameLocked ? "true" : "false");
        const currentRound = gameData.value.currentRound;
        const tokenValue = gameData.value.tokenValue;
        this.maxTokensPerPlayer = gameData.value.maxTokensPerPlayer;
        this.playerTokens = this.props.playerTokens;
        this.remainingTokens = (this.maxTokensPerPlayer - this.playerTokens);

        const isDisabled = (
            isGameLocked == true ||
            currentRound == 0 ||
            this.remainingTokens == 0
        ) ? true : false;

        return (
            <div className={classes.component}>
                <form onSubmit={this.handleSubmit}>
                    {/* Tokens:
                     <input type="text" ref={this.valueRef} /> */}
                    {/* <input
                        type="number"
                        ref={this.valueRef}
                        placeholder={"(Max Allowed: " + this.maxTokensPerPlayer + ")"}
                        name="numTokens"
                        min="1"
                        max={this.maxTokensPerPlayer}
                        onFocus={this.handleFocus}
                        className={classes.input}
                    />
 */}

                    <TextField
                        id="standard-number"
                        label="Buy Tokens"
                        value={this.state.numTokens}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        type="number"
                        inputProps={{
                            min: this.MINTOKENS,
                            max: this.remainingTokens,
                            step: "1"
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        placeholder={"(max: " + this.remainingTokens + ")"}
                        margin="normal"
                        //className={classes.textField}
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
                            "" :
                            (web3.utils.fromWei((this.state.numTokens * tokenValue).toString(), 'ether') + " ethers")}
                    </Button>
                </form>



                <div>{this.getTxStatus()}</div>
            </div>
        );
    }
}

//export default GameInput;
GameInput.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(GameInput);