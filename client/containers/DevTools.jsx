import React from 'react';

let DevTools;
if (process.env.NODE_ENV !== 'production') {
  const devTools = require('redux-devtools');
  const LogMonitor = require('redux-devtools-log-monitor');
  const DockMonitor = require('redux-devtools-dock-monitor');
  DevTools = devTools.createDevTools(
    <DockMonitor toggleVisibilityKey={'ctrl-h'}
                 changePositionKey={'ctrl-q'}>
      <LogMonitor theme={'tomorrow'} />
    </DockMonitor>
  );

} else {
  DevTools = React.createClass({
    render: function renderDevTools() {
      return <div />;
    }
  });
}

export default DevTools;
