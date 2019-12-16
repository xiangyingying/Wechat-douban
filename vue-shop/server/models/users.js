var mongoose = require('./db');
var UserSchema = new mongoose.Schema({
    userId:String,
    userName:String,
    userPwd:String,
    orderList:Array,
    /* 为了和goodsList里面的数据进行映射 字段的类型需要一样*/
    cartList:[
        {
            productImage:String,
            salePrice:Number,
            productName:String,
            productId:String,
            productNumber:Number,
            checked:{
                type:Boolean,
                default:true
            }
        }
    ],
    addressList:Array
})
var Users =  mongoose.model('Users',UserSchema,'users');
module.exports = Users;