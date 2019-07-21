<template>
  <el-container style="height: 100vh; boder">
    <el-header style="background-color: rgb(238, 241, 246)">
        <h1>Amazon Review Center</h1>
    </el-header>
    <el-container>
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu
          router
          :default-openeds="$router.path"
          unique-opened
          :default-active="$router.path"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-s-order"></i>注文管理
            </template>
            <el-menu-item-group>
              <template slot="title">注文管理</template>
              <el-menu-item index="/order/list">注文一覧</el-menu-item>
              <el-menu-item index="/order/create">新規注文</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-user"></i>アカウント
            </template>
            <el-menu-item-group>
              <template slot="title">購入方法</template>
              <el-menu-item index="/payment/list">購入アカウント一覧</el-menu-item>
              <el-menu-item index="/payment/create">購入アカウント追加</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-setting"></i>システム管理
            </template>
            <el-menu-item-group>
              <template slot="title">従業員</template>
              <el-menu-item index="/user/list">従業員一覧</el-menu-item>
              <el-menu-item index="/user/create">従業員追加</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="管理者">
              <el-menu-item @click="logout">ログアウト</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
.el-header {
  color: #333;
  line-height: 10px;
}

.el-aside {
  color: #333;
  line-height: 10px;
}
</style>

<script>
export default {
  methods: {
    async logout() {
      localStorage.clear();
      this.$router.push("/login");
    }
  }
};
</script>