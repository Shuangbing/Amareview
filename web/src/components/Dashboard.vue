
<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>注文数</span>
        </div>
        <div class="text item">{{items.orderSUM}}</div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>返金待ち注文数</span>
        </div>
        <div class="text item">{{items.waitRefund_SUM}}</div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>返金待ち金額(JPY)</span>
        </div>
        <div class="text item">1230円</div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>返金待ち金額(CNY)</span>
        </div>
        <div class="text item">1230円</div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return{
      items: []
    }
  },
  methods: {
    async fetch() {
      const res = await this.$http.get("/api/dashboard");
      this.items = res.data.data;
    }
  },
  created() {
    this.fetch();
  }
}
</script>

<style>
.text {
  font-size: 40px;
}

.item {
  margin-bottom: 100px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>