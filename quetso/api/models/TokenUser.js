
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
    pageId:{
      type:'string',
      required:true
    },
    pageName:{
      type:'string',
      required:true
    },
    access_token:{
      type:'string',
      required:true
    },
    cookie:{
      type:'string',
      required:true
    },
    live:{
      type:'boolean',
      defaultsTo:true
    }

  },
  beforeCreate:async function(val,callback){
    let list_hide = await Hide.find({page_ID:val.pageId,user_id:val.user_id});
    for(let h of list_hide){
      if(h.scan){
        h.status = 'active';
      }else{
        h.status = 'stop';
      }
      await Hide.update({id:h.id}).set(h);
    }
    return callback();
  }
  /*
  beforeDestroy:async function(val,callback){

    let find_tokenuser = await TokenUser.find(val);
    if(find_tokenuser.length > 0){
      let id_page = find_tokenuser[0].pageId;
      let user_id = find_tokenuser[0].user_id;
      await Hide.destroy({id_page,user_id});
    }
    
    return callback();
  }
  */

};

