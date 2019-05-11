import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import MultiprizerSplash from '../img/MultiprizerSplash.png';
import metamask from '../img/metamask.png';
import trustWallet from '../img/trustWallet.png';
import web3bg from '../img/web3bg.jpg';
import { TRUST_WALLET_DEEPLINK as TRUST_WALLET_LINK } from '../Constants';


const styles = (theme) => ({
    dialogRoot: {
        //backgroundColor: 'rgba(102,0,51,1)',
        backgroundImage: `url(${web3bg})`,
        backgroundSize: 'cover',
        //transform: 'scaleX(-1)',
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
                            <b>Multiprizer</b> - Multiply your prize winnings by playing your tokens strategically!
                            <br />
                            This DApp requires <b>MetaMask</b> if you are in a Desktop / Laptop, or <b>Trust Wallet App</b> if you are in a Mobile device.<br />
                            Also, please set your Metamask / Trust Wallet to <b>Ethereum Main Network</b>, if not already done by default.<br />
                            Please select an item below.
                        </DialogContentText>
                    </DialogContent>
                    <List>
                        <a href="https://metamask.io/">
                            <ListItem button>
                                <ListItemAvatar>
                                    <Avatar alt="MetaMask" src={metamask} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Open using Metamask"
                                    secondary="applicable for Desktops/Laptops"
                                    primaryTypographyProps={{
                                        color: 'primary',
                                    }}
                                    secondaryTypographyProps={{
                                        color: 'secondary',
                                    }}
                                />
                            </ListItem>
                        </a>
                        <Divider />
                        <a href={TRUST_WALLET_LINK}>
                            <ListItem button>
                                <ListItemAvatar>
                                    <Avatar alt="MetaMask" src={trustWallet} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Open using Trust Wallet"
                                    secondary="applicable for Mobile Devices"
                                    primaryTypographyProps={{
                                        color: 'primary',
                                    }}
                                    secondaryTypographyProps={{
                                        color: 'secondary',
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
