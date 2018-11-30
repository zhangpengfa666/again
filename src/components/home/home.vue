<template>
<el-container class="container">
    <el-header class="header">
        <el-row class="header-row">
            <el-col :span="4">
                <div class="grid-content bg-purple">
                    <img src="@/assets/logo.png" alt="该图品无法显示">
                </div>
            </el-col>
            <el-col :span="19" class="middle">
                <div class="grid-content bg-purple-light">
                    <h3>电商后台管理系统</h3>
                </div>
            </el-col>
            <el-col :span="1">
                <div class="grid-content bg-purple">
                    <a href="#" class="loginout" @click.prevent="loginout()">退出</a>
                </div>
            </el-col>
        </el-row>
    </el-header>
    <el-container>
        <el-aside width="200px" class="aside">
            <el-menu 
                class="el-menu-vertical-demo"
                :unique-opened="true"
                :router="true" 
            >
                <el-submenu :index="''+item.order" v-for="(item, index) in meaus" :key="index">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>{{item.authName}}</span>
                    </template>
            
                        <el-menu-item :index="''+item1.path" v-for="(item1, index) in item.children" :key="index">
                            <i class="el-icon-location"></i>
                            <span>{{item1.authName}}</span>
                        </el-menu-item>
                </el-submenu>
               
                
            </el-menu>
        </el-aside>
        <el-main class="main">
            <router-view></router-view>
        </el-main>
    </el-container>
</el-container>
</template>

<script>
export default {
    data () {
        return {
            meaus:[]      
        }
    },
    // beforeCreate() {
    //     const token=localStorage.getItem('token')
    //     if(!token){
    //         this.$router.push({name:'login'})
    //     }
    // },
    created () {
      this.getMeaus()  
    },
    methods:{
        //获取侧边栏导航
        async getMeaus () {
            const res = await this.$http.get(`menus`)
            console.log(res)
            this.meaus=res.data.data
        },
        loginout(){
            this.$message.success('退出成功')
            localStorage.clear()
            this.$router.push({name:'login'})
        }
    }
}
</script>

<style>
.container {
    height: 100%;
}

.header {
    background-color: #b3c0d1;
}

.aside {
    background-color: #d3dce6;
}

.main {
    background-color: #e9eef3;
    height: 100%;
}

.middle {
    text-align: center
}

.loginout {
    text-align: center;
    line-height: 60px;
    text-decoration: none
}
</style>
