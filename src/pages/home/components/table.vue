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

    <div class="table-body" v-if="list.length > 0">
      <div
        class="body-item border-top"
        :class="{select:deleteList.indexOf(it.fileName) !== -1}"
        v-for="it in list"
        :key="it.name"
      >
        <el-checkbox v-model="deleteList" :label="it.fileName" v-if="batch" class="item-checkbox">
          <span></span>
        </el-checkbox>

        <table-item
          :it="it"
          :loading="loading"
          :batch="batch"
          :historyList.sync="historyList"
          @itemClick="itemClick"
          @getList="getList"
        />
      </div>
    </div>

    <div class="no-content" v-else>数据拼命加载中</div>

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
import { mapState, mapMutations } from "vuex";
import TableItem from "./tableItem";
import HistoryVersion from "./historyVersion";

export default {
  components: {
    TableItem,
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

    params: {
      type: Object,
      default: () => {}
    },

    total: {
      type: Number,
      default: 0
    },

    batch: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      titleList: [
        {
          name: "文件名称",
          frid: 12,
          order: "file_name"
        },
        {
          name: "操作人",
          frid: 2,
          order: "operator"
        },
        {
          name: "上传时间",
          frid: 4,
          order: "upload_date"
        },
        {
          name: "大小",
          frid: 2,
          order: "real_size"
        },
        {
          name: "操作",
          frid: 4
        }
      ],
      historyList: [],
      deleteList: []
    };
  },

  computed: {
    ...mapState({
      pending: state => state.common.pending
    })
  },

  methods: {
    ...mapMutations("common", ["changePending"]),

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

    // 每条数据被点击时，默认打开此文件的预览
    // 当批量操作时，则 添加/删除
    itemClick(fileName) {
      let list = this.deleteList;
      const index = list.indexOf(fileName);

      if (index === -1) list.push(fileName);
      else list.splice(index, 1);
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

    // 父组件调用此方法，执行批量删除
    async batchRemove() {
      this.changePending(true);
      await api("post", "delete", { fileNameList: this.deleteList });

      this.getList();
    },

    // 父组件调用此方法，取消删除，清空删除数组
    cancelDelete() {
      this.$emit("update:batch", false);
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
    padding: 0 20px;

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
      }
    }
  }

  .table-body {
    margin-bottom: 32px;

    .body-item {
      position: relative;
      padding: 0px 20px;

      &:nth-child(even) {
        background: #f9f9f9;
      }

      &.select {
        background: $tsubMc;

        &:hover {
          background: $tsubMc;
        }
      }

      &:last-child {
        border-bottom: 1px solid #e4e4e4;
      }

      &:hover {
        background: #f5f7fa;
      }

      .item-checkbox {
        position: absolute;
        left: 18px;
        top: 22px;
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
