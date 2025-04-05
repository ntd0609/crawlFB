/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
 const fs = require('fs');
 const random = require('randomstring');
 const {head:{title},domain} = require('../../nuxt.config');
 let validate = async (req)=>await Security.decode(req.headers.authorization);
 const {encode,decode} = require('../services/Security');

 module.exports = {
  login:async function(req,res){
    try{
        let {phone,password} = req.body;
        
        if(!phone) throw 'Không tìm thấy tên đăng nhập';

        let find_account = await Account.find({phone});
        if(find_account.length === 0) throw 'Tài khoản chưa được đăng kí';

        let {id,pass_hash,limit_time} = find_account[0];

        
        let password_user = await Security.decode(pass_hash);
        
        if(password !== password_user) throw 'Sai mật khẩu';

        if(limit_time < Date.now()) throw 'Hết ngày sử dụng.Liên hệ Admin để nâng cấp gói cước.';

        let token = await Security.encode({id,time:Date.now()})
        
        return res.json({token});

    }catch(error){
        console.log(error);
        return res.send({error});
    }
},
register:async function(req,res){
    try{

        let {email,phone,password} = req.body;

        if(!password) throw 'Chưa nhập mật khẩu';
        if(!email) throw 'Chưa nhập email';
        if(!phone) throw 'Chưa nhập Số điện thoại';


        let find_exists_phone = await Account.findOne({phone});
        if(find_exists_phone) throw 'Số điện thoại này đã được đăng kí';

        let find_exists_email = await Account.findOne({email});
        if(find_exists_email) throw 'Email này đã được đăng kí';

        let pass_hash = await Security.encode(password);

        let user = await Account.create({email,phone,pass_hash}).fetch();



        return res.send(user);

    }catch(error){

        return res.send({error})
    }
},
reset:async function(req,res){
    try{
        let {email} = req.body;
        let find_account = await Account.find({email});
        if(find_account.length === 0) throw 'Không có tài khoản nào liên kết với email này';
        let {id} = find_account[0];
        let key = await encode({id,time:Date.now()});
        await ResetPassword(email,key);
        return res.ok();
    }catch(error){
        return res.send(error);
    }
},
'reset/info':async function(req,res){
    try{
        let {key} = req.body;
        console.log(key);
        let data = await decode(key);
        console.log(data);
        let find_account = await Account.find({id:data.id});
        if(find_account.length === 0) throw 'Không tìm thấy tài khoản';
        let {email} = find_account[0];
        console.log(email);
        return res.send({email})
    }catch(error){
        return res.send({error});
    }
},
'reset/new-password':async function(req,res){
    try{
        let {key,password} = req.body;
        let data = await decode(key);
        let pass_hash = await Security.encode(password);
        await Account.update({id:data.id}).set({pass_hash});
        return res.ok();
    }catch(error){
        return res.send({error});
    }
}


};

