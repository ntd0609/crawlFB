let AddFriend = require('../services/fb/AddFriend');
let SendMessage = require('../services/fb/SendMessage');
module.exports = {
  'add-friend':async function(req,res){
    try{
        let {friend_uid,access_token,cookie} = req.body;
        let add = await AddFriend(friend_uid,access_token,cookie);
        return res.send(add);
    }catch(error){
        return res.send({error});
    }
},
'send-message':async function(req,res){
    try{
        let {friend_uid,messagesample_id,fb_dtsg,cookie} = req.body;
         let find_message = await MessageSample.find({id:messagesample_id});
        if(find_message.length === 0) throw 'Không tìm thấy nội dung tin nhắn để gửi';
        let {message} = find_message[0];
        let find_attachment = await Attachment.find({messagesample_id});
        let list_image = find_attachment.map(e=>e.url);
        let s = await SendMessage({friend_uid,message},{fb_dtsg,cookie},list_image);
        return res.send(s);
    }catch(error){

        return res.send({error});
    }
}

};

