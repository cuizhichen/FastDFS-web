<template>
  <div class="upload-comp">
    <el-upload
      class="upload-demo"
      ref="upload"
      action="http://192.100.2.39:12580/upload"
      :auto-upload="false"
      :on-change="onChange"
      :disabled="loading"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-progress="onProgress"
      :on-success="onSuccess"
      :on-error="onError"
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
import axios from "axios";

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
      dialogText: "",
      dialogVisible: false,
      isConfirm: true
    };
  },

  methods: {
    // 文件即将开始上传时
    beforeUpload(file) {
      const reg = /(?<=\.)\w+$/;
      let newFile = {};
      newFile.fileName = file.name;
      newFile.fileSize = (file.size / 1024).toFixed(1) + "kb";
      newFile.operator = "方程";
      newFile.uploadDate = file.uid;
      newFile.status = 0;
      let list = [...[newFile], ...this.list];
      this.$emit("update:list", list);
      this.$emit("update:loading", true);
    },

    async onChange(file) {
      if (!this.isConfirm) {
        this.isConfirm = true;
        return;
      }

      let a = await api("get", "findFile", {
        params: { fileName: file.name }
      });
      if (!a) {
        this.$confirm(`${file.name}文件已存在，是否更新其版本`).then(r => {
          if (r === "confirm") {
            this.$refs.upload.submit();
            this.isConfirm = false;
          }
        });
      } else {
        this.$refs.upload.submit();
        this.isConfirm = false;
      }
    },

    // 文件上传时，获取当前上传的文件列表
    onProgress(event, file, fileList) {
      let list = [...this.list];
      list[0].status = parseFloat(event.percent.toFixed(0));
      this.$emit("update:list", list);
    },

    async onSuccess(r, file) {
      this.$emit("update:loading", false);

      if (r.msg === 2) {
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

    onError(r) {
      this.$emit("update:loading", false);
      this.dialogVisible = true;
      this.dialogText = "文件上传失败，请重新上传";
      this.$emit("getList");
    },

    submitUpload() {
      this.$refs.upload.submit();
    }
  }
};
</script>

<style lang="stylus">
.upload-comp {
  .upload-demo {
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
