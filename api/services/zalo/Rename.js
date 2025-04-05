const {encrypt,decrypt} = require('./Encrypt.js');
const request = require('request-promise');

module.exports = async function(name,toid,{cookie,secretKey,imei}){
    
        var headers = {
            'authority': 'chat2-wpa.chat.zalo.me',
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
            'content-type': 'application/x-www-form-urlencoded',
            cookie,
            'origin': 'https://chat.zalo.me',
            'referer': 'https://chat.zalo.me/',
            'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36'
        };

        var options = {
            url: 'https://alias-wpa.chat.zalo.me/api/alias/update',
            method: 'GET',
            headers,
            qs: {
                zpw_ver: 496,
                zpw_type:30,
                params:encrypt(JSON.stringify({
                    friendId:toid,
                    "alias":name,
                    imei
                }),secretKey)
            }
        };
        let responseText = await request(options);
        let {error_code} = JSON.parse(responseText);
        let check = error_code === 0;
        if(!check) throw 'Không thể đổi tên zalo người dùng';
        return true;
    };