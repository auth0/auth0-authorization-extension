import React, { Component, PropTypes } from 'react';

class TableActionCell extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.children !== this.props.children;
  }

  render() {
    return (
      <td>
        { this.props.children }
      </td>
    );
  }
}

TableActionCell.propTypes = {
  children: PropTypes.node
};

export default TableActionCell;
