import React from 'react';
import expect from 'expect';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import withRouter from '../../../../client/utils/withRouter';

// Renders a probe wrapped by withRouter at the given path and returns the props
// the HOC injected into it.
const renderAt = (path, ownProps = {}) => {
  let injected;
  const Probe = (props) => {
    injected = props;
    return React.createElement('div', null, 'probe');
  };
  const Wrapped = withRouter(Probe);

  render(
    React.createElement(
      MemoryRouter,
      { initialEntries: [ path ] },
      React.createElement(
        Routes,
        null,
        React.createElement(Route, {
          path: '/groups/:id',
          element: React.createElement(Wrapped, ownProps)
        })
      )
    )
  );

  return injected;
};

describe('#Client-Utils-withRouter', () => {
  it('injects route params from the matched path', () => {
    expect(renderAt('/groups/42').params).toEqual({ id: '42' });
  });

  it('maps location.search into the RR3-style location.query object', () => {
    const props = renderAt('/groups/42?foo=bar&baz=1');
    expect(props.location.query).toEqual({ foo: 'bar', baz: '1' });
  });

  it('provides an empty query object when there is no search string', () => {
    expect(renderAt('/groups/42').location.query).toEqual({});
  });

  it('preserves the underlying location fields alongside query', () => {
    const props = renderAt('/groups/42?foo=bar');
    expect(props.location.pathname).toBe('/groups/42');
    expect(props.location.search).toBe('?foo=bar');
  });

  it('injects a navigate function', () => {
    expect(typeof renderAt('/groups/42').navigate).toBe('function');
  });

  it('forwards the wrapped component own props through', () => {
    expect(renderAt('/groups/42', { extra: 'passed' }).extra).toBe('passed');
  });
});
