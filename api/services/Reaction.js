const request = require('request-promise');

let waitTime = time=>{
    return new Promise(resolve=>{
        setTimeout(function(){
            return resolve(time)
        },time)
    });
};

let Reaction = async function(url_id,user_id,token_id = null,accessToken = null,cursor = null){

    let find_UrlScan = await UrlScan.find({id:url_id});
    if(find_UrlScan.length === 0) return;
    
    let {post_ID,page_ID,feedback_ID,name_post,last_comment_time} = find_UrlScan[0];
    

    

    if(!token_id){

        let t = await OneToken();
        token_id = t.token_id;
        accessToken = t.access_token;
        if(!token_id) return;
        await LogTokenScan.create({user_id,token_id,url_id,type:'reaction'});
    }
    

    
    
    let options = {
        url:'https://graph.facebook.com/graphql',
        method:'POST',
        headers:{
            'user-agent':'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
        },
        qs:{
            access_token:accessToken
        },
        form:{
            variables:JSON.stringify({
                "count":10,
                cursor,
                "feedbackTargetID":feedback_ID,
                "reactionID":null,
                "reactionType":"NONE",
                "scale":1,
                "stagesSessionID":null,
                "id":feedback_ID
            }),
            server_timestamps: true,
            doc_id:'4463601293718706',
            fb_api_caller_class: 'RelayModern',
            fb_api_req_friendly_name: 'CometUFIReactionsDialogTabContentRefetchQuery'
        }
    };

    let responseText = await request(options);
    let {data:{node:{reactors:{edges,page_info}}}} = JSON.parse(responseText);
    for(let {node} of edges){
        try{
            let uid = node.id;
            let name = node.name;
            let type = 'reaction';
            let time = Date.now()/1000;
            let find_Scanpost =  await  ScanPost.find({user_id,url_id,uid,time,type});
            if(find_Scanpost.length === 0){
                let phone_in_comment =  [];
                let find_phone_data = await Data.find({uid});
                let phone = find_phone_data.length > 0 ? find_phone_data[0].phone : '';
                let phone_new = phone_in_comment.filter(e=>e.length > 0).join(',');
                if((phone_new !== phone) && (phone_new[0] === '0')) {
                    phone = phone_new;
                    await Data.create({uid,phone});
                }
                await ScanPost.findOrCreate({url_id,user_id,uid,type},{name_post,url_id,time,user_id,post_ID,page_ID,uid,name,phone,type});
                

            }
        }catch(error){

        }
    }

    let find_logtokenscan = await LogTokenScan.find({url_id,token_id,type:'reaction'});


    if(page_info.has_next_page && (find_logtokenscan.length > 0)){

     return await Reaction(url_id,user_id,token_id,accessToken,page_info.end_cursor)
 }else{
    return
}


};
let reset = async function(url_id){
 let list_log = await LogTokenScan.find({url_id,type:'reaction'});
 for(let {url_id,token_id} of list_log){
    await LogTokenScan.destroy({url_id,type:'reaction'});
    await Token.update({id:token_id}).set({used:false});
}
return;
};
let make = async (url_id,user_id)=>{
    let find_logtokenscan = await LogTokenScan.find({url_id,type:'reaction'});
    if(find_logtokenscan.length > 0) return;
    
    try{
     await Reaction(url_id,user_id);

    await reset(url_id);
 }catch(error){

    await reset(url_id);
    try{
        let {token_id} = await OneToken();
        await Token.update({id:token_id}).set({used:false});
        return await make(url_id,user_id)

    }catch(het){

    }
   


}
return;
};
module.exports = make;