import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

// react-router-dom 6 dropped the route props (params/location) that the class
// containers rely on (this.props.params.id, this.props.location.query). This
// injects RR6 hook values as props so those class components keep working
// without being rewritten as function components.
export default function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Preserve the RR3 location.query.* shape a couple of containers read.
    const query = Object.fromEntries(new URLSearchParams(location.search));

    return (
      <Component
        {...props}
        params={params}
        location={{ ...location, query }}
        navigate={navigate}
      />
    );
  }

  return ComponentWithRouterProp;
}
