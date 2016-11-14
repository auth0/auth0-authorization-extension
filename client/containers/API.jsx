import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { configurationActions } from '../actions';
import APISettings from '../components/API/APISettings';

export default connectContainer(class API extends Component {
  static stateToProps = (state) => ({
    configuration: state.configuration
  });

  static actionsToProps = {
    ...configurationActions
  }

  static propTypes = {
    configuration: PropTypes.object.isRequired,
    fetchConfigurationResourceServer: PropTypes.func.isRequired,
    saveConfigurationResourceServer: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchConfigurationResourceServer();
  }

  render() {
    return (
      <APISettings
        configuration={this.props.configuration}
        saveConfigurationResourceServer={this.props.saveConfigurationResourceServer}
      />
    );
  }
});
