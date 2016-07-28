import React from 'react';
import { findDOMNode } from 'react-dom';
import { Button, ButtonToolbar } from 'react-bootstrap';

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
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={ error } />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-10">
              <div className="advanced-search-control">
                <span className="search-area">
                  <i className="icon-budicon-489"></i>
                  <input className="user-input" type="text" ref="search" placeholder="Search for users"
                    spellCheck="false" style={{ marginLeft: '10px' }} onKeyPress={this.onKeyPress}
                  />
                </span>
              </div>
            </div>
            <div className="col-xs-2">
              <ButtonToolbar className="pull-right">
                <Button bsSize="small" onClick={ this.onReset } disabled={ loading }>
                  <i className="icon icon-budicon-257"></i> Reset
                </Button>
              </ButtonToolbar>
            </div>
            <div className="col-xs-12">
              <div className="help-block">
                To perform your search, press <span className="keyboard-button">enter</span>.
                You can also search for specific fields, eg: <strong>email:"john@doe.com"</strong>.
              </div>
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
