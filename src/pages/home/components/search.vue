<template>
  <div class="home-search">
    <form class="search-form" @submit.prevent="onSubmit">
      <el-input
        class="search-input"
        placeholder="请输入文件名称"
        size="small"
        @focus="focus = true"
        @blur="focus = false"
        v-model="keyWord"
      ></el-input>
      <el-button
        class="search-btn"
        :class="{focus:focus}"
        :disabled="loading"
        size="small"
        @click="onSubmit"
      >搜索</el-button>
    </form>
    <div class="file-total">注：请不要上传大于500MB的文件</div>
  </div>
</template>
<script>
import api from "@/lib/api";
import { mapMutations } from "vuex";

export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      keyWord: "",
      focus: false
    };
  },

  methods: {
    ...mapMutations("home", ["changeTitle"]),

    onSubmit() {
      this.$emit("searchFile", this.keyWord);
      this.changeTitle({ name: "全部文件", enName: "All File" });
    },

    // 父组件调用此，清空搜索框
    emptySearch() {
      this.keyWord = "";
    }
  }
};
</script>

<style lang="stylus">
@import '~@/assets/css/var.styl';

.home-search {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;

  .search-form {
    display: flex;

    .search-input {
      display: inline-block;
      width: auto;

      input {
        border-radius: 4px 0px 0px 4px;
        width: 260px;
        border-right: none;
      }
    }

    .search-btn {
      border-radius: 0px 4px 4px 0px;
      color: #bbb;

      &:hover {
        color: $subMc;
      }

      &.focus {
        border-top-color: $subMc;
        border-right-color: $subMc;
        border-bottom-color: $subMc;
      }
    }
  }

  .file-total {
    color: #aaa;
  }
}
</style>
