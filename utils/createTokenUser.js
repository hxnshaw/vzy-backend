const createTokenUser = (user) => {
  return {
    email: user.email,
    status: user.status,
  };
};

module.exports = createTokenUser;
