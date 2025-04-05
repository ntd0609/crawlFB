/**
 * HistoryComment.js
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
    urlscan_id:{
      type:'string',
      required:true
    }

  },
  beforeCreate:async function(val,callback){
    let {user_id,urlscan_id} = val;
    await HistoryComment.destroy({user_id,urlscan_id});
    return callback();
  }

};

