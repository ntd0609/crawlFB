const {server:{port}} = require('../../nuxt.config.js');
module.exports = {
  datastores: {
    default: {
       adapter: 'sails-mongo',
       url: 'mongodb://ntd0609:eofbvv1qRnAOf33s@ac-foe8yzd-shard-00-00.dolbl8d.mongodb.net:27017,ac-foe8yzd-shard-00-01.dolbl8d.mongodb.net:27017,ac-foe8yzd-shard-00-02.dolbl8d.mongodb.net:27017/?ssl=true&replicaSet=atlas-q9cew6-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0',
    },
  },

  models: {
    migrate: 'safe',
  },

  blueprints: {
    shortcuts: false,
  },

  security: {
    cors: {
       allRoutes: true,
  allowOrigins: '*',
    },
  },

  session: {

    // adapter: 'connect-redis',
    // url: 'redis://user:password@localhost:6379/dbname',

    cookie: {
      // secure: true,
      maxAge: 24 * 60 * 60 * 1000,  // 24 hours
    },

  },

  sockets: {
     onlyAllowOrigins: [],

    // adapter: 'socket.io-redis',
    // url: 'redis://user:password@bigsquid.redistogo.com:9562/dbname',
  },

  log: {
    level: 'debug'
  },

  http: {
    cache: 365.25 * 24 * 60 * 60 * 1000, // One year

    // trustProxy: true,

  },

   port,

  ssl:{
    ca:require('fs').readFileSync(__dirname+'/ssl/data.ca-bundle','UTF-8'),
    key:require('fs').readFileSync(__dirname+'/ssl/data.key','UTF-8'),
    cert:require('fs').readFileSync(__dirname+'/ssl/data.crt','UTF-8')
  },


  custom: {

  }
};
