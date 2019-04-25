import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import MultiprizerSplash from '../img/MultiprizerSplash.png';
import metamask from '../img/metamask.png';
import trustWallet from '../img/trustWallet.png';


const styles = () => ({
    appBar: {
        position: 'relative',
    },
    flex: {
        flex: 1,
    },
    dialogRoot: {
        backgroundColor: 'rgba(102,0,51,1)',
        // color: "#17d4fe",
        // height: '100%',
        // width: 'auto',
    },
    imageContainer: {
        boxSizing: 'border-box',
        // display: 'flex',
        // backgroundColor: 'rgba(51,51,51,1)',
        backgroundColor: 'rgba(0,0,0,1)',
        width: '100%',
        textAlign: 'center',
    },
    image: {
        boxSizing: 'border-box',
        width: '60%',
        height: 'auto',
    },
});

const Transition = (props) => {
    return <Slide direction="up" {...props} />;
};

class Web3NotFound extends React.Component {
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
        console.log('inside render of web3notfound');
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
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <Typography variant="h6" color="inherit" className={classes.flex}>
                                Welcome to Multiprizer !
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <div className={classes.imageContainer}>
                        <img
                            src={MultiprizerSplash}
                            alt="Multiprizer Splash"
                            className={classes.image}
                        />
                    </div>
                    <br />
                    <DialogContent>
                        <DialogContentText color="error">
                            Multiprizer - Multiply your prize winnings by playing your tokens strategically!
                            <br />
                            This DApp requires MetaMask if you are in a Desktop / Laptop, or Trust Wallet App if you are in a Mobile device. Also, the wallets need to be set to Ropsten Testnet for now, since this app is in beta phase. Please select an item below.
                        </DialogContentText>
                    </DialogContent>
                    <List>
                        <a href="https://metamask.io/">
                            <ListItem button>
                                <ListItemAvatar>
                                    <Avatar alt="MetaMask" src={metamask} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Get Metamask"
                                    secondary="applicable for Desktops/Laptops"
                                    primaryTypographyProps={{
                                        color: 'primary',
                                    }}
                                    secondaryTypographyProps={{
                                        color: 'error',
                                    }}
                                />
                            </ListItem>
                        </a>
                        <Divider />
                        <a href="https://trustwallet.com/">
                            <ListItem button>
                                <ListItemAvatar>
                                    <Avatar alt="MetaMask" src={trustWallet} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Get Trust Wallet"
                                    secondary="applicable for Mobile Devices"
                                    primaryTypographyProps={{
                                        color: 'primary',
                                    }}
                                    secondaryTypographyProps={{
                                        color: 'error',
                                    }}
                                />
                            </ListItem>
                        </a>
                    </List>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(Web3NotFound);
