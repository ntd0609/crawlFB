<template>

   <el-tabs v-model="active_tab" type="border-card">
    <el-tab-pane name="hide">
        <span slot="label"><i class="el-icon-notebook-2"></i> Bình luận</span>
        <el-row :gutter="20">
            <el-col align="left" :span="10" :offset="0">
                <el-tag  type="primary" :closable="false" effect="plain" size="large" :disable-transitions="false">{{comment_count}} comment</el-tag>


                <el-button type="info" @click="ExportDataComment" icon="el-icon-download" :loading="false" :plain="true" :round="false" :circle="false" :autofocus="false" size="small" :disabled="false">Export Data</el-button>

            </el-col>
            <el-col align="right" :span="14" :offset="0">
                <el-switch v-model="phone_visible" style="margin-right: 20px;" @change="GetHideComment" size="mini" active-text="Chỉ hiển thị SĐT"> </el-switch>
                <el-dropdown @command="SetNoteType">
                  <span class="el-dropdown-link">
                    <el-button :type="note_type" :loading="false" icon="el-icon-sort" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Status</el-button>

                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(data,index) in list_note" :key="index" :command="data.value">
                        <el-button :type="data.type" :loading="false" :plain="false" :round="false" :circle="true" :autofocus="false" size="mini" :disabled="false"></el-button>
                    </el-dropdown-item>

                </el-dropdown-menu>
            </el-dropdown>
            <el-date-picker
            v-model="range_time_comment"
            value-format="timestamp"
            @change="GetHideComment"
            type="daterange"
            size="mini"
            align="right"
            unlink-panels
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            >
        </el-date-picker>
    </el-col>
</el-row>
<br>
<el-row :gutter="10">
    <el-col align="left" :span="6" :offset="0">
       <el-input @keyup.enter.native="GetHideComment" @change="GetHideComment" placeholder="Keysearch ..." prefix-icon="el-icon-search" v-model="keysearch_comment" size="small" spellcheck="false" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
   </el-col>
   <el-col align="left" :span="8" :offset="0">
    <el-button type="primary" @click="OpenKeywordDialog" icon="" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="small" :disabled="false">Ẩn comment có chứa từ khóa</el-button>
</el-col>
</el-row>
<br>
<el-table :data="list_comment" v-loading="comment_loading" :row-class-name="tableRowClassName" :border="true" :highlight-current-row="false" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="none" style="width: 100%">

  <el-table-column label="Time" align="center" :sortable="false" width="150" :fixed="false">
      <template slot-scope="scope">
        <el-tag @click="AddFriend(scope.row)" class="pointer" :type="GetStatusInvite(scope.row)" :closable="false" effect="plain" size="large" :disable-transitions="false">
            {{datetime(scope.row.time)}}
        </el-tag>
    </template>
</el-table-column>
<el-table-column label="Title" align="center"  width="180" :sortable="false" :fixed="false">
    <template slot-scope="scope">
        <el-tooltip effect="dark" :content="scope.row.post_ID" placement="top-start">
            <el-link :href="'https://facebook.com/'+scope.row.post_ID" target="_blank" :underline="false"> {{scope.row.title}}</el-link>

        </el-tooltip>
    </template>
</el-table-column>


<el-table-column label="Name" align="center"  width="180" :sortable="false" :fixed="false">
  <template slot-scope="scope">
    <el-link :href="'https://facebook.com/'+scope.row.uid" target="_blank" :underline="false"> {{scope.row.name}}</el-link>
    
</template>
</el-table-column>

<el-table-column label="Comment" align="center" :sortable="false" :fixed="false">
  <template slot-scope="scope">
    {{scope.row.comment}}

</template>
</el-table-column>

<el-table-column label="Phone" align="center" :sortable="false" width="120" :fixed="false">
  <template slot-scope="scope">
    <el-tag class="copyy" v-clipboard:success="onCopy" v-clipboard:copy="scope.row.phone" :type="GetCommentPhoneStatus(scope.row.status_zalo_id)" :closable="false" effect="dark" size="large" :disable-transitions="false">
        {{scope.row.phone}}
    </el-tag>

</template>
</el-table-column>
<el-table-column label="Status" align="center" :sortable="false" width="60" :fixed="false">
  <template slot-scope="scope">
   <el-dropdown @command="command=>set_note(command,scope.row)">
      <span class="el-dropdown-link">
        <el-button :type="Get_Note_Type(scope.row.note_id)" :loading="false" :plain="false" :round="false" :circle="true" :autofocus="false" size="mini" :disabled="false"></el-button>

    </span>
    <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(data,index) in list_note" :key="index" :command="data.value">
            <el-button :type="data.type" :loading="false" :plain="false" :round="false" :circle="true" :autofocus="false" size="mini" :disabled="false"></el-button>
        </el-dropdown-item>

    </el-dropdown-menu>
</el-dropdown>

</template>
</el-table-column>
<el-table-column label="Note" align="center" :sortable="false" :fixed="false" :width="200">
  <template slot-scope="scope">
    <el-input @change="UpdateNote(scope.row)" spellcheck="false" placeholder="Note ..." v-model="scope.row.note" size="medium" clearable :row="5" type="textarea" :autosize="false" :disabled="false" autocomplete="off"></el-input>

</template>
</el-table-column>



</el-table>
<br>
<el-pagination @current-change="GetHideComment" :total="comment_count" :page-size="limit_comment" :current-page.sync="pager_comment" :pager-count="11" :hide-on-single-page="false" background layout="prev, pager, next"></el-pagination>

</el-tab-pane>
<el-dialog title="Kết bạn" :visible.sync="addFriendShow" :center="false" :fullscreen="false" top="10vh" width="500px">
    <el-form status-icon label-width="auto" label-position="top" :inline="false" :disabled="false" :inline-message="false" show-message validate-on-rule-change size="medium">

        <el-form-item class="field" prop="" align="left">
            <template slot="label">
                <el-row :gutter="20">
                    <el-col align="left" :span="12" :offset="0">
                        Tin nhắn:
                    </el-col>
                    <el-col align="right" :span="12" :offset="0">
                        <el-button type="default" @click="OpenMessageDialog" icon="el-icon-s-grid" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Chọn mẫu</el-button>
                    </el-col>
                </el-row>
            </template>
            <el-input type="textarea" v-model="message" spellcheck="false" :rows="4" placeholder="Please input"></el-input>
        </el-form-item>
        

         <el-row :gutter="20">
            <el-col align="left" :span="12" :offset="0">
             <el-form-item class="field" prop="" align="left">
                <template style="width: 100%;" slot="label">
                    <el-checkbox v-model="use_facebook" style="margin-right: 10px;" size="medium" :checked="false" :border="false" :indeterminate="false"></el-checkbox>
                    Facebook:
                    
                    
                </template>
                <el-select style="width: 100%;" @change="SelectFrom" :disabled="!use_facebook" v-model="uid_addfriend" placeholder="Select">
                    <el-option v-for="(data,index) in list_cookie" :key="index" :label="data.name" :value="data.uid"></el-option>
                </el-select>
            </el-form-item>
        </el-col>
        <el-col align="left" :span="12" :offset="0">

            <el-form-item class="field" prop="" align="left">
               <template style="width: 100%;"  slot="label">
                <el-checkbox v-model="use_zalo" style="margin-right: 10px;" size="medium" :checked="false" :border="false" :indeterminate="false"></el-checkbox>
                Zalo:
            </template>
            <el-select style="width: 100%;" @change="SelectFromZalo" :disabled="!use_zalo" v-model="zalo_id" placeholder="Select">
                <el-option v-for="(data,index) in list_zalo" :key="index" :label="data.name" :value="data.id"></el-option>
            </el-select>
        </el-form-item>
    </el-col>
</el-row>
        
        <el-form-item align="center">
            <el-button type="primary" @click="AddFriendUID" icon="el-icon-s-promotion" :loading="loading_invite" :plain="false" :round="false" :circle="false" :autofocus="false" size="small" :disabled="false">SEND</el-button>
        </el-form-item>

    </el-form>
</el-dialog>
<el-dialog title="Danh sách tin nhắn" :visible.sync="list_message_show" :center="false" :fullscreen="false" top="10vh" width="500px">
   <el-input type="textarea" v-model="new_message" spellcheck="false" :rows="4" placeholder="Nội dung mẫu tin nhắn ..."></el-input>
   <br> <br>
   <el-button type="primary" @click="AddNewMessage" icon="el-icon-circle-plus-outline" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Thêm mẫu</el-button>
   <br> <br>
   <el-table :data="list_message_sample" max-height="500" :border="true" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="light" style="width: 100%">

    <el-table-column label="Message" prop="message" align="left" :sortable="false" :fixed="false"/>

    <el-table-column label="" align="center" :sortable="false" :fixed="false" width="90">
        <template slot-scope="scope">
            <el-button type="primary" @click="SelectMessage(scope.row)" icon="" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Chọn</el-button>   
        </template>
    </el-table-column>

    <el-table-column align="center" :sortable="false" :fixed="false" width="80">
        <template slot-scope="scope">
            <el-popconfirm title="Bạn có chắc chắn?" @confirm="RemoveSampleMessage(scope.row)" confirmButtonText='OK' cancelButtonText='Không,cảm ơn.' icon="el-icon-info" iconColor="red">
                <el-button slot="reference" type="danger" icon="el-icon-delete-solid" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false"></el-button>        
            </el-popconfirm>
           
        </template>
    </el-table-column>

</el-table>
</el-dialog>
<el-dialog title="Danh sách từ khóa" :visible.sync="list_blocked_keyword_show" :center="false" :fullscreen="false" top="0vh" width="500px">
    <el-button type="primary" @click="AddKeyword" icon="" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Thêm từ khóa</el-button>
    <br> <br>
    <el-table :data="list_keyword" max-height="400" :border="true" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="light" style="width: 100%">



        <el-table-column label="Keyword" align="center" :sortable="false" :fixed="false">
            <template slot-scope="scope">
                {{scope.row.value}}
            </template>
        </el-table-column>

        <el-table-column align="center" :sortable="false" :fixed="false" width="120">
            <template slot-scope="scope">
                <el-popconfirm title="Bạn có chắc chắn?" @confirm="RemoveKeyword(scope.row)" confirmButtonText='OK' cancelButtonText='Không,cảm ơn.' icon="el-icon-info" iconColor="red">
                    <el-button slot="reference" type="danger" icon="el-icon-delete-solid" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false"></el-button>        
                </el-popconfirm>   
            </template>
        </el-table-column>

    </el-table>
</el-dialog>
</el-tabs>
</template>
<script>
    export default {
        data(){
            return {
                new_message:'',
                list_message_show:false,
                list_message_sample:[],
                message:'',
                addFriendShow:false,
                loading_savehide:false,
                hidecomment_show:false,
                limit_comment:20,
                pager_comment:1,
                comment_count:0,
                hide:{
                    list:[],
                    title:'',
                    show:false,
                    url_post:'',
                    id_page:'',
                    option:'tat-ca',
                    delay:5
                },
                list_comment:[],
                comment_loading:false,
                use_zalo:true,
                use_facebook:true,
                list_zalo:[],
                zalo_id:null,
                loading_token:true,
                friend_uid:null,
                loading_invite:false,
                comment_id:null,
                active_tab:'hide',
                active_uid:null,
                cookie:'',
                active_cookie:null,
                obj_cookie:{name:'',uid:'',live:false,id:null},
                list_token:[],
                list_cookie:[],
                range_time_comment:[],
                phone_visible:false,
                token_bm_view_visible:false,
                cookie_view_visible:false,
                loading_import:false,
                phone_user:'',
                token_view_visible:false,
                token_view:{
                    id:null,
                    pageName:'',
                    access_token:null
                },
                reset_token_view:{
                    id:null,
                    pageName:'',
                    access_token:null
                },
                multipleSelection:[],
                keysearch_comment:'',
                list_note:[
                    {value:0,type:'default'},
                    {value:1,type:'primary'},
                    {value:2,type:'danger'},
                    {value:3,type:'success'},
                    {value:4,type:'warning'}
                    ],
                name_user:'',
                list_status_comment:[
                    {value:undefined,type:'primary',label:'Tất cả'},
                    {value:false,type:'danger',label:'Hide'},
                    {value:true,type:'success',label:'Show'},

                    ],
                loading_refresh:false,
                live:true,
                note_id:0,
                post_ID:null,
                uid_addfriend:null,
                list_keyword:[],
                list_blocked_keyword_show:false
            }
        },
        computed:{
            recent_time(){
                let time = 0
                for(let {hour} of this.list_status){
                    if(parseFloat(hour) < parseFloat(this.rule_hour)){

                        let t = parseFloat(hour)*3600;
                        if(t >= time) time = t;
                    }
                };
                return time;
            },
            note_type(){
                let _ = this;
                return _.list_note.find(e=>e.value == _.note_id).type;
            },
            where_comment(){
                let phone = this.phone_visible ? "" : '0';
                let start_time = this.range_time_comment[0] || 0;
                let end_time = this.range_time_comment[1] || (Date.now() + 100000);
                

                start_time = start_time/1000;
                end_time = end_time/1000;

                return {phone:{'!=':phone},keysearch:{contains:this.keysearch_comment.toLowerCase()},note_id:this.note_id,time:{'>=':start_time,'<=':end_time}}
            },
            cookie_user(){
                let _ = this;
                return _.list_cookie.find(e=>e.uid === _.uid_addfriend)
            },
             obj_zalo(){
         let _ = this;
         return _.list_zalo.find(e=>e.id === _.zalo_id)
     }
        },
        created:async function(){
           await this.OpenHideCommentData();
           await this.GetCookieUser();
           await this.GetListZalo();
       },
       methods:{
        GetCommentPhoneStatus:function(id){
        if(id === 0){
            return 'primary'
        }else if(id === 1){
            return 'success'
        }else if(id === 2){
            return 'danger'
        }
    },
    GetListZalo:async function(){
        let {data} = await this.$axios.get('/api/zaloaccount?limit=1000000');
        return this.list_zalo = data.filter(e=>e.live);
    },
        AddKeyword:async function(){
            let _ = this;
            _.$prompt('', 'Nhập từ khóa', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel'
            }).then(async ({ value }) => {
                let {data} = await this.$axios.post('/api/blockedkeywordhide',{value})
                this.list_keyword.unshift(data)
            }).catch(() => {

            });
        },
        GetListKeyword:async function(){
            let {data} = await this.$axios.get('/api/blockedkeywordhide?limit=100000000');
            return this.list_keyword = data;
        },
        OpenKeywordDialog:async function(){
            await this.GetListKeyword();
            this.list_blocked_keyword_show = true;
        },
        RemoveKeyword:async function(e){
            await this.$axios.delete('/api/blockedkeywordhide/'+e.id);
            this.list_keyword = this.list_keyword.filter(i=>i.id !== e.id)
            return;
        },
        setCookie:function(cname, cvalue, exdays = 365) {
          const d = new Date();
          d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
          let expires = "expires="+d.toUTCString();
          document.cookie = cname + "=" + encodeURIComponent(cvalue) + ";" + expires + ";path=/";
      },
       SelectFromZalo:async function(){

    },
      getCookie:function(cname) {
          let name = cname + "=";
          let ca = document.cookie.split(';');
          for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return decodeURIComponent(c.substring(name.length, c.length));
        }
    }
    return "";
},
SelectMessage:function({message}){
    this.message = message;
    this.setCookie('message',message);
    this.list_message_show = false;
},
SelectFrom:function(){
    this.setCookie('uid',this.uid_addfriend);
},
MakeSendMessage:async function(friend_uid,message,fb_dtsg,cookie){
    let {data} = await this.$axios.post('/api/invite/send-message',{friend_uid,message,fb_dtsg,cookie});
    if(data.error) throw data.error;
    return data;
},
GetStatusInvite:function({status_id}){
    if(!status_id){
        return 'primary'
    }else if(status_id === 1){
        return 'success'
    }else if(status_id === 2){
        return 'danger'
    }
},
MakeAddFriend:async function(friend_uid,access_token,cookie){
    let {data} = await this.$axios.post('/api/invite/add-friend',{friend_uid,access_token,cookie});
    if(data.error) throw data.error;
    return data;
},
    AddFriendFacebook:async function(){
        if(this.use_facebook){
            try{
             let {token_bm,fb_dtsg,cookie} = this.cookie_user;
             let message = this.message;
             let friend_uid = this.friend_uid;
             await Promise.all([this.MakeAddFriend(friend_uid,token_bm,cookie),this.MakeSendMessage(friend_uid,message,fb_dtsg,cookie)]);
             await this.UpdateStatusComment(1);
             this.$notify({
                title: 'Facebook Thành công',
                message: 'Bạn vừa gửi lời mời kết bạn thành công',
                type: 'success'
            });
         }catch(error){
            this.$notify({
                title: 'Facebook ERROR',
                message: error,
                type: 'error'
            });
            await this.UpdateStatusComment(2)
        }
    }
},
GetUidZalo:async function(phone,{cookie,imei,secretKey}){
    let {data} = await this.$axios.post('/api/zalo/get-uid',{phone,cookie,imei,secretKey});
    if(data.error) throw data.error;
    return data.toid;
},
Rename:async function(name,toid,{cookie,imei,secretKey}){
    let {data} = await this.$axios.post('/api/zalo/rename',{name,toid,cookie,secretKey,imei});
    if(data.error) throw data.error;
    return data;
},
InviteAddFriendZalo:async function(toid,{cookie,secretKey,imei}){
    let {data} = await this.$axios.post('/api/zalo/add-friend',{toid,cookie,secretKey,imei});
    if(data.error) throw data.error;
    return data;
},
SendMessageZalo:async function(message,toid,{cookie,secretKey,imei}){
    let {data} = await this.$axios.post('/api/zalo/send-message',{message,toid,cookie,secretKey,imei});
    if(data.error) throw data.error;
    return data;
},
UpdateStatusZaloComment:async function(status_zalo_id){
    let {data} = await this.$axios.patch('/api/hidecomment/'+this.comment_id,{status_zalo_id});
    let _ = this;
    return this.list_comment = this.list_comment.map(e=>{
        if(e.id === _.comment_id) e.status_zalo_id = status_zalo_id;
        return e;
    })
},
AddFriendZalo:async function(){
    if(this.use_zalo){
        try{

            let {secretKey,imei,cookie} = this.obj_zalo;
            let message = this.message;
            let phone = this.phone_user;
            let name = this.name_user+' '+phone;
            let toid = await this.GetUidZalo(phone,{cookie,imei,secretKey});
            await this.Rename(name,toid,{cookie,imei,secretKey});
            await this.InviteAddFriendZalo(toid,{cookie,secretKey,imei});
            await this.SendMessageZalo(message,toid,{cookie,secretKey,imei});
            await this.UpdateStatusZaloComment(1);

            this.$notify({
                title: 'Zalo Thành công',
                message: 'Bạn vừa gửi lời mời kết bạn thành công',
                type: 'success'
            });

        }catch(error){
         this.$notify({
            title: 'Zalo ERROR',
            message: error,
            type: 'error'
        });
         await this.UpdateStatusZaloComment(2)
     }
 }
},
AddFriendUID:async function(){
    this.loading_invite = true;
    await Promise.all([this.AddFriendFacebook(),this.AddFriendZalo()])
    this.loading_invite = false;
    this.addFriendShow = false;
},
UpdateStatusComment:async function(status_id){
    let {data} = await this.$axios.patch('/api/hidecomment/'+this.comment_id,{status_id});
    let _ = this;
    return this.list_comment = this.list_comment.map(e=>{
        if(e.id === _.comment_id) e.status_id = status_id;
        return e;
    })
},
AddNewMessage:async function(){
    if(this.new_message.trim().length === 0){
        return this.$notify({
            title: 'ERROR',
            message: 'Nội dung tin nhắn không được để trống',
            type: 'error'
        });
    }else{
        let {data} = await this.$axios.post('/api/messagesample',{message:this.new_message});
        this.list_message_sample.unshift(data);
        this.$message({type:'success',message:'Đã thêm tin nhắn mẫu'});
        return;
    }
},
RemoveSampleMessage:async function(e){
    let {data} = await this.$axios.delete('/api/messagesample/'+e.id);
    this.list_message_sample = this.list_message_sample.filter(u=>u.id !== e.id);
},
GetListSampleMessage:async function(){
    let {data} = await this.$axios.get('/api/messagesample?limit=10000000000');
    return this.list_message_sample = data;
},
OpenMessageDialog:async function(){
    this.list_message_show = true;
    await this.GetListSampleMessage();
},
GetCookieUser:async function(){
    let {data} = await this.$axios.get('/api/cookieuser/?limit=1000000000');
    return this.list_cookie = data.filter(e=>e.live);
},
onCopy:function(e){
    this.$message({type:'success',message:'Copied !'})
},
handleSelectionChange:async function(val){
 this.multipleSelection = val;
},
RemoveUrl:async function(){
    for(let url of this.multipleSelection){
        let {data} = await this.$axios.delete('/api/hide/'+url.id);
        this.$notify({
            title: 'Đã xóa',
            message: url.title,
            type: 'error'
        });
    }
},
UpdateDelay:async function(e){
    let _ = this;
    _.$prompt('', 'Thời gian delay', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
    }).then(async ({ value }) => {
        if((parseInt(value) || 0) < 3){

            _.$confirm('Thời gian không được nhỏ quá 3 giây.Vui lòng thử lại', 'ERROR', {
                confirmButtonText: 'OK',
                showCancelButton:false,
                type: 'error'
            })

        }else{
            let {data} = await _.$axios.patch('/api/hide/'+e.id,{delay:parseInt(value)*1000});
            e.delay = parseInt(value)*1000;
        }

    }).catch(() => {

    });
},

GetCommentCountData:async function(){
    let {data} = await this.$axios.post('/api/hide/count-comment',this.where_comment);
    this.comment_count = data.count;

    return;
},
waitTime:function(time){
    return new Promise(resolve=>{
        setTimeout(function(){
         return resolve(time)
     },time)
    });
},

GetListCommentData:async function(){
    let {data} = await this.$axios.get('/api/hidecomment',{params:{sort:'time DESC',limit:this.limit_comment,skip:(this.pager_comment - 1)*this.limit_comment,where:this.where_comment}});
    return this.list_comment = data;
},
GetHideComment:async function(){
  return await Promise.all([this.GetListCommentData(),this.GetCommentCountData()]);




},
OpenHideCommentData:async function(){

    return await this.GetHideComment();
},
UpdateNote:async function(e){
    await this.$axios.patch('/api/hidecomment/'+e.id,{note:e.note});
    this.$notify({
        title: 'Thành công',
        message: 'Đã update note comment',
        type: 'success'
    });
},
set_note:async function(command,e){
    this.note_id = command;
    e.note_id = command;
    await this.$axios.patch('/api/hidecomment/'+e.id,{note_id:command});
    this.$notify({
        title: 'Hoàn thành',
        message: 'Đã cập nhật trạng thái',
        type: 'success'
    });
    return;

},
SetNoteType:async function(command){
    this.note_id = command;
    await this.GetHideComment();
},
tableRowClassName:function({row:{note_id}}){

    return 'row_'+this.list_note.find(e=>e.value == note_id).type;
},
datetime:function(unixtime){
    let time = new Date(unixtime*1000);
    let date = time.getDate().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    let month = (time.getMonth()+1).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    let year = time.getFullYear().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});

    let hour = time.getHours().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    let minute = time.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    let second = time.getSeconds().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
    return hour+':'+minute+' '+ date+'/'+month+'/'+year;
},
Get_Note_Type:function(note_id){
    return this.list_note.find(e=>e.value === note_id).type;
},
ExportDataComment:async function(){
    let phone = this.phone_visible ? "" : '0';
    let response = await this.$axios.post('/api/hide/download-comment',{...this.where_comment},{responseType: 'blob'});
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    let time = new Date();
    let date = time.getDate();
    let month = time.getMonth()+1;
    let year = time.getFullYear();

    link.setAttribute('download', 'hotdatafb-comment-'+date+'_'+month+'_'+year+'.xlsx'); 
    document.body.appendChild(link);
    link.click();
},
LabelHide:function(option){
    if(option === 'an-so'){
        return 'Ẩn SĐT'
    }else if(option === 'tat-ca'){
        return 'Ẩn toàn bộ';
    }
},
AddFriend:async function({id,uid,name,post_ID,page_ID,pageName,phone}){
    this.friend_uid = uid;
    this.comment_id = id;
    this.name_user = name;
    this.message = this.getCookie('message');
    /*
    let uid_addfriend = this.getCookie('uid');
    let check = this.list_cookie.find(e=>e.uid === uid_addfriend);
    if(check) this.uid_addfriend = uid_addfriend;
    */
    const random = (min, max) => Math.floor(Math.random() * (max - min) + min);
    this.uid_addfriend = (this.list_cookie[random(0,this.list_cookie.length)] || {uid:null}).uid;
      this.zalo_id = (this.list_zalo[random(0,this.list_zalo.length)] || {id:null}).id;
    this.phone_user = phone;
    this.addFriendShow = true;
},
RemoveHide:async function(id_hide){
    await this.$axios.delete('/api/hide/'+id_hide);
    await this.ListHide();
    this.$message({type:'error',message:'Đã xóa bài viết'})
    return;
},
RemoveAllHide:async function(){
    let _ = this;
    _.$confirm('Bạn xác nhận xóa toàn bộ ID bài viết ?', 'Xóa toàn bộ', {
        confirmButtonText: 'OK',
        showCancelButton:true,
        type: 'info'
    }).then(async function(){
        await _.$axios.post('/api/hide/remove-all',{id_page:_.hide.id_page});
        _.$confirm('Đã xóa toàn bộ ID', 'Hoàn thành', {
            confirmButtonText: 'OK',
            showCancelButton:false,
            type: 'success'
        });
        await _.ListHide();

    })

},
ListHide:async function(){
    let {data} = await this.$axios.get('/api/hide');
    return this.hide.list = data;
},
SaveHide:async function(){
    try{
        this.loading_savehide = true;
        let {url_post,delay,option,title} = this.hide;
        if(!url_post.includes('https://')) throw 'Bạn phải nhập URL Post';
        if(delay < 0) throw 'Delay tối thiểu phải là 1 giây';
        if(title.trim().length === 0) throw 'Nội dung title không được bỏ trống';
        let {data} = await this.$axios.post('/api/hide/save',{url_post,delay,option,title});
        if(data.error) throw data.error;
        await this.ListHide();
        this.hide.url_post = '';
        this.$notify({
            title: 'Thành công',
            message: 'Đã thêm bài viết',
            type: 'success'
        });

    }catch(error){
        this.$notify({
            title: 'ERROR',
            message: error,
            type: 'error'
        });
    }
    this.loading_savehide = false;

},
Check_Nick:async function(){
    let {data} = await this.$axios.post('/api/tokenuser/check',{token_bm:this.obj_cookie.token_bm,cookie:this.obj_cookie.cookie});
    if(data.error){
        this.live = false;
    }else{
        this.live = true
    };
    return;
},
TabMainClick:async function(){

},

TabPageClick:async function(){
 this.loading_token = true;
 let _ = this;
 this.obj_cookie = this.list_cookie.find(e=>e.uid === _.active_uid);
 await this.Check_Nick();

 await this.GetTokenList();
 this.loading_token = false;
 return;

},
RemoveCookie:async function(){
    let {name,uid} = this.obj_cookie;
    let _ = this;
    this.$confirm('Bạn chắc chắn muốn gỡ tài khoản '+name, 'Xác nhận', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'error'
    }).then(async () => {
        await _.$axios.post('/api/tokenuser/remove',{uid});
        await _.DefaultToken();
        _.$notify({
            title: 'Đã xóa',
            message: 'Đã gỡ bỏ liên kết với tài khoản '+name,
            type: 'error'
        });
    }).catch(() => {

    });
},


Open_Link:function(url){
    return window.open(url, '_blank').focus();
},

GetTokenList:async function(){

    let {data} = await this.$axios.get('/api/tokenuser?limit=100000000000&uid='+this.active_uid);
    return this.list_token = data;
    
},

RemoveToken:async function({id,pageName}){
 this.loading_token = true;
 await this.$axios.delete('/api/tokenuser/'+id);
 this.$notify({
    title: 'Đã xóa',
    message: 'Đã xóa '+pageName+' khỏi danh sách',
    type: 'success'
});
 await this.Check_Nick();
 await this.GetTokenList();
 this.loading_token = false;
 return;
},
GetCookieList:async function(){
    let {data} = await this.$axios.get('/api/cookieuser?limit=100000000000');
    return this.list_cookie = data;
},

ImportToken:async function(){
 this.loading_token = true;
 this.loading_import = true;
 let {data} = await this.$axios.post('/api/tokenuser/import',{cookie:this.cookie});
 this.loading_import = false;
 if(data.error){
    return this.$message({type:'error',message:data.error});
}else{
    this.cookie = '';
    this.$message({type:'success',message:'Import thành công.'})
    await this.GetCookieList();
    if(this.list_cookie.length > 0){
        this.active_uid = this.list_cookie[0].uid;
        this.obj_cookie = this.list_cookie[0];
        await this.Check_Nick();
        await this.GetTokenList();
    }
    this.loading_token = false;
    return;
}
},

Refresh_Cookie:async function(){
 this.loading_token = true;
 this.loading_refresh = true;
 let {data} = await this.$axios.post('/api/tokenuser/refresh-cookie',{id:this.obj_cookie.id});
 if(data.error){
    this.$notify({
        title: 'Có lỗi xảy ra',
        message: data.error,
        type: 'error'
    });
}else{

    this.$notify({
        title: 'Thành công',
        message: 'Cookie đang hoạt động',
        type: 'success'
    });

}
await this.GetCookieList();
await this.Check_Nick();
await this.GetTokenList();

this.loading_refresh = false;
this.loading_token = false;
return;

}
}
}
</script>
<style>
    .pointer:hover{
        cursor: pointer;
    }
    .el-form-item__label{
        width: 100%;
    }
</style>