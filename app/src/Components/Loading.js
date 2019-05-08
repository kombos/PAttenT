import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import MultiprizerSplash from '../img/MultiprizerSplash.png';
import web3bg from '../img/web3bg.jpg';
import AutorenewIcon from '@material-ui/icons/Autorenew';



const styles = (theme) => ({
    dialogRoot: {
        //backgroundColor: 'rgba(102,0,51,1)',
        backgroundImage: `url(${web3bg})`,
        backgroundSize: 'cover',
        // color: "#17d4fe",
        // height: '100%',
        // width: 'auto',
    },
    textContainer: {
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
    },
    spinning: {
        //maxWidth: '100%',
        height: 'auto',
        animationName: 'spin',
        animationIterationCount: 'infinite',
        animationTimingFunction: 'linear',
        animationDuration: '800ms',
        fontSize: theme.typography.h5.fontSize,
        fontWeight: theme.typography.h5.fontWeight,
    },
    '@keyframes spin': {
        '0%': {
            transform: 'rotate(0deg)',
        },
        '100%': {
            transform: 'rotate(360deg)',
        },
    },
    imageContainer: {
        padding: '5px',
        boxSizing: 'border-box',
        // display: 'flex',
        // backgroundColor: 'rgba(51,51,51,1)',
        backgroundColor: 'rgba(0,0,0,0.4)',
        //width: '100%',
        //height: '10%',
        height: theme.mixins.toolbar.minHeight,
        textAlign: 'center',
    },
    image: {
        boxSizing: 'border-box',
        //width: '60%',
        height: '100%',
        margin: 'auto',
    },
});

const Transition = (props) => {
    return <Slide direction="up" {...props} />;
};

class Loading extends React.Component {
    constructor(props) {
        console.log('#___ inside constructor___');
        super(props);
        this.state = {
            isDialogOpen: true,
        };
    }

    handleClickOpen = () => {
        this.setState({ isDialogOpen: true });
    }

    handleClose = () => {
        this.setState({ isDialogOpen: false });
    }

    render() {
        console.log('inside render of Loading');
        const { isDialogOpen } = this.state;
        const { classes } = this.props;

        return (
            <div>
                <Dialog
                    fullScreen
                    disableBackdropClick
                    disableEscapeKeyDown
                    fullWidth
                    open={isDialogOpen}
                    onClose={this.handleClose}
                    TransitionComponent={Transition}
                    classes={{
                        paper: classes.dialogRoot,
                    }}
                >
                    <div className={classes.imageContainer}>
                        <img
                            src={MultiprizerSplash}
                            alt="Multiprizer Splash"
                            className={classes.image}
                        />
                    </div>
                    <br />
                    <DialogContent>
                        <div className={classes.textContainer}>
                                <h2>LOADING&nbsp;&nbsp;<AutorenewIcon className={classes.spinning} /></h2>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(Loading);
