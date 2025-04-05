const request = require('request-promise');
Array.prototype.random = function(){
  return this[Math.floor(Math.random()*this.length)];
};
let comment = async (comment,post_ID,page_ID,access_token)=>{
    let list_comment = comment.split('\n').map(e=>e.trim()).filter(e=>e.length > 0);
    let message = list_comment.random();
    
    try{
        let options = {
            url: 'https://graph.facebook.com/v11.0/'+page_ID+'_'+post_ID+'/comments',
            method: 'POST',
            qs: {
                message,
                access_token
            }
        };
       await request(options);
        
       
    }catch(error){

    }
    return;
};

module.exports = async (page_ID,post_ID,message)=>{
    let list_token = await Token.find({live:true});
    let map_like = list_token.map(({access_token})=>comment(message,post_ID,page_ID,access_token));
    return await Promise.all(map_like);
};