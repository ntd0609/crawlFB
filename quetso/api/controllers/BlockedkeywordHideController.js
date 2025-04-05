

module.exports = {
  list:async function(req,res){
    let {user_id} = req.body;
    let list = await BlockedKeywordHide.find({hide_id});
    return res.send(list);
  },
 
  save:async function(req,res){
    let {user_id,value} = req.body;
    let c = await BlockedKeywordHide.create({user_id,value}).fetch();
    return res.send(c);
  }

};

