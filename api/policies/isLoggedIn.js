
const {crypt:{key}} = require('../../nuxt.config');
let validate = async (req)=>await Security.decode(req.headers.authorization);
module.exports = async function isLoggedIn(req, res, next) {

  try{
    if(req.headers.key === key) return next();
    let {id,time} = await validate(req);
    let data = await Account.find({id});

    if(data.length === 0) throw null;
     let {limit_time} = data[0];
    if(limit_time < Date.now()) throw false;
    req.body = req.body ? req.body : {};
    req.body.user_id = id;
    req.query.user_id = id;
    if(req.query.where){
      let where = JSON.parse(req.query.where);
      where.user_id = id;
      req.query.where = JSON.stringify(where);
    }
    return next();
  }catch(error){
    return res.forbidden();
  }
  


};
