const request = require('request-promise');
const MakeHide = require('./hide-comment/hide.js');
let waitTime = time=>{
	return new Promise(resolve=>{
		setTimeout(function(){
			return resolve(time)
		},time)
	});
};

let GetComment = async (hide_id)=>{
	

	let find_obj_hide = await Hide.find({id:hide_id});
	if(find_obj_hide.length === 0) return;

	let {user_id,post_ID,feedback_ID,delay,option,page_ID,title,pageName,scan} = find_obj_hide[0];
	

	let find_token_cookie = await TokenUser.find({pageId:page_ID,user_id,live:true});
	if(find_token_cookie.length === 0) {
		await waitTime(delay*1000);
		return await GetComment(hide_id);
	}
	let {cookie,access_token} = find_token_cookie[0];
	let token_id = find_token_cookie[0].id;

	let find_LastHideComment =  await  HideComment.find({user_id,hide_id}).sort('time DESC');
	let last_time = find_LastHideComment.length > 0 ? find_LastHideComment[0].time : 1;
	try{
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
			url: `https://graph.facebook.com/v2.11/${page_ID}_${post_ID}`,
			headers,
			method:'GET',
			qs:{
				"fields":"comments.limit(1000).since("+last_time+").order(reverse_chronological)",
				access_token
			}
		};
		try{
			var responseText = await request(options);
		}catch(err_cookie){
			await Hide.update({id:hide_id}).set({status:'cookie'});
			await TokenUser.update({id:token_id}).set({live:false});
		}
		let {comments} = JSON.parse(responseText);
		let {data,error} = comments || {data:[],error:'no data'};
		if(error) throw error;
		for(let item of data){
			try{
				if(item.from && item.created_time){
					let uid = item.from.id;
					let comment_id = item.id;
					let name = item.from.name;
					let comment = item.message || '';
					let time = parseInt((new Date(item.created_time)).getTime()/1000);

					let find_HideComment =  await HideComment.find({user_id,hide_id,uid,time});
					if(find_HideComment.length === 0){
						let phone_in_comment = comment.match(/[\o\O0-9]{10}/gm) || [];
						let find_phone_data = await Data.find({uid});
						let phone = find_phone_data.length > 0 ? find_phone_data[0].phone : '';
						let phone_new = phone_in_comment.filter(e=>e.length > 0).join(',');

						if((phone_new !== phone) && (phone_new[0] === '0')) {
							phone = phone_new;
							await Data.create({uid,phone});
						}
						if(uid !== page_ID){
							await HideComment.create({title,pageName,user_id,hide_id,post_ID,page_ID,uid,name,phone,comment,time});
						}
						if(scan){
							if(option === 'an-so'){
								if((phone_new[0] === '0') && (phone_new.length === 10)){
									await MakeHide(comment_id,access_token,cookie);
								};

								let list_blocked_keyword = await BlockedKeywordHide.find({user_id});
								for(let keyword of list_blocked_keyword){
									if((comment.trim().length > 0) && (comment.toLowerCase().includes(keyword.value.toLowerCase()))){
										await MakeHide(comment_id,access_token,cookie);
									}
								}
							}else if(option === 'tat-ca'){
								await MakeHide(comment_id,access_token,cookie);

							}
						}
					}
				}
			}catch(error){
				
			}
		}
	}catch(err){
		
		
	}
	
	await waitTime(delay*1000);
	return await GetComment(hide_id);
};

(async ()=>{
	await waitTime(30000);
	let list_hide = await Hide.find();
	let map_hide = list_hide.map(e=>GetComment(e.id));
	return await Promise.all(map_hide);
})();

module.exports = GetComment;