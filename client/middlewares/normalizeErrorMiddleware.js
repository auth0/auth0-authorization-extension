export default function normalizeErrorMiddleware() {
  return () => {
    return next => action => {
      if (action && action.type.endsWith('_REJECTED') && action.payload) {
        // Try to get the default error message from the response.
        let errorMessage = action.payload.statusText || action.payload.status || 'Unknown Server Error';

        // Maybe some data is available.
        const error = action.payload.data || action.payload.error;
        if (error) {
          errorMessage = error.message || error;
        }

        action.errorMessage = errorMessage;
      }

      next(action);
    };
  };
}
