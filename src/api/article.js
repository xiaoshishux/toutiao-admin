/** 
 * 
 * 文章相关请求模块
 * 
*/

import request from "../utils/request"


/** 
 * 
 * 获取文章列表
 * 
*/

export const getArticles  = params => {
    return request({
        method: 'get',
        url: '/mp/v1_0/articles',
        // Body 参数使用 data 设置
        // Query 参数使用 params 设置
        // Headers 参数使用 headers 设置
        params//在ES6中属性值与属性名同名时 params: params）可以简写params
    })
}


/** 
 * 
 * 获取文章频道
 * 
*/

export const getArticleChannels  = () => {
    return request({
        method: 'get',
        url: '/mp/v1_0/channels',
    })
}



/** 
 * 
 * 删除文章
 * 
*/

export const deleteArticle  = articleId => {
    return request({
        method: 'DETELE',
        url: `/mp/v1_0/articles/${articleId}`,
    })
}


/** 
 * 
 * 新建文章
 * 
*/

export const addArticle  = (data,draft = false) => {
    return request({
        method: 'post',
        url: '/mp/v1_0/articles',
        params:{
            draft //    是否存为草稿（true 为草稿）
        },
        data
    })
}



/** 
 * 
 * 编辑文章
 * 
*/

export const updateArticle  = (articleId ,data ,draft = false) => {
    return request({
        method: 'put',
        url: `/mp/v1_0/articles/${articleId}`,
        params:{
            draft //    是否存为草稿（true 为草稿）
        },
        data
    })
}


/** 
 * 
 * 获取指定文章
 * 
*/

export const getArticle  = articleId => {
    return request({
        method: 'get',
        url: `/mp/v1_0/articles/${articleId}`,
    })
}


/** 
 * 
 * 修改文章评论状态
 * 
*/

export const updateCommenStatus  = (articleId,allowComment) => {
    return request({
        method: 'PUT',
        url: '/mp/v1_0/comments/status',
        params:{
            //对象的属性名不受代码规范限制
            article_id:articleId
        },
        data:{
            allow_comment:allowComment
        }
    })
}
