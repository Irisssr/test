const express=require('express');
const http=require('http');
const bodyParser=require('body-parser');
const mssql=require('mssql');
const app=express();

app.use(express.static(__dirname+"./page"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false}))

//设置跨域访问
app.all("/*", function(req, res, next) {
    // 跨域处理
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next(); // 执行下一个路由
})
//连接数据库
const config={
    user:'sa',
    password:'123',
    server:'localhost',
    database:'libuary',
    options:{
        encrypt:false
    }
}
const mssqldb=function(sql){
    return new mssql.ConnectionPool(config).connect()
    .then(pool=>{
        return pool.query(sql)
    })
}
//登录
app.post('/api/login',(req,res,next)=>{
    let num=req.body.num;
    let pwd=req.body.pwd;
    let type=req.body.type;
    let table=null;
    let usernum=null;
    let userpwd=null;
    if(type==='first'){
        table='student';
        usernum='stuNum';
        userpwd='stuPwd';
    }else if(type==='second'){
        table='teacher';
        usernum='teaNum';
        userpwd='teaPwd';
    }
    mssqldb("select * from "+table+" where "+usernum+"='"+num+"'")
    .then(result1=>{
        if(result1.recordset.length===0){
            console.log(result1.recordset)
            return res.json({
                statusCode:2,
                msg:'无此号,请先注册'
            })
        }else{
            mssqldb("select * from "+table+" where "+usernum+"='"+num+"' and "+userpwd+"='"+pwd+"'")
            .then(result=>{
                if(result.recordset.length!==0){
                    return res.json({
                        statusCode:0,
                        data:result.recordset,
                        msg:'登录成功'
                    })
                }else{
                    return res.json({
                        statusCode:1,
                        msg:'密码错误'
                    })
                }
            })
        }
    })
})
//注册
app.post('/api/register',(req,res,next)=>{
    let num=req.body.num;
    let pwd=req.body.pwd;
    let name=req.body.name;
    let type=req.body.type;
    let usernum=null;
    let table=null;
    console.log(type)
    if(type==='stu'){
        table='student';
        usernum='stuNum';
    }else if(type==='tea'){
        table='teacher';
        usernum='teaNum';
    }
    mssqldb("select * from "+table+" where "+usernum+"='"+num+"'")
        .then(result1=>{
            if(result1.recordset.length!==0){
                return res.json({
                    msg:'账号已存在',
                    statusCode:2
                })
            }else{
            mssqldb("insert into "+table+" values('"+num+"','"+name+"','"+pwd+"')")
                .then(result=>{
                    if(!result.recordset){
                        return res.json({
                            statusCode:0,
                            msg:'注册成功'
                        })
                    }else{
                        return res.json({
                            statusCode:1,
                            msg:'注册失败'
                        })
                    }
                }).catch(err=>{
                    res.json({
                        statusCode:1,
                        msg:'注册失败'
                    })
                })
            }
        })
})
//学生/教师修改密码
app.post('/api/alterPwd',(req,res,next)=>{
    console.log(req)
    let num=req.body.num;
    let pwd=req.body.pwd;
    let type=req.body.type;
    if(type==='tea'){
        mssqldb("update teacher set teaPwd='"+pwd+"'where teaNum='"+num+"'")
        .then(result=>{
            console.log(result)
            res.json({
                statusCode:0,
                msg:'修改成功'
            })
        }).catch(err=>{
            res.json({
                statusCode:1,
                msg:'修改失败'
            })
        })
    }else if(type==='stu'){
        mssqldb("update student set stuPwd='"+pwd+"'where stuNum='"+num+"'")
        .then(result=>{
            res.json({
                statusCode:0,
                msg:'修改成功'
            })
        }).catch(err=>{
            res.json({
                statusCode:1,
                msg:'修改失败'
            })
        })
    }
    
})
//学生查看成绩
app.post('/api/find',(req,res,next)=>{
    let stuNum=req.body.stuNum
    mssqldb("select courseName,course.courseNo,stuGrade from grade join course on grade.courseNo=course.courseNo where stuNum='"+stuNum+"'")
        .then(result=>{
            res.json({
                statusCode:0,
                data:result.recordset,
                msg:"查询成功"
            })
        }).catch({
            statusCode:1,
            msg:"查询失败"
        })
})
//显示成绩
app.get('/api/',(req,res,next)=>{
    mssqldb("select * from grade")
        .then(result=>{
            res.json({
                statusCode:0,
                data:result.recordset,
                msg:"成功"
            })
        }).catch({
            statusCode:1,
            msg:"失败"
        })
})
//教师录入成绩
app.post('/api/grade',(req,res,next)=>{
    let stuNum=req.body.stuNum;
    let courseNo=req.body.courseNo;
    let stuGrade=req.body.stuGrade;
    mssqldb("insert into grade values('"+stuNum+"','"+courseNo+"','"+stuGrade+"')")
    .then(result=>{
        res.json({
            statusCode:0,
            msg:"添加成功"
        })
    }).catch(err=>{
        console.log(err)
        res.json({
            statusCode:0,
            msg:"添加失败"
        })
    })
})
//教师成绩修改1
app.post('/api/curgrade',(req,res,next)=>{
    let stuNum=req.body.stuNum;
    let courseNo=req.body.courseNo;
    mssqldb("select * from grade where stuNum='"+stuNum+"' and courseNo='"+courseNo+"'")
        .then(result=>{
            res.json({
                statusCode:0,
                msg:"ok",
                data:result.recordset[0]
            })
        }).catch(err=>{
            res.json({
                statusCode:0,
                msg:"err"
            })
        })
})
//教师成绩修改2
app.post('/api/newgrade',(req,res,next)=>{
    let stuNum=req.body.stuNum;
    let courseNo=req.body.courseNo;
    let stuGrade=req.body.stuGrade;
    let id=req.body.id;
    mssqldb("update grade set stuNum='"+stuNum+"',courseNo='"+courseNo+"',stuGrade='"+stuGrade+"' where id="+id)
        .then(result=>{
            res.json({
                statusCode:0,
                msg:"修改成功"
            })
        }).catch({
            statusCode:1,
            msg:"修改失败"
        })    
})
//教师成绩删除
app.post('/api/delgrade',(req,res,next)=>{
    let stuNum=req.body.stuNum;
    let courseNo=req.body.courseNo;
    mssqldb("delete grade where stuNum='"+stuNum+"' and courseNo='"+courseNo+"'")
        .then(result=>{
            res.json({
                statusCode:0,
                msg:"删除成功"
            })
        }).catch({
            statusCode:1,
            msg:"删除失败"
        })
})
//所有课程
app.get('/api/getcourse',(req,res,next)=>{
    mssqldb("select * from course")
        .then(result=>{
            res.json({
                msg:'ok',
                data:result.recordset
            })
        })
})
//添加课程
app.post('/api/addcourse',(req,res,next)=>{
    let courseNo=req.body.courseNo;
    let courseName=req.body.courseName;
    mssqldb("insert into course values('"+courseNo+"','"+courseName+"')")
    .then(result=>{
        res.json({
            statusCode:0,
            msg:'添加成功'
        })
    }).catch(err=>{
        res.json({
            statusCode:1,
            msg:'添加失败'
        })
    })
})
app.listen(8888,()=>{
    console.log('running 8888')
})

module.exports=app