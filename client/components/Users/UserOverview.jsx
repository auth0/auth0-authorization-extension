import React from 'react';
import { findDOMNode } from 'react-dom';
import { Button, ButtonToolbar, Nav, NavItem } from 'react-bootstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

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
    Tabs.setUseDefaultStyles(false);

    return (
      <div>
        <LoadingPanel show={loading}>
          <Error message={error} />
          <SectionHeader title="Users" description="Here you will find all the users." />
          <div className="row">
            <div className="col-xs-12">
              <Tabs>
                <TabList className="nav nav-tabs" activeTabClassName="active">
                  <Tab><a>Users</a></Tab>
                  <Tab><a>Federated users (Pending login)</a></Tab>
                </TabList>
                <TabPanel>
                  <p className="user-section-description">User panel description.</p>
                </TabPanel>
                <TabPanel className="federated-users-section">
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
                </TabPanel>
              </Tabs>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <form className="advanced-search-control">
                <span className="search-area">
                  <i className="icon-budicon-489" />
                  <input className="user-input" type="text" ref="search" placeholder="Search for users"
                    spellCheck="false" style={{ marginLeft: '10px' }} onKeyPress={this.onKeyPress}
                  />
                </span>

                <span className="controls pull-right">
                  <div className="js-select custom-select">
                    <span>Search by </span><span className="truncate" data-select-value="">Name</span> <i className="icon-budicon-460" />
                    <select data-mode="">
                      <option value="user" selected="selected">Name</option>
                      <option value="email">Email</option>
                      <option value="connection">Connection</option>
                    </select>
                  </div>
                  <button type="reset">Reset <i className="icon-budicon-471" /></button>
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
              <UsersTable loading={loading} users={users} renderActions={renderActions} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <TableTotals currentCount={users.length} totalCount={total} />
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
