<template>
	
	
	<el-menu :router="true" :default-active="$route.path" :unique-opened="true" menu-trigger="click" :collapse="false" mode="vertical" >
		<el-submenu :index="'/dashboard/bai-viet'">
			<template slot="title">
				<i class="el-icon-edit-outline" style="color:#ffffd3;"></i>
				<span>Quét comment ẩn</span>
			</template>
			<el-menu-item :index="'/dashboard/bai-viet'">
				<span>Danh sách</span>
			</el-menu-item>
			<el-menu-item :index="'/dashboard/bai-viet/binh-luan'">
				<span>Bình luận</span>
			</el-menu-item>
		</el-submenu>
		

		
		
		<el-submenu :index="'/dashboard/hide'"  v-if="permission.includes('an-comment')">
			<template slot="title">
				<i class="el-icon-view" style="color:#ffffd3;"></i>
				<span>Chống cướp đơn</span>
			</template>
			<el-menu-item :index="'/dashboard/hide/danh-sach'">
				<span>Danh sách</span>
			</el-menu-item>
			<el-menu-item :index="'/dashboard/hide/binh-luan'">
				<span>Bình luận</span>
			</el-menu-item>
			
		</el-submenu>
		<el-menu-item :index="'/dashboard/tai-khoan'">
			<i class="el-icon-s-custom" style="color:#ffffd3;"></i>
				<span>Tài khoản</span>
			
		</el-menu-item>
		<el-submenu :index="'/dashboard/spam'"  v-if="permission.includes('spam')">
			<template slot="title">
				<i class="el-icon-thumb" style="color:#ffffd3;"></i>
				<span>Spam</span>
			</template>
			<el-menu-item-group>
				<el-menu-item :index="'/dashboard/spam/follow'">
					<span>Follow</span>
				</el-menu-item>

				<el-menu-item :index="'/dashboard/spam/like'">
					<span>Like</span>
				</el-menu-item>

				<el-menu-item :index="'/dashboard/spam/comment'">
					<span>Comment</span>
				</el-menu-item>
				
				
			</el-menu-item-group>
		</el-submenu>
		
		
		
		

		<el-submenu v-if="permission.includes('quan-ly-token') || permission.includes('quan-ly-user')" :index="'/dashboard/admin'">
			<template slot="title">
				<i class="el-icon-notebook-2" style="color:#ffffd3;"></i>
				<span>Quản lý</span>
			</template>
			<el-menu-item-group>
				<el-menu-item v-if="permission.includes('quan-ly-token')" :index="'/dashboard/admin/tai-khoan'">
					<span>Token</span>
				</el-menu-item>

				<el-menu-item v-if="permission.includes('quan-ly-token')" :index="'/dashboard/admin/delay'">
					<span>Delay time</span>
				</el-menu-item>
				<el-menu-item v-if="permission.includes('quan-ly-user')" :index="'/dashboard/admin/quan-ly-tai-khoan'">
					<span>Users</span>
				</el-menu-item>
				
			</el-menu-item-group>
		</el-submenu>



	</el-menu>

</template>
<script>
	export default {
		data(){
			return {
				list_permission:[],
				type:'',
				nick:''
			}
		},
		created:async function(){
			let {data} = await this.$axios.post('/api/account/info');
			this.nick = data.phone;
			this.type = data.package;
			return await this.GetPermission();
		},
		computed:{
			permission(){
				return this.list_permission.map(e=>e.value);
			}
		},
		methods:{
			GetPermission:async function(){
				let {data} = await this.$axios.get('/api/package',{params:{type:this.type}});
				return this.list_permission = data[0].permission;
			}
		}
	}
</script>
<style>
	.el-submenu.is-opened>.el-submenu__title .el-submenu__icon-arrow{
		margin-top: -5px;
	}
</style>
