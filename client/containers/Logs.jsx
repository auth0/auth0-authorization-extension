import { Component } from 'react';
import { connect } from 'react-redux';
import { Button, ButtonToolbar } from 'react-bootstrap';

import * as actions from '../actions/log';
import LogDialog from '../components/Logs/LogDialog';
import LogsTable from '../components/Logs/LogsTable';
import { Error, LoadingPanel, TableTotals } from '../components/Dashboard';

class LogsContainer extends Component {
  componentWillMount() {
    this.props.fetchLogs();
  }

  refresh() {
    this.props.fetchLogs();
  }

  loadMore() {
    this.props.fetchLogs(this.props.logs.nextPage);
  }

  createToolbar(isBottom: false) {
    if (isBottom && (!this.props.logs.records || this.props.logs.records.size <= 20)) {
      return <div></div>;
    }

    return <ButtonToolbar className="pull-right">
      <Button bsSize="small" onClick={this.refresh.bind(this)} disabled={this.props.logs.loading}>
        <i className="icon icon-budicon-257"></i> Refresh
      </Button>
      <Button bsStyle="primary" bsSize="small" disabled={this.props.loading} onClick={this.loadMore.bind(this)}>
        <i className="icon icon-budicon-686"></i> Load More
      </Button>
    </ButtonToolbar>;
  }

  render() {
    const { log, logs } = this.props;
    return <div>
        <LogDialog onClose={this.props.clearLog} error={log.error} loading={log.loading} log={log.record} logId={log.id} />
        <div className="row">
          <div className="col-xs-12 wrapper">
            {this.createToolbar(false)}
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 wrapper">
            <Error message={logs.error} />
            <LoadingPanel show={logs.loading}>
              <LogsTable onOpen={this.props.fetchLog} loading={logs.loading} logs={logs.records} />
            </LoadingPanel>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 wrapper">
            <TableTotals currentCount={logs.records.size} totalCount={logs.total} />
            {this.createToolbar(true)}
          </div>
        </div>
      </div>;
  }
}

function mapStateToProps(state) {
  return {
    logs: {
      error: state.logs.get('error'),
      loading: state.logs.get('loading'),
      records: state.logs.get('records'),
      total: state.logs.get('total'),
      nextPage: state.logs.get('nextPage')
    },
    log: {
      record: state.log.get('record'),
      id: state.log.get('logId'),
      error: state.log.get('error'),
      loading: state.log.get('loading')
    }
  };
}

export default connect(mapStateToProps, actions)(LogsContainer);
