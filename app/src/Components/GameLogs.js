import React from 'react';
import classNames from 'classnames';
import { Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { AutoSizer, Column, SortDirection, Table } from 'react-virtualized';
import { DrizzleContext } from 'drizzle-react';
import { TX_HASH_URL as HASH_URL } from '../Constants';

const styles = theme => ({
    tableContainer: {
        margin: '0.75rem 0.75rem 0.75rem 0.75rem',
        boxSizing: 'border-box',
        // backgroundImage: `url(${require(`./img/tableBG.jpg`)})`,
        // filter: 'opacity(30%)',
        // backgroundSize: 'cover',
        backgroundColor: theme.palette.grey[50],
        // margin: '0rem auto auto auto',
        flex: '1 1 auto',
        height: 400,
    },
    table: {
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.fontSize * 0.95,
        // fontWeight: theme.typography.fontWeightMedium,
    },
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
        alignContent: 'center',
    },
    tableRow: {
        cursor: 'pointer',
        textAlign: 'center',
        // margin: 'auto 1em auto auto',
        paddingLeft: '1em',
        paddingRight: '1em',
        borderBottom: '1px solid #e0e0e0',
        // wordBreak: 'break-all',
        // backgroundColor: theme.palette.grey[200],
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
    trimmable: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    revert: {
        color: '#FF0000',
    },

});


class GameLogs extends React.Component {
    static contextType = DrizzleContext.Consumer;

    constructor(props, context) {
        super(props);
        this.context = context;
        const sortBy = 'timeSecs';
        const sortDirection = SortDirection.DESC;
        this.state = { sortDirection: sortDirection, sortBy: sortBy };
        this.flag = true;
        // this.getEvents();
        // this.sortList({ sortBy, sortDirection });
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
        console.log('************** inside shouldcomponentupdate ((((((((((((((((((((((( ');
        console.log('this props: ', this.props.events.length, ' next props: ', nextProps.events.length);
        console.log('expression: ',
            (this.props.events.length !== nextProps.events.length
                || this.state.sortBy !== nextState.sortBy
                || this.state.sortDirection !== nextState.sortDirection));

        if (this.props.events.length !== nextProps.events.length
            || this.state.sortBy !== nextState.sortBy
            || this.state.sortDirection !== nextState.sortDirection) {
            return true;
        }
        return false;
    }

    componentDidUpdate() {
        console.log('inside componentDidUpdate ::::::::::::::::::::::::::::::::::::::::::::: ');
    }

    getEvents() {
        const { events } = this.props;
        console.log('events::: ', events);

        let serial = 0;
        // prune the events and reformat
        this.gameEvents = events.map((value) => {
            const gameEvent = value.returnValues;
            gameEvent.transactionHash = value.transactionHash;
            gameEvent.logID = value.id;
            serial += 1;
            gameEvent.serial = serial;
            gameEvent.action = (value.event === 'LogPlayGame');
            // gameEvent.timeSecs
            // gameEvent.playerAddress
            gameEvent.playerTokens = parseInt(value.returnValues.playerTokens, 10);
            return gameEvent;
        });
    }

    getRowClassName = ({ index }) => {
        console.log('gameevents::::: ', this.gameEvents, ' index: ', index);
        const { classes } = this.props;
        const flag = index >= 0 && !(this.gameEvents[index].action) ? 1 : 0;

        return classNames(classes.tableRow, classes.flexContainer,
            { [classes.tableRowHover]: index !== -1 },
            { [classes.revert]: flag > 0 });
    };

    noRowsRenderer = () => {
        const { classes } = this.props;
        return <div className={classes.noRows}>No rows</div>;
    }

    sort = ({ sortBy, sortDirection }) => {
        console.log('inside sort() :: sortby: ', sortBy, ' sortdirection: ', sortDirection);
        this.sortList({ sortBy, sortDirection });
        this.setState({
            sortDirection: sortDirection,
            sortBy: sortBy,
        });
    }

    sortList = ({ sortBy, sortDirection }) => {
        console.log('inside sort() :: sortby: ', sortBy, ' sortdirection: ', sortDirection);

        const cmp = sortDirection === SortDirection.DESC ? (a, b) => this.desc(a, b, sortBy) : (a, b) => -this.desc(a, b, sortBy);
        const sortedData = this.stableSort(this.gameEvents, cmp);
        console.log('sortedData: ', sortedData);
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

    addressRenderer = ({ rowData }) => {
        console.log('inside addressRenderer()');
        console.log('rowdata: ', rowData);
        return (
            <a href={HASH_URL + rowData.transactionHash}>{rowData.playerAddress}</a>
        );
    }

    actionRenderer = ({ rowData }) => {
        console.log('inside addressRenderer()');
        console.log('rowdata: ', rowData);
        return (
            <Tooltip title={rowData.action ? 'Tokens Bought' : 'Tokens Reverted'}>
                <span>{rowData.action ? '[+]' : '[-]'}</span>
            </Tooltip>
        );
    }

    render() {
        console.log('inside gamenotifications');
        const sortBy = this.state.sortBy;
        const sortDirection = this.state.sortDirection;
        const { classes } = this.props;
        this.getEvents();
        this.sortList({ sortBy, sortDirection });

        console.log('gameevents: ', this.gameEvents);
        console.log('fn;;;;;;;;s  sortby: ', sortBy, ' sort Direction: ', sortDirection);
        console.log('fn;;;;;;;;s  sortby: ', this.state.sortBy, ' sort Direction: ', this.state.sortDirection);

        return (
            <Tooltip title="Game Log">
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
                                    width={60}
                                    label="Action"
                                    dataKey="action"
                                    cellRenderer={this.actionRenderer}
                                    flexGrow={1}
                                />
                                <Column
                                    width={180}
                                    flexGrow={1}
                                    label="Player"
                                    dataKey="playerAddress"
                                    cellRenderer={this.addressRenderer}
                                    className={classes.trimmable}
                                />
                                <Column
                                    width={90}
                                    flexGrow={2}
                                    label="Tokens"
                                    dataKey="playerTokens"
                                />
                                <Column
                                    width={150}
                                    flexGrow={1}
                                    label="Purchase Time"
                                    dataKey="timeSecs"
                                    cellDataGetter={({ rowData }) => {
                                        const timestamp = new Date(parseInt(rowData.timeSecs, 10) * 1000).toLocaleString();
                                        // let timestamp = ;
                                        console.log('rowdata: ', timestamp);
                                        return (timestamp);
                                    }}
                                />
                            </Table>
                        )}
                    </AutoSizer>
                </div>
            </Tooltip>
        );
    }
}

export default withStyles(styles)(GameLogs);