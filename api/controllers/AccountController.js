/**
 * AccountController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
 const fs = require('fs');
 const random = require('randomstring');
 const {head:{title},domain} = require('../../nuxt.config');
 let validate = async (req)=>await Security.decode(req.headers.authorization);
 module.exports = {
 	info:async function(req,res){
 		try{
 			let {id} = await validate(req);
 			let data = await Account.findOne({id});
 			if(!data) throw null;
 			return res.json(data);
 		}catch(error){
 			
 			return res.send({error:'Token hết hạn'})
 		}
 	},
 	
    'check-password':async function(req,res){
       try{
        let {id,time} = await validate(req);
        let data = await Account.findOne({id});
        if(!data) throw null;
        let {password} = req.body;
        let password_user = await Security.decode(data.pass_hash);
        if(password_user !== password) throw 'Mật khẩu không chính xác.';

        return res.ok();
    }catch(error){

        return res.send({error})
    }
},
'update-info':async function(req,res){
   let {id,email,phone} = req.body;
   await Account.update({id}).set({email,phone});
   return res.ok();
},
'update-password':async function(req,res){
   try{
    let {id,time} = await validate(req);
    let data = await Account.findOne({id});
    if(!data) throw null;
    let {code,password} = req.body;
    let pass_hash = await Security.encode(password);
    await Account.update({id}).set({pass_hash})
    return res.ok();
}catch(error){

    return res.send({error:'Token hết hạn'})
}
},
logout:async function(req,res){
   let {id,time} = await validate(req);
   return res.ok();
},



};

