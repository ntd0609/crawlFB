/**
 * AccessController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

 module.exports = {
  'post':async function(req,res){
    let {url_id} = req.query;
    let find_urlscan = await UrlScan.find({id:url_id});
    let post_ID = find_urlscan.length > 0 ? find_urlscan[0].post_ID : '';
    return res.redirect('https://www.facebook.com/'+post_ID)
},

};

