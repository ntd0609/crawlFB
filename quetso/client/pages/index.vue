<template>
  <el-container style="margin:0 !important;padding: 0 !important;">
    <el-header>
      <el-menu mode="horizontal" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item style="margin-left:10px" index="1">
        <el-image style="width:45px;margin-top:8px;margin-right:10px" src="/logo.png" >

        </el-image>
        PHẦN MỀM LẤY SỐ ĐIỆN THOẠI
    </el-menu-item>
    <div style="float:right;margin-top: 10px;margin-right: 10px;">
        <el-button type="warning" @click="OpenLink('dang-ki')" icon="" :loading="false" :plain="false" :round="true" :circle="false" :autofocus="false" size="medium" :disabled="false">Tạo tài khoản</el-button>
      <el-button type="primary" @click="OpenLink('')" icon="" :loading="false" :plain="false" :round="true" :circle="false" :autofocus="false" size="medium" :disabled="false">Đăng Nhập</el-button>
  </div>
</el-menu>
</el-header>

<el-main>
   
    <nuxt/>
</el-main>
</el-container>
</template>
<script>
  export default {

    data(){
      return {

      }
  },
  methods:{
    OpenLink:function(path){
        window.open("/"+path,"_self")
    }
}
}
</script>
<style scoped>
    .link{
     float:right;
     margin-top:30px;
     margin-right:25px
 }
 .register{
     margin-left:20px;
     float:right;
     margin-top:20px;
     margin-right:25px
 }
 .el-header{
    padding: 0 !important;
    margin: 0 !important;
}
.el-main{
    margin: 0 !important;
    padding: 0 !important;
}
</style>
