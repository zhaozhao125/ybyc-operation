<template>
  <div>
    <section class="inspection_detail">
      {{infor.cleanType}}
      <div class="detail-block" v-for="item in infor" :key="item.content">
        <el-row class='section_title'>
          <el-col :span='1' style='width:212px'>
            <h4 class="h3-title">{{item.content}}</h4>
          </el-col>
          <el-col :span='8'>
            <div>
              <span v-if="item.outwardTypeErrNum === 0 && !item.sn" class='color_success'>检查通过</span>
              <el-button v-if="item.outwardTypeErrNum > 0 && !item.sn" class='change_order' @click='changeOrderType(item.changeVlaue)' type='text'>{{item.changeType}}</el-button>
              <el-button v-if="item.sn" class='change_order' type='text' @click='oreadyWork(item.sn)'>已创建工单</el-button>
            </div>
          </el-col>
        </el-row>
        <div class="detail-content">
          <div v-if="item.content === '外观及用车检查'" class='appearance_check'>
            <div v-for="appearance in item.types" :key="appearance.content" class='appearance_section'>
              <div class='appearance_title'>{{appearance.content}} </div>
              <el-row :gutter="20">
                <el-col :lg="6" :xl="6" :sm="8" :md="8" v-for="(appearanceCheck,index) in appearance.types" :key="index">
                  <div style='margin-bottom:5px'>
                    <el-row>
                      <el-col :span='8'>
                        <div>{{appearanceCheck.content}} </div>
                      </el-col>
                      <el-col :span='12'>
                        <i class="el-icon-circle-check check_success" v-if="appearanceCheck.checked === false || (appearanceCheck.checked === true && (appearanceCheck.failItemModel.status === 'error_commit' || appearanceCheck.failItemModel.status === 'finish') )"></i>

                        <el-popover :ref="'popoverPool' + index" placement="right" title="暂不处理原因:" width="200" trigger="hover">
                          <span v-if="appearanceCheck.failItemModel" style="color: #E6A23C">{{ appearanceCheck.failItemModel.remark ? appearanceCheck.failItemModel.remark : '暂无'}}</span>

                          <i class="el-icon-question not_deal" slot="reference" v-if="appearanceCheck.checked === true && appearanceCheck.failItemModel.status === 'not_deal'"></i>
                        </el-popover>

                        <i class="el-icon-circle-close check_error" v-if="appearanceCheck.checked === true && appearanceCheck.failItemModel.status === 'create'">
                          <!-- <span class="status_deal">误报</span>
                                  <span class="status_deal">暂不处理</span> -->
                          <el-button type='text' class='distort' @click='distort(appearanceCheck.failItemModel.id)'>误报</el-button>
                          <el-button type='text' class='distort' @click='unDone(appearanceCheck.failItemModel.id)'>暂不处理</el-button>
                        </i>
                      </el-col>
                    </el-row>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <el-row v-else :gutter="20">
            <el-col :lg="6" :xl="6" :sm="8" :md="8" v-for="(checkTypes, index) in item.types" :key="index">
              <div style='margin-bottom:5px'>
                <el-row :gutter="20">
                  <el-col :span='8'>
                    <div>{{checkTypes.content}}</div>
                  </el-col>
                  <el-col :span='12'>
                    <div>
                      <i class="el-icon-circle-check check_success" v-if="checkTypes.checked === false || (checkTypes.checked === true && checkTypes.failItemModel.status === 'error_commit')"></i>

                      <!-- <i class="el-icon-question not_deal" v-if = "checkTypes.checked === true && checkTypes.failItemModel.status === 'not_deal'"></i> -->

                      <el-popover :ref="'popovers' + index" placement="right" title="暂不处理原因:" width="200" trigger="hover">
                        <span v-if="checkTypes.failItemModel" style="color: #E6A23C">{{ checkTypes.failItemModel.remark ? checkTypes.failItemModel.remark : '暂无'}}</span>

                        <i class="el-icon-question not_deal" slot="reference" v-if="checkTypes.checked === true && checkTypes.failItemModel.status === 'not_deal'"></i>
                      </el-popover>

                      <i class="el-icon-circle-close check_error" v-if="checkTypes.checked === true && checkTypes.failItemModel.status === 'create'">
                        <el-button type='text' class='distort' @click='distort(checkTypes.failItemModel.id)'>误报</el-button>
                        <el-button type='text' class='distort' @click='unDone(checkTypes.failItemModel.id)'>暂不处理</el-button>
                      </i>

                    </div>
                  </el-col>
                  <el-col></el-col>
                </el-row>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import dealDialog from './dealWithDialog'
export default {
  components: {
    dealDialog
  },
  data() {
    return {
      detail: null,
      mark: ''
    }
  },
  props: {
    infor: {
      default: [],
      type: Array
    }
  },
  methods: {
    unDone(id) {
      this.$prompt('请输入暂不处理备注', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(({ value }) => {
          let val = value
          this.distortUndone(id, 'not_deal', val)
        })
        .catch(() => {})
    },
    distort(id) {
      this.mark = ''
      this.$confirm('你确定该检查项为误报吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.distortUndone(id, 'error_commit', '')
        })
        .catch(() => {})
    },
    distortUndone(id, type, val) {
      let params = {
        id: id,
        dealResult: type,
        remark: val
      }
      params.remark ? '' : delete params.remark
      // this.$emit('on-getInfor')
      this.$service
        .distortUndone(params)
        .then(res => {
          this.$message.success('修改成功')
          this.$emit('on-getInfor')
        })
        .catch(res => {})
    },
    text(val) {
      console.log(val)
    },
    changeOrderType(value) {
      this.$confirm('创建工单后，该分类所有检查项将变成处理通过', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$emit('on-jumpCreate', value)
          // this.distortUndone(id, 'error_commit', '')
        })
        .catch(() => {})
    },
    oreadyWork(sn) {
      this.$emit('on-jumpWork', sn)
    }
  },
  mounted() {
    console.log(this.infor)
  },
  watch: {}
}
</script>

<style lang='scss'>
.inspection_detail {
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
    // border-bottom: 1px solid #ededed;
    padding-bottom: 20px;
    .h3-title {
      margin-top: 0;
      margin-bottom: 20px;
      margin-left: 70px;
      line-height: 27px;
      height: 12px;
    }
    .section_title {
      line-height: 0px;
      vertical-align: middle;
      padding-top: 2px;
      margin-bottom: 20px;
      background: #f2f6fc;
      .color_success {
        color: #67c23a;
        font-size: 14px;
        line-height: 27px;
      }
      .change_order {
        color: #409eff;
        cursor: pointer;
        height: 20px;
        vertical-align: center;
        line-height: 0px;
      }
    }
    .detail-content {
      margin-left: 70px;
      font-size: 15px;
      .check_success {
        color: #67c23a;
        font-size: 20px;
      }
      .status_btn {
        color: #67c23a;
      }
      .not_deal {
        color: #e6a23c;
        font-size: 20px;
        cursor: pointer;
      }
      .check_error {
        color: #f56c6c;
        font-size: 20px;
        .distort {
          // height: 24px;
          // line-height: 22px;
          padding-top: 0;
          padding-bottom: 0;
          vertical-align: middle;
          margin-left: 5px;
        }
        .status_deal {
          font-size: 14px;
          cursor: pointer;
          color: #3498db;
          padding-left: 5px;
        }
      }
      .appearance_check {
        .appearance_section {
          padding-bottom: 20px;
          // border-bottom: 1px solid #ededed;
          .appearance_title {
            color: #99a9bf;
            padding-bottom: 10px;
          }
          .not_deal_content {
            color: #e6a23c;
          }
        }
      }
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
