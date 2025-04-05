<template>

   <el-tabs @tab-click="ChangeTab" v-model="active_tab" type="border-card">
    <el-tab-pane label="Facebook" name="facebook">
        <el-row>
            <el-col :span="24" :offset="0">
                <el-input spellcheck="false" type="textarea" :rows="4" placeholder="Nhập cookie ..." v-model="cookie_facebook"></el-input>
            </el-col>
        </el-row>
        <br>
        <el-row>
            <el-col :span="24" :offset="0">
                <el-input placeholder="Mã ứng dụng OTP ( Nếu sử dụng bảo mật 2 lớp Google authenticator)" v-model="otp" size="medium" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
            </el-col>
        </el-row>
        <br>
        <el-row :gutter="20">
            <el-col align="left" :span="24" :offset="0">
                <el-button type="primary" @click="ImportToken" icon="" :loading="loading_import" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Confirm</el-button>
                
                <el-popconfirm title="Bạn có chắc chắn?" @confirm="RemoveFacebook" confirmButtonText='OK' cancelButtonText='Không,cảm ơn.' icon="el-icon-info" iconColor="red">
                   <el-button  slot="reference" type="danger" v-show="list_facebook_selection.length > 0" icon="el-icon-delete-solid" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Xóa {{list_facebook_selection.length}} FB</el-button>
               </el-popconfirm>
           </el-col>
       </el-row>

       <br>



       <el-dialog title="Token BM" @close="token_bm_view_visible = false" :visible.sync="token_bm_view_visible" :center="false" :fullscreen="false" top="30vh" width="50%">
         <el-input :value="token_fb" size="medium" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
     </el-dialog>

     <el-dialog title="Cookie" @close="cookie_view_visible = false" :visible.sync="cookie_view_visible" :center="false" :fullscreen="false" top="30vh" width="50%">
         <el-input :value="cookie_fb" size="medium" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
     </el-dialog>
     
     <el-table :data="list_cookie" @selection-change="handleSelectionChangeFacebook" :border="true" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="light" style="width: 100%">
         <el-table-column align="center" type="selection" width="55"></el-table-column>


         <el-table-column label="Name" align="center" :sortable="false" :fixed="false">
             <template slot-scope="scope">
                 <el-link :href="'https://facebook.com/'+scope.row.uid" target="_blank" :underline="false">{{scope.row.name}}</el-link>
             </template>
         </el-table-column>

         <el-table-column label="Cookie" align="center" :sortable="false" :fixed="false">
             <template slot-scope="scope">
                 <el-button type="primary" @click="OpenCookie(scope.row)" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Cookie</el-button>
             </template>
         </el-table-column>

         <el-table-column label="Token" align="center" :sortable="false" :fixed="false">
             <template slot-scope="scope">
                 <el-button type="warning" @click="OpenToken(scope.row)" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Token</el-button>
             </template>
         </el-table-column>
         <el-table-column label="Status" align="center" :sortable="false" :fixed="false">
             <template slot-scope="scope">
                <el-tag v-if="scope.row.live && !scope.row.loading_check" type="success" :closable="false" effect="dark" size="small" :disable-transitions="false">Live</el-tag>
                <el-tag v-if="!scope.row.live && !scope.row.loading_check" type="danger" :closable="false" effect="dark" size="small" :disable-transitions="false">Die</el-tag>
                <i v-if="scope.row.loading_check" class="el-icon-loading"></i>
            </template>
        </el-table-column>

        <el-table-column align="center" :sortable="false" :fixed="false" width="120">
         <template slot-scope="scope">
             <el-popconfirm title="Bạn có chắc chắn?" @confirm="RemoveCookie(scope.row)" confirmButtonText='OK' cancelButtonText='Không,cảm ơn.' icon="el-icon-info" iconColor="red">
                 <el-button slot="reference" type="danger" icon="el-icon-delete-solid" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false"></el-button>        
             </el-popconfirm>   
         </template>
     </el-table-column>

 </el-table>


</el-tab-pane>
<el-tab-pane label="Zalo" name="zalo">
    <el-row>
        <el-col :span="24" :offset="0">
            <el-input spellcheck="false" type="textarea" :rows="4" placeholder="Nhập cookie ..." v-model="cookie_zalo"></el-input>
            
            
        </el-col>
    </el-row>
    <br>
    <el-row>
        <el-col :span="24" :offset="0">
           <el-input spellcheck="false" placeholder="Nhập Imei (Bắt buộc)" v-model="imei" size="medium" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
           
       </el-col>
   </el-row>
   <br>
   <el-row :gutter="20">
    <el-col align="left" :span="24" :offset="0">
        <el-button type="primary" @click="ImportCookieZalo" icon="" :loading="loading_import_zalo" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Confirm</el-button>
        <el-popconfirm title="Bạn có chắc chắn?" @confirm="RemoveZalo" confirmButtonText='OK' cancelButtonText='Không,cảm ơn.' icon="el-icon-info" iconColor="red">
           <el-button  slot="reference" type="danger" v-show="list_zalo_selection.length > 0" icon="el-icon-delete-solid" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Xóa {{list_zalo_selection.length}} zalo</el-button>
       </el-popconfirm>
       
       
   </el-col>
</el-row>
<br>
<el-table :data="list_cookie_zalo" ref="table_zalo" @selection-change="handleSelectionChangeZalo" :border="true" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="light" style="width: 100%">
    <el-table-column align="center" type="selection" width="55"></el-table-column>  
    <el-table-column align="center" :sortable="false" :fixed="false" width="240">
        <template slot-scope="scope">
            <el-tag  type="success" v-if="scope.row.live && !scope.row.loading_check" :closable="false" effect="dark" size="small" :disable-transitions="true">Live</el-tag>
            <el-tag  type="danger" v-if="!scope.row.live && !scope.row.loading_check" :closable="false" effect="dark" size="small" :disable-transitions="true">Die</el-tag>
            <i class="el-icon-loading" v-if="scope.row.loading_check"></i>

        </template>
    </el-table-column>
    <el-table-column align="center" :sortable="false" :fixed="false" width="240">
        <template slot-scope="scope">
            <el-avatar shape="square" :size="32" :src="scope.row.avatar"></el-avatar>    
        </template>
    </el-table-column>

    <el-table-column align="center" label="Name" prop="name" :sortable="false" :fixed="false"/>
    

    
</el-table>
</el-tab-pane>
</el-tabs>

</template>
<script>
    export default {
        data(){
            return {
                loading_import_zalo:false,
                cookie_zalo:'',
                cookie_facebook:'',
                active_tab:'facebook',
                cookie_fb:'',
                token_fb:'',
                list_cookie:[],
                list_cookie_zalo:[],
                imei:'',
                token_bm_view_visible:false,
                cookie_view_visible:false,
                loading_import:false,
                otp:'',
                loading_refresh:false,
                live:true,
                list_zalo_selection:[],
                list_facebook_selection:[],

            }
        },
        
        created:async function(){
            return await this.ChangeTab();
        },
        methods:{
            handleSelectionChangeFacebook:async function(val){
                return this.list_facebook_selection = val;
            },
            handleSelectionChangeZalo:async function(val){
                return this.list_zalo_selection = val;
            },
            RemoveZalo:async function(){
                for(let e of this.list_zalo_selection){
                    await this.$axios.delete('/api/zaloaccount/'+e.id);
                    this.list_cookie_zalo.splice(this.list_cookie_zalo.indexOf(e),1)
                }
            },
            RemoveFacebook:async function(){
                for(let e of this.list_facebook_selection){
                    await this.$axios.delete('/api/cookieuser/'+e.id);
                    this.list_cookie.splice(this.list_cookie.indexOf(e),1)
                }
            },
            ImportCookieZalo:async function(){
                try{
                    this.loading_import_zalo = true;
                    if(this.cookie_zalo.trim().length === 0) throw 'Cookie ZALO không được bỏ trống';
                    if(this.imei.trim().length === 0) throw 'Imei ZALO không được bỏ trống';

                    let {data} = await this.$axios.post('/api/zalo/import',{cookie:this.cookie_zalo,imei:this.imei});
                    if(data.error) throw data.error;
                    this.list_cookie_zalo.unshift(data);
                    this.cookie_zalo = '';
                    this.imei = '';
                    this.$notify({
                        title: 'Success',
                        message: 'Thêm tài khoản zalo thành công.',
                        type: 'success'
                    });
                }catch(error){
                    this.$notify({
                        title: 'Alert',
                        message: error,
                        type: 'error'
                    });
                }
                this.loading_import_zalo = false;
            },

            ChangeTab:async function(){
             if(this.active_tab === 'facebook'){
                await this.GetCookieListFB();
                await this.CheckCookieFacebook();
            }else{
                await this.GetCookieListZALO();
                await this.CheckCookieZalo();
            }
            return;
        },
        CheckCookieZalo:async function(){
         
            for(let e of this.list_cookie_zalo){
             let {data} = await this.$axios.post('/api/zalo/check',{zalo_id:e.id});
             
             this.list_cookie_zalo = this.list_cookie_zalo.map(m=>{
                if(m.id === e.id){
                    m.loading_check = false;
                    m.live = data.live
                }
                return m;
            })
             
         }
     },
     CheckCookieFacebook:async function(){
        for(let e of this.list_cookie){
         let {data} = await this.$axios.post('/api/tokenuser/check',{cookieuser_id:e.id});
         
         this.list_cookie = this.list_cookie.map(m=>{
            if(m.id === e.id){
                m.loading_check = false;
                m.live = data.live
            }
            return m;
        })
         
     }
 },
 OpenCookie:function({cookie}){
    this.cookie_view_visible = true;
    this.cookie_fb = cookie;
    return;
},
OpenToken:function({token_bm}){
    this.token_bm_view_visible = true;
    this.token_fb = token_bm;

},

RemoveCookie:async function(e){
  await this.$axios.delete('/api/cookieuser/'+e.id);
  this.list_cookie.splice(this.list_cookie.indexOf(e),1)
},

Open_Link:function(url){
    return window.open(url, '_blank').focus();
},
GetCookieListFB:async function(){
    let {data} = await this.$axios.get('/api/cookieuser?limit=100000000000');
    return this.list_cookie = data;
},
GetCookieListZALO:async function(){
    let {data} = await this.$axios.get('/api/zaloaccount?limit=100000000000');
    return this.list_cookie_zalo = data.map(e=>({...e,loading_check:true}));
},

ImportToken:async function(){
 this.loading_token = true;
 this.loading_import = true;
 let {data} = await this.$axios.post('/api/tokenuser/import',{cookie:this.cookie_facebook,otp:this.otp});
 this.loading_import = false;
 if(data.error){
    return this.$message({type:'error',message:data.error});
}else{
    this.cookie_facebook = '';
    this.otp = '';
    this.$message({type:'success',message:'Import thành công.'})
    await this.GetCookieListFB();

    this.loading_token = false;
    return;
}
},

Refresh_Cookie:async function(e){
 this.loading_token = true;
 this.loading_refresh = true;
 let {data} = await this.$axios.post('/api/tokenuser/refresh-cookie',{id:e.id});
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
await this.GetCookieListFB();

this.loading_refresh = false;
this.loading_token = false;
return;

}
}
}
</script>
