import { Component } from 'react';

class Table extends Component {
  render() {
    return <table className="table data-table" style={{ tableLayout: 'fixed' }}>
        { this.props.children }
      </table>;
  }
}

export default Table;
