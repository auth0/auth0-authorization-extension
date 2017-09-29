import React from 'react'; // eslint-disable-line no-unused-vars
import { render } from 'react-dom';
import DevTools from './containers/DevTools.jsx'; // eslint-disable-line no-unused-vars

module.exports = (store) => {
  const popup = window.open(null, 'Redux DevTools', 'menubar=no,location=no,resizable=yes,scrollbars=no,status=no');
  popup.location.reload();

  setTimeout(() => {
    popup.document.write('<div id="react-devtools-root"></div>');
    render(
      <DevTools store={store} />,
      popup.document.getElementById('react-devtools-root')
    );
  }, 10);
};
