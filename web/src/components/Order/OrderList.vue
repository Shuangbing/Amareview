<template>
  <div>
    <h1>注文一覧</h1>

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
          <div>
            <el-tag type="info">JPY</el-tag>
            {{ scope.row.price_order}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="返金予定" width="150">
        <template slot-scope="scope">
          <div>
            <el-tag type="info">CNY</el-tag>
            {{ scope.row.price_refund}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="$router.push('/order/edit/'+scope.row._id)"
            circle
          ></el-button>
          <el-button type="danger" icon="el-icon-delete" @click="remove_order(scope.row._id)" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      style="margin-top: 10px;"
      :current-page="currentPage"
      @current-change="handleCurrentChange"
      layout="prev, pager, next"
      :total="this.dataTotal"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataTotal: 0,
      currentPage: 1,
      items: [],
      status: null
    };
  },
  methods: {
    async handleCurrentChange(currentPage) {
      const res = await this.$http.get("/api/order/page/"+currentPage);
      this.items = res.data.data;
      this.dataTotal = res.data.total;
      this.currentPage = currentPage;
    },
    async fetch() {
      const res = await this.$http.get("/api/order/page/1");
      this.items = res.data.data;
      this.dataTotal = res.data.total;
    },
    async remove_order(id) {
      await this.$http.delete("/api/order/" + id);
      await this.fetch();
    }
  },
  created() {
    this.fetch();
  }
};
</script>