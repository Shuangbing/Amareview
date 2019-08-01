<template>
  <div>
    <h1>注文一覧</h1>

    <el-table :data="items" border style="width: 100%;">
      <el-table-column label="商品名">
        <template slot-scope="scope">
          <div>
            <el-popover placement="right" trigger="click">
              <el-select
                v-model="scope.row.status"
                placeholder="注文状態更新"
                @change="update_order_status(scope.row._id, scope.row.status)"
              >
                <el-option
                  v-for="item in status_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-tag v-if="scope.row.status==1" type="info" slot="reference">支払待ち</el-tag>
              <el-tag v-if="scope.row.status==2" type="info" slot="reference">受取待ち</el-tag>
              <el-tag v-if="scope.row.status==3" type="info" slot="reference">評価待ち</el-tag>
              <el-tag v-if="scope.row.status==4" type="warning" slot="reference">反映待ち</el-tag>
              <el-tag v-if="scope.row.status==5" type="warning" slot="reference">返金待ち</el-tag>
              <el-tag v-if="scope.row.status==6" type="success" slot="reference">完了</el-tag>
            </el-popover>
            {{scope.row.title|ellipsis}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="asin" label="ASIN"></el-table-column>
      <el-table-column prop="seller" label="出品者連絡先"></el-table-column>
      <el-table-column label="購入価格">
        <template slot-scope="scope">
          <div>
            <el-tag type="info">JPY</el-tag>
            {{ scope.row.price_order}}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="返金予定">
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
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="remove_order(scope.row._id)"
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
  filters: {
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 30) {
        return value.slice(0, 30) + "...";
      }
      return value;
    }
  },
  data() {
    return {
      dataTotal: 0,
      currentPage: 1,
      items: [],
      status: null,
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
    async handleCurrentChange(currentPage) {
      const res = await this.$http.get("/api/order/page/" + currentPage);
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
    },
    async update_order_status(id, status) {
      await this.$http.put("/api/order/status/" + id, { status: status });
    }
  },
  created() {
    this.fetch();
  }
};
</script>