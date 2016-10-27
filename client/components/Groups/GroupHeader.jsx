import React, { Component } from 'react';
import { EntityHeader } from 'auth0-extension-ui';
import { GroupDeleteDialog, GroupDialog } from './';
import { Button, ButtonToolbar, OverlayTrigger, Tooltip } from 'react-bootstrap';

class GroupHeader extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.group !== this.props.group || nextProps.loading !== this.props.loading;
  }

  getPicture(group) {
    if (group && group.get('record').get('name')) {
      return `https://cdn.auth0.com/avatars/${group.get('record').get('name').slice(0, 2).toLowerCase()}.png`;
    }

    return 'https://cdn.auth0.com/avatars/gr.png';
  }

  getDescription(group) {
    if (!group.get('record').get('description')) {
      return <div></div>;
    }

    return <span className="group-label group-head-description">{group.get('record').get('description')}</span>;
  }

  editGroup = () => {
    this.props.editGroup(this.props.groupJSON.record);
  }

  save = () => {
    this.props.saveGroup(this.props.groupJSON.record);
  }

  clear = () => {
    this.props.closeUpdate();
  }


  requestDeleteGroup = () => {
    this.props.requestDeleteGroup(this.props.groupJSON.record);
  }

  confirmDelete = () => {
    this.props.deleteGroup(this.props.group.groupJSON.record);
  }

  cancelDelete = () => {
    this.props.closeDelete();
  }

  render() {
    const { group, members } = this.props;

    if (!group || group.get('loading') || group.get('error')) {
      return <div></div>;
    }

    return (
      <div>
        <GroupDialog group={group} onSave={this.save} onClose={this.clear} />
        <GroupDeleteDialog group={group} onCancel={this.cancelDelete} onConfirm={this.confirmDelete} />
        <EntityHeader
          imgSource={this.getPicture(group)}
          primaryText={group.get('record').get('name') || group.get('record').get('_id')}
          secondaryText={this.getDescription(group)}
        >
          <OverlayTrigger placement="top" overlay={<Tooltip id="edit-group">Edit group</Tooltip>}>
            <Button onClick={this.editGroup} className="table-action" bsSize="small">
              <i className="icon icon-budicon-272" style={{ marginRight: 0 }} />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger placement="top" overlay={<Tooltip id="delete-group">Delete group</Tooltip>}>
            <Button onClick={this.requestDeleteGroup} className="table-action" bsSize="small"
                    style={{ marginLeft: '10px' }}>
              <i className="icon icon-budicon-264" style={{ marginRight: 0 }} />
            </Button>
          </OverlayTrigger>
        </ EntityHeader>
      </div>
    );
  }
}

GroupHeader.propTypes = {
  group: React.PropTypes.object.isRequired,
  members: React.PropTypes.object.isRequired
};

export default GroupHeader;
