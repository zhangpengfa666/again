<template>
<el-card>
    <my-bread level1="商品管理" level2="商品分类"></my-bread>
    <!-- 搜索框 -->
    <el-row>
        <el-col :span="24" class="btn">
            <el-button type="success" @click="addGoodsCate()">添加分类</el-button>
        </el-col>
    </el-row>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
        <el-form :model="form">
            <el-form-item label="分类名称" :label-width="formLabelWidth">
                <el-input v-model="form.cat_name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="分类" :label-width="formLabelWidth">
                <!-- 级联选择器 -->
                <!-- 级联选择器 -->
                <el-cascader expand-trigger="hover" :options="catlist" :props="defaultProps" v-model="selectedOptions" @change="handleChange" change-on-select >
                </el-cascader>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addCate()">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 表格 -->
    <el-table :data="tableData" stripe style="width: 100%">
        <!-- <el-table-column prop="cat_name" label="分类名称" width="180">
        </el-table-column> -->

        <!--
        el-tree-grid用法和el-table-column一样
        prop label 和之前用法一样

        treeKey - nodekey - 每个节点的唯一标识
        parentKey - 父节点id
        levelKey - 当前的级别
        childKey - 子节点数据的key名
        文档  treeKey parentKey levelKey childKey 赋值不需要加:
      -->
        <el-tree-grid prop="cat_name" label="分类名称"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        childKey="children">

        </el-tree-grid>
        <el-table-column prop="cat_level" label="级别" width="180">
            <template slot-scope="scope">
                <span v-if="scope.row.cat_level===0">一级</span>
                <span v-else-if="scope.row.cat_level===1">二级</span>
                <span v-else-if="scope.row.cat_level===2">三级</span>
            </template>
        </el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效">
            <template slot-scope="scope">
                <span v-if="scope.row.cat_deleted===false">有效</span>
                <span v-else-if="scope.row.cat_deleted===true">无效</span>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-row>
                    <el-button size="mini" plain type="primary" icon="el-icon-edit" circle></el-button>
                    <el-button size="mini" plain type="danger" icon="el-icon-delete" circle></el-button>
                </el-row>
            </template>
        </el-table-column>
    </el-table>
</el-card>
</template>

<script>
var ElTreeGrid = require("element-tree-grid");
export default {
    // el-tree-grid
    components: {
      ElTreeGrid
    },
    data() {
        return {
            tableData: [],
            pagenum: 1,
            pagesize: 10000,
            dialogFormVisible: false,
            formLabelWidth: '140px',
            form: {
                cat_pid:-1,
                cat_name:'',
                cat_level:-1
            },
            //级联选择器要用的数据
            catlist: [],
            //级联选择器选中的的数据
            selectedOptions: [],
            //props属性的值
            defaultProps: {
                //分类id
                value: 'cat_id',
                //分类名称
                label: 'cat_name',
                children: 'children'
            }
        }
    },
    created() {
        this.getlist()
    },

    methods: {
        handleChange() {

        },
        //添加分类   发送请求
        async addCate () {
            //一级分类cat_pid=0   cat_level=0
            // 2. 二级分类 数组.length===1 cat_pid=一级分类的id cat_level=1
            // 3. 三级分类 数组.length===2 cat_pid=二级分类的id cat_level=2
            if(this.selectedOptions.length===0){
                this.form.car_pid=0;
                this.form.cat_level=0
            }else if(this.selectedOptions.length===1){
                this.form.cat_level=1
                this.form.cat_pid=this.selectedOptions[0]
            }else if(this.selectedOptions.length===2){
                this.form.cat_level=2
                this.form.cat_pid=this.selectedOptions[1]
            }
            // cat_pid	分类父 ID	不能为空
            // cat_name	分类名称	不能为空
            // cat_level	分类层级	不能为空
            const res = await this.$http.post(`categories`,this.form)
            console.log(res)
            this.dialogFormVisible=false
            this.getlist()
        },
        //打开对话框
        async addGoodsCate (){
            // 打开对话框时 获取二级分类的数据 type=2 
            const res = await this.$http.get(`categories?type=2`);
            this.catlist=res.data.data

            this.dialogFormVisible=true
        },  
        //得到参数列表
        async getlist() {
            const res = await this.$http.get(
                `categories?type=3&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
            );
            console.log(res)
            this.tableData = res.data.data.result
        }

    }
}
</script>

<style>
.btn {
    margin-top: 20px;
}
</style>
