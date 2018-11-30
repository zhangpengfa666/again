<template>
<el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <!-- 按钮 -->
    <el-row class="addRole">
      <el-col>
          <el-button type="primary" class="btn">添加按钮</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="tableData5" style="width: 100%">
        <el-table-column type="expand">
           <template slot-scope="scope">
               <el-row v-if="scope.row.children.length==0"><span>未分配权限</span></el-row>
               <el-row v-for="(item, index) in scope.row.children" :key="index">
                   <el-col :span="4">
                       <el-tag closable>{{item.authName}}</el-tag>
                       <i class="el-icon-arrow-right"></i>
                   </el-col>
                   <el-col :span="20">
                       <el-row v-for="(item1, index) in item.children" :key="index">
                           <el-col :span="4">
                               <el-tag closable type="success">{{item1.authName}}</el-tag>
                               <i class="el-icon-arrow-right"></i>
                           </el-col>
                           <el-col :span="20">
                               <el-tag closable type="warning" v-for="(item2, index) in item1.children" :key="index">{{item2.authName}}</el-tag>
                           </el-col>
                       </el-row>
                   </el-col>
               </el-row>
           </template>
        </el-table-column>
        <el-table-column label="#" type="index">
        </el-table-column>
        <el-table-column label="角色名称" prop="roleName">
        </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc">
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                plain
                type="primary"
                icon="el-icon-edit"
                circle
                @click="showEditUser(scope.row)"
              ></el-button>
              <el-button
                size="mini"
                plain
                type="success"
                icon="el-icon-check"
                circle
                @click="showSetRole(scope.row)"
              ></el-button>
              <el-button
                size="mini"
                plain
                type="danger"
                icon="el-icon-delete"
                circle
                @click="deleteUser(scope.row.id)"
              ></el-button>
            </template>
        </el-table-column>
    </el-table>
</el-card>
</template>

<script>
export default {
    data () {
        return {
            tableData5:[]
        }
    },
    created () {
        this.getRolelist()  
    },
    methods: {
        //获取角色权限列表
       async getRolelist () {
            const res = await this.$http.get(`roles`)
            console.log(res)
            this.tableData5=res.data.data
        }
    }
    
}
</script>

<style>
.addRole{
    margin-top: 20px
}
</style>
