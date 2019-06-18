<template>
  <div class="upload-comp">
    <el-upload
      class="upload-demo"
      ref="upload"
      :action="`${ip}/upload`"
      :disabled="loading"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-progress="onProgress"
      :on-success="onSuccess"
      :on-error="onError"
      drag
      multiple
    >
      <el-button size="small" :disabled="loading" type="primary">点击上传</el-button>
    </el-upload>

    <el-dialog title="提示" top="26vh" :visible.sync="dialogVisible" width="30%">
      <span class="dialog-text" v-html="dialogText"></span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { date } from "@/lib/help";
import api from "@/lib/api";
import { log } from "util";
import { mapState } from "vuex";

export default {
  props: {
    list: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      dialogText: "", // dialog的内容根据情况改变
      dialogVisible: false, // dialog是否出现
      isConfirm: false, // 当确定上传时改变为false，用于异步处理onChange方法
      authorList: []
    };
  },

  computed: {
    ...mapState({
      ip: state => state.common.ip
    })
  },

  methods: {
    // 文件即将开始上传时
    beforeUpload(file) {
      // 初始化一个文件，status用于控制进度条
      let newFile = {};
      newFile.fileName = file.name;
      newFile.fileSize = (file.size / 1024).toFixed(1) + "kb";
      newFile.operator = "我";
      newFile.uploadDate = file.uid;
      newFile.status = 0;
      this.list.unshift(newFile);

      this.$emit("update:loading", true);
      return true;
    },

    // 文件上传时，获取当前上传的文件列表
    onProgress(event, file, fileList) {
      fileList.forEach((file, index) => {
        this.list[index].status = parseFloat(file.percentage.toFixed(0));
      });
    },

    // 上传成功时
    onSuccess(r, file, fileList) {
      console.log(fileList);
      this.$emit("update:loading", false);

      if (r === 2) {
        this.dialogVisible = true;
        this.dialogText = `<div class='dialog-title'>文件上传失败</div>
         <div class='dialog-desc'>请检查你的文件大小（不超过500MB）</div>`;
        this.$emit("getList");
        return;
      }

      // 上传成功提示的通知
      let notify = this.$notify({
        title: "上传成功",
        message: `${file.name}上传成功，提示窗三秒后自动消失`,
        type: "success",
        duration: 3000,
        onClick: () => {
          notify.close();
        }
      });

      this.$emit("getList");
    },

    // 上传失败时
    onError(r) {
      this.$emit("update:loading", false);
      this.dialogVisible = true;
      this.dialogText = "文件上传失败，请重新上传";

      this.$emit("getList");
    },

    onExceed(files, fileList) {
      this.fileList = [];
      this.dialogVisible = true;
      this.dialogText = `<div class='dialog-title'>文件上传失败</div>
         <div class='dialog-desc'>单次上传文件个数不可多余10个</div>`;
      this.$emit("getList");
    }
  }
};
</script>

<style lang="stylus">
.upload-comp {
  .upload-demo {
    .el-upload-dragger {
      width: auto;
      height: auto;
      border: none;
      background: transparent;
    }

    button {
      padding: 10px 36px;
      font-size: 13px;
    }
  }

  .dialog-text {
    text-align: center;
    line-height: 2em;

    .dialog-title {
      font-size: 16px;
      color: #444;
    }

    .dialog-desc {
      font-size: 14px;
      color: #999;
    }
  }
}

.el-loading-mask {
  .el-icon-loading {
    font-size: 30px;
    margin-bottom: 12px;
  }
}
</style>
