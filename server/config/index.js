let config = {};

try {
  config = require('./config');
} catch(err) {
  config = {
    dbEndpoint:   process.env.dbEndpoint,
    dbUser:       process.env.dbUser,
    dbPassword:   process.env.dbPassword,
    tokenSecret:  process.env.tokenSecret,
    saltRounds:   process.env.saltRounds
  };
}

module.exports = {
  DatabaseEndpoint: config.dbEndpoint,
  DatabaseUser:     config.dbUser,
  DatabasePassword: config.dbPassword,
  TokenSecret:      config.tokenSecret,
  SaltRounds:       config.saltRounds
}