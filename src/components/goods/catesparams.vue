<template>
<el-card>
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <!-- 提示框 -->
    <el-alert title="只允许为第三级分类设置参数" type="error" class="alertcss">
    </el-alert>
    <!-- 级联选择器 -->
    <el-form label-width="80px" class="fmt">
        <el-form-item label="商品名称">
            <el-cascader
            clearable 
            expand-trigger="hover" 
            :options="options" 
            :props="defaultProps" 
            v-model="selectedOptions" 
            @change="handleChange"
            :show-all-levels="false">
            </el-cascader>
        </el-form-item>
    </el-form>
    <!-- tabs -->
    <el-tabs v-model="active" @tab-click="handleClick">
            <el-tab-pane label="动态参数" name="1">
                <el-button type="danger">设置动态参数</el-button>
                <!-- 表格 -->
                  <el-table
                    :data="arrDyparams"
                    style="width: 100%">
                    <el-table-column type="expand" label="#">
                        <template slot-scope="scope">
                            <el-tag
                                :key="tag"
                                v-for="tag in scope.row.attr_vals"
                                closable
                                :disable-transitions="false"
                                @close="handleClose(scope.row,tag)">
                                {{tag}}
                            </el-tag>
                            <el-input
                                class="input-new-tag"
                                v-if="inputVisible"
                                v-model="inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>

                        </template>
                    </el-table-column>
                    <el-table-column label="属性名称" prop="attr_name">
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
                                    type="danger"
                                    icon="el-icon-delete"
                                    circle
                                    @click="deleteUser(scope.row)"
                                ></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="静态参数" name="2">
                <el-button type="danger">设置静态参数</el-button>
                <el-table
                  :data="arrStaticparams"
                  style="width: 100%">
                  <el-table-column
                    type="index"
                    label="#"
                    width="80">
                  </el-table-column>
                  <el-table-column
                    prop="attr_name"
                    label="属性名称"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="attr_vals"
                    label="属性值">
                  </el-table-column>
                </el-table>
            </el-tab-pane>
    </el-tabs>
</el-card>
</template>

<script>
export default {
    data () {
        return {
            //3级分类的数据
            options: [],
            //级联选择器v-model绑定的数据
            selectedOptions: [],
            //props属性的值
            defaultProps: {
                //分类id
                value: 'cat_id',
                //分类名称
                label: 'cat_name',
                children: 'children'
            },
            //动态参数
            arrDyparams:[],
            active:'1',
            //表格数据
            list:[],
            inputVisible: false,
            inputValue: '',
            arrStaticparams:[]
        }
    },
    created () {
        this.getGoodsCateList()  
    },
    methods: {
      async handleClose(attr,tag) {
        attr.attr_vals.splice(attr.attr_vals.indexOf(tag), 1);
        //发送请求
        const res = await this.$http.put(`categories/${this.selectedOptions[2]}/attributes/${attr.attr_id}`)
        // console.log(res)
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      async handleInputConfirm(attr) {
        let inputValue = this.inputValue;
        if (inputValue) {
          attr.attr_vals.push(inputValue);
          //categories/:id/attributes
          const res =await this.$http.post(`categories/${this.selectedOptions[2]}/attributes`,{
              attr_name:attr.attr_name,
              attr_sel:"many",
              attr_vals:attr.attr_vals.join(",")
          })
        //   console.log(res)
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
        async handleChange(){
            if(this.selectedOptions.length===3){
                //获取动态参数
                const res = await this.$http.get(
                    `categories/${this.selectedOptions[2]}/attributes?sel=many`
                )
                  this.arrDyparams = res.data.data
                  console.log(this.arrDyparams)
                  this.arrDyparams.forEach(item=>{
                      item.attr_vals=
                        item.attr_vals.trim().length===0?[]:item.attr_vals.trim().split(",")
                  })
            }
        },
          //获取三级分类的商品数据
        async getGoodsCateList() {
            const res = await this.$http.get(`categories?type=3`)
            // console.log(res)
            this.options = res.data.data
        },
        async handleClick () {
            if(this.active==='2'){
                if(this.selectedOptions.length===3){
                    const res = await this.$http.get(
                        `categories/${this.selectedOptions[2]}/attributes?sel=only`
                    )
                    this.arrStaticparams=res.data.data
                    console.log(res)
                }
            }
        }
    }
}
</script>

<style>
.fmt,.alertcss {
    margin-top: 20px
}
.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
