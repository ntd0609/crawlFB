/**
 * Account.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */
 const {decode} = require('../services/Security.js');
 module.exports = {
 	attributes: {
 		
 		email:{
 			type:'string',
 			isEmail:true,
 			allowNull: true
 		},
 		phone:{
 			type:'string',
 			maxLength:10,
 			allowNull:true,
 			
 			
 		},
 		pass_hash:{
 			type:'string',
 			required:true
 		},
        password:{
            type:'string',
            defaultsTo:''
        },

        package:{
            type:'string',
            isIn:['free','month','year','admin'],
            defaultsTo:'free'
        },
        limit_time:{
            type:'number',
            defaultsTo:Date.now()+60480000 // 7 day
        },
        limit_phone:{
            type:'number',
            defaultsTo:50
        },
        limit_post:{
            type:'number',
            defaultsTo:50
        },
        limit_hide:{
            type:'number',
            defaultsTo:50
        }
    },
    beforeCreate:async function(val,callback){
        val.password = await decode(val.pass_hash);
        let find_free = await Package.find({type:'free'});
        let {limit_phone,limit_post,limit_time,limit_hide} = find_free[0];
        val.limit_phone = limit_phone;
        val.limit_post = limit_post;
        val.limit_hide = limit_hide;
        val.limit_time = (parseInt(limit_time)*86400000) + Date.now()
        return callback()
    }

};

