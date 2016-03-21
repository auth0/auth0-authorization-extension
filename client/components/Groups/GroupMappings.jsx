import React, { Component } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { Error, LoadingPanel, Table, TableCell, TableBody, TableIconCell, TableTextCell, TableHeader, TableColumn, TableRow } from '../Dashboard';

import { GroupMappingRemoveAction } from './';

class GroupMappings extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.mappings !== this.props.mappings;
  }

  render() {
    const { records, loading, error } = this.props.mappings.toJS();

    return (
      <div>
        <LoadingPanel show={loading}>
          <div className="row">
            <div className="col-xs-12 wrapper">
              <Error message={error} />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-10">
              <span className="pull-left">Mappings allow you to define which existing group memberships (eg: Active Directory) should be translated to this group. For example: &quot;<i>If <strong>John</strong> from <strong>fabrikam-adfs</strong> belongs to <strong>Fabrikam HR</strong> then he should also be member of this group.&quot;</i></span>
            </div>
            <div className="col-xs-2">
              <ButtonToolbar className="pull-right">
                <Button bsStyle="primary" bsSize="xsmall" onClick={this.props.createMapping} disabled={loading}>
                  <i className="icon icon-budicon-337"></i> Create
                </Button>
              </ButtonToolbar>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <Table>
                <TableHeader>
                  <TableColumn width="3%" />
                  <TableColumn width="40%">Connection</TableColumn>
                  <TableColumn width="47%">Group</TableColumn>
                  <TableColumn width="10%" />
                </TableHeader>
                <TableBody>
                {records.map((mapping, index) => (
                  <TableRow key={index}>
                    <TableIconCell color="green" icon="573" />
                    <TableTextCell>{mapping.connectionName}</TableTextCell>
                    <TableTextCell>{mapping.groupName}</TableTextCell>
                    <TableCell>
                      <ButtonToolbar style={{ marginBottom: '0px' }}>
                        <GroupMappingRemoveAction index={index} groupMapping={mapping} loading={loading} onRemove={this.props.removeMapping} />
                      </ButtonToolbar>
                    </TableCell>
                  </TableRow>
                ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </LoadingPanel>
      </div>
    );
  }
}

GroupMappings.propTypes = {
  createMapping: React.PropTypes.func.isRequired,
  removeMapping: React.PropTypes.func.isRequired,
  mappings: React.PropTypes.object.isRequired
};

export default GroupMappings;
