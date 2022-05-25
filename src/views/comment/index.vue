<template>
  <div class="comment-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 数据列表 -->
      <el-table :data="articles" style="width: 100%">
        <el-table-column prop="title" label="标题" >
        </el-table-column>
         <el-table-column prop="total_comment_count" label="总评论数" >
        </el-table-column>
         <el-table-column prop="total_comment_count" label="粉丝评论数" >
        </el-table-column>
         <el-table-column prop="lllll" label="评论状态" >
           <template slot-scope="scope">
             {{scope.row.comment_status ? '正常':'关闭'}}
           </template>
        </el-table-column>
         <el-table-column prop="date" label="操作" >
           <template slot-scope="scope">
             <el-switch
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :disabled = "scope.row.statusDisabled"
              @change = "onStatusChange(scope.row)">
            </el-switch>
           </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="[10,20,30,40,50]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        background >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {getArticles,updateCommenStatus} from "@/api/article"
export default {
  name: "CommentIndex",
  data() {
    return {
      articles:[],//文章数据列表
      totalCount:0,//总数据条数
      pageSize:10,
      page:1//当前激活页码
    }
  },
    computed: {},
    watch: {},
    created() {
        this.loadArticles()
    },
    methods: {
      handleSizeChange () {
        this.loadArticles(1)
      },
      handleCurrentChange(page){
        //页码改变，加载指定页码数据
        this.loadArticles(page)
      },
        loadArticles(page = 1){
          this.page = page
            getArticles({
               response_type: "comment",
               page,
               per_page:this.pageSize
            }).then(res =>{
              const { results } = res.data.data
              results.forEach(article =>{
                article.statusDisabled = false
              })
                //console.log(res)
               this.articles = res.data.data.results
               this.totalCount = res.data.data.total_count
            })
        },
        onStatusChange(article){
          article.statusDisabled = true
          //console.log(article.comment_status)
          updateCommenStatus(article.id.toString(),article.comment_status).then(res =>{
              //console.log(res)
          })
          article.statusDisabled = false
           this.$message({
             type:"success",
             message:article.comment_status ? '开启文章评论状态':'关闭文章评论状态'
           })
        }
    }
};
</script>

<style>
</style>