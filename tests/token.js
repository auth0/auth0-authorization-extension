let token = null;

export const generateToken = () => {
  // TODO: generate token here
  token = null;
};

export const getToken = () => {
  if (!token) throw new Error('No token created');
  return token;
};
