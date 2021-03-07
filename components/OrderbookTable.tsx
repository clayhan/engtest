import { PriceType } from '../lib/constants';

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
  priceType: string;
  prices: [];
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
  const { prices } = props;

  let total = 0;

  prices.forEach((price) => {
    total += price[1];
    price[2] = total;
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
          {prices.reverse().map((price) => (
            <TableRow key={price[0]}>
              <TableCell component="th" scope="row">
                {price[0]}
              </TableCell>
              <TableCell align="right">{price[1]}</TableCell>
              <TableCell align="right">{price[2]}</TableCell>
              <span className={classes.rowColor}></span>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderbookTable;
