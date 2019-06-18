import { mapState } from "vuex";

export default {
    computed: {
        ...mapState({
            pending: state => state.common.pending,
            ip: state => state.common.ip,
            previewIp: state => state.common.previewIp,
            trackerIp: state => state.common.trackerIp
        })
    },


    methods: {
        // 文件下载
        down(it) {
            window.location.href = `${this.ip}/downFile?groupName=${
                it.groupName
                }&remoteFileName=${it.remoteFileName}`;
        },

        // 文件预览
        preview(it) {
            window.open(
                `${this.previewIp}/onlinePreview?url=${this.trackerIp}/${
                it.groupName
                }/${encodeURIComponent(it.remoteFileName)}`
            );
        },
    },
}