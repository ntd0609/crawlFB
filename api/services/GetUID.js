const request = require('request-promise');
const cheerio = require('cheerio');
let GetName = async (id,access_token)=>{
  
  
  let options = {
			url:'https://graph.facebook.com/v11.0/'+id+'?fields=id,name,__type__',
			method:'GET',
			headers:{
				'user-agent':'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36'
			},
			qs:{
				access_token
			},
			resolveWithFullResponse:false,
			rejectUnauthorized:false
		};
		let responseText = await request(options);
		let {__type__,name} = JSON.parse(responseText);
		return {id,name,type:__type__.name.toLowerCase()}
};

module.exports = async (fburl,access_token)=>{
	var headers = {
		'authority': 'lookup-id.com',
		'cache-control': 'max-age=0',
		'sec-ch-ua': '"Chromium";v="94", " Not A;Brand";v="99", "Opera";v="80"',
		'sec-ch-ua-mobile': '?0',
		'sec-ch-ua-platform': '"Windows"',
		'upgrade-insecure-requests': '1',
		'origin': 'https://lookup-id.com',
		'content-type': 'application/x-www-form-urlencoded',
		'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36 OPR/80.0.4170.63',
		'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
		'sec-fetch-site': 'same-origin',
		'sec-fetch-mode': 'navigate',
		'sec-fetch-user': '?1',
		'sec-fetch-dest': 'document',
		'referer': 'https://lookup-id.com/',
		'accept-language': 'en-US,en;q=0.9'
	};

	var options = {
		url: 'https://lookup-id.com/',
		headers,
		method:'POST',
		form:{
			fburl,
            check: 'Lookup'
		}
	};
	let responseHTML = await request(options);
	let $ = cheerio.load(responseHTML);
	let id = $('span#code').text();
	let {name,type} = await GetName(id,access_token);
	return {id,name,type};
};
