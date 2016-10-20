import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Field } from 'redux-form';
import { InputSwitchItem } from 'auth0-extension-ui';
import createForm from '../../utils/createForm';

export default createForm('persistenceForm', class PersistenceForm extends Component {
  constructor(props) {
    super(props);

    this.tabSwitchItems = [
      {
        title: 'Groups',
        description: (<span>Persist <strong>groups</strong> in the user's application metadata.</span>),
        name: 'persistGroups'
      },
      {
        title: 'Roles',
        description: (<span>Persist <strong>roles</strong> in the user's application metadata.</span>),
        name: 'persistRoles'
      },
      {
        title: 'Permissions',
        description: (<span>Persist <strong>description</strong> in the user's application metadata.</span>),
        name: 'persistPermissions'
      }
    ];
  }

  static propTypes = {
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired
  }

  renderSwitchItem(field) {
    return <Field name={field.name} component={InputSwitchItem} title={field.title} description={field.description} />;
  }

  render() {
    const { handleSubmit, submitting } = this.props;

    return (
      <div>
        <div className="cues-container">
          <div className="use-case-box is-active">
            <div className="explainer-text">
              <span className="explainer-text-content">
                In addition to storing the authorization context in the token you can also choose to persist the information in the user profile.
                This is especially useful if your authorization context is pretty large (eg: many groups or many permissions).
                The data will be stored in the user's app_metadata and you can then use the Management API or the Token Info endpoint to retrieve this information after the user has logged in.
              </span>
            </div>
          </div>
        </div>

        <div data-columns="3" className="switchboard switchboard-responsive">
          { this.tabSwitchItems.map(item => this.renderSwitchItem(item)) }
        </div>

        <div className="pull-right">
          <Button bsStyle="primary" disabled={submitting} onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </div>
    );
  }
});
