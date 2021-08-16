const basicAuth = require('express-basic-auth');

const basicAuthUsers = {};
basicAuthUsers[process.env.BASIC_AUTH_USER] = process.env.BASIC_AUTH_PASSWORD;

function basicAuthMw() {
  return (req, res, next) => {
    if (process.env.AUTH_TYPE === 'BASIC_AUTH') {
      basicAuth({
        users: basicAuthUsers,
        challenge: true,
        realm: 'vcs-demo-server'
      })(req, res, next);
    } else {
      next();
    }
  };
}

module.exports = {
  basicAuth: basicAuthMw
}