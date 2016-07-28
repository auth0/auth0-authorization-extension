import React, { Component, PropTypes } from 'react';

import { connectContainer } from '../utils';
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
    saveConfiguration: PropTypes.func.required,
    fetchConfiguration: PropTypes.func.required
  }

  componentWillMount() {
    this.props.fetchConfiguration();
  }

  render() {
    return <RuleSettings configuration={this.props.configuration} onSave={this.props.saveConfiguration} />;
  }
});
