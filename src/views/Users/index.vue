<template>
  <div class="app-container">
    <el-tabs v-model="currentTab" type="border-card" class="content-show">
      <el-tab-pane label="用户列表" name="uselist">
        <UserList v-if="currentTab === 'uselist'" />
      </el-tab-pane>
      <el-tab-pane label="角色列表" name="rolelist">
        <RoleList v-if="currentTab === 'rolelist'" />
      </el-tab-pane>
      <el-tab-pane label="权限列表" name="menulist">
        <MenuList v-if="currentTab === 'menulist'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import UserList from './UserList/index'
import RoleList from './RoleList/index'
import MenuList from './MenuList/index'
export default {
  name: 'Users',
  components: {
    UserList,
    RoleList,
    MenuList
  },
  data() {
    return {
      currentTab: 'uselist'
    }
  }
}
</script>
<style lang="scss" scoped>
  .content-show {
    max-height: calc( 100vh - 90px - 40px); // 100vh 减去导航栏高度 减去 padding高度
    overflow-y: auto;
  }
</style>
