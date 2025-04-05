<template>
	<el-row :gutter="20">
		<el-col align="left" :span="24" :offset="0">
			<el-form ref="register" :rules="info_rules" :model="info"  status-icon label-width="120px" label-position="left" :inline="false" :disabled="false" :inline-message="false" show-message validate-on-rule-change size="medium">
				<el-row :gutter="10">
					<el-col :span="12" :offset="0">
						<el-form-item class="field" label="Email" prop="email" align="left">
							<el-input placeholder="" v-model="info.email" size="small" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
						</el-form-item>

						<el-form-item class="field" label="Phone" prop="phone" align="left">
							<el-input placeholder="" v-model="info.phone" size="small" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
						</el-form-item>

						<el-form-item class="field" label="Package" align="left">
							<el-tag  type="success" :closable="false" effect="dark" size="large" :disable-transitions="false">{{info.package.toUpperCase()}}</el-tag>
						</el-form-item>

						<el-form-item class="field" label="Limit Phone" align="left">
							<el-tag  type="primary" :closable="false" effect="plain" size="large" :disable-transitions="false">{{info.limit_phone.toLocaleString()}} Point</el-tag>
						</el-form-item>

						<el-form-item class="field" label="Limit Time" align="left">
							<el-tag  type="warning" :closable="false" effect="plain" size="large" :disable-transitions="false">
								{{TimeLeft(info.limit_time)}} ngày sử dụng
							</el-tag>
						</el-form-item>
					</el-col>
					<el-col align="left" :span="12" :offset="0">
						<el-button type="primary" @click="Show_upgrade" icon="el-icon-cloudy" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Nâng cấp gói cước</el-button>
					</el-col>
				</el-row>
				<br>
				<el-form-item calign="center">
					<el-button type="primary" @click="Update_Profile" icon="" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">UPDATE PROFILE</el-button>
				</el-form-item>

			</el-form>
			<el-dialog title="Nâng cấp gói cước" :visible.sync="Show_upgrade_dialog" :center="false" :fullscreen="false" top="15vh" width="700px">
				<el-alert
				show-icon
				description="Nội dung chuyển khoản: TÊN GÓI CƯỚC + SỐ ĐIỆN THOẠI"
				:title="bank.stk+' - '+bank.ho_va_ten+' - '+bank.ngan_hang+' - '+bank.chi_nhanh"
				type="success">
			</el-alert>
			<br>
			<el-table :data="list_package" max-height="500" :border="true" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="light" style="width: 100%">



				<el-table-column label="Tên" align="left" :sortable="false" :fixed="false" >
					<template slot-scope="scope">
						<el-tag  type="primary" :closable="false" effect="plain" size="large" :disable-transitions="false">{{scope.row.type.toUpperCase()}}</el-tag>    
					</template>
				</el-table-column>

				<el-table-column label="Số lượng (sđt)" align="left" :sortable="false" :fixed="false" width="160">
					<template slot-scope="scope">
						{{scope.row.limit_phone.toLocaleString()}}  
					</template>
				</el-table-column>

				<el-table-column label="Thời gian (ngày)" align="left" :sortable="false" :fixed="false" width="160">
					<template slot-scope="scope">
						{{scope.row.limit_time.toLocaleString()}} 
					</template>
				</el-table-column>

				<el-table-column label="Giá" align="left" :sortable="false" :fixed="false" width="160">
					<template slot-scope="scope">
						{{scope.row.price.toLocaleString()}} 
					</template>
				</el-table-column>

			</el-table>
		</el-dialog>
	</el-col>
</el-row>


</template>
<script>
	export default {
		data(){
			return {
				info:{
					id:'',
					email:'',
					phone:'',
					limit_phone:0,
					limit_time:0,
					package:''
				},
				info_rules:{
					email:[{required:true,message:'Bạn phải nhập Email'}],
					phone:[{required:true,message:'Bạn phải nhập số điện thoại'}]
				},
				Show_upgrade_dialog:false,
				list_package:[],
				bank:{
					ho_va_ten:'',
					stk:'',
					ngan_hang:'',
					chi_nhanh:''
				}
			}
		},
		created:async function(req,res){
			return await Promise.all([this.GetInfo(),this.GetBank()]);
		},
		methods:{
			TimeLeft:function(starttime){
				let time = starttime - Date.now();
				return parseInt(time/86400000)

			},
			GetInfo:async function(){
				let {data} = await this.$axios.post('/api/account/info');
				return this.info = data;
			},
			Update_Profile:async function(){
				let {data} = await this.$axios.post('/api/account/update-info',this.info);
				await this.GetInfo();
				this.$notify({
					title: 'Chúc mừng',
					message: 'Bạn đã cập nhật tài khoản thành công',
					type: 'success'
				});
			},
			GetBank:async function(){
				let {data} = await this.$axios.get('/api/bank');
				if(data.length > 0) this.bank = data[0];
			},
			GetPackage:async function(){
				let {data} = await this.$axios.get('/api/package?limit=10000000');
				return this.list_package = data;
			},
			Show_upgrade:async function(){
				await this.GetPackage();
				this.Show_upgrade_dialog = true;
			}
		}
	}
</script>
<style scoped>

</style>