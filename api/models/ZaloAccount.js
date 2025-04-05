/**
 * ZaloAccount.js
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
    cookie:{
      type:'string',
      required:true
    },
    imei:{
      type:'string',
      required:true
    },
    secretKey:{
      type:'string',
      required:true
    },
    live:{
      type:'boolean',
      defaultsTo:true
    },
    name:{
      type:'string',
      allowNull:true
    },
    avatar:{
      type:'string',
      allowNull:true
    }


  },

};

