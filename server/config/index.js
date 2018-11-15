const config = require('./config');

module.exports = {
  DatabaseEndpoint: config.dbEndpoint,
  DatabaseUser:     config.dbUser,
  DatabasePassword: config.dbPassword,
  TokenSecret:      config.tokenSecret,
  SaltRounds:       config.saltRounds
}