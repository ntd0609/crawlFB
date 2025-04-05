

module.exports = {

  attributes: {
    type:{
      type:'string',
      isIn:['free','month','year','admin'],
      required:true
    },
    limit_phone:{
      type:'number',
      defaultsTo:0
    },
    limit_time:{
      type:'number',
      defaultsTo:0
    },
    limit_post:{
      type:'number',
      defaultsTo:0
    },
    limit_hide:{
      type:'number',
      defaultsTo:0
    },
    price:{
      type:'number',
      defaultsTo:0
    },
    permission:{
      type:'json',
      defaultsTo:[]
    },
    

  },
  beforeCreate:async function(val,callback){
    await Package.destroy({type:val.type});
    return callback();
  }
};

