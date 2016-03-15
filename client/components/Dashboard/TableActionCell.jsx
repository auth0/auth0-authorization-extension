import { Component } from 'react';

class TableActionCell extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.children !== this.props.children;
  }

  render() {
    return <td>
        { this.props.children }
      </td>;
  }
}

export default TableActionCell;
