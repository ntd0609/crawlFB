/**
 * Cookie.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    user_id:{
      type:'string',
      required:true
    },
    uid:{
      type:'string',
      required:true
    },
    name:{
      type:'string',
      required:true
    },
    cookie:{
      type:'string',
      required:true
    },
    token_full_permission:{
      type:'string',
      required:true
    },
    fb_dtsg:{
      type:'string',
      required:true
    },
    token_bm:{
      type:'string',
      allowNull:true
    },
    live:{
      type:'boolean',
      defaultsTo:true
    }

  },

};

