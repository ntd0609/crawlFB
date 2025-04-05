let Info = require('../services/zalo/Info.js'); // (cookie)
let AddFriend = require('../services/zalo/AddFriend.js'); // (toid,{cookie,secretKey,imei})
let GetSecretKey = require('../services/zalo/GetSecretKey.js'); // (cookie, imei)
let Rename = require('../services/zalo/Rename.js'); // (name,toid,{cookie,secretKey,imei})
let Search = require('../services/zalo/Search.js'); // (phone,{cookie,secretKey,imei})
let SendMessage = require('../services/zalo/SendMessage.js'); // (message,toid,{cookie,secretKey,imei})

module.exports = {
    'import':async function(req,res){
        let {user_id,cookie,imei} = req.body;
        let info = await Info(cookie);
        if(info){
            let secretKey = await GetSecretKey(cookie,imei);
            let c = await ZaloAccount.create({user_id,imei,secretKey,cookie,...info}).fetch();
            return res.send(c);
        }else{
            return res.send({error:'Cookie không hợp lệ'})
        }
    },
    check:async function(req,res){
        try{
            let {zalo_id} = req.body;
            let find_zalo = await ZaloAccount.find({id:zalo_id});
            if(find_zalo.length === 0) throw 'Không tìm thấy tài khoản zalo';
            let info = await Info(find_zalo[0].cookie);
            if(!info){
                await ZaloAccount.update({id:zalo_id}).set({live:false})
                throw 'Cookie không hợp lệ';
            }
            return res.send({live:true})
        }catch(error){
            return res.send({live:false});
        }        
    },
    'get-uid':async function(req,res){
        try{
            let {phone,cookie,secretKey,imei} = req.body;
            let toid = await Search(phone,{cookie,secretKey,imei});
            return res.send({toid});
        }catch(error){
            return res.send({error});
        }
    },
    'rename':async function(req,res){
        try{
            let {name,toid,cookie,secretKey,imei} = req.body;
            let r = await Rename(name,toid,{cookie,secretKey,imei});
            return res.send(r);
        }catch(error){
            return res.send({error});
        }
    },
    'add-friend':async function(req,res){
        try{
            let {toid,cookie,secretKey,imei} = req.body;
            let r = await AddFriend(toid,{cookie,secretKey,imei});
            return res.send(r);
        }catch(error){
            return res.send({error});
        }
    },
    'send-message':async function(req,res){
        try{
            let {messagesample_id,toid,cookie,secretKey,imei} = req.body;
            let find_message = await MessageSample.find({id:messagesample_id});
            if(find_message.length === 0) throw 'Không tìm thấy nội dung tin nhắn để gửi';
            let {message} = find_message[0];
            let find_attachment = await Attachment.find({messagesample_id});
            let list_image = find_attachment.map(e=>e.url);
            let r = await SendMessage(message,toid,{cookie,secretKey,imei},list_image);
            return res.send(r);
        }catch(error){
            return res.send({error});
        }
    }
};

