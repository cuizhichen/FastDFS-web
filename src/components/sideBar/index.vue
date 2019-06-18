<template>
  <div class="side-bar-comp">
    <div class="logo-wrapper">
      <img src="../../assets/img/logo.png" alt="FastDSF">
      <div class="version">V 2.0.0</div>
    </div>
    <div class="cat-group">
      <div class="cat-item" v-for="it in list" :key="it.query">
        <div
          class="cat-title"
          :class="{ active:params.category === it.query }"
          @click="catClick(it)"
        >{{it.name}}</div>
        <div
          class="cat-sub"
          :class="{ active:params.category === it.query }"
          v-for="it in it.children"
          :key="it.query"
          @click="catClick(it)"
        >{{it.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      list: [
        {
          name: "全部文件",
          query: "all",
          enName: "All File",
          children: [
            {
              name: "图片",
              query: "image",
              enName: "Picture"
            },
            {
              name: "文档",
              query: "doc",
              enName: "Document"
            },
            {
              name: "视频",
              query: "video",
              enName: "Video"
            },
            {
              name: "音频",
              query: "music",
              enName: "Music"
            },
            {
              name: "其他",
              query: "other",
              enName: "Other"
            }
          ]
        }
      ]
    };
  },

  mounted() {
    this.$set(this.params, "category", this.$route.query.category);
  },

  methods: {
    ...mapMutations("home", ["changeTitle", "changeDeleteList"]),

    catClick(it) {
      this.$set(this.params, "fileName", "");
      this.$set(this.params, "category", it.query);

      this.$router.push({
        path: "/",
        query: { category: it.query }
      });

      this.changeTitle({ name: it.name, enName: it.enName });
      this.changeDeleteList("[]");
    }
  }
};
</script>

<style lang="stylus">
@import '~@/assets/css/var.styl';

.side-bar-comp {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  background: $mc;
  width: 194px;
  height: 100vh;

  .logo-wrapper {
    padding-left: 20px;
    width: 130px;
    padding-top: 40px;
    margin-bottom: 80px;

    .version {
      margin-top: 12px;
      color: $subMc;
      font-size: 14px;
    }
  }

  .cat-group {
    color: #eee;

    .cat-item {
      font-size: 16px;

      .cat-title {
        padding: 12px 0 20px 24px;
        cursor: pointer;

        &.active {
          color: $subMc;
        }

        &:hover {
          background: $hmc;
        }
      }

      .cat-sub {
        padding: 12px 0 12px 24px;
        color: #ccc;
        cursor: pointer;
        letter-spacing: 2px;

        &.active {
          color: $subMc;
        }

        &:hover {
          background: $hmc;
        }
      }
    }
  }
}
</style>
