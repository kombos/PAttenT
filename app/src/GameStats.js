import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { Tooltip } from '@material-ui/core';
import { AutoSizer, Column, SortDirection, Table } from 'react-virtualized';
import { DrizzleContext } from 'drizzle-react';
import { ADDRESS_HASH_URL as HASH_URL } from './Constants';

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

});


class GameStats extends React.Component {
    static contextType = DrizzleContext.Consumer;

    constructor(props, context) {
        super(props);
        this.context = context;
        const sortBy = 'serial';
        const sortDirection = SortDirection.ASC;
        this.state = { sortDirection: sortDirection, sortBy: sortBy };
        this.flag = true;
        // this.getData();
        // this.sortList({ sortBy, sortDirection });
    }

    getRowClassName = ({ index }) => {
        const { classes } = this.props;

        return classNames(classes.tableRow, classes.flexContainer,
            { [classes.tableRowHover]: index !== -1 });
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
        const sortedData = this.stableSort(this.playersData, cmp);
        console.log('sortedData: ', sortedData);
        this.playersData = sortedData;
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
            <a href={HASH_URL + rowData.player}>{rowData.player}</a>
        );
    }

    getData() {
        console.log('inside getData  ');

        const { roundData } = this.props;
        console.log('roundata inside gamestats: ', roundData);
        const playerList = roundData.value._playerList;
        const playerTokensList = roundData.value._playerTokensList;
        this.playersData = [];
        for (let i = 0; i < playerList.length; i += 1) {
            this.playersData.push({
                serial: i + 1,
                player: playerList[i],
                tokens: parseInt(playerTokensList[i], 10),
            });
        }
    }

    componentDidUpdate() {
        console.log('inside componentDidUpdate ::::::::::::::::::::::::::::::::::::::::::::: ');
    }

    /* shouldComponentUpdate(nextthis.Props, nextState) {
        console.log("************** inside shouldcomponentupdate ((((((((((((((((((((((( ");
        console.log("this this.props: ", this.props.events.length, " next this.props: ", nextthis.Props.events.length);
        console.log("expression: ", (this.props.events.length != nextthis.Props.events.length ||
            this.state.sortBy != nextState.sortBy ||
            this.state.sortDirection != nextState.sortDirection));

        if (this.props.events.length != nextthis.Props.events.length ||
            this.state.sortBy != nextState.sortBy ||
            this.state.sortDirection != nextState.sortDirection) {
            this.flag = true;
            return true;
        }
        else {
            if (this.flag) {
                console.log("inside if");
                this.flag = false;
                this.getData();
                return true;
            }
            return false;
        }
    } */


    render() {
        console.log('inside gamenotifications');
        const sortBy = this.state.sortBy;
        const sortDirection = this.state.sortDirection;
        const { classes } = this.props;
        this.getData();
        this.sortList({ sortBy, sortDirection });

        console.log('playersData: ', this.playersData);
        console.log('fn;;;;;;;;s  sortby: ', sortBy, ' sort Direction: ', sortDirection);
        console.log('fn;;;;;;;;s  sortby: ', this.state.sortBy, ' sort Direction: ', this.state.sortDirection);

        return (
            <Tooltip title="Token Purchase Stats">
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
                                rowCount={this.playersData.length}
                                rowGetter={({ index }) => this.playersData[index]}
                                onRowClick={event => console.log(event)}
                                onRequestSort={this.handleRequestSort}
                                sortBy={sortBy}
                                sortDirection={sortDirection}
                                sort={this.sort}
                            >
                                <Column
                                    width={60}
                                    label="Serial"
                                    dataKey="serial"
                                    flexGrow={1}
                                />
                                <Column
                                    width={150}
                                    flexGrow={1}
                                    label="Player"
                                    dataKey="player"
                                    cellRenderer={this.addressRenderer}
                                    className={classes.trimmable}
                                />
                                <Column
                                    width={70}
                                    flexGrow={2}
                                    label="Total Tokens"
                                    dataKey="tokens"
                                />
                            </Table>
                        )}
                    </AutoSizer>
                </div>
            </Tooltip>

        );
    }
}

export default withStyles(styles)(GameStats);
