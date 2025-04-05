const request = require('request-promise');
const GetPageID = require('./GetPageID');

module.exports = async (url,cookie = '')=>{
  if(cookie.length === 0){
    let find_cookie = await OneCookie();
    cookie = find_cookie.cookie;
  }
  var headers = {
    'authority': 'www.facebook.com',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'max-age=0',
    cookie,
    'referer': 'https://web.telegram.org/',
    'sec-ch-prefers-color-scheme': 'dark',
    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="101", "Opera";v="87"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36',
    'viewport-width': '1366'
  };


  var options = {
    url,
    headers,
    method:'GET'
  };
  let responseHTML = await request(options);

  let post_ID = null;
  let page_ID = null;
  if(url.includes('profile.php?id=')){
    let startS = '"delegate_page":{"id":"';
    let endS = '"';
    page_ID = responseHTML.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs"))[0];
    
  }else if(url.includes('permalink.php?story_fbid=')){
    let {searchParams} = new URL(url);
    post_ID = searchParams.get('story_fbid');
    if(post_ID.length > 25){
      try{
        let startS = '"legacy_token":"';
        let endS = '"';
        post_ID = responseHTML.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs"))[0];
        post_ID = post_ID.split('_')[0];
      }catch(error){
        try{
          let startS = '"post_id":"';
          let endS = '"';
          post_ID = responseHTML.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs"))[0];
          post_ID = post_ID.split('_')[0];
        }catch(errr3){
         let startS = '"subscription_target_id":"';
         let endS = '"';
         post_ID = responseHTML.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs"))[0];
         
       }
       
     }
     
   }
   page_ID = searchParams.get('id');

 }else if(url.includes('/posts/')){
  let page_url = url.split('/posts/')[0];
  let path_id = page_url.replace('https://www.facebook.com/','').replace('https://facebook.com/','').replace(/\//g,'');
  if(isNaN(path_id)){
    page_ID = await GetPageID(page_url,cookie);
  }else{
    page_ID = path_id;
  }
  let page_url_text = url+'/';
  let startS = '/posts/';
  let endS = '/';
  post_ID = page_url_text.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs"))[0];
  if(post_ID.length > 25){
    try{
      let startS = '"legacy_token":"';
      let endS = '"';
      post_ID = responseHTML.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs"))[0];
      post_ID = post_ID.split('_')[0];
    }catch(err4){


      let startS = '"subscription_target_id":"';
      let endS = '"';
      post_ID = responseHTML.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs"))[0];

    }
    
  }
}
else if(url.includes('/videos/')){

  let page_url = url.split('/videos/')[0];
  let path_id = page_url.replace('https://www.facebook.com/','').replace('https://facebook.com/','').replace(/\//g,'');
  if(isNaN(path_id)){
    page_ID = await GetPageID(page_url,cookie);
  }else{
    page_ID = path_id;
  }
  

  let page_url_text = url+'/';
  let startS = '/videos/';
  let endS = '/';
  post_ID = page_url_text.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs"))[0];
  if(post_ID.length > 25){
    let startS = '"legacy_token":"';
    let endS = '"';
    post_ID = responseHTML.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs"))[0];
    post_ID = post_ID.split('_')[0];
  }



}else if(url.includes('/photos/')){

  let page_url = url.split('/photos/')[0];
  let path_id = page_url.replace('https://www.facebook.com/','').replace('https://facebook.com/','').replace(/\//g,'');
  if(isNaN(path_id)){
    page_ID = await GetPageID(page_url,cookie);
  }else{
    page_ID = path_id;
  }
  let startS_postid = '"nodeID":"';
  let endS_postid = '"';
  post_ID = responseHTML.match(new RegExp('(?<='+startS_postid+'+).*?(?='+endS_postid+')',"gs"))[0];
  if(post_ID.length > 25){
    let startS = '"legacy_token":"';
    let endS = '"';
    post_ID = responseHTML.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs"))[0];
    post_ID = post_ID.split('_')[0];
  }


}else{
  try{
    let startS_postid = '"userID":"';
    let endS_postid = '"';
    page_ID = responseHTML.match(new RegExp('(?<='+startS_postid+'+).*?(?='+endS_postid+')',"gs"))[0];
  }catch(errr32){
    try{

    let startS_postid = '"pageID":"';
    let endS_postid = '"';
    page_ID = responseHTML.match(new RegExp('(?<='+startS_postid+'+).*?(?='+endS_postid+')',"gs"))[0];
  }catch(error){
    try{

      let startS_postid = '"Page","id":"';
      let endS_postid = '"';
      page_ID = responseHTML.match(new RegExp('(?<='+startS_postid+'+).*?(?='+endS_postid+')',"gs"))[0];
    }catch(error){
      try{

        let startS_postid = '"props":{"actorID":';
        let endS_postid = ',';
        page_ID = responseHTML.match(new RegExp('(?<='+startS_postid+'+).*?(?='+endS_postid+')',"gs"))[0];
      }catch(error){
        try{

          let startS_postid = '"Group","id":"';
          let endS_postid = '"';
          page_ID = responseHTML.match(new RegExp('(?<='+startS_postid+'+).*?(?='+endS_postid+')',"gs"))[0];
        }catch(error){

        }
      }
    }
  }
  }
  try{
    let startS_postid = '"story_token":"';
    let endS_postid = '"';
    post_ID = responseHTML.match(new RegExp('(?<='+startS_postid+'+).*?(?='+endS_postid+')',"gs"))[0];

  }catch(error){
    try{
      let startS_postid = '"post_id":"';
      let endS_postid = '"';
      post_ID = responseHTML.match(new RegExp('(?<='+startS_postid+'+).*?(?='+endS_postid+')',"gs"))[0];
    }catch(error2){
      try{
        let startS_postid = '"story_fbid":"';
        let endS_postid = '"';
        post_ID = responseHTML.match(new RegExp('(?<='+startS_postid+'+).*?(?='+endS_postid+')',"gs"))[0];
      }catch(error3){


      }

    }
  }
}

let feedback_ID = null;
if(responseHTML.includes('"result":{"data":{"nodes":')){
  let startS = '"result":{"data":{"nodes":';
  let endS = '},"extensions"';
  let Str = responseHTML.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs"))[0];
  
  let edges =  JSON.parse(Str);

  let find_comet = edges.find(e=>{

    let url_post = (e.comet_sections.content.story.wwwURL.slice(-1) === '/')  ? e.comet_sections.content.story.wwwURL : e.comet_sections.content.story.wwwURL+'/';

    let startS = '/posts/';
    let endS = '/';
    let post_id = (url_post.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs")) || [''])[0] ;
    return url.includes(post_id);
  });
  
  if(find_comet){
    feedback_ID = find_comet.feedback.id;
  }else if(edges.length === 1) {
    feedback_ID = edges[0].feedback.id;
  }
}else if(responseHTML.includes('"story":{"feedback":{"id":"')){

  let startS = '"story":{"feedback":{"id":"';
  let endS = '"';
  let find_feedback_ID = responseHTML.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs")) || [];

  if((find_feedback_ID.length === 0) && (url.includes('/videos/') || url.includes('/watch/'))){
    let startS1 = 'feedback":{"id":"';
    let endS1 = '"';
    let find_feedback_ID_1 = responseHTML.match(new RegExp('(?<='+startS1+'+).*?(?='+endS1+')',"gs")) || [];
    if(find_feedback_ID_1.length > 0) feedback_ID = find_feedback_ID_1[0];

    let startS2 ='"feedback_target_with_context":{"id":"';
    let endS2 = '"';
    
    let find_feedback_ID_2 = responseHTML.match(new RegExp('(?<='+startS2+'+).*?(?='+endS2+')',"gs")) || [];
    if(find_feedback_ID_2.length > 0) feedback_ID = find_feedback_ID_2[0];

    
  }else{
    feedback_ID =  find_feedback_ID[0];
  }
}else if(responseHTML.includes('"feedback":{"id":"')){

  let startS = '"feedback":{"id":"';
  let endS = '"';
  feedback_ID = responseHTML.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs"))[0];
}else if(responseHTML.includes('"feedback_target_with_context":{"id":"')){
  let startS = '"feedback_target_with_context":{"id":"';
  let endS = '"';
  feedback_ID = responseHTML.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs"))[0];
}


return {page_ID,post_ID,url,feedback_ID}
};

