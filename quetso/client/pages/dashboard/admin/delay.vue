<template>
	<div v-if="permission.includes('quan-ly-token')">
		<el-row :gutter="20">
			<el-col align="left" :span="21" :offset="0">
				<el-input placeholder="Url ..." v-model="url" size="medium" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>

			</el-col>
			<el-col align="right" :span="3" :offset="0">
				<el-button type="primary" @click="GetListPost" icon="el-icon-search" :loading="false" :plain="false" :round="false" :circle="false" :autofocus="false" size="medium" :disabled="false">Search</el-button>
			</el-col>
		</el-row>
		<br>
		<el-row :gutter="20">
			<el-col align="left" :span="24" :offset="0">
				<el-tooltip effect="dark" content="Default delay time (giây)" placement="top-start">
					<el-input-number v-model="time" @change="UpdateDelayTime" size="mini" controls-position="right" :step="1" :min="1" :max="100000000000"></el-input-number>
				</el-tooltip>
				
				<br> <br>
				<el-table :data="list_post" v-loading="Data_Loading" max-height="500" :border="true" :highlight-current-row="true" :stripe="false" :lazy="false" :show-summary="false" tooltip-effect="dark" style="width: 100%" element-loading-text="Loading...">
					
					<el-table-column label="URL" align="center" :sortable="false" :fixed="false">
						<template slot-scope="scope">
							<el-link :href="scope.row.url" target="_blank" :underline="false">{{scope.row.url}}</el-link>
						</template>
					</el-table-column>
					<el-table-column label="Delay time" align="center" width="200px" :sortable="false" :fixed="false">
						<template slot-scope="scope">
							<el-tooltip effect="dark" content="Giây" placement="top-start">
								<el-input-number v-model="scope.row.delay" @change="ChangeDelayTime(scope.row)" size="mini" controls-position="right" :step="1" :min="1" :max="100000000000"></el-input-number>
							</el-tooltip>
							
						</template>
					</el-table-column>
					
					
					
					

				</el-table>
			</el-col>
		</el-row>
		<br>
		<el-pagination @current-change="ListPost" :total="count_post" :page-size="limit" :current-page.sync="pager" :pager-count="11" :hide-on-single-page="false" background layout="prev, pager, next"></el-pagination>
	</div>
</template>
<script>
	
	export default {
		data(){
			return {
				time:0,
				Data_Loading:false,
				url:'',
				list_post:[],
				pager:1,
				limit:100,
				count_post:0,
				list_permission_use:[]
			}
		},
		created:async function(){
			 await this.GetInfo();
			return await Promise.all([this.ListPost(),this.GetDelayTime()])
		},
		computed:{
			where(){
				return {url:{"contains":this.url}};
			},
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
			UpdateDelayTime:async function(){
				await this.$axios.post('/api/delaydefault',{time:this.time});

			},
			GetDelayTime:async function(){
				let {data} = await this.$axios.get('/api/delaydefault');
				return this.time = data.length > 0 ? data[0].time : 5
			},
			ListPost:async function(){
				this.Data_Loading = true;
				await Promise.all([this.GetListPost(),this.CoutListPost()]);
				this.Data_Loading = false;
			},
			GetListPost:async function(){
				let {data} = await this.$axios.post('/api/admin/all-post',{pager:this.pager,limit:this.limit,where:this.where})
				this.list_post = data;
				return;
			},
			ChangeDelayTime:async function({id,delay}){

				await this.$axios.patch('/api/urlscan/'+id,{delay});

			},
			CoutListPost:async function(){
				let {data} = await this.$axios.post('/api/admin/count-post',{pager:this.pager,limit:this.limit,where:this.where})
				this.count_post = data.count;
				return;
			}
		}
	}
</script>
<style scoped>

</style>