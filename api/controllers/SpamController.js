const {LikePage,LikePost} = require('../services/spam/like');
const Comment = require('../services/spam/comment');
const Follow = require('../services/spam/follow');

module.exports = {
  like:async function(req,res){
    try{
      let {url,reactions} = req.body;
      let {page_ID,post_ID,feedback_ID} = await GetFeedbackId(url);
      let link_profile = url.includes('profile.php?id=');
     if((page_ID && post_ID) && !link_profile){
     
      await LikePost(feedback_ID,reactions)
     }else if(page_ID){
      console.log(page_ID);
      await LikePage(page_ID)
     }
      return res.ok();
    }catch(error){
      return res.send({error});
    }
  },
  follow:async function(req,res){
    try{
      let {url} = req.body;
      let {page_ID} = await GetFeedbackId(url);
      await Follow(page_ID);
      return res.ok();
    }catch(error){
      return res.send({error});
    }
  },
  comment:async function(req,res){
    try{
      let {url,message} = req.body;
      let {page_ID,post_ID} = await GetFeedbackId(url);
      await Comment(page_ID,post_ID,message);
    }catch(error){
      return res.send({error});
    }
    

  }

};

