import jwtDecode from 'jwt-decode';

module.exports = function readSubject(req, res, next) {
  try {
    const authorizationHeader = req.get('Authorization') || '';
    if (authorizationHeader) {
      const token = authorizationHeader
        .replace('Bearer ', '');
      const decodedToken = jwtDecode(token);
      req.sub = decodedToken.sub;
    }

    next();
  } catch (e) {
    next(e);
  }
};
