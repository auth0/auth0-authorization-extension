import React, { Component } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import  UserRolesDialog from './UserRolesDialog';

class UserRoles extends Component {
  render() {
    return (
      <div>
        <UserRolesDialog user={this.props.user} addRoles={this.props.addRoles} onClose={this.props.closeAddRoles} />
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-xs-8">
            <p>Roles description</p>
          </div>
          <div className="col-xs-4">
            <Button className="pull-right" bsStyle="success" onClick={this.props.openAddRoles}>
              <i className="icon icon-budicon-473" /> Add role to user
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default UserRoles;
