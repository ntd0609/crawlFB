/**
 * UrlScan.js
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
    page_ID:{
      type:'string',
      required:true
    },
    post_ID:{
      type:'string',
      required:true
    },
    feedback_ID:{
      type:'string',
      required:true
    },
    name_post:{
      type:'string',
      required:true
    },
    url:{
      type:'string',
      required:true
    },
    log:{
      collection:'LogTokenScan',
      via:'url_id'
    },
    status:{
      type:'boolean',
      defaultsTo:false
    },
    count_comment_old:{
      type:'number',
      defaultsTo:0
    },
    count_comment_new:{
      type:'number',
      defaultsTo:0
    },

    push:{
      type:'number',
      defaultsTo:0
    },
    last_time:{
      type:'number',
      defaultsTo:0
    },
    delay:{
      type:'number',
      defaultsTo:5
    },
    time_test:{
      type:'number',
      defaultsTo:0
    },
    hide_comment:{
      type:'boolean',
      defaultsTo:true
    },
    show_comment:{
      type:'boolean',
      defaultsTo:false
    },
    keysearch:{
      type:'string',
      defaultsTo:''
    },
    

  },
  
  beforeCreate:async function(val,callback){
    val.keysearch = val.page_ID+val.post_ID+val.name_post.toLowerCase();
    return callback();
  },
  beforeUpdate:async function(val,callback){
    if(val.count_comment_old && val.count_comment_new){
      val.push = val.count_comment_new - val.count_comment_old;
    }
    return callback();
  }

};

