import { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { DeltaType } from '../lib/constants';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import OrderRow from './OrderRow';
import SkeletonRow from './SkeletonRow';

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
});

const OrderbookTable = (props: IProps) => {
  const classes = useStyles();
  const { orders, deltaType } = props;

  const updatedOrders = [...orders].sort();
  let total = 0;
  updatedOrders.forEach((order: [number, number]) => {
    total += order[1];
    order[2] = total;
  });

  updatedOrders.forEach((order: [number, number]) => {
    order[3] = (order[2] / total) * 100;
  });

  return (
    <div>
      <Typography className={classes.tableHeader} variant="h6" gutterBottom>
        {deltaType === DeltaType.ASKS ? 'Asks' : 'Bids'}
      </Typography>
      <TableContainer component={Paper}>
        <Table
          className={classes.table}
          aria-label={`Orderbook - ${props.deltaType}`}
        >
          <TableHead>
            <TableRow>
              {deltaType === DeltaType.BIDS && (
                <Fragment>
                  <TableCell>PRICE</TableCell>
                  <TableCell align="right">SIZE</TableCell>
                  <TableCell align="right">TOTAL</TableCell>
                </Fragment>
              )}
              {deltaType === DeltaType.ASKS && (
                <Fragment>
                  <TableCell>TOTAL</TableCell>
                  <TableCell align="right">SIZE</TableCell>
                  <TableCell align="right">PRICE</TableCell>
                </Fragment>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {updatedOrders.length > 0
              ? updatedOrders.map((order) => {
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
                })
              : [...Array(10)].map(() => <SkeletonRow />)}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default OrderbookTable;
