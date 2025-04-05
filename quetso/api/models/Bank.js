
module.exports = {

  attributes: {
    stk:{
      type:'string',
      required:true,
    },
    ho_va_ten:{
      type:'string',
      required:true
    },
    ngan_hang:{
      type:'string',
      required:true
    },
    chi_nhanh:{
      type:'string'
    }

  },
  beforeCreate:async function(val,callback){
    let find_bank = await Bank.find();
    for(let {id} of find_bank) await Bank.destroy({id});
    return callback();
  }
};

