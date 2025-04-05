<template>
    <el-row :gutter="0" style="margin-top:80px">
        <el-col :span="6" :offset="9">
            <el-form @submit.native.prevent ref="forgot" :rules="forgot_rules" :model="forgotForm"  status-icon label-width="auto" label-position="top" :inline="false" :disabled="false" :inline-message="false" show-message validate-on-rule-change size="medium">

                <el-form-item class="field" label="Nhập Email khôi phục mật khẩu:" prop="email" align="left">
                    <el-input @keyup.enter.native="Reset" placeholder="" v-model="forgotForm.email" size="medium" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item align="center">
                    <el-button type="primary" @click="Reset" icon="" :loading="loading" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Khôi phục</el-button>
                </el-form-item>
                
            </el-form>
        </el-col>
    </el-row>
</template>
<script>
    export default {
        data(){
            return {
                forgot_rules:{
                	email:[{required:true,message:'Nhập email để khôi phục mật khẩu'}]
                },
                forgotForm:{
                	email:''
                },
                loading:false
            }
        },
        created:async function(req,res){

        },
        methods:{
            Reset:async function(){
                let _ = this;
                _.loading = true;

                this.$refs['forgot'].validate(async (valid)=>{
                    if(valid){
                        let {data} = await _.$axios.post('/api/user/reset',_.forgotForm);
                        if(data === 'OK'){
                            _.$confirm('Vui lòng kiếm tra email,một đường dẫn khôi phục mật khẩu đã được gửi về email của bạn','Khôi phục mật khẩu',  {
                              confirmButtonText: 'OK',
                              cancelButtonText: 'Cancel',
                              cancelButton:false,
                              type: 'success',
                              center: true,
                              showCancelButton:false

                          }).then(() => {
                              window.location.href = "/";
                          }).catch(() => {
                              
                          });
                      }else{
                        _.$notify({
                            title: 'Có lỗi xảy ra',
                            message: data,
                            type: 'error'
                        });
                      }
                  }else{
                    return false;
                };
                _.loading = false;
            })
            }
        }
    }
</script>
<style scoped>

</style>