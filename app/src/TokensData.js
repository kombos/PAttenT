import React, { Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

const styles = theme => ({
    smallText: {
        fontSize: "0.6rem",
    },
    largeText: {
        fontSize: "1.2rem",
    },
    mediumText: {
        fontSize: "0.8rem",
    },
    components: {
        flexGrow: 1
    },
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
        //backgroundColor: "rgba(12,54,76,0.99)",
        //boxSizing: 'border-box',
        height: 'auto',
        maxWidth: '70%',
        margin: 'auto',
    },
    flexChild: {
        flexGrow: 1,
        textAlign: 'center',
        alignItems: 'center',
        fontFamily: "Orbitron",
        fontWeight:'bold',
        color: 'black',
        //padding: theme.spacing.unit * 0.5,
    },

});

class TokensData extends React.PureComponent {

    render() {
        const { classes } = this.props;
        const { tokensLeft, maxTokens } = this.props;


        return (
            <Fragment>
                <div style={{
                    minHeight: '12px',
                }}></div>
                <div className={classes.flexContainer}>
                    <div className={classes.flexChild}>
                        <div className={classes.smallText}>
                            {"tokens"}
                        </div>
                        <div className={classes.smallText}>
                            {"left"}
                        </div>
                    </div>
                    <div className={classes.flexChild}>
                        <div className={classes.largeText}>
                            {tokensLeft}
                        </div>
                    </div>
                    <div className={classes.flexChild}>
                        <div className={classes.smallText}>
                            {"out"}
                        </div>
                        <div className={classes.smallText}>
                            {"of"}
                        </div>
                    </div>
                    <div className={classes.flexChild}>
                        <div className={classes.largeText}>
                            {maxTokens}
                        </div>
                    </div>
                </div>
            </Fragment>
        );


    }
}

TokensData.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(TokensData);
