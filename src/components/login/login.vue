<template>
<div class="login-wrap">
    <el-form label-position="top" label-width="80px" :model="formdata" class="login-form">
        <h2>用户登录</h2>
        <el-form-item label="用户名">
            <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
            <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-button class="login-button" type="primary" @click.prevent="postLogin()">登录</el-button>
    </el-form>
</div>
</template>

<script>
export default {
    data() {
        return {
            formdata: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        async postLogin() {
            //简化异步请求
            const res = await this.$http.post('login', this.formdata)
            console.log(res)
            const {
                meta: {
                    status,
                    msg
                },
                data
            } = res.data
            if (status === 200) {
                //保存用户token
                const token = localStorage.setItem('token', data.token)
                this.$router.push({
                    name: 'home'
                })
                this.$message.success(msg);
            } else {
                this.$message.error(msg);
            }

            // this.$http.post('login',this.formdata).then(res=>{
            //     // console.log(res)
            //     const {meta:{status,msg},data} = res.data
            //     if(status===200){
            //         this.$router.push({name:'home'})
            //         this.$message.success(msg);
            //     }else{
            //         this.$message.error(msg);
            //     }
            // })
        }
    }
}
</script>

<style>
.login-wrap {
    background-color: #324152;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.login-wrap .login-form {
    background-color: #fff;
    padding: 30px;
    width: 400px;
    border-radius: 5px;
}

.login-form .login-button {
    width: 100%;
}
</style>
