import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { connectionActions } from '../actions';
import * as actions from '../actions/group';
import GroupsOverview from '../components/Groups/GroupsOverview';

class GroupsContainer extends Component {
  constructor() {
    super();

    this.onReset = this.onReset.bind(this);
    this.onSearch = this.onSearch.bind(this);

    this.save = this.save.bind(this);
    this.clear = this.clear.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.cancelDelete = this.cancelDelete.bind(this);
  }

  componentWillMount() {
    this.props.fetchGroups();
    this.props.fetchConnections();
  }

  onSearch(query, field) {
    this.props.fetchGroups(query, field);
  }

  onReset() {
    this.props.fetchGroups();
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

  render() {
    if (this.props.children) {
      return this.props.children;
    }

    return (
      <div>
        <GroupsOverview
          onReset={this.onReset}
          onSearch={this.onSearch}
          save={this.save}
          clear={this.clear}
          cancelDelete={this.cancelDelete}
          confirmDelete={this.confirmDelete}
          createGroup={this.props.createGroup}
          editGroup={this.props.editGroup}
          editGroupUsers={this.props.editGroupUsers}
          requestDeleteGroup={this.props.requestDeleteGroup}
          group={this.props.group}
          groups={this.props.groups}
        />
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
  saveGroup: PropTypes.func.isRequired,
  clearGroup: PropTypes.func.isRequired,
  deleteGroup: PropTypes.func.isRequired,
  cancelDeleteGroup: PropTypes.func.isRequired,
  createGroup: PropTypes.func.isRequired,
  editGroup: PropTypes.func.isRequired,
  editGroupUsers: PropTypes.func.isRequired,
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
