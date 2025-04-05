const request = require('request-promise');
let waitTime = time=>{
        return new Promise(resolve=>{
                setTimeout(function(){
                        return resolve(time)
                },time)
        });
};
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
let make = async function(token_die = null){
        if(token_die){
                await Token.update({access_token:token_die}).set({used:false});
                let live = await CheckToken(token_die);
                await Token.update({access_token:token_die}).set({live});
        }
        let where_token = {live:true,used:false,cookie:''};
        if(token_die) where_token.access_token = {'!=':token_die};
        let count_config = await Token.count(where_token);
        let find_config = await Token.find(where_token).skip(randomInteger(0,count_config-1));
        let list_use_config = [];
        for(let config of find_config){
                let check = await CheckToken(config.access_token,config.cookie);
                if(check){
                        list_use_config.push(config);
                        break;
                }else{
                        await Token.update({id:config.id}).set({live:false})
                }
        }
        if(list_use_config.length === 0){
                throw 'Không tìm thấy token';
        }else{
                let {access_token,id,cookie} = list_use_config[0];
                await Token.update({id}).set({used:true})
              
                return {access_token,cookie,token_id:id};
        }
};
module.exports = make;