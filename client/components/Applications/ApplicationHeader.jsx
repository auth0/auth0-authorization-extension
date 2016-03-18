import React, { Component } from 'react';

import './ApplicationHeader.css';

class ApplicationHeader extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.application !== this.props.application || nextProps.loading !== this.props.loading;
  }

  getPicture(application) {
    if (application && application.get('record').get('name')) {
      return `https://cdn.auth0.com/avatars/${application.get('record').get('name').slice(0, 2).toLowerCase()}.png`;
    }

    return 'https://cdn.auth0.com/avatars/ap.png';
  }

  getDescription(application) {
    return <span className="application-label application-head-description">{application.get('record').get('client_id')}</span>;
  }

  render() {
    const { application } = this.props;

    if (!application || application.get('loading')) {
      return <div></div>;
    }

    return (
      <div className="application-header">
        <img className="img-polaroid" src={this.getPicture(application)} />
          <div className="application-bg-box" style={{ position: 'relative', height: '120px', overflow: 'hidden' }}>
            <img className="application-bg" src={this.getPicture(application)} />
            <div className="box-content">
              <div className="name-area">
                <h4>
                  <span className="name application-head-name">
                    { application.get('record').get('name') || application.get('record').get('client_id') }
                  </span>
                  {this.getDescription(application)}
                </h4>
              </div>
            </div>
        </div>
      </div>
    );
  }
}

ApplicationHeader.propTypes = {
  application: React.PropTypes.object.isRequired,
  loading: React.PropTypes.bool
};

export default ApplicationHeader;
