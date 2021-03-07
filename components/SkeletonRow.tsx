import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Skeleton from '@material-ui/lab/Skeleton';

const SkeletonRow = () => {
  return (
    <TableRow>
      <TableCell component="th" scope="row">
        <Skeleton />
      </TableCell>
      <TableCell align="right">
        <Skeleton />
      </TableCell>
      <TableCell align="right">
        <Skeleton />
      </TableCell>
    </TableRow>
  );
};

export default SkeletonRow;
