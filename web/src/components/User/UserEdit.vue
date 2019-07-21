<template>
  <div>
    <h1>従業員{{id ? '編集' : '追加'}}</h1>
    <el-form ref="form" :model="form" label-width="130px">
      <el-form-item label="アカウント">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="パスワード">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="権限レベル">
          <el-input-number v-model.number="form.level" @change="handleChange" :min="1" :max="10" label="権限レベル"></el-input-number>
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
      form: {}
    };
  },
  methods: {
    async onSubmit() {
      if (this.id) {
        await this.$http.put("/api/user/" + this.id, this.form);
      } else {
        await this.$http.post("/api/user/", this.form);
      }
      this.$router.push("/user/list");
    },
    async fetch() {
      const res = await this.$http.get("/api/user/" + this.id);
      this.form = res.data.data;
    }
  },
  created() {
    if (this.id) {
      this.id && this.fetch();
    }
  }
};
</script>