<template>
  <div class="app-container role-list-container">
    <div class="search-operation-wrap">
      <el-form :inline="true" :model="searchFormInput" >
        <el-form-item label="状态">
          <el-select v-model="searchFormInput.status" placeholder="请选择">
            <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in [{label: '启用', value: 1}, {label: '禁用', value: 0}, {label: '全部', value: null}]"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="serach">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="add-role-wrap clearfix">
      <el-button class="add-btn" type="primary" @click="showEditOrAddDalog(false)">新增角色</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" border class="userlis-table">
      <el-table-column label="序号" align="center" type="index" width="60">
      </el-table-column>
      <el-table-column label="角色名称" align="center" prop="title">
      </el-table-column>
      <el-table-column label="菜单权限列表" align="center" prop="auth_rules">
        <template slot-scope="scope">
          <el-tag v-for="item in scope.row.sys_permissions" :key="item.name" style="margin:5px;">{{ item.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="success">启用</el-tag>
          <el-tag v-if="scope.row.status === 0" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160px">
        <template slot-scope="scope">
          <el-button size="mini" @click="showEditOrAddDalog(scope.row, scope.$index, )">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-wrap">
      <el-pagination
        ref="paginationdom"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total">
      </el-pagination>
    </div>
    <el-dialog
      :title="currentOperationTitle[currentOperation]"
      :visible.sync="EditOrAddDalogShow"
      v-if="EditOrAddDalogShow"
      width="60%">
      <el-form :model="EditOrAdd" label-width="100px" :rules="rules" ref="ruleForm">
        <el-form-item label="角色名称" prop="title">
          <el-input v-model.trim="EditOrAdd.title" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单权限" prop="auth_rules">
          <div class="auth_rules-wrap">
            <el-tree
              ref="menutree"
              @check-change="handleNodeClick"
              :data="ruleList"
              :check-on-click-node="true"
              :expand-on-click-node="false"
              :default-expanded-keys="EditOrAdd.auth_rules"
              :default-checked-keys="EditOrAdd.auth_rules"
              show-checkbox
              :check-strictly="true"
              node-key="id"
              :props="{
                children: 'children',
                label: 'name'
            }">
            </el-tree>
          </div>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="EditOrAdd.status" placeholder="请选择">
            <el-option v-for="item in [{label: '启用', value: 1}, {label: '禁用', value: 0}]" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditOrAddDalogShow = false">取 消</el-button>
        <el-button type="primary" @click="closeEditOrAddDalog('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getrolelist, roleadd, roleupdate, getmenuall, roledelete } from '@/api/userList'
import { buildTree } from '@/utils/auth'
import paginationMixin from '@/views/mixin/pagination'
import { clearObjVal } from '@/utils/helper'

export default {
  name: 'RoleList',
  mixins: [paginationMixin],
  data() {
    return {
      ruleList: [], // 菜单列表
      rules: {
        title: [{ required: true, message: '请填写角色名称', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      currentOperationTitle: ['新增角色', '编辑角色'],
      currentOperation: 0, // 当前操作名称  0是新增 1是编辑
      tableData: [],
      EditOrAdd: {}, // 新增/编辑信息
      EditOrAddDalogShow: false,
      searchFormInput: {
        status: null
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    // 删除
    handleDelete(row, index) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        roledelete({ id: row.id }).then(res => {
          this.init()
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        }).catch(err => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 子节点选中的强制选中父节点
    handleNodeClick(data, selfwhetherchecked) { // 节点所对应的对象、节点本身是否被选中
      if (!selfwhetherchecked) {
        for (const child of data.children) { // 取消父节点选中的话 就把下面所有的子节点全部取消选中 子节点被取消选中的时候也会触发本事件
          this.$refs.menutree.setChecked(child.id, false, true)
        }
      }
      if (selfwhetherchecked && data.parent_id) { // 选中子节点的话 父就将父节点也选中
        this.$refs.menutree.setChecked(data.parent_id, true)
      }
    },
    // 展示新增编辑信息框
    showEditOrAddDalog(row, index) {
      if (row) {
        this.currentOperation = 1
        this.EditOrAdd = Object.assign({}, row)
        this.EditOrAdd.auth_rules = []
        row.sys_permissions.map(item => {
          this.EditOrAdd.auth_rules.push(item.id)
        })
      } else {
        this.EditOrAdd = {}
        this.currentOperation = 0
      }
      getmenuall({
        ismenu: 1
      }).then(res => {
        this.ruleList = buildTree(res.data.rules)
        this.EditOrAddDalogShow = true
      }
      ).catch(err => {
        console.log(err)
      })
    },
    // 更新
    UserUpdate(data) {
      roleupdate(data).then(res => {
        this.$message({
          message: '更新成功',
          type: 'success'
        })
        this.paginationReset()
        this.init()
        this.EditOrAddDalogShow = false
      }).catch(err => {
        console.log(err)
      })
    },
    // 新增
    UserAdd(data) {
      roleadd(data).then(res => {
        this.$message({
          message: '新增成功',
          type: 'success'
        })
        this.paginationReset()
        this.init()
        this.EditOrAddDalogShow = false
      }).catch(err => {
        console.log(err)
      })
    },
    // 根据状态跳转请求
    jumpUpdateOrAdd(data) {
      if (this.currentOperation === 0) {
        this.UserAdd(data)
      } else if (this.currentOperation === 1) {
        this.UserUpdate(data)
      }
    },
    // 关闭信息框
    closeEditOrAddDalog(form) {
      this.$refs[form].validate(async(valid) => {
        if (valid) {
          const data = Object.assign({}, this.EditOrAdd)
          const menus = this.$refs.menutree.getCheckedKeys()
          data.menus = menus
          if (menus.length > 0) {
            this.jumpUpdateOrAdd(data)
            return false
          }
          this.$confirm('您未选择菜单，提交后此账号将不能正确进入后台系统, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.jumpUpdateOrAdd(data)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消提交'
            })
          })
        } else {
          this.$message.error('请正确填写信息后再提交')
        }
      })
    },
    serach() {
      this.init(this.searchFormInput)
    },
    init(para) {
      const data = clearObjVal(para, {
        offset: this.pagination.currentPage,
        limit: this.pagination.pageSize
      })
      getrolelist(data).then(res => {
        this.tableData = res.data.roles
        this.pagination.total = res.data.total
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .role-list-container {
    .add-role-wrap {
      padding-bottom: 20px;
      .add-btn {
        float: right;
      }
    }
    .auth_rules-wrap {
      border: 1px solid #ccc;
      border-radius: 5px;
      padding: 10px;
      max-height: 200px;
      min-height: 200px;
      overflow-y: scroll;
    }
  }
</style>
