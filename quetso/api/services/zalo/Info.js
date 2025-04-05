const request = require('request-promise');

module.exports = async (cookie)=>{
    var headers = {
    'Accept': '*/*',
        'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
        'Connection': 'keep-alive',
        cookie,
        'Origin': 'https://chat.zalo.me',
        'Referer': 'https://chat.zalo.me/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
        'sec-ch-ua': '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"'
    };

    var options = {
        url: 'https://jr.chat.zalo.me/jr/userinfo',
        headers,
        method:'GET'
    };
    let responseText = await request(options);
    let {data:{logged,info}} = JSON.parse(responseText);
    return info;
};
