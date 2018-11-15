const jwt = require('jsonwebtoken');
const Config = require('../config');

module.exports = {
  sign: (data, options = {}) => {
    return jwt.sign(data, Config.TokenSecret, options);
  }
};