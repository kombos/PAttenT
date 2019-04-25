import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

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
        fontFamily: 'Orbitron',
        color: '#17d4fe',
        // padding: theme.spacing.unit * 0.5,
    },
    smallText: {
        fontSize: '0.6rem',
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

class Timer extends React.PureComponent {
    constructor(props) {
        super(props);
        const duration = this.props.duration;
        const startTime = this.props.startTime;
        console.log('duration: ', duration && duration, ' startTime: ', startTime && startTime);
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

        this.state = {
            remainingTime: remainingTime,
            timeOver: false,
        };

        console.log('# time is : ', this.state.remainingTime);
    }

    componentDidMount() {
        // this.timeOver = false;
        this.timer = this.startTimer();
    }

    componentDidUpdate() {
        console.log('component did update: ');
        if (this.state.timeOver) {
            window.clearInterval(this.timer);
            console.log('interval cleared!!');
            this.timer = null;
        }
    }

    componentWillUnmount() {
        window.clearInterval(this.timer);
        this.timer = null;
    }

    secToString(_seconds) {
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
        // console.log("durationstr is : ", durationString);
        return durationString;
    }

    startTimer() {
        const _this = this;
        console.log('remaining time: ', _this.state.remainingTime, ' MINTIME: ', _this.MINTIME);
        return window.setInterval(() => {
            if (_this.state.remainingTime > _this.MINTIME) {
                const _remainingTime = _this.state.remainingTime - 1;
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
        const { classes, duration } = this.props;
        const { remainingTime } = this.state;
        const durationStr = this.secToString(duration);
        const durationArr = durationStr.split(' ');
        const remTimeStr = this.secToString(remainingTime);
        const remTimeArr = remTimeStr.split(' ');

        return (
            <div className={classes.flexContainer}>
                <div className={classes.flexChild}>
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
