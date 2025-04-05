/**
 * LogTokenScan.js
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
    token_id:{
      type:'string',
      required:true
    },
    url_id:{
      model:'UrlScan',
      required:true
    },
    type:{
      type:'string',
      isIn:['comment','reaction','old-comment']
    }

  },
  beforeCreate:async function(val,callback){
    if(val.type === 'comment'){
      await UrlScan.update({id:val.url_id}).set({status:true});
      
    }
    await Token.update({id:val.token_id}).set({used:true})
    return callback();
  },
  beforeUpdate:async function(val,callback){
   
    if(val.type === 'comment'){
      await UrlScan.update({id:val.url_id}).set({status:true})
    }
    await Token.update({id:val.token_id}).set({used:true})
    return callback();
  },
  beforeDestroy:async function(val,callback){
    
    if(val.where.and){
      let v = val.where.and.reduce((previous,current)=>({...previous,...current}),{});
      if(v.url_id){
        if(v.type === 'comment'){
          let list_log = await LogTokenScan.find({url_id:v.url_id,type:'comment'});
          for(let log of list_log){
            await Token.update({id:log.token_id}).set({used:false});

          }
          await UrlScan.update({id:v.url_id}).set({status:false});
        
        }
      }
    }

    if(val.direct){
      await Token.update({token_id:val.token_id}).set({used:false});
    }

    return callback();
  },
  


};

