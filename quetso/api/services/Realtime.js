let fbPageCommentEventLib = require('fb-page-comment-event');
const request = require('request-promise');
let postDigestor = fbPageCommentEventLib.api.getPostDigestor();
let waitTime = time=>{
	return new Promise(resolve=>{
		setTimeout(function(){
			return resolve(time)
		},time)
	});
};

let Realtime = async function(url_id,user_id,token_id = null,access_token = null){
	
	let find_UrlScan = await UrlScan.find({id:url_id});
	if(find_UrlScan.length === 0) return;
	let {post_ID,page_ID,name_post,last_comment_time,delay} = find_UrlScan[0];

	await waitTime(delay*1000);
	

	if(!token_id){
		
		let t = await OneToken();
		token_id = t.token_id;
		access_token = t.access_token;
		if(!token_id) return;
		await LogTokenScan.create({user_id,token_id,url_id,type:'comment'});
	}
	

	let find_last_comment = await ScanPost.find({url_id,type:'comment'}).sort('time DESC');
	let last_time = find_last_comment.length > 0 ? find_last_comment[0].time : parseInt((Date.now()-5000)/1000);


	let find_cookie = await Token.find({access_token});
	let cookie = find_cookie.length > 0 ? find_cookie[0].cookie : '';
	

	var headers = {
		'authority': 'graph.facebook.com',
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
	

	var options = {
		url: `https://graph.facebook.com/v2.11/${page_ID}_${post_ID}/comments`,
		headers,
		method:'GET',
		qs:{
			"order":"reverse_chronological",
			"limit":"1000",
			"since":last_time,
			access_token
		}
	};
	let responseText = await request(options);
	let {data,error} = JSON.parse(responseText);
	if(error) throw error;
	for(let item of data){
		try{
			if(item.from && item.created_time){
				let uid = item.from.id;
				let name = item.from.name;
				let comment = item.message || '';
				let time = parseInt((new Date(item.created_time)).getTime()/1000);

				let type = 'comment';
				let find_Scanpost =  await  ScanPost.find({user_id,url_id,uid,time});
				if(find_Scanpost.length === 0){
					let phone_in_comment = comment.match(/[0Oo]\d{9}|(?:[-+() ]*\d){10}/gm) || [];
						let find_phone_data = await Data.find({uid});
						let phone = find_phone_data.length > 0 ? find_phone_data[0].phone : '';
						let phone_new = phone_in_comment.filter(e=>e.length > 0).join(',').replace(/[\o\O]/g,'0').replace(/ /g,'');
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
                 	await ScanPost.create({name_post,url_id,time,user_id,post_ID,page_ID,uid,name,phone,comment,type});
                 }
						
					}
					
					if(last_time < time){
						last_time = time;
						await UrlScan.update({id:url_id}).set({last_time})
						
					}
					
				}
			}
		}catch(error){
			
		}
	}
	
	let find_logtokenscan = await LogTokenScan.count({url_id,token_id,type:'comment'});
	
	if(find_logtokenscan > 0){
		
		
		return await Realtime(url_id,user_id,token_id,access_token);
	}else{

		return;
	}
	
	
	
};
let reset = async function(url_id){
	let list_log = await LogTokenScan.find({url_id,type:'comment'});
	for(let {url_id,token_id} of list_log){
		await LogTokenScan.destroy({url_id,type:'comment'});
		await Token.update({id:token_id}).set({used:false});
	}
	return;
};
let make = async (url_id,user_id)=>{
	let find_logtokenscan = await LogTokenScan.find({url_id,type:'comment'});
	if(find_logtokenscan.length > 0) return;
	
	try{
		 await Realtime(url_id,user_id);
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