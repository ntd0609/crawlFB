<template>
	<el-row>
	 <br><br><br>
		<transition name="el-zoom-in-center">
			<div class="transition-box">
				<el-col :span="6" :offset="9">
					<center>
						ĐĂNG NHẬP
					</center>
					<br>

					<el-form ref="login" :rules="login_input" :model="login_form"  status-icon label-width="auto" label-position="top" :inline="false" :disabled="false" :inline-message="false" show-message validate-on-rule-change size="medium">
						<el-form-item align="left" label="Số điện thoại" prop="phone">
							<el-input @keyup.enter.native="login" placeholder="Nhập số điện thoại" size="small" v-model="login_form.phone" clearable :autosize="false" :disabled="false" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item align="left" label="Mật khẩu" prop="password">
							<el-input type="password" @keyup.enter.native="login" placeholder="Password" v-model="login_form.password" size="small" :disabled="false" autocomplete="off"></el-input>
						</el-form-item>

						<el-form-item align="center">
							<el-button type="primary" @click="login" :loading="login_status" size="small">Đăng nhập</el-button>
						</el-form-item>
						<el-form-item align="center">
							Bạn chưa có tài khoản ? <el-link href="/dang-ki" :underline="false">Tạo tài khoản</el-link>
						</el-form-item>
						<el-form-item align="center">
							<el-link href="/quen-mat-khau" :underline="false">Quên mật khẩu</el-link>
						</el-form-item>
						
					</el-form>
				</el-col>
			</div>
		</transition>
	</el-row>
</template>
<script>
	export default {
		data(){
			return{
				login_status:false,
				login_form:{phone:'',password:''},
				login_input:{
					phone:[{type:'string',required:true,trigger:'blur',message:'Quý khách được yêu cầu nhập vào ô trống.'}],
					password:[{type:'string',required:true,trigger:'blur',message:'Quý khách được yêu cầu nhập vào ô trống.'}]

				}
			}
		},
		methods:{
			login:async function(){
				let _ = this;
				this.$refs['login'].validate(async (valid)=>{
					if(valid){
						let {data} = await _.$auth.loginWith('local',{data:_.login_form});
						
						if(data.error){
							_.$message({type:'error',message:data.error});
						}else{
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
