const request = require('request-promise');
module.exports = async (access_token,cookie)=>{
	try{
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
			url:'https://graph.facebook.com/v11.0/me',
			method:'GET',
			headers,
			qs:{
				fields:'name,accounts.limit(1000){id,name,access_token,fan_count,is_published}',
				access_token
			}
		};
		let responseText = await request(options);
		
		let {accounts,id,name} = JSON.parse(responseText);
		return accounts.data.map(e=>({uid:id,name,pageId:e.id,pageName:e.name,access_token:e.access_token}));
	}catch(error){
		return [];
	}
};
