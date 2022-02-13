<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="openAddUser('add')"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <el-table
        v-loading="userLoading"
        :data="userList"
        border
        style="width: 100%"
        class="table"
      >
        <el-table-column label="#" type="index" width="50" align="center">
        </el-table-column>
        <el-table-column prop="username" label="用户名"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template v-slot="{ row }">
            <el-switch
              @change="switchBtn(row)"
              v-model="row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :disabled="swaitchBtn"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="200" align="center">
          <template v-slot="{ row }">
            <el-button
              icon="el-icon-edit"
              size="mini"
              type="primary"
              @click="openAddUser(row)"
            ></el-button>
            <el-button
              icon="el-icon-delete"
              size="mini"
              type="danger"
              @click="delUser(row)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                icon="el-icon-setting"
                size="mini"
                type="warning"
                @click="openRole(row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialog"
      width="50%"
      @close="closeAddUser"
    >
      <el-form
        :model="addUserForm"
        :rules="addUserRules"
        ref="addUserForm"
        label-width="100px"
      >
        <el-form-item label="用户名" :prop="isShowPassword ? 'username' : ''">
          <el-input
            v-model="addUserForm.username"
            :disabled="disUsername"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="isShowPassword">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
        <el-form-item align="right">
          <el-button @click="addUserDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('addUserForm')"
            >确 定</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog
      :visible.sync="setRoleDialogVisible"
      title="分配角色"
      width="35%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户: {{ userInfo.username }}</p>
        <p>当前的角色: {{ userInfo.role_name }}</p>
        <p>分配新角色:
          <el-select v-model="newRole" clearable placeholder="请选择" size="small">
          <el-option
            v-for="item in newRoleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'User',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (!/^[\w_]{6,16}$/.test(value)) {
        callback(new Error('密码需为6-16位的数字大小写字母或下划线'))
      } else {
        callback()
      }
    }
    return {
      queryInfo: { query: '', pagenum: 1, pagesize: 2 },
      total: 0,
      userList: [],
      userLoading: false,
      swaitchBtn: false,
      addUserDialog: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'blur' }]
      },
      disUsername: false,
      isShowPassword: true,
      editUserForm: {},
      setRoleDialogVisible: false,
      userInfo: {},
      newRole:'',
      newRoleList:[]
    }
  },
  methods: {
    getUserList() {
      this.userLoading = true
      this.$api.home
        .getUser(this.queryInfo)
        .then((res) => {
          console.log(res)
          if (res.meta.status === 200) {
            this.total = res.data.total
            this.userList = res.data.users
          } else {
            this.$message.error(res.meta.msg)
          }
        })
        .finally(() => {
          this.userLoading = false
        })
    },
    // 分页
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getUserList()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getUserList()

      console.log(`当前页: ${val}`)
    },
    switchBtn(status) {
      this.swaitchBtn = true
      this.$api.home
        .getSwitchBtn({ uId: status.id * 1, type: status.mg_state })
        .then((res) => {
          if (res.meta.status !== 200) {
            status.mg_state = !status.mg_state
            return this.$message.error(res.meta.msg)
          }
        })
        .finally(() => {
          this.swaitchBtn = false
        })
    },
    submitForm(addUserForm) {
      this.$refs[addUserForm].validate((valid) => {
        if (valid) {
          if (this.isShowPassword) {
            this.$api.home
              .getAddUser(this.addUserForm)
              .then((res) => {
                if (res.meta.status !== 201) {
                  return this.$message.error(res.meta.msg)
                }
                setTimeout(() => {
                  this.getUserList()
                  this.$message.success('添加用户成功')
                }, 0)
              })
              .finally(() => {
                this.addUserDialog = false
              })
          } else {
            this.$api.home
              .getEditUser(this.addUserForm)
              .then((res) => {
                if (res.meta.status !== 200) {
                  return this.$message.error(res.meta.msg)
                }
                setTimeout(() => {
                  this.getUserList()
                  this.$message.success('修改用户成功')
                }, 0)
              })
              .finally(() => {
                this.addUserDialog = false
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    closeAddUser() {
      this.addUserForm = {
        username: '',
        password: '',
        email: '',
        mobile: ''
      }
      this.$refs.addUserForm.resetFields()
    },
    openAddUser(status) {
      if (status === 'add') {
        this.disUsername = false
        this.isShowPassword = true
      } else {
        this.isShowPassword = false
        this.disUsername = true
        this.$api.home.getUserId(status.id).then((res) => {
          if (res.meta.status !== 200) this.$message.error(res.meta.msg)
          this.addUserForm = res.data
          console.log(res, 111)
        })
      }
      this.addUserDialog = true
    },
    delUser(row) {
      this.$confirm('此操作将删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api.home.getDelUser(row).then((res) => {
            if (res.meta.status !== 200) {
              return this.$message.error(res.meta.msg)
            }
            let totalPage = Math.ceil(
              (this.total - 1) / this.queryInfo.pagesize
            )
            let currentPage =
              this.queryInfo.pagenum > totalPage
                ? totalPage
                : this.queryInfo.pagenum
            this.queryInfo.pagenum = currentPage < 1 ? 1 : currentPage
            this.getUserList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    saveRoleInfo() {
      if(!this.newRole) return;
      this.$api.home.getAssignRoles(this.userInfo.id,this.newRole).then(res=>{
        if (!this.$fn.error(res)) return
        this.$message.success(res.meta.msg)
        this.getUserList()
        this.setRoleDialogVisible = false
      })
    },
    setRoleDialogClosed() {
      this.newRole=''
    },
    openRole(row) {
      this.userInfo = row
      console.log(row)
      this.$api.rights.getAllRoles().then(res=>{
        this.$fn.error(res)
        this.newRoleList = res.data
      })
      this.setRoleDialogVisible = true

    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style  scoped>
.table {
  margin: 20px 0;
}
p {
  margin: 10px 0;
  
}

</style>
