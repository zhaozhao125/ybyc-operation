import { resultSelectData } from '@/utils/common'
export const requestWebsite = {
    methods: {
        // 请求网点
        openSelectDialog() {
            // 打开的时候请求我那个点列表
            this.$service.post_allWebSite().then(res => {
                this.listData = resultSelectData(res.data.data)
            })
        }
    },
    data() {
        return {
            listData: [] // 网点列表数据
        }
    }
}