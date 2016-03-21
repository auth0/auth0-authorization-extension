import React, { Component } from 'react';
import { Table, TableIconCell, TableBody, TableTextCell, TableRouteCell, TableHeader, TableColumn, TableRow } from '../Dashboard';

class ApplicationsTable extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.applications !== this.props.applications;
  }

  getGroupCount(groups) {
    if (groups && groups.length) {
      return <span><strong>{groups.length}</strong> groups</span>;
    }

    return <span>All users</span>;
  }

  render() {
    const applications = this.props.applications.toJS();
    return (
      <Table>
        <TableHeader>
          <TableColumn width="3%" />
          <TableColumn width="40%">Name</TableColumn>
          <TableColumn width="37%">Callback</TableColumn>
          <TableColumn width="15%">Authorization</TableColumn>
        </TableHeader>
        <TableBody>
          {applications.map((application, index) => {
            const callback = (application.callbacks && application.callbacks.length)
              ? application.callbacks[0] : 'N/A';

            return (
              <TableRow key={index}>
                <TableIconCell color="#5d676f" icon="374" />
                <TableRouteCell route={`/applications/${application.client_id}`}>{ application.name || 'N/A' }</TableRouteCell>
                <TableTextCell>{callback || 'N/A'}</TableTextCell>
                <TableTextCell>{this.getGroupCount(application.groups)}</TableTextCell>
              </TableRow>
            );
          })
        }
        </TableBody>
      </Table>
    );
  }
}

ApplicationsTable.propTypes = {
  applications: React.PropTypes.object.isRequired,
  loading: React.PropTypes.bool.isRequired
};

export default ApplicationsTable;
