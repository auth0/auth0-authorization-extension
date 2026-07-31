import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { Button, Modal } from 'react-bootstrap';
import { Multiselect } from '@a0/auth0-extension-ui';

import createForm from '../../utils/createForm';

export default createForm('groupMembers', class GroupMembersDialog extends React.Component {

  static propTypes = {
    group: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    fetchUsers: PropTypes.func.isRequired,
    resetFetchUsers: PropTypes.func.isRequired,
    totalUsers: PropTypes.number,
    users: PropTypes.array,
    loading: PropTypes.bool.isRequired,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.getOptions = this.getOptions.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  getOptions(input, callback) {
    const useSEv3 = window.config.SEARCH_ENGINE === 'v3';
    const query = useSEv3
      ? `name:${input}* OR email:${input}*`
      : `name:${input}* OR email.raw:${input}* OR user_metadata.name:${input}*`;
    this.props.fetchUsers(query, null, true, null, null, callback);
  }

  onClose() {
    this.props.reset();
    this.props.onClose();
    this.props.resetFetchUsers();
  }

  handleSubmit = () => {
    this.props.handleSubmit();
    this.props.resetFetchUsers();
  }

  render() {
    const group = this.props.group.toJS();
    const title = `Add members to ${group.record.name}`;
    const isVisible = group.isEditUsers;

    return (
      <Modal show={isVisible} className="modal-overflow-visible" onHide={this.onClose}>
        <Modal.Header closeButton={!group.loading} className="has-border">
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="modal-description">Select one or more users you wish to add to this group.</p>
          <form className="form-horizontal">
            <div className="row">
              <div className="col-xs-12">
                <Field
                  name="members"
                  id="members"
                  component={Multiselect}
                  loadOptions={_.debounce((input, callback) => this.getOptions(input, callback), process.env.MULTISELECT_DEBOUNCE_MS)}
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button size="lg" variant="transparent" disabled={group.loading || group.submitting} onClick={this.onClose}>
            Cancel
          </Button>
          <Button size="lg" variant="primary" disabled={group.loading || group.submitting} onClick={this.handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
});
