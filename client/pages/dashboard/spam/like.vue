<template>
	<div>

		<el-row :gutter="20">
			<el-col align="left" :span="24" :offset="0">
				<el-checkbox-group v-model="reactions">
					<el-checkbox v-for="(data,index) in list_reactions" :label="data.value" :key="index">
						<el-tooltip effect="dark" :content="data.label" placement="top-start">
							<img width="18px" style="position: absolute;top: 0px;" :src="data.img">
						</el-tooltip>
					</el-checkbox>
				</el-checkbox-group>
			</el-col>
		</el-row>
		<br>
		<el-row :gutter="10">
			<el-col :span="24" :offset="0">
				<el-input spellcheck="false" @keyup.enter.native="Like" placeholder="Link post" v-model="url" size="mini" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
			</el-col>
		</el-row>
		<br>
		<el-row :gutter="20">
			<el-col align="left" :span="24" :offset="0">
				<el-button type="primary" @click="Like" icon="el-icon-thumb" :loading="loading_like" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Auto Like</el-button>
			</el-col>
		</el-row>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				url:'',
				loading_like:false,
				reactions:[],
				list_reactions:[
				{label:'LIKE',value:'1635855486666999',img:'/like.png'},
				{label:'LOVE',value:'1678524932434102',img:'/love.png'},
				{label:'HAHA',value:'115940658764963',img:'/haha.png'},
				{label:'WOW',value:'478547315650144',img:'/wow.png'},
				{label:'SORRY',value:'908563459236466',img:'/sorry.png'},
				{label:'ANGRY',value:'444813342392137',img:'/angry.png'},


				]
			}
		},
		created:async function(req,res){

		},
		methods:{
			Like:async function(){
				this.loading_like = true;
				try{
					let {data} = await this.$axios.post('/api/spam/like',{url:this.url,reactions:this.reactions});
					if(data.error) throw data.error;
					this.$confirm('Đã hoàn thành tiến trình', 'Hoàn thành', {
						confirmButtonText: 'OK',
						showCancelButton:false,
						type: 'success'
					})

				}catch(error){
					this.$confirm(error,'ERROR', {
						confirmButtonText: 'OK',
						showCancelButton:false,
						type: 'error'
					})
					
				}
				this.loading_like = false;


			}
		}
	}
</script>
<style scoped>

</style>