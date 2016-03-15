import React, { Component } from 'react';

import './GroupHeader.css';

class GroupHeader extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.group !== this.props.group || nextProps.loading !== this.props.loading;
  }

  getPicture(group) {
    if (group && group.name) {
      return `https://cdn.auth0.com/avatars/${group.name.slice(0, 2).toLowerCase()}.png`;
    }

    return 'https://cdn.auth0.com/avatars/gr.png';
  }

  getDescription(group) {
    if (!group.description) {
      return <div></div>;
    }

    return <span className="group-label group-head-description">{ group.description }</span>;
  }

  render() {
    const { group, loading, error } = this.props;

    if (!group || loading || error) {
      return <div></div>;
    }

    return (
      <div className="group-header">
        <img className="img-polaroid" src={this.getPicture(group)} />
          <div className="group-bg-box" style={{ position: 'relative', height: '120px', overflow: 'hidden' }}>
            <img className="group-bg" src={this.getPicture(group)} />
            <div className="box-content">
              <div className="login-count">
                <span className="lined-text">Logins Count:</span>
                <strong>{group.logins_count || 0}</strong>
              </div>
              <div className="name-area">
                <h4>
                  <span className="name group-head-name">
                    { group.name || group.id }
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
  loading: React.PropTypes.bool.isRequired,
  error: React.PropTypes.object
};

export default GroupHeader;
