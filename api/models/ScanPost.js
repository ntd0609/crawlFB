/**
 * ScanPost.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
let GetTime = function(unxtime){
   let time = new Date(unxtime*1000);
   let date = time.getDate();
   let month = time.getMonth()+1;
   let year = time.getFullYear();
   return date+'/'+month+'/'+year;
};
 module.exports = {

  attributes: {
   
    user_id:{
      type:'string',
      required:true
    },
    status_id:{
    type:'number',
    isIn:[0,1,2],
    defaultsTo:0
   },
   status_zalo_id:{
    type:'number',
    isIn:[0,1,2],
    defaultsTo:0
   },
    name_post:{
      type:'string',
      required:true
    },
    url_id:{
      type:'string',
      required:true
    },
    post_ID:{
      type:'string',
      required:true
    },
    page_ID:{
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
    phone:{
      type:'string',
      allowNull:true
    },
    type:{
      type:'string',
      isIn:['reaction','comment']
    },
    comment:{
      type:'string',
      defaultsTo:''
    },
    note_id:{
      type:'number',
      defaultsTo:0
    },
    time:{
      type:'number',
      defaultsTo:Date.now()/1000
    },
    note:{
      type:'string',
      defaultsTo:''
    },
    keysearch:{
      type:'string',
      defaultsTo:''
    }

  },
  beforeCreate:async function(val,callback){
   val.keysearch = (val.name_post+val.name+val.post_ID+val.page_ID+val.comment+val.phone).toLowerCase()
    if(val.type === 'comment'){
      let {user_id,url,time} = val;
      await UrlScan.update({user_id,url}).set({last_comment_time:time});
    }
    let find_account = await Account.find({id:val.user_id});
    let {limit_phone} = find_account[0];
    let count_phone = await ScanPost.count({user_id:val.user_id,phone:{'!=':''}});
    
    if(((val.phone || '').length > 0)){
      if(limit_phone < (count_phone+1)){
        let find_LogTokenScan = await LogTokenScan.find({user_id:val.user_id});
        for(let log of find_LogTokenScan){

          await Token.update({id:log.token_id}).set({used:false})
           await LogTokenScan.destroy({user_id:log.user_id});
        }
        return;

        
        
      }else{
      }
    }
    
    return callback();
    

  }
};

