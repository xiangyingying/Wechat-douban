<template>
  <div class="home">
    <div class="top">
        <div class="avatar">
          <img src="../assets/avatar.jpg" alt="">
        </div>
        <div class="login">
          <span>{{successName}}</span>
          <el-button @click="dialogFormVisible = true">登录</el-button>
          <el-button @click="handleLoginout">退出</el-button>
          <router-link to='/carts'>
                <i class="iconfont icon-gouwuchekong"></i>
          </router-link>
          <el-dialog title="登陆界面" :visible.sync="dialogFormVisible">
          <el-form :model="form" status-icon :rules="rules">
                <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
                  <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="pass" :label-width="formLabelWidth">
                  <el-input type="password" v-model="form.pass"></el-input>
                </el-form-item>
           </el-form>
           <div slot="footer" class="dialog-footer">
             <el-button type="primary" @click="handleLogin">确 定</el-button>
           </div>
          </el-dialog>
        </div>
      </div>
    <el-container>
      <el-header><span class="header-active">首页</span><i class="iconfont icon-dayuhao"></i><span>商品详情</span></el-header>
      <div class="nav">
        Sort by: <span @click="handleDefault">Default</span> Price <i @click="handleSort" class="iconfont">{{sortFlag==1?'&#xe61e;':'&#xe633;'}}</i>
      </div>
      <el-container class="content">
        <el-aside width="200px">
          <h3>PRICE:</h3>
          <div v-for="item of searchPrice" :key="item.id">
            <p @click="handlePrice(item.gt,item.lt)">{{item.gt}}-{{item.lt}}</p>            
          </div>
        </el-aside>
        <el-main>
          <div class="item">
            <div v-for="item of goodsList" :key="item.id">
              <img :src="item.productImage" alt="">
              <p>{{item.productName}}</p>
              <p class="price">￥{{item.salePrice}}</p>
              <button @click="addCart(item.productId)">加入购物车</button>
            </div>
          </div>        
        </el-main>
      </el-container>
      
      <div class="btns">
        <el-pagination
            @current-change="getPage"
            class="page"
            background
            layout="prev, pager, next"
            :total="total"
          ></el-pagination>   
        </div>
        </el-container> 
  </div>
</template>

<script>
export default {
  name: 'home',
  data(){
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      }
       };
    return{
      searchPrice:[
        {gt:0,lt:100,id:1001},
        {gt:100,lt:500,id:1002},
        {gt:500,lt:1000,id:1003},
        {gt:1000,lt:5000,id:1004},
        {gt:5000,lt:10000,id:1005},
      ],
      total:30,
      limit:8,
      start:0,
      goodsList:[],
      sortFlag:1,
      dialogVisible: false,
      dialogFormVisible: false,
      form: {
        username: "",
        pass: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" ,required:true}],
        username: [  { required: true, message: '请输入活动名称', trigger: 'blur' }]
      },
      formLabelWidth: "120px",
      successName:""
    }
  },
  mounted(){
    this.initData()
    this.$http('/users/checkLogin').then(res=>{
      if(res.data.code==200){
        this.successName=res.data.result
      }else{
        this.$message({
          message:"未登录"
        })
      }
    })
  },
  /* 路由守卫 */
   beforeRouteLeave (to,from,next) {
      this.$http('/users/checkLogin').then(res=>{
        if(res.data.code==200){
           next()
        }else{
          this.$message({
            message:res.data.msg,
            type:"error",
          })
        }
      })
  }, 
  methods:{
    handlePrice(gt,lt){
      this.$http({
        url:'/goods/price',
        methods:'get',
        params:{
          gt,lt
        }
      }).then(res=>{
        if(res.data.code==200){
          this.goodsList=res.data.result
          this.total=10
        }else{
          this.goodsList=[];
          this.$message({
            duration:2000,
            message:res.data.msg
          });
        }
        
      })
    },
    handleClose(done) {
        this.$confirm('确认关闭？').then(res=>{
            done(res);
          }).catch(err=> {err});
    },
    getPage(page){
      /* 开始数据条数 */
      this.start=(page-1)*this.limit;
      console.log(this.start)
      this.initData()
    },
    initData() {
    this.$http.get("/goods/list", {
      /* 通过params属性传递参数给后端 */
        params: { start: this.start, limit: this.limit }
      }).then(res => {
        if (res.data.code == 200) {
          this.goodsList = res.data.result;
          /* 分三页 默认为十为一页*/
          this.total = Math.ceil(res.data.total / this.limit) * 10;
        }
      });
  },
    handleSort(){
      this.sortFlag=(this.sortFlag==1)?-1:1
      if(this.sortFlag==1){
        /* 升序 */
        this.goodsList.sort(this.compareUp("salePrice"))
      }else{
        /* 降序 */
        this.goodsList.sort(this.compareDown("salePrice"))
      }
    },
    compareUp(value){
      return(a,b)=>{
        return a[value]-b[value]
      }
    },
    compareDown(value){
      return(a,b)=>{
        return b[value]-a[value]
      }
    },
    handleDefault(){
      this.initData()
    },
    addCart(productId){
      /* post请求方式 */
      this.$http({
        url:"/users/addCart",
        method:"post",
        data:{
          productId
        }
      }).then(res=>{
        /* this.cartList=res.data.result; */
        console.log(res)
        this.$message({
            duration:2000,
            message:res.data.msg,
            type:"success"
          });
      })
    },
    handleLogin(){
      console.log(this.form)
      if(this.form.username && this.form.pass){
        this.$http({
          url:"/users/login",
          method:"post",
          data:{
            userName:this.form.username,
            userPwd:this.form.pass
          }
        }).then(res=>{
          if(res.data.code==200){
            this.$message({
              message:res.data.msg,
              type:"success",          
            })
            this.successName=res.data.result
            this.dialogFormVisible=false
          }else{
            this.$message({
              message:res.data.msg,
              type:"error"
            })
          }
        })
      }else{
        this.$message({
          message:"用户名和密码不能为空",
          duration:1000,
          type:"warning"
        })
      }
    },
    handleLoginout(){
      this.$http.post('/users/loginout').then(res=>{
        this.$message({
          message:res.data.msg,
        })
        this.successName=""
      })
    }
  }
}
</script>
<style scoped>
.icon-gouwuchekong{
  color: orange;
  font-size: 30px;
  margin-left: 10px;
}
   .top{
     display: flex;
     justify-content: space-between;
     width: 1050px;
     margin: 20px 250px;
   }
   .avatar img{
     width: 50px;height: 50px;
     border-radius: 50%;
   }
   .top span{
     margin-left: 20px;
   }
   .el-header{
     text-align: left;
     padding: 10px 30px;
   }
   .el-header .header-active{
     font-weight: bold;
   }
   .el-header i:hover{
     cursor: pointer;
   }
   img{
     width: 200px;height: 200px;
   }
   .item{
     width: 880px;
     display: flex;
     flex-wrap: wrap;
     justify-content: space-around;
     margin-left: 40px;
   }
   .item>div{
     margin-bottom: 20px;
     background: white;
     padding: 10px 0;
   }
   .el-container{
     background: #eee;
     width: 1400px;
     margin: 20px auto;
   }
   .nav{
     text-align: right;
     line-height: 40px;
     background: white;
     width: 1100px;
     margin-left: 30px;
   }
   .nav span{
     color: orange;
   }
   .nav i{
     font-size: 25px;
   }
   .price{
     text-align: left;
     margin-left: 10px;
     color: orange;
   }
   .item button{
     border: 1px solid orange;
     background: white;
     color: orange;
     font-size: 12px;
     width: 90%;
     padding:5px;
   }
   .el-aside>div:hover{
     cursor: pointer;
   }
   .el-dialog span:nth-child(odd){
     color: orange;
   }
   .el-dialog div{
     margin-top: 20px;
   }
</style>
