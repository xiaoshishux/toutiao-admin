<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- 数据筛选表单 -->
      <el-form ref="form" :model="form" label-width="60px" size="mini">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择频道">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel, index) in channels"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <!-- button 按钮的 click 事件有个默认参数，当你没有指定参数的时候，他会默认传递一个没用的数据 -->
          <el-button type="primary" :disabled="loading" @click="loarArticles(1)"
            >筛选</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        根据筛选条件共查询到{{ totalCount }}条结果
      </div>
      <!-- 数据列表 -->
      <!-- 
          Table 表格组件
            1、把需要展示的数组列表绑定给 table 组件的 data 属性
                注意：你不用去v-for 遍历，它自己会遍历
            2、设计表格列 el-table-column
                width 可以设定表格列的宽度
                label 可以设定列的标题
                prop 用来设定要渲染的列表项数据字段，只能展示文本
            3、表格列默认只能渲染普通文本，如果需要展示其他内容（例如放一个按钮，图片），那需要自定义表格列模板了
       -->
      <el-table
        :data="articles"
        style="width: 100%"
        stripe
        class="list-table"
        size="mini"
        v-loading="loading"
      >
        <el-table-column prop="date" label="封面">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.cover.images[0]"
              fit="cover"
            >
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
            <!-- <img v-if="scope.row.cover.images[0]"  :src="scope.row.cover.images[0]" alt="">
                <img v-else class="article-cover" src="./pic_bg.png" alt=""> -->
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"> </el-table-column>
        <el-table-column prop="address" label="状态">
          <!-- 如果需要在自定义列模板中获取当前遍历项数据，那么就在 template 上声明 slot-scope="scope" -->
          <template slot-scope="scope">
            <el-tag :type="articleStatus[scope.row.status].type">{{
              articleStatus[scope.row.status].text
            }}</el-tag>
            <!-- <el-tag v-if="scope.row.status === 0" type="warning">草稿</el-tag>
            <el-tag v-else-if="scope.row.status === 1">待审核</el-tag>
            <el-tag v-else-if="scope.row.status === 2" type="success">审核通过</el-tag>
            <el-tag v-else-if="scope.row.status === 3" type="danger">审核失败</el-tag>
            <el-tag v-else-if="scope.row.status === 4" type="info">已删除</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"> </el-table-column>
        <el-table-column prop="address" label="操作">
          <!-- 如果需要自定义表格列模板，则把需要自定义的内容放到template里面 -->
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              circle
              type="primary"
              @click="$router.push('/publish?id=' +scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="onDeleteArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 列表分页 -->
      <!-- total 用来设定总数据的条数，它默认按照10条每页计算总页码 
      pageSize: 按照xxxx条每页计算总页码-->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        @current-change="onCurrentChange"
        :pageSize="pageSize"
        :disabled="loading"
        :current-page.sync = "page"
      />
    </el-card>
  </div>
</template>

<script>
import { getArticles, getArticleChannels, deleteArticle } from "@/api/article";
export default {
  name: "ArticleIndex",
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      articles: [], //文章数据列表
      articleStatus: [
        { status: 0, text: "草稿", type: "info" }, // 0
        { status: 1, text: "待审核", type: "" }, // 1
        { status: 2, text: "审核通过", type: "success" }, // 2
        { status: 3, text: "审核失败", type: "warning" }, // 3
        { status: 4, text: "已删除", type: "danger" }, // 4
      ],
      totalCount: 0, //总数据条数
      pageSize: 20,
      status: null, //查询文章的状态, 不传就是全部
      channels: [], //文章频道列表
      channelId: null, //查询文章的频道
      rangeDate: [], //筛选的范围日期
      loading: true, //表单数据加载中 Loading
      page:1//当前页码
    };
  },
  created() {
    this.loarChannels();
    this.loarArticles(1);
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },

    loarArticles(page = 1) {
      //展示加载中loading
      this.loading = true;

      //在组件中初始调用获取数据,例如：封面，页码，状态等
      getArticles({
        page, //在ES6中属性值与属性名同名时 page: page）可以简写page
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null,
      }).then((res) => {
        //采用了解构
        //total_count是后台总数据名称，在代码格式规范中不允许这种命名，只能驼峰命名，所以重命名驼峰命名 total_count: totalCount
        const { results, total_count: totalCount } = res.data.data;
        this.articles = results;
        this.totalCount = totalCount;

        //关闭加载中loading
        this.loading = false;
      });
    },
    //页码触触发的方法
    onCurrentChange(page) {
      this.loarArticles(page);
    },

    loarChannels() {
      getArticleChannels().then((res) => {
        this.channels = res.data.data.channels;
      });
    },

    //找到数据接口
    //封装请求方法
    //删除请求调用
    //处理响应结果
    onDeleteArticle(articleId) {
      this.$confirm("确定删除吗?", "删除提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //确认执行这里
          deleteArticle(articleId.toString()).then((res) => {
            //删除成功，更新当前页的文章数据列表
            this.loarArticles(this.page)
          })
        }).catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
.filter-card {
  margin-bottom: 30px;
}
.list-table {
  margin-bottom: 20px;
}
.article-cover {
  width: 100px;
  background-size: cover;
}
</style>