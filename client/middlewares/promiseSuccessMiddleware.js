export default function normalizeErrorMiddleware() {
  return () =>
    next => action => {
      next(action);

      if (action && action.meta && action.type.endsWith('_FULFILLED') && action.meta.onSuccess) {
        action.meta.onSuccess(action.payload);
      }
    };
}
