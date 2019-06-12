import React from 'react';
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    videoContainer: {
        width: '70%',
        //height: 'auto',
        height: 350,
        margin: 'auto',
        //paddingBottom: '56.25%',
        //position: 'relative',
        backgroundColor: "rgba(112,84,18,0.90)",
    },
    player: {
        /* position: 'absolute',
        top: 0, */
        width: '100%',
        height: '100%',
    },
    adContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        padding: '5px',
        boxSizing: 'border-box',
        // display: 'flex',
        // backgroundColor: 'rgba(51,51,51,1)',
        //backgroundColor: 'rgba(0,0,0,0.4)',
        //width: '100%',
        //height: '10%',
        //height: theme.mixins.toolbar.minHeight,
        textAlign: 'center',
        fontSize: '2.0rem',
        width: '40%',
        height: 'auto',
        //height: 350,
        margin: 'auto',
        //paddingBottom: '56.25%',
        //position: 'relative',
        backgroundColor: "rgba(112,84,18,0.95)",
    },
    
});

class YouTube extends React.Component {

    constructor(props) {
        super(props);
    }


    render() {
        const { classes } = this.props;

        var videoSrc = "https://www.youtube.com/embed/" +
            this.props.video + "?autoplay=" +
            this.props.autoplay + "&rel=" +
            this.props.rel + "&modestbranding=" +
            this.props.modest;

        return (
            <div className={classes.videoContainer}>
                <iframe className={classes.player} type="text/html" width="100%" height="100%"
                    src={videoSrc}
                    frameborder="0" />

                
            </div>
        );
    }
}

export default withStyles(styles)(YouTube);


