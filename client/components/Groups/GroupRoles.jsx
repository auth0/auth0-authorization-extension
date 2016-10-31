import React, { PropTypes } from 'react'
import { Button } from 'react-bootstrap';
import  GroupRolesDialog from './GroupRolesDialog';

class GroupRoles extends React.Component {
  render() {
    return (
      <div className="row">
        <GroupRolesDialog group={this.props.group} addRoles={this.props.addRoles} onClose={this.props.closeAddRoles} />
        <div className="col-xs-8">
          <p>
            Add or remove roles to this group to manage users permissions to your applications.
          </p>
        </div>
        <div className="col-xs-4">
          <Button className="pull-right" bsStyle="success" onClick={this.props.openAddRoles}>
            <i className="icon icon-budicon-473" /> Add role
          </Button>
        </div>
      </div>
    );
  }
}

export default GroupRoles;
