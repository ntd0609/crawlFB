
module.exports = {

  attributes: {
    user_id:{
      type:'string',
      required:true
    },
    title:{
      type:'string',
      required:true
    },
    message:{
      type:'string',
      required:true
    }

  },
  beforeDestroy:async function(val,callback){
    let messagesample_id = val.where.id;
    await Attachment.destroy({messagesample_id});
    return callback();
  }
};

