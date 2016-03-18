import React, { Component } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

import UserGroupRemoveAction from './UserGroupRemoveAction';
import { Error, LoadingPanel, Table, TableCell, TableBody, TableIconCell, TableTextCell, TableHeader, TableColumn, TableRow } from '../Dashboard';

class UserGroups extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.user !== this.props.user || nextProps.groups !== this.props.groups;
  }

  render() {
    const { error, loading, records } = this.props.groups.toJS();

    if (!error && records.length === 0) {
      return <div>This does not belong to any groups.</div>;
    }

    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <span className="pull-left">These are the explicit group memberships of the user.<br /> Group memberships as the result of a group mapping will not be listed here.</span>
            <ButtonToolbar className="pull-right">
              <Button bsStyle="primary" bsSize="xsmall" onClick={this.props.addMember} disabled={loading}>
                <i className="icon icon-budicon-337"></i> Add
              </Button>
            </ButtonToolbar>
          </div>
        </div>
        <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
          <Error message={error} />
          <Table>
            <TableHeader>
              <TableColumn width="3%"/>
              <TableColumn width="30%">Name</TableColumn>
              <TableColumn width="60%">Description</TableColumn>
              <TableColumn width="10%" />
            </TableHeader>
            <TableBody>
            {records.map((group, index) => {
              return (
                <TableRow key={index}>
                  <TableIconCell color="green" icon="322"/>
                  <TableTextCell>{group.name}</TableTextCell>
                  <TableTextCell>{group.description}</TableTextCell>
                  <TableCell>
                    <ButtonToolbar style={{ marginBottom: '0px' }}>
                      <UserGroupRemoveAction index={index} group={group} loading={loading} />
                    </ButtonToolbar>
                  </TableCell>
                </TableRow>
              );
            })}
            </TableBody>
          </Table>
        </LoadingPanel>
    </div>
    );
  }
}

UserGroups.propTypes = {
  user: React.PropTypes.object.isRequired,
  groups: React.PropTypes.object.isRequired
};

export default UserGroups;
