const request = require('request-promise');
module.exports = async (friend_uid,access_token,cookie)=>{
	let startS = 'c_user=';
	let endS = ';';
	let user_uid = cookie.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs"))[0];
	var headers = {
		'authority': 'graph.facebook.com',
		'cache-control': 'max-age=0',
		'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="99", "Opera";v="85"',
		'sec-ch-ua-mobile': '?0',
		'sec-ch-ua-platform': '"Windows"',
		'upgrade-insecure-requests': '1',
		'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
		'sec-fetch-site': 'none',
		'sec-fetch-mode': 'navigate',
		'sec-fetch-user': '?1',
		'sec-fetch-dest': 'document',
		'accept-language': 'en-US,en;q=0.9',
		cookie
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
					"attribution_id_v2": "WelcomeDashboardCometRoot.react,comet.welcome,via_cold_start,"+Date.now()+",195274,",
					"friend_requestee_ids": [friend_uid],
					"people_you_may_know_location": "friend_browser",
					"refs": [null],
					"source": "friend_browser_wd",
					"warn_ack_for_ids": [],
					"actor_id": user_uid,
					"client_mutation_id": "1"
				},
				"scale": 1
			}),
			doc_id:'5061499187226583',
			fb_api_caller_class: 'RelayModern',
			fb_api_req_friendly_name: 'FriendingCometFriendRequestSendMutation'
		}
	};
	let responseText = await request(options);
	let {errors} = JSON.parse(responseText);
	errors = errors || [];
	if(errors.length > 0) throw errors[0].description;
	return true;
};