const request = require('request-promise');
const cheerio = require('cheerio');

module.exports = async (url,cookie = '')=>{
 
	var headers = {
    'authority': 'www.facebook.com',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'max-age=0',
    cookie,
    'sec-ch-prefers-color-scheme': 'dark',
    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="101", "Opera";v="87"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36',
    'viewport-width': '1366'
};


  var options = {
   url,
    headers,
    method:'GET',
   
  };

  let responseHTML = await request(options);
  
  try{
    let startS = '"pageID":"';
    let endS = '"';
    return responseHTML.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs"))[0];
  }catch(e1){
    try{
      let startS = '"groupID":"';
      let endS = '"';
      return responseHTML.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs"))[0];
    }catch(e2){
      try{
        let startS = '"userID":"';
        let endS = '"';
        return responseHTML.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs"))[0];
      }catch(e3){
        return null
      }
    }
    
  } 
};
