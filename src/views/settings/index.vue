<template>
  <div class="settings-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>个人设置</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <!-- form表单 -->

      <el-row>
        <el-col  :span="15">
          <el-form ref="form" :model="user" label-width="70px">
            <el-form-item label="编号">
              {{ user.id }}
            </el-form-item>
            <el-form-item label="手机">
              {{ user.mobile }}
            </el-form-item>
            <el-form-item label="媒体名称">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
              :loading="updateUserProfileLoading"
               @click="onUpdataUser"
               >保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset ="2" :span="4">
          <label for="file">
            <el-avatar shape="square" :size="150" fit="fit" :src="user.photo">
            </el-avatar>
            <p>点击上传头像</p>
          </label>
          <!-- <p @click="$refs.file.click()">点击上传头像</p> -->
          <input
            id="file"
            ref="file"
            type="file"
            hidden
            @change="onFileChange"
          />
        </el-col>
      </el-row>
    </el-card>
    <!-- 修改头像 -->
    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      width="30%"
      append-to-body
      @opened="onDialogOpened"
      @closed="onDialogClosed"
    >
    <div class="preview-image-wrap">
        <img 
         class="preview-image" 
         :src="previewImage" 
         ref="preview-image"
         >
    </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button 
        type="primary" 
        :loading="UpdatePhotoLoading"
        @click="onUpdataPhoto"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserProfile,UpdateUserPhoto,updateUserProfile } from "@/api/user";
import globalbus from "@/utils/global-bus"
import 'cropperjs/dist/cropper.css';
import Cropper from 'cropperjs';
export default {
    name:'SettingIndex',
  data() {
    return {
      user: {
        email: "",
        id: null,
        intro: "",
        mobile: "",
        name: "",
        photo: "",
      },
    dialogVisible:false,//控制上传图片裁剪预览的显示状态
    previewImage:'',//预览图片
    cropper:'null',//裁剪器实例
    UpdatePhotoLoading:false,//更新用户头像 loading
    updateUserProfileLoading:false //更新基本信息的状态 Loading
    }
  },
  created() {
    this.loaduesr();
  },
  methods: {
    onUpdataUser() {
      this.updateUserProfileLoading = true
      //console.log("submit!");
     // updateUserProfile(this.user)
     const { name, intro, email} = this.user
     updateUserProfile({name,intro,email}).then(res =>{
       //console.log(res)
        this.$message({
          type:"success",
          message:'保存成功'
      })

      this.updateUserProfileLoading = false

       globalbus.$emit('update-user',this.user)
      
 })

    },
    loaduesr() {
      getUserProfile().then((res) => {
       // console.log(res);
        this.user = res.data.data;
      });
    },
    onFileChange() {
      //console.log("hhhh");
            const file = this.$refs.file
            //console.log(file.files[0])
            const blobData = window.URL.createObjectURL(file.files[0])

            this.previewImage = blobData


      // 展示弹出层，预览用户选择的图片
        this.dialogVisible = true
      // 解决选择相同文件不触发 change事件问题
      this.$refs.file.value = "";
    },
    onDialogOpened(){
        //图片裁剪器必须基于 img 进行初始化
        //注意：img必须是可见状态才能正常完成初始化，因为我们这里要在对话框里面初始化裁剪器
        //所以务必在对话框完全打开的状态去进行初始化
        //
        //获取图片 Dom节点
        const image = this.$refs['preview-image']

        //第一次初始化好以后，如果预览裁剪的图片发生了变化，裁剪器默认不会更新
        //如果需要预览图片发生更新裁剪器
        // 方式一：裁剪器.replace 方法
        // 方式二：销毁裁剪器，重新初始化
        //初始化裁剪器
      // if(this.cropper){
      //     this.cropper.replace(this.previewImage)
      //     return
      // }
        this. cropper = new Cropper(image, {
          aspectRatio: 1,
          viewMode: 1,
          dragMode:'none',
          cropBoxResizable: false
        })
    },
    onDialogClosed(){
        // 对话框关闭，销毁裁剪器
            this.cropper.destroy()
    },
    onUpdataPhoto(){
      //让确定按钮开始loading
      this.UpdatePhotoLoading=true
        //获取裁剪的图片对象
        this.cropper.getCroppedCanvas().toBlob(file =>{
            const fd = new FormData()
            fd.append('photo',file)
            // //请求更新新用户头像请求提交 fd
            UpdateUserPhoto(fd).then(res =>{
              //关闭对话框
              this.dialogVisible = false
             // console.log(res)
             //更新视图展示

            // 直接把裁剪结果的文件对象转为 blob本地预览
             this.user.photo = window.URL.createObjectURL(file)
             // 把服务端返回的图片进行展览有点慢
            // this.user.photo = res.data.data.photo

            //让确定按钮关闭loading
              this.UpdatePhotoLoading=false
              this.$message({
                type:"success",
                message:'更新头像成功'
              })

                globalbus.$emit('update-user',this.user)
            })
        })    
    }
  }
}
</script>

<style scoped lang="less">
.preview-image-wrap {
    .preview-image {
         /* Ensure the size of the image fit the container perfectly */
  display: block;

  /* This rule is very important, please don't ignore this */
  max-width: 100%;
  height: 200px;
    }
}
</style>