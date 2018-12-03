<template>
<el-card>
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 提示消息 -->
    <el-alert title="添加商品信息" type="success" center show-icon class="goodsTitle">
    </el-alert>
    <!-- 步骤条 -->
    <el-steps :active="active-0" finish-status="success" style="margin-top: 20px">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- tabs标签 -->
    <el-form :model="form" label-width="80px" style="height:350px;overflow:auto" label-position="top">
        <el-tabs v-model="active" tab-position="left" @tab-click="tabChange()">
            <el-tab-pane label="基本信息" name="1">
                <el-form-item label="商品名称">
                    <el-input v-model="form.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格">
                    <el-input v-model="form.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="商品重量">
                    <el-input v-model="form.goods_weight"></el-input>
                </el-form-item>
                <el-form-item label="商品数量">
                    <el-input v-model="form.goods_number"></el-input>
                </el-form-item>
                <!-- 级联选择器 -->
                <el-cascader expand-trigger="hover" :options="options" :props="defaultProps" v-model="selectedOptions" @change="handleChange">
                </el-cascader>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="2">
                <!-- 点击第二个tab值,获取数据 -->
                <el-form-item :label="item1.attr_name" v-for="(item1, index) in arrDyparams" :key="index">
                    <el-checkbox-group v-model="item1.attr_vals">
                        <el-checkbox border :label="item2" v-for="(item2, index) in item1.attr_vals" :key="index"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="3">
                <!-- 点击第三个tab   获取数据 -->
                <el-form-item :label="item.attr_name" v-for="(item, index) in arrStaticparams" :key="index">
                    <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="4">
                <el-upload 
                class="upload-demo" 
                action="http://localhost:8888/api/private/v1/upload"
                :headers="headers" 
                :on-preview="handlePreview" 
                :on-remove="handleRemove"
                :on-success="handleSuccess" 
                list-type="picture"
                >
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="5">
                 <el-form-item> 
                     <el-button type="primary" @click="addGood()">添加商品</el-button>
                    <!-- 富文本编辑器 -->
                     <quill-editor v-model="form.goods_introduce"></quill-editor>
                </el-form-item>
            </el-tab-pane>
        </el-tabs>
    </el-form>

</el-card>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
 
import { quillEditor } from 'vue-quill-editor'

export default {
    components: {
        quillEditor
    },
    data() {
        return {
            active: '1',
            // goods_name 商品名称 不能为空
            // goods_cat 以为 ','分割的分类列表 不能为空
            // goods_price 价格 不能为空
            // goods_number 数量 不能为空
            // goods_weight 重量 不能为空
            // goods_introduce 介绍 可以为空
            // pics 上传的图片临时路径（ 对象） 可以为空
            // attrs 商品的参数（ 数组） 可以为空
            form: {
                goods_name: '',
                goods_cat: '',
                goods_price: '',
                goods_number: '',
                goods_weight: '',
                goods_introduce: '',
                pics: [],
                attrs: ''
            },
            //3级分类的数据
            options: [],
            //级联选择器v-model绑定的数据
            selectedOptions: [1, 3, 6],
            //props属性的值
            defaultProps: {
                //分类id
                value: 'cat_id',
                //分类名称
                label: 'cat_name',
                children: 'children'
            },
            //动态参数的数据
            arrDyparams: [],
            //静态参数的数据
            arrStaticparams: [],
            //图片上传
            headers:{
                Authorization:localStorage.getItem('token')
            }
        }
    },
    created() {
        this.getGoodsCateList()
    },
    methods: {
        //添加商品 发送post请求
        async addGood () {
            //1.goods_cat
            this.form.goods_cat=this.selectedOptions.join(',')
            //2.pics
            //3attrs
            // console.log(this.arrDyparams)
            //动态参数
            let arr1 = this.arrDyparams.map((item)=>{
                return {"attr_id":item.attr_id,"attr_value":item.attr_vals}
            });
            //静态参数
            let arr2 = this.arrStaticparams.map((item)=>{
                return {"attr_id":item.attr_id,"attr_value":item.attr_vals}
            });
            let attrs=[...arr1,...arr2]
            this.form.attrs = attrs
            const res = await this.$http.post(`goods`,this.form)
            console.log(res)
            //回到商品列表页
            this.$router.push({name:'goods'})
        },
        //图片上传
        handleRemove(file, fileList) {
            // console.log('...................................')
            // console.log(file, fileList);
            // file.response.data.tmp_path
            let index =this.form.pics.findIndex(item=>{
                return item.pic===file.response.data.tmp_path
            })
            // console.log(index)
            this.form.pics.slice(index,1)
            // console.log(this.form.pics)
        },
        handlePreview(file) {
            // console.log(file);
        },
        handleSuccess(file){
            // console.log('...................................')
            // console.log(file)
            // file.data.tmp_path
            this.form.pics.push({pic:file.data.tmp_path})
        },
        //tab切换时的方法
        async tabChange() {
            if (this.selectedOptions.length !== 3) {
                this.$message.warning('请先选择第三级分类')
                return
            }
            if (this.active === '2') {
                //发送请求获取动态参数
                const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`)
                // console.log(res)
                this.arrDyparams = res.data.data
                this.arrDyparams.forEach(item => {
                    item.attr_vals = item.attr_vals.trim().split(',')
                });
            } else if (this.active === '3') {
                const res = await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`)
                // console.log(res);
                this.arrStaticparams = res.data.data
            }
        },
        handleChange() {

        },
        //获取三级分类的商品数据
        async getGoodsCateList() {
            const res = await this.$http.get(`categories?type=3`)
            // console.log(res)
            this.options = res.data.data
        }
    }
}
</script>

<style>
.goodsTitle {
    margin-top: 20px
}
.ql-editor {
    min-height:200px
}
</style>
