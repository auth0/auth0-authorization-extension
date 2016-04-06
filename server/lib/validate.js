import validator from 'validate.js';

export const validatePermission = (permission) => validator(permission, {
  name: {
    presence: true,
    format: {
      pattern: /^[a-z0-9_\-\:]+$/,
      message: 'Only lowercase characters, numbers and "-", "_" are allowed.'
    },
    length: {
      minimum: 3,
      tooShort: 'Please enter a name with at least 3 characters.'
    }
  },
  description: {
    presence: true
  },
  client_id: {
    presence: true
  }
});

export const validateRole = (role) => validator(role, {
  name: {
    presence: true,
    format: {
      pattern: /^[a-z0-9_\-\:]+$/,
      message: 'Only lowercase characters, numbers and "-", "_" are allowed.'
    },
    length: {
      minimum: 3,
      tooShort: 'Please enter a name with at least 3 characters.'
    }
  },
  description: {
    presence: true
  }
});

export const validateGroup = (group) => validator(group, {
  name: {
    presence: true,
    length: {
      minimum: 3,
      tooShort: 'Please enter a name with at least 3 characters.'
    }
  }
});

export const validateGroupMapping = (groupMapping) => validator(groupMapping, {
  connectionName: {
    presence: true
  },
  groupName: {
    presence: true,
    length: {
      minimum: 3,
      tooShort: 'Please enter a group name with at least 3 characters.'
    }
  }
});
