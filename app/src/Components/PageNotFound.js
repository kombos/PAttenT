import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import MultiprizerSplash from '../img/MultiprizerSplash.png';
import web3bg from '../img/web3bg.jpg';


const styles = (theme) => ({
    dialogRoot: {
        //backgroundColor: 'rgba(102,0,51,1)',
        backgroundImage: `url(${web3bg})`,
        backgroundSize: 'cover',
        // color: "#17d4fe",
        // height: '100%',
        // width: 'auto',
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

class PageNotFound extends React.Component {
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
        console.log('inside render of PageNotFound');
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
                        <DialogContentText color="inherit">
                            <b>Page Not Found</b> - The page you are looking for is unresponsive or doesn't exist.
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(PageNotFound);
