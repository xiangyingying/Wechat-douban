###  购物车模块

#### 一 购物车路由,对数据库查询

```
router.get('/cartList',async ctx=>{
  var data=await UsersModel.findOne({})
  var res=data.cartList;
  ctx.body={
    code:200,
    result:res
  }
})
```

#### 二 路由拦截

登陆情况下才能访问后端其他接口，可以设置白名单，在未登录的情况下后端有些接口可以访问

```
app.use(async (ctx,next)=>{
  console.log(ctx.path)     //前台向后台访问的接口
  if(ctx.cookies.get("userId")){
    await next()
  }else{
    //白名单  users/login 
    if(ctx.path=="/users/login" || ctx.path=="/goods/list" || ctx.path=="/users/loginout" || ctx.path=="/users/cartList"){
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

#### 三 路由守卫

前端，放在主路由里面,和路由拦截差不多，需要在登陆的情况下访问

```
  beforeRouteLeave (to,from,next) {
      this.$http('/usrs/checkLogin').then(res=>{
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
```

#### 四 删除

后端

```
router.post('/cartList/del',async ctx=>{
  var {productId}=ctx.request.body;
  var userId=ctx.cookies.get("userId");
  var data=await UsersModel.update({userId:userId},{$pull:{cartList:{productId:productId}}})
  if(data.ok==1){
    ctx.body={
      code:200,
      msg:"删除成功"
    }
  }else{
    ctx.body={
      code:101,
      msg:"删除失败"
    }
  }
})
```

前端

```
handleDelete(productId){
       this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
         this.$http.post("/users/cartList/del",{
            data:{
              productId
            }
          }).then(res=>{
            console.log(res)
              this.initData()        
          }) 
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
```

#### 五 购物车的修改

```
//$set
//前台的代码  tips 传递item
<van-stepper
             @change="onChange(item)"
             v-model="item.productNum" integer />
         
methods:{
    async onChange(item){
      var {productNum,productId,checked} = item;
      await this.$http.post('/users/cartList/edit',{
        productNum,
        productId,
        checked
      })
    }
}
//后台代码
router.post('/cartList/edit',async ctx=>{
  var {productNum,productId,checked} =  ctx.request.body;
  var userId = ctx.cookies.get("userId");
  var data  = await UsersModel.update(
    {userId:userId,"cartList.productId":
    productId},{$set:{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked
  }});
  if(data.ok==1){
    ctx.body ={
      msg:"修改成功",
      code:200
    }
  }
})
```