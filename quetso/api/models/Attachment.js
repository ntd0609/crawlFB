/**
 * Attachment.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
const fs = require('fs');
module.exports = {

  attributes: {

    messagesample_id:{
      type:'string',
      required:true
    },
    url:{
      type:'string',
      required:true
    }

  },
  beforeCreate:async function(val,callback){
    await Attachment.destroy({url:val.url});
    return callback();
  },
  beforeDestroy:async function(val,callback){
    let find_attachment = await Attachment.find(val.where);
    for(let {url} of find_attachment){
      fs.unlinkSync('./client/static/'+url);
    }
    return callback();
  }
};

