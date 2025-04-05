const {encrypt,decrypt} = require('./Encrypt.js');
const request = require('request-promise');
const {server: {port, host}} = require('../../../nuxt.config');
let SendText = async function(message,toid,{cookie,secretKey,imei}){

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
        url: 'https://chat2-wpa.chat.zalo.me/api/message/sms?zpw_ver=496&zpw_type=30&nretry=0',
        method: 'POST',
        headers: headers,
        form: {
            params:encrypt(JSON.stringify({
                message,
                "clientId":parseInt(Date.now()/1000),
                imei,
                "ttl":0,
                toid,
            }),secretKey)
        }
    };
    let responseText = await request(options);
    let {error_code,data} = JSON.parse(responseText);
    if(error_code === 0){
        let t = await decrypt(data,secretKey);
        let j = JSON.parse(t);
        if(j.error_code !== 0) throw 'Người dùng chặn không nhận tin nhắn';
        return true;
    }else{
        throw 'Không thể gửi tin nhắn.Vui lòng kiểm tra cookie Zalo'
    }
};
let UploadImage = async function(link,toid,{cookie,imei,secretKey},clientId = Date.now(),chunkId = 1){
    var headers = {
        'authority': 'files-wpa.chat.zalo.me',
        'accept': 'application/octet-stream',
        'accept-language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundaryaBZPCcNlLwkNPOV2',
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
        url: 'https://files-wpa.chat.zalo.me/api/message/photo_original/upload?zpw_ver=496&zpw_type=30&params='+encodeURIComponent(encrypt(JSON.stringify({"totalChunk":1,"fileName":"file.jpeg",clientId,"totalSize":289936,imei,toid,"isE2EE":0,chunkId}),secretKey))+'&type=2',
        method: 'POST',
        headers: headers,
        formData:{
            chunkContent:request(host+':'+port+link)
        }
    };
    let responseText = await request(options);
    let {error_code,data} = JSON.parse(responseText);
    if(error_code !== 0) throw 'Cookie zalo hết hạn';
    let rT = decrypt(data,secretKey);
    let rJ = JSON.parse(rT);
    if(rJ.error_code !== 0) return null;
    if(rJ.data.finished !== 1) return null;

    return rJ.data;
};
let SendImage = async function(obj_img,toid,{cookie,secretKey,imei},desc = ''){
    var headers = {
        'authority': 'files-wpa.chat.zalo.me',
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
        url: 'https://files-wpa.chat.zalo.me/api/message/photo_original/send?zpw_ver=496&zpw_type=30&type=2',
        method: 'POST',
        headers: headers,
        form:{
            params:encrypt(JSON.stringify({
                "clientId": Date.now(),
                desc,
                "previewThumb": "",
                rawUrl:obj_img.normalUrl,
                toid,
                ...obj_img,
                "zsource": 301,
                "ttl": 0,
                imei
            }),secretKey)
        }
    };
    
    let responseText = await request(options);
    let {error_code,data} = JSON.parse(responseText);
    if(error_code === 0){
        let t = await decrypt(data,secretKey);
        let j = JSON.parse(t);
        if(j.error_code !== 0) throw 'Không thể gửi hình ảnh';
        return true;
    }else{
        throw 'Không thể gửi tin nhắn.Vui lòng kiểm tra cookie Zalo'
    }
};
module.exports = async (message,toid,{cookie,imei,secretKey},list_image = [])=>{
    if(list_image.length === 0){
        return await SendText(message,toid,{cookie,imei,secretKey});
    }
    else if(list_image.length === 1){
        let obj_img = await UploadImage(list_image[0],toid,{cookie,imei,secretKey});
        if(obj_img) return await SendImage(obj_img,toid,{cookie,imei,secretKey},message);
    }else if(list_image.length > 1){
        let groupLayoutId = Date.now().toString();
        let totalItemInGroup = list_image.length;
        let isGroupLayout = 1;
        let map_upload = list_image.map(link_img=>UploadImage(link_img,toid,{cookie,imei,secretKey}));
        let result_upload = await Promise.all(map_upload);
        result_upload = result_upload.filter(e=>e).map((e,index)=>({...e,groupLayoutId,totalItemInGroup,isGroupLayout,idInGroup:index+1}));
        let map_send = result_upload.map(obj_img=>SendImage(obj_img,toid,{cookie,imei,secretKey}));
        await Promise.all(map_send);
        await SendText(message,toid,{cookie,imei,secretKey});
    }
    return;
    
};