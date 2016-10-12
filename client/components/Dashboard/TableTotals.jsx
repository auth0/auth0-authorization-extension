import React, { PropTypes } from 'react';

const TableTotals = ({ currentCount, totalCount }) => {
  if (currentCount === 0 || totalCount === 0) {
    return <div />;
  }

  return (
    <div className="actions-group pull-left">
      Showing <strong>{currentCount}</strong> of <strong>{totalCount}</strong>
    </div>
  );
};

TableTotals.propTypes = {
  currentCount: PropTypes.number,
  totalCount: PropTypes.number
};

export default TableTotals;
