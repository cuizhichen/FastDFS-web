<template>
  <div class="table-item" :class="{'batch':batch}">
    <div class="name" :title="it.fileName">
      <div class="inner-text" @click="itemClick(it)">{{it.fileName}}</div>
    </div>
    <div class="username" @click="itemClick(it)">{{it.operator}}</div>
    <div class="uploadTime" @click="itemClick(it)">{{date(it.uploadDate)}}</div>
    <div class="fileSize" @click="itemClick(it)">{{it.fileSize}}</div>
    <div class="operation" v-if="!it.status && it.status !== 0">
      <el-button size="mini" :disabled="loading" plain @click.stop="history(it)">历史</el-button>
      <el-button size="mini" :disabled="loading" plain @click.stop="down(it)">下载</el-button>
      <el-button size="mini" :disabled="loading" plain @click.stop="preview(it)">预览</el-button>
      <el-button size="mini" :disabled="loading" plain type="danger" @click.stop="remove(it)">删除</el-button>
    </div>

    <div class="percent" v-else-if="typeof it.status === 'number'">
      <el-progress :percentage="it.status"></el-progress>
    </div>

    <div class="percent" v-else>{{it.status}}</div>
  </div>
</template>

<script>
import api from "@/lib/api";
import { date } from "@/lib/help";
import { mapState, mapMutations } from "vuex";

export default {
  props: {
    it: {
      type: Object,
      default: () => {}
    },

    loading: {
      type: Boolean,
      default: false
    },

    batch: {
      type: Boolean,
      default: false
    },

    historyList: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    ...mapState({
      pending: state => state.common.pending
    })
  },

  methods: {
    date,
    ...mapMutations("common", ["changePending"]),

    // 每条数据被点击时，默认打开此文件的预览
    // 当批量操作时，则 添加/删除
    itemClick(it) {
      if (!this.batch) {
        window.open(
          `http://192.100.2.39:8012/onlinePreview?url=http://192.100.2.8:80/${
            it.groupName
          }/${encodeURIComponent(it.remoteFileName)}`
        );
        return;
      }

      this.$emit("itemClick", it.fileName);
    },

    // 查看历史版本
    async history(it) {
      this.changePending(true);
      let data = await api("get", "showHistory", {
        params: { fileName: it.fileName }
      });

      this.$emit("update:historyList", data);
      this.changePending(false);
    },

    // 文件下载
    down(it) {
      window.location.href = `http://192.100.2.39:12580/downFile?groupName=${
        it.groupName
      }&remoteFileName=${it.remoteFileName}`;
    },

    // 文件预览
    preview(it) {
      window.open(
        `http://192.100.2.39:8012/onlinePreview?url=http://192.100.2.8:80/${
          it.groupName
        }/${encodeURIComponent(it.remoteFileName)}`
      );
    },

    // 文件删除
    async remove(it) {
      const data = await this.$confirm(`确定移除 ${it.fileName}？`);

      if (data === "confirm") {
        this.changePending(true);
        await api("post", "delete", { fileNameList: [it.fileName] });

        // 上传成功提示的通知
        let notify = this.$notify({
          title: "删除成功",
          message: `${it.fileName}删除成功，提示窗三秒后自动消失`,
          type: "success",
          duration: 3000,
          onClick: () => {
            notify.close();
          }
        });

        this.$emit("getList");
      } else return;
    }
  }
};
</script>

<style lang="stylus">
.table-item {
  display: flex;
  align-items: center;
  transition: all 0.3s;
  line-height: 28px;

  &.batch {
    margin-left: 40px;
  }

  >* {
    flex-basis: 8.333333333333334%;
    color: #666;

    &:nth-child(1) {
      transition: all 0.3s;
      flex-basis: 45.833333333333336%;
      padding-right: 16px;
      lineClamp(1);
      cursor: pointer;
      display: flex;

      .inner-text {
        flex: 1;
      }
    }

    &:nth-child(3) {
      flex-basis: 12.5%;
    }

    &:nth-child(5) {
      flex-basis: 25%;
      text-align: right;
    }
  }
}
</style>
