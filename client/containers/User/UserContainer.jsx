import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';

import * as LogActions from '../../actions/log';
import * as UserActions from '../../actions/user';

import './UserContainer.css';
import LogDialog from '../../components/Logs/LogDialog';
import UserLogs from '../../components/Users/UserLogs';
import UserHeader from '../../components/Users/UserHeader';
import UserProfile from '../../components/Users/UserProfile';
import UserDevices from '../../components/Users/UserDevices';

export default class UserContainer extends Component {
  componentWillMount() {
    this.props.fetchUser(this.props.params.id);
  }

  render() {
    const { user, log, logs, devices } = this.props;
    return (
      <div>
        <div className="row">
          <div className="col-xs-12">
            <Link className="btn btn-xs btn-primary pull-right" to="/users">Back to Users</Link>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <UserHeader loading={user.loading} user={user.record} error={user.error} />
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12">
            <Tabs defaultActiveKey={1} animation={false}>
              <Tab eventKey={1} title="Profile">
                <UserProfile loading={user.loading} user={user.record} error={user.error} />
              </Tab>
              <Tab eventKey={2} title="Devices">
                <UserDevices loading={devices.loading} devices={devices.records} error={devices.error} />
              </Tab>
              <Tab eventKey={3} title="Logs">
                <LogDialog onClose={() => this.props.clearLog()} error={log.error} loading={log.loading} log={log.record} logId={log.id} />
                <UserLogs onOpen={(logId) => this.props.fetchLog(logId)} loading={logs.loading} logs={logs.records} user={user.record} error={logs.error} />
              </Tab>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }
}

UserContainer.contextTypes = {
  history: React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    user: {
      record: state.user.get('record'),
      error: state.user.get('error'),
      loading: state.user.get('loading')
    },
    log: {
      id: state.log.get('logId'),
      record: state.log.get('record'),
      error: state.log.get('error'),
      loading: state.log.get('loading')
    },
    logs: {
      records: state.user.get('logs').get('records'),
      error: state.user.get('logs').get('error'),
      loading: state.user.get('logs').get('loading')
    },
    devices: {
      records: state.user.get('devices').get('records'),
      error: state.user.get('devices').get('error'),
      loading: state.user.get('devices').get('loading')
    }
  };
}

export default connect(mapStateToProps, { ...UserActions, ...LogActions })(UserContainer);
