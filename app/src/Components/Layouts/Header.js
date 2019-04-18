import React from 'react';
import { DrizzleContext } from 'drizzle-react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { Tooltip } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withRouter } from 'react-router';
import ButtonBase from '@material-ui/core/ButtonBase';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import NotificationsIcon from '@material-ui/icons/Notifications';
// import { DRAWERICONS as drawerIcons } from '../../Constants';


const styles = theme => ({
    root: {
        // flexGrow: 1,
        // height:'20vh',
        height: theme.mixins.toolbar.minHeight,

    },
    grow: {
        flexGrow: 1,
        // backgroundColor: "rgba(112,154,6,0.90)",
        textAlign: 'left',
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 10,
        // backgroundColor: "rgba(112,154,6,0.90)",
    },
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    toolbar: {
        minHeight: theme.mixins.toolbar.minHeight,
        // eslint-disable-next-line global-require
        backgroundImage: `url(${require('../../img/headerStrip.png')})`,
        backgroundSize: 'cover',
    },
});


class Header extends React.Component {
    static contextType = DrizzleContext.Consumer;

    constructor(props, context) {
        console.log('#___ inside constructor___');
        super(props);
        this.context = context;
        this.state = {
            dataKey: null,
            isDrawerOpen: false,
            stackID: null,
            isDialogOpen: false,
        };
        this.prevStackID = this.state.stackID;
        this.withdrawTokens = this.withdrawTokens.bind();
        // this.getWithdrawals = this.getWithdrawals.bind();
    }

    componentDidMount() {
        this.getWithdrawals(this.props.playerAddress);
    }

    shouldComponentUpdate() {
        const { stackID } = this.state;
        const { drizzleState } = this.context;
        if (this.prevStackID !== stackID) {
            // get the transaction hash using our saved `stackID`
            const { transactions, transactionStack } = drizzleState;
            const txHash = transactionStack[stackID];
            console.log('txHash: ', txHash);
            console.log('txns txhash: ', transactions[txHash]);
            // if transaction hash does not exist, don't display anything
            if (txHash && transactions[txHash] && (transactions[txHash].status === 'pending'
                || transactions[txHash].status === 'success')) {
                this.handleClickOpen();
                this.prevStackID = stackID;
            }
        }
        return true;
    }

    componentDidUpdate(prevProps) {
        const { playerAddress } = this.props;
        if (playerAddress !== prevProps.playerAddress) {
            this.getWithdrawals(playerAddress);
        }
    }

    getWithdrawals = (playerAddress) => {
        console.log('# Header: $$$$$ INSIDE getWithdrawals $$$$$');
        const { drizzle } = this.context;
        const { Multiprizer } = drizzle.contracts;
        // get and save the key for the variable we are interested in
        console.log('player : ', playerAddress);
        const dataKey = Multiprizer.methods.viewWithdrawalInfo.cacheCall(playerAddress);
        console.log('# Header datakey value is:', dataKey);
        this.setState({
            dataKey: dataKey,
        });
    }

    withdrawTokens = () => {
        console.log('inside withdrawTokens() ');
        const { playerAddress } = this.props;
        const { drizzle } = this.context;
        console.log('playeraddr: ', playerAddress);
        const { Multiprizer } = drizzle.contracts;
        const stackID = Multiprizer.methods.withdraw.cacheSend({
            from: playerAddress,
        });
        console.log('stackID: ', stackID);
        this.setState({ stackID: stackID });
    }

    handleClickOpen = () => {
        this.setState({ isDialogOpen: true });
    }

    handleClose = () => {
        this.setState({ isDialogOpen: false });
    }

    render() {
        console.log('# inside render ');
        console.log('notification icon: ', NotificationsIcon);
        const { classes, history, fullScreen } = this.props;
        const { dataKey } = this.state;
        const { drizzleState } = this.context;
        const toggleDrawer = isDrawerOpen => () => {
            this.setState({ isDrawerOpen: isDrawerOpen });
        };
        const { Multiprizer } = drizzleState.contracts;
        console.log('this.state.dataKey : ', dataKey);
        console.log('player: ', this.props.playerAddress);
        const withdrawAmount = Multiprizer.viewWithdrawalInfo[dataKey];
        console.log('withdraw amt : ', withdrawAmount && parseInt(withdrawAmount.value, 10));
        // const isWithdrawDisabled = withdrawAmount && (parseInt(withdrawAmount.value, 10) > 0) ? false : true;
        const isWithdrawDisabled = !(withdrawAmount && withdrawAmount.value.toString() !== '0');
        console.log('isWithdrawDisabled: ', isWithdrawDisabled);

        const renderLink = () => {
            history.push('/');
        };

        const renderDrawerItems = (itemIndex) => {
            switch (itemIndex) {
                case 0:
                    history.push('/notifications');
                    break;
            }
        };

        const sideList = (
            <div className={classes.list}>
                <List>
                    <ListItem button key="Notifications" onClick={() => (renderDrawerItems(0))}>
                        <ListItemIcon><NotificationsIcon /></ListItemIcon>
                        <ListItemText primary="Notifications" />
                    </ListItem>
                </List>
                <Divider />
            </div>
        );

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar className={classes.toolbar}>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <div className={classes.grow}>
                            <ButtonBase onClick={renderLink}>
                                <Typography variant="h6" color="inherit">
                                    Multiprizer
                                </Typography>
                            </ButtonBase>
                        </div>
                        <Tooltip title={isWithdrawDisabled === true ? 'Withdraw Winnings (disabled)' : 'Withdraw Winnings'}>
                            <div>
                                <IconButton color="inherit" aria-label="Menu" disabled={isWithdrawDisabled} onClick={this.withdrawTokens}>
                                    <SaveAltIcon />
                                </IconButton>
                            </div>
                        </Tooltip>
                    </Toolbar>
                </AppBar>

                <Drawer open={this.state.isDrawerOpen} onClose={toggleDrawer(false)}>
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={toggleDrawer(false)}
                        onKeyDown={toggleDrawer(false)}
                    >
                        {sideList}
                    </div>
                </Drawer>
                <Dialog
                    fullScreen={fullScreen}
                    open={this.state.isDialogOpen}
                    onClose={this.handleClose}
                    aria-labelledby="responsive-dialog-title"
                >
                    <DialogTitle id="responsive-dialog-title">Withdraw Request Received</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            &quot;Withdraw&quot; action has been recorded. Please wait till your transaction is confirmed.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary" autoFocus>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withMobileDialog()(withRouter(withStyles(styles)(Header)));
