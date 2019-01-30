import React from 'react';
import { Component, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import GameStrategy from './GameStrategy';
import { DrizzleContext } from 'drizzle-react';

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
});



class DrizzleApp extends PureComponent {

    static contextType = DrizzleContext.Consumer;

    constructor(props, context) {
        console.log("#___ inside constructor___");
        super(props);
        this.state = { dataKey: null };
        this._gameObj = null;
    }

    componentDidMount() {
        console.log("# DrizzleApp: $$$$$ INSIDE COMPONENT DID MOUNT $$$$$");
        const multiprizer = this.context.drizzle.contracts.Multiprizer;
        // get and save the key for the variable we are interested in
        const dataKey = multiprizer.methods.viewGameIDs.cacheCall();
        console.log("# drizzleapp datakey value is:" + dataKey);
        this.setState({ dataKey });
    }

    /* 
    componentDidUpdate() {
        console.log("# DrizzleApp: INSIDE COMPONENTDIDUPDATE : ");
        console.log("# _gameObj value now is : ", this._gameObj);
        if (this._gameObj == null) {
            console.log("null value verified");
            //this.forceUpdate();
            let _dataKey = this.state.dataKey;
            this.setState({ _dataKey });
        }
    }
 */

    /*  shouldComponentUpdate(nextProps, nextState) {
         if(this._gameObj == null)
             return true;
         else
             return shallowCompare(this, nextProps, nextState);
     } */

    render() {
        console.log("# DrizzleApp: INSIDE RENDER : ", initialized);
        const { classes } = this.props;
        const { initialized } = this.props;
        console.log("# initialized value: ", initialized);

        if (!initialized) {
            return "Loading...";
        }

        const contractState = this.props.contractState;
        console.log("contractState:  ", contractState);
        //const { Multiprizer } = this.context.drizzleState.contracts;
        //console.log("# Multiprizer contract initialized? : ", Multiprizer.initialized);
        console.log("# datakey inside DrizzleApp is  : ", this.state.dataKey);
        //this._gameObj = Multiprizer.viewGameIDs[this.state.dataKey];
        
        
        this._gameObj = contractState.viewGameIDs[this.state.dataKey];
        const _gameIDsArray = this._gameObj && this._gameObj.value["_gameIDs"];
        const _gameIDsLength = this._gameObj && this._gameObj.value["_gameIDsLength"];

        console.log("# ____ gameObj value ______");
        console.log(this._gameObj);

        const gameIDsJSX = this._gameObj && (_gameIDsArray.map((gameID, index) => {
            console.log("GameID from DrizzleApp : ", gameID);
            return (
                <Grid item xs={12} sm={6} md={3} lg={3}>
                    <Paper className={classes.paper}>
                        <GameStrategy key={gameID} gameID={gameID} contractState={contractState} drizzleState={this.props.drizzleState}  />
                    </Paper>
                </Grid>
            );
        }
        ))

        return (
            <div className={classes.root} >
                <Grid container spacing={24}>
                    {gameIDsJSX}
                </Grid>
            </div>
        );
    }
}


export default withStyles(styles)(DrizzleApp);