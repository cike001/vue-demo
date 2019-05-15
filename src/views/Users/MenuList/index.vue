<template>
  <div class="app-container menu-list-container">
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
    <div class="add-menu-wrap clearfix">
      <el-button class="add-btn" type="primary" @click="showEditOrAddDalog(false)">新增权限</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" border class="userlis-table">
      <el-table-column label="序号" align="center" type="index" width="60">
      </el-table-column>
      <el-table-column label="权限名称" align="center" prop="name">
      </el-table-column>
      <el-table-column label="url" align="center" prop="route">
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="success">启用</el-tag>
          <el-tag v-if="scope.row.status === 0" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="ismenu" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.ismenu === 1" type="info">菜单</el-tag>
          <el-tag v-if="scope.row.ismenu === 0">api</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="上级资源" prop="parent_name" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.parent_name">{{ scope.row.parent_name }}</el-tag>
          <el-tag v-else type="info">顶级资源</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否展示" prop="show" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.show === 1" type="success">展示</el-tag>
          <el-tag v-if="scope.row.show === 0" type="danger">隐藏</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="菜单组件名称" prop="component_name" align="center">
      </el-table-column>
      <el-table-column label="路由名称名称" prop="route_name" align="center">
      </el-table-column>
      <el-table-column label="排序" prop="sort" align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="160px">
        <template slot-scope="scope">
          <el-button size="mini" @click="showEditOrAddDalog(scope.row, scope.$index, )">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row, scope.$index, )">删除</el-button>
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
      <el-form :model="EditOrAdd" label-width="120px" :rules="rules" ref="authForm">
        <el-form-item label="权限名称" prop="name">
          <el-input v-model.trim="EditOrAdd.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="url" prop="route">
          <el-input v-model.trim="EditOrAdd.route" placeholder="url"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="EditOrAdd.status" placeholder="请选择">
            <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in [{label: '启用', value: 1}, {label: '禁用', value: 0}]"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="ismenu">
          <el-select v-model="EditOrAdd.ismenu" placeholder="请选择" @change="authtypechange(EditOrAdd.ismenu)">
            <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in [{label: '菜单', value: 1}, {label: 'api', value: 0}]"></el-option>
          </el-select>
        </el-form-item>
        <template v-if="EditOrAdd.ismenu === 1">
          <el-form-item label="上级资源" prop="parent_name">
            <el-tag style="cursor: pointer;" type="info" @click.native="treeShow = true" @close="treeShow = true" closable>{{ EditOrAdd.parent_name || '请选择上级资源' }}</el-tag>
            <transition name="fade">
              <div class="auth_rules-wrap" v-show="treeShow">
                <div class="auth-tree-wrap">
                  <div class="close-btn clearfix" >
                    <i class="el-icon el-icon-close" @click="treeShow = false"></i>
                  </div>
                  <div class="tree-parent">
                    <el-tree
                      ref="menutree"
                      @check-change="handleNodeClick"
                      :data="menuAll"
                      :default-expand-all="true"
                      :check-on-click-node="true"
                      :expand-on-click-node="false"
                      show-checkbox
                      :check-strictly="true"
                      node-key="id"
                      :props="{
                        children: 'children',
                        label: 'name'
                    }">
                    </el-tree>
                  </div>
                </div>
              </div>
            </transition>
          </el-form-item>
          <el-form-item label="菜单图标" prop="icon">
            <!-- <el-input v-model.trim="EditOrAdd.icon" placeholder="请输入菜单图标"></el-input> -->
            <el-autocomplete
              class="inline-input"
              v-model="EditOrAdd.icon"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容">
              <template slot-scope="{ item }">
                <svg-icon :icon-class="item.value" />
                <span>{{ item.value }}</span>
              </template>
            </el-autocomplete>
            <!-- <svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" /> -->
          </el-form-item>
          <el-form-item label="是否展示" prop="show">
            <el-select v-model="EditOrAdd.show" placeholder="请选择">
              <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in [{label: '展示', value: 1}, {label: '隐藏', value: 0}]"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单组件名称" prop="component_name">
            <el-select v-model="EditOrAdd.component_name" placeholder="请选择">
              <el-option :label="item" :value="item" :key="item" v-for="item in componentName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="路由名称" prop="route_name">
            <el-input v-model.number="EditOrAdd.route_name" placeholder="请输入路由名称(不能重复,否则路由功能将失效)"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model.number="EditOrAdd.sort" placeholder="请输入排序"></el-input>
          </el-form-item>
        </template>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditOrAddDalogShow = false">取 消</el-button>
        <el-button type="primary" @click="closeEditOrAddDalog('authForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { ruleadd, ruleupdate, getmenuall, ruledelete } from '@/api/userList'
import { asyncRouterMap } from '@/router'
import { buildTree } from '@/utils/auth'
import paginationMixin from '@/views/mixin/pagination'
import { clearObjVal } from '@/utils/helper'
import { svgs } from '@/utils/svg-lib'

export default {
  name: 'MenuList',
  mixins: [paginationMixin],
  data() {
    return {
      ruleList: [], // 菜单列表
      rules: {},
      componentName: Object.keys(asyncRouterMap),
      treeShow: false,
      menuAll: [], // 新增/修改 获取全部菜单列表
      currentOperationTitle: ['新增权限', '编辑权限'],
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
    // handleSelect(item) {
    //   console.log(item, this.EditOrAdd.icon)
    // },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    querySearch(queryString, cb) {
      const restaurants = [...svgs]
      const results = queryString ? svgs.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    // 删除
    handleDelete(row, index) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ruledelete({ id: row.id }).then(res => {
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
    // 权限下拉选择触发 修改验证规则
    authtypechange(type) {
      if (type === 1) {
        this.rules = {
          route: [{ required: true, message: '请填写url', trigger: 'blur' }],
          name: [{ required: true, message: '请填写权限名称', trigger: 'blur', min: 1, max: 200 }],
          ismenu: [{ required: true, message: '请选权限择类型', trigger: 'change' }],
          status: [{ required: true, message: '请选择状态', trigger: 'change' }],
          parent_name: [{ required: true, message: '请选择上级资源', trigger: 'change' }],
          component_name: [{ required: true, message: '请选择菜单组件名称', trigger: 'change' }],
          route_name: [{ required: true, message: '请输入路由名称', trigger: 'blur' }],
          icon: [{ required: true, message: '请输入icon', trigger: ['blur', 'change'], min: 1, max: 200 }],
          show: [{ required: true, message: '请选择是否展示菜单', trigger: 'change' }],
          sort: [{ required: true, message: '请输入菜单排序', trigger: 'blur' }, { type: 'number', message: '排序必须为数字值' }]
        }
      } else {
        this.rules = {
          route: [{ required: true, message: '请填写url', trigger: 'blur', min: 1, max: 200 }],
          name: [{ required: true, message: '请填写权限名称', trigger: 'blur', min: 1, max: 200 }],
          ismenu: [{ required: true, message: '请选权限择类型', trigger: 'change' }],
          status: [{ required: true, message: '请选择状态', trigger: 'change' }]
        }
      }
    },
    // 强制只能选择一个节点
    handleNodeClick(data, selfwhetherchecked) {
      if (selfwhetherchecked) {
        if (this.EditOrAdd.id === data.id) {
          this.$refs.menutree.setChecked(data.id, false)
          this.$message.error('不能选择自己作为上级资源')
          return
        }
        this.$set(this.EditOrAdd, 'parent_name', data.name)
        this.EditOrAdd.parent_id = data.id
        const nodes = this.$refs.menutree.getCheckedKeys()
        if (nodes && nodes.length > 1) {
          const temp = [...nodes]
          const index = temp.indexOf(data.id)
          if (index !== -1) {
            temp.splice(index, 1)
            for (const id of temp) {
              this.$refs.menutree.setChecked(id, false)
            }
          }
        }
      }
    },
    // 展示新增编辑信息框
    showEditOrAddDalog(row, index) {
      if (row) {
        this.currentOperation = 1
        this.EditOrAdd = Object.assign({}, row)
        this.authtypechange(row.ismenu)
      } else {
        this.EditOrAdd = {}
        this.currentOperation = 0
        this.authtypechange()
      }
      getmenuall({
        ismenu: 1
      }).then(res => {
        res.data.rules.unshift({
          id: 999999,
          parent_id: 0,
          name: '顶级资源'
        })
        this.menuAll = buildTree(res.data.rules)
        this.EditOrAddDalogShow = true
      }
      ).catch(err => {
        console.log(err)
      })
    },
    // 更新
    UserUpdate(data) {
      ruleupdate(data).then(res => {
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
      ruleadd(data).then(res => {
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
    closeEditOrAddDalog(flag) {
      this.$refs[flag].validate(async(valid) => {
        if (valid) {
          const data = Object.assign({}, this.EditOrAdd)
          this.EditOrAdd.parent_id = this.EditOrAdd.parent_id === 999999 ? 0 : this.EditOrAdd.parent_id
          this.jumpUpdateOrAdd(data)
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
      getmenuall(data).then(res => {
        this.tableData = res.data.rules
        this.pagination.total = res.data.total
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .menu-list-container {
    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
      opacity: 0;
    }
    .add-menu-wrap {
      padding-bottom: 20px;
      .add-btn {
        float: right;
      }
    }
    .auth_rules-wrap {
      width: 60%;
      border-radius: 5px;
      border: 1px solid #ccc;
      margin-top: 10px;
      .auth-tree-wrap {
        padding: 10px;
        .tree-parent {
          min-height: 200px;
          max-height: 200px;
          overflow-y: auto;
        }
      }
      .close-btn {
        padding: 0 0 20px 0;
        .el-icon-close {
          float: right;
          cursor: pointer;
        }
      }
    }

  }
</style>
