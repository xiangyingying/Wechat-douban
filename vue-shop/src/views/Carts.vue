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
            <van-checkbox 
            @change="onChange(item)"
            checked-color="#FF6700" v-model="item.checked"></van-checkbox>
          </td>
          <td>
            <img :src="item.productImage" />
            <span>{{item.productName}}</span>
          </td>
          <td>
            <van-stepper
             @change="onChange(item)"
             v-model="item.productNum" integer />
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
    <van-submit-bar :price="sum" button-text="提交订单" :disabled="sum?false:true">
      <van-checkbox v-model="checkAll">全选</van-checkbox>
    </van-submit-bar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: 1,
      cartList: []
    };
  },
  methods: {
    handleDelete(productId) {
      console.log(productId);
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true
      })
        .then(() => {
          this.$http
            .post("/users/cartList/del", {
              productId
            })
            .then(res => {
              console.log(res);
              this.initData();
            });
        })
        .catch(() => {});
    },
    initData() {
      this.$http("/users/cartList").then(res => {
        this.cartList = res.data.result;
      });
    },
    async onChange(item){
      var {productNum,productId,checked} = item;
      await this.$http.post('/users/cartList/edit',{
        productNum,
        productId,
        checked
      })
    }
  },
  mounted() {
    this.initData();
  },
  computed: {
    checkAll: {
      /* products值变化时会重新计算 */
      get() {
        return this.cartList.every(item => item.checked);
      },
      set(val) {
        //给checkbox赋值的时候触发
        this.cartList.forEach(item => (item.checked = val));
      }
    },
    sum() {
      /* sum的值会被缓存,如果依赖的数据没有变化不会重新执行 */
      var total = 0;
      this.cartList.forEach(item => {
        if (item.checked) {
          total = item["productNum"] * item["salePrice"] + total;
        }
      });
      return total * 100;
    }
  }
};
</script>
<style scoped>
.title {
  text-align: center;
  line-height: 60px;
}
table >>> .van-checkbox {
  margin-left: 20px;
}
table {
  background: #fff;
  border-collapse: collapse;
  width: 100%;
  border: 1px solid #666;
  border-radius: 15px;
  margin: 0 auto;
  /* display: block; */
  text-align: center;
}
table img {
  width: 100px;
}
table th {
  text-align: center;
}
.about > .van-submit-bar {
  padding: 0 20px;
}
.about >>> .van-checkbox__icon .van-icon {
  border-color: #ff6700 !important;
}
table >>> .van-stepper .van-stepper__input {
  width: 40px !important;
}
thead {
  background: #333;
  color: #fff;
  line-height: 50px;
}
tbody tr {
  line-height: 100px;
}
</style>