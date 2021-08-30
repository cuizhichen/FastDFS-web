<template>
  <div class="home-page">
    <side-bar :params="params"/>
    <div 
      class="home-right"
      v-loading="pending"
      element-loading-text="拼命加载中"
      element-loading-background="rgba(255, 255, 255, 0.6)"
    >
      <div class="home-header">
        <div class="home-title">
          {{title.name}}
          <span class="en-title">{{title.enName}}</span>
        </div>
        <div class="header-operation">
          <home-upload :list.sync="list" :loading.sync="loading" @getList="getList"/>
          <el-button
            class="batch-delete"
            :disabled="loading"
            plain
            @click="batchRemove"
          >{{batch?'删除':'批量删除'}}</el-button>

          <el-button
            class="cancel-delete"
            v-if="batch === true"
            :disabled="loading"
            plain
            @click="$refs.table.cancelDelete()"
          >取消删除</el-button>
        </div>
      </div>
      <div class="home-content">
        <home-search ref="search" :loading.sync="loading" @searchFile="searchFile"/>
        <home-table
          ref="table"
          :list.sync="list"
          :loading.sync="loading"
          :params.sync="params"
          :batch.sync="batch"
          :total="total"
          @getList="getList"
        ></home-table>
      </div>
    </div>
  </div>
</template>

<script>
import HomeUpload from "@/components/common/upload";
import SideBar from "@/components/sideBar";
import HomeSearch from "./components/search";
import HomeTable from "./components/table";
import api from "@/lib/api";
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    HomeUpload,
    SideBar,
    HomeSearch,
    HomeTable
  },

  data() {
    return {
      loading: false, // 上传中
      batch: false, // 是否批量操作
      list: [],

      // 获取列表默认的传参
      params: {
        current: 1,
        size: 10,
        order: null,
        asc: false,
        category: "all",
        fileName: ""
      },

      total: null,

      // 上次获取参数时的传参，用于判断再次发送请求时是否回到第一页
      oldCategory: null
    };
  },

  computed: {
    ...mapState({
      title: state => state.home.title,
      pending: state => state.common.pending
    })
  },

  watch: {
    // 监听url query的变化，变化则分类变化，再次获取数据
    $route() {
      // 当分类变化时，将页码变为首页
      if (this.oldCategory !== this.params.category) {
        this.params.current = 1;
      }
      this.getList();
    }
  },

  mounted() {
    this.getList();
  },

  methods: {
    ...mapMutations("common", ["changePending"]),

    async getList() {
      this.changePending(true);
      let { total, fileList } = await api("get", "listPage", {
        params: this.params
      });

      // 每次获取完数据，初始化一些数据
      this.changePending(false);
      this.list = fileList;
      this.total = total;
      this.batch = false;
      this.oldCategory = this.params.category;
    },

    // 搜索时，设置文件名为传参，并且分类为全部
    searchFile(fileName) {
      this.params.fileName = fileName;
      this.params.category = "all";
      this.getList();
    },

    // 选择批量删除，选择后批量删除变为删除按钮，此处要做判断
    async batchRemove() {
      if (this.batch) {
        const data = await this.$confirm(`确定移除这些文件么？`);
        if (data === "confirm") this.$refs.table.batchRemove();
      } else {
        this.batch = true;
      }
    }
  }
};
</script>

<style lang="stylus">
@import '~@/assets/css/var.styl';

.home-page {
  background: #f2f2f2;
  min-height: 100vh;
  padding: 44px 40px 24px 242px;

  .home-right {
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.07);
    border-radius: 6px;
    overflow: hidden;

    .home-header {
      background: #f2f2f2;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 24px;
      border-radius: 6px 6px 0 0;

      .home-title {
        font-size: 16px;
        font-weight: 600;

        .en-title {
          margin-left: 8px;
          font-size: 14px;
          font-weight: 400;
          color: #bbb;
        }
      }

      .header-operation {
        display: flex;

        .batch-delete {
          padding: 10px 36px;
          font-size: 13px;
          background: $tmc;
          border-color: $tmc;
          color: #fff;
          margin-left: 16px;

          &:hover {
            opacity: 0.9;
          }
        }

        .cancel-delete {
          padding: 10px 36px;
          font-size: 13px;
        }
      }
    }

    .home-content {
      background: #fff;
      padding: 24px;
    }
  }
}
</style>