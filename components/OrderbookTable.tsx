import { Fragment } from 'react';
import { DeltaType } from '../lib/constants';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import OrderRow from './OrderRow';

interface IProps {
  deltaType: DeltaType;
  orders: [];
}

const OrderbookTable = (props: IProps) => {
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
    <TableContainer component={Paper}>
      <Table aria-label={`Orderbook - ${props.deltaType}`}>
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
          {updatedOrders.map((order) => {
            return (
              <OrderRow
                price={order[0].toFixed(2).toLocaleString()}
                size={order[1].toLocaleString()}
                total={order[2].toLocaleString()}
                deltaType={deltaType}
                calculate={order[3]}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderbookTable;
