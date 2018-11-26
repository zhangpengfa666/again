import axios from 'axios'
const MyPlugin = {}
MyPlugin.install = function (Vue) {
// 添加实例方法
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  Vue.prototype.$http = axios
}
export default MyPlugin
