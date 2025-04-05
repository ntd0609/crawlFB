const request = require('request-promise');
Array.prototype.random = function(){
  return this[Math.floor(Math.random()*this.length)];
};

let GetUID = async function(access_token){
    let options = {
        url: 'https://graph.facebook.com/v11.0/me',
        method: 'GET',
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
        },
        qs: {
            fields: 'name,id',
            access_token
        }
    };
    let responseText = await request(options);
    
    let {id} = JSON.parse(responseText);
    return id;
};
let LikePage_Data = async function(page_id,actor_id,access_token,cookie){
     
    var headers = {
        'authority': 'www.facebook.com',
        'accept': '*/*',
        'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
        'content-type': 'application/x-www-form-urlencoded',
        cookie,
        'origin': 'https://www.facebook.com',
        'referer': 'https://www.facebook.com',
        'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'x-fb-friendly-name': 'CometProfilePlusLikeMutation',
        'x-fb-lsd': 'K8KePtzlwLD2c7ZIR842Z1'
    };
    let options = {
        url:'https://graph.facebook.com/graphql',
        method:'POST',
        headers,
        qs:{access_token},
        form:{
            variables:JSON.stringify({"input":{page_id,"source":null,actor_id,"client_mutation_id":"14"},"scale":1}),
            doc_id:'4867271226642619',
            fb_api_caller_class: 'RelayModern',
            fb_api_req_friendly_name: 'CometProfilePlusLikeMutation'
        }
    };
    let responseText = await request(options);
    let responseJson = JSON.parse(responseText);
    return responseJson;
};
let LikePost_Data = async (feedback_id,actor_id,access_token,cookie,reactions)=>{
    let feedback_reaction_id = reactions.random();
    var headers = {
        'authority': 'www.facebook.com',
        'accept': '*/*',
        'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
        'content-type': 'application/x-www-form-urlencoded',
        cookie,
        'origin': 'https://www.facebook.com',
        'referer': 'https://www.facebook.com',
        'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'x-fb-friendly-name': 'CometProfilePlusLikeMutation',
        'x-fb-lsd': 'K8KePtzlwLD2c7ZIR842Z1'
    };
    let options = {
        url:'https://graph.facebook.com/graphql',
        method:'POST',
        headers,
        qs:{
            access_token
        },
        form:{
            variables:JSON.stringify({
                "input": {
                    "attribution_id_v2": "CometGroupPermalinkRoot.react,comet.group.permalink,via_cold_start,1668779770177,309593,2361831622,",
                    "feedback_id": feedback_id,
                    "feedback_reaction_id":reactions.random(),
                    "feedback_source": "OBJECT",
                    "is_tracking_encrypted": true,
                    actor_id,
                    "client_mutation_id": "1"
                },
                "useDefaultActor": true,
                "scale": 1
            }),
            doc_id:'5703418209680126',
            fb_api_caller_class: 'RelayModern',
            fb_api_req_friendly_name: 'CometUFIFeedbackReactMutation'
        }
    };
    return await request(options);

};

let MakeLikePage = async function(page_id,access_token,cookie){
    try{
        let uid = await GetUID(access_token);
        await LikePage_Data(page_id,uid,access_token,cookie);
    }catch(error){

    }
    return;
};
let MakeLikePost = async function(feedback_id,reactions,access_token,cookie){
    try{
        let uid = await GetUID(access_token);
       
        await LikePost_Data(feedback_id,uid,access_token,cookie,reactions);
    }catch(error){

    }
    return;
};
let LikePage = async (page_id)=>{
    let list_token = await Token.find({live:true});
     let find_cookie = await OneCookie();
    let cookie = find_cookie.cookie;
    let map_like = list_token.map(({access_token})=>MakeLikePage(page_id,access_token,cookie));
    return await Promise.all(map_like);
};
let LikePost = async (feedback_id,reactions)=>{
    if(reactions.length === 0) reactions.push('LIKE');
    let list_token = await Token.find({live:true});
     let find_cookie = await OneCookie();
    let cookie = find_cookie.cookie;
    let map_like = list_token.map(({access_token})=>MakeLikePost(feedback_id,reactions,access_token,cookie));
    return await Promise.all(map_like);
};
module.exports = {LikePage,LikePost}