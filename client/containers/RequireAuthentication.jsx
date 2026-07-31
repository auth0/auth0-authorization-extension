import React from 'react';
import { connect } from 'react-redux';

export default function RequireAuthentication(InnerComponent) {
  class RequireAuthenticationContainer extends React.Component {
    componentDidMount() {
      this.requireAuthentication();
    }

    componentDidUpdate() {
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

  return connect((state) => ({ auth: state.auth.toJS() }))(RequireAuthenticationContainer);
}
