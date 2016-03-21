import React, { Component, PropTypes } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';

import ApplicationGroupRemoveAction from './ApplicationGroupRemoveAction';
import { Error, LoadingPanel, Table, TableCell, TableRouteCell, TableBody, TableIconCell, TableTextCell, TableHeader, TableColumn, TableRow } from '../Dashboard';

class ApplicationGroups extends Component {
  constructor() {
    super();

    this.addToApplication = this.addToApplication.bind(this);
    this.removeFromApplication = this.removeFromApplication.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.application !== this.props.application || nextProps.groups !== this.props.groups;
  }

  getHelpText(groups) {
    if (groups.length === 0) {
      return <span>This application can be accessed by all users.<br /> By adding groups here you will restrict application access to the users in these groups.</span>;
    }

    return <span>This application can only be accessed by users in these <strong>{groups.length}</strong> groups.</span>;
  }

  addToApplication() {
    this.props.addToApplication(this.props.application.toJS());
  }

  removeFromApplication(group) {
    this.props.removeFromApplication(this.props.application.toJS(), group);
  }

  renderGroups(error, loading, groups) {
    if (!error && groups.length === 0) {
      return <div></div>;
    }

    return (
      <Table>
        <TableHeader>
          <TableColumn width="3%" />
          <TableColumn width="30%">Name</TableColumn>
          <TableColumn width="60%">Description</TableColumn>
          <TableColumn width="10%" />
        </TableHeader>
        <TableBody>
        {groups.map((group, index) =>
          <TableRow key={index}>
            <TableIconCell color="green" icon="322" />
            <TableRouteCell route={`/groups/${group._id}`}>{ group.name || 'N/A' }</TableRouteCell>
            <TableTextCell>{group.description}</TableTextCell>
            <TableCell>
              <ButtonToolbar style={{ marginBottom: '0px' }}>
                <ApplicationGroupRemoveAction index={index} group={group} loading={loading} onRemove={this.removeFromApplication} />
              </ButtonToolbar>
            </TableCell>
          </TableRow>
        )}
        </TableBody>
      </Table>
    );
  }

  render() {
    const { error, loading, records } = this.props.groups.toJS();

    return (
      <div>
        <div className="bg-warning">
          Heads up! By adding or removing groups here you are changing the authorization behavior of your application.
        </div>
        <div className="row">
          <div className="col-xs-12">
            <span className="pull-left">{this.getHelpText(records)}</span>
            <ButtonToolbar className="pull-right">
              <Button bsStyle="primary" bsSize="xsmall" onClick={this.addToApplication} disabled={loading}>
                <i className="icon icon-budicon-337"></i> Add
              </Button>
            </ButtonToolbar>
          </div>
        </div>
        <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
          <Error message={error} />
          {this.renderGroups(error, loading, records)}
        </LoadingPanel>
    </div>
    );
  }
}

ApplicationGroups.propTypes = {
  addToApplication: PropTypes.func.isRequired,
  removeFromApplication: PropTypes.func.isRequired,
  application: PropTypes.object.isRequired,
  groups: PropTypes.object.isRequired
};

export default ApplicationGroups;
