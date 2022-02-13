<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row class="add-cate">
        <el-col>
          <el-button type="primary" @click="addClassification"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="true"
        class="tree-table"
      >
        <template v-slot:isok="{ row }">
          <i
            class="el-icon-success"
            v-if="!row.cat_deleted"
            style="color: #90ee90"
          ></i>
          <i class="el-icon-error" v-else-if="row.cat_deleted"></i>
        </template>
        <template v-slot:issort="{ row }">
          <el-tag type="success" v-if="row.cat_level === 0" size="small"
            >一级</el-tag
          >
          <el-tag type="info" v-else-if="row.cat_level === 1" size="small"
            >二级</el-tag
          >
          <el-tag type="warning" v-else size="small">三级</el-tag>
        </template>
        <template v-slot:isoperation="{ row }">
          <el-button
            icon="el-icon-edit"
            size="mini"
            type="primary"
            @click="showEditDialog(row.cat_id)"
            >编辑
          </el-button>
          <el-button
            icon="el-icon-delete"
            size="mini"
            type="danger"
            @click="delGoods(row.cat_id)"
            >删除
          </el-button>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryCate.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryCate.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      :visible.sync="addCateDialogVisible"
      title="添加分类"
      @close="addCateDialogClosed"
    >
      <el-form
        ref="addCateForm"
        :model="addCateForm"
        label-width="100px"
        :rules="addCateRules"
        label-suffix=": "
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="cateKeys"
            :options="cateOptions"
            :props="{
              label: 'cat_name',
              value: 'cat_id',
              children: 'children',
              checkStrictly: true
            }"
            @change="cateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate('addCateForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Categories',
  data() {
    return {
      queryCate: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      cateList: [],
      total: 0,
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'issort'
        },
        {
          label: '操作',
          type: 'template',
          template: 'isoperation'
        }
      ],
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      addCateRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      cateOptions: [],
      cateKeys: []
    }
  },
  methods: {
    cateListData() {
      this.$api.shop.goCategoriesList(this.queryCate).then((res) => {
        if (!this.$fn.error) return
        this.cateList = res.data.result
        this.total = res.data.total
        console.log(res.data)
      })
    },
    showEditDialog(id) {},
    // 分页
    handleSizeChange(val) {
      this.queryCate.pagesize = val
      this.cateListData()
    },
    handleCurrentChange(val) {
      this.queryCate.pagenum = val
      this.cateListData()
      console.log(`当前页: ${val}`)
    },
    delGoods(id) {
      this.$confirm('此操作将删除该商品分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api.shop.getDelCategories(id).then((res) => {
            if (res.meta.status !== 200) {
              return this.$message.error(res.meta.msg)
            }
            let totalPage = Math.ceil(
              (this.total - 1) / this.queryCate.pagesize
            )
            let currentPage =
              this.queryCate.pagenum > totalPage
                ? totalPage
                : this.queryCate.pagenum
            this.queryCate.pagenum = currentPage < 1 ? 1 : currentPage
            this.cateListData()
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
    addClassification() {
    this.cateListData()
      this.addCateDialogVisible = true
    },
    addCateDialogClosed() {
      this.cateKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      this.$refs.addCateForm.resetFields()
    },
    addCate(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.addCateForm,'this.addCateForm');
          this.$api.shop.getAddCategories(this.addCateForm).then(res=>{
            if(res.meta.status!==201){
              return this.$message.error(res.meta.msg)
            }
            this.$message.success(res.meta.msg)
             this.cateListData()
            this.addCateDialogVisible = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getParentList() {
      this.$api.shop.goCategoriesList({ type: 2 }).then((res) => {
        if (!this.$fn.error) return
        this.cateOptions = res.data
        console.log(res.data)
      })
    },
    cateChange(val) {
      if (val.length) {
        this.addCateForm.cat_pid = val[val.length - 1]
        this.addCateForm.cat_level = val.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    }
  },
  mounted() {
    this.getParentList()
  }
}
</script>

<style  scoped>
.add-cate {
  margin-bottom: 20px;
}
.tree-table {
  margin-top: 15px;
  font-size: 13px;
}
.el-cascader {
  width: 100%;
}
</style>
