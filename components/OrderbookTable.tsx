import { Fragment } from 'react';
import { makeStyles, withStyles, createStyles } from '@material-ui/core/styles';
import { DeltaType } from '../lib/constants';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import OrderRow from './OrderRow';
import SkeletonRow from './SkeletonRow';
import GavelIcon from '@material-ui/icons/Gavel';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';

interface IProps {
  deltaType: DeltaType;
  orders: [];
}

const useStyles = makeStyles({
  table: {
    minWidth: 350,
  },
  tableHeader: {
    width: '100%',
    textAlign: 'center',
  },
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 500,
  },
  tableHeaderWrapper: {
    display: 'flex',
  },
});

const StyledTableCell = withStyles((theme: Theme) =>
  createStyles({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  })
)(TableCell);

const OrderbookTable = (props: IProps): JSX.Element => {
  const classes = useStyles();
  const { orders, deltaType } = props;

  // Create a copy of the orders prop, then ensure the prices are sorted
  const updatedOrders =
    deltaType === DeltaType.BIDS
      ? [...orders].sort().reverse()
      : [...orders].sort();

  // Calculate the total and assign the "current total" to the appropriate order
  let total = 0;
  updatedOrders.forEach((order: [number, number, number?]) => {
    total += order[1];
    order[2] = total;
  });

  // Calculate the horizontal bars
  updatedOrders.forEach((order: [number, number, number?, number?]) => {
    order[3] = (order[2] / total) * 100;
  });

  const rows = [
    (align: boolean) => (
      <Tooltip title={`Price for ${deltaType}`} arrow placement="top-start">
        <StyledTableCell align={align ? 'right' : 'inherit'}>
          PRICE
        </StyledTableCell>
      </Tooltip>
    ),
    (align: boolean) => (
      <Tooltip title={`Size for ${deltaType}`} arrow placement="top-start">
        <StyledTableCell align={align ? 'right' : 'inherit'}>
          SIZE
        </StyledTableCell>
      </Tooltip>
    ),
    (align: boolean) => (
      <Tooltip title={`Total for ${deltaType}`} arrow placement="top-start">
        <StyledTableCell align={align ? 'right' : 'inherit'}>
          TOTAL
        </StyledTableCell>
      </Tooltip>
    ),
  ];

  return (
    <div>
      <Typography className={classes.tableHeader} variant="h6" gutterBottom>
        {deltaType === DeltaType.ASKS ? 'Asks' : 'Bids'}
      </Typography>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table
            stickyHeader
            className={classes.table}
            aria-label={`Orderbook - ${props.deltaType}`}
          >
            <TableHead>
              <TableRow>
                {deltaType === DeltaType.BIDS
                  ? rows.map((component, index) => component(index !== 0))
                  : rows
                      .reverse()
                      .map((component, index) => component(index !== 0))}
              </TableRow>
            </TableHead>
            <TableBody data-spec="orderbook-table-body">
              {updatedOrders.length > 0
                ? updatedOrders.map(
                    (order: [number, number, number, number]) => {
                      return (
                        <OrderRow
                          key={order[0]}
                          price={order[0].toFixed(2).toLocaleString()}
                          size={order[1].toLocaleString()}
                          total={order[2].toLocaleString()}
                          deltaType={deltaType}
                          calculate={order[3]}
                        />
                      );
                    }
                  )
                : [...Array(9)].map((index) => <SkeletonRow key={index} />)}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default OrderbookTable;
