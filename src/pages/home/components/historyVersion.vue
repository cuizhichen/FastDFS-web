<template>
  <div class="file-history" @click="hideHistory">
    <div class="history-inner">
      <div class="history-title border-bottom">
        历史版本
        <i class="el-icon-close"></i>
      </div>
      <div class="file-name">文件名：{{list[0].fileName}}</div>
      <div class="title-content row border">
        <div
          class="title-item"
          :class="`col-${it.frid}`"
          v-for="it in titleList"
          :key="it.name"
        >{{it.name}}</div>
      </div>

      <div class="history-content border">
        <div class="history-item row border-bottom" v-for="(it, index) in list" :key="index">
          <div class="item-inner" :class="{current:!it.isCurrent}">
            <div class="username">{{it.operator}}</div>
            <div class="uploadTime">{{date(it.uploadDate)}}</div>
            <div class="fileSize">{{it.fileSize}}</div>
            <div class="recover-btn">
              <div class="current-version" v-if="it.isCurrent">h</div>
              <el-button
                v-if="!it.isCurrent"
                size="mini"
                :disabled="loading"
                plain
                @click.stop="revert(it)"
              >恢复</el-button>
            </div>
            <div class="preview-btn">
              <el-button size="mini" :disabled="loading" plain @click.stop="preview(it)">预览</el-button>
            </div>
            <div class="down-btn">
              <el-button size="mini" :disabled="loading" plain @click.stop="down(it)">下载</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { date } from "@/lib/help";
import api from "@/lib/api";
import homeMixins from "@/mixins/home";

export default {
  mixins: [homeMixins],

  props: {
    list: {
      type: Array,
      defalut: () => []
    },

    loading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      titleList: [
        {
          name: "修改人",
          frid: 4
        },
        {
          name: "修改时间",
          frid: 7
        },
        {
          name: "大小",
          frid: 4
        },
        {
          name: "恢复",
          frid: 3
        },
        {
          name: "预览",
          frid: 3
        },
        {
          name: "下载",
          frid: 3
        }
      ]
    };
  },

  mounted() {
    window.onkeydown = e => {
      if (e.key === "Escape") {
        this.$emit("update:list", []);
      }
    };
  },

  methods: {
    date,

    hideHistory() {
      this.$emit("update:list", []);
    },

    async revert(it) {
      let data = await api("get", "revert", {
        params: { fileName: it.fileName, remoteFileName: it.remoteFileName }
      });
      this.$emit("update:list", []);
      this.$emit("getList");
    }
  },

  beforeDestroy() {
    window.onkeydown = null;
  }
};
</script>

<style lang="stylus">
@import '~@/assets/css/var.styl';

.file-history {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 1000;

  .history-inner {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    padding: 32px;
    border-radius: 6px;

    .history-title {
      position: relative;
      text-align: center;
      color: #999;
      font-size: 18px;
      font-weight: 600;
      padding-bottom: 20px;

      .el-icon-close {
        position: absolute;
        right: 0;
        font-size: 20px;
        font-weight: 600;
        cursor: pointer;
      }
    }

    .file-name {
      line-height: 60px;
      font-size: 15px;
      color: #888;
    }

    .title-content {
      background: #f2f2f2;
      line-height: 48px;
      padding: 0 14px;
      border-bottom: none;
      border-radius: 6px 6px 0 0;

      .title-item {
        font-size: 15px;
        font-weight: 600;
        color: #666;
      }
    }

    .history-content {
      border-top: none;
      border-radius: 0 0 6px 6px;
      line-height: 52px;
      max-height: 600px;
      overflow-x: scroll;

      .history-item {
        transition: all 0.3s;
        padding: 0 12px;

        .item-inner {
          color: $subMc;
          width: 100%;

          &.current {
            color: #000;
          }

          &:last-child {
            border: none;
            border-color: #eee;
          }

          >* {
            width: 12.5%;
            float: left;

            &:nth-child(1) {
              width: 16.666666666666668%;
            }

            &:nth-child(2) {
              width: 29.166666666666668%;
            }

            &:nth-child(3) {
              width: 16.666666666666668%;
            }

            &.el-button {
              box-sizing: border-box;
              padding: 4px 0px;
              line-height: 1em;
            }

            .current-version {
              opacity: 0;
            }
          }

          &:hover {
            background: #f5f7fa;
          }
        }
      }
    }
  }
}
</style>
