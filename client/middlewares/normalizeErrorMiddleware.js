export default function normalizeErrorMiddleware() {
  return () => next => action => {
    if (action && action.type.endsWith('_REJECTED') && action.payload) {
      let error = 'Unknown Server Error';
      if (action.payload.code === 'ECONNABORTED') {
        error = 'The connectioned timed out.';
      } else if (action.payload.data && action.payload.data.error) {
        error = action.payload.data.error;
      } else if (action.payload.error) {
        error = action.payload.error;
      } else if (action.payload.response && action.payload.response.data) {
        error = action.payload.response.data;
      }

      if (error && error.message) {
        error = error.message;
      }

      action.errorMessage = error || action.payload.statusText || action.payload.status || 'Unknown Server Error'; // eslint-disable-line no-param-reassign
    }

    next(action);
  };
}