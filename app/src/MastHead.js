import React, { Fragment } from 'react';
import { DrizzleContext } from "drizzle-react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    flexContainer: {
        alignItems: 'center',
        height: 'auto',
        boxSizing: 'border-box',
        width: '75%',
        margin: 'auto',
        fontFamily: theme.typography.fontFamily,
        //backgroundColor: "rgba(11,54,7,0.99)",
        paddingTop: (theme.spacing.unit * 1.5),
        paddingBottom: (theme.spacing.unit * 1),
        paddingLeft: (theme.spacing.unit * 1),
        paddingRight: (theme.spacing.unit * 1),
    },
    /* flexChild: {
        flexGrow: 1,
        //backgroundColor: "rgba(11,54,7,0.99)",
        marginTop: 'auto',
    }, */
    mastHeadImg: {
        flexGrow: 1,
        width: 'auto',
        maxWidth: '100%',
    },
});

class MastHead extends React.PureComponent {
    static contextType = DrizzleContext.Consumer;

    constructor(props, context) {
        super(props);
        this.context = context;
    }

    render() {

        console.log("inside gameProps");
        const web3 = this.context.drizzle.web3;

        const { gameID, classes } = this.props;

        return (
            <div className={classes.flexContainer}>
                <img src={require(`./img/${gameID}.png`)} alt="MastHead Img" className={classes.mastHeadImg}/>
            </div>
        );
    }
}

export default withStyles(styles)(MastHead);