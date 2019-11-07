<template lang="">
    <div>
        <el-tabs v-model="activeName">
            <el-tab-pane :label="title" name="first">
                <el-form ref="form"  label-width="80px">
                    <el-form-item :label="numTitle">
                        <el-input v-model="num"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名">
                        <el-input v-model="name"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="pwd"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary"  @click="userRegister">注册</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
export default {
    data(){
        return{
            activeName:'first',
            num:'',
            pwd:'',
            name:'',
            type:'',
            title:null,
            numTitle:null
        }
    },
    methods:{
        userRegister(){
            let that=this;
            if(this.num===''||this.pwd===''||this.name===''){
                return this.$message('不能为空')
            }
            this.$axios.post('/api/register',{ 
                num:this.num,
                name:this.name,
                pwd:this.pwd,
                type:this.type
            }).then(res=>{
                if(res.data.statusCode===2){
                    that.$message(res.data.msg);
                }else if(res.data.statusCode===0){
                    that.$message(res.data.msg);
                    that.$router.push({ path:'/'})
                }
                that.num='';
                that.pwd='';
                that.name='';
                return ;
            })
        }
    },
    mounted(){
        this.type=this.$route.query.type
        if(this.type==='stu'){
            this.title='学生注册';
            this.numTitle='学生学号'
        }else{
            this.title='教师用户注册'
            this.numTitle='教师工号';
        }
    }
}
</script>