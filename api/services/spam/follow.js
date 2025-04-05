const request = require('request-promise');

let GetUID = async function(access_token){
    let options = {
        url: 'https://graph.facebook.com/v11.0/me',
        method: 'GET',
        headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, Follow Gecko) Chrome/90.0.4430.212 Safari/537.36'
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
let FollowPage_Data = async function(page_id,actor_id,access_token){
    var headers = {
    'authority': 'www.facebook.com',
         'accept': '*/*',

    'content-type': 'application/x-www-form-urlencoded' 

  };
  let options = {
    url:'https://graph.facebook.com/graphql',
    method:'POST',
    headers,
    qs:{access_token},
    form:{
      variables:JSON.stringify({
        "input": {
          "attribution_id_v2": "CometSinglePageHomeRoot.react,comet.page,unexpected,1668783890615,953537,250100865708545,;CometHomeRoot.react,comet.home,tap_tabbar,1668783879581,350139,4748854339,304#10#230#301",
          "is_tracking_encrypted": true,
          "subscribe_location": "PAGE_PROFILE_HEADER",
          "subscribee_id": page_id,
          "tracking": [],
          actor_id,
          "client_mutation_id": "5"
        },
        "isAdminView": false,
        "scale": 1
      }),
      doc_id:'5528708700544612',
      fb_api_caller_class: 'RelayModern',
      fb_api_req_friendly_name: 'CometPageFollowCommitMutation'
    }
  };
  let responseText = await request(options);
  let responseJson = JSON.parse(responseText);
  return responseJson;
};


let MakeFollowPage = async function(page_id,access_token){
    try{
        let uid = await GetUID(access_token);
        await FollowPage_Data(page_id,uid,access_token);
    }catch(error){

    }
    return;
};

module.exports = async (page_id)=>{
    let list_token = await Token.find({live:true});
    let map_Follow = list_token.map(({access_token})=>MakeFollowPage(page_id,access_token));
    return await Promise.all(map_Follow);
};
