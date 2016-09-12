import React, { PropTypes } from 'react'
import { Button } from 'react-bootstrap';

class GroupRoles extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col-xs-8">
          <p>
            Add or remove roles to this group to manage users permissions to your applications.
          </p>
        </div>
        <div className="col-xs-4">
          <Button className="pull-right" bsStyle="success" onClick={() => {}}>
            <i className="icon icon-budicon-473" /> Add role
          </Button>
        </div>
      </div>
    );
  }
}

export default GroupRoles;
