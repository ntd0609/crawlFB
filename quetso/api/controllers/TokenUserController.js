
const GetListPage = require('../services/GetListPage');
const PostToPage = require('../services/PostToPage');
const GetInfo = require('../services/GetInfo');
module.exports = {
    count:async function(req,res){
        let {user_id,uid} = req.body;
        let count = await TokenUser.count({user_id,uid});
        return res.send({count});
    },
    check:async function(req,res){
        let {cookieuser_id} = req.body;
        try{
            
            let find_acc = await CookieUser.find({id:cookieuser_id});
            if(find_acc.length === 0) return res.ok();
            let {token_bm,cookie} = find_acc[0];
            let info = await GetInfo(token_bm,cookie);
            await CookieUser.update({id:cookieuser_id}).set({live:true});
            return res.send({live:true})
        }catch(error){
            await CookieUser.update({id:cookieuser_id}).set({live:false});

                       return res.send({live:false})

        }
    },
    'import':async function(req,res){
        let {cookie,user_id,otp} = req.body;
        try{
            console.log('STEP 1');
            let token_bm_obj = await GetTokenBM(cookie,otp);
            let token_bm = token_bm_obj.access_token;
            let fb_dtsg = token_bm_obj.fb_dtsg;
            console.log('STEP 2');
           

            let token_full_permission = await GetTokenFullPermission(cookie,fb_dtsg);
            console.log('STEP 3');
            
           
            let info = await GetInfo(token_bm,cookie);
            console.log('STEP 4');
           

            await Promise.all([CookieUser.destroy({uid:info.uid,user_id}),TokenUser.destroy({uid:info.uid,user_id}),TokenUser.destroy({uid:info.uid,user_id})])
            await CookieUser.create({user_id,cookie,token_full_permission,fb_dtsg,token_bm,...info});
         

            let list_page = await GetListPage(token_bm,cookie);
            

            for(let data of list_page){
                data.cookie = cookie;
                data.user_id = user_id;
                await TokenUser.create(data);
            }
            return res.ok();

        }catch(error){
           console.log(error);
            return res.send({error})
        }
    },
    'remove':async function(req,res){
        let {uid,user_id} = req.body;
        await Promise.all([CookieUser.destroy({user_id,uid}),TokenUser.destroy({user_id,uid})]);
        return res.ok();
    },
    'get-cookie-wordpress':async function(req,res){
        let {web,username,password,user_id} = req.body;
        let cookie = await GetCookieWordpress(web,username,password);
        return res.send({cookie});
    },
    'create-post':async function(req,res){
        let {post,page,user_id} = req.body;
        let data = await PostToPage(post,page,user_id);
        return res.send(data);

    },
    'create-post-wp':async function(req,res){
        let {post,page,status,user_id} = req.body;
        let data = await PostToWordpress({web:page.web,status,url_post:post.url},post,page.cookie,user_id);
        return res.send(data);

    },
    'refresh-fb-dtsg':async function(req,res){
        try{
            let {token_id,cookie} = req.body;
            let fb_dtsg = await GetFB_dtsg(cookie);
            await CookieUser.update({id:token_id}).set({fb_dtsg});
            return res.send({fb_dtsg});
        }catch(error){
            return res.send({error:"Cookie hết hạn"})
        }
    },
    'refresh-cookie':async function(req,res){
     let {id,user_id} = req.body;
     let find_cookie = await CookieUser.find({id});
     if(find_cookie.length === 0) throw 'Không tìm thấy tài khoản';
     try{
        let {token_bm,uid,cookie} = find_cookie[0];
        let list_page = await GetListPage(token_bm,cookie);
        await TokenUser.destroy({uid,user_id});
        

        for(let data of list_page){


          data.user_id = user_id;
          data.cookie = cookie;
          await TokenUser.create(data);
      }
      await CookieUser.update({id}).set({live:true});
      return res.ok();
  }catch(error){
    console.log(error);
    await CookieUser.update({id}).set({live:false});
    return res.send({error:'Cookie hết hạn'})
}
}

};

