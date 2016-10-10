import classNames from 'classnames';
import React, { PropTypes, Component } from 'react';

export default class RuleStatus extends Component {
  static propTypes = {
    ruleStatus: PropTypes.object.isRequired,
    goToRules: PropTypes.func,
    goToConfiguration: PropTypes.func
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

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

      return (
        <div className="row">
          <div className="col-xs-12">
            <div className="alert alert-warning">
              <strong>Warning</strong> The extension still needs to be configured before it can enforce your authorization logic.
              <div className="actions pull-right">
                <button onClick={this.props.goToConfiguration} className={buttonClasses}>Go to Configuration</button>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (record && record.rule && !record.rule.enabled) {
      return (
        <div className="row">
          <div className="col-xs-12 wrapper">
            <div className="alert alert-warning">
              <strong>Warning</strong> The rule enforcing your authorization logic has been disabled.
              <div className="actions pull-right">
                <button onClick={this.props.goToRules} className="btn btn-sm btn-warning">Go to Rules</button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }
}
