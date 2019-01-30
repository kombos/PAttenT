import React from 'react'
import { DrizzleContext } from "drizzle-react";

class GameInput extends React.Component {
    static contextType = DrizzleContext.Consumer;
    
    constructor(props, context) {
        super(props);
        
        this.state = { stackId: null };
        this.context = context;
        this.valueRef = React.createRef();

        this.getTxStatus = this.getTxStatus.bind();
        this.handleSubmit = this.handleSubmit.bind();
    }


    handleChange = e => {
        this.value = e.target.value;
        console.log("value variable in handleChange(): ", (this.value));
        console.log("target variable in handleChange(): ", (e.target.value));

    }

    handleSubmit = e => {
        // only works with the input value provided via form
        console.log("inside handle submit: : : ");
        let numTokens = this.valueRef.current.value;
        this.valueRef.current.value = ""
        console.log(" ref: ", this.valueRef.current.value, "  numTokens: ", numTokens);
        this.setValue(numTokens);

        // if submitted, set the value with the string
        e.preventDefault();
    };

    setValue = numTokens => {
        console.log("inside setvalue() ");
        const gameData = this.props.gameData;
        const tokenValue = gameData && gameData.value.tokenValue;
        const gameID = gameData && gameData.value.gameID;
        const { drizzle, drizzleState } = this.context;
        const multiprizer = drizzle.contracts.Multiprizer;
        const tokenAmount = parseInt(numTokens) * tokenValue;

        console.log("# tokenvalue: ", tokenValue, "  gameID: ", gameID, "  numtokens: ", numTokens);
        console.log("# token amount: ", tokenAmount);

        const stackId = multiprizer.methods.playGame.cacheSend(gameID, numTokens, {
            from: drizzleState.accounts[0],
            value: tokenAmount
        });

        this.setState({ stackId });
    };

    getTxStatus = () => {
        // get the transaction states from the drizzle state
        const { transactions, transactionStack } = this.context.drizzleState;

        // get the transaction hash using our saved `stackId`
        const txHash = transactionStack[this.state.stackId];
        console.log("inside gameinput gettxstatus() value of stackID is : ", this.state.stackId);
        // if transaction hash does not exist, don't display anything
        if (!txHash) return null;

        // otherwise, return the transaction status
        console.log("value of txHash status: ", transactions[txHash].status);
        return `Transaction status: ${transactions[txHash].status}`;
        
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    Number of Tokens:
                    <input type="text" ref={this.valueRef} />
                    <input type="submit" value="Submit" />
                </form>

                <div>{this.getTxStatus()}</div>
            </div>
        );
    }
}

export default GameInput;