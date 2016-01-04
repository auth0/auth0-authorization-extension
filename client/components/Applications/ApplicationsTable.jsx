import React, { Component } from 'react';
import { Table, TableIconCell, TableBody, TableTextCell, TableHeader, TableColumn, TableRow } from '../Dashboard';

class ApplicationsTable extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.applications !== this.props.applications;
  }

  render() {
    const applications = this.props.applications.toJS();
    return <Table>
      <TableHeader>
        <TableColumn width="3%"></TableColumn>
        <TableColumn width="30%">Name</TableColumn>
        <TableColumn width="30%">Client Id</TableColumn>
        <TableColumn width="37%">Callback</TableColumn>
      </TableHeader>
      <TableBody>
        {applications.map((application, index) => {
          const callback = (application.callbacks && application.callbacks.length)
            ? application.callbacks[0] : 'N/A';

          return(
            <TableRow key={index}>
              <TableIconCell color="#5d676f" icon="374" />
              <TableTextCell>{application.name || 'N/A'}</TableTextCell>
              <TableTextCell>{application.client_id || 'N/A'}</TableTextCell>
              <TableTextCell>{callback || 'N/A'}</TableTextCell>
            </TableRow>
          );
        })
      }
      </TableBody>
    </Table>;
  }
}

ApplicationsTable.propTypes = {
  applications: React.PropTypes.object.isRequired,
  loading: React.PropTypes.bool.isRequired
};

export default ApplicationsTable;
