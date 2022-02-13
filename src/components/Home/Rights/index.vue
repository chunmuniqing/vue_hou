<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图-->
    <el-card>
      <!-- 权限列表区域
        stripe 条纹
      -->
      <el-table :data="rightsList" border style="width: 100%" stripe v-loading="!rightsList.length" element-loading-text="数据加载中...">
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column label="权限名称" prop="authName"> </el-table-column>
        <el-table-column label="路径" prop="path"> </el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template v-slot="{ row }">
            <el-tag v-if="row.level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="row.level == 1">二级</el-tag>
            <el-tag type="info" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Rights',
  data() {
    return {
      rightsList: []
    }
  },
  methods: {
    rightsListData() {
      this.$api.rights.getAllRights('list').then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.rightsList = res.data
        console.log(res.data)
      })
    }
  },
  mounted() {
    this.rightsListData()
  }
}
</script>

<style  scoped>
</style>
