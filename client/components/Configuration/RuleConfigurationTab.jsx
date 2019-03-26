import React, { Component, PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import { Field } from 'redux-form';
import { InputSwitchItem, InputText } from 'auth0-extension-ui';
import createForm from '../../utils/createForm';
import './RuleConfigurationTab.styl';

export default createForm('ruleConfigurationForm', class RuleConfigurationForm extends Component {
  constructor(props) {
    super(props);
    this.tabSwitchItems = {
      tokenContents: [
        {
          title: 'Groups',
          description: (<span>Add <strong>groups</strong> to the user object.</span>),
          name: 'groupsInToken'
        },
        {
          title: 'Roles',
          description: (<span>Add <strong>roles</strong> to the user object.</span>),
          name: 'rolesInToken'
        },
        {
          title: 'Permissions',
          description: (<span>Add <strong>permissions</strong> to the user object.</span>),
          name: 'permissionsInToken'
        }
      ],
      persistence: [
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
          description: (<span>Persist <strong>permissions</strong> in the user's application metadata.</span>),
          name: 'persistPermissions'
        }
      ],
      passthrough: [
        {
          title: 'Groups Passthrough',
          description: (<span>Merge the user's groups with groups originating from the IdP.</span>),
          name: 'groupsPassthrough'
        },
        {
          title: 'Roles Passthrough',
          description: (<span>Merge the user's roles with roles originating from the IdP.</span>),
          name: 'rolesPassthrough'
        },
        {
          title: 'Permissions Passthrough',
          description: (<span>Merge the user's permissions with permissions originating from the IdP.</span>),
          name: 'permissionsPassthrough'
        }
      ]
    };
  }
  static propTypes = {
    hash: PropTypes.string,
    submitting: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
    rotateApiKey: PropTypes.func.isRequired
  }

  renderSwitchItem(field) {
    return <Field key={field.name} name={field.name} component={InputSwitchItem} title={field.title} description={field.description} />;
  }

  renderApiKeySection(submitting, hash) {
    return (
      <div className="row">
        <div className="col-xs-2">
          <h5>ApiKey:</h5>
        </div>
        <div className="col-xs-8">
          <div className="api-key-hash">{hash}</div>
        </div>
        <div className="col-xs-2">
          <div className="pull-right">
            <Button bsStyle="primary" disabled={submitting} onClick={this.props.rotateApiKey}>
              <i className="icon-budicon-171"></i>
              Rotate
            </Button>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { handleSubmit, submitting, hash } = this.props;

    return (
      <div>
        { this.renderApiKeySection(submitting, hash) }
        <div className="row">
          <div className="col-xs-10">
            <h4>Authorization information in the <code>user</code> object in Rules</h4>
          </div>
          <div className="col-xs-2">
            <div className="pull-right">
              <Button bsStyle="primary" disabled={submitting} onClick={handleSubmit}>
                Publish Rule
              </Button>
            </div>
          </div>
        </div>
        <div className="cues-container">
          <div className="use-case-box is-active">
            <div className="explainer-text">
              <span className="explainer-text-content">
                Authorization data like groups, roles and permissions can be added to the user object in the rules execution context.
                Rules can then consume this information and use it to add custom claims to tokens or make authorization decisions. 
                See <a target="_blank" href="https://auth0.com/docs/extensions/authorization-extension/v2/rules">Using rules with the Authorization Extension</a> for more information.
              </span>
            </div>
          </div>
        </div>
        <div data-columns="3" className="switchboard switchboard-responsive">
          { this.tabSwitchItems.tokenContents.map(item => this.renderSwitchItem(item)) }
        </div>

        <div className="cues-container">
          <div className="use-case-box is-active">
            <div className="explainer-text">
              <span className="explainer-text-content">
                You might have users that receive groups from the IdP (eg: Active Directory).
                If you want to merge these groups (in order to preserve them) with the groups defined in the Authorization Extesion make sure you enable the following option.
              </span>
            </div>
          </div>
        </div>

        <div data-columns="3" className="switchboard switchboard-responsive">
          { this.tabSwitchItems.passthrough.map(item => this.renderSwitchItem(item)) }
        </div>

        <h4>Persistence</h4>
        <div className="cues-container">
          <div className="use-case-box is-active">
            <div className="explainer-text">
              <span className="explainer-text-content">
                In addition to storing the authorization context in the token you can also choose to persist the information in the user profile.
                This is especially useful if your authorization context is pretty large (eg: many groups or many permissions).
                The data will be stored in the user's <code>app_metadata</code> and you can then use the Management API or the Token Info endpoint to retrieve this information after the user has logged in.
              </span>
            </div>
          </div>
        </div>

        <div data-columns="3" className="switchboard switchboard-responsive">
          { this.tabSwitchItems.persistence.map(item => this.renderSwitchItem(item)) }
        </div>

        <div className="alert alert-warning">
          <strong>Heads up!</strong> There is no synchronization taking place between the data in the Authorization Extension and the user's profile. Any changes made here will only be visible in the user's metadata next time they log in.
        </div>
      </div>
    );
  }
}, {
  enableReinitialize: true
});
