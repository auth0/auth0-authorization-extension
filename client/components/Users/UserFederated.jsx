import React from 'react';
import { Button } from 'react-bootstrap';

class UserFederated extends React.Component{
  render() {
    const { loading } = this.props;
    return (
      <div className="federated-users-section">
        <p className="user-section-description">
          When using federated connections like AD, ADFS, SAML.. you&#39;ll only know the
          user once they have logged in for the first time. This tab will allow you to define
          group and role memberships for users that have not logged in yet (by specifying what
          the user identifier will look like upon first login). When the user logs in for the
          first time, they will receive the groups and roles configured here and the pending
          user will become an actual user.
        </p>
        <Button className="user-section-btn pull-right" bsStyle="success" disabled={loading}>
          <i className="icon icon-budicon-473" /> Create user
        </Button>
      </div>
    );
  }
}

UserFederated.propTypes = {
  loading: React.PropTypes.bool.isRequired
};


export default UserFederated;
