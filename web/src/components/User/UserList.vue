<template>
  <div>
    <h1>従業員一覧</h1>

    <el-table :data="items" border style="width: 100%;">
      <el-table-column prop="username" label="アカウント"></el-table-column>
      <el-table-column prop="level" label="レベル" width="120"></el-table-column>

      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="$router.push('/user/edit/'+scope.row._id)"
            circle
          ></el-button>
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
      const res = await this.$http.get("/api/user/page/"+currentPage);
      this.items = res.data.data;
      this.dataTotal = res.data.total;
      this.currentPage = currentPage;
    },
    async fetch() {
      const res = await this.$http.get("/api/user/page/1");
      this.items = res.data.data;
      this.dataTotal = res.data.total;
    }
  },
  created() {
    this.fetch();
  }
};
</script>