<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 搜索 添加按钮 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <div style="margin-top: 15px;">
            <el-input placeholder="请输入用户姓名" v-model="queryInfo.query" class="input-with-select" clearable
              @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="showAddDiolog">添加用户</el-button>
        </el-col>
      </el-row>
      <template>
        <el-table :data="userList" style="width: 100" border stripe fit>
          <el-table-column type="index" label="序号" width="60"></el-table-column>
          <el-table-column prop="username" label="用户姓名" width="150"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column prop="mg_state" label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"
                @change="userStateChange(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="修改用户信息" placement="bottom" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除用户" placement="bottom" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" @click="deleteUser(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="分配角色" placement="bottom" :enterable="false">
                <el-button type="warning" icon="el-icon-setting"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[1,3,5,8,10]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addUser" width="30%" @close="dialogClose">
      <el-form ref="addUserForm" :model="addUserInfo" label-width="80" :rules="addUserRule">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addUserInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="addUserInfo.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogClose()">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改用户信息" :visible.sync="isEditUser" width="30%" @close="editDialogClose">
      <el-form ref="editUserForm" :model="editUserInfo" label-width="80" :rules="editFormRule">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="editUserInfo.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUserInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isEditUser = false">取 消</el-button>
        <el-button type="primary" @click="editUsers()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    var checkMobile = (rule, value, cb) => {
      const reg = /^0?1[3|4|5|6|7|8][0-9]\d{8}$/
      if (reg.test(value)) return cb()
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      input: '',
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 8
      },
      userList: [],
      total: 0,
      addUser: false,
      isEditUser: false,
      addUserInfo: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editUserInfo: {},
      addUserRule: {
        username: [{
          required: true,
          message: '请输入用户姓名',
          trigger: 'blur'
        }, {
          min: 3,
          max: 10,
          message: '用户姓名在3~10个字符内',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入用户密码',
          trigger: 'blur'
        }, {
          min: 6,
          max: 15,
          message: '用户密码在3~10个字符内',
          trigger: 'blur'
        }],
        email: [{
          required: true,
          message: '请输入邮箱地址',
          trigger: 'blur'
        },
        {
          type: 'email',
          message: '请输入正确的邮箱地址',
          trigger: ['blur', 'change']
        }
        ],
        mobile: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        }, {
          validator: checkMobile,
          trigger: ['blur']
        }]
      },
      editFormRule: {
        email: [{
          required: true,
          message: '请输入邮箱地址',
          trigger: 'blur'
        },
        {
          type: 'email',
          message: '请输入正确的邮箱地址',
          trigger: ['blur', 'change']
        }
        ],
        mobile: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        }, {
          validator: checkMobile,
          trigger: ['blur', 'change']
        }]
      }
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const {
        data: res
      } = await this.$http.get('api/private/v1/users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize改变
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStateChange (userInfo) {
      console.log(userInfo)
      const {
        data: res
      } = await this.$http.put(`api/private/v1/users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
    },
    showAddDiolog () {
      this.addUser = true
    },
    dialogClose () {
      this.addUserInfo.username = ''
      this.addUserInfo.password = ''
      this.addUserInfo.email = ''
      this.addUserInfo.mobile = ''
      this.addUser = false
    },
    addUsers () {
      this.$refs.addUserForm.validate(async vaild => {
        if (!vaild) return
        const {
          data: res
        } = await this.$http.post('api/private/v1/users', this.addUserInfo)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.dialogClose()
        this.getUserList()
        this.$message.success(res.meta.msg)
      })
    },
    async showEditDialog (userId) {
      const {
        data: res
      } = await this.$http.get(`api/private/v1/users/${userId}`)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editUserInfo = res.data
      this.isEditUser = true
    },
    editUsers () {
      this.$refs.editUserForm.validate(async volid => {
        if (!volid) return
        const {
          data: res
        } = await this.$http.put(`api/private/v1/users/${this.editUserInfo.id}`, this.editUserInfo)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.isEditUser = false
        this.getUserList()
        this.$message.success(res.meta.msg)
      })
    },
    editDialogClose () {
      this.$refs.editUserForm.resetField()
    },
    deleteUser (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('api/private/v1/users/' + id)
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.$message({
          type: 'success',
          message: res.mata.msg
        })
        this.getUserList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .el-button {
    margin-top: 15px;
  }

  .el-pagination {
    margin-top: 15px;
  }
</style>
