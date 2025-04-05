let fbPageCommentEventLib = require('fb-page-comment-event');
let postDigestor = fbPageCommentEventLib.api.getPostDigestor();
const request = require('request-promise');
const random = require('randomstring');
let waitTime = time=>{
	return new Promise(resolve=>{
		setTimeout(function(){
			return resolve(time)
		},time)
	});
};

let check_show = async ({post_ID,page_ID},{keyword,last_time},try_time = 0)=>{
	let check = false;
	let {access_token,token_id} = await OneToken();
	let find_cookie = await Token.find({access_token});
	let cookie = find_cookie.length > 0 ? find_cookie[0].cookie : '';
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
			url: `https://graph.facebook.com/v2.11/${page_ID}_${post_ID}/comments`,
			headers,
			method:'GET',
			qs:{
				"order":"reverse_chronological",
				"limit":"100",
				"since":last_time,
				access_token
			}
		};

		
		let responseText = await request(options);
		let {data,error} = JSON.parse(responseText);
		if(error) throw false;

		let result = data.find(item=>(item.message || '').toLowerCase().includes(keyword.toLowerCase()));
		if(!result && (try_time < 3)){
			try_time+=1;
			await Token.update({id:token_id}).set({used:false})
			return await check_show({post_ID,page_ID},{keyword,last_time},try_time)
		}else{
			check = result;
		}
	}catch(error){
		if(try_time < 3){
			try_time+=1;


			return await check_show({post_ID,page_ID},{keyword,last_time},try_time)
		}

		

	}
	await Token.update({id:token_id}).set({used:false})
	return check ? true : false;

};
function randomInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};
let Comment = async (message,page_ID,post_ID,try_time = 0)=>{
	let {access_token,token_id} = await OneToken();
	let find_cookie = await Token.find({access_token});
	let cookie = find_cookie.length > 0 ? find_cookie[0].cookie : '';
	
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
		let options = {
			url: 'https://graph.facebook.com/v11.0/'+page_ID+'_'+post_ID+'/comments',
			method: 'POST',
			headers,
			qs: {
				message,
				access_token
			}
		};
		let {error,errors} = await request(options);
		
		await Token.update({id:token_id}).set({used:false});
		

		if(errors || error) throw error;
	}catch(error){
		await Token.update({id:token_id}).set({used:false});
		
		if(try_time < 6){
			try_time+=1;
			return await Comment(message,page_ID,post_ID,try_time);
		}
	}
	await Token.update({id:token_id}).set({used:false})

	return;

};
Array.prototype.chunk = function(n) {
	if (!this.length) {
		return [];
	}
	return [this.slice(0, n)].concat(this.slice(n).chunk(n));
};
Array.prototype.random_arr = function(){
	return this[Math.floor(Math.random()*this.length)];
}
let list_comment = ["ib","tư vấn cho mình","cho xin đc","t đang cần ak","đúng rồi tư vấn tớ","có thật không nhỉ","cho e xin giá ak","sp tốt không mn?","ai đã dùng rồi bảo mình ạ","thật à mn","quảng cáo như thần mà không biết tốt không?","chào shop ib đi ạ","shop bán bn?","tôi cần mua","tôi đang muốn dùng ạ","thích quá mà không có tiền","ai có tiền cho mfinh đi","quảng cáo tắt mãi k hết","ib tư vấn nào","mình muốn tham khảo","trl đi shop","shop ib mik","mình đang thích dùng ib"];
let check = async (id,comment,feedback_ID,delay_time,post_ID,page_ID)=>{
	let keyword = comment;
	if(comment.trim().length === 0){
		keyword = '0'+random.generate({
			charset: 'numeric',
			length:9
		});
	}else{
		keyword = comment;
	}
	
	let last_time = parseInt(Date.now()/1000);
	await Comment(keyword,page_ID,post_ID);
	await waitTime(delay_time*1000);
	let show = await check_show({post_ID,page_ID},{keyword,last_time});
	await UrlScan.update({id}).set({delay:delay_time,hide_comment:show ? false : true});
	return show;
};
module.exports = async function(user_id,comment,delay_time,list,test_part){
	let list_url = [];
	if(test_part === 'all'){
		list_url = await UrlScan.find({user_id});
	}else if(test_part === 'hide'){
		list_url = await UrlScan.find({user_id,hide_comment:true});

	}else if(test_part === 'post'){
		list_url = list;

	}
	
	
	if(list_url.length > 0){

		let map_list = list_url.map(e=>check(e.id,comment,e.feedback_ID,delay_time,e.post_ID,e.page_ID));
		return await Promise.all(map_list);
	}
	return []
}