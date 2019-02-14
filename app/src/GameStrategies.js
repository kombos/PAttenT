import React, { Fragment } from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import GameContainer from './GameContainer';
import { DrizzleContext } from 'drizzle-react';
import NotificationBar from './NotificationBar';

const styles = theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing.unit * 1,
        textAlign: 'center',
        color: theme.palette.text.secondary
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    notification: {
        //padding: theme.spacing.unit * 1,
        flexGrow: 1,
        //textAlign: 'center',
        //color: theme.palette.text.secondary,
    },
});


class GameStrategies extends Component {

    static contextType = DrizzleContext.Consumer;

    constructor(props, context) {
        console.log("#___ inside constructor___");
        super(props);
        this.context = context;
        this.state = { dataKey: null };
    }

    componentDidMount() {
        console.log("# GameStrategy: $$$$$ INSIDE COMPONENT DID MOUNT $$$$$");
        const Multiprizer = this.context.drizzle.contracts.Multiprizer;
        // get and save the key for the variable we are interested in
        const dataKey = Multiprizer.methods.viewGameIDs.cacheCall();
        console.log("# GameStrategy datakey value is:" + dataKey);
        this.setState({ dataKey });
    }

    render() {
        console.log("# GameStrategy: INSIDE RENDER : ");
        const { classes } = this.props;
        const { initialized } = this.props;
        console.log("# initialized value: ", initialized);

        if (!initialized) {
            return "Loading...";
        }
        const dataKey = this.state.dataKey;
        const drizzleState = this.props.drizzleState
        const multiprizer = this.props.drizzleState.contracts.Multiprizer
        console.log("multiprizer:  ", multiprizer);
        console.log("# datakey inside GameStrategy is  : ", dataKey);


        const gameIDs = multiprizer.viewGameIDs[dataKey];
        const _gameIDsArray = gameIDs && gameIDs.value["_gameIDs"];
        const _gameIDsLength = gameIDs && gameIDs.value["_gameIDsLength"];

        console.log("# ____ gameObj value ______");
        console.log(gameIDs);

        const gameIDsJSX = gameIDs && (_gameIDsArray.map((gameID, index) => {
            console.log("GameID from GameStrategy : ", gameID);
            return (
                    <Grid item xs={12} sm={6} md={3} lg={3} >
                        <GameContainer key={gameID} gameID={gameID} drizzleState={drizzleState} />
                    </Grid>
            );
        }
        ))

        return (
            <Fragment>
                <NotificationBar />
                <Grid container spacing={24} className={classes.root}>
                    {gameIDsJSX}
                </Grid>
            </Fragment>
        );
    }
}


export default withStyles(styles)(GameStrategies);