<template>
    <section class="v-detail" v-if="detailSettings" :class="{'single-detail': (detailSettings && detailSettings.length == 1)}">
        <div v-for="(section,index) in detailSettings" :key="index" class="detail-block">
            <!-- 地图 -->
            <template v-if="section.type=='map'">
                <slot name="map"></slot>
            </template>
            <h4 class="h3-title">{{section.label}}</h4>
            <div v-for="(item,detailIndex) in section.items" :key="detailIndex" class="detail-content">
                <el-form label-position="right" size="small" label-width="200px" class="table-expand">
                    <el-form-item :label="itemName(item.name,item.hideColon)">
                        <!-- 事件 -->
                        <span v-if="item.type==='emit'" class="detail-edit-name" @click="interaction(detail[item.fieldName])">{{detail[item.fieldName]}}</span>
                        <!-- 时间 -->
                        <span v-else-if="item.type==='time'">{{detail[item.fieldName] | formatData}}</span>
                        <div v-else-if="item.type==='img'" :class="{'hide-picture':!detail[item.fieldName]}" class="show-picture">
                            <!-- 注意：图片字段传数组 -->
                            <div v-if="detail[item.fieldName]&&detail[item.fieldName].length">
                                <v-gallery v-if="detail[item.fieldName]" :imgs="detail[item.fieldName]" :imgDescription="detailData[item.fieldName + 'ImgDescription']"></v-gallery>
                            </div>
                        </div>
                        <!-- 自定义slot -->
                        <template v-else-if="item.type=='slot'" :style='detailWidth'>
                            <slot :name="item.fieldName" :model="detail"></slot>
                        </template>
                        <div v-else class="detail-con" :style='detailWidth'>
                            <span>{{detail[item.fieldName]}} {{detail[item.unit]}}</span>
                            <span v-show="item.type=='unit'">{{item.unit}}</span>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </section>
</template>

<script>
import vGallery from "@/components/gallery/vGallery";
export default {
    name: "vDetail",
    components: {
        vGallery
    },
    props: {
        detailWidth: String,
        unit: String,
        detailSettings: {
            type: Array,
            require: true
        },
        detailData: {
            type: Object,
            require: true
        }
    },
    data() {
        return {
            detail: null
        };
    },
    created() {
        this.update();
    },
    methods: {
        itemName(name, hideColon) {

            return hideColon ? name : name + '：'
        },
        interaction(data) {
            this.$emit("tudu", data);
        },
        update() {
            if (!this.detailData) {
                return;
            }
            let tmpSetting = {};
            this.detailSettings.forEach(item => {
                item.items.forEach(fieldNameItem => {
                    let nameList = fieldNameItem.fieldName.split(".");
                    if (nameList.length > 1) {
                        let fieldValue = this.detailData;
                        nameList.forEach(nameItem => {
                            fieldValue = fieldValue[nameItem];
                        });
                        tmpSetting[fieldNameItem.fieldName] = fieldValue;
                    } else {
                        tmpSetting[fieldNameItem.fieldName] = this.detailData[
                            fieldNameItem.fieldName
                        ];
                    }
                });
            });
            this.detail = tmpSetting;
        }
    },
    watch: {
        detailData() {
            this.update();
        }
    }
};
</script>

<style lang='scss'>
.v-detail {
  // item只有一项时class生效
  // &可以引用父元素 就像直接在v-detail{}里面写样式一样
  &.single-detail {
    .detail-con {
      width: 100%;
      padding-right: 50px;
    }
    // background: red;
    .table-expand .el-form-item__label,
    .table-expand .el-form-item__content {
      margin-left: 0px;
      font-size: 15px;
    }
    .picture {
      margin-top: 10px;
      &.hide-picture {
        width: 0px;
        height: 0px;
      }
    }
  }
  .detail-con {
    white-space: normal;
    word-wrap: break-word;
    word-break: break-all;
    display: inline-block;
    width: 600px;
  }
  .detail-block {
    white-space: nowrap;
    border-bottom: 1px solid $color-border;
    margin-bottom: 30px;
    padding-bottom: 20px;
    .h3-title {
      margin-top: 0;
      margin-bottom: 20px;
      margin-left: 70px;
    }
  }

  .detail-edit-name {
    cursor: pointer;
    color: #409eff;
  }
  .table-expand label {
    color: $color-detail;
  }

  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0; // width: 50%;
  }
  .table-expand .el-form-item__label,
  .table-expand .el-form-item__content {
    margin-left: 60px;
    font-size: 15px;
  }
  .el-form-item__content {
    margin-left: 262px !important;
  }
  .show-picture {
    background: margin;
    padding: 10px;
    margin-top: -10px;
    margin-bottom: -35px;
  }
}
</style>
