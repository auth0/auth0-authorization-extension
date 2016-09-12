import React, { Component } from 'react';
import EntityHeader from '../Dashboard/EntityHeader';

import { Button, ButtonToolbar } from 'react-bootstrap';

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

  render() {
    const { group, members } = this.props;

    if (!group || group.get('loading') || group.get('error')) {
      return <div></div>;
    }

    return (
      <EntityHeader
        imgSource={this.getPicture(group)}
        primaryText={group.get('record').get('name') || group.get('record').get('_id')}
        secondaryText={this.getDescription(group)}
      >
        <Button className="table-action" bsSize="small">
          <i className="icon icon-budicon-272" style={{ marginRight: 0 }} />
        </Button>
        <Button className="table-action" bsSize="small" style={{ marginLeft: '10px' }}>
          <i className="icon icon-budicon-264" style={{ marginRight: 0 }} />
        </Button>
      </ EntityHeader>
    );
  }
}

GroupHeader.propTypes = {
  group: React.PropTypes.object.isRequired,
  members: React.PropTypes.object.isRequired
};

export default GroupHeader;
