import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import GameContainer from './GameContainer';
import { DrizzleContext } from 'drizzle-react';
import NotificationBar from './NotificationBar';

const styles = theme => ({
    flexContainer: {
        display: 'flex',
        flexDirection: "column",
        flexGrow: 1,
        width:'100%',
        height: 'auto',
        //maxWidth: '85%',
        margin: 'auto',
        //backgroundColor: "rgba(62,54,76,0.7)",
    },
    flexChild: {
        flexGrow: 1,
        width:'100%',
        margin: '1.5rem auto 1.5rem auto',
        //padding: theme.spacing.unit * 1,
        //backgroundColor: "rgba(32,14,76,0.7)",
    },
    notification: {
        flexBasis: "150px",
        //padding: theme.spacing.unit * 1,
        //flexGrow: 1,
        //textAlign: 'center',
        //color: theme.palette.text.secondary,
    },
});


class GameStrategies extends React.Component {

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
        this.setState({ dataKey:dataKey });
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

        let gameIDsJSX = null;
        const gameIDs = multiprizer.viewGameIDs[dataKey];
        console.log("gameIDS: ", gameIDs);

        if (gameIDs && gameIDs.value && gameIDs.value != null) {
            const _gameIDsArray = gameIDs.value["_gameIDs"];
            const _gameIDsLength = gameIDs.value["_gameIDsLength"];
            console.log(" array: ", _gameIDsArray);
            const _gameIDsRevArray = _gameIDsArray.slice().reverse();
            console.log("reverse array: ", _gameIDsRevArray);

            console.log("# ____ gameObj value ______");
            console.log(gameIDs);

            gameIDsJSX = (_gameIDsRevArray
                .map(
                    (gameID, index) => {
                        console.log("GameID from GameStrategy : ", gameID);
                        return (
                            <Grid item xs={12} sm={6} md={3} lg={3} >
                                <GameContainer key={gameID} gameID={gameID} drizzleState={drizzleState} />
                            </Grid>
                        );
                    }
                )
            )

        }


        return (
            <div className={classes.flexContainer}>
                <NotificationBar />
                <Grid container spacing={0} className={classes.flexChild} direction='row'>
                    {gameIDsJSX}
                </Grid>
            </div>
        );
    }
}


export default withStyles(styles)(GameStrategies);