/**
 * Rule.js
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
    list_status:{
      type:'json',
      defaultsTo:[
      {type:'success',hour:0,disabled:true},
      {type:'primary',hour:1,disabled:false},
      {type:'warning',hour:2,disabled:false},
      {type:'danger',hour:3,disabled:false}
      ]
    }

  },
  beforeCreate:async function(val,callback){
    await Rule.destroy({});
    return callback();
  }

};

