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
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { withRouter } from "react-router";
import ButtonBase from '@material-ui/core/ButtonBase';

const styles = {
    root: {
        flexGrow: 1,
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
};


class Header extends React.Component {

    static contextType = DrizzleContext.Consumer;

    constructor(props, context) {
        console.log("#___ inside constructor___");
        super(props);
        this.context = context;
        this.state = {
            dataKey: null,
            isDrawerOpen: false
        };
    }

    componentDidMount() {
        console.log("# Header: $$$$$ INSIDE COMPONENT DID MOUNT $$$$$");
        const Multiprizer = this.context.drizzle.contracts.Multiprizer;
        // get and save the key for the variable we are interested in
        const dataKey = Multiprizer.methods.viewWithdrawalInfo.cacheCall(this.props.playerAddress);
        console.log("# Header datakey value is:" + dataKey);
        this.setState({
            dataKey: dataKey
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log("this props: ", this.props.playerAddress, " next props: ", nextProps.playerAddress);
        if (!this.withdrawAmount) {
            console.log("no withdraw amount yet");
            return true;
        }

        if (this.props.playerAddress != nextProps.playerAddress ||
            this.state.isDrawerOpen != nextState.isDrawerOpen ||
            this.state.dataKey != nextState.dataKey)
            return true;
        else
            return false;
    }

    render() {
        const { classes, history } = this.props;
        const toggleDrawer = (isDrawerOpen) => () => {
            this.setState({ isDrawerOpen: isDrawerOpen });
        };
        const dataKey = this.state.dataKey;
        const multiprizer = this.context.drizzleState.contracts.Multiprizer;
        this.withdrawAmount = multiprizer.viewWithdrawalInfo[dataKey];
        let isWithdrawDisabled = true;
        console.log("withdraw amt : ", this.withdrawAmount && parseInt(this.withdrawAmount.value));
        isWithdrawDisabled = this.withdrawAmount && (parseInt(this.withdrawAmount.value) > 0) ? false : true;
        console.log("isWithdrawDisabled: ", isWithdrawDisabled);

        const renderLink = () => {
            history.push(`/`);
        };

        const sideList = (
            <div className={classes.list}>
                <List>
                    {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {['All mail', 'Trash', 'Spam'].map((text, index) => (
                        <ListItem button key={text}>
                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </div>
        );

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={toggleDrawer(true)}>
                            <MenuIcon />
                        </IconButton>
                        <div className={classes.grow}>
                            <ButtonBase onClick={renderLink} >
                                <Typography variant="h6" color="inherit" >
                                    Multiprizer
                                </Typography>
                            </ButtonBase>
                        </div>
                        <Tooltip title={isWithdrawDisabled == true ? "Withdraw Tokens (disabled)" : "Withdraw Tokens"}>
                            <div>
                                <IconButton color="inherit" aria-label="Menu" disabled={isWithdrawDisabled}>
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
            </div>
        );

    }


}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(Header));