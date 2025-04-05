/**
 * AdminController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 module.exports = {
    user:async function(req,res){
        let list = await Account.find(req.body);
        return res.send(list);
    },
    'all-post':async function(req,res){
        let {pager,limit,where} = req.body;
        let all_post = await UrlScan.find({where}).limit(limit).skip((pager - 1)*100);
        return res.send(all_post);
    },
    'count-post':async function(req,res){
        let {where} = req.body;
        let count = await UrlScan.count({where});
        return res.send({count});
    },
    'count-post':async function(req,res){
        let {where} = req.body;
        let count = await UrlScan.count({where});
        return res.send({count});
    },
    'update/phone':async function(req,res){
        let {id,limit_phone} = req.body;
        limit_phone = parseInt(limit_phone);
        await Account.update({id}).set({limit_phone});
        return res.ok();
    },
    'update/hide':async function(req,res){
        let {id,limit_hide} = req.body;
        limit_hide = parseInt(limit_hide);
        await Account.update({id}).set({limit_hide});
        return res.ok();
    },
    'update/time':async function(req,res){
        let {id,limit_time} = req.body;
        limit_time = parseInt(limit_time);
        await Account.update({id}).set({limit_time});
        return res.ok();
    },
    'update/post':async function(req,res){
        let {id,limit_post} = req.body;
        limit_post = parseInt(limit_post);
        await Account.update({id}).set({limit_post});
        return res.ok();
    },
    'update/package':async function(req,res){
        let {id,value} = req.body;
        await Account.update({id}).set({package:value});
        return res.ok();
    },
    'set/package':async function(req,res){
        let {type,limit_hide,limit_phone,limit_time,limit_post,price} = req.body;
        limit_phone = parseInt(limit_phone);
        limit_hide = parseInt(limit_hide);
        limit_post = parseInt(limit_post);
        limit_time = parseInt(limit_time);
        await Package.update({type}).set({limit_hide,limit_phone,limit_post,limit_time,price});
        return res.ok();
    },
    remove:async function(req,res){
        let {id} = req.body;
        if(id){
            let user_id = id;

            await Promise.all([Account.destroy({id}),ScanPost.destroy({user_id}),UrlScan.destroy({user_id})])
            let find_LogTokenScan = await LogTokenScan.find({user_id});
            for(let log of find_LogTokenScan){
              await Token.update({id:log.token_id}).set({used:false})
          }
          await LogTokenScan.destroy({user_id})


      }

      return res.ok();
  },
  token:async function(req,res){
    let {user_id} = req.body;
    let find_token = await Token.find({user_id});
    return res.send(find_token);
},
};

