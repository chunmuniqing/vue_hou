<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods/add' }"
        >商品分类</el-breadcrumb-item
      >
    </el-breadcrumb>
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        :closable="false"
        center
        show-icon
        title="添加商品信息"
        type="info"
      >
      </el-alert>
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addItemForm"
        ref="addItemForm"
        :rules="addItemRules"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeSwitchTab"
          @tab-click="selectTab"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addItemForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addItemForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addItemForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addItemForm.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!--  选择商品分类区域 -->
              <el-cascader
                :options="categoriesData"
                clearable
                :props="{
                  label: 'cat_name',
                  value: 'cat_id',
                  children: 'children'
                }"
                @change="selectGoods"
                v-model="addItemForm.goods_cat"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <!--复选框组-->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  :label="cb"
                  border
                  size="small"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="successPic"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addItemForm.goods_introduce"
                >
  </quill-editor>
  <el-button type="primary" style="margin-top:15px;" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="dialogVisible" width="50%">
     <img :src="preView" alt="图片预览错误" class="previewImg">

    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'Add',
  data() {
    return {
      activeIndex: 0,
      addItemRules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur'
          }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: 'blur'
          }
        ],
        goods_cat: [
          {
            required: true,
            message: '请输入商品分类',
            trigger: 'blur'
          }
        ]
      },
      cateProps: {
        // 指定选项标签的值: 选项对象的某个属性值
        label: 'cat_name',
        // 指定选项的值: 选项对象的某个属性值
        value: 'cat_id',
        // 指定选项的子选项
        children: 'children',
        // 从el-cascader标签的属性,中移动到这个cascadeProps中
        expandTrigger: 'hover'
      },
      addItemForm: {
        goods_name: '',
        goods_price: null,
        goods_weight: null,
        goods_number: null,
        goods_cat: [],
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      categoriesData: [],
      manyTableData: [],
      onlyTableData: [],
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      preView: '',
      dialogVisible: false
    }
  },

  methods: {
    categoriesList() {
      this.$api.shop.goCategoriesList().then((res) => {
        console.log(res)
        if (!this.$fn.error) return
        this.categoriesData = res.data
      })
    },
    selectGoods(val) {
      // console.log(this.categoriesData);
      console.log(val, 111)
      // return;
      // if (val.length !== 3) {
      //   this.addItemForm.goods_cat = []
      // }
    },
    beforeSwitchTab(active, old) {
      console.log(active, old, 11)
      if (old === '0' && this.addItemForm.goods_cat.length !== 3) {
        this.$message.error('您有商品分类未选择')
        return false
      }
    },
    attributesList(data) {
      this.$api.shop
        .getAttributes({ id: this.cateId, sel: data })
        .then((res) => {
          if (!this.$fn.error) return

          if (data === 'many') {
            res.data.forEach((item) => {
              item.attr_vals =
                item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
            })
            this.manyTableData = res.data
          } else {
            this.onlyTableData = res.data
            console.log(this.onlyTableData)
          }

          console.log(res.data, 111)
        })
    },
    selectTab() {
      if (this.activeIndex === '1') {
        this.attributesList('many')
      } else if (this.activeIndex === '2') {
        this.attributesList('only')
      }
    },
    handlePreview(file) {
      this.preView = file.response.data.url
      this.dialogVisible = true;
      console.log(this.preView)
    },
    handleRemove(file) {
      const filePath = file.response.data.tmp_path
      const index = this.addItemForm.pics.findIndex((item) => {
        return item.pic === filePath
      })
      this.addItemForm.pics.splice(index, 1)
      console.log(index, this.addItemForm)
    },
    successPic(res) {
      const pic = { pic: res.data.tmp_path }
      this.addItemForm.pics.push(pic)
      console.log(this.addItemForm)
    },
    add(){
      this.$refs.addItemForm.validate( valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项!')
        }
        const form = _.cloneDeep(this.addItemForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(',')
          }
          this.addItemForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addItemForm.attrs.push(newInfo)
        })
        form.attrs = this.addItemForm.attrs
       this.$api.shop.getAddGoods(form).then(res=>{
         if(res.meta.status!==201){return this.$message.error(res.meta.msg)};
         this.$message.success('添加商品成功!')
        // 编程式导航, 跳转页面
        this.$router.push('/goods')
       })
      })
    
    }
  },
  mounted() {
    this.categoriesList()
  },
  computed: {
    cateId() {
      if (this.addItemForm.goods_cat.length === 3) {
        return this.addItemForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style  scoped>
.el-steps {
  margin: 20px 0;
}
*/deep/ .el-step__title {
  font-size: 13px;
}
*/deep/ .el-step__icon {
  font-size: 12px;
}
/* .el-cascader {
  width: 100%;
} */
.previewImg {
  width: 100%;
}
*/deep/ .ql-editor {
  min-height: 300px;
}
</style>
