import React, { Component } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

import { Table, TableHeader, TableColumn } from '../Dashboard';

class GroupMembers extends Component {
  render() {
    return (
      <div>
        <div className="col-xs-12 wrapper">
          <ButtonToolbar className="pull-right">
            <Button bsStyle="primary" bsSize="xsmall" onClick={this.create} disabled={this.props.loading}>
              <i className="icon icon-budicon-337"></i> Add
            </Button>
          </ButtonToolbar>
        </div>
        <Table>
          <TableHeader>
            <TableColumn width="3%" />
            <TableColumn width="27%">User</TableColumn>
            <TableColumn width="55%">Email</TableColumn>
            <TableColumn width="55%">Connection</TableColumn>
            <TableColumn width="15%" />
          </TableHeader>
        </Table>
      </div>
    );
  }
}

GroupMembers.propTypes = {

};

export default GroupMembers;
