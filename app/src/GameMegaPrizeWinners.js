import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import { AutoSizer, Column, SortDirection, Table } from 'react-virtualized';
import { DrizzleContext } from 'drizzle-react';

const styles = theme => ({
    root: {
        //padding: theme.spacing.unit * 0.5,
        margin: '0.75rem 0.75rem 0.75rem 0.75rem',
        boxSizing: 'border-box',
        flex: '1 1 auto',
        //height:'auto',
        backgroundColor: "rgba(0,0,0,0.69)",
    },
    transPanel: {
        color: theme.palette.primary.light,
        fontWeight: 'bold',
        //alignItems: 'center',
        flexGrow: 1,
        //backgroundColor: "rgba(0,0,0,0.69)",
        boxSizing: 'border-box',
        height: 'auto',
        width: '75%',
        margin: 'auto',
        //margin: '0.5rem auto 0.5rem auto',
        /* borderRadius: theme.shape.borderRadius * 2,
        paddingTop: theme.spacing.unit * 0.05,
        paddingBottom: theme.spacing.unit * 0.05, */
    },
    tableContainer: {
        backgroundColor: theme.palette.grey[50],
        height: 400,
    },
    table: {
        fontFamily: theme.typography.fontFamily,
    },
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
    },
    tableRow: {
        cursor: 'pointer',
    },
    tableRowHover: {
        '&:hover': {
            backgroundColor: theme.palette.grey[200],
        },
    },
    tableCell: {
        flex: 1,
    },
    noClick: {
        cursor: 'initial',
    },
});

class MuiVirtualizedTable extends React.PureComponent {

    getRowClassName = ({ index }) => {
        const { classes, rowClassName, onRowClick } = this.props;

        return classNames(classes.tableRow, classes.flexContainer, rowClassName, {
            [classes.tableRowHover]: index !== -1 && onRowClick != null,
        });
    };

    createSortHandler = property => event => {
        console.log("inside lower level createsorthandler .. property: ", property);
        const { onRequestSort } = this.props;
        //console.log("onRequestSort: ", onRequestSort);
        onRequestSort(event, property);
    };

    sortRenderer = (sortObj) => {
        console.log("sortObj:::: ", sortObj);
        console.log("inside sort function of lower leveL");
        console.log("lower level sortby: ", sortObj.sortBy, " sortdirection: ", sortObj.sortDirection, " default: ", sortObj.defaultSortDirection);
        const { sort } = this.props;
        sort(sortObj.sortBy, sortObj.sortDirection);
    }

    cellRenderer = ({ cellData, columnIndex = null }) => {
        const { columns, classes, rowHeight, onRowClick } = this.props;
        return (
            <TableCell
                component="div"
                className={classNames(classes.tableCell, classes.flexContainer,
                    { [classes.noClick]: onRowClick == null, }
                )}
                variant="body"
                style={{ height: rowHeight }}
                //align={(columns[columnIndex] && columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
                align={'left'}
            >
                {cellData}
            </TableCell>
        );
    };

    headerRenderer = ({ label, columnIndex, dataKey, sortBy, sortDirection }) => {
        const { headerHeight, columns, classes, sort } = this.props;
        const direction = {
            [SortDirection.ASC]: 'asc',
            [SortDirection.DESC]: 'desc',
        };

        const inner =
            !columns[columnIndex].disableSort && sort != null ? (
                <TableSortLabel
                    active={dataKey === sortBy}
                    direction={direction[sortDirection]}
                    onClick={this.createSortHandler(dataKey)}
                >
                    {label}
                </TableSortLabel>
            ) : (
                    label
                );

        return (
            <TableCell
                component="div"
                className={classNames(classes.tableCell, classes.flexContainer, classes.noClick)}
                variant="head"
                style={{ height: headerHeight }}
                //align={columns[columnIndex].numeric || false ? 'right' : 'left'}
                align={'left'}
            >
                {inner}
            </TableCell>
        );
    };

    render() {
        const { classes, columns, sortBy, sortDirection, ...tableProps } = this.props;
        console.log("inside MuiVirtualizedTable render. sortby: ", sortBy, " and sortDirection: ", sortDirection);
        return (
            <AutoSizer>
                {({ height, width }) => (
                    <Table
                        className={classes.table}
                        height={height}
                        width={width}
                        {...tableProps}
                        rowClassName={this.getRowClassName}
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        sort={this.sortRenderer}
                    >

                        {columns.map(({ cellContentRenderer = null, className, dataKey, ...other }, index) => {
                            let renderer;
                            if (cellContentRenderer != null) {
                                renderer = cellRendererProps =>
                                    this.cellRenderer({
                                        cellData: cellContentRenderer(cellRendererProps),
                                        columnIndex: index,
                                    });
                            } else {
                                renderer = this.cellRenderer;
                            }

                            return (
                                <Column
                                    key={dataKey}
                                    headerRenderer={headerProps =>
                                        this.headerRenderer({
                                            ...headerProps,
                                            columnIndex: index,
                                        })
                                    }
                                    className={classNames(classes.flexContainer, className)}
                                    cellRenderer={renderer}
                                    dataKey={dataKey}
                                    {...other}
                                />
                            );
                        })}
                    </Table>
                )}
            </AutoSizer>
        );
    }
}

MuiVirtualizedTable.propTypes = {
    classes: PropTypes.object.isRequired,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            cellContentRenderer: PropTypes.func,
            dataKey: PropTypes.string.isRequired,
            width: PropTypes.number.isRequired,
        }),
    ).isRequired,
    headerHeight: PropTypes.number,
    onRowClick: PropTypes.func,
    rowClassName: PropTypes.string,
    rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
    sort: PropTypes.func,
    sortBy: PropTypes.string,

};

MuiVirtualizedTable.defaultProps = {
    headerHeight: 56,
    rowHeight: 56,
};

const WrappedVirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

class GameMegaPrizeWinners extends React.Component {
    static contextType = DrizzleContext.Consumer;

    constructor(props, context) {
        super(props);
        this.state = { sortDirection: SortDirection.DESC, sortBy: 'megaPrizeNumber' };
        this.context = context;
    }

    handleRequestSort = (event, property) => {
        let sortBy = this.state.sortBy;
        let sortDirection = this.state.sortDirection;
        console.log("handlerequestsort() :: sortby: ", sortBy, " sort Direction: ", sortDirection, "  and property: ", property);
        const isAsc = sortBy === property && sortDirection === SortDirection.DESC;
        console.log("isAsc: ", isAsc);
        this.setState({
            sortDirection: (sortDirection == SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC),
            sortBy: property
        });
    }

    handleSort = (sortBy, sortDirection) => {
        console.log("inside handlesort() :: sortby: ", sortBy, " sortdirection: ", sortDirection);

        const cmp = sortDirection === SortDirection.DESC ? (a, b) => this.desc(a, b, sortBy) : (a, b) => -this.desc(a, b, sortBy);
        const sortedData = this.stableSort(this.gameEvents, cmp);
        //const tempData = _.sortBy(data, item => item[sortBy]);
        console.log("sortedData: ", sortedData);
        //const orderedData = sortDirection === SortDirection.DESC ? tempList.reverse() : tempList
        //this.setState({ sortBy, sortDirection, sortedList });
        //setData(sortedData);
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

    shouldComponentUpdate(nextProps, nextState) {
        console.log("************** inside shouldcomponentupdate ((((((((((((((((((((((( ");
        console.log("this props: ", this.props.events.length, " next props: ", nextProps.events.length);
        console.log("expression: ", (this.props.events.length != nextProps.events.length))
        if (this.props.events.length != nextProps.events.length ||
            this.state.sortBy != nextState.sortBy ||
            this.state.sortDirection != nextState.sortDirection)
            return true;
        else
            return false;
    }

    render() {
        console.log("inside megaprizewinners");
        let sortBy = this.state.sortBy;
        let sortDirection = this.state.sortDirection;
        const web3 = this.context.drizzle.web3;
        const { events, classes } = this.props;
        //const { classes } = this.props;

        /* let events = [{
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
        let serial = 0;
        this.gameEvents = events.map((value, index) => {
            let gameEvent = value.returnValues;
            gameEvent.transactionHash = value.transactionHash;
            gameEvent.serial = ++serial;
            gameEvent.logID = value.id;
            gameEvent.timeStamp = new Date(parseInt(gameEvent.timeSecs) * 1000).toLocaleString();
            gameEvent.playerAddressAbbr = value.returnValues.megaPrizeWinner.toString().substr(0, 12) + "..";
            //gameEvent.prize = (web3.utils.fromWei((value.returnValues.megaPrizeAmount).toString(), 'ether') + " eth");
            gameEvent.prize = parseFloat(web3.utils.fromWei((value.returnValues.winnerAmount).toString(), 'ether'))
            gameEvent.megaPrizeNumber = parseInt(value.returnValues.megaPrizeNumber);

            return gameEvent;
        });

        console.log("fn;;;;;;;;s  sortby: ", sortBy, " sort Direction: ", sortDirection);
        this.handleSort(sortBy, sortDirection);

        return (
            <div className={classes.root}>
                <div className={classes.transPanel}>{this.gameEvents.length > 0 ? <p>MegaPrize Winners</p> : <p>MegaPrize Winners (empty)</p>}</div>
                <div className={classes.tableContainer}>
                    <WrappedVirtualizedTable
                        rowCount={this.gameEvents.length}
                        rowGetter={({ index }) => this.gameEvents[index]}
                        onRowClick={event => console.log(event)}
                        onRequestSort={this.handleRequestSort}
                        sortBy={sortBy}
                        sortDirection={sortDirection}
                        sort={this.handleSort}
                        columns={[
                            {
                                width: 80,
                                flexGrow: 1.0,
                                label: 'MP No.',
                                dataKey: 'megaPrizeNumber',
                                numeric: true,
                            },
                            {
                                width: 180,
                                flexGrow: 2.0,
                                label: 'Winner',
                                dataKey: 'playerAddressAbbr',
                            },
                            {
                                width: 180,
                                flexGrow: 3.0,
                                label: 'Prize Won',
                                dataKey: 'prize',
                                numeric: true,
                            },
                        ]}
                    />
                </div>
            </div>
        );
    }


}

export default withStyles(styles)(GameMegaPrizeWinners);