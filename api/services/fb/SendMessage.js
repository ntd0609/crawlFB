const request = require('request-promise');
const {server: {port, host}} = require('../../../nuxt.config');
let UpImage = async (link,{fb_dtsg,cookie})=>{
   try{
      var headers = {
         'authority': 'upload.facebook.com',
         'accept': '*/*',
         'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
         'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryUGwAYXOq3fal5pbd',
         cookie,
         'origin': 'https://m.facebook.com',
         'referer': 'https://m.facebook.com/',
         'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
         'sec-ch-ua-mobile': '?0',
         'sec-ch-ua-platform': '"Windows"',
         'sec-fetch-dest': 'empty',
         'sec-fetch-mode': 'cors',
         'sec-fetch-site': 'same-site',
         'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
      };

      let startS = 'c_user=';
      let endS = ';';
      let uid = cookie.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs"))[0];

      var options = {
         url: 'https://upload.facebook.com/_mupload_/photo/x/saveunpublished',
         method: 'POST',
         headers,
         qs:{
            "allow_spherical_photo":"true",
            "thumbnail_width":"80",
            "thumbnail_height":"80",
            "waterfall_id":"9a497e727a0afbb277b72d77a2fc310f",
            "waterfall_app_name":"web_m_touch",
            "waterfall_source":"message",
            "target_id":uid,
            "av":uid,
            fb_dtsg,
            "jazoest":"25444",
            "__csr":"",
            "__req":"1p",
            "__a":1,
            "__user":uid
         },
         formData:{
            photo:request(host+':'+port+link)
         }
      };
      let responseText = await request(options);
      responseText = responseText.replace('for (;;);','');
      let {payload:{fbid}} = JSON.parse(responseText);
      return fbid;
   }catch(error){
   
      return null;
   }
};

module.exports = async ({friend_uid,message},{fb_dtsg,cookie},list_image = [])=>{
   let map_up = list_image.map(link=>UpImage(link,{fb_dtsg,cookie}));
   let list_id = await Promise.all(map_up);
   list_id = list_id.filter(e=>e);
   let photo = '';
   
   for(let id of list_id){
      photo += ('&photo_ids%5B'+id+'%5D='+id)
   }
  
   try{
      var headers = {
       'authority': 'm.facebook.com',
       'x-requested-with': 'XMLHttpRequest',
       'x-msgr-region': 'PRN',
       'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
       'x-response-format': 'JSONStream',
       'content-type': 'application/x-www-form-urlencoded',
        'accept': '*/*',
       'origin': 'https://m.facebook.com',
       'sec-fetch-site': 'same-origin',
       'sec-fetch-mode': 'cors',
       'sec-fetch-dest': 'empty',
       'accept-language': 'en-US,en;q=0.9',
       cookie
    };
    let startS = 'c_user=';
    let endS = ';';
    let c_user = cookie.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs"))[0];
    var options = {
       url: 'https://m.facebook.com/messages/send/?icm=1',
       headers,
       method:'POST',
       body:'tids=cid.c.'+friend_uid+'%3A'+c_user+'&wwwupp=C3&ids%5B'+friend_uid+'%5D='+friend_uid+'&platform_xmd=&body='+message+photo+'&waterfall_source=message&action_time='+Date.now()+'&fb_dtsg='+encodeURI(fb_dtsg)+'&jazoest=25587&__csr=&__req=b&__user='+c_user

    };

    await request(options);
    return false;
 }catch(error){
   
   return true;
}
};
