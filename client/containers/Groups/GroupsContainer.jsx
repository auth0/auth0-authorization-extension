import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonToolbar } from 'react-bootstrap';

import { connectionActions } from '../../actions';
import * as actions from '../../actions/group';
import { Error, LoadingPanel } from '../../components/Dashboard';
import { GroupDeleteDialog, GroupDialog, GroupForm, GroupsTable } from '../../components/Groups';

class GroupsContainer extends Component {
  constructor() {
    super();

    this.refresh = this.refresh.bind(this);
    this.create = this.create.bind(this);
    this.edit = this.edit.bind(this);
    this.save = this.save.bind(this);
    this.clear = this.clear.bind(this);
    this.requestDelete = this.requestDelete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.cancelDelete = this.cancelDelete.bind(this);
  }

  componentWillMount() {
    this.props.fetchGroups();
    this.props.fetchConnections();
  }

  create() {
    this.props.createGroup();
  }

  edit(group) {
    this.props.editGroup(group);
  }

  save(group) {
    this.props.saveGroup(group);
  }

  clear(group) {
    this.props.clearGroup(group);
  }

  requestDelete(group) {
    this.props.requestDeleteGroup(group);
  }

  confirmDelete(group) {
    this.props.deleteGroup(group);
  }

  cancelDelete(group) {
    this.props.cancelDeleteGroup(group);
  }

  refresh() {
    this.props.fetchGroups(true);
  }

  render() {
    if (this.props.children) {
      return this.props.children;
    }

    return (
      <div>
        <GroupDialog group={this.props.group} onSave={this.save} onClose={this.clear} />
        <GroupDeleteDialog group={this.props.group} onCancel={this.cancelDelete} onConfirm={this.confirmDelete} />

        <div className="row">
          <div className="col-xs-12 wrapper">
            <div className="content-header video-template">
              <ButtonToolbar className="pull-right">
                <Button bsSize="xsmall" onClick={this.refresh} disabled={this.props.groups.loading}>
                  <i className="icon icon-budicon-257"></i> Refresh
                </Button>
                <Button bsStyle="primary" bsSize="xsmall" onClick={this.create} disabled={this.props.groups.loading}>
                  <i className="icon icon-budicon-337"></i> Create
                </Button>
              </ButtonToolbar>
              <h1>Groups</h1>
              <div className="cues-container">
                <div className="use-case-box is-active">
                  <div className="explainer-text">
                    <span className="explainer-text-content">Create and manage groups in which you can add users and define dynamic group memberships.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 wrapper">
            <Error message={this.props.groups.error} />
            <LoadingPanel show={this.props.groups.loading}>
              <GroupsTable groups={this.props.groups.records} loading={this.props.groups.loading}
                onEdit={this.edit} onDelete={this.requestDelete} />
            </LoadingPanel>
          </div>
        </div>
      </div>
    );
  }
}

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
