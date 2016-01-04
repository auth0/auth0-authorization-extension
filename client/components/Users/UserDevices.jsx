import React, { Component } from 'react';
import { Error, LoadingPanel, Table, TableBody, TableIconCell, TableTextCell, TableHeader, TableColumn, TableRow } from '../Dashboard';

class UserDevices extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.devices !== this.props.devices || nextProps.user !== this.props.user || nextProps.loading !== this.props.loading;
  }

  render() {
    const { error, loading } = this.props;
    if (loading) {
      return <div></div>;
    }

    if (!error && this.props.devices.size === 0) {
      return <div>This user does not have any registered devices.</div>;
    }

    const devices = this.props.devices.toJS();
    return <LoadingPanel show={loading} animationStyle={{ paddingTop: '5px', paddingBottom: '5px' }}>
        <Error message={error} />
        <Table>
          <TableHeader>
            <TableColumn width="3%"/>
            <TableColumn width="70%">Device</TableColumn>
            <TableColumn width="27%"># of Tokens/Public Keys</TableColumn>
          </TableHeader>
          <TableBody>
          {Object.keys(devices).sort().map((device) => {
            return(
              <TableRow key={device}>
                <TableIconCell color="green" icon="243"/>
                <TableTextCell>{device}</TableTextCell>
                <TableTextCell>{devices[device]}</TableTextCell>
              </TableRow>
            );
          })}
          </TableBody>
        </Table>
    </LoadingPanel>;
  }
}

UserDevices.propTypes = {
  error: React.PropTypes.string,
  devices: React.PropTypes.object.isRequired,
  loading: React.PropTypes.bool.isRequired
};

export default UserDevices;
