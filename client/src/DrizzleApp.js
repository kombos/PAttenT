import React from "react";
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



class DrizzleApp extends React.Component {
    static contextType = DrizzleContext.Consumer;

    constructor(props, context) {
        super(props);
        this.state = { dataKey: null };
        console.log("___ inside constructor___");
        console.log(context);
        this.context = context;

    }

    componentDidMount() {
        const { Multiprizer } = this.context.drizzle.contracts;

        // get and save the key for the variable we are interested in
        const dataKey = Multiprizer.methods["viewGameIDs"].cacheCall();
        console.log("DrizzleApp datakey value is:", dataKey);
        this.setState({ dataKey });
    }

    render() {
        const { classes } = this.props;
        const initialized = this.context.initialized;
        console.log("initialized value: ");
        console.log(initialized);

        if (!initialized) {
            return "Loading...";
        }

        const { Multiprizer } = this.context.drizzleState.contracts;
        console.log("Multiprizer contract initialized? : ");
        console.log(Multiprizer.initialized);
        const _gameObj = Multiprizer.viewGameIDs[this.state.dataKey];
        const _gameIDsArray = _gameObj && _gameObj.value["_gameIDs"];
        const _gameIDsLength = _gameObj && _gameObj.value["_gameIDsLength"];
        console.log("this.state.datakey : ", this.state.datakey);
        console.log("@@@@@@@@ props inside DrizzleApp:  this.props is : ");
        console.log(this.context);
        console.log("____ gameObj value ______");
        console.log(_gameObj);

        const gameIDsJSX = _gameObj && (_gameIDsArray.map((gameID) =>
            {
            return (
            <Grid item xs={12} sm={6} md={3} lg={3}>
                <Paper className={classes.paper}>
                    <GameStrategy key={gameID} gameID={gameID} dataKey={this.state.datakey} />
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