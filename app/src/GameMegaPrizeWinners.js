import React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { AutoSizer, Column, SortDirection, Table } from 'react-virtualized';
import { DrizzleContext } from 'drizzle-react';
import { TX_HASH_URL_ROPSTEN as HASH_URL } from './Constants';

const styles = theme => ({
    root: {
        // padding: theme.spacing.unit * 0.5,
        margin: '0.75rem 0.75rem 0.75rem 0.75rem',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 auto',
        height: 'auto',
        backgroundColor: 'rgba(0,0,0,0.69)',
        justifyContent: 'center',
    },
    transPanel: {
        color: theme.palette.primary.light,
        fontWeight: 'bold',
        flex: '1 1 auto',
        justifyContent: 'center',
        // backgroundColor: "rgba(100,0,0,0.69)",
        boxSizing: 'border-box',
        maxHeight: '2.5em',
        width: '100%',
        margin: 'auto',
        // margin: '0.5rem auto 0.5rem auto',
        // borderRadius: theme.shape.borderRadius * 2,
        // paddingTop: theme.spacing.unit * 0.05,
        // paddingBottom: theme.spacing.unit * 0.05,
        // paddingBottom: '0.02rem',
    },
    tableContainer: {
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


class GameMegaPrizeWinners extends React.Component {
    static contextType = DrizzleContext.Consumer;

    constructor(props, context) {
        super(props);
        this.context = context;
        const sortBy = 'megaPrizeNumber';
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
        console.log('expression: ', (this.props.events.length !== nextProps.events.length
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
            <a href={HASH_URL + rowData.transactionHash}>{rowData.megaPrizeWinner}</a>
        );
    }

    getEvents() {
        const { events } = this.props;
        const web3 = this.context.drizzle.web3;

        /*  let events = [{
             transactionHash: "0x7d9595634ec6220edb993b5f4fc283671615e14923551aac71e81ea23f945308",
             id: "log_dcf38a3b",
             returnValues: {
                 megaPrizeNumber: "10",
                 megaPrizeWinner: "0xd0D6a7C5B920737666bbD2027420aA260F7Fb8C1",
                 winnerAmount: 50000000000000000,
                 timeSecs: "1551180548",
                 roundNumber: "2"
             }
         },
         {
             transactionHash: "0x8d9595634ec6220edb993b5f4fc283671615e14923551aac71e81ea23f945308",
             id: "log_dcf88a3b",
             returnValues: {
                 megaPrizeNumber: "11",
                 megaPrizeWinner: "0xb0D6a7C5B920737666bbD2027420aA260F7Fb8C1",
                 winnerAmount: 5000000000000000,
                 timeSecs: "1651180548",
                 roundNumber: "4"
             }
         }]; */

        // prune the events and reformat
        this.gameEvents = events.map((value) => {
            const gameEvent = value.returnValues;
            gameEvent.transactionHash = value.transactionHash;
            gameEvent.logID = value.id;
            // gameEvent.megaPrizeWinner
            gameEvent.prize = parseFloat(web3.utils.fromWei((value.returnValues.winnerAmount).toString(), 'ether'));
            gameEvent.megaPrizeNumber = parseInt(value.returnValues.megaPrizeNumber, 10);

            return gameEvent;
        });
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
            <div className={classes.root}>
                <div className={classes.transPanel}>{this.gameEvents.length > 0 ? <p>Megaprize Winners</p> : <p>Megaprize Winners (empty)</p>}</div>
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
                                    width={90}
                                    flexGrow={1}
                                    label="MP No."
                                    dataKey="megaPrizeNumber"
                                />
                                <Column
                                    width={180}
                                    flexGrow={2}
                                    label="Winner"
                                    dataKey="megaPrizeWinner"
                                    cellRenderer={this.addressRenderer}
                                    className={classes.trimmable}
                                />
                                <Column
                                    width={120}
                                    flexGrow={2}
                                    label="Prize (eth)"
                                    dataKey="prize"
                                />
                            </Table>
                        )}
                    </AutoSizer>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(GameMegaPrizeWinners);
