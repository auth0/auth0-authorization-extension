import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';

import { Error, Json, LoadingPanel } from '@a0/auth0-extension-ui';

class LogDialog extends Component {
  render() {
    const { logId, error, loading, onClose } = this.props;
    if (logId === null) {
      return <div />;
    }

    const log = this.props.log.toJS();
    return (<Modal show={logId !== null} onHide={onClose}>
      <Modal.Header closeButton={!loading}>
        <Modal.Title>Log - <span>{log.type || 'Log Record'}</span></Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <LoadingPanel
          show={loading} spinnerStyle={{ height: '16px', width: '16px' }}
          animationStyle={{ paddingTop: '0px', paddingBottom: '0px', marginTop: '0px', marginBottom: '10px' }}
        >
          <Error message={error}>
            <Json jsonObject={log} />
          </Error>
        </LoadingPanel>
      </Modal.Body>
      <Modal.Footer>
        <ButtonToolbar>
          <Button size="sm" disabled={loading} onClick={onClose}>
            <i className="icon icon-budicon-501" /> Cancel
          </Button>
        </ButtonToolbar>
      </Modal.Footer>
    </Modal>);
  }
}

LogDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  log: PropTypes.object.isRequired,
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  logId: PropTypes.string
};

export default LogDialog;
