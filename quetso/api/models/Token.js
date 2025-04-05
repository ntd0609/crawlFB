/**
 * Token.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    
    uid:{
      type:'string',
      required:true
    },
    cookie:{
      type:'string',
      defaultsTo:''
    },
    access_token:{
      type:'string',
      required:true
    },
    name:{
      type:'string',
      allowNull:true
    },
    
    live:{
      type:'boolean',
      defaultsTo:true
    },
    used:{
      type:'boolean',
      defaultsTo:false
    }


  },
  beforeCreate:async function(val,callback){
    await Token.destroy({uid:val.uid,user_id:val.user_id});
    return callback();
  }

};

