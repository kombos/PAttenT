
import React, { Fragment } from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { DrizzleContext } from 'drizzle-react';
import { Route, Link } from "react-router-dom";

const styles = theme => ({
    notification: {
        //padding: theme.spacing.unit * 1,
        flexGrow: 1,
        width: "100%",
        backgroundColor: "rgba(12,54,76,0.7)"
        //textAlign: 'center',
        //color: theme.palette.text.secondary,
    },
});


class NotificationBar extends Component {

    static contextType = DrizzleContext.Consumer;

    constructor(props, context) {
        super(props);
        this.context = context;
    }

    render() {

        const { classes } = this.props;

        return (
            <Link to={`/notifications`}>
                <div className={classes.notification}>
                    <p>Notification</p>
                    <p>...</p>
                </div>
            </Link>
        );
    }
}


export default withStyles(styles)(NotificationBar);