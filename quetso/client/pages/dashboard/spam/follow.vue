<template>
	<div>

		
		<el-row :gutter="10">
			<el-col :span="24" :offset="0">
				<el-input spellcheck="false" @keyup.enter.native="Follow" placeholder="Link post" v-model="url" size="mini" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
			</el-col>
		</el-row>
		<br>
		<el-row :gutter="20">
			<el-col align="left" :span="24" :offset="0">
				<el-button type="primary" @click="Follow" icon="el-icon-thumb" :loading="loading_follow" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Auto Follow</el-button>
			</el-col>
		</el-row>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				url:'',
				loading_follow:false,
				
			}
		},
		
		methods:{
			Follow:async function(){
				this.loading_follow = true;
				try{
					let {data} = await this.$axios.post('/api/spam/follow',{url:this.url});
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
				this.loading_follow = false;


			}
		}
	}
</script>
<style scoped>

</style>