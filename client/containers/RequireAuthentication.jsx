import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

export default function RequireAuthentication(InnerComponent) {
  class RequireAuthenticationContainer extends React.Component {
    componentWillMount() {
      this.requireAuthentication();
    }

    componentWillReceiveProps() {
      this.requireAuthentication();
    }

    requireAuthentication() {
      if (!this.props.auth.isAuthenticated && !this.props.auth.isAuthenticating) {
        window.location.href = `${window.config.BASE_URL}/login`;
      }
    }

    render() {
      if (this.props.auth.isAuthenticated) {
        return <InnerComponent {...this.props} />;
      }

      return <div />;
    }
  }

  return connect((state) => ({ auth: state.auth.toJS() }), { push })(RequireAuthenticationContainer);
}
