
 module.exports = {

  attributes: {
   
    user_id:{
      type:'string',
      required:true
    },
   status_id:{
    type:'number',
    isIn:[0,1,2],
    defaultsTo:0
   },
   status_zalo_id:{
    type:'number',
    isIn:[0,1,2],
    defaultsTo:0
   },
    hide_id:{
      type:'string',
      required:true
    },
    post_ID:{
      type:'string',
      required:true
    },
    title:{
      type:'string',
      required:true
    },
    pageName:{
      type:'string',
      required:true
    },
    page_ID:{
      type:'string',
      required:true
    },
    uid:{
      type:'string',
      required:true
    },
    name:{
      type:'string',
      required:true
    },
    phone:{
      type:'string',
      allowNull:true
    },
    
    comment:{
      type:'string',
      defaultsTo:''
    },
    note_id:{
      type:'number',
      defaultsTo:0
    },
    time:{
      type:'number',
      defaultsTo:Date.now()/1000
    },
    note:{
      type:'string',
      defaultsTo:''
    },
    keysearch:{
      type:'string',
      defaultsTo:''
    }

  },
  beforeCreate:async function(val,callback){
   val.keysearch = (val.title+val.name+val.post_ID+val.pageName+val.page_ID+val.comment+val.phone).toLowerCase()
    
    
    return callback();
    

  }
};

