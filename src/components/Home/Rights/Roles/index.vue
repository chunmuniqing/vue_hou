<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row class="add-roles-btn">
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="rolesList"
        style="width: 100%"
        border
        stripe
        v-loading="!rolesList.length"
        element-loading-text="数据加载中..."
      >
        <el-table-column type="expand">
          <template v-slot="{ row }">
            <el-row
              v-for="(item, i1) in row.children"
              :key="item.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <el-col :span="5"
                ><el-tag
                  class="one-tag"
                  closable
                  @close="removeByRights(row, item.id)"
                  >{{ item.authName }}</el-tag
                ><i class="el-icon-caret-right"></i
              ></el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      class="one-tag"
                      type="success"
                      closable
                      @close="removeByRights(row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    ><i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      class="one-tag"
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeByRights(row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    ></el-col
                  >
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" width="300px" align="center">
          <template v-slot="{ row }">
            <el-button icon="el-icon-edit" size="mini" type="primary"
              >编辑
            </el-button>
            <el-button icon="el-icon-delete" size="mini" type="danger"
              >删除
            </el-button>

            <el-button
              icon="el-icon-setting"
              size="mini"
              type="warning"
              @click="showSetRightDialog(row)"
              >分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog
      :visible.sync="setRightDialogVisible"
      title="分配权限"
      width="50%"
      @close="clearRoles"
    >
      <el-tree
        :data="roleTreeList"
        :props="defaultProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      rolesList: [],
      setRightDialogVisible: false,
      roleTreeList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      defKeys: [],
      roleId: ''
    }
  },
  methods: {
    allRolesList() {
      this.$api.rights.getAllRoles().then((res) => {
        if (res.meta.status !== 200) {
          return this.$messsage.error(res.meta.msg)
        }
        this.rolesList = res.data
        console.log(this.rolesList, 111)
      })
    },
    removeByRights(row, id) {
      this.$confirm('确定删除此角色权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          console.log(row, 111, id)
          this.$api.rights.getDelRoles(row, id).then((res) => {
            if (res.meta.status !== 200) {
              return this.$message.error(this.meta.msg)
            }
            row.children = res.data
            // this.allRolesList()
          })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch((err) => console.log(err))
    },
    showSetRightDialog(row) {
      this.roleId = row.id
      this.$api.rights.getAllRights('tree').then((res) => {
        this.$fn.error(res)

        this.roleTreeList = res.data
        this.getThreeId(row, this.defKeys)
        // console.log(this.defKeys)
        this.setRightDialogVisible = true
      })
    },
    allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      this.$api.rights
        .getRoleRights(this.roleId, keys.join(','))
        .then((res) => {
          this.$fn.error(res)
          console.log(res, 222)
          this.allRolesList()
          this.setRightDialogVisible = false
        })
    },
    // 获取树型3级列表的id
    getThreeId(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach((item) => {
        this.getThreeId(item, arr)
      })
    },
    clearRoles() {
      this.defKeys = []
    }
  },
  mounted() {
    this.allRolesList()
  }
}
</script>

<style  scoped>
.add-roles-btn {
  margin-bottom: 20px;
}
.one-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
*/deep/ td.el-table__cell.el-table__expanded-cell {
  padding: 20px 40px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
