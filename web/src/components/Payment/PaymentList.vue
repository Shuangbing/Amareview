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
      const res = await this.$http.get("/api/payment");
      this.items = res.data.data;
    },
    async delete1(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          await this.$http.delete("/api/payment/"+id);
          await this.fetch();
        })
        
    }
  },
  created() {
    this.fetch();
  }
};
</script>