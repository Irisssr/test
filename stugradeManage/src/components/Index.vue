<template>
  <div class="index">
      <h2>学生成绩管理系统</h2>
      <el-container style="height: 100%; border: 1px solid #eee">
        <el-header style="text-align: left;line-height:60px; font-size: 12px">
          <el-dropdown>
            <i class="el-icon-setting" @click="toMy" style="margin-right: 15px;font-size:20px;">{{ '欢迎登陆! '+username}}</i>
          </el-dropdown>
          <el-button style="float:right;" type="default" @click="layout">退出</el-button>
        </el-header>
        <el-main>
          <h4>添加成绩</h4>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="学号">
              <el-input v-model="stuNum"></el-input>
            </el-form-item>
            <el-form-item label="课程名">
              <el-select v-model="courseNo" placeholder="请选择课程名">
                <el-option v-for="(item,index) in courseList" :key="index" 
                 :label="item.courseName" :value="item.courseNo"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="成绩">
              <el-input v-model="stuGrade"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addGrade">确认</el-button>
            </el-form-item>
          </el-form>
          <h4>添加课程</h4>
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="课程号">
              <el-input v-model="CNo"></el-input>
            </el-form-item>
            <el-form-item label="课程名">
              <el-input v-model="CName"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addCourse">确认</el-button>
            </el-form-item>
          </el-form>

          <table style="width: 100%">
            <thead>
              <tr>
                <td>学号</td>
                <td>课程号</td>
                <td>成绩</td>
              </tr>
            </thead>
            <tbody>
                  <tr v-if="isedit">
                    <td><el-input v-model="snum"></el-input></td>
                    <el-select v-model="cno" placeholder="请选择课程名">
                      <el-option v-for="(item,index) in courseList" :key="index" 
                      :label="item.courseName" :value="item.courseNo"></el-option>
                    </el-select>
                    <td><el-input v-model="grade"></el-input></td>
                    <td><el-button type="primary" @click="editdata">修改</el-button></td>
                    <td><el-button type="primary" @click="returnedit">返回</el-button></td>
                </tr>
                <tr v-for="(item,index) in gradeList" :key="index">
                  <td>
                    <p v-if="!isedit">{{ item.stuNum}}</p>
                  </td>
                  <td> 
                    <p v-if="!isedit">{{ item.courseNo}}</p>
                  </td>
                  <td>
                    <p v-if="!isedit">{{ item.stuGrade}}</p>
                  </td>
                  <td>
                    <el-button type="danger" @click="deldata({stuNum:item.stuNum,courseNo:item.courseNo})" v-if="!isedit">删除</el-button>
                  </td>
                  <td>
                    <el-button type="default" @click="edit({stuNum:item.stuNum,courseNo:item.courseNo})" v-show="!isedit">修改</el-button>
                  </td>
                  
                </tr>
            </tbody>
          </table>
        </el-main>
      </el-container>
  </div>
</template>
<script>
export default {
  data(){
    return{
      name:'index',
      stuNum:'',
      courseNo:'',
      stuGrade:'',
      snum:'',
      cno:'',
      grade:'',
      id:null,
      isedit:false,
      gradeList:[],
      username:'',
      usernum:'',
      courseList:[],
      CNo:'',
      CName:''
    }
  },
  methods:{
    addCourse(){
        if(this.CNo===''||this.CName===''){
          return this.$message('不能为空');
        }
        this.$axios.post('/api/addcourse',{
          courseNo:this.CNo,
          courseName:this.CName
        }).then(res=>{
          if(res.data.statusCode===0){
            this.$message(res.data.msg);
            this.CName='';
            this.CNo='';
            this.getCourse();
          }else{
            this.$message(res.data.msg);
            this.CName='';
            this.CNo='';
          }
        })
    },
    addGrade(){
      if(this.stuGrade===''||this.stuNum===''||this.courseNo===''||this.courseName===''){
        return this.$message('不能为空')
      }
      this.$axios.post('/api/grade',{
        stuNum:this.stuNum,
        courseNo:this.courseNo,
        stuGrade:this.stuGrade,
        courseName:this.courseName
      }).then(res=>{
        if(res.data.statusCode===0){
          this.$message(res.data.msg);
          this.stuNum='';
          this.stuGrade='';
          this.courseNo='';
        }
        this.getData();
      })
    },
    deldata(obj){
        this.$axios.post('/api/delgrade',{
          stuNum:obj.stuNum,
          courseNo:obj.courseNo
        }).then(res=>{
          if(res.data.statusCode===0){
            this.$message(res.data.msg)
            this.getData();
          }
        })
    },
    edit(obj){
      this.isedit=true;
      this.$axios.post('/api/curgrade',{
        stuNum:obj.stuNum,
        courseNo:obj.courseNo
      }).then(res=>{
        let data=res.data.data;
        console.log(data)
        this.snum=data.stuNum;
        this.cno=data.courseNo;
        this.grade=data.stuGrade;
        this.id=data.id;
      })
    },
    editdata(){
      this.isedit=false;
      this.$axios.post('/api/newgrade',{
        stuNum:this.snum,
        courseNo:this.cno,
        stuGrade:this.grade,
        id:this.id,
        courseName:this.cname
      }).then(res=>{
        if(res.data.statusCode===0){
          this.stuNum='';
          this.stuGrade='';
          this.courseNo='';
        }
        this.getData();
        this.$message(res.data.msg);
      })
    },
    toMy(){
      this.$router.push({ path:'/my',query:{type:'tea'}})
    },
    returnedit(){
      this.isedit=false;
    },
    layout(){
      window.localStorage.clear();
      this.$router.push({ path:'/'})
    },
    getData(){
      this.$axios.get('/api/').then(res=>{
        if(res.data.statusCode===0){
          this.gradeList=res.data.data
        }
      })
      
    },
    getCourse(){
      this.$axios.get('/api/getcourse').then(res=>{
        this.courseList=res.data.data;
      })
    }
  },
  mounted(){
    this.getData();
    this.getCourse();
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
  td{
    text-align: center;
    height: 50px;
  }
  .el-icon-setting:hover{
    cursor: pointer;
  }
</style>