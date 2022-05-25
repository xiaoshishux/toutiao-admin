<template>
  <el-container class="layout-container">
    <el-aside class="aside" width="auto">
      <app-aside class="aside-menu" :is-collapse = "isCollapse"></app-aside>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <i 
          :class="{
            'el-icon-s-fold': isCollapse,
            'el-icon-s-unfold':!isCollapse
            }"
          @click="isCollapse = !isCollapse"
          ></i>
          <span>江苏传智播客科技教育有限公司</span>
        </div>
        <el-dropdown>
            <div class="avatar-wrap">
                <img class="avatar" :src="user.photo" alt="">
                <span>{{user.name}}</span>
                <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="onSettings">设置</el-dropdown-item>
            <el-dropdown-item @click.native="onlogout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <!-- 子路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from "./component/aside.vue";
import { getUserProfile } from "@/api/user"
import globalbus from "@/utils/global-bus"



export default {
  name: "LayotIndex",
  components: {
    AppAside,
  },
  props: {},
  data() {
    return {
      user:'',//当前登录用户信息
      isCollapse: false //  侧边菜单栏的展示状态
    };
  },
  computed: {},
  watch: {},
  created() {
    //  组件初始化好，请求获取用户资料
    this.loadUserProfile()

    //注册自定义事件
      globalbus.$on('update-user',(data)=>{
        //console.log('update-user',data)
        //this.user = data
        this.user.name = data.name
        this.user.photo = data.photo
      })
  },
  mounted() {},
  methods: {
    //除了登录接口，其他所有接口都需要授权才能请求使用，或者说，除了登录接口，其他接口都需要提供你的身份令牌才能获取数据
    loadUserProfile(){
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },

   onSettings(){
     this.$router.push('/settings')
   },
    onlogout(){
       this.$confirm('确定退出吗?', '退出提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //  把用户的登录状态清除
          window.localStorage.removeItem('user')
          //  跳转到登录页面
          this.$router.push('/login')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          })          
        })
    }
  },
};
</script>

<style scoped lang="less">
.layout-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.aside {
  background-color: #d3dce6;
  .aside-menu {
    height: 100%;
  }
}

.header {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    //background-color: #b3c0d1;
    border-bottom: 1px solid #ccc;
}

.avatar-wrap {
    display: flex;
    align-items: center;
    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 10px;
    }
  }

.main {
  background-color: #e9eef3;
}
</style>