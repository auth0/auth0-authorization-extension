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
        if(window.config.IS_ADMIN) {
          this.props.push('/login');
        } else {
          this.props.push(`/login?returnUrl=${this.props.location.pathname}`);
        }
      }
    }

    render() {
      if (this.props.auth.isAuthenticated) {
        return <InnerComponent {...this.props}/>;
      }

      return <div></div>;
    }
  }

  return connect((state) => ({ auth: state.auth.toJS() }), { push })(RequireAuthenticationContainer);
}
