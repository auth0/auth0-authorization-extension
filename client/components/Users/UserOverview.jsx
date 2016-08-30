import React from 'react';
import { findDOMNode } from 'react-dom';
import { Button, ButtonToolbar, Nav, NavItem } from 'react-bootstrap';

import SectionHeader from '../Dashboard/SectionHeader';
import UsersTable from './UsersTable';
import { Error, LoadingPanel, TableTotals } from '../Dashboard';

class UserOverview extends React.Component {
  constructor() {
    super();

    this.onReset = this.onReset.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.renderActions = this.renderActions.bind(this);
  }

  onKeyPress(e) {
    if (e.key === 'Enter') {
      this.props.onSearch(findDOMNode(this.refs.search).value);
    }
  }

  onReset() {
    this.props.onReset();
  }

  renderActions(user, index) {
    return this.props.renderActions(user, index);
  }

  render() {
    const { loading, error, users, total, renderActions } = this.props;

    return (
      <div>
        <LoadingPanel show={ loading }>
          <Error message={ error } />
          <SectionHeader title="Users" description="Here you will find all the users." />
          <div className="row">
            <div className="col-xs-12">
              <Nav bsStyle="tabs">
                <NavItem active="true">Users</NavItem>
                <NavItem>Federated users (Pending login)</NavItem>
              </Nav>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <p>
                When using federated connections like AD, ADFS, SAML.. you&#39;ll only know the
                user once they have logged in for the first time. This tab will allow you to define
                group and role memberships for users that have not logged in yet (by specifying what
                the user identifier will look like upon first login). When the user logs in for the
                first time, they will receive the groups and roles configured here and the pending
                user will become an actual user.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <form className="advanced-search-control">
                <span className="search-area">
                  <i className="icon-budicon-489"></i>
                  <input className="user-input" type="text" ref="search" placeholder="Search for users"
                    spellCheck="false" style={{ marginLeft: '10px' }} onKeyPress={this.onKeyPress}
                  />
                </span>

                <span className="controls pull-right">
                  <div className="js-select custom-select">
                    <span>Search by </span><span className="truncate" data-select-value="">Name</span> <i className="icon-budicon-460"></i>
                    <select data-mode="">
                      <option value="user" selected="selected">Name</option>
                      <option value="email">Email</option>
                      <option value="connection">Connection</option>
                    </select>
                  </div>
                  <button type="reset">Reset <i className="icon-budicon-471"></i></button>
                </span>
              </form>
            </div>
            <div className="col-xs-12 help-block">
              To perform your search, press <span className="keyboard-button">enter</span>.
              You can also search for specific fields, eg: <strong>email:"john@doe.com"</strong>.
            </div>
          </div>

          <div className="row">
            <div className="col-xs-12">
                <UsersTable loading={ loading } users={ users } renderActions={ renderActions } />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <TableTotals currentCount={ users.length } totalCount={ total } />
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
}

UserOverview.propTypes = {
  onReset: React.PropTypes.func.isRequired,
  onSearch: React.PropTypes.func.isRequired,
  error: React.PropTypes.object,
  users: React.PropTypes.array.isRequired,
  total: React.PropTypes.number.isRequired,
  loading: React.PropTypes.bool.isRequired,
  renderActions: React.PropTypes.func.isRequired
};

export default UserOverview;
