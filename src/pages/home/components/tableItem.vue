<template>
  <div class="table-item" :class="{'batch':batch}">
    <div class="name" :title="it.fileName" @click="itemClick(it)">
      <div class="inner-text">{{it.fileName}}</div>
    </div>
    <div class="username">{{it.operator}}</div>
    <div class="uploadTime">{{date(it.uploadDate)}}</div>
    <div class="fileSize">{{it.fileSize}}</div>
    <div class="operation" v-if="!it.status && it.status !== 0">
      <i class="el-icon-download"></i>
      <el-dropdown>
        <span class="el-dropdown-link">
          <i class="el-icon-more"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native.stop="history(it)">
            <i class="el-icon-files"></i>
            历史
          </el-dropdown-item>
          <el-dropdown-item @click.native.stop="preview(it)">
            <i class="el-icon-view"></i>
            预览
          </el-dropdown-item>
          <el-dropdown-item @click.native.stop="remove(it)">
            <i class="el-icon-delete"></i>
            删除
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
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
import { mapMutations } from "vuex";
import homeMixins from "@/mixins/home";

export default {
  mixins: [homeMixins],

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

  methods: {
    date,
    ...mapMutations("common", ["changePending"]),

    // 每条数据被点击时，默认打开此文件的预览
    // 当批量操作时，则 添加/删除
    itemClick(it) {
      if (!this.batch) {
        this.preview(it);
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

  &.batch {
    margin-left: 40px;
  }

  >* {
    flex-basis: 8.333333333333334%;
    color: #666;

    &:nth-child(1) {
      display: flex;
      flex-basis: 50%;
      transition: all 0.3s;
      padding: 22px 0;
      padding-right: 16px;
      cursor: pointer;
      lineClamp(1);

      .inner-text {
        flex: 1;
      }
    }

    &:nth-child(3) {
      flex-basis: 16.666666666666668%;
    }

    &:nth-child(5) {
      text-align: center;
      flex-basis: 16.666666666666668%;

      i {
        font-size: 20px;
        margin-right: 20px;
        cursor: pointer;

        &:hover {
          color: $mc;
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
