import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import './Users.styl';

import * as actions from '../actions/user';
import UserOverview from '../components/Users/UserOverview';

class Users extends React.Component {
  static propTypes = {
    fetchUsers: PropTypes.func.isRequired
  }
  constructor() {
    super();

    this.onReset = this.onReset.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.getUsersOnPage = this.getUsersOnPage.bind(this);
  }

  componentWillMount() {
    this.props.fetchUsers('', '', false, process.env.PER_PAGE);
  }

  onSearch(query, field) {
    this.props.fetchUsers(query, field, false, process.env.PER_PAGE);
  }

  onReset() {
    this.props.fetchUsers('', '', true, process.env.PER_PAGE);
  }

  getUsersOnPage(page, query = '', field = '') {
    this.props.fetchUsers(query, field, true, process.env.PER_PAGE, page);
  }

  render() {
    if (this.props.children) {
      return this.props.children;
    }

    const { loading, error, users, total, fetchQuery } = this.props;

    return (
      <div className="users-section">
        <UserOverview
          onReset={this.onReset}
          onSearch={this.onSearch}
          error={error}
          users={users}
          total={total}
          fetchQuery={fetchQuery}
          loading={loading}
          getUsersOnPage={this.getUsersOnPage}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    error: state.users.get('error'),
    loading: state.users.get('loading'),
    users: state.users.get('records').toJS(),
    total: state.users.get('total'),
    fetchQuery: state.users.get('fetchQuery'),
    nextPage: state.users.get('nextPage')
  };
}

export default connect(mapStateToProps, actions)(Users);
