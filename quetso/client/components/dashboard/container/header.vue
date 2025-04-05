<template>
	
	<el-menu


	mode="horizontal"

	background-color="#545c64"
	text-color="#fff"
	active-text-color="#ffd04b">
	<el-menu-item style="margin-left:10px" index="1">
		<el-image style="width:45px;margin-top:8px;margin-right:10px" src="/logo.png" >

		</el-image>
		VUA MARKETING
	</el-menu-item>

	<el-menu-item style="float:right">
		<el-dropdown placement="bottom-end" size="small" trigger="click" :split-button="false" :hide-on-click="false">
			<span style="color:white">
				
				 <i class="el-input__icon el-icon-user-solid" style="color:white"></i> <span style="color:white" class="el-input__icon"> Xin chào {{user.phone}}
		</span>

			</span>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item :divided="false"  :disabled="false">
					<el-link href="/dashboard/thong-tin-ca-nhan" icon="el-icon-user-solid" type="primary" :underline="false"  :disabled="false">Profile</el-link>
				</el-dropdown-item>
				<el-dropdown-item :divided="true"  :disabled="false">
					<el-link icon="el-icon-key" type="primary" :underline="false" @click="turnOn_dialog" :disabled="false">Thay đổi mật khẩu</el-link>
				</el-dropdown-item>


				<el-dropdown-item :divided="true" :disabled="false">
					<el-link icon="el-icon-switch-button" @click="logout" type="primary" :underline="false" :disabled="false">Đăng xuất</el-link>
				</el-dropdown-item>

			</el-dropdown-menu>
		</el-dropdown>
	</el-menu-item>
	

	<DialogChangePassword/>
</el-menu>

</template>
<script>
	import { mapState,mapGetters,mapMutations,mapActions } from 'vuex';
	import DialogChangePassword from '~/components/dashboard/change-password';
	import DialogChangeInfo from '~/components/dashboard/change-password';

	export default {
		
		components:{DialogChangePassword},
		data(){
			return {
				admin:false,
				user:{phone:null}
			}
		},
		created:async function(){
			return await Promise.all([this.GetPermission(),this.GetInfo()])
		},
		
		methods:{
			...mapMutations('change-password',['turnOn_dialog']),
			async logout(){
				await this.$auth.logout()
			},
			GetPermission:async function(){
				let {data} = await this.$axios.post('/api/account/permission/admin');
				this.admin = data.admin;
			},
			GetInfo:async function(){
				let {data} = await this.$axios.get('/api/account/info');
				this.user = data;
			}

		}
	}
</script>
<style scoped>

</style>