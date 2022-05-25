// 请求模块
import axios from 'axios'
import JSONbig from 'json-bigint'
import router from '@/router'
import { Message } from 'element-ui'

const request = axios.create({
  // baseURL: 'http://ttapi.research.itcast.cn/',
  baseURL: 'http://api-toutiao-web.itheima.net/', // 请求的基础路径
  // 定义后端返回的原始数据的处理
  // 参数 data 就是后端返回的原始数据 未经处理的 JSON 格式字符串
  transformResponse: [function (data) {
    // 后端返回的数据可能不是 JSON 格式字符串
    // 如果不是的话 那么 JSONbig.pares 调用就会报错
    // 所以我们使用 try-catch 来捕获异常 处理异常的发生
    try {
      // 如果转换成功 则直接把结果返回
      return JSONbig.parse(data)
    } catch (err) {
      console.log('转换失败', err)
      // 如果转换失败了 则进入这里
      // 我们在这里把数据原封不动的直接返回给请求使用
      return data
    }
    // axios 默认在内部使用 JSON.parse 来转换处理原始数据
    // return JSON.parse(data)
  }]
})

// 请求拦截器
request.interceptors.request.use(
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    // console.log(user)
    // 如果用户已经登录 统一给请求设置token信息
    if (user) {
      // 设置token
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(function (response) {
  // 所有响应码为 2xx 的响应都会进入这里

  // response 是响应处理
  // 注意 一定要把响应结果 return 否则真正发送请求的位置拿不到数据
  return response
}, function (error) {
  const { status } = error.response
  // 任何超出 2xx 的响应码都会进入这里
  // console.log('状态码异常')
  // console.dir(error)
  if (status === 401) {
    // 跳转到登录页面
    // 清楚本地存储中的用户登录状态
    window.localStorage.removeItem('user')
    router.push('/login')
    Message.error('登录状态无效，请重新登录')
  } else if (status === 403) {
    // token 未携带或已过期
    Message.error('没有操作权限')
  } else if (status === 400) {
    // 客户端参数错误
    Message.error('参数错误，请检查请求参数')
  } else if (status >= 500) {
    Message.error('服务端内部异常，请稍后重试')
  }
  return Promise.reject(error)
})

// 导出请求方法
export default request
