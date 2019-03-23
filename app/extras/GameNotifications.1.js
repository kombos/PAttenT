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
        //padding: theme.spacing.unit * 0.5,
        margin: '0.75rem 0.75rem 0.75rem 0.75rem',
        boxSizing: 'border-box',
        display: 'flex',
        flex: '1 1 auto',
        //height:'auto',
        backgroundColor: "rgba(0,0,0,0.69)",
    },
    transPanel: {
        color: theme.palette.primary.light,
        fontWeight: 'bold',
        flexGrow: 1,
        //backgroundColor: "rgba(100,0,0,0.69)",
        boxSizing: 'border-box',
        height: 'auto',
        width: '75%',
        margin: 'auto',
        //margin: '0.5rem auto 0.5rem auto',
        //borderRadius: theme.shape.borderRadius * 2,
        //paddingTop: theme.spacing.unit * 0.05,
        //paddingBottom: theme.spacing.unit * 0.05,
        //paddingBottom: '0.02rem',
    },
    tableContainer: {
        backgroundColor: theme.palette.grey[50],
        //height: 400,
        //margin: '0rem auto auto auto',
        flex: '1 1 auto',
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





































/** @flow */
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import * as React from 'react';
import {
  ContentBox,
  ContentBoxHeader,
  ContentBoxParagraph,
} from '../demo/ContentBox';
import {LabeledInput, InputRow} from '../demo/LabeledInput';
import AutoSizer from '../AutoSizer';
import Column from './Column';
import Table from './Table';
import SortDirection from './SortDirection';
import SortIndicator from './SortIndicator';
import styles from './Table.example.css';

export default class TableExample extends React.PureComponent {
  static contextTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired,
  };

  constructor(props, context) {
    super(props, context);

    const sortBy = 'index';
    const sortDirection = SortDirection.ASC;
    const sortedList = this._sortList({sortBy, sortDirection});

    this.state = {
      disableHeader: false,
      headerHeight: 30,
      height: 270,
      hideIndexRow: false,
      overscanRowCount: 10,
      rowHeight: 40,
      rowCount: 1000,
      scrollToIndex: undefined,
      sortBy,
      sortDirection,
      sortedList,
      useDynamicRowHeight: false,
    };

    this._getRowHeight = this._getRowHeight.bind(this);
    this._headerRenderer = this._headerRenderer.bind(this);
    this._noRowsRenderer = this._noRowsRenderer.bind(this);
    this._onRowCountChange = this._onRowCountChange.bind(this);
    this._onScrollToRowChange = this._onScrollToRowChange.bind(this);
    this._rowClassName = this._rowClassName.bind(this);
    this._sort = this._sort.bind(this);
  }

  render() {
    const {
      disableHeader,
      headerHeight,
      height,
      hideIndexRow,
      overscanRowCount,
      rowHeight,
      rowCount,
      scrollToIndex,
      sortBy,
      sortDirection,
      sortedList,
      useDynamicRowHeight,
    } = this.state;

    const rowGetter = ({index}) => this._getDatum(sortedList, index);

    return (
      <ContentBox>
        


        <ContentBoxParagraph>
          <label className={styles.checkboxLabel}>
            <input
              aria-label="Use dynamic row heights?"
              checked={useDynamicRowHeight}
              className={styles.checkbox}
              type="checkbox"
              onChange={event =>
                this._updateUseDynamicRowHeight(event.target.checked)
              }
            />
            Use dynamic row heights?
          </label>

          <label className={styles.checkboxLabel}>
            <input
              aria-label="Hide index?"
              checked={hideIndexRow}
              className={styles.checkbox}
              type="checkbox"
              onChange={event =>
                this.setState({hideIndexRow: event.target.checked})
              }
            />
            Hide index?
          </label>

          <label className={styles.checkboxLabel}>
            <input
              aria-label="Hide header?"
              checked={disableHeader}
              className={styles.checkbox}
              type="checkbox"
              onChange={event =>
                this.setState({disableHeader: event.target.checked})
              }
            />
            Hide header?
          </label>
        </ContentBoxParagraph>

        <InputRow>
          <LabeledInput
            label="Num rows"
            name="rowCount"
            onChange={this._onRowCountChange}
            value={rowCount}
          />
          <LabeledInput
            label="Scroll to"
            name="onScrollToRow"
            placeholder="Index..."
            onChange={this._onScrollToRowChange}
            value={scrollToIndex || ''}
          />
          <LabeledInput
            label="List height"
            name="height"
            onChange={event =>
              this.setState({height: parseInt(event.target.value, 10) || 1})
            }
            value={height}
          />
          <LabeledInput
            disabled={useDynamicRowHeight}
            label="Row height"
            name="rowHeight"
            onChange={event =>
              this.setState({
                rowHeight: parseInt(event.target.value, 10) || 1,
              })
            }
            value={rowHeight}
          />
          <LabeledInput
            label="Header height"
            name="headerHeight"
            onChange={event =>
              this.setState({
                headerHeight: parseInt(event.target.value, 10) || 1,
              })
            }
            value={headerHeight}
          />
          <LabeledInput
            label="Overscan"
            name="overscanRowCount"
            onChange={event =>
              this.setState({
                overscanRowCount: parseInt(event.target.value, 10) || 0,
              })
            }
            value={overscanRowCount}
          />
        </InputRow>

        <div>
          <AutoSizer disableHeight>
            {({width}) => (
              <Table
                ref="Table"
                disableHeader={disableHeader}
                headerClassName={styles.headerColumn}
                headerHeight={headerHeight}
                height={height}
                noRowsRenderer={this._noRowsRenderer}
                overscanRowCount={overscanRowCount}
                rowClassName={this._rowClassName}
                rowHeight={useDynamicRowHeight ? this._getRowHeight : rowHeight}
                rowGetter={rowGetter}
                rowCount={rowCount}
                scrollToIndex={scrollToIndex}
                sort={this._sort}
                sortBy={sortBy}
                sortDirection={sortDirection}
                width={width}>
                {!hideIndexRow && (
                  <Column
                    label="Index"
                    cellDataGetter={({rowData}) => rowData.index}
                    dataKey="index"
                    disableSort={!this._isSortEnabled()}
                    width={60}
                  />
                )}
                <Column
                  dataKey="name"
                  disableSort={!this._isSortEnabled()}
                  headerRenderer={this._headerRenderer}
                  width={90}
                />
                <Column
                  width={210}
                  disableSort
                  label="The description label is really long so that it will be truncated"
                  dataKey="random"
                  className={styles.exampleColumn}
                  cellRenderer={({cellData}) => cellData}
                  flexGrow={1}
                />
              </Table>
            )}
          </AutoSizer>
        </div>
      </ContentBox>
    );
  }

  _getDatum(list, index) {
    return list.get(index % list.size);
  }

  _getRowHeight({index}) {
    const {list} = this.context;

    return this._getDatum(list, index).size;
  }

  _headerRenderer({dataKey, sortBy, sortDirection}) {
    return (
      <div>
        Full Name
        {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
      </div>
    );
  }

  _isSortEnabled() {
    const {list} = this.context;
    const {rowCount} = this.state;

    return rowCount <= list.size;
  }

  _noRowsRenderer() {
    return <div className={styles.noRows}>No rows</div>;
  }

  _onRowCountChange(event) {
    const rowCount = parseInt(event.target.value, 10) || 0;

    this.setState({rowCount});
  }

  _onScrollToRowChange(event) {
    const {rowCount} = this.state;
    let scrollToIndex = Math.min(
      rowCount - 1,
      parseInt(event.target.value, 10),
    );

    if (isNaN(scrollToIndex)) {
      scrollToIndex = undefined;
    }

    this.setState({scrollToIndex});
  }

  _rowClassName({index}) {
    if (index < 0) {
      return styles.headerRow;
    } else {
      return index % 2 === 0 ? styles.evenRow : styles.oddRow;
    }
  }

  _sort({sortBy, sortDirection}) {
    const sortedList = this._sortList({sortBy, sortDirection});

    this.setState({sortBy, sortDirection, sortedList});
  }

  _sortList({sortBy, sortDirection}) {
    const {list} = this.context;

    return list
      .sortBy(item => item[sortBy])
      .update(
        list => (sortDirection === SortDirection.DESC ? list.reverse() : list),
      );
  }

  _updateUseDynamicRowHeight(value) {
    this.setState({
      useDynamicRowHeight: value,
    });
  }
}



























 





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


class GameNotifications extends React.Component {

    constructor(props) {
        super(props);
        this.state = { sortDirection: SortDirection.DESC, sortBy: 'timeStamp' };
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

    componentDidUpdate() {
        console.log("inside componentDidUpdate ::::::::::::::::::::::::::::::::::::::::::::: ");

    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log("************** inside shouldcomponentupdate ((((((((((((((((((((((( ");
        console.log("this props: ", this.props.events.length, " next props: ", nextProps.events.length);
        console.log("expression: ", (this.props.events.length != nextProps.events.length ||
            this.state.sortBy != nextState.sortBy ||
            this.state.sortDirection != nextState.sortDirection));
        if (this.props.events.length != nextProps.events.length ||
            this.state.sortBy != nextState.sortBy ||
            this.state.sortDirection != nextState.sortDirection)
            return true;
        else
            return false;
    }

    render() {
        console.log("inside gamenotifications");
        let sortBy = this.state.sortBy;
        let sortDirection = this.state.sortDirection;
        const { events, classes } = this.props;

        // prune the events and reformat
        let serial = 0;
        this.gameEvents = events.map((value, index) => {
            let gameEvent = value.returnValues;
            gameEvent.transactionHash = value.transactionHash;
            gameEvent.serial = ++serial;
            gameEvent.logID = value.id;
            gameEvent.timeStamp = new Date(parseInt(gameEvent.timeSecs) * 1000).toLocaleString();
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


        console.log("gameevents: ", this.gameEvents);
        console.log("fn;;;;;;;;s  sortby: ", sortBy, " sort Direction: ", sortDirection);
        console.log("fn;;;;;;;;s  sortby: ", this.state.sortBy, " sort Direction: ", this.state.sortDirection);
        this.handleSort(sortBy, sortDirection);

        return (
            <div className={classes.root}>
                <div className={classes.transPanel}>{this.gameEvents.length > 0 ? <p>Game Notifications</p> : <p>Game Notifications (empty)</p>}</div>
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
                                width: 100,
                                flexGrow: 1.0,
                                label: 'Time',
                                dataKey: 'timeStamp',
                            },
                            {
                                width: 250,
                                flexGrow: 1.0,
                                label: 'Notification',
                                dataKey: 'notification',
                            },
                        ]}
                    />
                </div>
            </div>
        );
    }


}

export default withStyles(styles)(GameNotifications);