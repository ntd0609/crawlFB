const request = require('request-promise');
module.exports = async (comment_id,access_token,cookie)=>{
    try{
        let options = {
            url: 'https://graph.facebook.com/v11.0/'+comment_id,
            method: 'POST',
            headers: {
                'user-agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
                cookie
            },
            qs: {
                is_hidden:true,
                access_token
            }
        };
        let responseText = await request(options);
        let {error,errors} = JSON.parse(responseText);
        
        return !error && !errors
    }catch(error){
       
        return false;
    }
};
