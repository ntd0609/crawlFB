<template>
	<el-container>
		<el-header>
			<Header/>
		</el-header>
		<el-container>
			<el-aside width="200px">
				<Aside :style="'height:'+size+'px'"/>
			</el-aside>
			<el-main>
				<nuxt/>
			</el-main>
		</el-container>
	</el-container>

</template>
<script>
	import Header from '~/components/dashboard/container/header';
	import Aside from '~/components/dashboard/container/aside';

	export default {
		components:{Header,Aside},
		computed:{
			size(){
				return screen.height-220;
			}
		}
	}
</script>
<style>
body{
	
	padding:0 !important;
	margin:0 !important;
}
html{
	padding:0 !important;
	margin:0 !important;
}
.el-header{
	padding: 0 !important;
}

</style>