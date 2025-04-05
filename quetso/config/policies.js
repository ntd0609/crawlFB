


 module.exports.policies = {


  '*': true,
  'user/*':true,
  'account/*':['isLoggedIn'],
  'scanpost/*':['isLoggedIn'],
  'urlscan/*':['isLoggedIn'],
  'page/*':['isLoggedIn'],
  'countuid/*':['isLoggedIn'],
  'rule/*':['isLoggedIn'],
  'tokenuser/*':['isLoggedIn'],
  'cookieuser/*':['isLoggedIn'],
  'hide/*':['isLoggedIn'],
  'blockedkeyword/*':['isLoggedIn'],
  'blockedkeywordhide/*':['isLoggedIn'],
  'messagesample/*':['isLoggedIn'],
  'zaloaccount/*':['isLoggedIn'],
  'zalo/*':['isLoggedIn'],




};
