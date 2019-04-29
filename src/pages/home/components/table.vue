<template>
  <div class="table-comp">
    <div class="table-title row">
      <div
        class="title-item"
        :class="`col-md-${it.frid}`"
        v-for="it in titleList"
        :key="it.name"
        @click.stop="titleClick(it)"
      >
        {{it.name}}
        <span
          v-if="params.order === it.order"
          class="el-icon-back"
          :class="{active:params.asc}"
        ></span>
      </div>
    </div>

    <div class="table-body" v-if="list.length >= 0">
      <div
        class="body-item border-top"
        :class="{select:deleteList.indexOf(it.fileName) !== -1}"
        v-for="it in list"
        :key="it.name"
      >
        <div class="name" :title="it.fileName">
          <el-checkbox
            v-model="deleteList"
            :label="it.fileName"
            v-if="batchDelete"
            class="item-checkbox"
          >
            <span></span>
          </el-checkbox>
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
    </div>

    <div class="no-content" v-else>当前分类暂无数据</div>

    <div class="table-pagination" v-if="total > 10">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="changePagination"
        :page-size="params.size"
        :current-page.sync="params.current"
        :total="total"
      ></el-pagination>
    </div>

    <transition name="history">
      <history-version
        v-if="historyList.length > 0"
        :list.sync="historyList"
        :loading.sync="loading"
        @getList="getList"
      />
    </transition>
  </div>
</template>


<script>
import api from "@/lib/api";
import { date } from "@/lib/help";
import HistoryVersion from "./historyVersion";

export default {
  components: {
    HistoryVersion
  },

  props: {
    list: {
      type: Array,
      default: () => []
    },

    loading: {
      type: Boolean,
      default: false
    },

    pendingLoad: {
      type: Boolean,
      default: false
    },

    params: {
      type: Object,
      default: () => {}
    },

    total: {
      type: Number,
      default: 0
    },

    batchDelete: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      titleList: [
        {
          name: "文件名称",
          frid: 11,
          order: "file_name"
        },
        {
          name: "操作人",
          frid: 2,
          order: "operator"
        },
        {
          name: "上传时间",
          frid: 3,
          order: "upload_date"
        },
        {
          name: "大小",
          frid: 2,
          order: "real_size"
        },
        {
          name: "操作",
          frid: 6
        }
      ],

      historyList: [],

      deleteList: []
    };
  },

  watch: {
    // 实时更新父组件的deleteList，在父组件执行批量删除方法
    deleteList() {
      this.$emit("updateDeleteList", this.deleteList);
    }
  },

  methods: {
    date,

    // 点击表格的标题，点击的元素若有排序属性，则显示顺序icon
    // 如果再次点击上次点击的icon，转换排序
    titleClick(it) {
      if (!it.order) return;
      if (this.params.order === it.order) {
        this.$set(this.params, "asc", !this.params.asc);
      } else {
        this.$set(this.params, "asc", false);
        this.$set(this.params, "order", it.order);
      }
      this.$emit("getList");
    },

    // 每条数据被点击时，只有在批量操作时生效
    itemClick(it) {
      if (!this.batchDelete) {
        window.open(
          `http://192.100.2.39:8012/onlinePreview?url=http://192.100.2.8:80/${
            it.groupName
          }/${encodeURIComponent(it.remoteFileName)}`
        );
        return;
      }

      const index = this.deleteList.indexOf(it.fileName);
      if (index === -1) {
        this.deleteList.push(it.fileName);
      } else {
        this.deleteList.splice(index, 1);
      }
    },

    // 查看历史版本
    async history(it) {
      this.$set("update:pendingLoad", true);
      let data = await api("get", "showHistory", {
        params: { fileName: it.fileName }
      });

      this.$set("update:pendingLoad", false);
      this.historyList = data;
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
        await api("post", "delete", {
          fileNameList: [it.fileName]
        });
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
    },

    // 页码改变后，改变url的传参
    changePagination(e) {
      const { current, category } = this.params;

      // 通过改变url query重新获取数据
      this.$router.push({
        path: "/",
        query: { current, category }
      });
    },

    emptyList() {
      this.deleteList = [];
    },

    getList() {
      this.$emit("getList");
    }
  }
};
</script>

<style lang="stylus">
@import '~@/assets/css/var.styl';
@import '~@/assets/css/mixins.styl';

.table-comp {
  margin-bottom: 40px;
  border: 1px solid #e6e6e6;
  padding-bottom: 40px;
  border-radius: 6px;

  .table-title {
    background: #f2f2f2;
    line-height: 48px;
    padding: 0 14px;

    .title-item {
      font-size: 15px;
      font-weight: 600;
      color: #666;
      cursor: pointer;

      &:hover {
        opacity: 0.8;
      }

      .el-icon-back {
        font-size: 16px;
        font-weight: 600;
        color: $subMc;
        margin-left: 6px;
        transform: rotate(90deg);
        transition: all 0.3s;

        &.active {
          transform: rotate(-90deg);
        }
      }

      &:last-child {
        text-align: center;
        position: relative;
        left: 28px;
      }
    }
  }

  .table-body {
    margin-bottom: 32px;

    .body-item {
      display: flex;
      padding: 14px 14px;
      align-items: center;
      transition: all 0.3s;
      line-height: 28px;

      &.select {
        background: $tsubMc;

        &:hover {
          background: $tsubMc;
        }
      }

      &:last-child {
        border-bottom: 1px solid #e4e4e4;
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

          .item-checkbox {
            margin-right: 10px;
          }

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

      &:hover {
        background: #f5f7fa;
      }
    }
  }

  .no-content {
    font-size: 18px;
    color: #999;
    text-align: center;
    margin-top: 32px;
  }

  .table-pagination {
    text-align: center;
  }

  .history-enter-active, .history-leave-active {
    transition: all 0.2s;
  }

  .history-enter, .history-leave-to {
    opacity: 0;
  }

  .history-enter-to, .history-leave {
    opacity: 1;
  }
}
</style>
