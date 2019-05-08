import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
//import Orbitron from '../fonts/Orbitron2.ttf';

const styles = theme => ({
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(12,54,76,0.90)',
        // boxSizing: 'border-box',
        height: 'auto',
        width: '100%',
        margin: 'auto',
    },
    flexChild: {
        flexGrow: 1,
        textAlign: 'center',
        alignItems: 'center',
        fontFamily: 'OrbitronFont',
        color: '#17d4fe',
        padding: theme.spacing.unit * 0.5,
    },
    smallText: {
        fontSize: '0.6rem',
        marginTop: theme.spacing.unit * 0.125,
        marginBottom: theme.spacing.unit * 0.25,
    },
    largeText: {
        fontSize: '1.1rem',
    },
    mediumText: {
        fontSize: '0.8rem',
    },
    components: {
        flexGrow: 1,
    },
});

class Timer extends React.Component {
    constructor(props) {
        super(props);
        const { duration, startTime } = this.props;
        let remainingTime = this.calculateRemainingTime(duration, startTime);

        this.state = {
            remainingTime: remainingTime,
            timeOver: false,
        };

        console.log('remaining time is : ', this.state.remainingTime);
    }

    componentDidMount() {
        console.log("inside componentDidMount()");
        // this.timeOver = false;
        this.timer = this.startTimer();
    }

    shouldComponentUpdate(nextProps) {
        console.log('shouldComponentUpdate: ');
        const { duration, startTime } = this.props;
        console.log("next duration: ", nextProps.duration, " and now duration: ", duration);
        console.log("next startTime: ", nextProps.startTime, " and now startTime: ", startTime);
        if (nextProps.duration !== duration || nextProps.startTime !== startTime) {
            let remainingTime = this.calculateRemainingTime(nextProps.duration, nextProps.startTime);
            console.log("remaining time: ", remainingTime);
            window.clearInterval(this.timer);
            this.timer = null;
            console.log("%%%%%%%%%%%%%% timer cleared!! ");
            this.setState({
                remainingTime: remainingTime,
                timeOver: false
            });
        }
        return true;

    }

    componentDidUpdate(prevProps) {
        console.log('component did update: ');
        const { duration, startTime } = this.props;
        console.log("state.timeover: : ", this.state.timeOver);
        if (prevProps.duration !== duration || prevProps.startTime !== startTime) {
            this.timer = this.startTimer();
        }
        if (this.state.timeOver) {
            window.clearInterval(this.timer);
            console.log('interval cleared!!');
            this.timer = null;
        }
    }

    componentWillUnmount() {
        console.log("inside componentWillUnmount()");
        window.clearInterval(this.timer);
        this.timer = null;
    }

    calculateRemainingTime(duration, startTime) {
        console.log("inside calculateRemainingTime()")
        let remainingTime = 0;
        if (duration > 0) {
            // const startTime = new Date().getTime() - 60 * 60 * 3;
            const nowTime = Math.floor((new Date().getTime()) / 1000);
            console.log('duration: ', duration && duration, ' startTime: ', startTime, ' nowTime: ', nowTime);
            const spentTime = nowTime - startTime;
            remainingTime = duration - spentTime;
        }

        this.MINTIME = 60;
        remainingTime = remainingTime < this.MINTIME ? this.MINTIME : remainingTime + this.MINTIME;
        return remainingTime;
    }

    secToString(_seconds) {
        console.log("inside secToString()");
        const seconds = Number(_seconds);
        // console.log("duration is : ", seconds);
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor((seconds % 3600) % 60);

        const dDisplay = d > 0 ? (d < 10 ? '0' + d : d) + (d === 1 ? ' day ' : ' days ') : '00 days ';
        const hDisplay = h > 0 ? (h < 10 ? '0' + h : h) + (h === 1 ? ' hour ' : ' hours ') : '00 hours ';
        const mDisplay = m > 0 ? (m < 10 ? '0' + m : m) + (m === 1 ? ' minute ' : ' minutes ') : '00 minutes ';
        const sDisplay = s > 0 ? (s < 10 ? '0' + s : s) + (s === 1 ? ' second' : ' seconds') : '00 seconds ';
        const durationString = dDisplay + hDisplay + mDisplay + sDisplay;
        console.log("durationstr is : ", durationString);
        return durationString;
    }

    startTimer() {
        console.log("inside startTimer()");
        const _this = this;
        console.log('remaining time: ', _this.state.remainingTime, ' MINTIME: ', _this.MINTIME);
        return window.setInterval(() => {
            console.log("-- inside interval --");
            if (_this.state.remainingTime > _this.MINTIME) {
                const _remainingTime = _this.state.remainingTime - 1;
                console.log("remainingTime:: ", _remainingTime);
                // console.log("timer time: ", _remainingTime);
                _this.setState({
                    remainingTime: _remainingTime,
                });
            } else {
                console.log('time over called!!!');
                // _this.timeOver = true;
                _this.setState({
                    remainingTime: _this.MINTIME,
                    timeOver: true,
                });
                // console.log("this.timeOver: ", _this.timeOver);
            }
        }, 1000);
    }

    render() {
        console.log("inside render()");
        const { classes, duration } = this.props;
        const { remainingTime, timeOver } = this.state;
        console.log("remaining time: ", remainingTime);
        console.log("timeOver: ", timeOver);

        const durationStr = this.secToString(duration);
        const durationArr = durationStr.split(' ');
        const remTimeStr = this.secToString(remainingTime);
        const remTimeArr = remTimeStr.split(' ');

        return (
            <div className={classes.flexContainer}>
                <div className={classes.flexChild} >
                    <div className={classes.smallText}>
                        {'remaining :'}
                    </div>
                    <div>
                        <p></p>
                    </div>
                    <div className={classes.smallText}>
                        {'out of :'}
                    </div>
                </div>
                <div className={classes.flexChild}>
                    <div className={classes.largeText}>
                        {remTimeArr[0]}
                    </div>
                    <div className={classes.smallText}>
                        {remTimeArr[1]}
                    </div>
                    <div className={classes.mediumText}>
                        {durationArr[0]}
                    </div>
                </div>
                <div className={classes.flexChild}>
                    <div className={classes.largeText}>
                        {remTimeArr[2]}
                    </div>
                    <div className={classes.smallText}>
                        {remTimeArr[3]}
                    </div>
                    <div className={classes.mediumText}>
                        {durationArr[2]}
                    </div>
                </div>
                <div className={classes.flexChild}>
                    <div className={classes.largeText}>
                        {remTimeArr[4]}
                    </div>
                    <div className={classes.smallText}>
                        {remTimeArr[5]}
                    </div>
                    <div className={classes.mediumText}>
                        {durationArr[4]}
                    </div>
                </div>

            </div>
        );
    }
}

Timer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Timer);
// export default Timer;
