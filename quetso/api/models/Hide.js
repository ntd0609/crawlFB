

module.exports = {

  attributes: {
    user_id:{
      type:'string',
      required:true
    },
    post_ID:{
      type:'string',
      required:true
    },
    title:{
      type:'string',
      required:true
    },
    page_ID:{
      type:'string',
      required:true
    },
    pageName:{
      type:'string'
    },
    feedback_ID:{
      type:'string',
      required:true
    },
    delay:{
      type:'number',
      defaultsTo:5
    },
    status:{
      type:'string',
      isIn:['active','stop','cookie'],
      defaultsTo:'active'
    },
    scan:{
      type:'boolean',
      defaultsTo:true
    },
    option:{
      type:'string',
      isIn:['an-so','tat-ca'],
      defaultsTo:'tat-ca'
    },
    keysearch:{
      type:'string',
      defaultsTo:''
    }

  },
  beforeCreate:async function(val,callback){
    let {user_id,post_ID,page_ID,title,pageName} = val;
    await Hide.destroy({user_id,post_ID,page_ID});
    val.keysearch = post_ID+title.toLowerCase()+page_ID+pageName.toLowerCase();
    return callback();
  },
  beforeDestroy:async function(val,callback){
    await BlockedKeyword.destroy({hide_id:val.where.id});
    return callback();
  }
};

