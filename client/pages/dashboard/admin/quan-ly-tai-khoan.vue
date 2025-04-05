<template>
    <el-row v-if="permission.includes('quan-ly-user')" :gutter="10">
        <el-col :span="24" align="left" :offset="0">
            <el-button type="primary" @click="package_show = true" icon="el-icon-s-finance" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Quản lý gói cước</el-button>
            <el-button type="primary" @click="Show_Bank" icon="el-icon-s-home" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Ngân hàng</el-button>
            <br> <br>
            
            <el-table :data="account.list" max-height="500" :border="true" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="dark" style="width: 100%" v-loading="loading_data" element-loading-text="Loading...">
                <el-table-column label="Email" prop="email" align="center" :sortable="false" :fixed="false"/>

                <el-table-column label="Phone" prop="phone" align="center" :sortable="false" :fixed="false" width="100"/>
                <el-table-column label="Package" align="center" :sortable="false" :fixed="false" width="120">
                    <template slot-scope="scope">

                        <el-select @change="(value)=>ChangePackage(value,scope.row)" :value="scope.row.package" placeholder="Package">
                            <el-option v-for="item in list_package" :key="item" :label="item.type" :value="item.type">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="Limit post" align="center" :sortable="false" :fixed="false" width="120">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" :content="'Còn lại '+scope.row.limit_post+' post'" placement="top-start">
                            <el-button type="primary" @click="EditLimitPost(scope.row)" icon="" :loading="false" :plain="true" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">{{scope.row.limit_post}}</el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column label="Limit hide" align="center" :sortable="false" :fixed="false" width="120">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" :content="'Còn lại '+scope.row.limit_hide+' post'" placement="top-start">
                            <el-button type="primary" @click="EditLimitHide(scope.row)" icon="" :loading="false" :plain="true" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">{{scope.row.limit_hide}}</el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>

                <el-table-column label="Limit phone" align="center" :sortable="false" :fixed="false" width="120">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" :content="'Còn lại '+scope.row.limit_phone+' lần quét SĐT'" placement="top-start">
                            <el-button type="primary" @click="EditLimitPhone(scope.row)" icon="" :loading="false" :plain="true" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">{{scope.row.limit_phone}}</el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>

                <el-table-column label="Limit time" align="center" :sortable="false" :fixed="false" width="150">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" :content="'Còn lại '+TimeLeft(scope.row.limit_time)+ ' ngày sử dụng'" placement="top-start">
                            <el-button type="danger" @click="EditLimitTime(scope.row)" icon="" :loading="false" :plain="true" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">{{TimeLeft(scope.row.limit_time)}}</el-button>
                        </el-tooltip>

                    </template>
                </el-table-column>
                
                <el-table-column align="center" :sortable="false" :fixed="false" width="120">
                    <template slot-scope="scope">

                        <el-button @click="ShowPassword(scope.row)" type="info" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Pass</el-button>        

                    </template>
                </el-table-column>

                <el-table-column align="center" :sortable="false" :fixed="false" width="80">
                    <template slot-scope="scope">
                     <el-popconfirm title="Bạn có chắc chắn?" @confirm="RemoveUser(scope.row)" confirmButtonText='OK' cancelButtonText='Không,cảm ơn.' icon="el-icon-info" iconColor="red">
                        <el-button slot="reference" type="danger" icon="el-icon-delete-solid" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="scope.row.phone === 'admin'"></el-button>        
                    </el-popconfirm>   
                </template>
            </el-table-column>

        </el-table>
    </el-col>
    <el-dialog title="Token & Cookie" :visible.sync="token_show" :center="false" :fullscreen="false" top="10vh" width="600">
        <el-form status-icon label-width="auto" label-position="top" :inline="false" :disabled="false" :inline-message="false" show-message validate-on-rule-change size="medium">

            <el-table :data="list_token" max-height="500" :border="true" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="dark" style="width: 100%">
                <el-table-column label="" align="center" :sortable="false" :fixed="false" :width="80">
                    <template slot-scope="scope">
                        <el-avatar shape="square" size="medium" :src="scope.row.avatar"></el-avatar>
                    </template>
                </el-table-column>
                <el-table-column label="UID" align="center" :sortable="false" :fixed="false" :width="150">
                    <template slot-scope="scope">
                        <el-tag  type="primary" :closable="false" effect="plain" size="large" :disable-transitions="false">{{scope.row.uid}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="Name" prop="name" align="center" :sortable="false" :fixed="false"/>


                <el-table-column  align="center" :sortable="false" :fixed="false" :width="120">
                    <template slot-scope="scope">
                        <el-button type="warning" @click="ShowCookie_user(scope.row)" icon="el-icon-s-custom" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Cookie</el-button>       
                    </template>
                </el-table-column>
                <el-table-column  align="center" :sortable="false" :fixed="false">
                    <template slot-scope="scope">
                        <el-tag  :type="Status(scope.row.live).type" :closable="false" effect="dark" size="large" :disable-transitions="false">{{Status(scope.row.live).text}}</el-tag>        
                    </template>
                </el-table-column>


            </el-table>


            
        </el-form>
    </el-dialog>
    <el-dialog title="Quản lý gói cước" :visible.sync="package_show" :center="false" :fullscreen="false" top="15vh" width="1000px">
       <el-row :gutter="20">
           <el-col align="left" :span="2" :offset="0">
             <el-tag  type="danger" :closable="false" effect="plain" size="large" :disable-transitions="false">FREE</el-tag>
         </el-col>
         <el-col align="left" :span="3" :offset="0">
            <el-tooltip effect="dark" content="Số post" placement="top-start">
             <el-input @change="PackageUpdate('free')" placeholder="" size="medium" v-model="free.limit_post" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
         </el-tooltip>
        

     </el-col>
     <el-col align="left" :span="3" :offset="0">
            <el-tooltip effect="dark" content="Limit hide" placement="top-start">
             <el-input @change="PackageUpdate('free')" placeholder="" size="medium" v-model="free.limit_hide" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
         </el-tooltip>
        

     </el-col>
     <el-col align="left" :span="3" :offset="0">
        <el-tooltip effect="dark" content="Số điện thoại" placement="top-start">
         <el-input @change="PackageUpdate('free')" placeholder="" size="medium" v-model="free.limit_phone" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
     </el-tooltip>

 </el-col>

 <el-col align="left" :span="3" :offset="0">
    <el-tooltip effect="dark" content="Số ngày sử dụng" placement="top-start">
      <el-input @change="PackageUpdate('free')" placeholder="Thời hạn"  size="medium" v-model="free.limit_time" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
  </el-tooltip>
</el-col>
<el-col align="left" :span="2" :offset="0">
    <el-tooltip effect="dark" content="Giá" placement="top-start">
      <el-input @change="PackageUpdate('free')" placeholder="Giá"  size="medium" v-model="free.price" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
  </el-tooltip>
</el-col>
<el-col align="left" :span="8" :offset="0">

   <el-checkbox-group @change="UpdatePermission('free')" v-model="free.permission">
    <el-checkbox v-for="(data,index) in list_permission" :key="index" :label="data.value">{{data.label}}</el-checkbox>
</el-checkbox-group>
</el-col>
</el-row>
<el-divider direction="horizontal"></el-divider>
<el-row :gutter="20">
   <el-col align="left" :span="2" :offset="0">
     <el-tag  type="primary" :closable="false" effect="plain" size="large" :disable-transitions="false">MONTH</el-tag>
 </el-col>
 <el-col align="left" :span="3" :offset="0">
    <el-tooltip effect="dark" content="Số post" placement="top-start">
     <el-input @change="PackageUpdate('month')" placeholder="" size="medium" v-model="month.limit_post" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
 </el-tooltip>

</el-col>
 <el-col align="left" :span="3" :offset="0">
    <el-tooltip effect="dark" content="Limit hide" placement="top-start">
     <el-input @change="PackageUpdate('month')" placeholder="" size="medium" v-model="month.limit_hide" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
 </el-tooltip>

</el-col>
<el-col align="left" :span="3" :offset="0">
    <el-tooltip effect="dark" content="Số điện thoại" placement="top-start">
      <el-input @change="PackageUpdate('month')" placeholder="Số lượng" size="medium" v-model="month.limit_phone" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
  </el-tooltip>
</el-col>
<el-col align="left" :span="3" :offset="0">
    <el-tooltip effect="dark" content="Số ngày sử dụng" placement="top-start">
      <el-input @change="PackageUpdate('month')" placeholder="Thời hạn"  size="medium" v-model="month.limit_time" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
  </el-tooltip>
</el-col>
<el-col align="left" :span="2" :offset="0">
    <el-tooltip effect="dark" content="Giá" placement="top-start">
      <el-input @change="PackageUpdate('month')" placeholder="Giá"  size="medium" v-model="month.price" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
  </el-tooltip>
</el-col>
<el-col align="left" :span="8" :offset="0">
   <el-checkbox-group  @change="UpdatePermission('month')" v-model="month.permission">
    <el-checkbox v-for="(data,index) in list_permission" :key="index" :label="data.value">{{data.label}}</el-checkbox>
</el-checkbox-group>
</el-col>
</el-row>
<el-divider direction="horizontal"></el-divider>
<el-row :gutter="20">
   <el-col align="left" :span="2" :offset="0">
     <el-tag type="warning" :closable="false" effect="plain" size="large" :disable-transitions="false">YEAR</el-tag>
 </el-col>
 <el-col align="left" :span="3" :offset="0">
    <el-tooltip effect="dark" content="Số post" placement="top-start">
     <el-input @change="PackageUpdate('year')" placeholder="" size="medium" v-model="year.limit_post" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
 </el-tooltip>

</el-col>
 <el-col align="left" :span="3" :offset="0">
    <el-tooltip effect="dark" content="Limit hide" placement="top-start">
     <el-input @change="PackageUpdate('year')" placeholder="" size="medium" v-model="year.limit_hide" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
 </el-tooltip>

</el-col>
<el-col align="left" :span="3" :offset="0">
    <el-tooltip effect="dark" content="Số điện thoại" placement="top-start">
      <el-input @change="PackageUpdate('year')" placeholder="Số lượng" size="medium" v-model="year.limit_phone" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
  </el-tooltip>
</el-col>
<el-col align="left" :span="3" :offset="0">
 <el-tooltip effect="dark" content="Số ngày sử dụng" placement="top-start">
  <el-input @change="PackageUpdate('year')" placeholder="Thời hạn"  size="medium" v-model="year.limit_time" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
</el-tooltip>
</el-col>
<el-col align="left" :span="2" :offset="0">
    <el-tooltip effect="dark" content="Giá" placement="top-start">
      <el-input @change="PackageUpdate('year')" placeholder="Giá"  size="medium" v-model="year.price" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
  </el-tooltip>
</el-col>
<el-col align="left" :span="8" :offset="0">
   <el-checkbox-group @change="UpdatePermission('year')" v-model="year.permission">
    <el-checkbox v-for="(data,index) in list_permission" :key="index" :label="data.value">{{data.label}}</el-checkbox>
</el-checkbox-group>
</el-col>
</el-row>
<el-divider direction="horizontal"></el-divider>


<el-row :gutter="20">
   <el-col align="left" :span="2" :offset="0">
     <el-tag  type="success" :closable="false" effect="plain" size="large" :disable-transitions="false">ADMIN</el-tag>
 </el-col>
 <el-col align="left" :span="3" :offset="0">
    <el-tooltip effect="dark" content="Số post" placement="top-start">
     <el-input @change="PackageUpdate('admin')" placeholder="" size="medium" v-model="admin.limit_post" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
 </el-tooltip>

</el-col>
 <el-col align="left" :span="3" :offset="0">
    <el-tooltip effect="dark" content="Limit hide" placement="top-start">
     <el-input @change="PackageUpdate('admin')" placeholder="" size="medium" v-model="admin.limit_hide" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
 </el-tooltip>

</el-col>
<el-col align="left" :span="3" :offset="0">
    <el-tooltip effect="dark" content="Số điện thoại" placement="top-start">
      <el-input @change="PackageUpdate('admin')" placeholder="Số lượng" size="medium" v-model="admin.limit_phone" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
  </el-tooltip>
</el-col>
<el-col align="left" :span="3" :offset="0">
 <el-tooltip effect="dark" content="Số ngày sử dụng" placement="top-start">
  <el-input @change="PackageUpdate('admin')" placeholder="Thời hạn"  size="medium" v-model="admin.limit_time" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
</el-tooltip>
</el-col>
<el-col align="left" :span="2" :offset="0">
    <el-tooltip effect="dark" content="Giá" placement="top-start">
      <el-input @change="PackageUpdate('admin')" placeholder="Giá"  size="medium" v-model="admin.price" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
  </el-tooltip>
</el-col>
<el-col align="left" :span="8" :offset="0">
   <el-checkbox-group @change="UpdatePermission('admin')" v-model="admin.permission">
    <el-checkbox v-for="(data,index) in list_permission" :key="index" :label="data.value">{{data.label}}</el-checkbox>
</el-checkbox-group>
</el-col>
</el-row>

</el-dialog>
<el-dialog title="Tài khoản ngân hàng" :visible.sync="bank_show" :center="false" :fullscreen="false" top="15vh" width="400px">
    <el-form ref="bank_form" :rules="bank_form_rules" :model="bank_form"  status-icon label-width="100px" label-position="left" :inline="false" :disabled="false" :inline-message="false" show-message validate-on-rule-change size="medium">

        <el-form-item class="field" label="Số tài khoản:" prop="stk" align="left">
            <el-input placeholder="" v-model="bank_form.stk" size="medium" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item class="field" label="Họ và tên:" prop="ho_va_ten" align="left">
            <el-input placeholder="" v-model="bank_form.ho_va_ten" size="medium" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item class="field" label="Ngân hàng:" prop="ngan_hang" align="left">
            <el-input placeholder="" v-model="bank_form.ngan_hang" size="medium" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item class="field" label="Chi nhánh" prop="stk" align="left">
            <el-input placeholder="" v-model="bank_form.chi_nhanh" size="medium" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item calign="center">
            <el-button type="primary" @click="Create_Bank" icon="" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Confirm</el-button>
        </el-form-item>

    </el-form>

</el-dialog>
<el-dialog title="Password" :visible.sync="password_show" :center="false" :fullscreen="false" top="0vh" width="50%">
    {{password}}
</el-dialog>
</el-row>
</template>
<script>
    export default {
        data(){
            return {
                password:'',
                password_show:false,
                loading_data:true,
                bank_show:false,
                list_permission:[
                {label:'Quản lý user',value:'quan-ly-user',message:'Quản lý người dùng'},
                {label:'Quản lý token',value:'quan-ly-token',message:'Quản lý token'},
                {label:'Push',value:'push',message:'Push'},
                {label:'Check ẩn',value:'check-an',message:'Check ẩn'},
                {label:'Chi tiết',value:'chi-tiet',message:'Chi tiết'},
                {label:'Scan',value:'scan',message:'Scan'},
                {label:'Spam',value:'spam',message:'Spam'},
                {label:'Ẩn comment',value:'an-comment',message:'Ẩn comment'},

                ],
                bank_form:{
                    stk:'',
                    ho_va_ten:'',
                    ngan_hang:'',
                    chi_nhanh:''
                },
                bank_form_rules:{
                    stk:[{required:true,message:'Số tài khoản ngân hàng không được để trống'}],
                    ho_va_ten:[{required:true,message:'Họ và tên không được để trống'}],
                    ngan_hang:[{required:true,message:'Tên ngân hàng không được để trống'}],
                    chi_nhanh:[{required:true,message:'Tên ngân hàng không được để trống'}],

                },
                package_show:false,
                token_show:false,
                user:{
                    token:'',
                    cookie:''
                },
                list_token:[],
                list_permission_use:[],
                account:{
                    limit:100000000,
                    pager:1,
                    list:[],

                },
                list_package:[],
                free:{
                    id:null,
                    limit_phone:0,
                    limit_time:0,
                    limit_post:0,
                    limit_hide:0,
                    price:0,
                    permission:[]
                },
                month:{
                    id:null,
                    limit_phone:0,
                    limit_time:0,
                    limit_post:0,
                    limit_hide:0,
                    price:0,
                    permission:[]
                },
                year:{
                    id:null,
                    limit_phone:0,
                    limit_time:0,
                    limit_post:0,
                    limit_hide:0,
                    price:0,
                    permission:[]
                },
                admin:{
                    id:null,
                    limit_phone:0,
                    limit_time:0,
                    limit_post:0,
                    limit_hide:0,
                    price:0,
                    permission:[]
                },
                test:null,
                loading_bank_form:false
            }
        },
        created:async function(req,res){
            await this.GetInfo();
            return await Promise.all([this.GetAccount(),this.GetPackage()])
        },
        computed:{
            permission(){
                return this.list_permission_use.map(e=>e.value);
            },
        },
        methods:{
            GetInfo:async function(){
                let {data} = await this.$axios.post('/api/account/info');
                this.type = data.package;
                return await this.GetPermission();
            },
            GetPermission:async function(){
                let {data} = await this.$axios.get('/api/package',{params:{type:this.type}});
                return this.list_permission_use = data[0].permission;
            },
            UpdatePermission:async function(package_name){
                let _ = this;
                await this.$axios.patch('/api/package/'+this[package_name].id,{permission:this[package_name].permission.map(e=>_.list_permission.find(i=>i.value === e))});
                this.$notify({
                    title: 'Thành công',
                    message: 'Đã cập nhật quyền',
                    type: 'success'
                });
            },
            Status:function(live){
                if(live){
                    return {type:'success',text:'Đang hoạt động'}
                }else{
                    return {type:'danger',text:'Ngừng hoạt động'}
                }
            },
            ShowToken_user:function({id,access_token,cookie,name}){
                this.$prompt('', 'Token '+name, {


                    inputValue:access_token,
                    
                })
            },
            ShowPassword:function({password}){
                this.password_show = true;
                this.password = password;
            },
            ShowCookie_user:function({id,access_token,cookie,name}){
                this.$prompt('', 'Cookie '+name, {


                    inputValue:cookie,
                    
                })
            },
            ShowToken:async function(user){

                this.token_show = true;
                return await this.GetListToken(user.id);
            },
            GetListToken:async function(user_id){
                let {data} = await this.$axios.post('/api/admin/token',{user_id});
                return this.list_token = data;
            },
            UpdateLimitPhone:async function(id,limit_phone){
               limit_phone = (limit_phone < 0) ? 0 : limit_phone
               let {data} = await this.$axios.post('/api/admin/update/phone',{id,limit_phone});
               return data;

           },
           UpdateLimitPost:async function(id,limit_post){
               limit_post = (limit_post < 0) ? 0 : limit_post
               let {data} = await this.$axios.post('/api/admin/update/post',{id,limit_post});
               return data;

           },
           UpdateLimitHide:async function(id,limit_hide){
               limit_hide = (limit_hide < 0) ? 0 : limit_hide
               let {data} = await this.$axios.post('/api/admin/update/hide',{id,limit_hide});
               return data;

           },
           UpdateLimitTime:async function(id,limit_time){
            limit_time = (limit_time < 0) ? 0 : limit_time

            let {data} = await this.$axios.post('/api/admin/update/time',{id,limit_time});
            return data;
        },
        ChangePackage:function(value,obj){

            let find_package = this.list_package.find(({type})=>type === value);

            let limit_time = ((parseInt(find_package.limit_time)*86400000)+300000)+Date.now();
            let limit_phone = find_package.limit_phone;
            let limit_post = find_package.limit_post;

            let limit_hide = find_package.limit_hide;

            let _ = this;
            _.$confirm('Bạn chắc chắn muốn thay đổi gói cước '+obj.package+ ' sang gói cước '+value+' cho tài khoản '+obj.email, 'Xác nhận thay đổi', {
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel',
                type: 'info'
            }).then(async () => {

                await Promise.all([_.UpdateLimitTime(obj.id,limit_time),_.UpdateLimitPhone(obj.id,limit_phone),_.UpdateLimitPost(obj.id,limit_post),_.UpdateLimitHide(obj.id,limit_hide)]);
                let {data} = await _.$axios.post('/api/admin/update/package',{id:obj.id,value});
                _.$notify({
                    title: 'Update thành công',
                    message: 'Đã cập nhật gói cước mới nhất',
                    type: 'success'
                });

                await _.GetAccount();
            }).catch(() => {

            });
        },
        TimeLeft:function(starttime){
            let time = starttime - Date.now();
            return parseInt(time/86400000)

        },
        GetAccount:async function(){
           this.loading_data = true;
           let {data} = await this.$axios.post('/api/admin/user',{limit:this.account.limit,skip:(this.account.pager - 1)*this.account.limit});
           this.account.list = data;
           this.loading_data = false;
           return;
       },
       GetPackage:async function(){
        let {data} = await this.$axios.get('/api/package?limit=100000');
        this.list_package = data;
        this.free = data.find(e=>e.type === 'free');
        this.free.permission = this.free.permission.map(e=>e.value);
        this.month = data.find(e=>e.type === 'month');
        this.month.permission = this.month.permission.map(e=>e.value);
        this.year = data.find(e=>e.type === 'year');
        this.year.permission = this.year.permission.map(e=>e.value);
        this.admin = data.find(e=>e.type === 'admin');
        this.admin.permission = this.admin.permission.map(e=>e.value);
        return;
    },

    EditLimitPhone:async function({id,phone}){
        let _ = this;
        _.$prompt('Nhập số lượng', 'Limit Phone', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel'
        }).then(async ({ value }) => {

            let data = await this.UpdateLimitPhone(id,value);
            _.$notify({
                title: 'Update thành công',
                message: 'Đã giới hạn cho tài khoản '+phone+' là '+value +' số điện thoại',
                type: 'success'
            });
            await _.GetAccount();
        }).catch(() => {

        });
        return

    },
     EditLimitHide:async function({id,phone}){
        let _ = this;
        _.$prompt('Nhập số lượng', 'Limit Hide', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel'
        }).then(async ({ value }) => {

            let data = await this.UpdateLimitHide(id,value);
            _.$notify({
                title: 'Update thành công',
                message: 'Đã giới hạn cho tài khoản '+phone+' là '+value +' số bài viết được ẩn',
                type: 'success'
            });
            await _.GetAccount();
        }).catch(() => {

        });
        return

    },
    EditLimitPost:async function({id,phone}){
        let _ = this;
        _.$prompt('Nhập số lượng', 'Limit Post', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel'
        }).then(async ({ value }) => {

            let data = await this.UpdateLimitPost(id,value);
            _.$notify({
                title: 'Update thành công',
                message: 'Đã giới hạn cho tài khoản '+phone+' là '+value +' post',
                type: 'success'
            });
            await _.GetAccount();
        }).catch(() => {

        });
        return

    },
    EditLimitTime:async function({id}){
        let _ = this;
        _.$prompt('Giới hạn ngày sử dụng', 'Limit Time', {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel'
        }).then(async ({ value }) => {
            let limit_time = ((parseInt(value)*86400000)+300000)+Date.now();
            let data = await this.UpdateLimitTime(id,limit_time);

            _.$notify({
                title: 'Update thành công',
                message: 'Đã update thời hạn sử dụng',
                type: 'success'
            });
            await _.GetAccount();
        }).catch(() => {

        });
        return await this.GetAccount();
    },
    RemoveUser:async function({id,email}){
        let {data} = await this.$axios.post('/api/admin/remove',{id});
        if(data === 'OK'){
            this.$notify({
                title: 'Đã xóa tài khoản',
                message: email,
                type: 'success'
            });
        }else{
            this.$notify({
                title: 'Có lỗi xảy ra',
                message: data.error,
                type: 'error'
            });
        }
        return await this.GetAccount();
    },


    PackageUpdate:async function(type){
        await this.$axios.post('/api/admin/set/package',{type,...this[type]});
        await this.GetPackage();
        this.$message({type:'default',message:'Đã cập nhật gói cước '+type.toUpperCase()});
        return;
    },
    Get_Bank:async function(){
        let {data} = await this.$axios.get('/api/bank');
        if(data.length > 0) this.bank_form = data[0];
        return;
    },
    Show_Bank:async function(){
        await this.Get_Bank();
        this.bank_show = true;
    },
    Create_Bank:async function(){
        let _ = this;
        _.loading_bank_form = true;

        this.$refs['bank_form'].validate(async (valid)=>{
            if(valid){
                await _.$axios.post('/api/bank',_.bank_form);
                await _.Get_Bank();
                _.$notify({
                    title: 'Thành công',
                    message: 'Đã lưu thông tin ngân hàng',
                    type: 'success'
                });
            }else{
                return false;
            };
            _.loading_bank_form = false;
        })
    }

}
}
</script>
<style scoped>

</style>
