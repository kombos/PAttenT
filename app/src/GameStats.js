import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import { AutoSizer, Column, SortDirection, Table } from 'react-virtualized';

const styles = theme => ({
    root: {
        margin: '0.75rem 0.75rem 0.75rem 0.75rem',
        boxSizing: 'border-box',
        flex: '1 1 auto',
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

    /* 
        sort = () => {
            console.log("inside sort function of upper leveL");
            const { sort } = this.props;
            sort();
        }
     */
    /* 
        sortRenderer = ({sortBy:sortBy, sortDirection:sortDirection}) => {
            console.log("inside sort function of lower leveL");
            console.log("lower level sortby: ", sortBy, " sortdirection: ", sortDirection);
            const { sort } = this.props;
            sort( sortBy, sortDirection );
        }
     */
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
                className={classNames(classes.tableCell, classes.flexContainer, {
                    [classes.noClick]: onRowClick == null,
                })}
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

function GameStats(props) {
    console.log("inside gamestats");

    const { roundData, roundNumber, classes } = props;
    console.log("roundata inside gamestats: ", roundData);
    const playerList = roundData.value["_playerList"];
    const playerTokensList = roundData.value["_playerTokensList"];
    var playersData = [];
    for (let i = 0; i < playerList.length; i += 1) {
        playersData.push({
            serial: i + 1,
            player: playerList[i],
            playerAddressAbbr: playerList[i].toString().substr(0, 12) + "..",
            tokens: playerTokensList[i]
        });
    }

    const [sortDirection, setSortDirection] = React.useState(SortDirection.ASC);
    const [sortBy, setSortBy] = React.useState('serial');
    //const [data, setData] = React.useState(playersData);
    handleSort(sortBy, sortDirection);
    console.log("fn;;;;;;;;s  sortby: ", sortBy, " sort Direction: ", sortDirection);
    console.log("state playersdata: ", playersData);
    //setData(playersData);
    //console.log("state playersdata (after): ", playersData);


    function handleRequestSort(event, property) {
        console.log("handlerequestsort() :: sortby: ", sortBy, " sort Direction: ", sortDirection, "  and property: ", property);
        const isAsc = sortBy === property && sortDirection === SortDirection.DESC;
        console.log("isAsc: ", isAsc);
        //setSortDirection(isAsc == true ? SortDirection.ASC : SortDirection.DESC);
        setSortDirection(sortDirection == SortDirection.DESC ? SortDirection.ASC : SortDirection.DESC);
        setSortBy(property);
    }

    function handleSort(sortBy, sortDirection) {
        console.log("inside handlesort() :: sortby: ", sortBy, " sortdirection: ", sortDirection);

        const cmp = sortDirection === SortDirection.DESC ? (a, b) => desc(a, b, sortBy) : (a, b) => -desc(a, b, sortBy);
        const sortedData = stableSort(playersData, cmp);
        //const tempData = _.sortBy(data, item => item[sortBy]);
        console.log("sortedData: ", sortedData);
        //const orderedData = sortDirection === SortDirection.DESC ? tempList.reverse() : tempList
        //this.setState({ sortBy, sortDirection, sortedList });
        //setData(sortedData);
        playersData = sortedData;
    }

    function desc(a, b, sortBy) {
        if (b[sortBy] < a[sortBy]) {
            return -1;
        }
        if (b[sortBy] > a[sortBy]) {
            return 1;
        }
        return 0;
    }

    function stableSort(array, cmp) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = cmp(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map(el => el[0]);
    }

    return (
        <div className={classes.root}>
            {/*  {playersData.length > 0 ? <p>Round {roundNumber} Tokens</p> : <p>Round {roundNumber} Tokens (empty)</p>} */}
                <WrappedVirtualizedTable
                    rowCount={playersData.length}
                    rowGetter={({ index }) => playersData[index]}
                    onRowClick={event => console.log(event)}
                    onRequestSort={handleRequestSort}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    sort={handleSort}
                    columns={[
                        {
                            width: 90,
                            flexGrow: 1.0,
                            label: 'Serial',
                            dataKey: 'serial',
                            numeric: true,
                        },
                        {
                            width: 180,
                            flexGrow: 2.0,
                            label: 'Player',
                            dataKey: 'playerAddressAbbr',
                        },
                        {
                            width: 80,
                            flexGrow: 1.0,
                            label: 'Tokens',
                            dataKey: 'tokens',
                            numeric: true,
                        },
                    ]}
                />
        </div>
    );
}

export default withStyles(styles)(GameStats);