import React from 'react';
import { DrizzleContext } from 'drizzle-react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
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
import HomeIcon from '@material-ui/icons/Home';
import NotificationsIcon from '@material-ui/icons/Notifications';
import NotesIcon from '@material-ui/icons/Notes';
import StarsIcon from '@material-ui/icons/Stars';
import GamesIcon from '@material-ui/icons/Games';
import ContactSupportIcon from '@material-ui/icons/ContactSupport';
import DescriptionIcon from '@material-ui/icons/Description';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';
import MultiprizerLogo from '../img/MultiprizerLogo.png';
import headerStrip from '../img/headerStrip.png';
// import { DRAWERICONS as drawerIcons } from '../../Constants';

const styles = theme => ({
    root: {
        boxSizing: 'border-box',
        // flexGrow: 1,
        // height:'20vh',
        height: theme.mixins.toolbar.minHeight,
    },
    toolbar: {
        boxSizing: 'border-box',
        // display: 'flex',
        maxWidth: '100%',
        maxHeight: '100%',
        height: theme.mixins.toolbar.minHeight,
        // eslint-disable-next-line global-require
        backgroundImage: `url(${headerStrip})`,
        backgroundSize: 'cover',
        // alignItems: 'center',
        // margin:'auto',
    },
    menuButton: {
        // flexGrow: 1,
        marginLeft: -12,
        marginRight: 10,
        // backgroundColor: "rgba(112,154,6,0.90)",
    },
    grow: {
        boxSizing: 'border-box',
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        // backgroundColor: "rgba(12,114,64,0.90)",
        // maxWidth: '100%',
        // maxHeight: '100%',
        height: '100%',
        margin: 'auto',
        textAlign: 'left',
        // padding: '0.1em',
        // justifyContent: 'center',
    },
    buttonBase: {
        boxSizing: 'border-box',
        // flexGrow: 1,
        width: theme.mixins.toolbar.minHeight * 3,
        height: 'auto',
        margin: 'auto 0 auto 0',
        // maxWidth: '100%',
        // maxHeight: '100%',
        // backgroundColor: "rgba(12,15,46,0.90)",
    },
    headerLogo: {
        boxSizing: 'border-box',
        flexGrow: 1,
        width: '100%',
        // height: 'auto',
        // maxWidth: '100%',
        // maxHeight: '100%',
        // backgroundColor: "rgba(112,154,6,0.90)",
    },
    withdrawButton: {
        // backgroundColor: "rgba(72,14,96,0.90)",
    },
    list: {
        boxSizing: 'border-box',
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});

class Header extends React.Component {
    static contextType = DrizzleContext.Context;

    constructor(props) {
        console.log('#___ inside constructor___');
        super(props);
        this.state = {
            dataKey: null,
            isDrawerOpen: false,
            stackID: null,
            isDialogOpen: false,
        };
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps) {
    }


    render() {
        console.log('# inside render ');
        const { classes, history, fullScreen } = this.props;
        const { dataKey } = this.state;
        const { drizzleState } = this.context;
        const toggleDrawer = isDrawerOpen => () => {
            this.setState({ isDrawerOpen: isDrawerOpen });
        };
        

        const renderLink = () => {
            history.push('/');
        };

        const renderDrawerItems = (itemIndex) => {
            switch (itemIndex) {
                case 0:
                    history.push('/notifications');
                    break;

                default:
                    history.push('/');
                    break;
            }
        };

        const drawerItems = (
            <div className={classes.list}>
                <List>
                    <ListItem
                        button
                        key="homesite"
                        component='a'
                        href='http://localhost:3000/#/'
                    >
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Goto Homesite" />
                    </ListItem>
                </List>
                <Divider />
            </div>
        );

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar className={classes.toolbar}>
                        <IconButton
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="Menu"
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <div className={classes.grow}>
                            <ButtonBase onClick={renderLink} className={classes.buttonBase}>
                                {"ContentTUBE"}
                            </ButtonBase>
                        </div>
                    </Toolbar>
                </AppBar>

                <Drawer open={this.state.isDrawerOpen} onClose={toggleDrawer(false)}>
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={toggleDrawer(false)}
                        onKeyDown={toggleDrawer(false)}
                    >
                        {drawerItems}
                    </div>
                </Drawer>
            </div>
        );
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withMobileDialog()(withRouter(withStyles(styles)(Header)));
