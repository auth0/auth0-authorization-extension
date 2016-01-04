import React from 'react';
import { createDevTools } from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

let DevTools;
if (process.env.NODE_ENV !== 'production') {
  DevTools = createDevTools(
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
