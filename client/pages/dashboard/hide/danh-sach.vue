<template>
    <div>
       <el-tabs @tab-click="TabMainClick" v-model="active_tab" type="border-card">
        <el-tab-pane name="hide">
            <span slot="label"><i class="el-icon-notebook-2"></i> Danh sách</span>

            <el-row :gutter="20">
                <el-col align="left" :span="24" :offset="0">
                    <el-form status-icon label-width="auto" label-position="top" :inline="true" :disabled="false" :inline-message="false" show-message validate-on-rule-change size="medium">
                        <el-row :gutter="6">
                         <el-col  align="left" :span="16" :offset="0">
                           <el-form-item style="width: 100%;" class="field" label="Link bài viết:" prop="" align="left">
                            <el-input spellcheck="false" style="width: 100%;" placeholder="Nhập link bài viết cần ẩn comment..." v-model="hide.url_post" size="small" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"> <i class="el-icon-edit el-input__icon" slot="prefix">
                            </i></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col align="left" :span="8" :offset="0">
                        <el-form-item style="width: 100%;" class="field" label="Tiêu đề:" prop="" align="left">
                            <el-input spellcheck="false" style="width: 100%;" placeholder="Tên bài viết ..." v-model="hide.title" size="small" clearable type="text" :autosize="false" :disabled="false" autocomplete="off">
                                <i class="el-icon-star-on el-input__icon" slot="prefix">
                                </i>
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-col>
    </el-row>
    <el-row :gutter="20">
        <el-col align="left" :span="24" :offset="0">
            <el-tooltip effect="dark" content="Thêm bài viết" placement="top-start">
                <el-button type="primary" @click="SaveHide" icon="el-icon-circle-plus-outline" :loading="loading_savehide" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Save</el-button>
            </el-tooltip>


        </el-col>
    </el-row>
    <el-divider direction="horizontal"></el-divider>

    <el-row :gutter="20">
        <el-col align="left" :span="24" :offset="0">
            <el-tag  type="primary" :closable="false" effect="plain" size="medium" :disable-transitions="false">
                {{hide.count}} Posts
            </el-tag>
            <el-input @keyup.enter.native="ListHide" @change="ListHide" spellcheck="false" style="width: 250px;" placeholder="ID post or name post ..." prefix-icon="el-icon-search" v-model="keysearch_hide" size="mini" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
            <el-popconfirm title="Bạn có chắc chắn?" @confirm="RemoveUrl" confirmButtonText='OK' cancelButtonText='Không,cảm ơn.' icon="el-icon-info" iconColor="red">
                <el-button  v-show="multipleSelection.length > 0" slot="reference" type="danger" icon="el-icon-delete-solid" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Remove {{multipleSelection.length}} post</el-button>
            </el-popconfirm>
        </el-col>
    </el-row>
    <br>

    <el-table :data="hide.list" max-height="500" @selection-change="handleSelectionChange" :border="true" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="light" style="width: 100%">
        <el-table-column align="center" type="selection" width="55"></el-table-column>


        <el-table-column label="Tên bài" align="center" :sortable="false" :fixed="false">
            <template slot-scope="scope">
                <el-tooltip effect="dark" :content="scope.row.post_ID" placement="top-start">
                   <el-link :href="'https://www.facebook.com/'+scope.row.post_ID" target="_blank" :underline="false">{{scope.row.title}}</el-link>   
               </el-tooltip>
           </template>
       </el-table-column>

       <el-table-column label="Tên Page" align="center" :sortable="false" :fixed="false" width="240">
        <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.page_ID" placement="top-start">
                <el-link :href="'https://www.facebook.com/'+scope.row.page_ID" target="_blank" :underline="false">{{scope.row.pageName}}</el-link>
            </el-tooltip> 
        </template>
    </el-table-column>

    <el-table-column label="Delay" align="center" :sortable="false" :fixed="false" width="80">
        <template slot-scope="scope">
            <el-tooltip effect="dark" :content="scope.row.delay+' giây'" placement="top-start">
                <el-button type="default" @click="UpdateDelay(scope.row)" icon="" :loading="false" :plain="true" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">{{scope.row.delay}}</el-button>
            </el-tooltip>
        </template>
    </el-table-column>
    <el-table-column label="Status" align="center" :sortable="false" :fixed="false" width="120">
        <template slot-scope="scope">

            <el-tag v-if="(scope.row.status === 'active') && (scope.row.scan)" type="success" :closable="false" effect="dark" size="small" :disable-transitions="false">Active</el-tag>
            <el-tag v-if="(scope.row.status !== 'cookie' ) && (!scope.row.scan)" type="danger" :closable="false" effect="dark" size="small" :disable-transitions="false">Stop</el-tag>
            <el-tag v-if="scope.row.status === 'cookie'" type="danger" :closable="false" effect="plain" size="small" :disable-transitions="false">Cookie expire</el-tag>

        </template>
    </el-table-column>
    <el-table-column label="Hide" align="center" :sortable="false" width="70" :fixed="false">
     <template slot-scope="scope">
        <el-switch :disabled="scope.row.status === 'cookie'" @change="ChangeModeHide(scope.row)" width="35" size="mini" v-model="scope.row.scan"></el-switch>
     </template>
</el-table-column>
    <el-table-column label="Ẩn" align="center" :sortable="false" :fixed="false" width="200">
        <template slot-scope="scope">
            <el-select @change="ChangeHideMode(scope.row)" style="width: 120px;" size="mini" v-model="scope.row.option" placeholder="Select">
                <el-option value="tat-ca" label="Tất cả"></el-option>
                <el-option value="an-so" label="Số điện thoại"></el-option>

            </el-option>
        </el-select>
       

    </template>
</el-table-column>
<el-table-column align="center" :sortable="false" :fixed="false" width="120">
    <template slot-scope="scope">
        <el-button type="primary" @click="OpenHideCommentData(scope.row)" icon="" :loading="false" :plain="false" :round="true" :circle="false" :autofocus="false" size="mini" :disabled="false">Chi tiết</el-button>
    </template>
</el-table-column>



</el-table>
<br>
<el-pagination @current-change="ListHide" :total="hide.count" :page-size="100" :current-page.sync="pager_hide" :pager-count="11" :hide-on-single-page="false" background layout="prev, pager, next"></el-pagination>




<el-dialog title="Bình luận" :visible.sync="hidecomment_show" :center="false" :fullscreen="false" top="5vh" width="1200px">
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
<el-row :gutter="20">
    <el-col align="left" :span="6" :offset="0">
     <el-input @keyup.enter.native="GetHideComment" @change="GetHideComment" placeholder="Keysearch ..." prefix-icon="el-icon-search" v-model="keysearch_comment" size="small" spellcheck="false" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
 </el-col>
</el-row>
<br>
<el-table :data="list_comment" v-loading="comment_loading" :row-class-name="tableRowClassName" :border="true" :highlight-current-row="false" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="none" style="width: 100%">

  <el-table-column label="Time" align="center" :sortable="false" width="150" :fixed="false">
      <template slot-scope="scope">
        <el-tag  type="primary" :closable="false" effect="plain" size="large" :disable-transitions="false">
            {{datetime(scope.row.time)}}
        </el-tag>
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
    <el-tag  v-clipboard:success="onCopy" v-clipboard:copy="scope.row.phone"  type="primary" :closable="false" effect="dark" size="large" :disable-transitions="false">
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
</el-dialog>


</el-tab-pane>

</el-tabs>
<el-dialog :title="'Bỏ comment có chứa từ khóa: '+tilte_keyword_blocked" :visible.sync="keyword_blocked_show" :center="false" :fullscreen="false" top="0vh" width="50%">
    <el-row :gutter="20">
        <el-col align="left" :span="20" :offset="0">
            <el-input spellcheck="false" @keyup.enter.native="SaveBlockedKeyword" placeholder="Nhập từ khóa" v-model="keyword_blocked" size="small" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
        </el-col>
        <el-col align="right" :span="4" :offset="0">
            <el-button style="width: 100%;" type="primary" @click="SaveBlockedKeyword" icon="" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="small" :disabled="false">Confirm</el-button>
        </el-col>
    </el-row>
    <br>
    <div v-if="list_keyword_blocked_select.length > 0">
       <el-popconfirm title="Bạn có chắc chắn ?" @confirm="RemoveBlockedKeyword" confirmButtonText='OK' cancelButtonText='Không,cảm ơn.' icon="el-icon-info" iconColor="red">
        <el-button slot="reference" type="danger" icon="el-icon-delete-solid" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Remove {{list_keyword_blocked_select.length}} keyword</el-button>
    </el-popconfirm>
    <br> <br>
</div>
<el-table @selection-change="handleSelectionChangeKeywordBlocked" :data="list_keyword_blocked" max-height="500" :border="true" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="light" style="width: 100%">
    <el-table-column align="center" type="selection" width="55"></el-table-column>
    <el-table-column label="Keyword" prop="value" align="center" :sortable="false" :fixed="false"/>
</el-table>
</el-dialog>
</div>
</template>
<script>
    export default {
        data(){
            return {
                keyword_blocked:'',
                keyword_blocked_show:false,
                hide_id_blocked_keyword:null,
                tilte_keyword_blocked:'',
                list_keyword_blocked:[],
                list_keyword_blocked_select:[],
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
                    delay:5,
                    count:0
                },
                list_comment:[],
                comment_loading:false,
                loading_token:true,
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
                list_status_comment:[
                    {value:undefined,type:'primary',label:'Tất cả'},
                    {value:false,type:'danger',label:'Hide'},
                    {value:true,type:'success',label:'Show'},

                    ],
                loading_refresh:false,
                live:true,
                note_id:0,
                post_ID:null,
                keysearch_hide:'',
                pager_hide:1
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
                let post_ID = this.post_ID;

                start_time = start_time/1000;
                end_time = end_time/1000;

                return {phone:{'!=':phone},post_ID,keysearch:{contains:this.keysearch_comment.toLowerCase()},note_id:this.note_id,time:{'>=':start_time,'<=':end_time}}
            },
            where_hide(){
                return {keysearch:{contains:this.keysearch_hide.toLowerCase()}}
            }
        },
        created:async function(){
           await this.ListHide();
       },
       methods:{
         onCopy:function(e){
    this.$message({type:'success',message:'Copied !'})
},
        ChangeModeHide:async function({id,scan}){
            return await this.$axios.patch('/api/hide/'+id,{scan})
        },
        handleSelectionChangeKeywordBlocked:function(value){
            this.list_keyword_blocked_select = value;
        },
        RemoveBlockedKeyword:async function(){

            for(let e of this.list_keyword_blocked_select){

                await this.$axios.delete('/api/blockedkeywordhide/'+e.id);
                this.list_keyword_blocked.splice(this.list_keyword_blocked.indexOf(e),1);
            }
        },
        
        SaveBlockedKeyword:async function(){
            try{
                if(this.keyword_blocked.length === 0) throw 'Nội dung keyword không được bỏ trống';
                let {data} = await this.$axios.post('/api/blockedkeywordhide/save',{hide_id:this.hide_id_blocked_keyword,value:this.keyword_blocked});
                this.list_keyword_blocked.unshift(data);
                this.keyword_blocked = '';
                return;
            }catch(error){
                this.$notify({
                    title: 'ERROR',
                    message: error,
                    type: 'error'
                });
            }
        },
        OpenBlockedKeyword:async function({id,title}){
            this.keyword_blocked_show = true;
            this.tilte_keyword_blocked = title;
            this.hide_id_blocked_keyword = id;
            let {data} = await this.$axios.post('/api/blockedkeywordhide/list');
            return this.list_keyword_blocked = data;
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
            this.hide.list.splice(this.hide.list.indexOf(url),1);
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
                let {data} = await _.$axios.patch('/api/hide/'+e.id,{delay:parseInt(value)});
                e.delay = parseInt(value);
            }

        }).catch(() => {

        });
    },
    ChangeHideMode:async function({id,option}){
        return await this.$axios.patch('/api/hide/'+id,{option})
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
     await Promise.all([this.GetListCommentData(),this.GetCommentCountData()]);
     if(this.hidecomment_show){
        await this.waitTime(1000);
        return await this.GetHideComment();
    }else{
        return;
    }


    return;
},
OpenHideCommentData:async function({post_ID}){
    this.hidecomment_show = true;
    this.post_ID = post_ID;
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
    await this.$axios.patch('/api/scanpost/'+e.id,{note_id:command});
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
    let date = time.getDate();
    let month = time.getMonth()+1;
    let year = time.getFullYear();

    let hour = time.getHours();
    let minute = time.getMinutes();
    let second = time.getSeconds();
    return hour+':'+minute+':'+second+' '+ date+'/'+month+'/'+year;
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
GetListHideData:async function(){
    let {data} = await this.$axios.get('/api/hide',{params:{limit:100,skip:(this.pager_hide - 1)*100,where:this.where_hide}});
    return this.hide.list = data;
},
GetCountHideData:async function(){
    let {data} = await this.$axios.post('/api/hide/count',{where:this.where_hide});
    return this.hide.count = data.count;
},
ListHide:async function(){
    return await Promise.all([this.GetListHideData(),this.GetCountHideData()])
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
<style scoped>

</style>