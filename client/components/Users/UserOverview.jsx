import React from 'react';
import { findDOMNode } from 'react-dom';
import { Button, ButtonToolbar, Nav, NavItem, Tabs, Tab } from 'react-bootstrap';

import UserGeneral from './UserGeneral';
import UserFederated from './UserFederated';
import SectionHeader from '../Dashboard/SectionHeader';
import BlankState from '../Dashboard/BlankState';
import UsersTable from './UsersTable';
import { Error, TableTotals } from '../Dashboard';
import SearchBar from '../Dashboard/SearchBar';

class UserOverview extends React.Component {
  constructor() {
    super();

    this.onReset = this.onReset.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
    this.renderActions = this.renderActions.bind(this);
  }

  onKeyPress(e) {
    if (e.key === 'Enter') {
      this.props.onSearch(this.searchInput.value);
    }
  }

  onReset() {
    this.props.onReset();
  }

  renderActions(user, index) {
    return this.props.renderActions(user, index);
  }

  renderLoading() {
    return (
      <div className="spinner spinner-lg is-auth0" style={{ margin: '200px auto 0' }}>
        <div className="circle" />
      </div>
    );
  }

  renderEmptyState() {
    return (
      <BlankState
        title="Users"
        iconCode="292"
        description="Lorem ipsum dolor sit amet."
      />
    );
  }

  render() {
    const { loading, error, users, total, renderActions } = this.props;

    if (loading) { return this.renderLoading(); }

    return (
      !error && !users.length ? this.renderEmptyState() : (
        <div>
          <Error message={error} />
          <SectionHeader title="Users" description="Here you will find all the users." />
          <Tabs defaultActiveKey={1} animation={false}>
            <Tab eventKey={1} title="Users">
              <UserGeneral />
            </Tab>
            <Tab eventKey={2} title="Federated users (Pending login)">
              <UserFederated loading={loading} />
            </Tab>
          </Tabs>
          <div className="row" style={{ marginBottom: '20px' }}>
            <div className="col-xs-12">
              <SearchBar
                placeholder="Search for users"
                searchOptions={[
                  {
                    value: 'user',
                    title: 'User'
                  },
                  {
                    value: 'email',
                    title: 'Email'
                  },
                  {
                    value: 'connection',
                    title: 'Connection'
                  }
                ]}
                handleKeyPress={() => { console.log('SearchBar key press'); }}
                handleReset={() => { console.log('SearchBar handleReset'); }}
              />
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
        </div>
      )
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
