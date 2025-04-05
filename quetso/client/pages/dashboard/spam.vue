<template>

         <nuxt v-if="permission.includes('spam')"/>
       
   
   
</template>
<script>
    export default {
        data(){
            return {
                list_permission_use:[],
                type:null,

            }
        },
        computed:{
            permission(){
                return this.list_permission_use.map(e=>e.value);
            },
        },
        created:async function(req,res){
             await this.GetInfo();
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
        },
       
    }
</script>
<style scoped>

</style>