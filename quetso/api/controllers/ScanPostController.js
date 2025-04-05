
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
let StartTimeComment = function(){
            var d = new Date();
            d.setHours(0);
            d.setMinutes(0);
            d.setSeconds(0);
            d.setMilliseconds(0);
            return parseInt(d.getTime()/1000);
};
module.exports = {
    
    'get-count-comment':async function(req,res){
        try{
            let {user_id,url_object} = req.body;
            let push = await CountComment(url_object);
            return res.send({push})
        }catch(error){
            
            return res.send({error});
        }
    },
    'get-count-comment-24h':async function(req,res){
        try{
            let {user_id,url_id} = req.body;
             let count = await ScanPost.count({url_id,time:{'>':StartTimeComment()}})
            return res.send({count})
        }catch(error){
            
            return res.send({error});
        }
    },
    'check-hide-comment':async function(req,res){
        try{
         let {user_id,comment,delay_time,list,test_part} = req.body;
         /*
         let list_log_scan = await LogTokenScan.find({user_id});
         
         for(let log of list_log_scan){
            await Token.update({id:log.token_id}).set({used:false});
          
            await LogTokenScan.destroy({id:log.id})
        }
        */
        await CheckPost(user_id,comment,delay_time,list,test_part);
        return res.ok();
    }catch(error){
      
        return res.send({error});
    }
},
'check-hide-comment-link':async function(req,res){
    try{
        let {user_id,delay_time,list,test_part} = req.body;
        
        for(let log of list){
            await Token.update({id:log.token_id}).set({used:false});
         
        }
        let comment = '';
        let check = await CheckPost(user_id,comment,delay_time,list,test_part);
        return res.send({check});
    }catch(error){
        console.log(error);
        return res.send({error});
    }
},
'add-link':async function(req,res){
    try{
        let {url_post,user_id,name_post} = req.body;
        if(!url_post.includes('.php')){
            let {origin,pathname} = new URL(url_post);
            url_post = origin+pathname;
        }

        let find_account = await Account.find({id:user_id});
        if(find_account.length === 0) throw 'Không tìm thấy tài khoản';
        let {limit_post} = find_account[0];

        let count_url = await UrlScan.count({user_id});

        if(limit_post < (count_url+1)) throw 'Số bài đã vượt quá giới hạn.Liên hệ Admin để nâng cấp gói cước.';


        if(url_post.includes('<iframe')){
            let d = decodeURIComponent(url_post);
            let startS = 'href=';
            let endS = '&show_text';
            url_post = d.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs"))[0];
        }
        let find_feedback = await UrlScan.find({user_id,url:url_post});
        if(find_feedback.length > 0) throw 'Đã nhập link bài viết này';
        let find_delay = await DelayDefault.find().sort('createdAt DESC');
        let delay = (find_delay.length > 0) ? find_delay[0].time : 5;
        let {post_ID,page_ID,feedback_ID} = await GetFeedbackId(url_post);
        let import_data = await UrlScan.create({url:url_post,delay,feedback_ID,post_ID,page_ID,name_post,user_id,status:false}).fetch();
        return res.send(import_data);
    }catch(error){
        console.log(error);
        return res.send({error});
    }
},


'scan-realtime-comment':async function(req,res){
    let {url_id,user_id} = req.body;
    try{
        let find_token = await Token.find({live:true,used:false});
        if(find_token.length === 0) throw 'Không tìm thấy Token để quét';

        Realtime(url_id,user_id);
        return res.ok();
    }catch(error){

        return res.send({error});
    }
},
'stop-scan-realtime-comment':async function(req,res){

    let {url_id,user_id} = req.body;
    let find_LogTokenScan = await LogTokenScan.find({user_id,url_id,type:'comment'});
    if(find_LogTokenScan.length > 0){
        for(let {id,token_id,url_id,user_id} of find_LogTokenScan){
         await Token.update({id:token_id}).set({used:false});
         await LogTokenScan.destroy({user_id,token_id,url_id,type:'comment'});
     }

 }
 return res.ok();
},
'scan-old-comment':async function(req,res){
    let {url_id,user_id} = req.body;
    try{
        let find_token = await Token.find({live:true,used:false});
        if(find_token.length === 0) throw 'Không tìm thấy Token để quét';

        OlderComment(url_id,user_id);
        return res.ok();
    }catch(error){

        return res.send({error});
    }
},
'stop-scan-old-comment':async function(req,res){
   let {url_id,user_id} = req.body;
   let find_LogTokenScan = await LogTokenScan.find({user_id,url_id,type:'old-comment'});
   if(find_LogTokenScan.length > 0){
    for(let {id,token_id,url_id,user_id} of find_LogTokenScan){
     await Token.update({id:token_id}).set({used:false});
     await LogTokenScan.destroy({user_id,token_id,url_id,type:'old-comment'});
 }

}
return res.ok();
},
'scan-reaction':async function(req,res){
    try{
        let {url_id,user_id} = req.body;
        let find_token = await Token.find({live:true,used:false});
        if(find_token.length === 0) throw 'Không tìm thấy Token để quét';

        Reaction(url_id,user_id);
        return res.ok();
    }catch(error){
        return res.send({error});
    }

},
'stop-scan-reaction':async function(req,res){
    let {url_id,user_id} = req.body;
    let find_LogTokenScan = await LogTokenScan.find({user_id,url_id,type:'reaction'});
    if(find_LogTokenScan.length > 0){
        for(let {id,token_id,url_id,user_id} of find_LogTokenScan){
         await Token.update({id:token_id}).set({used:false});
         await LogTokenScan.destroy({user_id,token_id,url_id,type:'reaction'});
     }

 }
 return res.ok();

},
'comment':async function(req,res){

    let count = await ScanPost.count(req.body);
    return res.send({count});
},
'turn-off':async function(req,res){
    try{
       let {user_id,url_id} = req.body;
       let find_LogTokenScan = await LogTokenScan.find({user_id,url_id});
       if(find_LogTokenScan.length > 0){
        await Token.update({id:find_LogTokenScan[0].token_id}).set({used:false});
        await LogTokenScan.destroy({url_id});
    }

    return res.ok();
}catch(error){
    console.log(error);
}

},
'remove':async function(req,res){
    let {user_id,url_id} = req.body;
    let find_LogTokenScan = await LogTokenScan.find({user_id,url_id});
    if(find_LogTokenScan.length > 0){
        await Token.update({id:find_LogTokenScan[0].token_id}).set({used:false});
        await LogTokenScan.destroy({url_id});
    }
    await Promise.all([ScanPost.destroy({url_id}),UrlScan.destroy({id:url_id})])
    return res.ok();
},
'count-today':async function(req,res){
    let {url_id} = req.body;

    let uid_today = await ScanPost.count({where:{url_id,time:{'>':today()}}});
    let comment_today = await ScanPost.count({where:{url_id,type:'comment',time:{'>':today()}}});


    return res.send({uid_today,comment_today});
},
'count':async function(req,res){
    let where = req.body;
    delete where.phone;
    let count = await ScanPost.count(where);
    let count_phone = await ScanPost.count({...where,phone:{'!=':""}});

    return res.send({count,count_phone});
},
'count-urlscan':async function(req,res){

    let count = await UrlScan.count(req.body);
    return res.send({count})
},
'download-comment':async function(req,res){
    try{
        let list_fb = await ScanPost.find(req.body);
        if(list_fb.length === 0) throw 'Không tìm thấy người tương tác';
        let workbook = new Excel.Workbook();
        workbook.addWorksheet('du_lieu');
        let worksheet = workbook.getWorksheet('du_lieu');
        worksheet.columns = [
        {header:'Time',key:'time',width:30},

        {header:'URL',key:'url',width:30},
        {header:'Name Post',key:'name_post',width:80},
        {header:'UID',key:'uid',width:30},
        {header:'Name',key:'name',width:30},
        {header:'Comment',key:'comment',width:30},
        {header:'Phone',key:'phone',width:30},
        {header:'Note',key:'note',width:30},

        {header:'Type',key:'type',width:30},

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
'download':async function(req,res){
    try{
        let list_fb = await ScanPost.find(req.body);
        if(list_fb.length === 0) throw 'Không tìm thấy người tương tác';
        let workbook = new Excel.Workbook();
        workbook.addWorksheet('du_lieu');
        let worksheet = workbook.getWorksheet('du_lieu');
        worksheet.columns = [
        {header:'URL',key:'url',width:80},
        {header:'UID',key:'uid',width:30},
        {header:'Name',key:'name',width:30},
        {header:'Comment',key:'comment',width:30},
        {header:'Phone',key:'phone',width:30},
        {header:'Type',key:'type',width:30},

        ];

        for(let data of list_fb){
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

