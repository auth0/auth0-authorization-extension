import React, { Component } from 'react';
import { Table, TableIconCell, TableBody, TableTextCell, TableHeader, TableColumn, TableRow } from 'auth0-extension-ui';

class LogsTable extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.logs !== this.props.logs;
  }

  render() {
    const logs = this.props.logs.toJS();
    return <Table>
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

          return <TableRow key={index}>
              <TableIconCell color={icon.color} icon={icon.name}/>
              <TableTextCell onClick={() => this.props.onOpen(log._id)}>{type.event}</TableTextCell>
              <TableTextCell>{log.user_name || log.description || type.description}</TableTextCell>
              <TableTextCell>{log.time_ago}</TableTextCell>
              <TableTextCell>{log.connection || 'N/A'}</TableTextCell>
              <TableTextCell>{log.client_name|| 'N/A'}</TableTextCell>
            </TableRow>;
        })
      }
      </TableBody>
    </Table>;
  }
}

LogsTable.propTypes = {
  onOpen: React.PropTypes.func.isRequired,
  logs: React.PropTypes.object.isRequired,
  loading: React.PropTypes.bool.isRequired
};

export default LogsTable;
