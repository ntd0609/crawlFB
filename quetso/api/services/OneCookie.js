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
let make = async function(){
        
        let where_token = {live:true,cookie:{contains:'c_user='}};
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
                throw 'Không tìm thấy Cookie';
        }else{
                let {access_token,id,cookie} = list_use_config[0];
              
                return {access_token,cookie,token_id:id};
        }
};
module.exports = make;