import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = theme => ({
    smallText: {
        fontSize: '0.7rem',
    },
    largeText: {
        fontSize: '0.9rem',
    },
    mediumText: {
        fontSize: '0.8rem',
    },
    progressBar: {
        position: 'relative',
        // display: 'flex',
        alignItems: 'center',
        backgroundColor: theme.palette.primary.main,
        boxSizing: 'border-box',
        width: '95%',
        margin: '0.5rem auto 0.5rem auto',
        borderRadius: theme.shape.borderRadius * 6,
        padding: theme.spacing.unit * 0.5,
    },
    progressFill: {
        // position:'relative',
        // flexGrow: 1,
        // backgroundColor: "rgba(62,94,76,0.99)",
        backgroundColor: "rgba(12,54,76,0.90)",
        boxSizing: 'border-box',
        // width: '80%',
        height: '100%',
        // margin: 'auto',
        // minHeight:'50px',
        minHeight: '40px',
        borderRadius: '20px',
    },
    transPanel: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        // alignItems: 'center',
        // backgroundColor: "rgba(0,0,0,0.29)",
        boxSizing: 'border-box',
        height: 'auto',
        width: '75%',
        // margin: 'auto',
        // margin: '0.5rem auto 0.5rem auto',
        borderRadius: '16px',
        padding: theme.spacing.unit * 0.5,
    },
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        // backgroundColor: "rgba(12,54,76,0.99)",
        boxSizing: 'border-box',
        width: '90%',
        margin: 'auto',
    },
    flexChild: {
        flexGrow: 1,
        fontFamily: theme.typography.fontFamily,
        // fontWeight: 'bold',
        color: 'rgba(255,255,255,0.89)',
        // backgroundColor: "rgba(12,54,76,0.99)",
    },

});

class TokensData extends React.PureComponent {
    render() {
        const { classes } = this.props;
        const { tokensLeft, maxTokens } = this.props;
        console.log('tokens left: ', tokensLeft, ' max tokens: ', maxTokens);

        return (
            <div className={classes.progressBar}>
                <div className={classes.transPanel}>
                    <div className={classes.flexContainer}>
                        <div className={classes.flexChild}>
                            <div className={classes.mediumText}>
                                {'total tokens left: '}
                                &nbsp;
                                <span className={classes.largeText}>
                                    {tokensLeft}
                                </span>
                                &nbsp;
                                {' of '}
                                &nbsp;
                                <span className={classes.largeText}>{maxTokens}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={classes.progressFill}
                    style={{
                        width: `${(tokensLeft * 100) / maxTokens}%`,
                    }}
                >
                    &nbsp;
                </div>

            </div>
        );
    }
}

TokensData.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TokensData);
