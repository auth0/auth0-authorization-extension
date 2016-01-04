import { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonToolbar } from 'react-bootstrap';

import * as GroupActions from '../../actions/group';

import { Error, LoadingPanel } from '../../components/Dashboard';
import GroupsTable from '../../components/Groups/GroupsTable';
import GroupDialog from '../../components/Groups/GroupDialog';
import DeleteGroupDialog from '../../components/Groups/DeleteGroupDialog';

class GroupsContainer extends Component {
  componentWillMount() {
    this.props.fetchGroups();
  }

  refresh() {
    this.props.fetchGroups(true);
  }

  render() {
    return (
      <div>
        <GroupDialog group={this.props.group}
          onSave={this.props.saveGroup} onClose={this.props.clearGroup} />
        <DeleteGroupDialog group={this.props.group}
          onCancel={this.props.cancelDeleteGroup} onConfirm={this.props.deleteGroup} />

        <div className="row">
          <div className="col-xs-12 wrapper">
            <ButtonToolbar className="pull-right">
              <Button bsSize="xsmall" onClick={() => this.refresh()} disabled={this.props.groups.loading}>
                <i className="icon icon-budicon-257"></i>
                Refresh
              </Button>
              <Button bsStyle="primary" bsSize="xsmall" disabled={this.props.groups.loading} onClick={() => this.props.createGroup()}>
                <i className="icon icon-budicon-337"></i>
                Create
              </Button>
            </ButtonToolbar>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 wrapper">
            <Error message={this.props.groups.error} />
            <LoadingPanel show={this.props.groups.loading}>
              <GroupsTable loading={this.props.groups.loading} groups={this.props.groups.records}
                onEdit={this.props.editGroup} onDelete={this.props.requestingDeleteGroup} />
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

export default connect(mapStateToProps, { ...GroupActions })(GroupsContainer);
