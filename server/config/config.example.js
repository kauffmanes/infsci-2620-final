/*
    Rename this file to config.js and fill in any values that you 
    want to use for development. These configuration items
    should be environmental variables in production.
    (see ./index.js)
*/
module.exports = {
    dbEndpoint: '',     // endpoint of a database
    dbUser: '',         // database user 
    dbPassword: '',     // database password
    tokenSecret: '',    // create a secure token
    saltRounds: 8,      // choose a number of salt rounds for encryption
    ikey: '',           // integration key for duo
    skey: '',           // secret key for duo
    akey: ''            // a key for duo
};