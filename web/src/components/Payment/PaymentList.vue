<template>
  <div>
    <h1>購入アカウント一覧</h1>

    <el-table :data="items" border style="width: 100%;">
      <el-table-column prop="account" label="アカウント"></el-table-column>
      <el-table-column prop="password" label="パスワード"></el-table-column>
      <el-table-column prop="createdAt" label="作成時間"></el-table-column>

      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="$router.push('/payment/edit/'+scope.row._id)"
            circle
          ></el-button>
          <el-button type="danger" icon="el-icon-delete" @click="remove_payment(scope.row._id)" circle></el-button>
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
      const res = await this.$http.get("/api/payment/page/"+currentPage);
      this.items = res.data.data;
      this.dataTotal = res.data.total;
      this.currentPage = currentPage;
    },
    async fetch() {
      const res = await this.$http.get("/api/payment/page/1");
      this.items = res.data.data;
      this.dataTotal = res.data.total;
    },
    async remove_payment(id) {
      this.$confirm("削除してもよろしいでしょうか", "メッセージ", {
        confirmButtonText: "はい",
        cancelButtonText: "いいえ",
        type: "warning"
      }).then(async () => {
        await this.$http.delete("/api/payment/" + id);
        await this.fetch();
      });
    }
  },
  created() {
    this.fetch();
  }
};
</script>