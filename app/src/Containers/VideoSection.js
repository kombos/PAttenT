import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import VideoContainer from './VideoContainer';

const styles = theme => ({
    flexContainer: {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        width: '100%',
        height: 'auto',
        // maxWidth: '85%',
        margin: 'auto',
        // slate color
        backgroundColor: "rgba(0,4,6,0.99)",
        boxSizing: 'border-box',
        // backgroundColor: "rgba(62,54,76,0.7)",

    },
    /* Screen size : width ratio =>
            0   : 100% (xs)
            320 : 100%
            425 : 90%
            525 : 75%
            600 : 100% (sm)
            700 : 90%
            800 : 75%
            960: 100% (md)
            1280: ..100% (lg)
            1440 : 90%
            1720 : 75%
            1920 : 60% (xl)
*/
    gridItem: {
        flexGrow: 1,
        backgroundColor: 'rgba(42,44,74,0.90)',
    },
    flexChild: {
        // light green
        // backgroundColor: "rgba(112,154,76,0.90)",
        boxSizing: 'border-box',
        height: 'auto',
        flexGrow: 1,
        alignItems: 'center',
        [theme.breakpoints.down(425)]: {
            width: '100%',
        },
        [theme.breakpoints.up(425)]: {
            width: '90%',
        },
        [theme.breakpoints.up(525)]: {
            width: '75%',
        },
        [theme.breakpoints.up(theme.breakpoints.keys[1])]: {
            width: '100%',
        },
        [theme.breakpoints.up(700)]: {
            width: '90%',
        },
        [theme.breakpoints.up(800)]: {
            width: '75%',
        },
        [theme.breakpoints.up(theme.breakpoints.keys[2])]: {
            width: '100%',
        },
        [theme.breakpoints.up(1440)]: {
            width: '90%',
        },
        [theme.breakpoints.up(1720)]: {
            width: '75%',
        },
        [theme.breakpoints.up(theme.breakpoints.keys[4])]: {
            width: '50%',
        },
        margin: '1.5rem auto 1.5rem auto',
        // padding: theme.spacing.unit * 1,
        // backgroundColor: "rgba(32,14,76,0.7)",
    },
});

class VideoSection extends React.Component {

    constructor(props) {
        console.log('#___ inside constructor___');
        super(props);
        this.state = { dataKey: null };
    }

    componentDidMount() {
        console.log('# GameStrategy: $$$$$ INSIDE COMPONENT DID MOUNT $$$$$');
        const { drizzle } = this.props;
    }

    render() {
        console.log('# GameStrategy: INSIDE RENDER : ');
        const { classes, drizzleState, drizzle } = this.props;
        const { dataKey } = this.state;
        const multiprizer = drizzleState.contracts.Pattent;
        const logEvents = multiprizer.events;
        console.log('# logevents : ', logEvents);

        let videoContainer = null;

        videoContainer = <VideoContainer videoID={1} />;

        return (
            <div className={classes.flexContainer}>
                <Grid container spacing={0} className={classes.flexChild} direction="row">
                    {videoContainer}
                </Grid>
            </div>
        );
    }
}


export default withStyles(styles)(VideoSection);
