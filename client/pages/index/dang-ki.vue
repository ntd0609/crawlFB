<template>
	<el-row>
		 <br><br><br>
				<el-col :span="6" :offset="9">
					<center>
						Tạo tài khoản
					</center>
					<br>

					<el-form ref="register" :rules="register_input" :model="register_form"  status-icon label-width="auto" label-position="top" :inline="false" :disabled="false" :inline-message="false" show-message validate-on-rule-change size="medium">
						<el-form-item align="left" label="Số điện thoại" prop="phone">
							<el-input @keyup.enter.native="register" placeholder="Số điện thoại dùng để đăng nhập" size="small" v-model="register_form.phone" clearable :autosize="false" :disabled="false" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item align="left" label="Địa chỉ email" prop="email">
							<el-input @keyup.enter.native="register" placeholder="Địa chỉ email dùng để khôi phục khi quên mật khẩu" size="small" v-model="register_form.email" clearable :autosize="false" :disabled="false" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item align="left" label="Mật khẩu" prop="password">
							<el-input type="password" @keyup.enter.native="register" placeholder="Password" v-model="register_form.password" size="small" :disabled="false" autocomplete="off"></el-input>
						</el-form-item>

						<el-form-item align="center">
							<el-button type="primary" @click="register" :loading="register_status" size="small">Tạo tài khoản</el-button>
						</el-form-item>
						<el-form-item align="center">
							Bạn đã có tài khoản ? <el-link href="/dang-nhap" :underline="false">Đăng nhập</el-link>
						</el-form-item>
						
					</el-form>
				</el-col>
			
	</el-row>
</template>
<script>
	export default {
		data(){
			return{
				register_status:false,
				register_form:{phone:'',password:'',email:''},
				register_input:{
					phone:[{type:'string',required:true,trigger:'blur',message:'Quý khách được yêu cầu nhập vào ô trống.'}],
					password:[{type:'string',required:true,trigger:'blur',message:'Quý khách được yêu cầu nhập vào ô trống.'}],
					email:[{type:'string',required:true,trigger:'blur',message:'Quý khách được yêu cầu nhập vào ô trống.'}]

				}
			}
		},
		methods:{
			register:async function(){
				let _ = this;
				this.$refs['register'].validate(async (valid)=>{
					if(valid){
						let {data} = await _.$axios.post('/api/user/register',_.register_form)
						
						if(data.error){
							_.$message({type:'error',message:data.error});
						}else{
							this.$notify({
							    title: 'Đăng kí thành công',
							    message: 'Đã tạo tài khoản,vui lòng đăng nhập.',
							    type: 'success'
							});
							await _.$auth.loginWith('local',{data:_.register_form});
							window.location.href = '/';

						}

					}else{
						return false
					}
				})
			}
		}
	}
</script>
