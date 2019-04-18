import React from 'react';
import { withStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const styles = theme => ({
    root: {
        display: 'flex',
        flexGrow: 1,
        minHeight: '10vh',
        //bottom:0,
        backgroundColor: "rgba(12,54,76,0.90)",
    },
    logo: {
        flexGrow: 1,
        color: "#17d4fe",
        alignSelf: 'flex-end',
        textAlign: 'left',
        //backgroundColor: "rgba(122,154,6,0.90)",
        paddingLeft: theme.spacing.unit * 3.2,
        paddingBottom: theme.spacing.unit * 0.8,
    },
    smallText: {
        fontSize: '0.7rem',
    },
    largeText: {
        fontSize: '1.0rem',
    },
    mediumText: {
        fontSize: '0.8rem',
    },
});

function Footer(props) {
    const { classes } = props;
    var value = 0;

    function handleChange(event, newValue) {
        console.log("New value: ", newValue);
    }

    return (

        <div className={classes.root}>
            <div className={classes.logo}>
                <span className={classes.largeText}>Multiprizer</span><br />
                <span className={classes.smallText}>Copyright 2019</span>
            </div>


            {/*  <Paper >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="Item One" />
                    <Tab label="Item Two" />
                    <Tab label="Item Three" />
                </Tabs>
            </Paper> */}

        </div>
    );
}

export default withStyles(styles)(Footer);
