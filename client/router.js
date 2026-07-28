import { createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import routes from './routes';

const rawBasePath = (window.config && window.config.BASE_PATH) || '/';
// react-router basename: strip the trailing slash but keep a bare "/" as-is.
export const basename = rawBasePath === '/' ? '/' : rawBasePath.replace(/\/$/, '');

// Data router built from the same <Route> tree the app renders. It owns its own
// history internally, so there is no shared history instance to wire up and no
// v5Compat listener quirk to work around.
export const router = createBrowserRouter(createRoutesFromElements(routes()), { basename });

// Thunks navigate outside the component tree, where useNavigate/<Link> are not
// available. The data router exposes a stable navigate() we can call from
// anywhere; it applies the basename itself, so no manual prefixing is needed.
export function navigateTo(to) {
  return router.navigate(to);
}
