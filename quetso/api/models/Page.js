/**
 * Page.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    user_id:{
      type:'string',
      required:true
    },
    access_token:{
      type:'string',
      required:true
    },
    pageId:{
      type:'string',
      required:true
    },
    pageName:{
      type:'string',
      allowNull:true
    },
    userId:{
      type:'string',
      allowNull:true
    },
    userName:{
      type:'string',
      allowNull:true
    },
    count_inbox:{
      type:'number',
      defaultsTo:0
    }

  },

};

