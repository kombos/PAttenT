import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { AutoSizer, Column, SortDirection, Table } from 'react-virtualized';

const styles = theme => ({
    root: {
        //padding: theme.spacing.unit * 0.5,
        margin: '0.75rem 0.75rem 0.75rem 0.75rem',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: "column",
        flex: '1 1 auto',
        height: 'auto',
        backgroundColor: "rgba(0,0,0,0.69)",
        justifyContent: 'center',
    },
    transPanel: {
        color: theme.palette.primary.light,
        fontWeight: 'bold',
        flex: '1 1 auto',
        justifyContent: 'center',
        //backgroundColor: "rgba(100,0,0,0.69)",
        boxSizing: 'border-box',
        maxHeight: '2.5em',
        width: '100%',
        margin: 'auto',
        //margin: '0.5rem auto 0.5rem auto',
        //borderRadius: theme.shape.borderRadius * 2,
        //paddingTop: theme.spacing.unit * 0.05,
        //paddingBottom: theme.spacing.unit * 0.05,
        //paddingBottom: '0.02rem',
    },
    tableContainer: {
        //backgroundImage: `url(${require(`./img/tableBG.jpg`)})`,
        //filter: 'opacity(30%)',
        //backgroundSize: 'cover',
        backgroundColor: theme.palette.grey[50],
        //margin: '0rem auto auto auto',
        flex: '1 1 auto',
        height: 400,
    },
    table: {
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.fontSize,
        //fontWeight: theme.typography.fontWeightMedium,
    },
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        alignContent: 'center',
    },
    tableRow: {
        cursor: 'pointer',
        textAlign: 'left',
        //margin: 'auto 1em auto auto',
        paddingLeft: '1em',
        borderBottom: '1px solid #e0e0e0',
        //wordBreak: 'break-all',
        //backgroundColor: theme.palette.grey[200],
    },
    tableRowHover: {
        '&:hover': {
            backgroundColor: theme.palette.grey[200],
        },
    },
    headerColumn: {
        fontWeight: 'bold',
    },
    tableCell: {
        flex: 1,
    },
    noClick: {
        cursor: 'initial',
    },
    noRows: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: theme.typography.fontSize,
        color: '#bdbdbd',
    },

});



class GameNotifications extends React.Component {

    constructor(props) {
        super(props);
        let sortBy = 'timeSecs';
        let sortDirection = SortDirection.DESC;
        this.state = { sortDirection: sortDirection, sortBy: sortBy };
        this.flag = true;
        this.getEvents();
        this.sortList({ sortBy, sortDirection });
    }

    getRowClassName = ({ index }) => {
        const { classes } = this.props;

        return classNames(classes.tableRow, classes.flexContainer,
            { [classes.tableRowHover]: index !== -1, });
    };

    noRowsRenderer = () => {
        const { classes } = this.props;
        return <div className={classes.noRows}>No rows</div>;
    }

    sort = ({ sortBy, sortDirection }) => {
        console.log("inside sort() :: sortby: ", sortBy, " sortdirection: ", sortDirection);
        this.sortList({ sortBy, sortDirection });
        this.setState({
            sortDirection: sortDirection,
            sortBy: sortBy
        });

    }

    sortList = ({ sortBy, sortDirection }) => {
        console.log("inside sort() :: sortby: ", sortBy, " sortdirection: ", sortDirection);

        const cmp = sortDirection === SortDirection.DESC ? (a, b) => this.desc(a, b, sortBy) : (a, b) => -this.desc(a, b, sortBy);
        const sortedData = this.stableSort(this.gameEvents, cmp);
        console.log("sortedData: ", sortedData);
        this.gameEvents = sortedData;
    }

    desc = (a, b, sortBy) => {
        if (b[sortBy] < a[sortBy]) {
            return -1;
        }
        if (b[sortBy] > a[sortBy]) {
            return 1;
        }
        return 0;
    }

    stableSort = (array, cmp) => {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = cmp(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map(el => el[0]);
    }

    getEvents() {
        const { events } = this.props;
        // prune the events and reformat
        this.gameEvents = events.map((value) => {
            let gameEvent = value.returnValues;
            gameEvent.transactionHash = value.transactionHash;
            //gameEvent.serial = ++serial;
            gameEvent.logID = value.id;
            //gameEvent.timeStamp = new Date(parseInt(gameEvent.timeSecs) * 1000).toLocaleString();
            switch (value.event) {

                case "logCompleteRound":
                    gameEvent.notification = `Round ${gameEvent.roundNumber} of Game: ${gameEvent.gameID} has completed. Winners will be announced soon.`;
                    break;

                case "logGameLocked":
                    gameEvent.notification = `Game: ${gameEvent.gameID} has been locked by Admin and will resume soon. Meanwhile all your funds are safe.`;
                    break;
            }

            return gameEvent;
        });
    }

    componentDidUpdate() {
        console.log("inside componentDidUpdate ::::::::::::::::::::::::::::::::::::::::::::: ");

    }

    /* shouldComponentUpdate(nextProps, nextState) {
        console.log("************** inside shouldcomponentupdate ((((((((((((((((((((((( ");
        console.log("this props: ", this.props.events.length, " next props: ", nextProps.events.length);
        console.log("expression: ", (this.props.events.length != nextProps.events.length ||
            this.state.sortBy != nextState.sortBy ||
            this.state.sortDirection != nextState.sortDirection));

        if (this.props.events.length != nextProps.events.length ||
            this.state.sortBy != nextState.sortBy ||
            this.state.sortDirection != nextState.sortDirection) {
            this.flag = true;
            return true;
        }
        else {
            if (this.flag) {
                console.log("inside if");
                this.flag = false;
                this.getEvents();
                return true;
            }
            return false;
        }
    } */


    shouldComponentUpdate(nextProps, nextState) {
        console.log("************** inside shouldcomponentupdate ((((((((((((((((((((((( ");
        console.log("this props: ", this.props.events.length, " next props: ", nextProps.events.length);
        console.log("expression: ", (this.props.events.length != nextProps.events.length ||
            this.state.sortBy != nextState.sortBy ||
            this.state.sortDirection != nextState.sortDirection));

        if (this.props.events.length != nextProps.events.length ||
            this.state.sortBy != nextState.sortBy ||
            this.state.sortDirection != nextState.sortDirection) {
            return true;
        }
        else {
            return false;
        }
    }

    render() {
        console.log("inside gamenotifications");
        let sortBy = this.state.sortBy;
        let sortDirection = this.state.sortDirection;
        const { classes } = this.props;
        this.getEvents();
        this.sortList({ sortBy, sortDirection });

        console.log("gameevents: ", this.gameEvents);
        console.log("fn;;;;;;;;s  sortby: ", sortBy, " sort Direction: ", sortDirection);
        console.log("fn;;;;;;;;s  sortby: ", this.state.sortBy, " sort Direction: ", this.state.sortDirection);

        return (
            <div className={classes.root}>
                <div className={classes.transPanel}>{this.gameEvents.length > 0 ? <p>Game Notifications</p> : <p>Game Notifications (empty)</p>}</div>
                <div className={classes.tableContainer}>
                    <AutoSizer>
                        {({ height, width }) => (
                            <Table
                                className={classes.table}
                                height={height}
                                width={width}
                                headerHeight={50}
                                rowHeight={50}
                                rowClassName={this.getRowClassName}
                                headerClassName={classes.headerColumn}
                                noRowsRenderer={this.noRowsRenderer}
                                overscanRowCount={10}
                                rowCount={this.gameEvents.length}
                                rowGetter={({ index }) => this.gameEvents[index]}
                                onRowClick={event => console.log(event)}
                                onRequestSort={this.handleRequestSort}
                                sortBy={sortBy}
                                sortDirection={sortDirection}
                                sort={this.sort}
                            >
                                <Column
                                    width={100}
                                    flexGrow={1.0}
                                    label="Time"
                                    dataKey="timeSecs"
                                    cellDataGetter={({ rowData }) => {
                                        let timestamp = new Date(parseInt(rowData.timeSecs) * 1000).toLocaleString();
                                        //let timestamp = ;
                                        console.log("rowdata: ", timestamp);
                                        return (timestamp);
                                    }}
                                />
                                <Column
                                    width={250}
                                    flexGrow={1.0}
                                    label="Notification"
                                    dataKey="notification"
                                />
                            </Table>
                        )}
                    </AutoSizer>
                </div>
            </div>
        );
    }


}

export default withStyles(styles)(GameNotifications);