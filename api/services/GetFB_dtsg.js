const request = require('request-promise');
module.exports = async (cookie)=>{
	try{
		var headers = {
			'authority': 'www.facebook.com',
			'cache-control': 'max-age=0',
			'viewport-width': '1366',
			'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="98", "Opera";v="84"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"Windows"',
			'sec-ch-prefers-color-scheme': 'dark',
			'upgrade-insecure-requests': '1',
			'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.109 Safari/537.36',
			'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
			'sec-fetch-site': 'none',
			'sec-fetch-mode': 'navigate',
			'sec-fetch-user': '?1',
			'sec-fetch-dest': 'document',
			'accept-language': 'en-US,en;q=0.9',
			cookie
		};
		let options = {
			url:'https://www.facebook.com/friends',
			method:'GET',
			headers

		};
		let responseHTML = await request(options);
		let startS = '"token":"';
		let endS = '"';
		return responseHTML.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs"))[0];
	}catch(error){
		return null;
	}
};
