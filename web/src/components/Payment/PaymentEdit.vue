<template>
  <div>
    <h1>注文アカウント{{id ? '編集' : '追加'}}</h1>
    <el-form ref="form" :model="form" label-width="130px">
      <el-form-item label="アカウント">
        <el-input v-model="form.account"></el-input>
      </el-form-item>
      <el-form-item label="パスワード">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="タイプ">
        <el-select v-model="form.type" placeholder="タイプ">
          <el-option
            v-for="item in [{value: 1, label: 'アマゾン'}]"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="コメント">
        <el-input type="textarea" :rows="4" placeholder="コメント" v-model="form.comment"></el-input>
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
        await this.$http.put("/api/payment/" + this.id, this.form);
      } else {
        await this.$http.post("/api/payment/", this.form);
      }
      this.$router.push("/payment/list");
    },
    async fetch() {
      const res = await this.$http.get("/api/payment/" + this.id);
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