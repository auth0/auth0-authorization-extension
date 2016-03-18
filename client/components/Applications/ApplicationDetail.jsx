import React, { Component } from 'react';
import { Error, Json, LoadingPanel } from '../Dashboard';

class ApplicationDetail extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.application !== this.props.application;
  }

  render() {
    const { record, error, loading } = this.props.application.toJS();
    return (
      <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
        <Error message={error}>
          <Json jsonObject={record} />
        </Error>
      </LoadingPanel>
    );
  }
}

ApplicationDetail.propTypes = {
  application: React.PropTypes.object.isRequired
};

export default ApplicationDetail;
