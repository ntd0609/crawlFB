/**
 * FbController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  'go':async function(req,res){
    let {id} = req.query;
    let find_token = await Token.find({live:true});
    if(find_token.length > 0){
        let access_token = find_token[0].access_token;
        return res.redirect('https://graph.facebook.com/v11.0/'+id+'?fields=__type__,admin_creator,actions,backdated_time,with_tags,reactions,sharedposts,comments,attachments,id,updated_time,status_type,properties,promotable_id,promotion_status,scheduled_publish_time,width,via,story,shares,place,privacy,parent_id,message,event,created_time,coordinates,from,edit_actions,is_published,full_picture,height,icon,live_video_eligibility,subscribed,story_tags,to,timeline_visibility,permalink_url,target,targeting,likes,is_hidden,instream_eligibility,dynamic_posts,sponsor_tags,message_tags,feed_targeting,expanded_width,expanded_height,is_app_share,is_expired,is_popular,is_spherical,is_eligible_for_promotion,is_instagram_eligible,child_attachments,comments_mirroring_domain&access_token='+access_token)
    }else{
        return res.send("Không tìm thấy token phù hợp");
    }
  }

};

