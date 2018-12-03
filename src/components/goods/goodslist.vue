<template>
<el-card>
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 2.搜索框 -->
    <el-row class="searchRow">
        <el-col :span="24">
            <el-input placeholder="请输入用户名" class="searchInput" >
                <el-button slot="append" icon="el-icon-search" @click="searchUser()" ></el-button>
            </el-input>
            <el-button type="primary" @click="$router.push({name:'goodsadd'})">添加用户</el-button>
        </el-col>
    </el-row>
</el-card>
</template>

<script>
export default {

}
</script>

<style>
.searchInput{
    width: 300px;
    margin-top: 20px
}
</style>
