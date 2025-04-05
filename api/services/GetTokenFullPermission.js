const request = require('request-promise');

let GetToken = async (fb_dtsg,cookie)=>{


    var headers = {
        'authority': 'www.facebook.com',
        'cache-control': 'max-age=0',
        'viewport-width': '1366',
        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="92", "Opera";v="78"',
        'sec-ch-ua-mobile': '?0',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36',
        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-user': '?1',
        'sec-fetch-dest': 'document',
        'accept-language': 'en-US,en;q=0.9',
        "Content-Type": "application/x-www-form-urlencoded",
        cookie
    };

    let uid = cookie.match(new RegExp('(?<='+'c_user='+'+).*?(?='+';'+')',"gs"))[0];
    var options = {
        url: "https://www.facebook.com/v12.0/dialog/oauth/confirm",
        headers,
        method:'POST',
        form:{
            scope:'email,publish_actions,publish_pages,user_about_me,user_actions.books,user_actions.music,user_actions.news,user_actions.video,user_activities,user_birthday,user_education_history,user_events,user_games_activity,user_groups,user_hometown,user_interests,user_likes,user_location,user_notes,user_photos,user_questions,user_relationship_details,user_relationships,user_religion_politics,user_status,user_subscriptions,user_videos,user_website,user_work_history,friends_about_me,friends_actions.books,friends_actions.music,friends_actions.news,friends_actions.video,friends_activities,friends_birthday,friends_education_history,friends_events,friends_games_activity,friends_groups,friends_hometown,friends_interests,friends_likes,friends_location,friends_notes,friends_photos,friends_questions,friends_relationship_details,friends_relationships,friends_religion_politics,friends_status,friends_subscriptions,friends_videos,friends_website,friends_work_history,ads_management,create_event,create_note,export_stream,friends_online_presence,manage_friendlists,manage_notifications,manage_pages,photo_upload,publish_stream,read_friendlists,read_insights,read_mailbox,read_page_mailboxes,read_requests,read_stream,rsvp_event,share_item,sms,status_update,user_online_presence,video_upload,xmpp_login',
            fb_dtsg,
            app_id:'124024574287414',
            redirect_uri:'fbconnect://success',
            access_token:'',
            from_post:'1',
            response_type: 'token',
            return_format:'access_token',
            domain:'',
            _CONFIRM:'1',
            _user:uid
        }

    };
    let responseText = await request(options);
   
    let startS = 'access_token=';
    let endS = '"';
    let find_access_token = responseText.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs"))[0];
    let access_token = find_access_token.split('&')[0];
    return access_token;

};
module.exports = async function(cookie,fb_dtsg){


  
   let token = await GetToken(fb_dtsg,cookie);
   return token;
}