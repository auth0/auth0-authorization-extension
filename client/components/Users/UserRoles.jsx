import React, { Component } from 'react';
import SectionHeader from '../Dashboard/SectionHeader';
import { Button, ButtonToolbar } from 'react-bootstrap';

class UserRoles extends Component {
  render() {
    return (
      <div>
        <div className="row" style={{ marginBottom: '20px' }}>
          <div className="col-xs-8">
            <p>Roles description</p>
          </div>
          <div className="col-xs-4">
            <Button className="pull-right" bsStyle="success" onClick={() => {}}>
              <i className="icon icon-budicon-473" /> Add role to user
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default UserRoles;
