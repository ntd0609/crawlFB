/**
 * PageID.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    page_id:{
      type:'string',
      required:true
    },
    url:{
      type:'string',
      required:true
    },
    page_name:{
      type:'string',
      required:true
    },
    type:{
      type:'string',
      isIn:['group','page']
    }

  },

};

