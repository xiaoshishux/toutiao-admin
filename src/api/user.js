/**
 * 
 * 用户相关请求模块
 */
 import request from "@/utils/request";

//  用户登录>
export const login = data => {
    return request({
        method: "post",
        url: "/mp/v1_0/authorizations",
        // data 用来设置 POST 请求体
        data   //在ES6中属性值与属性名同名时 （data: data）可以简写data
      })
}
//  获取用户信息
export const getUserProfile = () => {
 // const user = JSON.parse(window.localStorage.getItem('user'))
  return request({
    method:"get",
    url:"/mp/v1_0/user/profile"
    //  后端要求把需要授权的用户身份放在请求头中
    //  axios可以通过 headers 选项设置请求头
   // headers:{
      //  属性名和值都得看接口的要求
      //  属性名：Authorization
      //  属性值：Bearer空格token数据
    //  Authorization: `Bearer ${user.token}`
  //  }
  })
}
//  修改用户信息
//export const UpdataUser = () => {
//
//}

  //  修改用户头像,注意：data必须传递 FromData对象

export const UpdateUserPhoto = data => {
  return request({
    method:'PATCH',
    url:'/mp/v1_0/user/photo',
    data
  })
}


//  修改用户基本信息
export const updateUserProfile = data => {
  return request({
    method:'PATCH',
    url:'/mp/v1_0/user/profile',
    data
  })
}