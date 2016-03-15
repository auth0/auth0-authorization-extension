import React, { Component } from 'react';

import './GroupHeader.css';

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
      <div className="group-header">
        <img className="img-polaroid" src={this.getPicture(group)} />
          <div className="group-bg-box" style={{ position: 'relative', height: '120px', overflow: 'hidden' }}>
            <img className="group-bg" src={this.getPicture(group)} />
            <div className="box-content">
              <div className="login-count">
                <span className="lined-text">Member Count: </span>
                <strong>{members.get('records').size || 0}</strong>
              </div>
              <div className="name-area">
                <h4>
                  <span className="name group-head-name">
                    { group.get('record').get('name') || group.get('record').get('_id') }
                  </span>
                  {this.getDescription(group)}
                </h4>
              </div>
            </div>
        </div>
      </div>
    );
  }
}

GroupHeader.propTypes = {
  group: React.PropTypes.object.isRequired,
  members: React.PropTypes.object.isRequired
};

export default GroupHeader;
