import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonToolbar } from 'react-bootstrap';
import SectionHeader from '../components/Dashboard/SectionHeader';
import BlankState from '../components/Dashboard/BlankState';

import { connectionActions } from '../actions';
import * as actions from '../actions/group';
import { Error, LoadingPanel, TableAction } from '../components/Dashboard';
import { GroupDeleteDialog, GroupDialog, GroupsTable } from '../components/Groups';

class GroupsContainer extends Component {
  constructor() {
    super();

    this.refresh = this.refresh.bind(this);
    this.save = this.save.bind(this);
    this.clear = this.clear.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.cancelDelete = this.cancelDelete.bind(this);
    this.renderGroupActions = this.renderGroupActions.bind(this);
  }

  componentWillMount() {
    this.props.fetchGroups();
    this.props.fetchConnections();
  }

  refresh() {
    this.props.fetchGroups(true);
  }

  save(group) {
    this.props.saveGroup(group);
  }

  clear(group) {
    this.props.clearGroup(group);
  }

  confirmDelete(group) {
    this.props.deleteGroup(group);
  }

  cancelDelete(group) {
    this.props.cancelDeleteGroup(group);
  }

  renderGroupActions(group) {
    return (
      <div>
        <TableAction id={`edit-${group._id}`} type="default" title="Edit Group" icon="266"
          onClick={this.props.editGroup} args={[ group ]} d disabled={this.props.groups.loading || false}
        />
        <span> </span>
        <TableAction id={`delete-${group._id}`} type="success" title="Delete Group" icon="263"
          onClick={this.props.requestDeleteGroup} args={[ group ]} disabled={this.props.groups.loading || false}
        />
      </div>
    );
  }

  render() {
    if (this.props.children) {
      return this.props.children;
    }

    return (
      <div>
        <GroupDialog group={this.props.group} onSave={this.save} onClose={this.clear} />
        <GroupDeleteDialog group={this.props.group} onCancel={this.cancelDelete} onConfirm={this.confirmDelete} />

        { !this.props.groups.loading && !this.props.groups.records.size && !this.props.groups.error ?
          <BlankState
            title="Groups"
            iconCode="292"
            description="Create and manage groups in which you can add users to define dynamic group memberships."
          >
            <a href="https://auth0.com/docs/extensions/authorization-extension" target="_blank" className="btn btn-transparent btn-md">
              Read more
            </a>
            <Button bsStyle="success" onClick={this.props.createGroup} disabled={this.props.groups.loading}>
              <i className="icon icon-budicon-473"></i> Create your first group
            </Button>
          </BlankState>
          :
          <div>
            <SectionHeader title="Groups" description="Create and manage groups in which you can add users and define dynamic group memberships.">
              <Button bsSize="default" onClick={this.refresh} disabled={this.props.groups.loading}>
                <i className="icon icon-budicon-257"></i> Refresh
              </Button>
              <Button bsStyle="success" onClick={this.props.createGroup} disabled={this.props.groups.loading}>
                <i className="icon icon-budicon-337"></i> Create
              </Button>
            </SectionHeader>
            <div className="row">
              <div className="col-xs-12">
                <Error message={this.props.groups.error} />
                <LoadingPanel show={this.props.groups.loading}>
                  <GroupsTable canOpenGroup={true} groups={this.props.groups.records} loading={this.props.groups.loading} renderActions={this.renderGroupActions} />
                </LoadingPanel>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

GroupsContainer.propTypes = {
  children: React.PropTypes.object,
  group: React.PropTypes.object.isRequired,
  groups: React.PropTypes.object.isRequired,
  fetchConnections: PropTypes.func.isRequired,
  fetchGroups: PropTypes.func.isRequired,
  createGroup: PropTypes.func.isRequired,
  editGroup: PropTypes.func.isRequired,
  requestDeleteGroup: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    group: state.group,
    groups: {
      error: state.groups.get('error'),
      loading: state.groups.get('loading'),
      records: state.groups.get('records')
    }
  };
}

export default connect(mapStateToProps, { ...actions, ...connectionActions })(GroupsContainer);
