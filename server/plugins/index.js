module.exports = [
  { register: require('./auth') },
  { register: require('./handlers') },
  { register: require('./html') },
  { register: require('./routes') },
  { register: require('./reply-decorators') },
  { register: require('./storage') }
];
