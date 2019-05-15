<template>
  <div class="app-container user-list-container">
    <div class="search-operation-wrap">
      <el-form :inline="true" :model="searchFormInput" >
        <el-form-item label="账号">
          <el-input v-model.trim="searchFormInput.username" placeholder="账号"></el-input>
        </el-form-item>
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
    <div class="add-user-wrap clearfix">
      <el-button type="primary" class="add-btn" @click="showUserInfoDalog(false)">新增用户</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" border class="userlis-table">
      <el-table-column label="序号" align="center" type="index" width="60">
      </el-table-column>
      <el-table-column label="账号" align="center" prop="username">
      </el-table-column>
      <el-table-column label="昵称" align="center" prop="nickname">
      </el-table-column>
      <el-table-column label="角色" align="center" prop="title">
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="success">启用</el-tag>
          <el-tag v-if="scope.row.status === 0" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="用户头像" prop="userimg" align="center">
        <template slot-scope="scope">
          <div class="img-wrap img-center-show">
            <img :src="scope.row.userimg" alt="" class="img-full-show" >
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="created_at">
        <template slot-scope="scope">
          {{ [scope.row.created_at, 'YYYY-MM-DD HH:mm:ss'] | dateForm }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160px">
        <template slot-scope="scope">
          <el-button size="mini" @click="showUserInfoDalog(scope.row, scope.$index, )">编辑</el-button>
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
      :visible.sync="userInfoDalogShow"
      v-if="userInfoDalogShow"
      width="60%">
      <el-form :model="userInfo" label-width="100px" :rules="rules" ref="ruleForm">
        <el-form-item label="账号" prop="username">
          <el-input v-model.trim="userInfo.username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.trim="userInfo.password" :placeholder="passwordPlacehod"></el-input>
        </el-form-item>
        <el-form-item label="用户头像" prop="userimg">
          <div class="img-wrap img-cursor-pointer" @click="userimgUploadclick">
            <img :src="userInfo.userimg" alt="" class="img-full-show" v-if="userInfo.userimg" >
            <div class="img-upload-ico" v-else >+</div>
            <input type="file" ref="userimguload" @change="userimgTobase64" style="display: none" accept="image/png,image/gif,image/jpeg">
          </div>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model.trim="userInfo.nickname" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="userInfo.status" placeholder="请选择">
            <el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in [{label: '启用', value: 1}, {label: '禁用', value: 0}]"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="group_id">
          <el-select v-model="userInfo.group_id" placeholder="请选择">
            <el-option :label="item.title" :value="item.id" :key="item.id" v-for="item in group_List"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userInfoDalogShow = false">取 消</el-button>
        <el-button type="primary" @click="closeUserInfoDalog('ruleForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getusers, userupdate, useradd, uploadimg, getrolelist, userdelete } from '@/api/userList'
import paginationMixin from '@/views/mixin/pagination'
import { validateUsername, validatePassword, validBse64, validpassWord } from '@/utils/validate'
import { clearObjVal } from '@/utils/helper'

export default {
  name: 'UserList',
  mixins: [paginationMixin],
  data() {
    return {
      group_List: [], // 角色列表
      rules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        userimg: [{ required: true, message: '请上传头像', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
        group_id: [{ required: true, message: '请选择角色', trigger: 'change' }],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      passwordPlacehod: '',
      currentOperationTitle: ['新增用户', '编辑用户'],
      currentOperation: 0, // 当前操作名称  0是新增 1是编辑
      tableData: [],
      userInfo: {}, // 新增/编辑用户信息
      userInfoDalogShow: false,
      searchFormInput: {
        username: undefined,
        status: undefined
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
        userdelete({ id: row.id }).then(res => {
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
    // 用户头像上传点击事件
    userimgUploadclick() {
      this.$refs.userimguload.click()
    },
    // 用户头像转换base64预览
    userimgTobase64(e) {
      const file = e.target.files[0]
      if (!file) {
        return
      }
      if (file.size > (2 * 1024 * 1024)) {
        this.$message.error('请选择2M以内的图片')
        return
      }
      const site = file.name.indexOf('.', -5)
      const filetype = file.name.substr(site, (file.name.length - site))
      if (!['.jpg', '.jpeg', '.gif', '.png'].includes(filetype)) {
        this.$message.error('请选择正确的文件')
        return
      }
      if (file) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          this.$set(this.userInfo, 'userimg', reader.result)
        }
      }
    },
    // 展示用户信息框
    showUserInfoDalog(row, index) {
      if (row) {
        this.passwordPlacehod = '填写空值表示不修改密码'
        this.currentOperation = 1
        this.userInfo = Object.assign({}, row)
        this.rules.password = [{ trigger: 'blur', validator: validpassWord }]
      } else {
        this.userInfo = {}
        this.passwordPlacehod = '请输入密码'
        this.currentOperation = 0
        this.rules.password = [{ required: true, validator: validatePassword }]
      }
      getrolelist().then(res => {
        this.group_List = res.data.roles
        this.userInfoDalogShow = true
      }).catch(err => {
        console.log(err)
      })
    },
    // 头像上传服务器
    async uploadfile(img) {
      try {
        const res = await uploadimg({ base64file: img })
        return res.data.url || null
      } catch (error) {
        return null
      }
    },
    // 更新用户或新增用户
    UserUpdate(data) {
      userupdate(data).then(res => {
        this.$message({
          message: '更新成功',
          type: 'success'
        })
        this.paginationReset()
        this.init()
        this.userInfoDalogShow = false
      }).catch(err => {
        console.log(err)
      })
    },

    // 新增用户
    UserAdd(data) {
      useradd(data).then(res => {
        this.$message({
          message: '新增成功',
          type: 'success'
        })
        this.paginationReset()
        this.init()
        this.userInfoDalogShow = false
      }).catch(err => {
        console.log(err)
      })
    },
    jumpUpdateOrAdd(data) {
      if (this.currentOperation === 0) {
        this.UserAdd(data)
      } else if (this.currentOperation === 1) {
        this.UserUpdate(data)
      }
    },
    // 关闭用户信息框
    closeUserInfoDalog(flag) {
      this.$refs[flag].validate(async(valid) => {
        if (valid) {
          const data = Object.assign({}, this.userInfo)
          if (validBse64(data.userimg)) {
            const ulr = await this.uploadfile(data.userimg)
            if (ulr) {
              data.userimg = ulr
              this.jumpUpdateOrAdd(data)
            } else {
              this.$message.error('头像上传失败，请重试')
            }
          } else {
            this.jumpUpdateOrAdd(data)
          }
        } else {
          this.$message.error('请正确填写信息后再提交')
        }
      })
    },
    serach() {
      this.paginationReset()
      this.init(this.searchFormInput)
    },
    init(para) {
      const data = clearObjVal(para, {
        offset: this.pagination.currentPage,
        limit: this.pagination.pageSize
      })
      getusers(data).then(res => {
        this.tableData = res.data.users
        this.pagination.total = res.data.total
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .user-list-container {
    .add-user-wrap {
      padding-bottom: 20px;
      .add-btn {
        float: right;
      }
    }
    .img-wrap {
      width:60px;
      height:60px;
      .img-full-show {
        width:100%;
        height:100%;
      }
      .img-upload-ico {
        width: 100%;
        height: 100%;
        border: 1px solid #ccc;
        text-align: center;
        line-height: 60px;
        font-size: 30px;
        font-weight: 700;
      }
    }
    .img-cursor-pointer {
      cursor: pointer;
    }
    .img-center-show {
      margin: 0 auto;
    }
  }
</style>
