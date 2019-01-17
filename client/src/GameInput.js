import React from "react";
import { DrizzleContext } from "drizzle-react";

class GameInput extends React.Component {
    static contextType = DrizzleContext.Consumer;
    constructor(props, context) {
        super(props);
        this.state = { stackId: null };
        console.log("___ instide GameStrategy constructor___");
        console.log(context);
        this.context = context;
        this.getTxStatus = this.getTxStatus.bind();
    }

    handleKeyDown = e => {
        // if the enter key is pressed, set the value with the string
        if (e.keyCode === 13) {
            this.setValue(e.target.value);
        }
    };

    handleSubmit = e => {
        // if the enter key is pressed, set the value with the string
        this.setValue(e.target.value);
    };

    setValue = value => {
        const { drizzle, drizzleState } = this.context;
        const multiprizer = drizzle.contracts.Multiprizer;
        const gameID = this.props.gameID;
        const gameStrategy = this.props.gameStrategy;
        const currentRound = gameStrategy && gameStrategy.value["currentRound"];

        // let drizzle kFnow we want to call the `set` method with `value`
        const stackId = multiprizer.methods["playGame"].cacheSend(gameID, currentRound, value, {
            from: drizzleState.accounts[0]
        });

        // save the `stackId` for later reference
        this.setState({ stackId });
    };

    getTxStatus = () => {
        // get the transaction states from the drizzle state
        const { transactions, transactionStack } = this.context.drizzleState;

        // get the transaction hash using our saved `stackId`
        const txHash = transactionStack[this.state.stackId];

        // if transaction hash does not exist, don't display anything
        if (!txHash) return null;

        // otherwise, return the transaction status
        return `Transaction status: ${transactions[txHash].status}`;
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Number of Tokens:
                    <input type="text" value={this.state.value} onKeyDown={this.handleKeyDown} />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                <div>Transaction Status: {this.getTxStatus()}</div>
            </div>
        );
    }
}

export default GameInput;