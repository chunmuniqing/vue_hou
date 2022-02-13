<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="注意: 只允许为三级分类设置相关参数!"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类: </span>
          <el-cascader
            size="small"
            v-model="selectedKeys"
            :options="cateList"
            :props="cateProps"
            clearable
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            size="mini"
            type="primary"
            :disabled="isBtnDisabled"
            style="margin-bottom: 15px"
            @click="addDialogVisible = true"
            >添加参数
          </el-button>
          <el-table :data="manyData" border style="width: 100%">
            <el-table-column type="expand"
              ><template v-slot="{ row }">
                <el-tag
                  :key="index"
                  v-for="(tag, index) in row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(row, index)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(row)"
                  >+ New Tag</el-button
                >
              </template></el-table-column
            >
            <el-table-column type="index" label="#" width="100" align="center">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <el-button
                  icon="el-icon-edit"
                  size="mini"
                  type="primary"
                  @click="editAttribute(row.attr_id)"
                  >编辑
                </el-button>
                <el-button
                  icon="el-icon-delete"
                  size="mini"
                  type="danger"
                  @click="delAttribute(row)"
                  >删除
                </el-button>
              </template></el-table-column
            >
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            size="mini"
            type="primary"
            :disabled="isBtnDisabled"
            style="margin-bottom: 15px"
            @click="addDialogVisible = true"
            >添加属性
          </el-button>
          <el-table
            :data="onlyData"
            border
            style="width: 100%"
          >
            <el-table-column type="expand"
              ><template v-slot="{ row }"><el-tag
                  :key="index"
                  v-for="(tag, index) in row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(row, index)"
                >
                  {{ tag }}
                </el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="row.inputVisible"
                  v-model="row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(row)"
                  @blur="handleInputConfirm(row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(row)"
                  >+ New Tag</el-button
                ></template></el-table-column
            >
            <el-table-column type="index" label="#" width="100" align="center">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <el-button
                  icon="el-icon-edit"
                  size="mini"
                  type="primary"
                  @click="editAttribute(row.attr_id)"
                  >编辑
                </el-button>
                <el-button
                  icon="el-icon-delete"
                  size="mini"
                  type="danger"
                  @click="delAttribute(row)"
                  >删除
                </el-button>
              </template></el-table-column
            >
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="35%"
      @close="addDialogClosed"
    >
      <el-form
        ref="addForm"
        :model="addForm"
        label-width="100px"
        :rules="addFormRules"
        label-suffix=":"
      >
        <el-form-item prop="attr_name" :label="titleText">
          <el-input v-model="addForm.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams('addForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="35%"
      @close="editDialogClosed"
    >
      <el-form
        ref="editForm"
        :model="editForm"
        label-width="100px"
        :rules="editFormRules"
        label-suffix=":"
      >
        <el-form-item prop="attr_name" :label="titleText">
          <el-input v-model="editForm.attr_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams('editForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data() {
    return {
      selectedKeys: [],
      cateList: [],
      cateProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      activeName: 'many',
      manyData: [],
      onlyData: [],
      addDialogVisible: false,
      addForm: {
        attr_name: ''
      },
      
      addFormRules: {
        attr_name: [
          { require: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {
        attr_name: ''
      },
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editData: {}
    }
  },
  methods: {
    handleChange(val) {
      if (val.length !== 3) {
        this.selectedKeys = []
        this.manyData = []
        this.onlyData = []
        return
      }
      this.selectGoodsData()
    },
    categoriesList() {
      this.$api.shop.goCategoriesList().then((res) => {
        if (!this.$fn.error) return
        this.cateList = res.data
      })
    },
    handleClick() {
      if (this.selectedKeys.length === 3) {
        this.selectGoodsData()
      }
    },
    selectGoodsData() {
      this.$api.shop
        .getAttributes({ id: this.getCateId, sel: this.activeName })
        .then((res) => {
          if (!this.$fn.error) return
          res.data.forEach((item) => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
            item.inputVisible = false
            item.inputValue = ''
          })
          console.log(res.data)

          if (this.activeName === 'many') {
            this.manyData = res.data
          } else if (this.activeName === 'only') {
            this.onlyData = res.data
          }
        })
    },
    addDialogClosed() {
      this.$refs.addForm.resetFields()
    },
    addParams(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let sendData = {
            attr_name: this.addForm.attr_name,
            cat_id: this.getCateId,
            attr_sel: this.activeName
          }
          this.$api.shop.getAddAttribute(sendData).then((res) => {
            if (!this.$fn.error) return
            this.$message.success(res.meta.msg)
            this.selectGoodsData()
            this.addDialogVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    editAttribute(attrId) {
      this.$api.shop
        .getEditAttribute({
          id: this.getCateId,
          attrId,
          attr_sel: this.activeName
        })
        .then((res) => {
          if (!this.$fn.error) return
          this.editForm = res.data
        })
      this.editDialogVisible = true
    },
    editDialogClosed() {
      this.$refs.editForm.resetFields()
    },
    editParams(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$api.shop.editAttribute(this.editForm).then((res) => {
            if (!this.$fn.error) return
            this.$message.success(res.meta.msg)
            this.selectGoodsData()
            this.editDialogVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    delAttribute(row) {
      this.$confirm('此操作将删除该商品参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api.shop.delAttribute(row).then((res) => {
            if (res.meta.status !== 200) {
              return this.$message.error(res.meta.msg)
            }
            this.selectGoodsData()
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
    // tags
    handleClose(tag, i) {
      console.log(tag)

      this.$confirm('此操作将删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          tag.attr_vals.splice(i, 1)
         

          this.saveAttrVals(tag, true)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    showInput(row) {
      console.log(row, 11)
      row.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      this.saveAttrVals(row)
    },
    saveAttrVals(row,show) {
      this.$api.shop
        .editOneAttribute({
          id: this.getCateId,
          attrId: row.attr_id,
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join()
        })
        .then((res) => {
          if (!this.$fn.error) return
          row.inputVisible = false
          row.inputValue = ''
          if(show){
            this.$message.success('删除成功')
          }
        })
    }
  },
  mounted() {
    this.categoriesList()
  },
  computed: {
    isBtnDisabled() {
      if (this.selectedKeys.length !== 3) {
        return true
      }
      return false
    },
    getCateId() {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[this.selectedKeys.length - 1]
      }
      return null
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else if (this.activeName === 'only') {
        return '静态属性'
      }
    }
  }
}
</script>

<style  scoped>
.cat_opt {
  margin: 20px 0;
}
*/deep/ td.el-table__cell.el-table__expanded-cell {
  padding: 20px 40px;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  max-width: 100px;
}
</style>
