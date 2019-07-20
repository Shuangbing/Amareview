<template>
  <div>
    <h1>
      <el-page-header content="注文一覧"></el-page-header>
    </h1>

    <el-table :data="items" border style="width: 100%;">
      <el-table-column label="商品名">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.status==1" type="info">支払待ち</el-tag>
            <el-tag v-if="scope.row.status==2" type="info">受取待ち</el-tag>
            <el-tag v-if="scope.row.status==3" type="info">評価待ち</el-tag>
            <el-tag v-if="scope.row.status==4" type="warning">反映待ち</el-tag>
            <el-tag v-if="scope.row.status==5" type="warning">返金待ち</el-tag>
            <el-tag v-if="scope.row.status==6" type="success">完了</el-tag>
            {{scope.row.title}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="asin" label="ASIN" width="200"></el-table-column>
      <el-table-column prop="seller" label="出品者連絡先" width="200"></el-table-column>
      <el-table-column label="購入価格" width="150">
        <template slot-scope="scope">
          <div><el-tag type="info">JPY</el-tag> {{ scope.row.price_order}}</div>
        </template>
      </el-table-column>
      <el-table-column label="返金予定" width="150">
        <template slot-scope="scope">
          <div><el-tag type="info">CNY</el-tag> {{ scope.row.price_refund}}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="$router.push('/order/edit/'+scope.row._id)" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" @click="delete1(scope.row._id)" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
      status: null
    };
  },
  methods: {
    async fetch() {
      const res = await this.$http.get("/api/order");
      this.items = res.data.data;
    },
    async delete1(id) {
        await this.$http.delete("/api/order/"+id);
        await this.fetch()
    }
  },
  created() {
    this.fetch();
  }
};
</script>