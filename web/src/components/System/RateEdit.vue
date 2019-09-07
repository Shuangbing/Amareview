<template>
  <div>
    <h1>レート更新</h1>
    <el-form ref="form" :model="form" label-width="130px">
      <el-form-item label="レート">
        <el-input v-model="form.rate"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">更新</el-button>
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
      form: {}
    };
  },
  methods: {
    async onSubmit() {
      await this.$http.post("/api/system/rate", this.form);
    },
    async fetch() {
      const res = await this.$http.get("/api/system/rate");
      this.form = res.data.data;
    }
  },
  created() {
    this.fetch();
  }
};
</script>