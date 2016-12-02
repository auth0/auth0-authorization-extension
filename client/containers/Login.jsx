import { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { LoadingPanel } from 'auth0-extension-ui';

import { login } from '../actions/auth';

class LoginContainer extends Component {
  componentWillMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.push(`/groups`);
    } else if (!this.props.auth.isAuthenticating) {
      this.props.login(this.props.location.query.returnUrl);
    }
  }

  render() {
    if (!this.props.auth.isAuthenticating) {
      return <div></div>;
    }

    return <div className="row">
      <div className="col-xs-12 wrapper">
        <LoadingPanel></LoadingPanel>
      </div>
    </div>;
  }
}

function mapStateToProps(state) {
  return {
    auth: state.auth.toJS()
  };
}

export default connect(mapStateToProps, { login, push })(LoginContainer);
