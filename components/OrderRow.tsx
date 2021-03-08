import { Fragment } from 'react';

import { DeltaType } from '../lib/constants';

import { makeStyles } from '@material-ui/core/styles';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

interface IProps {
  price: string;
  size: string;
  total: string;
  deltaType: DeltaType;
  calculate: number;
}

interface StyledProps {
  deltaType: DeltaType;
  calculate: number;
}

const useStyles = makeStyles({
  tr: (props: StyledProps) => ({
    background: `linear-gradient(${
      props.deltaType === DeltaType.ASKS
        ? `90deg, #492631 ${props.calculate}%, transparent 0`
        : `270deg, #163E2D ${props.calculate}%, transparent 0`
    })`,
    '&:hover': {
      background: 'none',
    },
  }),
  totalTc: (props: StyledProps) => ({
    color: `${props.deltaType === DeltaType.ASKS ? '#FA5868' : '#218775'}`,
  }),
});

const PriceRow = (props: IProps) => {
  const { price, size, total, deltaType, calculate } = props;
  const classes = useStyles({ deltaType, calculate });

  return (
    <TableRow className={classes.tr} hover>
      {deltaType === DeltaType.BIDS && (
        <Fragment>
          <TableCell component="th" scope="row">
            {price}
          </TableCell>
          <TableCell align="right">{size}</TableCell>
          <TableCell align="right" className={classes.totalTc}>
            {total}
          </TableCell>
        </Fragment>
      )}
      {deltaType === DeltaType.ASKS && (
        <Fragment>
          <TableCell component="th" className={classes.totalTc}>
            {total}
          </TableCell>
          <TableCell align="right">{size}</TableCell>
          <TableCell align="right" scope="row">
            {price}
          </TableCell>
        </Fragment>
      )}
    </TableRow>
  );
};

export default PriceRow;
