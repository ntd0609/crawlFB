<template>
    <div>
        <el-row :gutter="10">
            <el-col :span="24" :offset="0">
                <el-input spellcheck="false" @keyup.enter.native="Comment" placeholder="Link post" v-model="url" size="mini" clearable type="text" :autosize="false" :disabled="false" autocomplete="off"></el-input>
            </el-col>
        </el-row>
        <br>
        <el-row :gutter="20">
            <el-col align="left" :span="24" :offset="0">
                <el-input @keyup.enter.native="Comment" type="textarea" :rows="3" placeholder="Nội dung comment" v-model="message" size="medium":autosize="false" :disabled="false" autocomplete="off"></el-input>
            </el-col>
        </el-row>
        <br>
        <el-row :gutter="20">
            <el-col align="left" :span="24" :offset="0">
                <el-button type="primary" @click="Comment" icon="el-icon-right" :loading="loading_comment" :plain="false" :round="false" :circle="false" :autofocus="false" size="mini" :disabled="false">Auto Comment</el-button>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                url:'',
                message:'',
                loading_comment:false
            }
        },
        created:async function(req,res){

        },
        methods:{
            Comment:async function(){
                this.loading_comment = true;
                try{
                    let {data} = await this.$axios.post('/api/spam/comment',{url:this.url,message:this.message});
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
                this.loading_comment = false;


            }
        }
    }
</script>
<style scoped>

</style>