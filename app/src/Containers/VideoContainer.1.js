import React from 'react';
import YouTube from './YouTube';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';



const styles = theme => ({
    video: {
        width: '80%',
        height: 0,
        paddingBottom: '56.25%',
        margin: 'auto',
        //position: 'relative',
        backgroundColor: "rgba(82,84,118,0.90)",
    },
    player: {
        //position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
    },
    buttonSection: {
        backgroundColor: "rgba(42,14,96,0.90)",
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        alignContent: 'center',
        margin:'auto',
    },
    buttonContainer: {
        // backgroundColor: "rgba(72,14,96,0.90)",
        margin: 'auto 0.5rem auto 0.5rem',
        flex: '1 1 auto',

    },
    

});

class VideoContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {
    }

    render() {

        const { classes } = this.props;
        const videoSection = (
            <div className={classes.video}>
                <YouTube video="mYFaghHyMKc" autoplay="0" rel="0" modest="1" />
                <br />
                <br />
                <br />
                <div className={classes.buttonSection}>
                    <div className={classes.buttonContainer}>
                        <Tooltip title="Free Video 1">
                            <Button
                                variant="outlined"
                                size="large"
                                color="primary"
                                className={classes.button}
                                onClick={this.revertTokens}
                            >
                            <MenuIcon />&nbsp;

                                Free Video 1
                            </Button>
                        </Tooltip>
                    </div>

                    <div className={classes.buttonContainer}>
                        <Tooltip title="Free Video 2">
                            <Button
                                variant="outlined"
                                size="large"
                                color="primary"
                                className={classes.button}
                                onClick={this.revertTokens}
                            >
                            <MenuIcon />&nbsp;

                                Free Video 2
                            </Button>
                        </Tooltip>
                    </div>

                    <div className={classes.buttonContainer}>
                        <Tooltip title="Free Video 3">
                            <Button
                                variant="outlined"
                                size="large"
                                color="primary"
                                className={classes.button}
                                onClick={this.revertTokens}
                            >
                            <MenuIcon />&nbsp;

                                Free Video 3
                            </Button>
                        </Tooltip>
                    </div>

                    <div className={classes.buttonContainer}>
                        <Tooltip title="Free Video 4">
                            <Button
                                variant="outlined"
                                size="large"
                                color="primary"
                                className={classes.button}
                                onClick={this.revertTokens}
                            >
                            <MenuIcon />&nbsp;

                                Free Video 4
                            </Button>
                        </Tooltip>
                    </div>


                </div>

            </div>
        );

        return (videoSection);
    }
}

export default withStyles(styles)(VideoContainer);

