const request = require('request-promise');

let GetCount = async ({page_ID,post_ID,name_post,count_comment_new,id},{access_token,cookie})=>{
	
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
		url: `https://graph.facebook.com/v13.0/${page_ID}_${post_ID}/reactions?summary=1`,
		headers,
		method:'GET',
		qs:{
			
			access_token
		}
	};
	let responseText = await request(options);
	let {data,error,summary} = JSON.parse(responseText);
	if(error) throw false;
	let count = summary.total_count;
	await UrlScan.update({id}).set({count_comment_old:count_comment_new,count_comment_new:count});
	return count - count_comment_new;
};
module.exports = async function(url){
	
	
	let find_cookie = await Token.find({cookie:{'!=':''},live:true,used:false}).sort('updatedAt DESC').limit(1);
	if(find_cookie.length === 0) throw 'Không tìm thấy cookie để thực hiện lấy số lượng comment';
	let {access_token,cookie,id} = find_cookie[0];
	
	try{
		let push = await GetCount(url,{cookie,access_token});
		await Token.update({id}).set({used:false});
		return push;
	}catch(error){
		throw 'Không lấy được push bài viết: '+url.name_post;
	}
	
	
	
}