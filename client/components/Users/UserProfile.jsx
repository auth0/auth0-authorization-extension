import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Error, Json, LoadingPanel } from '@a0/auth0-extension-ui';

class UserProfile extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.user !== this.props.user || nextProps.loading !== this.props.loading;
  }

  render() {
    const { user, error, loading } = this.props;
    return (
      <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
        <Error message={error}>
          <Json jsonObject={user.toJS()} />
        </Error>
      </LoadingPanel>
    );
  }
}

UserProfile.propTypes = {
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired
};

export default UserProfile;
