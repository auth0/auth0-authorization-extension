import React, { Component } from 'react';
import { Error, LoadingPanel, Table, TableBody, TableIconCell, TableTextCell, TableHeader, TableColumn, TableRow } from '../Dashboard';

class UserLogs extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.logs !== this.props.logs || nextProps.user !== this.props.user || nextProps.loading !== this.props.loading;
  }

  render() {
    const { error, loading } = this.props;
    if (loading) {
      return <div></div>;
    }

    if (!error && this.props.logs.size === 0) {
      return <div>There are no logs available for this user.</div>;
    }

    const logs = this.props.logs.toJS();
    return <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
      <Error message={error} />
      <Table>
        <TableHeader>
          <TableColumn width="3%"/>
          <TableColumn width="20%">Event</TableColumn>
          <TableColumn width="25%">Description</TableColumn>
          <TableColumn width="12%">Date</TableColumn>
          <TableColumn width="15%">Connection</TableColumn>
          <TableColumn width="15%">Application</TableColumn>
        </TableHeader>
        <TableBody>
          {logs.map((log, index) => {
            const type = log.type;
            const icon = type.icon;

            return(
              <TableRow key={index}>
                <TableIconCell color={icon.color} icon={icon.name}/>
                <TableTextCell onClick={() => this.props.onOpen(log._id)}>{type.event}</TableTextCell>
                <TableTextCell>{log.user_name || log.description || type.description}</TableTextCell>
                <TableTextCell>{log.time_ago}</TableTextCell>
                <TableTextCell>{log.connection || 'N/A'}</TableTextCell>
                <TableTextCell>{log.client_name|| 'N/A'}</TableTextCell>
              </TableRow>
            );
          })
        }
        </TableBody>
      </Table>
    </LoadingPanel>;
  }
}

UserLogs.propTypes = {
  onOpen: React.PropTypes.func.isRequired,
  error: React.PropTypes.string,
  loading: React.PropTypes.bool.isRequired,
  user: React.PropTypes.object.isRequired,
  logs: React.PropTypes.object.isRequired
};

export default UserLogs;
