const request = require('request-promise');

let waitTime = time=>{
    return new Promise(resolve=>{
        setTimeout(function(){
            return resolve(time)
        },time)
    });
};

let GetComment = async function(url_id,user_id,token_id = null,accessToken = null,cursor = null){

    let find_UrlScan = await UrlScan.find({id:url_id});
    if(find_UrlScan.length === 0) return;
    let find_last_comment = await ScanPost.find({url_id,type:'comment'}).sort('time DESC');
    let last_time = find_last_comment.length > 0 ? find_last_comment[0].time : 1;
    let {post_ID,page_ID,feedback_ID,name_post,last_comment_time} = find_UrlScan[0];
    

    

    if(!token_id){

        let t = await OneToken();
        token_id = t.token_id;
        accessToken = t.access_token;
        if(!token_id) return;
        await LogTokenScan.create({user_id,token_id,url_id,type:'old-comment'});
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
                "after":cursor,
                "before":null,
                "displayCommentsFeedbackContext":null,
                "displayCommentsContextEnableComment":null,
                "displayCommentsContextIsAdPreview":null,
                "displayCommentsContextIsAggregatedShare":null,
                "displayCommentsContextIsStorySet":null,
                "feedLocation":"NEWSFEED",
                "feedbackID":feedback_ID,
                "feedbackSource":2,
                "first":50,
                "focusCommentID":null,
                "includeHighlightedComments":false,
                "includeNestedComments":true,
                "initialViewOption":"RECENT_ACTIVITY",
                "isInitialFetch":false,
                "isPaginating":true,
                "last":null,
                "scale":1,
                "topLevelViewOption":null,
                "useDefaultActor":false,
                "viewOption":null,
                "UFI2CommentsProvider_commentsKey":"CometModernHomeFeedQuery"
            }),
            doc_id:'4870960222915208',
            fb_api_caller_class: 'RelayModern',
            fb_api_req_friendly_name: 'CometUFICommentsProviderPaginationQuery'
        }
    };
    let responseText = await request(options);
    responseText = responseText.split('\n').find(e=>JSON.parse(e).data);
    let {data:{feedback:{display_comments:{edges,page_info}}}} = JSON.parse(responseText);

    for(let {node} of edges){
        try{

            let uid = node.author.id;
            let name = node.author.name;
            let type = 'comment';
            let comment = node.body.text || '';
            let time = node.created_time;
            let find_Scanpost =  await  ScanPost.find({user_id,url_id,uid,time,type});
            if(find_Scanpost.length === 0){
                let phone_in_comment = comment.match(/[\o\O0-9]{10}/gm) || [];
                let phone_space = (comment.match(/(?:[-+() ]*\d){10,12}/g) || []).map(e=>e.replace(/ /g,''));
                let find_phone_data = await Data.find({uid});
                let phone = find_phone_data.length > 0 ? find_phone_data[0].phone : '';
                let phone_new = (phone_in_comment.concat(phone_space)).filter(e=>e.length > 0).join(',').replace(/[\o\O]/g,'0');
                if((phone_new !== phone) && (phone_new[0] === '0')) {
                    phone = phone_new;
                    await Data.create({uid,phone});
                }
                if(uid !== page_ID){
                    let comment_block = false;
                    let list_blocked_keyword = await BlockedKeyword.find({user_id});
                    for(let keyword of list_blocked_keyword){
                        if((comment.trim().length > 0) && (comment.toLowerCase().includes(keyword.value.toLowerCase()))){
                         comment_block = true;
                     }
                 }
                 if(!comment_block){
                    await ScanPost.findOrCreate({url_id,user_id,uid,type},{name_post,url_id,time,user_id,post_ID,page_ID,uid,name,phone,comment,type});
                 }
             }
             if(last_time < time){
                last_time = time;


                await UrlScan.update({id:url_id}).set({last_time})
            }

        }

    }catch(error){

    }
}

let find_logtokenscan = await LogTokenScan.find({url_id,token_id,type:'old-comment'});


if(page_info.has_next_page && (find_logtokenscan.length > 0)){

   return await GetComment(url_id,user_id,token_id,accessToken,page_info.end_cursor)
}else{
    return;
}


};
let reset = async function(url_id){
    let list_log = await LogTokenScan.find({url_id,type:'old-comment'});
    for(let {url_id,token_id} of list_log){
        await LogTokenScan.destroy({url_id,type:'old-comment'});
        await Token.update({id:token_id}).set({used:false});
    }
    return;
};
let make = async (url_id,user_id)=>{
    let find_logtokenscan = await LogTokenScan.find({url_id,type:'old-comment'});
    if(find_logtokenscan.length > 0) return;
    
    try{
     await GetComment(url_id,user_id);
     await reset(url_id);
 }catch(error){
    await reset(url_id)

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