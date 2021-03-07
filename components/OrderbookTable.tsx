import { useEffect } from 'react';

import { DeltaType } from '../lib/constants';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import PriceRow from './PriceRow';

interface IProps {
  deltaType: DeltaType;
  orders: [];
}

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  rowColor: {
    backgroundColor: 'blue',
    width: '40%',
  },
});

const OrderbookTable = (props: IProps) => {
  const classes = useStyles();
  const { orders } = props;

  const updatedOrders = [...orders].sort();
  let total = 0;
  updatedOrders.forEach((order) => {
    total += order[1];
    order[2] = total;
  });

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>PRICE</TableCell>
            <TableCell align="right">SIZE</TableCell>
            <TableCell align="right">TOTAL</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {updatedOrders.reverse().map((order) => {
            return (
              <TableRow key={`${order[0]}-${order[1]}`}>
                <TableCell component="th" scope="row">
                  {order[0]}
                </TableCell>
                <TableCell align="right">{order[1]}</TableCell>
                <TableCell align="right">{order[2]}</TableCell>
                <span className={classes.rowColor}></span>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderbookTable;
