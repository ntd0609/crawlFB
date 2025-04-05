<template>
    <el-tabs v-model="active_tab" type="border-card">
        <el-tab-pane name="c">
            <span slot="label"><i class="el-icon-chat-dot-square"></i> Bình luận</span>
            <el-row :gutter="20">
                <el-col align="left" :span="10" :offset="0">
                    <el-tag  type="primary" :closable="false" effect="plain" size="large" :disable-transitions="false">{{comment_count}} comment</el-tag>


                    <el-button type="info" @click="ExportDataComment" icon="el-icon-download" :loading="false" :plain="true" :round="false" :circle="false" :autofocus="false" size="small" :disabled="false">Export Data</el-button>

                </el-col>
                <el-col align="right" :span="14" :offset="0">
                    <el-switch v-model="phone_visible" style="margin-right: 20px;" @change="GetComment" size="mini" active-text="Chỉ hiển thị SĐT"> </el-switch>
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
                @change="GetComment"
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
           <el-input @keyup.enter.native="GetComment" @change="GetComment" placeholder="Keysearch ..." prefix-icon="el-icon-search" v-model="keysearch_comment" size="small" spellcheck="false" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
       </el-col>
       <el-col align="left" :span="8" :offset="0">
        <el-button type="primary" @click="OpenKeywordDialog" icon="" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="small" :disabled="false">Loại bỏ comment có chứa từ khóa</el-button>
    </el-col>
</el-row>
<br>
<el-table :data="list_comment" v-loading="comment_loading" :row-class-name="tableRowClassName" :border="true" :highlight-current-row="false" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="none" style="width: 100%">

  <el-table-column label="Time" align="center" :sortable="false" width="150" :fixed="false">
      <template slot-scope="scope">
         <i v-if="scope.row.status_id === 10" class="el-icon-loading"></i>
         <el-tag  v-if="scope.row.status_id !== 10" @click="AddFriend(scope.row)" class="pointer"  :type="GetStatusInvite(scope.row)" :closable="false" effect="plain" size="large" :disable-transitions="true">
            {{datetime(scope.row.time)}}
        </el-tag>
    </template>
</el-table-column>

<el-table-column label="Post" align="center" :sortable="false" width="150"  :fixed="false">
  <template slot-scope="scope">
    <el-tooltip effect="dark" :content="scope.row.post_ID" placement="top-start">
       <el-link :href="'/api/access/post?url_id='+scope.row.url_id" target="_blank" :underline="false">{{scope.row.name_post}}</el-link>
   </el-tooltip>


</template>
</el-table-column>

<el-table-column label="Name" align="center" :sortable="false" :fixed="false">
  <template slot-scope="scope">
    <el-tooltip effect="dark" :content="scope.row.uid" placement="top-start">
        <el-link :href="'https://facebook.com/'+scope.row.uid" target="_blank" :underline="false"> {{scope.row.name}}</el-link>
    </el-tooltip>

</template>
</el-table-column>

<el-table-column label="Comment" align="center" :sortable="false" :fixed="false">
  <template slot-scope="scope">
    {{scope.row.comment}}

</template>
</el-table-column>

<el-table-column label="Phone" align="center" :sortable="false" width="120" :fixed="false">
  <template slot-scope="scope">
    <i v-if="scope.row.status_zalo_id === 10" class="el-icon-loading"></i>
    <el-tag v-if="scope.row.status_zalo_id !== 10" class="copyy" v-clipboard:success="onCopy" v-clipboard:copy="scope.row.phone" :type="GetCommentPhoneStatus(scope.row.status_zalo_id)" :closable="false" effect="dark" size="large" :disable-transitions="true">
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
<el-pagination @current-change="GetListComment" :total="comment_count" :page-size="limit_comment" :current-page.sync="pager_comment" :pager-count="11" :hide-on-single-page="false" background layout="prev, pager, next"></el-pagination>
</el-tab-pane>

<el-dialog title="Setting" :visible.sync="show_setting" :center="false" :fullscreen="false" top="20vh" width="50%">
    <el-table :data="list_status" max-height="500" :border="true" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="light" style="width: 100%">

        <el-table-column label="Status" align="center" :sortable="false" :fixed="false">
            <template slot-scope="scope">
                <el-button :type="scope.row.type" :loading="false" :plain="false" :round="false" :circle="true" :autofocus="false" size="small" :disabled="false"></el-button>
            </template>
        </el-table-column>

        <el-table-column label="Số giờ" align="center" :sortable="false" :fixed="false">
            <template slot-scope="scope">

                <el-input-number @change="Update_Rule" v-model="scope.row.hour" size="medium" controls-position="right" :step="1" :min="0" :max="10000000000"></el-input-number>  
            </template>
        </el-table-column>

        

    </el-table>
</el-dialog>
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
            <el-select style="width: 100%;" @change="SelectMessageSample"  v-model="messagesample_id" placeholder="Select">
                <el-option v-for="(data,index) in list_message_sample" :key="index" :label="data.title" :value="data.id"></el-option>
            </el-select>
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
<el-dialog title="Danh sách tin nhắn" @close="ResetForm" :visible.sync="list_message_show" :center="false" :fullscreen="false" top="5vh" width="500px">
    <el-input @keyup.enter.native="" spellcheck="false" placeholder="Tiêu đề" v-model="title_message" size="medium" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input> <br><br>
    <el-input type="textarea" v-model="new_message" spellcheck="false" :rows="4" placeholder="Nội dung mẫu tin nhắn ..."></el-input>
    <br> <br>

    <el-upload
    :auto-upload="false"
    name="image"
    multiple
    thumbnail-mode
    ref="upload"
    :data="add_data"
    action="/api/attachment/upload"
    list-type="picture-card"
    :file-list="list_image_upload"
    :on-success="handleAvatarSuccess"
    :on-remove="RemoveAttachment"
    :on-preview="handlePictureCardPreview">
    <i class="el-icon-plus"></i>
</el-upload>
<br>
<el-button v-if="!edit_message_id" type="primary" @click="AddNewMessage" icon="el-icon-circle-plus-outline" :loading="loading_add_message" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Thêm mẫu</el-button>
<el-button v-if="edit_message_id" type="primary" @click="UpdateMessage" icon="" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Chỉnh sửa</el-button>
<el-button v-if="edit_message_id" type="danger" @click="ResetForm" icon="" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Hủy bỏ</el-button>

<br> <br>
<el-table :data="list_message_sample" max-height="500" :border="true" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="light" style="width: 100%">

    <el-table-column label="Title" prop="title" align="center" :sortable="false" :fixed="false"/>

    
    <el-table-column label="" align="center" :sortable="false" :fixed="false" width="90">
        <template slot-scope="scope">
            <el-button type="warning" @click="EditMessage(scope.row)" icon="" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Edit</el-button>   
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
<el-dialog :visible.sync="dialogVisible" top="5vh">
  <img width="100%" :src="dialogImageUrl" alt="">
</el-dialog>


</el-tabs>
</template>
<script>

  export default {


    data(){
        return {
            loading_add_message:false,
            add_data:{
                messagesample_id:null
            },
            messagesample_id:null,
            list_image_upload:[],
            use_facebook:true,
            use_zalo:true,
            list_message_sample:[],
            list_message_show:false,
            list_blocked_keyword_show:false,
            loading_test:false,
            scan_reaction_status:false,
            scan_old_comment_status:false,
            scan_comment_status:false,

            token_use:{
                id:null,
                name:null,
                uid:null,
                access_token:null
            },
            test_part:'all',
            test_time:5,
            time_save:false,
            check_comment_show:false,
            rule_hour:null,
            import_post_status:false,
            add_post_show:false,
            range_time_comment:[],
            comment_setting_show:false,
            list_comment:[],
            comment:'',
            status_filter:undefined,
            name_post:'',
            loading_data:false,
            loading_history:true,
            active_tab:'c',
            url_post:'',
            url_post_new:'',
            name_post_new:'',
            list_data:[],
            loading_ScanPost:false,
            loading_ScanPost_new:false,
            list_permission:[
                {label:'Quản lý user',value:'quan-ly-user',message:'Quản lý người dùng'},
                {label:'Quản lý token',value:'quan-ly-token',message:'Quản lý token'},
                {label:'Push',value:'push',message:'Push'},
                {label:'Check ẩn',value:'check-an',message:'Check ẩn'},
                {label:'Chi tiết',value:'chi-tiet',message:'Chi tiết'},
                {label:'Scan',value:'scan',message:'Scan'},
                ],
            multipleSelection:[],
            list_token:[],
            scan_status:'',
            count:0,
            count_phone:0,
            pager:1,
            type_filter:'comment',
            phone_visible:false,
            list_history:[],
            count_history:0,
            pager_history:1,
            list_urlscan_remove:[],
            show_success:false,
            pagination_show:true,
            limit_data:20,
            limit_urlscan:20,
            title_message:'',
            count_urlscan:0,
            token_name:null,
            pager_urlscan:1,
            refresh_data:false,
            post_ID:null,
            show_setting:false,
            status_rule:'',
            list_status:[],
            note_id:undefined,
            list_note:[
                {value:0,type:'default'},
                {value:1,type:'primary'},
                {value:2,type:'danger'},
                {value:3,type:'success'},
                {value:4,type:'warning'}
                ],
            list_status_comment:[
                {value:undefined,type:'primary',label:'Tất cả'},
                {value:false,type:'danger',label:'Hide'},
                {value:true,type:'success',label:'Show'},

                ],
            hide_comment:undefined,
            comment_count:0,
            limit_comment:20,
            pager_comment:1,
            list_cookie:[],
            comment_loading:true,
            auto_load_story:false,
            url_id:'',
            uid_today:0,
            comment_today:0,
            delay_time:0,
            message:'',
            loading_count_comment:false,
            list_permission:[],
            type:'',
            keysearch:'',
            phone_user:'',
            comment_id:null,
            uid_addfriend:null,
            keysearch_comment:'',
            friend_uid:null,
            addFriendShow:false,
            rule_type:'default',
            new_message:'',
            dialogVisible:false,
            edit_message_id:null,
            dialogImageUrl:'',
            status_filter:undefined,
            list_keyword:[],
            list_zalo:[],
            zalo_id:null,
            name_user:'',
            loading_invite:false,
            attachment_id:null,
            cookie_zalo:'',
            list_status_scan:[
                {type:'primary',value:undefined,label:'Tất cả'},
                {type:'success',value:true,label:'ON'},
                {type:'danger',value:false,label:'OFF'},

                ],
            access_token:'EAAGNO4a7r2wBAJa1JixhusHkz9MzBBnqzOgotdqLNDfMhwFSEv7uZBLntMjBkk6dvE9sZAMpoZBQi6wgzyFoIJUJpqt6u15zaRgMjBoNu7tTRgMY72QZB9uYHjB9W16lXl2JzQM7jmAT4nO610OKAjKh7vUAltlxZAwbWu772ywZDZD'
        }
    },
    created:async function(req,res){
        await this.GetInfo();
        await this.Get_Rule();
        await this.GetCookieUser();
        await this.GetListZalo();
        this.pager_comment = 1;
        this.phone_visible = false;
        this.range_time_comment = [];
        this.keysearch_comment = '';
        this.note_id = undefined;
        await this.GetComment();
        await this.GetListSampleMessage();
    },
    computed:{
        list_image(){
            return this.list_image_upload.map(e=>e.url);
        },
        permission(){
            return this.list_permission.map(e=>e.value);
        },

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
            let note_id = _.note_id || 0;
            return _.list_note.find(e=>e.value == note_id).type;
        },

        where_comment(){
            let phone = this.phone_visible ? "" : '0';
            let start_time = this.range_time_comment[0] || 0;
            let end_time = this.range_time_comment[1] || Date.now();

            start_time = start_time/1000;
            end_time = end_time/1000;

            return {phone:{'!=':phone},keysearch:{contains:this.keysearch_comment.toLowerCase()},type:'comment',note_id:this.note_id,time:{'>=':start_time,'<=':end_time}}
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

   methods:{

    handleAvatarSuccess(res, file,fileList) {
        this.list_image_upload.push(res);
    },
    RemoveAttachment:async function(file,fileList) {
       if(file.id) await this.$axios.delete('/api/attachment/'+file.id);

       this.dialogVisible = false;
   },
   handlePictureCardPreview:function(file,fileList) {
    this.attachment_id = file.id;
    this.dialogImageUrl = file.url;
    this.dialogVisible = true;
},
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
SelectFromZalo:async function(){

},
MakeSendMessage:async function(friend_uid,messagesample_id,fb_dtsg,cookie){
    let {data} = await this.$axios.post('/api/invite/send-message',{friend_uid,messagesample_id,fb_dtsg,cookie});
    if(data.error) throw data.error;
    return data;
},
MakeAddFriend:async function(friend_uid,access_token,cookie){
    let {data} = await this.$axios.post('/api/invite/add-friend',{friend_uid,access_token,cookie});
    if(data.error) throw data.error;
    return data;
},
AddFriendFacebook:async function(){
    let {token_bm,fb_dtsg,cookie} = this.cookie_user;
    let messagesample_id = this.messagesample_id;
    let friend_uid = this.friend_uid;
    let comment_id = this.comment_id;
    let use_facebook = this.use_facebook;
    if(use_facebook){
        try{

           await this.UpdateStatusComment(comment_id,10);
           await Promise.all([this.MakeAddFriend(friend_uid,token_bm,cookie),this.MakeSendMessage(friend_uid,messagesample_id,fb_dtsg,cookie)]);
           await this.UpdateStatusComment(comment_id,1);
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
        await this.UpdateStatusComment(comment_id,2)
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
SendMessageZalo:async function(messagesample_id,toid,{cookie,secretKey,imei}){
    let {data} = await this.$axios.post('/api/zalo/send-message',{messagesample_id,toid,cookie,secretKey,imei});
    if(data.error) throw data.error;
    return data;
},
AddFriendZalo:async function(){
   let {secretKey,imei,cookie} = this.obj_zalo;
   let messagesample_id = this.messagesample_id;
   let phone = this.phone_user;
   let name = this.name_user+' '+phone;
   let comment_id = this.comment_id;
   let use_zalo = this.use_zalo;
   if(use_zalo){
    try{


        await this.UpdateStatusZaloComment(comment_id,10);

        let toid = await this.GetUidZalo(phone,{cookie,imei,secretKey});
        await this.Rename(name,toid,{cookie,imei,secretKey});
        await this.InviteAddFriendZalo(toid,{cookie,secretKey,imei});
        await this.SendMessageZalo(messagesample_id,toid,{cookie,secretKey,imei});
        await this.UpdateStatusZaloComment(comment_id,1);

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
       await this.UpdateStatusZaloComment(comment_id,2)
   }
}
},
AddFriendUID:async function(){
    this.addFriendShow = false;
    await Promise.all([this.AddFriendFacebook(),this.AddFriendZalo()])
    
    
},
UpdateStatusComment:async function(comment_id,status_id){
    if(status_id !== 10) await this.$axios.patch('/api/scanpost/'+comment_id,{status_id});
    let _ = this;
    return this.list_comment = this.list_comment.map(e=>{
        if(e.id === comment_id) e.status_id = status_id;
        return e;
    })
},
UpdateStatusZaloComment:async function(comment_id,status_zalo_id){
    if(status_zalo_id !== 10) await this.$axios.patch('/api/scanpost/'+comment_id,{status_zalo_id});
    let _ = this;
    return this.list_comment = this.list_comment.map(e=>{
        if(e.id === comment_id) e.status_zalo_id = status_zalo_id;
        return e;
    })
},
GetCookieUser:async function(){
    let {data} = await this.$axios.get('/api/cookieuser/?limit=1000000000');
    return this.list_cookie = data.filter(e=>e.live);
},
SelectMessage:function({message}){
    this.message = message;
    this.setCookie('message',message);
    this.list_message_show = false;
},
SelectFrom:function(){
    this.setCookie('uid',this.uid_addfriend);
},
AddFriend:async function({id,uid,name,post_ID,page_ID,pageName,phone}){
    this.friend_uid = uid;
    this.comment_id = id;
    this.name_user = name;
    this.message = this.getCookie('message');
    this.messagesample_id = this.getCookie('messagesample_id');
         //   let uid_addfriend = this.getCookie('uid');
           // let check = this.list_cookie.find(e=>e.uid === uid_addfriend);
    const random = (min, max) => Math.floor(Math.random() * (max - min) + min);
    this.uid_addfriend = (this.list_cookie[random(0,this.list_cookie.length)] || {uid:null}).uid;

    this.zalo_id = (this.list_zalo[random(0,this.list_zalo.length)] || {id:null}).id;
    this.phone_user = phone;
    this.addFriendShow = true;

},
setCookie:function(cname, cvalue, exdays = 365) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + encodeURIComponent(cvalue) + ";" + expires + ";path=/";
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
SelectMessageSample:function(){
    this.setCookie('messagesample_id',this.messagesample_id)
},
ResetForm:function(){
   this.title_message = '';
   this.edit_message_id = null;
   this.new_message = '';
   this.list_image_upload = [];
},
AddNewMessage:async function(){
    let title = this.title_message;
    let message = this.new_message;
    let list_image = this.list_image;
    if(message.trim().length === 0){
        return this.$notify({
            title: 'ERROR',
            message: 'Nội dung tin nhắn không được để trống',
            type: 'error'
        });
    }else{
        this.loading_add_message = true;
        let {data} = await this.$axios.post('/api/messagesample',{message,title});
        this.add_data.messagesample_id = data.id;
        this.$refs.upload.submit();
        this.list_message_sample.unshift(data);
        this.ResetForm();
        this.$message({type:'success',message:'Đã thêm tin nhắn mẫu'});
        this.loading_add_message = false;
        return;
    }
},
UpdateMessage:async function(){
 let title = this.title_message;
 let message = this.new_message;
 let list_image = this.list_image;
 if(message.trim().length === 0){
    return this.$notify({
        title: 'ERROR',
        message: 'Nội dung tin nhắn không được để trống',
        type: 'error'
    });
}else{
    this.loading_add_message = true;
    let {data} = await this.$axios.patch('/api/messagesample/'+this.edit_message_id,{message,title});
    this.add_data.messagesample_id = this.edit_message_id;
    this.$refs.upload.submit();
    let _ = this;
    this.list_message_sample = this.list_message_sample.map(e=>{
        if(e.id === _.edit_message_id){
            e.title = title;
            e.message = message;
        }
        return e;
    })

    this.ResetForm();
    this.$message({type:'success',message:'Đã cập nhật tin nhắn mẫu'});
    this.loading_add_message = false;
    return;
}
},
AddKeyword:async function(){
    let _ = this;
    _.$prompt('', 'Nhập từ khóa', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
    }).then(async ({ value }) => {
        let {data} = await this.$axios.post('/api/blockedkeyword',{value})
        this.list_keyword.unshift(data)
    }).catch(() => {

    });
},
GetListKeyword:async function(){
    let {data} = await this.$axios.get('/api/blockedkeyword?limit=100000000');
    return this.list_keyword = data;
},
OpenKeywordDialog:async function(){
    await this.GetListKeyword();
    this.list_blocked_keyword_show = true;
},
RemoveKeyword:async function(e){
    await this.$axios.delete('/api/blockedkeyword/'+e.id);
    this.list_keyword = this.list_keyword.filter(i=>i.id !== e.id)
    return;
},
TimeLeft:function(time){
    let change =  parseInt(Date.now()/1000 - time/1000);
    if(change < 5){
        return 'Vừa xong';
    }else if(change < 60){
        return change+' giây trước';
    }else if(change < 3600){
        return parseInt(change/60) + ' phút trước';
    }else if(change < 86400){
        return parseInt(change/3600) + ' giờ trước';
    }else{
        return parseInt(change/86400) + ' ngày trước';
    }
},
GetInfo:async function(){
    let {data} = await this.$axios.post('/api/account/info');
    this.type = data.package;
    return await this.GetPermission();
},
GetPermission:async function(){
    let {data} = await this.$axios.get('/api/package',{params:{type:this.type}});
    return this.list_permission = data[0].permission;
},
UpdateCountComment:async function(url_object){
    try{
     this.list_history = this.list_history.map(e=>{
        if( e.id === url_object.id ){
            e.loading_push = true;
        };
        return e;

    })
     let {data} = await this.$axios.post('/api/ScanPost/get-count-comment',{url_object});
     if(data.error) throw data.error;

     this.list_history = this.list_history.map(e=>{
        if( e.id === url_object.id ){
            e.push = data.push;
        };
        return e;

    })


 }catch(error){
    this.$notify({
        title: 'ERROR',
        message: error,
        type: 'error'
    });

    this.list_history = this.list_history.map(e=>{
        if( e.id === url_object.id ){
            e.error = error;
        };
        return e;

    })

}
this.list_history = this.list_history.map(e=>{
    if( e.id === url_object.id ){
        e.loading_push = false;
    };
    return e;

})

},
GetCountComment:async function(){
    this.loading_count_comment = true;
    for(let url_object of this.list_history){
        await this.UpdateCountComment(url_object);
    }

    this.loading_count_comment = false;
    return;

},
RemoveSampleMessage:async function(e){
    let {data} = await this.$axios.delete('/api/messagesample/'+e.id);
    this.list_message_sample = this.list_message_sample.filter(u=>u.id !== e.id);
},
filter_hide_comment:async function(command){
    if(command.value !== undefined){
       this.hide_comment = !command.value;
   }else{

    this.hide_comment = undefined;
}

return await this.Load_History();
},
onCopy:function(e){
    this.$message({type:'success',message:'Copied !'})
},
CheckHideComment:async function(e,time){
    let test_part = 'post';

    this.list_history = this.list_history.map(i=>{
        if(i.id === e.id){
            i.loading_check_comment = true;
            i.delay = time;
        };
        return i;
    });
    
    let {data} = await this.$axios.post('/api/scanpost/check-hide-comment-link',{test_part,delay_time:time,list:[e]})

    this.list_history = this.list_history.map(i=>{
        if(i.id === e.id){
            i.loading_check_comment = false;
            i.hide_comment = data.check.length > 0 ? !data.check[0] : true;
        };
        return i;
    });
    return;
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
EditDelayTime:async function(e){
    let _ = this;
    _.$prompt('', 'Delay Time', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
    }).then(async ({ value }) => {
        await _.CheckHideComment(e,value);
    }).catch(() => {

    });
},
TurnOn_Reaction:async function(){
    this.type_filter = 'reaction';

    let {data} = await this.$axios.post('/api/scanpost/scan-reaction',{url_id:this.url_id});
    if(data.error) throw data.error;
    return;
},
TurnOff_Reaction:async function(){
    let {data} = await this.$axios.post('/api/scanpost/stop-scan-reaction',{url_id:this.url_id});
    if(data.error) throw data.error;
    return;
},
ScanReaction:async function(){
    try{
        if(this.scan_reaction_status){
            return await this.TurnOn_Reaction();
        }else{
            return await this.TurnOff_Reaction();
        }
    }catch(error){
        this.$notify({
            title: 'Có lỗi xảy ra',
            message: error,
            type: 'error'
        });
    }
    return;
},
TurnOn_Old_Comment:async function(){
    this.type_filter = 'comment';
    let {data} = await this.$axios.post('/api/scanpost/scan-old-comment',{url_id:this.url_id});
    if(data.error) throw data.error;
    return;
},
TurnOff_Old_Comment:async function(){
    let {data} = await this.$axios.post('/api/scanpost/stop-scan-old-comment',{url_id:this.url_id});
    if(data.error) throw data.error;
    return;
},
ScanOldComment:async function(){
    try{
        if(this.scan_old_comment_status){
            return await this.TurnOn_Old_Comment();
        }else{
            return await this.TurnOff_Old_Comment();
        }
    }catch(error){
        this.$notify({
            title: 'Có lỗi xảy ra',
            message: error,
            type: 'error'
        });
    }
    return;
},
TurnOn_Realtime_Comment:async function(){
    this.type_filter = 'comment';
    let {data} = await this.$axios.post('/api/scanpost/scan-realtime-comment',{url_id:this.url_id});
    if(data.error) throw data.error;
    return;
},
TurnOff_Realtime_Comment:async function(){
    let {data} = await this.$axios.post('/api/scanpost/stop-scan-realtime-comment',{url_id:this.url_id});
    if(data.error) throw data.error;
    return;
},
ScanRealtimeComment:async function(){
    try{
        if(this.scan_comment_status){
            return await this.TurnOn_Realtime_Comment();
        }else{
            return await this.TurnOff_Realtime_Comment();
        }
    }catch(error){
        this.$notify({
            title: 'Có lỗi xảy ra',
            message: error,
            type: 'error'
        });
    }
    return;
},
StartTest:async function(){
    this.loading_test = true;
    try{
        let comment = this.comment;
        let delay_time = this.test_time;
        let list = this.list_urlscan_remove;
        let test_part = this.test_part;
        let {data} = await this.$axios.post('/api/scanpost/check-hide-comment',{comment,delay_time,list,test_part});
        if(data.error) throw data.error;
        this.$confirm('Đã hoàn thành tiến trình', 'Hoàn thành', {
            confirmButtonText: 'OK',
            showCancelButton:false,
            type: 'success'
        });
        await this.Load_History();

    }catch(error){
        this.$confirm(error, 'ERROR', {
            confirmButtonText: 'OK',
            showCancelButton:false,
            type: 'error'
        })


    }
    this.check_comment_show = false;
    this.loading_test = false;
    return;


},
GetListImageSample:async function(messagesample_id){
    let {data} = await this.$axios.get('/api/attachment?limit=10000000000&messagesample_id='+messagesample_id);
    return data;
},
EditMessage:async function({id,title,message}){
    this.list_image_upload = await this.GetListImageSample(id);
    this.title_message = title;
    this.new_message = message;
    this.edit_message_id = id;
    return;
},
GetListSampleMessage:async function(){
    let {data} = await this.$axios.get('/api/messagesample?limit=10000000000');
    return this.list_message_sample = data;
},
OpenMessageDialog:async function(){
    await this.GetListSampleMessage();
    this.ResetForm();
    this.list_message_show = true;
},
filter_rule:async function({hour,type}){
    this.rule_hour = hour;
    this.rule_type = type;

    return await this.GetDataURL();
},
filter_scan:async function(e){
    this.status_filter = e.value;
    return await this.GetDataURL();

},
Update_Rule:async function(){
    await this.$axios.post('/api/rule',{list_status:this.list_status});
    this.$message({type:'success',message:'Update thành công'});
    await this.Get_Rule();
    return;
},
Get_Rule:async function(){
    let {data} = await this.$axios.get('/api/rule');
    this.list_status = data.length > 0 ? data[0].list_status : [ 
    {
        "type" : "success",
        "hour" : 1,
        "disabled" : true,
        "mili" : 60000
    }, 
    {
        "type" : "primary",
        "hour" : 12,
        "disabled" : false,
        "mili" : 43200000
    }, 
    {
        "type" : "warning",
        "hour" : 24,
        "disabled" : false,
        "mili" : 86400000
    }, 
    {
        "type" : "danger",
        "hour" : 72,
        "disabled" : false,
        "mili" : 259200000
    },
    {
        "type" : "info",
        "hour" : null,
        "disabled" : false,
        "mili" : 259200000
    }
    ]
    return ;
},
SetNoteType:async function(command){
    this.note_id = command;
    this.pager_comment = 1;
    await this.GetComment();
},
UpdateNote:async function(e){
    await this.$axios.patch('/api/scanpost/'+e.id,{note:e.note});
    this.$notify({
        title: 'Thành công',
        message: 'Đã update note comment',
        type: 'success'
    });
},
tableRowClassName:function({row:{note_id}}){

    return 'row_'+this.list_note.find(e=>e.value == note_id).type;
},
set_note:async function(command,e){

    e.note_id = command;
    await this.$axios.patch('/api/scanpost/'+e.id,{note_id:command});
    this.$notify({
        title: 'Hoàn thành',
        message: 'Đã cập nhật trạng thái',
        type: 'success'
    });
    return;

},
Get_Note_Type:function(note_id){
    return this.list_note.find(e=>e.value === note_id).type;
},
UpdateStatusScan:async function(e){
    try{
        this.url_id = e.id;

        if(e.status){
         await this.ScanPostLink();
     }else{
        await this.StopScan();
    }
    return;
}catch(error){
    e.status = false;
    this.$notify({
        title: 'Có lỗi xảy ra',
        message: error,
        type: 'error'
    });
}

},

ShowSetting:function(){
    this.show_setting = true;
},

datetime:function(unixtime){
    let time = new Date(unixtime*1000);
    let date = time.getDate();
    let month = time.getMonth()+1;
    let year = time.getFullYear();

    let hour = time.getHours();
    let minute = time.getMinutes();
    let second = time.getSeconds();
    return hour+':'+minute+':'+second+' '+ date+'/'+month+'/'+year;
},
RemoveUrlScan:async function(){

    for(let {id} of this.list_urlscan_remove){
        await this.$axios.post('/api/scanpost/remove',{url_id:id});

        this.pager_urlscan = (this.list_history.length > 1) ? this.pager_urlscan :  ((this.pager_urlscan > 1 ) ? (this.pager_urlscan - 1) : 1)
        this.list_history = this.list_history.filter(e=>e.id !== id)
    }
    this.url_post = '';
    this.$message({type:'error',message:'Đã xóa dữ liệu lịch sử của '+this.list_urlscan_remove.length+ ' URL'});


},
handleSelectionChangeUrlScan:function(e){
    this.list_urlscan_remove = e
},
AddUrl:async function(){
    this.reset_loading();
    this.url_post = '';
    this.uid_today = 0;
    this.comment_today = 0;
    this.name_post = '';
    this.url_id = '';
    this.add_post_show = true;


    return
},
ActiveUrl:async function({url,id,post_ID,name_post,status,delay}){
    this.url_id = id;
    this.url_post = url;
    this.post_ID = post_ID;
    this.name_post = name_post;
    this.scan_comment_status = status;
    this.loading_data = true;
    this.add_post_show = true;
    this.delay_time = delay;
    
    await this.ShowData();
    await this.MakeGetCountToday();
    this.loading_data = false;
    return  await this.GetTokenOfPost();;
},
GetTokenOfPost:async function(){
    let {data} = await this.$axios.post('/api/scanpost/find-token',{url_id:this.url_id});

    if(data){
       this.token_use = data;
   }else{
       this.token_use = {
        id:null,
        name:null,
        uid:null,
        access_token:null
    };
}
return;
},
reset_loading:function(){
    this.loading_data = false;
    this.list_data = [];
    this.count = 0;
    this.count_phone = 0;
    this.pagination_show = false;
    this.loading_ScanPost = false;
    return;
},
clickitem:async function(e){

   this.reset_loading();
   this.loading_data = true;

   e === this.type_filter ? this.type_filter = undefined : this.type_filter = e;
   await this.ShowData();
   this.loading_data = false;
   return;
},
Remove_data:async function(){
    for(let {id} of this.multipleSelection) {
        await this.$axios.delete('/api/ScanPost/'+id);
    }
    await this.GetData();
    return;
},
handleSelectionChange:function(val){
    this.multipleSelection = val;
},
ScanPostLink:async function(){
    try{

       let {data} = await this.$axios.post('/api/ScanPost/scan-realtime-comment',{url_id:this.url_id});

       if(data.error) throw data.error;
       await this.ShowData();
       this.$notify({
        title: 'Thành công',
        message: 'Đã chuyển đổi chế độ',
        type: 'success'
    });
   }catch(error){
    throw error;
}

return false;
},
ScanPost:async function(){

    try{

        if(!this.url_post_new.includes('facebook.com')) throw 'URL bài viết không hợp lệ';
        if(this.name_post_new.trim().length === 0) throw 'Tên bài viết không được để trống';
        if(this.url_post_new.includes('<iframe')){
            let d = decodeURIComponent(this.url_post_new);
            let startS = 'href=';
            let endS = '&show_text';
            this.url_post_new = d.match(new RegExp('(?<='+startS+'+).*?(?='+endS+')',"gs"))[0];

        }
        this.pagination_show = false;
        this.loading_ScanPost_new = true;
        let {data} = await this.$axios.post('/api/ScanPost/add-link',{name_post:this.name_post_new,url_post:this.url_post_new});
        if(data.error) throw data.error;
        this.url_id = data.id;
        this.name_post_new = '';
        this.url_post_new = '';
        this.loading_ScanPost_new = false;
        this.$notify({
            title: 'Thành công',
            message: 'Đã thêm bài viết',
            type: 'success'
        });
        this.list_history.unshift(data);
        await this.UpdateCountComment(data);
        this.scan_comment_status = true;
        this.scan_old_comment_status = true;
        await Promise.all([this.CheckHideComment(data,data.delay),this.ScanOldComment()]);
        data.status = true;

        await this.UpdateStatusScan(data);

    }catch(error){
        this.loading_ScanPost_new = false;

        this.$confirm(error, 'Xin lỗi', {
            confirmButtonText: 'OK',
            showCancelButton:false,
            type: 'error'
        })
        

    }
    this.loading_ScanPost_new = false;

    return;
},

waitTime:function(time){
    return new Promise(resolve=>{
        setTimeout(function(){
            return resolve(time)
        },time)
    })
},
RefreshData:async function(){
    this.loading_ScanPost = true;
    this.refresh_data = true;
    this.loading_data = true;
    await this.ShowData();
    this.refresh_data = false;
    this.loading_data = false;
    return;
},
ShowData:async function(){

    if(this.url_post.includes('facebook.com') && (this.url_id.length > 0)){

     return await Promise.all([this.GetData(),this.GetCount(),this.GetStatusComment(),this.GetStatusOldComment(),this.GetStatusReaction(),this.MakeGetCountToday()])

 }else{
    return;
}
},
UpdateData:async function(){
    if(this.add_post_show && this.url_post.includes('facebook.com')){
        await this.ShowData();
    }
    await this.waitTime(3000);

    return await this.UpdateData();
},
GetStatusOldComment:async function(){
    let {data} = await this.$axios.get('/api/logtokenscan/',{params:{url_id:this.url_id,type:'old-comment'}});
    return this.scan_old_comment_status = (data.length > 0);
},
GetStatusComment:async function(){
    let {data} = await this.$axios.get('/api/logtokenscan/',{params:{url_id:this.url_id,type:'comment'}});
    return this.scan_comment_status = (data.length > 0);
},
GetStatusReaction:async function(){
    let {data} = await this.$axios.get('/api/logtokenscan/',{params:{url_id:this.url_id,type:'reaction'}});
    return this.scan_reaction_status = (data.length > 0);
},
UpdateDelayTime:async function(){
    await this.$axios.patch('/api/urlscan/'+this.url_id,{delay:this.delay_time});
    return this.$message({type:'success',message:'Đã update delay time.'})
},
GetData:async function(){
 let phone = this.phone_visible ? "" : '0';
 let {data} = await this.$axios.get('/api/scanpost',{params:{sort:'time DESC',limit:this.limit_data,skip:(this.pager - 1)*this.limit_data,where:{type:this.type_filter,post_ID:this.post_ID,phone:{'!=':phone}}}});
 this.list_data = data;
 this.loading_data = false;
 this.pagination_show = true;
 return;
},
MakeGetCountToday:async function(){


    let {data} = await this.$axios.post('/api/scanpost/count-today',{type:this.type_filter,url_id:this.url_id});
    this.uid_today = data.uid_today;
    this.comment_today = data.comment_today;
    return;
},
MakeGetCount:async function(url){

    let phone = this.phone_visible ? "" : '0';
    let {data} = await this.$axios.post('/api/scanpost/count',{type:this.type_filter,url_id:this.url_id,phone:{'!=':phone}});
    return data;
},
GetCount:async function(){
    let {count,count_phone} = await this.MakeGetCount();
    this.count = count;
    this.count_phone = count_phone;
    return;
},
GetCommentData:async function(){
    let {data} = await this.$axios.post('/api/scanpost/comment',this.where_comment);
    this.comment_count = data.count;
    this.$notify({
       title: 'Thành công',
       message: 'Đã lấy dữ liệu comment',
       type: 'success'
   });
    return;
},
GetListComment:async function(){
    let {data} = await this.$axios.get('/api/scanpost',{params:{sort:'time DESC',limit:this.limit_comment,type:'comment',skip:(this.pager_comment - 1)*this.limit_comment,where:this.where_comment}});
    return this.list_comment = data;
},
GetComment:async function(){
    this.comment_loading = true;
    await Promise.all([this.GetListComment(),this.GetCommentData()]);
    this.comment_loading = false;
    return;
},
Load_History:async function(){
    await this.Get_Rule();
    if(this.active_tab === 'c'){
        this.pager_comment = 1;
        this.phone_visible = false;
        this.range_time_comment = [];
        this.keysearch_comment = '';
        this.note_id = undefined;
        await this.GetComment();
    }else{
       this.loading_history = true;
       await this.GetDataURL();
       this.loading_history = false;
   }

   return;
},
GetDataURL:async function(){
    return await Promise.all([this.GetHistory(),this.GetCountHistory()])
},
GetCountHistory:async function(){
    let where = {status:this.status_filter,hide_comment:this.hide_comment,keysearch:{contains:this.keysearch.toLowerCase()}};
    if(this.rule_hour){

        where.last_time = {'>=':parseInt(Date.now()/1000) - (this.rule_hour*3600),'<':parseInt(Date.now()/1000) - this.recent_time}
    }
    let {data} = await this.$axios.post('/api/scanpost/count-urlscan',where);
    return this.count_urlscan = data.count;
},

GetHistory:async function(){
    let where = {status:this.status_filter,hide_comment:this.hide_comment,keysearch:{contains:this.keysearch.toLowerCase()}};
    if(this.rule_hour){

        where.last_time = {'>=':parseInt(Date.now()/1000) - (this.rule_hour*3600),'<':parseInt(Date.now()/1000) - this.recent_time}
    }
    let {data} = await this.$axios.get('/api/urlscan',{params:{where,sort:'createdAt DESC',limit:this.limit_urlscan,skip:(this.pager_urlscan - 1)*this.limit_urlscan}});



    return this.list_history = data.map(e=>{
        e.status = e.log.filter(e=>e.type === 'comment').length > 0;
        e.loading_check_comment = false;
        return e;
    })


},
Get_Hour_Comment:function(time){
    if(time === 0) return 'No comment';
    let range_time = parseInt(Date.now()/1000) - time;

    let type_result = 'unlimited'
    
    for(let {type,mili,hour} of this.list_status){

        if(range_time < (hour*3600)) {
            type_result = '< '+hour+'h';
            break;
        }
    };

    return type_result;
},

Get_Status:function(time){
    if(time === 0) return 'info';
    let range_time = parseInt(Date.now()/1000) - time;

    let type_result = 'info';
    
    for(let {type,mili,hour} of this.list_status){

        if(range_time < (hour*3600)) {
            type_result = type;
            break;
        }
    };

    return type_result;
},

StopScan:async function(){
    await this.$axios.post('/api/scanpost/stop-scan-realtime-comment',{url_id:this.url_id});
    this.loading_ScanPost = false;
    this.$message({type:'info',message:'Đã dừng quét bài viết'});
},
ExportDataComment:async function(){
    let phone = this.phone_visible ? "" : '0';
    let response = await this.$axios.post('/api/scanpost/download-comment',{...this.where_comment},{responseType: 'blob'});
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
ExportData:async function(){
    let phone = this.phone_visible ? "" : '0';
    let response = await this.$axios.post('/api/scanpost/download',{url_id:this.url_id,type:this.type_filter,phone:{'!=':phone}},{responseType: 'blob'});
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    let time = new Date();
    let date = time.getDate();
    let month = time.getMonth()+1;
    let year = time.getFullYear();

    link.setAttribute('download', 'hotdatafb-'+date+'_'+month+'_'+year+'.xlsx'); 
    document.body.appendChild(link);
    link.click();
}
}
}
</script>
<style>

    .el-table .row_danger {
        background: #951d1d;
    }
    .el-table .row_primary {
        background: #312c8b;
    }

    .el-table .row_success {
        background: #154e15;
    }
    .el-table .row_warning {
        background: #8b7232;
    }

    .el-table .row_danger:hover > td {
     background-color: initial !important;
 }
 .el-table .row_primary:hover > td {
     background-color: initial !important;
 }

 .el-table .row_success:hover > td {
     background-color: initial !important;
 }
 .el-table .row_warning:hover > td {
     background-color: initial !important;
 }
 .pointer:hover{
    cursor: pointer;
}
.el-form-item__label{
    width: 100%;
}
.el-upload-list--picture-card .el-upload-list__item{
    width:68px !important;
    height: 68px !important;
}
.el-upload--picture-card{
    width: 68px !important;
    height: 68px !important;
}
.el-upload--picture-card i {
    font-size: 14px !important;
}
.el-upload--picture-card{
    line-height: 68px !important;
}
</style>

