/**
 * TokenController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 module.exports = {
    'convert-bm':async function(req,res){
        let {cookie} = req.body;
        let token = await GetTokenBM(cookie);
        return res.send(token ? token.access_token : '');
    },
    'convert-fullpermission':async function(req,res){
        let {cookie} = req.body;
        let token = await GetTokenFullPermission(cookie);
        return res.send(token);
    },
    'remove-token-die':async function(req,res){

        await Token.destroy({live:false,used:false});
        return res.ok();
    },
    'download-token-die':async function(req,res){
        let find_token = await Token.find({live:false,used:false});
        let token = find_token.map(e=>e.access_token).join('\n');

        res.attachment('file.txt')
        res.type('txt')
        res.send(token)
        
    },
    'add':async function(req,res){
        let {text} = req.body;
        let access_token = text;
        let cookie = '';
        if(text.includes('c_user=')){
            cookie = text;
            let token_data = await GetToken(text);
            access_token = token_data.access_token;
        }

        let check = await CheckToken(access_token,cookie);
        if(check){
            let info = await GetInfoToken(access_token,cookie);
            await Token.destroy({access_token});
            let c = await Token.create({cookie,access_token,...info}).fetch();
            return res.send(c);
        }else{
            return res.send({error:'Token die !'})
        }

        
        
        return res.send(c);
    },
    'count':async function(req,res){
        let count = await Token.count();
        let count_live = await Token.count({live:true});
        let count_die = await Token.count({live:false});
        let count_used = await Token.count({used:true});
        let count_cookie = await Token.count({cookie:{contains:'c_user'}});
        let count_token = await Token.count({cookie:''});

        return res.send({count,count_cookie,count_token,count_live,count_die,count_used});
    },
    
    'check':async function(req,res){

        let list_token = await Token.find().sort('live ASC');
        for(let {access_token,cookie,id} of list_token){
            let live = await CheckToken(access_token,cookie);
            await Token.update({id}).set({live})
        }
        return res.ok();
    }
};

