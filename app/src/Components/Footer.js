import React from 'react';
import { withStyles } from '@material-ui/core';
import MultiprizerLogoBlue from '../img/MultiprizerLogoBlue.png';


const styles = theme => ({
    root: {
        display: 'flex',
        flexGrow: 1,
        minHeight: '10vh',
        // bottom:0,
        backgroundColor: 'rgba(12,54,76,0.90)',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        flexGrow: 1,
        color: '#17d4fe',
        alignSelf: 'flex-end',
        textAlign: 'left',
        //backgroundColor: "rgba(122,154,6,0.90)",
        paddingLeft: theme.spacing.unit * 3.2,
        paddingBottom: theme.spacing.unit * 0.8,
    },
    footerLogo: {
        //backgroundColor: "rgba(92,14,69,0.90)",
        width: theme.mixins.toolbar.minHeight * 2,
        height: 'auto',
        margin: 'auto 1em auto 1em',
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


    return (
        <div className={classes.root}>
            <div className={classes.logo}>
                <img
                    src={MultiprizerLogoBlue}
                    alt="Header Logo"
                    className={classes.footerLogo}
                />
                <p className={classes.mediumText}>(Copyright 2019)</p>
            </div>
        </div>
    );
}

export default withStyles(styles)(Footer);
