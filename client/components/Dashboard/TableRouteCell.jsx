import React, { Component } from 'react';
import { Link } from 'react-router';

class TableRouteCell extends Component {
  render() {
    return (
      <td className="truncate" title={this.props.children}>
        <Link to={`${this.props.route}`}>
          {this.props.children}
        </Link>
      </td>);
  }
}

TableRouteCell.propTypes = {
  route: React.PropTypes.string.isRequired
};

export default TableRouteCell;
