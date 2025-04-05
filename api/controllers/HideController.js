
const Excel = require('exceljs');
let datetime = function(unixtime){
    let time = new Date(unixtime*1000);
    let date = time.getDate();
    let month = time.getMonth()+1;
    let year = time.getFullYear();

    let hour = time.getHours();
    let minute = time.getMinutes();
    let second = time.getSeconds();
    return hour+':'+minute+':'+second+' '+ date+'/'+month+'/'+year;
};
let today = function(){
    let datetime = new Date();
    let date = datetime.getDate();
    let month = datetime.getMonth()+1;
    let year = datetime.getFullYear();

    return Math.floor(new Date(year+'.'+month+'.'+date).getTime() / 1000)
};
module.exports = {
  'save':async function(req,res){
    try{
        let {user_id,url_post,delay,option,title} = req.body;
        let find_account = await Account.find({id:user_id});
        if(find_account.length === 0) throw 'Tài khoản không tồn tại';
        let {limit_hide} = find_account[0];
        let count_hide = await Hide.count({user_id});
        if(limit_hide <= count_hide) throw 'Bạn đã đạt giới hạn số bài viết được ẩn.Vui lòng liên hệ admin để nâng cấp gói cước.';
        let find_cookieuser = await CookieUser.find({user_id,live:true});
        if(find_cookieuser.length === 0) throw 'Không tìm thấy cookie của người dùng';
        let {cookie} = find_cookieuser[0];
        let {page_ID,post_ID,url,feedback_ID} = await GetFeedbackId(url_post,cookie);
        let find_token_user = await TokenUser.find({pageId:page_ID,user_id});
        if(find_token_user.length === 0) throw 'Vui lòng chỉ nhập link bài viết trong page sở hữu của bạn';
        let {pageName} = find_token_user[0];
        let hide_data = await Hide.create({user_id,post_ID,page_ID,pageName,feedback_ID,option,delay,title}).fetch();
        AutoHide(hide_data.id);
        return res.send(hide_data);
    }catch(error){
        console.log(error);
        return res.send({error});
    }
},
'remove-all':async function(req,res){
    let {user_id,id_page} = req.body;
    await Hide.destroy({user_id,id_page});
    return res.ok();
},
'count-comment':async function(req,res){

    let count = await HideComment.count(req.body);
    return res.send({count});
},
'count':async function(req,res){
    let {user_id,where} = req.body;
    where.user_id = user_id;
    let count = await Hide.count({where});
    return res.send({count});
},
'download-comment':async function(req,res){
    try{
        let list_fb = await HideComment.find(req.body);
        if(list_fb.length === 0) throw 'Không tìm thấy người tương tác';
        let workbook = new Excel.Workbook();
        workbook.addWorksheet('du_lieu');
        let worksheet = workbook.getWorksheet('du_lieu');
        worksheet.columns = [
            {header:'Time',key:'time',width:30},

            {header:'Page ID',key:'page_ID',width:30},
            {header:'Post ID',key:'post_ID',width:30},

            {header:'UID',key:'uid',width:30},
            {header:'Name',key:'name',width:30},
            {header:'Comment',key:'comment',width:30},
            {header:'Phone',key:'phone',width:30},
            {header:'Note',key:'note',width:30},



            ];

        for(let data of list_fb){
            data.time = datetime(data.time);
            data.phone ? data.phone : '';
            worksheet.addRow(data);
        }

        workbook.xlsx.writeBuffer()
        .then(async function(buffer) {
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Access-Control-Expose-Headers', 'X-Suggested-Filename');
            res.setHeader("Content-Disposition", "attachment; filename=du_lieu.xlsx");
            await workbook.xlsx.write(res);
            res.end();
        });
    }catch(error){
        console.log(error);
        return res.send({error});
    }

},

};

