import React, { Component, PropTypes } from 'react';
import connectContainer from 'redux-static';
import { configurationActions } from '../actions';
import RuleSettings from '../components/Configuration/RuleSettings';

export default connectContainer(class extends Component {
  static stateToProps = (state) => ({
    configuration: state.configuration
  });

  static actionsToProps = {
    ...configurationActions
  }

  static propTypes = {
    configuration: PropTypes.object,
    fetchConfiguration: PropTypes.func.required,
    saveConfiguration: PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.fetchConfiguration();
  }

  render() {
    return (
      <RuleSettings
        configuration={this.props.configuration}
        saveConfiguration={this.props.saveConfiguration}
      />
    );
  }
});
