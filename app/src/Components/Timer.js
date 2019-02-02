import React from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const styles = theme => ({
    root: {
        //height: 500
        //flexBasis:
    },
    paper: {
        //height:700,
        flexGrow: 1,
        padding: theme.spacing.unit * 2,
        textAlign: "center",
        color: theme.palette.text.primary
    },
    components: {
        flexGrow: 1
    }
});

class Timer extends React.Component {
    constructor(props) {
        super(props);
        const duration = this.props.duration;
        const startTime = this.props.startTime;
        console.log("duration: ", duration && duration, " startTime: ", startTime && startTime);
        let remainingTime = 0;

        if (duration > 0) {
            //const startTime = new Date().getTime() - 60 * 60 * 3;
            const nowTime = Math.floor((new Date().getTime()) / 1000);
            console.log("duration: ", duration && duration, " startTime: ", startTime, " nowTime: ", nowTime);
            const spentTime = nowTime - startTime;
            remainingTime = duration - spentTime;
        }

        this.state = { remainingTime: remainingTime };
        this.MINTIME = 61;

        console.log("# time is : ", this.state.remainingTime);
    }

    secToString(_seconds) {
        var seconds = Number(_seconds);
        //console.log("duration is : ", seconds);
        var d = Math.floor(seconds / (3600 * 24));
        var h = Math.floor((seconds % (3600 * 24)) / 3600);
        var m = Math.floor((seconds % 3600) / 60);
        var s = Math.floor((seconds % 3600) % 60);

        var dDisplay = d > 0 ? (d < 10 ? "0" + d : d) + (d === 1 ? " day " : " days ") : "00 days ";
        var hDisplay = h > 0 ? (h < 10 ? "0" + h : h) + (h === 1 ? " hour " : " hours ") : "00 hours ";
        var mDisplay = m > 0 ? (m < 10 ? "0" + m : m) + (m === 1 ? " minute " : " minutes ") : "00 minutes ";
        var sDisplay = s > 0 ? (s < 10 ? "0" + s : s) + (s === 1 ? " second" : " seconds") : "00 seconds ";
        const durationString = dDisplay + hDisplay + mDisplay + sDisplay;
        //console.log("durationstr is : ", durationString);
        return durationString;
    }

    startTimer() {
        var _this = this;
        console.log("remaining time: ", _this.state.remainingTime, " MINTIME: ", _this.MINTIME);
        return window.setInterval(function () {
            if (_this.state.remainingTime > _this.MINTIME) {
                const _remainingTime = _this.state.remainingTime - 1;
                _this.setState({
                    remainingTime: _remainingTime
                });
            } else {
                console.log("time over called");
            }
        }, 1000);
    }



    componentDidUpdate(prevProps, prevState) {
        if (this.timeOver) {
            window.clearInterval(this.timer);
            this.timer = null;
        }
    }

    componentDidMount() {
        this.timeOver = false;
        this.timer = this.startTimer();
    }

    componentWillUnmount() {
        window.clearInterval(this.timer);
        this.timer = null;
    }

    render() {
        const { classes } = this.props;
        const remTimeStr = this.secToString(this.state.remainingTime);
        //console.log("remaining Time: ", remTimeStr);

        return <h1> {remTimeStr} </h1>;
    }
}

Timer.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Timer);
//export default Timer;
