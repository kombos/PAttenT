import React from 'react';
import YouTube from './YouTube';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import MenuIcon from '@material-ui/icons/Menu';
import { getAd } from '../Constants';
import { DrizzleContext } from 'drizzle-react';


const styles = theme => ({
    video: {
        width: '80%',
        height: 0,
        paddingBottom: '56.25%',
        margin: 'auto',
        //position: 'relative',
        //backgroundColor: "rgba(82,84,118,0.90)",
    },
    player: {
        //position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
    },
    buttonSection: {
        backgroundColor: "rgba(39,39,39,0.90)",
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        alignContent: 'center',
        margin: 'auto',
    },
    buttonContainer: {
        // backgroundColor: "rgba(72,14,96,0.90)",
        margin: 'auto 0.5rem auto 0.5rem',
        flex: '1 1 auto',

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

class VideoContainer extends React.Component {
    static contextType = DrizzleContext.Context;


    constructor(props) {
        super(props);
        this.state = {
            videoID: 1,
            adID: 0,
            adIgnore: 0,
            eligibleForToken: true,
            adTimerCompleted: false,
            remainingTime: 10,
            stackID: null,
            dataKey: null
        };
    }

    componentDidMount() {
        console.log("inside componentDidMount()");
        // this.timeOver = false;
        this.timer = this.startTimer();
    }

    componentWillUnmount() {
        console.log("inside componentWillUnmount()");
        window.clearInterval(this.timer);
        this.timer = null;
    }


    startTimer() {
        console.log("inside startTimer()");
        const _this = this;
        console.log('remaining time: ', _this.state.remainingTime);
        return window.setInterval(() => {
            console.log("-- inside interval --");
            if (_this.state.remainingTime > 0) {
                const _remainingTime = _this.state.remainingTime - 1;
                console.log("remainingTime:: ", _remainingTime);
                // console.log("timer time: ", _remainingTime);
                _this.setState({
                    remainingTime: _remainingTime,
                });
            } else {
                console.log('time over called!!!');

                // <get tokens for users!!!>


                _this.setState({
                    remainingTime: 0,
                    eligibleForToken: true,
                    adTimerCompleted: true
                });
                console.log("TIMER STOPPED!");
                window.clearInterval(this.timer);
                this.timer = null;
                // console.log("this.timeOver: ", _this.timeOver);
            }
        }, 1000);
    }

    changeVideo(num) {
        let adIgnore = this.state.adIgnore;
        let eligibleForToken = true;
        if (adIgnore > 0) {
            adIgnore--;
        }
        if (adIgnore > 0) {
            eligibleForToken = false;
        }
        this.setState({
            videoID: num,
            adIgnore: adIgnore,
            eligibleForToken: eligibleForToken,
            adTimerCompleted: false,
            remainingTime: 10
        });
        console.log("TIMER RESTARTED!");
        window.clearInterval(this.timer);
        this.timer = null;
        this.timer = this.startTimer();
    }

    skipped() {
        this.setState({
            adTimerCompleted: true,
            eligibleForToken: false,
            remainingTime: 0
        });
        console.log("TIMER SKIPPED!");
        window.clearInterval(this.timer);
        this.timer = null;
    }

    ignoreAds() {
        const { drizzle, drizzleState } = this.context;
        const web3 = drizzle.web3;
        const BN = web3.utils.BN;
        const Pattent = drizzle.contracts.Pattent;
        const stackID = Pattent.methods.purchaseAdSkip.cacheSend({
            from: drizzleState.accounts[0],
        });

        this.setState({
            adIgnore: 3,
            eligibleForToken: false,
        }); 

    }
    
    render() {

        const { classes } = this.props;
        let video = null;

        switch (this.state.videoID) {
            case 1:
                video = "9TgYBL4zgmc";
                break;

            case 2:
                video = "pPujX3XQeFM";
                break;

            case 3:
                video = "sJkdfPsoY0Q";
                break;

            case 4:
                video = "dQw4w9WgXcQ";
                break;

            default:
                video = "9TgYBL4zgmc";
                break;
        }



        //var rand = Math.floor((Math.random() * 10) + 1);
        var adString = getAd(4);
        let adDisplay = true;
        console.log("adTimerCompleted: ", this.state.adTimerCompleted, "  eligibleForToken: ", this.state.eligibleForToken, "  adignore: ", this.state.adIgnore, "   display or not? : ", (this.state.adIgnore > 0 || this.state.adTimerCompleted == true));
        if (this.state.adIgnore > 0 || this.state.adTimerCompleted == true) {
            adDisplay = false;
            console.log("TIMER IGNORED!");
            window.clearInterval(this.timer);
            this.timer = null;
        }

        if (this.state.adTimerCompleted && this.state.eligibleForToken) {

            const { drizzle, drizzleState } = this.context;
            const web3 = drizzle.web3;
            const BN = web3.utils.BN;
            const Pattent = drizzle.contracts.Pattent;

            const stackID = Pattent.methods.creditTokens.cacheSend({
                from: drizzleState.accounts[0],
            });

            this.setState({
                adIgnore: 3,
                eligibleForToken: false,
                adTimerCompleted: true,
            });

        }


        const videoContainer = (
            <div className={classes.video}>
                <div>
                    <YouTube video={video} autoplay="0" rel="0" modest="1" />
                    <div
                        className={classes.adContainer}
                        style={{
                            display: (adDisplay ? 'block' : 'none')
                        }}
                    >
                        <br />{adString}&nbsp;&nbsp;{this.state.remainingTime}<br /><br />
                        <Button
                            variant="contained"
                            size="large"
                            color="secondary"
                            className={classes.button}
                            onClick={() => (this.ignoreAds())}
                        >
                            <MenuIcon />&nbsp;
                                Avoid Nxt 3 Ads
                            </Button>

                        <Button
                            variant="contained"
                            size="large"
                            color="secondary"
                            className={classes.button}
                            onClick={() => (this.skipped())}
                        >
                            <MenuIcon />&nbsp;
                                Skip Ad
                            </Button>
                    </div>

                </div>
                <br />
                <br />
                <br />
                <div className={classes.buttonSection}>
                    <div className={classes.buttonContainer}>
                        <Tooltip title="Free Video 1">
                            <Button
                                variant="contained"
                                size="large"
                                color="primary"
                                className={classes.button}
                                onClick={() => (this.changeVideo(1))}
                                disabled={(this.state.videoID === 1)}
                            >
                                <MenuIcon />&nbsp;
                                    Cat Videos
                            </Button>
                        </Tooltip>
                    </div>

                    <div className={classes.buttonContainer}>
                        <Tooltip title="Free Video 2">
                            <Button
                                variant="contained"
                                size="large"
                                color="primary"
                                className={classes.button}
                                onClick={() => (this.changeVideo(2))}
                                disabled={(this.state.videoID === 2)}

                            >
                                <MenuIcon />&nbsp;
                                    Dog Videos
                            </Button>
                        </Tooltip>
                    </div>

                    <div className={classes.buttonContainer}>
                        <Tooltip title="Free Video 3">
                            <Button
                                variant="contained"
                                size="large"
                                color="primary"
                                className={classes.button}
                                onClick={() => (this.changeVideo(3))}
                                disabled={(this.state.videoID === 3)}

                            >
                                <MenuIcon />&nbsp;
                                    Cow Videos
                            </Button>
                        </Tooltip>
                    </div>

                    <div className={classes.buttonContainer}>
                        <Tooltip title="Free Video 4">
                            <Button
                                variant="contained"
                                size="large"
                                color="primary"
                                className={classes.button}
                                onClick={() => (this.changeVideo(4))}
                                disabled={(this.state.videoID === 4)}

                            >
                                <MenuIcon />&nbsp;
                                    Rick Rolled!
                            </Button>
                        </Tooltip>
                    </div>


                </div>

            </div>
        );

        return (videoContainer);
    }
}

export default withStyles(styles)(VideoContainer);

