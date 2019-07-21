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
      const res = await this.$http.get("/api/user");
      this.items = res.data.data;
    }
  },
  created() {
    this.fetch();
  }
};
</script>