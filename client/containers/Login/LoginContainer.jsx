import { Component } from 'react';
import { connect } from 'react-redux';
import { pushPath } from 'redux-simple-router';

import { login } from '../../actions/auth';
import { LoadingPanel } from '../../components/Dashboard';

class LoginContainer extends Component {
  componentWillMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.pushPath(`/users`);
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

export default connect(mapStateToProps, { login, pushPath })(LoginContainer);
