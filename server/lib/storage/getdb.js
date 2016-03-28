var _db = null;

module.exports.init = (db) => {
  _db = db;
};

module.exports.getDb = () => {
  if (!_db) {
    throw new Error('The database has not been initialized.');
  }

  return _db;
};
