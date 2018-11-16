const jwt = require('jsonwebtoken');
const Config = require('../config');

module.exports = {
  
  // takes some data and signs it uses a secret
  sign: (data, options = {}) => {
    return jwt.sign(data, Config.TokenSecret, options);
  },

  // checks a request header to see if request is allowed
  verifyToken: (req, res, next) => {

    const token = req.headers['x-access-token'];

    if (!token) {
      return res.status(403).send({
        status: 403,
        statusText: 'No token provided.'
      });
    }

    jwt.verify(token, Config.TokenSecret, (err, decoded) => {

      if (err) {
        return res.status(500).send({
					auth: false,
					message: 'Failed to authenticate token'
				});
      }	
      
      req.decoded = decoded;
      next();
    });
  },

  // only admins can do this
  verifyAdminToken: (req, res, next) => {

    const token = req.headers['x-access-token'];

    if (!token) {
      return res.status(403).send({
        status: 403,
        statusText: 'No token provided.'
      });
    }

    jwt.verify(token, Config.TokenSecret, (err, decoded) => {

      if (err) {
				return res.status(500).send({
					auth: false,
					message: 'Failed to authenticate token'
				});
      }	
      
      // make sure you have your permissions or higher
      if (decoded.scope !== 'admin' || decoded.scope !== 'developer') {
        return res.status(401).send({
					auth: false,
					message: 'You are unauthorized to perform this action.'
				});
      }

      req.decoded = decoded;
      next();
    });
  },

  // make sure only developers can do this
  verifyDeveloperToken: (req, res, next) => {

    const token = req.headers['x-access-token'];

    if (!token) {
      return res.status(403).send({
        status: 403,
        statusText: 'No token provided.'
      });
    }

    jwt.verify(token, Config.TokenSecret, (err, decoded) => {

      if (err) {
				return res.status(500).send({
					auth: false,
					message: 'Failed to authenticate token'
				});
      }	
      
      // make sure you have your permissions or higher
      if (decoded.scope !== 'developer') {
        return res.status(401).send({
					auth: false,
					message: 'You are unauthorized to perform this action.'
				});
      }
      
      req.decoded = decoded;
      next();
    });
  }

};