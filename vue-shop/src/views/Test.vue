<template>
    <div class="about">
    <h2 class="title">我的购物车</h2>
    <table>
      <thead>
        <tr>
          <th>选择</th>
          <th>商品</th>
          <th>数量</th>
          <th>价格</th>
          <th>小计</th>
          <td>操作</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) of cartList" :key="index">
          <td>
            <van-checkbox checked-color="#FF6700" v-model="item.checked"></van-checkbox>
          </td>
          <td>
            <img :src="item.productImage" />
            <span>{{item.productName}}</span>
          </td>
          <td>
            <van-stepper v-model="item.productNum" integer />
          </td>
          <td>
            <span>{{item.salePrice}}</span>
          </td>
          <td>{{(item.productNum)*(item.salePrice)}}</td>
          <td>
            <el-button type="danger" @click="handleDelete(item.productId)">删除</el-button>
          </td>
        </tr>
      </tbody>
    </table>
    <van-submit-bar :price="sum" button-text="提交订单">
      <van-checkbox v-model="checkAll">全选</van-checkbox>
    </van-submit-bar>
  </div>
</template>

<script>
    export default {
        name:"Test",
        data(){
            return{
                cartList:[]
            }
        },
        mounted(){
            this.$http("/users/cartList").then(res => {
                this.cartList = res.data.result;
                });
        }
    }
</script>

<style  scoped>
    table img {
    width: 100px;
    }
    .title {
    text-align: center;
    line-height: 60px;
    }
    table .van-checkbox {
  margin-left: 20px;
}
table {
  background: #fff;
  border-collapse: collapse;
  width: 100%;
  border: 1px solid #666;

}
</style>