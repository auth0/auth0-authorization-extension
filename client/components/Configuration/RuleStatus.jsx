import classNames from 'classnames';
import React, { PropTypes, Component } from 'react';

export default class RuleStatus extends Component {
  static propTypes = {
    ruleStatus: PropTypes.object.isRequired,
    goToRules: PropTypes.func,
    goToConfiguration: PropTypes.func,
    goToImportExport: PropTypes.func
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  renderWarning(warning) {
    return (
      <div className="row">
        <div className="col-xs-12">
          <div className="alert alert-warning">
            <strong>Warning</strong> {warning.message}
            <div className="actions pull-right">
              {warning.action}
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { error, record } = this.props.ruleStatus.toJS();

    if (error) {
      return (
        <div className="alert alert-danger">
          <strong>Error</strong> Unable to load configuration status - <i>{error}</i>
        </div>
      );
    }

    if (record && record.rule && !record.rule.exists) {
      const buttonClasses = classNames({
        btn: true,
        'btn-sm': true,
        'btn-warning': true,
        hidden: this.context.router.isActive('configuration/rule')
      });
      return this.renderWarning({
        message: 'The extension still needs to be configured before it can enforce your authorization logic.',
        action: (<button onClick={this.props.goToConfiguration} className={buttonClasses}>Go to Configuration</button>)
      });
    } else if (record && record.rule && !record.rule.enabled) {
      return this.renderWarning({
        message: 'The rule enforcing your authorization logic has been disabled.',
        action: (<button onClick={this.props.goToRules} className="btn btn-sm btn-warning">Go to Rules</button>)
      });
    }

    if (record && record.database &&
      record.database.type === 'default' &&
      record.database.size > process.env.WARN_DB_SIZE) {
      return this.renderWarning({
        message: 'You\'ve almost reached the storage limit of 500 KB.',
        action: (<button onClick={this.props.goToImportExport} className="btn btn-sm btn-warning">Go to Import/Export</button>)
      });
    }

    return null;
  }
}
