<template>
  <div class="upload-image" @click="dialogVisible = true">
    <div class="cover-wrap">
      <img class="cover-image" ref="cover-image" :src="value" />
    </div>
    <el-dialog
      title="选择封面"
      :visible.sync="dialogVisible"
      append-to-body
      width="30%"
    >
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="素材库" name="first">
          <image-list
            :is-show-action="false"
            :is-show-add="false"
            is-show-selected
            ref="image-list"
          ></image-list>

        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
            <input type="file" ref='file' @change="onFileChane"/>
            <img ref="preview-image" width="100px">
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onCoverConfirm"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ImageList from '../../image/components/image-list'
import { uploadImage } from "@/api/image";
export default {
  name: "UploadImage",
  components: {
    ImageList
  },
  props:  ['value'],
  data() {
    return {
      dialogVisible: false,
      activeName: 'firs'
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
       handleClick(tab, event) {
        console.log(tab, event);
      },
      onFileChane(){
        // 获取文件对象
         const file = this.$refs.file
         // 图片预览
         const blob = window.URL.createObjectURL(file.files[0])
         this.$refs['preview-image'].src = blob
         //防止用户选择同一个文件不能触发 change 事件
         //this.$refs.file.value = ''
      },
      onCoverConfirm(){
          // 如果 tab 是上传图片 并且 input-file 有选择的文件 才执行上传图片的操作
      if (this.activeName === 'second') {
        const file = this.$refs.file.files[0]
        if (!file) {
          this.$message('请选择文件')
          return
        }
        const fd = new FormData()
        fd.append('image', file)
        uploadImage(fd).then(res => {
          console.log(res)
          this.dialogVisible = false
          this.$refs['cover-image'].src = res.data.data.url

          // this.$emit('update-cover', res.data.data.url)
          this.$emit('input', res.data.data.url)
        })
      } else if (this.activeName === 'first') {
        // 还有一种组件通信方式 父组件可以直接访问子组件中的数据
        const imageList = this.$refs['image-list']
        // console.log(imageList.selected)
        const selected = imageList.selected
        if (selected === null) {
          this.$message('请选择封面图片')
          return
        }
        // 关闭对话框
        this.dialogVisible = false
        // 修改父组件
        this.$emit('input', imageList.images[selected].url)
        }
      }
  }
};
</script>

<style scoped lang="less">
.cover-wrap {
  width: 150px;
  height: 120px;
  border: 1px solid #000;
  .cover-image {
    width: 100%;
    height: 100%;
  }
}
</style>