const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors=require('koa2-cors')
const goods = require('./routes/goods')
const users = require('./routes/users')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(cors({
  /* 只允许本地地址访问 */
  origin:"http://192.168.14.27:8080",    /* *  origin:"*" 允许所有地址访问 */
  credentials:true
}))
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})
app.use(async (ctx,next)=>{
  console.log(ctx.path)     //前台向后台访问的接口
  //登陆情况下才能访问后端其他接口
  if(ctx.cookies.get("userId")){
    await next()
  }else{
    //白名单  users login  没有登陆的情况下后端有些接口可以访问
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
// routes
app.use(goods.routes(), goods.allowedMethods())
app.use(users.routes(), users.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
