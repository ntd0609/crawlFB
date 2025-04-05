<template>
 <el-tabs v-model="active_tab" type="border-card">


    <el-tab-pane name="b">

        <span slot="label"><i class="el-icon-folder-opened"></i> Bài viết</span>
        <el-row :gutter="20">
            <el-col align="left" :span="24" :offset="0">
                <el-form status-icon label-width="auto" label-position="top" :inline="true" :disabled="false" :inline-message="false" show-message validate-on-rule-change size="medium">
                    <el-row :gutter="6">
                     <el-col  align="left" :span="16" :offset="0">
                       <el-form-item style="width: 100%;" class="field" label="Link bài viết:" prop="" align="left">
                        <el-input spellcheck="false" style="width: 100%;" placeholder="Nhập link bài viết ..." v-model="url_post_new" size="small" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"> <i class="el-icon-edit el-input__icon" slot="prefix">
                        </i></el-input>
                    </el-form-item>
                </el-col>
                <el-col align="left" :span="8" :offset="0">
                    <el-form-item style="width: 100%;" class="field" label="Tiêu đề:" prop="" align="left">
                        <el-input spellcheck="false" style="width: 100%;" placeholder="Tên bài viết ..." v-model="name_post_new" size="small" clearable type="text" :autosize="false" :disabled="false" autocomplete="off">
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
            <el-button type="primary" @click="ScanPost" icon="el-icon-circle-plus-outline" :loading="loading_ScanPost_new" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Add Post</el-button>
        </el-tooltip>


    </el-col>
</el-row>
<el-divider direction="horizontal"></el-divider>

<el-row :gutter="20">
    <el-col align="left" :span="12" :offset="0">
        <el-tag  type="primary" :closable="false" effect="plain" size="medium" :disable-transitions="false">
            {{count_urlscan}} Posts
        </el-tag>
        <el-input @keyup.enter.native="Load_History" @change="Load_History" spellcheck="false" style="width: 250px;" placeholder="ID post or name post ..." prefix-icon="el-icon-search" v-model="keysearch" size="mini" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>


        <el-popconfirm title="Bạn có chắc chắn?" @confirm="RemoveUrlScan" confirmButtonText='OK' cancelButtonText='Không,cảm ơn.' icon="el-icon-info" iconColor="red">
            <el-button slot="reference" v-show="list_urlscan_remove.length > 0" type="danger" @click="" icon="el-icon-delete-solid" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Remove</el-button>

        </el-popconfirm>
    </el-col>
    <el-col align="right" :span="12" :offset="0">
 <el-tooltip effect="dark" content="Cập nhật số lượng reaction" placement="top-start">

        <el-button type="primary"  @click="GetCountComment" icon="el-icon-refresh" :loading="false"  style="margin-right: -10px;" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Push</el-button>
    </el-tooltip>
       <el-button type="primary" @click="check_comment_show = true" v-if="permission.includes('check-an')"  style="margin-right: -10px;" icon="el-icon-timer" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Time Request</el-button>

       <el-button type="primary" @click="ShowSetting" icon="el-icon-star-on" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Color Status</el-button>


   </el-col>
</el-row>

<br> 
<el-table :data="list_history" :border="true" :highlight-current-row="false" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="light" style="width: 100%"  @selection-change="handleSelectionChangeUrlScan" v-loading="loading_history" element-loading-text="Loading...">
 <el-table-column align="center" type="selection" width="55"></el-table-column>

 <el-table-column label="Title" align="center" :sortable="false" :fixed="false">
    <template slot-scope="scope">
        <el-tooltip effect="dark" :content="scope.row.page_ID+'_'+scope.row.post_ID" placement="top-start">
            <el-link type="primary" :href="scope.row.url" target="_blank" :underline="false">
            {{scope.row.name_post}}</el-link>
        </el-tooltip>
    </template>
</el-table-column>




<el-table-column align="center" v-if="permission.includes('check-an')" :sortable="false" :fixed="false" width="250px">
 <template slot="header">
     <el-dropdown @command="filter_hide_comment" size="mini">
      <span class="el-dropdown-link">

          Time <i class="el-icon-caret-bottom el-icon--right"></i>
      </span>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(data,index) in list_status_comment" :command="data" :key="index">

            <el-tag style="margin-top: 5px" :type="data.type" :closable="false" effect="dark" size="small" :disable-transitions="false">  {{data.label}}</el-tag>
        </el-dropdown-item>

    </el-dropdown-menu>
</el-dropdown>
</template>
<template slot-scope="scope">
    <el-tooltip effect="dark" :content="scope.row.delay+' giây'" placement="top-start">
       <el-button type="default" @click="EditDelayTime(scope.row)" icon="" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="!permission.includes('check-an')">
        {{scope.row.delay}}s
    </el-button>

</el-tooltip>
<el-tag v-if="!scope.row.hide_comment && !scope.row.loading_check_comment" type="success" :closable="false" effect="plain" size="medium" :disable-transitions="false">Show</el-tag>
<el-tag v-if="scope.row.hide_comment && !scope.row.loading_check_comment" type="danger" :closable="false" effect="plain" size="medium" :disable-transitions="false">Hide</el-tag>
<el-tag  type="warning" v-if="scope.row.loading_check_comment" :closable="false" effect="plain" size="medium" :disable-transitions="false"><i class="el-icon-loading"></i> Checking ...</el-tag>


</template>
</el-table-column>
<el-table-column align="center" v-if="permission.includes('push')" :sortable="false" :fixed="false" width="150px">
 <template slot="header">

<el-dropdown @command="filter_reaction" size="mini">
      <span class="el-dropdown-link">

          Reaction <i class="el-icon-caret-bottom el-icon--right"></i>
      </span>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item :command="1">
            <el-tag style="margin-top: 5px" type="success" :closable="false" effect="dark" size="small" :disable-transitions="false">Tăng</el-tag>
        </el-dropdown-item>
        <el-dropdown-item :command="2">
            <el-tag style="margin-top: 5px" type="primary" :closable="false" effect="dark" size="small" :disable-transitions="false">Không tăng</el-tag>
        </el-dropdown-item>
        <el-dropdown-item :command="3">
            <el-tag style="margin-top: 5px" type="info" :closable="false" effect="dark" size="small" :disable-transitions="false">Tất cả</el-tag>
        </el-dropdown-item>

    </el-dropdown-menu>
</el-dropdown>

   
    
</template>
<template slot-scope="scope">
    <el-tooltip effect="dark" :content="((scope.row.error || '').length === 0 ? scope.row.push+' reaction' : scope.row.error) + ' - '+ TimeLeft(scope.row.updatedAt)" placement="top-start">
        <el-tag  :type="scope.row.error ? 'danger' : (scope.row.push > 0 ? 'success' : 'primary')" :closable="false" effect="dark" size="small" :disable-transitions="false">
          <span  v-show="!scope.row.loading_push" >   <i class="el-icon-top"></i> {{scope.row.push}}
          </span>

          <i v-show="scope.row.loading_push" class="el-icon-loading"></i>



      </el-tag>
  </el-tooltip>

</template>
</el-table-column>


<el-table-column  align="center" :sortable="false" :fixed="false" width="120">
    <template slot="header">
     <el-dropdown @command="filter_rule" size="mini">
      <span v-if="!rule_hour" class="el-dropdown-link">

          Status <i class="el-icon-caret-bottom el-icon--right"></i>
      </span>
      <span v-if="rule_hour > 0" class="el-dropdown-link">
        < {{rule_hour}}h <i class="el-icon-caret-bottom el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(data,index) in list_status" :command="data" :key="index">
            <el-tag v-if="!data.hour" style="margin-top: 5px" type="warning" :closable="false" effect="plain" size="small" :disable-transitions="false">All Time</el-tag>
            <el-tag v-if="data.hour" style="margin-top: 5px" :type="data.type" :closable="false" effect="dark" size="small" :disable-transitions="false"> < {{data.hour}} giờ</el-tag>
        </el-dropdown-item>

    </el-dropdown-menu>
</el-dropdown>
</template>
<template slot-scope="scope">
    <el-tooltip effect="dark" content="Thời gian comment gần đây" placement="top-start">

        <el-tag :type="Get_Status(scope.row.last_time)" :closable="false" effect="dark" size="small" :disable-transitions="false">
            {{Get_Hour_Comment(scope.row.last_time)}}
        </el-tag>
    </el-tooltip>

</template>
</el-table-column>

<el-table-column align="center" v-if="permission.includes('scan')"  :sortable="false" :fixed="false" width="120">
    <template slot="header">
     <el-dropdown @command="filter_scan" size="mini">
      <span class="el-dropdown-link">

          Scan <i class="el-icon-caret-bottom el-icon--right"></i>
      </span>

      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(data,index) in list_status_scan" :command="data" :key="index">

            <el-tag style="margin-top: 5px" :type="data.type" :closable="false" effect="dark" size="small" :disable-transitions="false"> {{data.label}}</el-tag>
        </el-dropdown-item>

    </el-dropdown-menu>
</el-dropdown>
</template>
<template slot-scope="scope">
    <el-tooltip effect="dark" :content="scope.row.status ? scope.row.delay+' giây' : 'OFF'" placement="top-start">
        <el-switch
        v-model="scope.row.status"
        active-color="#13ce66"
        size="mini"
        @change="UpdateStatusScan(scope.row)"
        >
    </el-switch>
</el-tooltip>

</template>
</el-table-column>


<el-table-column label="Chi tiết" align="center" v-if="permission.includes('chi-tiet')"  :sortable="false" :fixed="false" width="120">
    <template slot-scope="scope">
        <i v-if="scope.row.loading_count_comment" class="el-icon-loading"></i>
        <el-tooltip effect="dark" content="Số bình luận hôm nay" placement="top-start">
            <el-button v-show="!scope.row.loading_count_comment" :type="(scope.row.count_comment > 0) ? 'success' : 'primary'" @click="ActiveUrl(scope.row)":loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">{{scope.row.count_comment}}</el-button> 
        </el-tooltip>

    </template>
</el-table-column>

</el-table>
<br>

<el-pagination @current-change="Load_History" :total="count_urlscan" :page-size="limit_urlscan" :current-page.sync="pager_urlscan" :pager-count="11" :hide-on-single-page="false" background layout="prev, pager, next"></el-pagination>

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



<el-dialog title="COMMENT" @close="Load_History" :visible.sync="add_post_show" :center="false" :fullscreen="false" top="5vh" width="90%">
    <el-form status-icon label-width="auto" label-position="top" :inline="true" :disabled="false" :inline-message="false" show-message validate-on-rule-change size="medium">
        <el-row :gutter="6">
         <el-col  align="left" :span="16" :offset="0">
           <el-form-item style="width: 100%;" class="field" label="Link bài viết:" prop="" align="left">
            <el-input spellcheck="false" style="width: 100%;" placeholder="Nhập link bài viết ..." v-model="url_post" size="small" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"> <i class="el-icon-edit el-input__icon" slot="prefix">
            </i></el-input>
        </el-form-item>
    </el-col>
    <el-col align="left" :span="8" :offset="0">
        <el-form-item style="width: 100%;" class="field" label="Tiêu đề:" prop="" align="left">
            <el-input spellcheck="false" style="width: 100%;" placeholder="Tên bài viết ..." v-model="name_post" size="small" clearable type="text" :autosize="false" :disabled="false" autocomplete="off">
                <i class="el-icon-star-on el-input__icon" slot="prefix">
                </i>
            </el-input>
        </el-form-item>

    </el-col>


</el-row>

</el-form>

<br>
<el-row :gutter="0">
    <!--
    <el-col align="left" :span="12" :offset="0">

        <el-switch v-model="scan_comment_status" style="margin-right: 20px;" @change="ScanRealtimeComment" size="mini" active-text="Quét comment realtime"> </el-switch>

    
    <el-tooltip effect="dark" content="Delay time (Giây)" placement="top-start">
        <el-input-number @change="UpdateDelayTime" v-model="delay_time" size="mini" controls-position="right" :step="5" :min="0" :max="100000000000"></el-input-number>
    </el-tooltip>


<el-tag  type="success" v-if="token_use.id" :closable="false" effect="plain" size="medium" :disable-transitions="false">
    {{token_use.name}}
</el-tag>


</el-col>
-->
<el-col align="right" :span="24" :offset="0">
 <el-tooltip effect="dark" content="Tổng tất cả UID" placement="top-start">
    <el-tag  :type="(count === 0) ? 'info':'warning'" :closable="false" effect="dark" size="medium" :disable-transitions="false">
        <i class="el-icon-user-solid"></i>
        {{count}} UID
    </el-tag>
</el-tooltip>
<el-tooltip effect="dark" content="Tổng tất cả SĐT tìm thấy" placement="top-start">
    <el-tag :type="(count_phone === 0) ? 'info':'danger'" :closable="false" effect="dark" size="medium" :disable-transitions="false">
        <i class="el-icon-phone-outline"></i>
        {{count_phone}} SĐT
    </el-tag>
</el-tooltip>
</el-col>
</el-row>
<el-divider direction="horizontal"></el-divider>
<el-row :gutter="0">

    <el-col align="left" :span="12" :offset="0">

        <el-radio-group @change="ShowData" v-model="type_filter" size="mini">
            <el-radio-button  label="reaction">REACTION</el-radio-button>
            <el-radio-button   label="comment">COMMENT</el-radio-button>
        </el-radio-group>


        <el-button type="info" @click="ExportData" icon="el-icon-download" :loading="false" :plain="true" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Export Data</el-button>
        <el-popconfirm title="Bạn có chắc chắn?" @confirm="Remove_data" confirmButtonText='OK' cancelButtonText='Không,cảm ơn.' icon="el-icon-info" iconColor="red">
            <el-button slot="reference" v-if="multipleSelection.length > 0" type="danger" icon="" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Xóa {{multipleSelection.length}} dòng</el-button>
        </el-popconfirm>
    </el-col>
    <el-col align="right" :span="12" :offset="0">
        <el-switch v-model="scan_old_comment_status" style="margin-right: 20px;" @change="ScanOldComment" size="mini" active-text="Quét comment cũ"> </el-switch>

        <el-switch v-model="scan_reaction_status" style="margin-right: 20px;" @change="ScanReaction" size="mini" active-text="Quét tương tác"> </el-switch>

        <el-switch v-model="phone_visible" @change="RefreshData" size="mini" active-text="Chỉ hiển thị SĐT"> </el-switch>

    </el-col>
</el-row>


<br>

<el-table  ref="multipleTable" :data="list_data" :border="true" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="light" style="width: 100%"  @selection-change="handleSelectionChange" v-loading="loading_data" element-loading-text="Loading...">
    <el-table-column align="center" type="selection" width="55"></el-table-column>
    <el-table-column label="Type" align="center" :sortable="false" width="150"  :fixed="false">
      <template slot-scope="scope">
        <el-tag  type="primary" :closable="false" effect="plain" size="large" :disable-transitions="false">
            {{scope.row.type}}
        </el-tag>

    </template>
</el-table-column>
<el-table-column label="Time" align="center"  v-if="type_filter === 'comment'" :sortable="false" :fixed="false" width="150">
    <template slot-scope="scope">
        <el-tag  type="warning" :closable="false" effect="plain" size="large" :disable-transitions="false">{{datetime(scope.row.time)}}</el-tag>
        

    </template>
</el-table-column>

<el-table-column label="Name" align="left" :sortable="false" :fixed="false" :width="type_filter === 'comment' ? 200 : undefined">
    <template slot-scope="scope">
        <el-tooltip effect="dark" :content="scope.row.uid" placement="top-start">
         <el-link  type="danger" :href="'https://facebook.com/'+scope.row.uid" target="_blank" :underline="false">{{scope.row.name}}</el-link>
     </el-tooltip>



 </template>
</el-table-column>
<el-table-column label="Comment" v-if="type_filter === 'comment'" align="center" :sortable="false" :fixed="false">
    <template slot-scope="scope">

        {{scope.row.comment}}

    </template>
</el-table-column>
<el-table-column label="Số điện thoại"  align="center" :sortable="false" :fixed="false" width="150">
    <template slot-scope="scope">
        <el-button class="copyy" v-clipboard:success="onCopy" v-clipboard:copy="scope.row.phone" type="success" @click="" icon="" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">{{scope.row.phone}}</el-button>

    </template>
</el-table-column>
</el-table>
<br>
<el-pagination @current-change="RefreshData" v-if="pagination_show" :total="phone_visible ? count_phone : count" :page-size="20" :current-page.sync="pager" :pager-count="11" :hide-on-single-page="false" background layout="prev, pager, next"></el-pagination>
</el-dialog>
<el-dialog title="Check Comment" :visible.sync="check_comment_show" :visible="loading_test ? true : check_comment_show" @close="Load_History" :center="false" :fullscreen="false" top="20vh" width="600px">
    <el-form status-icon label-width="120px" label-position="left" :inline="false" :disabled="false" :inline-message="false" show-message validate-on-rule-change size="medium">
        <el-form-item class="field" label="Nội dung" align="left">
           <el-input type="textarea" spellcheck="false" :rows="2" placeholder="Nhập nội dung ..." v-model="comment"></el-input>
       </el-form-item>
       <el-form-item class="field" label="Đối tượng" align="left">
        <el-radio-group v-model="test_part" size="small">
          <el-radio-button label="all">TẤT CẢ</el-radio-button>
          <el-radio-button label="hide">HIDE COMMENT</el-radio-button>
          <el-radio-button v-if="list_urlscan_remove.length >0" label="post">{{list_urlscan_remove.length}} POST</el-radio-button>
      </el-radio-group>
  </el-form-item>

  <el-form-item class="field" label="Delay Time" align="left">
    <el-tooltip effect="dark" content="Giây" placement="top-start">
        <el-input-number v-model="test_time" size="mini" controls-position="right" :step="5" :min="0" :max="100000000000"></el-input-number>
    </el-tooltip>

</el-form-item>



<br>

<el-form-item calign="center">
    <el-button type="primary" @click="StartTest" icon="el-icon-video-play" :loading="loading_test" :plain="false" :round="false" :circle="false" :autofocus="false" size="small" :disabled="false">Bắt đầu test</el-button>
</el-form-item>

</el-form>
</el-dialog>
</el-tabs>
</template>
<script>

  export default {


    data(){
        return {
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
            active_tab:'b',
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
            reaction_status_id:3,
            list_urlscan_remove:[],
            show_success:false,
            pagination_show:true,
            limit_data:20,
            limit_urlscan:20,
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
            comment_loading:true,
            auto_load_story:false,
            url_id:'',
            uid_today:0,
            comment_today:0,
            delay_time:0,
            loading_count_comment:false,
            list_permission:[],
            type:'',
            keysearch:'',
            keysearch_comment:'',
            rule_type:'default',
            status_filter:undefined,
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
        await this.Load_History();
        await this.UpdateData();

    },
    computed:{
        
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
        }


    },

    methods:{
        onCopy:function(e){
            this.$message({type:'success',message:'Copied !'})
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
    filter_hide_comment:async function(command){
        if(command.value !== undefined){
         this.hide_comment = !command.value;
     }else{

        this.hide_comment = undefined;
    }

    return await this.Load_History();
},
filter_reaction:async function(command){
    this.reaction_status_id = command;
    return await this.Load_History();
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
    this.loading_history = true;
    await this.GetDataURL();
    

    return;
},
GetCountComment24H:async function(url_id){
    let {data} = await this.$axios.post('/api/scanpost/get-count-comment-24h',{url_id});
    return data.count;
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
    if(this.reaction_status_id === 1){
        where.push = {'>':0}
    }else if(this.reaction_status_id === 2){
        where.push = {'<=':0}
    }
    if(this.rule_hour){

        where.last_time = {'>=':parseInt(Date.now()/1000) - (this.rule_hour*3600),'<':parseInt(Date.now()/1000) - this.recent_time}
    }
    let {data} = await this.$axios.get('/api/urlscan',{params:{where,sort:'createdAt DESC',limit:this.limit_urlscan,skip:(this.pager_urlscan - 1)*this.limit_urlscan}});
    this.loading_history = false;


    this.list_history = data.map(e=>{
        e.status = e.log.filter(e=>e.type === 'comment').length > 0;
        e.loading_check_comment = false;
        e.loading_count_comment = true;
        return e;
    })
    let _ = this;
    let map_up = this.list_history.map(async e=>{
        e.count_comment = await _.GetCountComment24H(e.id);
         e.loading_count_comment = false;
        return e;
    });
    return this.list_history = await Promise.all(map_up);


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

    .el-table .row_success {
        background: #154e15;
    }
    .el-table .row_warning {
        background: #8b7232;
    }

    .el-table .row_danger:hover > td {
       background-color: initial !important;
   }

   .el-table .row_success:hover > td {
       background-color: initial !important;
   }
   .el-table .row_warning:hover > td {
       background-color: initial !important;
   }
   .copyy:hover{
    cursor: pointer;
}
</style>

