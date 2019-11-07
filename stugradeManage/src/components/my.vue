<template>
    <div>
        <!-- tea -->
        <el-form label-width="80px" v-if="type==='tea'">
            <el-form-item label="教师工号">
                {{usernum}}
            </el-form-item>
            <el-form-item label="教师名">
                {{username}}
            </el-form-item>
            <el-form-item label="新密码">
                <el-input v-model="password"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码">
                <el-input v-model="repassword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="updatepwd">更换密码</el-button>
            </el-form-item>
        </el-form>
        <!-- stu -->
        <el-form label-width="80px" v-if="type==='stu'">
            <el-form-item label="学号">
                {{usernum}}
            </el-form-item>
            <el-form-item label="学生名">
                {{username}}
            </el-form-item>
            <el-form-item label="新密码">
                <el-input v-model="password"></el-input>
            </el-form-item>
            <el-form-item label="确认新密码">
                <el-input v-model="repassword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="updatepwd">更换密码</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
    data(){
        return{
            username:'',
            usernum:'',
            password:'',
            repassword:'',
            type:null
        }
    },
    methods:{
        updatepwd(){
            let that=this;
            if(this.password===this.repassword){
                this.$axios.post('/api/alterPwd',{
                    pwd:that.password,
                    type:that.type,
                    num:that.usernum
                }).then(res=>{
                    if(res.data.statusCode===0){
                        that.$message(res.data.msg);
                        that.password='';
                        that.repassword='';
                    }
                })
            }else{
                this.$message('两次密码输入不同')
                that.password='';
                that.repassword='';
                return ;
            }
        }
    },
    created(){
        this.type=this.$route.query.type;
        this.username=window.localStorage.getItem('username');
        this.usernum=window.localStorage.getItem('usernum');
    }
}
</script>