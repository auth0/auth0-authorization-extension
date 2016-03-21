import React, { Component } from 'react';
import { Error, Confirm, LoadingPanel } from '../Dashboard';

class ApplicationGroupRemoveDialog extends Component {
  constructor() {
    super();
    this.confirm = this.confirm.bind(this);
    this.clear = this.clear.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.applicationGroup !== this.props.applicationGroup;
  }

  confirm() {
    this.props.onConfirm(this.props.applicationGroup.get('applicationId'), this.props.applicationGroup.get('groupId'));
  }

  clear() {
    this.props.onCancel();
  }

  render() {
    const { requesting, isRemove, error, loading, application, group } = this.props.applicationGroup.toJS();
    const title = `Remove group from ${application.name}`;

    return (
      <Confirm title={ title } show={ requesting && isRemove } loading={ loading } onCancel={ this.clear } onConfirm={ this.confirm }>
        <LoadingPanel show={ loading } spinnerStyle={{ height: '40px', width: '40px' }} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
          <Error message={ error } />
          <p>Do you really want to remove <strong>{ group.name }</strong> from <strong>{ application.name }</strong>?</p>
        </LoadingPanel>
      </Confirm>
    );
  }
}

ApplicationGroupRemoveDialog.propTypes = {
  applicationGroup: React.PropTypes.object.isRequired,
  onCancel: React.PropTypes.func.isRequired,
  onConfirm: React.PropTypes.func.isRequired
};

export default ApplicationGroupRemoveDialog;
