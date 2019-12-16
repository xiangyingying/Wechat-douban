### 一、koa脚手架

```
cmd安装依赖
npm i koa-generator -g
```

创建项目

到Powershell窗口创建

```
koa2 server
```

```
启动server项目
npm i
npm run dev
```

浏览器输入localhost:3000

![image-20191202112430979](C:\Users\Ying Ya\Desktop\image-20191202112430979.png)

### 二 、导入json数据

1.根目录建resource文件夹，将json数据放入resource

2.数据库导入json文件

![](C:\Users\Ying Ya\Desktop\monggo.gif)

### 三 、操作数据库   

models/db.js

```
const mongoose=require('mongoose')
mongoose.connect( 'mongodb://127.0.0.1:27017/shop', {useNewUrlParser: true},(err)=>{
    if(err){throw err};
    console.log("数据库连接成功")
});
module.exports=mongoose;
```

models/goods.js

```
const mongoose = require('./db')
var GoodsSchema =new mongoose.Schema({
    productId:String,
    productName:String,
    salePrice:Number,
    productImage:String,
    productUrl:String
})
var Goods= mongoose.model('Admin',GoodsSchema,'goods')
module.exports=Goods;
```

routes/index.js

```
const router = require('koa-router')()
const GoodsModel=require('../models/goods')
router.get('/', async (ctx) => {
  var data=await GoodsModel.find({});
  ctx.body=data
})
module.exports = router
```

### 四、给前端返回的数据格式

```
{
   //200请求成功  1001没有请求成功
   code:200,
   msg:"请求成功",
   result:data,
    total:17
   //从数据库中请求的数据装到result中 
}
```

```
router.get('/', async (ctx) => {
  var data=await GoodsModel.find({});
  ctx.body={
    code:200,
    msg:"首页数据请求成功",
    result:data,
    total:data.length
  }
})
```

![image-20191202140303832](C:\Users\Ying Ya\Desktop\image-20191202140303832.png)

```
...
const UsersModel=require('../models/users')
//主路由，子路由方式
router.prefix('/users')
//主路由
router.get('/', async (ctx) =>{
  var data=await UsersModel.find({})
  ctx.body={
    code:200,
    msg:"数据请求成功",
    result:data,
  }
})
//子路由
router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})
```

跨域

```
yarn add koa2-cors 
```

```
const cors=require('koa2-cors')
//配置允许跨域的域名
app.use(cors({
  /* 只允许本地地址访问 */
  origin:"http://192.168.14.27:8080"
  /* *  origin:"*" 允许所有地址访问 */
}))
```

### 五、axios-get

1.params传递数据给后端

```
   this.$http({
        url:'/goods/price',
        methods:'get',
        params:{
          gt,lt
        }
      }).then(res=>{
        console.log(res)
      })
```

根据价格大小进行查询

```
<template>
  <div class="home">
      <el-container>
        <el-aside width="200px">
          <h3>通过价格搜索</h3>
          <div v-for="item of searchPrice" :key="item.id">
            <p @click="handlePrice(item.gt,item.lt)">{{item.gt}}--{{item.lt}}</p>            
          </div>
        </el-aside>
        <el-main>
          <h2>商品</h2>
          <div class="item">
            <div v-for="item of goodsList" :key="item.id">
            <img :src="item.productImage" alt="">
            <p>价格：{{item.salePrice}}元</p>
          </div>
          </div>
          
        </el-main>
      </el-container>
  </div>
</template>

<script>
export default {
  name: 'home',
  data(){
    return{
      searchPrice:[
        {gt:0,lt:100,id:1001},
        {gt:100,lt:500,id:1002},
        {gt:500,lt:1000,id:1003},
        {gt:1000,lt:5000,id:1004}
      ],
      goodsList:[]
    }
  },
  mounted(){
    this.$http('goods/list').then(res=>{
     this.goodsList=res.data.result
    })
  },
  methods:{
    handlePrice(gt,lt){
      this.$http({
      //根据价格判断不同商品
        url:'/goods/price',
        methods:'get',
        //get传值
        params:{
          gt,lt
        }
      }).then(res=>{
        console.log(res)
      })
    }
  }
}
</script>
<style scoped>

</style>

```

后台query进行接收get传值

```
router.get("/goods/price",async ctx=>{
  /* 传递给后台的值，用ctx.query接收get传值，即是问号后面的值 */
   var {gt,lt}=ctx.query;
})
```

对数据库进行查询

```
 var data=await GoodsModel.find({salePrice:{$gt:gt,$lt:lt}})
```

对有数据和没有数据的处理

```java
//后台
/* 根据价格大小查询 */
router.get("/goods/price", async ctx => {
  var { gt, lt } = ctx.query;
  var data = await GoodsModel.find({ salePrice: { $gt: gt, $lt: lt } })
  if (data.length) {
    ctx.body = {
      code: 200,
      msg: "数据请求成功",
      result: data,
      total: data.length
    }
  }else{
    ctx.body = {
      code:1001,
      msg:"没有数据"
    }
  }

})
```

前台处理

```
//前台
 methods: {
    handlePrice(gt, lt) {
      console.log(gt, lt);
      this.$http({
        url: "/goods/price",
        method: "get",
        params: {
          gt,
          lt
        }
      }).then(res => {
        if (res.data.code == 200) {
          this.goodsList = res.data.result;
        }else{
          this.goodsList = [];
          this.$message({
            duration:1000,
            message:res.data.msg,
            type: 'warning'
          })
        }
      });
    }
  }
```

### 六、加载首页数据

```
/goods/list
{
    start:0,
    limit：8
}
//1.前端代码实现
//只取八条数据,从第一开始获取
export default {
  data() {
    return {
      limit: 8,
      start: 0,
      goodsList: []
    };
  }
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      this.$http
        .get("/goods/list", {
          //通过params属性传递参数给后端
          params: { start: this.start, limit: this.limit }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.goodsList = res.data.result;
            this.total = Math.ceil(res.data.total / this.limit) * 10;
          }
        });
    }
  }
};
</script>
//后端业务
router.get('/goods/list', async (ctx) => {
  var {start,limit} = ctx.query;
  var total = await GoodsModel.find({}).count();
  var data = await GoodsModel.find({}).skip(Number(start))
  .limit(Number(limit));
  ctx.body = {
    code: 200,
    msg: "首页数据请求成功",
    result: data,
      //给前端设置分页
    total:total
  }
})
```

### 七、分页

```
//前端代码
//total  10为只有1页  为30就有3页
<el-pagination
		   //获取当前处于第几页
            @current-change="getPage"
            class="page"
            background
            layout="prev, pager, next"
            :total="total"
          ></el-pagination>
methods:{
    getPage(page) {
        //改变从哪一个位置开始查询
      this.start = (page - 1) * this.limit;
      this.initData();
	}
}
```

### 八、价格的升序和降序

```
//对goodsList进行升序和降序
//前端代码
<span @click="handleSort">
          价格
          <i class="iconfont">{{(sortFlag==1)?'&#xe62b;':'&#xe62a;'}}</i>
 </span>
methods:{
    compareUp(value) {
      return (a, b) => {
        return a[value] - b[value];
      };
    },
    compareDown(value) {
      return (a, b) => {
        return b[value] - a[value];
      };
    },
    handleSort() {
      this.sortFlag = this.sortFlag == 1 ? -1 : 1;
      if (this.sortFlag == 1) {
        this.goodsList.sort(this.compareUp("salePrice"));
      } else {
        this.goodsList.sort(this.compareDown("salePrice"));
      }
    }
}
```

### 九、根据价格区间进行排序

```
methods:{
    handlePrice(gt,lt){
        this.$http({
            url:'/goods/price',
            method:"get",
            //传递gt,和lt给后台
            params:{
                gt,
                lt
            }
        }).then(res=>{
            if(res.data.code==200){
                this.goodsList = res.data.result;
                this.total = 10;
            }
        })
    },
}
/* 根据价格区间查询 */
router.get("/goods/price", async ctx => {
  var { gt, lt } = ctx.query;
  var data = await GoodsModel.find({ salePrice: { $gt: gt, $lt: lt } })
  if (data.length) {
    ctx.body = {
      code: 200,
      msg: "数据请求成功",
      result: data,
      total: data.length
    }
  }else{
    ctx.body = {
      code:1001,
      msg:"没有数据"
    }
  }

})
```

### 十、默认

```
<el-button @click="handleDefault">默认</el-button>
methods:{
    handleDefault(){
        this.initData()
    }
}
```

### 十一、添加到购物车

```
methods:{
      addCart(productId){
        this.$http({
          method:"post",
          url:'/users/addCart',
          data:{
            productId
          }
        }).then(res=>{
          this.$message({
            message:res.data.msg,
            duration:1000,
            type:"success"
          })
        })
      }
    }
//后端代码
//添加到购物车
router.post('/addCart', async ctx => {
  var userId = "100000077";
  var { productId } = ctx.request.body;
  var goodsData = await GoodsModel.findOne({ productId: productId });
  // productNum,checked
  var obj = JSON.parse(JSON.stringify(goodsData));
  obj.productNum = 1;
  obj.checked = true;
  var userData = await UsersModel.findOne({});
    //看cartList是否有我们要添加的数据
  if (userData.cartList.every(item => item.productId != productId)) {
    await UsersModel.update({ userId: userId }, { $push: { "cartList": obj } })
    ctx.body = {
      msg:"添加成功",
      code:200
    }
  }else{
    ctx.body = {
      msg:"已经添加到购物车",
      code:200
    }
  }
})
```

### 十二 登录模块

###### 7-1 跨域访问服务器上的cookie

```
 1.路由配置cookie,看cookie是否使用成功，在页面控制台application下的cookie看效果
 ctx.cookies.set("name","xiangyingying",{
    maxAge:1000*60,/* cookie的有效时长 */
    httpOnly:false    /* 设置cookie是否可以在客户端读取，false是可以读取,true不可以读取，默认为       true */
    })
```

使用cookie

前端

```
/* 允许http请求携带cookie */
axios.defaults.withCredentials=true
/* 允许跨域访问cookie */
axios.defaults.crossDomain=true
```

后端

```
app.use(cors({
  /* 只允许本地地址访问 */
  origin:"http://192.168.14.27:8080",    /* *  origin:"*" 允许所有地址访问 */
  credentials:true
}))
```

###### 7-2 实现登录功能

```
1.前端获取用户名和密码
2.携带用户名和密码向后端发送给http
3.后端接收用户名和密码
4.数据库对接收的数据进行查询
5.将结果返回给前端
6.前端处理数据
```

前端

```
handleLogin(){
      console.log(this.form)      //1.获取用户名和密码
      if(this.form.username && this.form.pass){
      //2.发送http请求
        this.$http({          
          url:"/users/login",
          method:"post",
          data:{
            userName:this.form.username,
            userPwd:this.form.pass
          }
        }).then(res=>{
          console.log(res)
        })
      }
    }
```

后端

```
router.post('/login',async ctx=>{
  var data=ctx.request.body	        //3.接收userName,userPwd
  var res=await UsersModel.findOne(data);       //4.对数据库做一个查询，将查询到的数据传递给前台
  if(res){
    ctx.body={              //5.返回给前台
      code:200,
      msg:"登录成功"
    }
  }else{
    ctx.body={
      code:400,
      msg:"用户名和密码错误"
    }
  }
})
```

//6.前台处理

```
  if(res.data.code==200){
            this.$message({
              message:res.data.msg,
              type:"success"
            })
          }else{
            this.$message({
              message:res.data.msg,
              type:"error"
            })
      }else{
        this.$message({
          message:"用户名和密码不能为空",
          duration:1000,
          type:"warning"
        })
      }
```

###### 7-3 记录登录状态

1.给成功状态下设置cookie,到Application查看状态

```
router.post('/login',async ctx=>{
  var data=ctx.request.body
  console.log(data)
  var res=await UsersModel.findOne(data);
  console.log(res)
  if(res){
    ctx.cookies.set("userId",res.userId,{
      maxAge:1000*60*60
    })
    ctx.cookies.set("userName",res.userName,{
      maxAge:1000*60*60
    })
  }
})
```

2.设置一个路由检查登录状态

```
router.get('/checkLogin',async ctx=>{
  var userId=ctx.cookies.get("userId");       //获取userId,成功之后获取用户名
  if(userId){
    ctx.body={
      code:200,
      msg:"登录成功",
      result:ctx.cookies.get("userName")
    }
  }else{
    ctx.body={
      code:1001,
      msg:"未登录"
    }
  }
})
```

3.前端mounted()生命周期查看

```
<span>{{successName}}</span>

this.$http('/users/checkLogin').then(res=>{
      if(res.data.code==200){
        this.successName=res.data.result
      }else{
        this.$message({
          message:"未登录"
        })
      }
    })
```

4.到登录里面记录一下登录成功状态

后台

```
...
    ctx.body={
      code:200,
      msg:"登录成功",
      result:res.userName       //成功获取用户名
 ...
```

前台

```
handleLogin(){
      ...
        }).then(res=>{
          if(res.data.code==200){
            this.$message({
              message:res.data.msg,
              type:"success",          
            })
            this.successName=res.data.result       //记录状态
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
```

###### 7-4退出登陆

后台

```
router.post('/loginout',async ctx=>{
  ctx.cookies.set("userId","",{
    maxAge:-1
  })
  ctx.cookies.set("userName","",{
    maxAge:-1
  })
  ctx.body={
    code:200,
    msg:"退出登陆"
  }
})
```

前台

```
 handleLoginout(){
      this.$http.post('/users/loginout').then(res=>{
        this.$message({
          message:res.data.msg,
        })
        this.successName=""
      })
    }
```

###### 7-5 购物车登陆状态时作用

后台  /addCart

```
router.post("/addCart",async ctx=>{
  var userId=ctx.cookies.get("userId");
  if(userId){
    ...
  }
  }else{
    ctx.body={
      msg:"没有登陆"
    }
  }
})
```

###### 7-6 登陆拦截

```
app.use(async (ctx,next)=>{
  console.log(ctx.path)     //前台向后台访问的接口
  //登陆情况下才能访问后端其他接口
  if(ctx.cookies.get("userId")){
    await next()
  }else{
    //白名单  users login  没有登陆的情况下后端有些接口可以访问
    if(ctx.path=="/users/login" || ctx.path=="/goods/list" || ctx.path=="/users/loginout"){
      await next()
    }else{
      //针对价格和未登录时加入购物车
      ctx.body={
        code:1001,
        msg:"未登录"
      }
    }
  }
})
```





