import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const TableRouteCell = ({ children, route }) => (
  <td className="truncate" title={children}>
    <Link to={`${route}`}>
      {children}
    </Link>
  </td>
);

TableRouteCell.propTypes = {
  route: PropTypes.string.isRequired,
  children: PropTypes.node
};

export default TableRouteCell;
