<template>
    <div class="login">
         <el-tabs v-model="activeName">
            <el-tab-pane label="学生用户登录" name="first">
                <el-form ref="form"  label-width="80px">
                    <el-form-item label="学号">
                        <el-input v-model="num"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="pwd"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="userLogin">登录</el-button>
                        <el-button @click="userRegister">注册</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="教师用户登录" name="second">
                <el-form ref="form" label-width="80px">
                    <el-form-item label="教师工号">
                        <el-input v-model="num"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="pwd"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="userLogin">登录</el-button>
                        <el-button @click="userRegister">注册</el-button>
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
            num:'',
            pwd:'',
            teaNum:'',
            teaPwd:'',
            activeName:'first'
        }
    },
    methods:{
        userLogin(){
            let that=this;
            if(this.num===''||this.pwd===''){
                return this.$message('不能为空')
            }
            this.$axios.post('/api/login',{ 
                num:this.num,
                pwd:this.pwd,
                type:this.activeName
            })
            .then(res=>{
                if(res.data.statusCode===1){
                    that.$message(res.data.msg);
                    this.pwd='';
                    return;

                }else if(res.data.statusCode===2){
                    that.$message(res.data.msg);
                    this.pwd='';
                    this.num='';
                    return;
                }
                else if(res.data.statusCode===0){
                    that.$message(res.data.msg)
                    let user=res.data.data[0]
                    let username=user.stuNum?user.stuName:user.teaName;
                    let usernum=user.stuNum?user.stuNum:user.teaNum;
                    window.localStorage.setItem('usernum',usernum)
                    window.localStorage.setItem('username',username)
                    if(user.stuNum){
                        that.$router.push({ path:'/stuindex'})
                    }else{
                        that.$router.push({ path:'/teaindex'})
                    }
                }
            })
        },
        userRegister(){
            if(this.activeName==='first'){
                this.$router.push({ path:'/register',query:{type:'stu'}})
            }else{
                this.$router.push({ path:'/register',query:{type:'tea'}})
            }
        }
    }
}
</script>
