<template>
  <el-card class="box-card">
    <!-- 1.面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 2.搜索框 -->
    <el-row class="searchRow">
      <el-col :span="16">
        <el-input
          placeholder="请输入用户名"
          v-model="query"
          class="searchInput"
          clearable
          @click="loadUserList()"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
        </el-input>
        <el-button type="primary" @click="showAddUserdia()">添加用户</el-button>
      </el-col>
    </el-row>
    <!-- 3.表格 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="100"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <!-- fmtdate -->
      <el-table-column label="创建日期">
        <template slot-scope="scope">{{scope.row.create_time|fmtdate}}</template>
      </el-table-column>

      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch
            @change="editUserStatus(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
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
    <!-- 4.分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="用户名称" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 编辑用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名称" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 角色分配的对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">{{currUsername}}</el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="currRoleId">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option
              v-for="(item, index) in role"
              :key="index"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      //提供table要渲染的数据
      // create_time: 1486720211
      // email: "adsfad@qq.com"
      // id: 500
      // mg_state: true
      // mobile: "12345678"
      // role_name: "主管"
      // username: "admin"
      tableData: [
        {
          create_time: "",
          email: "",
          id: "",
          mg_state: "",
          mobile: "",
          role_name: "",
          username: ""
        }
      ],
      //截取用户数据请求的参数
      pagenum: 1,
      pagesize: 2,
      total: -1,
      //对话框  添加对话框
      dialogFormVisible: false,
      //对话框  打开编辑对话框
      dialogFormVisibleEdit: false,
      //对话框  角色分配列表
      dialogFormVisibleRole: false,
      formLabelWidth: "100px",
      //用户的表单数据
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //分配角色
      //分配角色用户名
      currUsername: "",
      //当前角色Id
      currRoleId: -1,
      //角色列表
      role: [],
      //当前用户id
      currUserId: -1
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //设置用户的角色 发送修改请求
    async setRole() {
      const res = await this.$http.put(`users/${this.currUserId}/role`, {
        rid: this.currRoleId
      });
      console.log(res);
      this.dialogFormVisibleRole = false;
    },
    //打开分配角色对话框
    async showSetRole(user) {
      this.currUserId = user.id;
      this.currUsername = user.username;
      //获取所有角色的名称
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res1 = await this.$http.get("roles");
      console.log(res1);
      console.log("...............");
      this.role = res1.data.data;
      // 获取当前角色的id
      const res2 = await this.$http.get(`users/${user.id}`);
      console.log(res2);
      this.currRoleId = res2.data.data.rid;

      this.dialogFormVisibleRole = true;
    },
    //修改用户状态
    async editUserStatus(user) {
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      );
    },
    // 编辑用户发送请求
    async editUser() {
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.put(`users/${this.form.id}`, this.form);
      this.dialogFormVisibleEdit = false;
      this.getUserList();
      this.$message.success(res.data.meta.msg);
    },
    // 点击编辑用户按钮  弹出对话框
    showEditUser(user) {
      this.form = user;
      this.dialogFormVisibleEdit = true;
    },
    //删除用户
    deleteUser(UsersId) {
      this.$confirm("此操作将删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //发送删除请求
          const res = await this.$http.delete(`users/${UsersId}`);
          console.log(res);
          this.getUserList();
          this.$message({
            type: "success",
            message: res.data.meta.msg
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: res.data.meta.msg
          });
        });
    },
    //点击确定添加用户
    async addUser() {
      const res = await this.$http.post("users", this.form);
      const {
        meta: { status, msg },
        data
      } = res.data;
      if (status === 201) {
        //关闭对话框
        this.dialogFormVisible = false;
        //提示成功
        this.$message.success(msg);
        //更新视图
        this.getUserList();
      } else {
        this.$message.warning(msg);
      }
      this.form = {};
    },
    //点击添加用户按钮  弹出对话框
    showAddUserdia() {
      this.form = {};
      this.dialogFormVisible = true;
    },
    //清除搜索框触发事件
    loadUserList() {
      this.getUserList();
    },
    //用户名搜索
    searchUser() {
      this.pagenum = 1;
      this.getUserList();
    },
    //分页
    //每个的条数改变
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.pagenum = 1;
      this.getUserList();
    },
    //当前页码改变
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.pagenum = val;
      this.getUserList();
    },
    //获取用户列表数据
    async getUserList() {
      //授权api 设置请求头
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      console.log(res);
      const {
        meta: { msg, status },
        data: { total, users }
      } = res.data;
      if (status === 200) {
        this.total = total;
        this.tableData = users;
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
    }
  }
};
</script>

<style>
.box-card {
  height: 100%;
}

.searchRow {
  margin-top: 20px;
}

.searchInput {
  width: 300px;
}
</style>
