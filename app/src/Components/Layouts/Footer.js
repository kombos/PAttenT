import React from 'react';
import { withStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const styles = {
    root: {
        //flexGrow: 1,
        height:'10vh',
        //bottom:0,
        backgroundColor: "rgba(12,4,176,0.90)",

    },
};

function Footer(props) {
    const { classes } = props;
    var value = 0;

    function handleChange(event, newValue) {
        console.log("New value: ", newValue);
    }

    return (

        <div className={classes.root}>
            <Paper >
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
            </Paper>
        </div>
    );
}

export default withStyles(styles)(Footer);
