<template>

	<div v-if="permission.includes('quan-ly-token')">
		<el-tabs v-model="active_tab" type="border-card">
			<el-tab-pane name="b">
				<span slot="label"><i class="el-icon-user-solid"></i> Token</span>
				<el-row :gutter="20">
					<el-col :span="24" align="left" :offset="0">
						<el-input spellcheck="false" type="textarea" :rows="5" placeholder="Nhập danh sách cookie,token ..." v-model="cookie_token"></el-input>	
					</el-col>
				</el-row>

				<br>
				<el-row :gutter="20">
					<el-col align="left" :span="12" :offset="0">
						<el-button type="primary" @click="AddToken" icon="el-icon-plus" :loading="loading_AddToken" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Confirm</el-button>
						<el-button type="primary" @click="Check" icon="el-icon-refresh" :loading="loading_check" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Refresh</el-button>
						<el-tooltip effect="dark" content="Tổng số lượng" placement="top-start">
							<el-button type="info" @click="UpdateLive(undefined)" icon="el-icon-user-solid
							" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">{{count}} Token</el-button>
						</el-tooltip>
						<el-button type="danger" @click="ExportTokenDie" icon="el-icon-right" :loading="loading_export" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Export Token Die</el-button>


						<el-popconfirm title="Bạn có chắc chắn?" @confirm="RemoveToken" confirmButtonText='OK' cancelButtonText='Không,cảm ơn.' icon="el-icon-info" iconColor="red">


							<el-button v-show="multipleSelection.length > 0" style="margin-left:10px" slot="reference" type="danger" icon="el-icon-delete-solid
								" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Xóa {{multipleSelection.length}} token</el-button>
							</el-popconfirm>





						</el-col>
						<el-col align="right" :span="12" :offset="0">


							<el-button-group size="mini">

								<el-tooltip effect="dark" content="Đang sử dụng" placement="top-start">

									<el-button type="warning" icon="el-icon-right" :loading="false" :plain="true" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">{{count_used}} running</el-button>
								</el-tooltip>
								<el-tooltip effect="dark" content="Đang hoạt động" placement="top-start">
									<el-button size="mini" @click="UpdateLive(true)" icon="el-icon-check" type="success">{{count_live}} Live</el-button>
								</el-tooltip>
								<el-tooltip effect="dark" content="Ngừng hoạt động" placement="top-start">

									<el-button size="mini" @click="UpdateLive(false)" icon="el-icon-close" type="danger">{{count_die}} Die</i></el-button>
								</el-tooltip>

							</el-button-group>

						</el-col>
					</el-row>
					<br>
					<el-row :gutter="20">
						<el-col align="left" :span="24" :offset="0">

							<el-table :data="list_token" :border="true"   @selection-change="handleSelectionChange" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="dark" style="width: 100%" v-loading="loading_data" element-loading-text="Loading...">
								<el-table-column
								type="selection"
								align="center"
								width="55">
							</el-table-column>
							
							<el-table-column label="UID" align="center" :sortable="false" :fixed="false">
								<template slot-scope="scope">
									<el-tag  type="primary" :closable="false" effect="plain" size="large" :disable-transitions="false">{{scope.row.uid}}</el-tag>
								</template>
							</el-table-column>
							<el-table-column label="Name" prop="name" align="center" :sortable="false" :fixed="false"/>

							<el-table-column align="center" :sortable="false" :fixed="false">
								<template slot="header">
									<el-dropdown @command="filter_type" size="mini">
										<span class="el-dropdown-link">

											Type <i class="el-icon-caret-bottom el-icon--right"></i>
										</span>

										<el-dropdown-menu slot="dropdown">
											<el-dropdown-item v-for="(data,index) in list_type" :command="data.value" :key="index">

												<el-tag style="margin-top: 5px" :type="data.type" :closable="false" effect="dark" size="small" :disable-transitions="false">  {{data.label}}</el-tag>
											</el-dropdown-item>

										</el-dropdown-menu>
									</el-dropdown>
								</template>
								<template slot-scope="scope">
									<el-tag v-if="scope.row.cookie.includes('c_user')" :closable="false" effect="dark" size="large" :disable-transitions="false">Cookie</el-tag>
									<el-tag v-if="!scope.row.cookie.includes('c_user')" :closable="false" effect="dark" size="large" :disable-transitions="false">Token</el-tag>       

								</template>
							</el-table-column>



							<el-table-column  align="center" :sortable="false" :fixed="false">
								<template slot-scope="scope">
									<el-tag  :type="Status(scope.row.live).type" :closable="false" effect="dark" size="large" :disable-transitions="false">{{Status(scope.row.live).text}}</el-tag>       
								</template>
							</el-table-column>


						</el-table>
						<br>

						<br>

						<el-pagination @current-change="LoadToken" :total="count" :page-size="limit" :current-page.sync="pager" :pager-count="11" :hide-on-single-page="false" background layout="prev, pager, next"></el-pagination>
					</el-col>
				</el-row>
			</el-tab-pane>

			<el-tab-pane name="a">
				<span slot="label"><i class="el-icon-crop"></i> Convert</span>
				<el-row :gutter="20">
					<el-col align="right" :span="24" :offset="0">
						<el-tag  type="danger" :closable="false" effect="dark" size="mini" :disable-transitions="false">{{list_cookie.length}} cookies</el-tag>
					</el-col>
				</el-row>
				
				<el-row :gutter="20">
					<el-col :span="24" align="left" :offset="0">
						<el-input spellcheck="false" type="textarea" :rows="5" placeholder="Nhập danh sách cookie,token ..." v-model="cookie_text"></el-input>	
					</el-col>
				</el-row>
				<br>

				
				<el-row :gutter="20">
					<el-col align="center" :span="24" :offset="0">
						<el-button type="primary" @click="ConvertToken" icon="el-icon-right" :loading="loading_convert" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Convert</el-button>
					</el-col>
				</el-row>

				<br>
				<el-row :gutter="20">
					
					<el-col align="left" :span="24" :offset="0">
						<el-input spellcheck="false" type="textarea" :rows="30" placeholder="EAAB ..." v-model="token_fullpermission"></el-input>	
					</el-col>
				</el-row>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
	import { mapState,mapGetters,mapMutations,mapActions } from 'vuex';
	export default {
		data(){
			return {
				cookie_text:'',
				token_fullpermission:'',
				token_bm:'',
				active_tab:'b',
				multipleSelection:[],
				list_token:[],
				cookie_token:'',
				loading_AddToken:false,
				loading_data:true,
				loading_check:false,
				pager:1,
				count:0,
				limit:10,
				count_live:0,
				count_die:0,
				count_used:0,
				loading_remove_token:false,
				count_pagination:0,
				live:undefined,
				type_cookie:undefined,
				type:null,
				loading_export:false,
				loading_convert:false,
				list_permission_use:[],
				list_type:[
				{label:'Cookie',type:'danger',value:'cookie'},
				{label:'Token',type:'warning',value:'token'},
				{label:'Tất cả',type:'primary',value:undefined},
				]

			}
		},
		created:async function(){
			await this.GetInfo();
			await this.LoadToken();
			this.count_pagination = this.count;
		},
		computed:{
			list_cookie(){
				return this.cookie_text.split('\n').filter(e=>e.includes('c_user='));
			},
			permission(){
				return this.list_permission_use.map(e=>e.value);
			},
			list_cookie_token(){
				return this.cookie_token.split('\n').map(e=>e.trim());
			},
			cookie(){
				if(this.type_cookie === 'cookie'){
					return {contains:'c_user'}
				}else if(this.type_cookie === 'token'){
					return ''
				}else{
					return undefined
				}
			}
		},
		
		methods:{
			GetTokenBM:async function(cookie){
				try{
					let {data} = await this.$axios.post('/api/token/convert-bm',{cookie});
					return this.token_bm += data.toString() + '\n';
				}catch(error){
					return this.token_bm += '\n';

				}
			},
			GetTokenFullPermission:async function(cookie){
				try{
					let {data} = await this.$axios.post('/api/token/convert-fullpermission',{cookie});
					return this.token_fullpermission += data.toString() + '\n';
				}catch(error){
					return this.token_fullpermission += '\n';

				}
			},
			ConvertToken:async function(){
				this.loading_convert = true;
				for(let cookie of this.list_cookie){

					await Promise.all([this.GetTokenFullPermission(cookie)])
					this.cookie_text = this.list_cookie.filter(e=> e.trim() !== cookie.trim()).join('\n');
				};
				this.loading_convert = false;

			},
			RemoveTokenDie:async function(){
				this.loading_remove_token = true;
				await this.$axios.post('/api/token/remove-token-die');
				this.$confirm('Đã hoàn thành tiến trình', 'Hoàn thành', {
					confirmButtonText: 'OK',
					showCancelButton:false,
					type: 'success'
				});
				this.loading_remove_token = false;
				await this.LoadToken();
				
			},
			ExportTokenDie:async function(){
				this.loading_export = true;
				let response = await this.$axios.post('/api/token/download-token-die',{},{responseType: 'blob'})
				const url = window.URL.createObjectURL(new Blob([response.data]));
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', 'file.txt'); 
				document.body.appendChild(link);
				link.click();
				this.loading_export = false;
				await this.RemoveTokenDie();
			},
			GetInfo:async function(){
				let {data} = await this.$axios.post('/api/account/info');
				this.type = data.package;
				return await this.GetPermission();
			},
			GetPermission:async function(){
				let {data} = await this.$axios.get('/api/package',{params:{type:this.type}});
				return this.list_permission_use = data[0].permission;
			},
			filter_type:async function(command){
				this.type_cookie = command;
				await this.LoadToken();
			},
			UpdateLive:async function(live){
				this.live = live;
				
				return await this.LoadToken()
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			Status:function(live){
				if(live){
					return {type:'success',text:'Live'}
				}else{
					return {type:'danger',text:'Die'}
				}
			},
			ShowToken:function({id,access_token,cookie,name}){
				this.$prompt('', 'Token '+name, {
					

					inputValue:access_token,
					
				})
			},
			ShowCookie:function({id,access_token,cookie,name}){
				this.$prompt('', 'Cookie '+name, {
					

					inputValue:cookie,
					
				})
			},
			GetCountToken:async function(){
				let {data} = await this.$axios.get('/api/token/count');
				
				this.count_token = data.count_token;
				this.count_cookie = data.count_cookie;
				this.count = data.count;
				this.count_live = data.count_live;
				this.count_die = data.count_die;
				this.count_used = data.count_used;
				return;
			},
			GetListToken:async function(){
				let params = {
					limit:this.limit,
					skip:(this.pager - 1)*this.limit,
					where:{
						live:this.live,
						cookie:this.cookie
					}
				};
				let {data} = await this.$axios.get('/api/token',{params});
				return this.list_token = data;
			},
			LoadToken:async function(){
				this.loading_data = true;
				await Promise.all([this.GetCountToken(),this.GetListToken()])
				this.loading_data = false;
				if(this.live === true){
					this.count_pagination = this.count_live;
				}else if(this.live === false){
					this.count_pagination = this.count_die;
				}else if(this.live === undefined){
					this.count_pagination = this.count;
				}
				return;
			},
			MakeAddToken:async function(text){
				
				try{
					
					let {data} = await this.$axios.post('/api/token/add',{text})
					if(data.error) throw data.error;
					
					this.$notify({
						title: 'Đã lưu tài khoản',
						message: 'Thêm tài khoản thành công',
						type: 'success'
					});
					await this.LoadToken();
				}catch(error){
					this.$notify({
						title: 'Có lỗi xảy ra',
						message: error,
						type: 'error'
					});
				}
				this.cookie_token = this.cookie_token.split('\n').map(e=>e.trim()).filter(e=>e !== text).join('\n');
				
				return;

			},
			AddToken:async function(){
				this.loading_AddToken = true;
				for(let text of this.list_cookie_token){
					await this.MakeAddToken(text);
				}
				this.loading_AddToken = false;
				return;
			},
			RemoveToken:async function(){
				for(let {id,name} of this.multipleSelection){
					await this.$axios.delete('/api/token/'+id);
					await this.LoadToken();
					this.$message({type:'error',message:'Đã xóa '+name})
				}
				
			},
			Check:async function(){
				this.loading_check = true;
				await this.$axios.post('/api/token/check');
				await this.LoadToken();
				this.loading_check = false;
				return;
			},
		
		}
	}
</script>
<style scoped>

</style>