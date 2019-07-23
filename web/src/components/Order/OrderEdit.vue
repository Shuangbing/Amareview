<template>
  <div>
    <h1>注文{{id ? '編集' : '追加'}}</h1>
    <div v-if="id" style="margin: 10px 0 20px 0;">
      <el-steps :active="form.status">
        <el-step title="支払待ち" :icon="this.icon[1]"></el-step>
        <el-step title="受取待ち" :icon="this.icon[2]"></el-step>
        <el-step title="評価待ち" :icon="this.icon[3]"></el-step>
        <el-step title="反映待ち" :icon="this.icon[4]"></el-step>
        <el-step title="返金待ち" :icon="this.icon[5]"></el-step>
        <el-step title="完了" :icon="this.icon[6]"></el-step>
      </el-steps>
    </div>
    <el-form ref="form" :model="form" label-width="130px">
      <el-form-item v-if="id" label="作成時間">
        <el-tag>{{form.createdAt}}</el-tag>
      </el-form-item>
      <el-form-item v-if="id" label="最終更新">
        <el-tag>{{form.updatedAt}}</el-tag>
      </el-form-item>
      <el-form-item label="商品名">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="ASIN">
        <el-input v-model="form.asin"></el-input>
      </el-form-item>
      <el-form-item label="注文番号">
        <el-input v-model="form.order_id"></el-input>
      </el-form-item>
      <el-form-item label="購入金額">
        <el-input v-model.number="form.price_order" type="number"></el-input>
      </el-form-item>
      <el-form-item label="返金金額">
        <el-input type="number" v-model="form.price_refund" v-bind:value="this.form.price_order*this.rate"></el-input>
      </el-form-item>
      <el-form-item label="注文方法">
        <el-select v-model="form.payment" placeholder="注文方法">
          <el-option
            v-for="item in payment_list"
            :key="item._id"
            :label="item.account"
            :value="item._id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出品者連絡先">
        <el-input v-model="form.seller"></el-input>
      </el-form-item>
      <el-form-item label="ステータス">
        <el-select v-model="form.status" placeholder="ステータス">
          <el-option
            v-for="item in status_options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="コメント">
        <el-input type="textarea" :rows="4" placeholder="コメント" v-model="form.comment"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{id ? '編集' : '新規追加'}}</el-button>
        <el-button @click="$router.go(-1)">戻る</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    id: {}
  },
  data() {
    return {
      form: {},
      rate: 0,
      payment_list: {},
      icon: {
        1: "el-icon-sold-out",
        2: "el-icon-box",
        3: "el-icon-s-comment",
        4: "el-icon-s-promotion",
        5: "el-icon-bank-card",
        6: "el-icon-success"
      },
      status_options: [
        {
          value: 1,
          label: "支払待ち"
        },
        {
          value: 2,
          label: "受取待ち"
        },
        {
          value: 3,
          label: "評価待ち"
        },
        {
          value: 4,
          label: "反映待ち"
        },
        {
          value: 5,
          label: "返金待ち"
        },
        {
          value: 6,
          label: "完了"
        }
      ]
    };
  },
  methods: {
    changeRefundPrice(){
      alert('good')
      this.form.price_refund = 100;
    },
    async onSubmit() {
      if (this.id) {
        await this.$http.put("/api/order/" + this.id, this.form);
      } else {
        await this.$http.post("/api/order/", this.form);
      }
      this.$router.push("/order/list");
    },
    async fetch() {
      const res = await this.$http.get("/api/order/" + this.id);
      const res_rate = await this.$http.get("/api/order/rate");
      this.form = res.data.data;
      this.rate = res_rate.data.data.rate;
    }
  },
  async created() {
    const res2 = await this.$http.get("/api/payment");
    this.payment_list = res2.data.data
    if (this.id) {
      this.id && this.fetch();
    }
  }
};
</script>