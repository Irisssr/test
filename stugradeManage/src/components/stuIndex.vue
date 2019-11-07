<template>
    <div>
        <el-container>
            <el-header style="text-align: left; font-size: 12px">
            <el-dropdown class="hover">
                <i class="el-icon-setting" style="margin-right: 20px"></i>
                <span @click="tomy">{{'欢迎登陆！'+username}}</span>
            </el-dropdown>
            <el-button style="float:right;" type="default" @click="layout">退出</el-button>
            </el-header>
            
            <el-main>
                <el-form class="demo-form-inline">
                    <el-form-item>
                        <el-button type="primary" @click="findgrade">成绩查询</el-button>
                    </el-form-item>
                </el-form>
                <table style="width: 100%">
                    <thead>
                    <tr>
                        <td>课程名</td>
                        <td>课程号</td>
                        <td style="color:red;">成绩</td>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in gradelist" :key="index">
                            <td>{{item.courseName}}</td>
                            <td>{{ item.courseNo}}</td>
                            <td>{{ item.stuGrade}}</td>
                        </tr>
                    </tbody>
                </table>
                <p style="text-align:center;margin-top:20px;color:#c0c0c0;" v-if="gradelist.length===0">无数据</p>
            </el-main>
        </el-container>
    </div>
</template>
<script>
export default {
    data(){
        return{
            username:'',
            usernum:'',
            gradelist:[]
        }
    },
    methods:{
        findgrade(){
            this.$axios.post('/api/find',{
                stuNum:this.usernum
            }).then(res=>{
                this.gradelist=res.data.data
            })
        },
        tomy(){
            this.$router.push({ path:'/my',query:{type:'stu'}})
        },
        layout(){
            window.localStorage.clear()
            this.$router.push({ path:'/'})
        }
    },
    created(){
        this.username=window.localStorage.getItem('username')
        this.usernum=window.localStorage.getItem('usernum')
    }
}
</script>
<style>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
  }
  .hover:hover{
      cursor: pointer;
  }
  table td{
      height: 50px;
  }
</style>