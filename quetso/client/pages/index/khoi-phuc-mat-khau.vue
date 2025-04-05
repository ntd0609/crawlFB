<template>
    <el-row :gutter="0" style="margin-top: 50px;">
        <el-col :span="6" :offset="9">
            <el-form ref="reset_form" :rules="reset_form_rules" :model="reset_form"  status-icon label-width="auto" label-position="top" :inline="false" :disabled="false" :inline-message="false" show-message validate-on-rule-change size="medium">
            
                <el-form-item class="field" label="Email:" prop="email" align="left">
                    <el-input placeholder="" v-model="reset_form.email" size="medium" clearable type="text" :autosize="false" :disabled="true" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item class="field" label="Mật khẩu:" prop="password" align="left">
                    <el-input placeholder="" v-model="reset_form.password" size="medium" clearable type="password" :autosize="false" :disabled="false" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item class="field" label="Nhập lại mật khẩu:" prop="re_password" align="left">
                    <el-input placeholder="" v-model="reset_form.re_password" size="medium" clearable type="password" :autosize="false" :disabled="false" autocomplete="off"></el-input>
                </el-form-item>
            
                <el-form-item align="center">
                    <el-button type="primary" @click="Reset" icon="" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="small" :disabled="false">Xác nhận</el-button>
                </el-form-item>
                
            </el-form>
        </el-col>
    </el-row>
</template>
<script>
    export default {
        data(){
            return {
                reset_form:{
                	email:'',
                	password:'',
                	re_password:'',
                	key:''
                },
                reset_form_rules:{
                	email:[{required:true,message:'Trường email bị thiếu'}],
                	password:[{required:true,message:'Cần nhập mật khẩu'}],
                	re_password:[{required:true,message:'Cần nhập lại mật khẩu'}]
                },
                loading_reset_form:false

            }
        },
        created:async function(req,res){
            return await Promise.all([this.GetInfo()])
        },
        methods:{
            GetInfo:async function(){
            	let {data} = await this.$axios.post('/api/user/reset/info',{key:this.$route.query.key});
            	this.reset_form.email = data.email;
            	this.reset_form.key = this.$route.query.key;
            	return;

            },
            Reset:async function(){
            	let _ = this;
            	 _.loading = true;
            	        
            	this.$refs['reset_form'].validate(async (valid)=>{
            	    if(valid){
            	    	if(_.password !== _.re_password){
            	    		 _.$message({type:'error',message:'Mhập lại mật khẩu không khớp nhau'})
            	    	}else{
            	    		let {data} = await _.$axios.post('/api/user/reset/new-password',_.reset_form);
            	    		if(data.error){
            	    			_.$notify({
            	    			    title: 'Có lỗi xảy ra',
            	    			    message: data.error,
            	    			    type: 'error'
            	    			});
            	    		}else{
            	    			_.$confirm('Bạn đã thay đổi mật khẩu thành công', 'Xin chúc mừng', {
            	    			    confirmButtonText: 'OK',
            	    			    cancelButtonText: 'Cancel',
            	    			    type: 'success',
            	    			    showCancelButton:false
            	    			}).then(() => {
            	    			     window.location.href = "/dang-nhap";
            	    			})
            	    		}
            	    	}
            	    	

            	    }else{
            	        return false;
            	    };
            	    _.loading = false;
            	})
            }
        },
        async asyncData({$auth,$router}){

        }
    }
</script>
<style scoped>

</style>