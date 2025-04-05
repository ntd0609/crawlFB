const request = require('request-promise');
const fs = require('fs');
let method = async (url,cookie)=>{
    var headers = {
        'authority': 'business.facebook.com',
        'cache-control': 'max-age=0',
        'viewport-width': '1366',
        'sec-ch-ua': '"Chromium";v="94", " Not A;Brand";v="99", "Opera";v="80"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'sec-fetch-site': 'none',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-user': '?1',
        'sec-fetch-dest': 'document',
        'accept-language': 'en-US,en;q=0.9',
        cookie
    };

    var options = {
        url,
        headers,
        method:'GET'
    };
    let responseHTML = await request(options);
   
    let startS = '"EAA';
    let endS = '"';
    let access_token = 'EAA'+responseHTML.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs"))[0];

    if(!access_token) throw false;
    let startS_dtsg = '"token":"';
    let endS_dtsg = '"';
    let fb_dtsg = responseHTML.match(new RegExp('(?<='+startS_dtsg+'+).*?(?='+endS_dtsg+')',"gs"))[0];
    return {access_token,fb_dtsg};
};
module.exports = async function(cookie){
   
    let list_url = ['https://business.facebook.com/home/accounts','https://business.facebook.com/business_locations/?nav_source=mega_menu'];
    for(let url of list_url){
        
        try{
            return await method(url,cookie);
        }catch(error){

        }
    }
}