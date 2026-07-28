import { Component } from 'react';
import { connect } from 'react-redux';
import { LoadingPanel } from '@a0/auth0-extension-ui';

import { login } from '../actions/auth';

class LoginContainer extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.navigate('/groups');
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

export default connect(mapStateToProps, { login })(LoginContainer);
