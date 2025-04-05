/**
 * Data.js
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
    phone:{
      type:'string',
      allowNull:true
    }
    

  },
  beforeCreate:async function(val,callback){
    await Data.destroy({uid:val.uid});
    return callback();
  }
};

