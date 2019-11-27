<template>
  <div id="customer-details">
    <v-page :visible.sync="visible" :before-close="handleBeforeClose">
      <div class="page-header-container" slot="title">
        <h3>用户详情</h3>
        <div class="buttons">
          <el-button size="small" type="default" v-has="'customerResetReservationTimes'" @click="resetDialogVisible = true">重置预约次数</el-button>
          <el-button size="small" type="default" v-has="'customerCheckPassword'" @click="pinDialogVisible = true">查看用车密码</el-button>
          <el-button size="small" type="default" v-has="'customerSendMessage'" @click="msgDialogVisible = true">发送消息</el-button>
        </div>
      </div>
      <div v-if="detailData" class="detail-content" slot="content">
        <div class="x-data-detail">
          <div class="x-detail-block">
            <h4 class="x-detail-title">基本信息</h4>
            <el-row :gutter="10" type="flex">
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">用户ID</div>
                  <div class="x-value" v-if="detailData.userId">{{detailData.userId}}</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">手机号</div>
                  <div class="x-value">
                    <span v-if="$_has('customerUserPhoneModified') && btnVisible">
                      <editInput :name="userPhone" :value="detailData.userPhone" :type="typeNum" @updateVal="updateCustomer" ref="editInput"></editInput>
                    </span>
                    <span v-else>{{detailData.userPhone}}</span>
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">姓名</div>
                  <div class="x-value">
                    <span v-if="$_has('customerUserNameModified') && btnVisible">
                      <editInput :name="userName" :value="detailData.userName" :type="typeText" @updateVal="updateCustomer"></editInput>
                    </span>
                    <span v-else-if="detailData.userName">{{detailData.userName}}</span>
                    <span v-else>暂无</span>
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">认证状态</div>
                  <div class="x-value">{{checkDataStatusText[detailData.checkDataStatus]}}</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">注册城市</div>
                  <div class="x-value" v-if="detailData.cityName">{{detailData.cityName}}</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">所属城市</div>
                  <div class="x-value" v-if="detailData.cityNameBelongTo">{{detailData.cityNameBelongTo}}</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">用户角色</div>
                  <div class="x-value">
                    <span v-if="$_has('customerUserRoleModified') && btnVisible">
                      <editInput :name="userRoleId" :value="detailData.userRoleName" :type="typeRole" @updateVal="updateCustomer"></editInput>
                    </span>
                    <span v-else-if="detailData.userRoleName">{{detailData.userRoleName}}</span>
                    <span v-else>暂无</span>
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">账户状态</div>
                  <div class="x-value">{{detailData.statusCode === 1?"启用":"禁用"}}</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">身份证号</div>
                  <div class="x-value">
                    <span v-if="$_has('customerUserIdentityNumberModified') && btnVisible">
                      <editInput :name="userIdentityNumber" :value="detailData.userIdentityNumber" :type="typeText" @updateVal="updateCustomer"></editInput>
                    </span>
                    <span v-else-if="detailData.userIdentityNumber">{{detailData.userIdentityNumber}}</span>
                    <span v-else>暂无</span>
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">驾照到期时间</div>
                  <div class="x-value">
                    <span v-if="$_has('customerDrivingLicenseExpireModified') && btnVisible">
                      <editInput :name="drivingLicenseExpire" :value="detailData.drivingLicenseExpire" :type="typeDate" @updateVal="updateCustomer"></editInput>
                    </span>
                    <span v-else-if="detailData.drivingLicenseExpire">{{detailData.drivingLicenseExpire}}</span>
                    <span v-else>暂无</span>
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">芝麻信用授权</div>
                  <div class="x-value" v-if="detailData.zhimaIsAuthorize">{{detailData.zhimaIsAuthorize==1?'已授权':'未授权'}}</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">身份证地址</div>
                  <div class="x-value" v-if="detailData.userIdentityNumberAddress">{{detailData.userIdentityNumberAddress}}</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">首享充值免押时间</div>
                  <div class="x-value" v-if="detailData.promotionTimeShareRentDepositReachFirstTime">{{detailData.promotionTimeShareRentDepositReachFirstTime/1000 | timeFilter}}</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="x-detail-block">
            <h4 class="x-detail-title">用户资金</h4>
            <el-row :gutter="10">
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">充值余额</div>
                  <div class="x-value" v-if="detailData.userMoney">{{detailData.userMoney}}元</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">红包</div>
                  <div class="x-value" v-if="detailData.userRedPacket">{{detailData.userRedPacket}}元</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">赠送余额</div>
                  <div class="x-value" v-if="detailData.userMoneyPresentation">{{detailData.userMoneyPresentation}}元</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">分时出行卡</div>
                  <div class="x-value" v-if="detailData.cardTimeShare">{{detailData.cardTimeShare}}元</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">分时保证金</div>
                  <div class="x-value" v-if="detailData.timeShareRentDeposit">{{detailData.timeShareRentDeposit}}元</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">长租车辆押金</div>
                  <div class="x-value" v-if="detailData.longTermRentCarDeposit">{{detailData.longTermRentCarDeposit}}元</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">长租违章押金</div>
                  <div class="x-value" v-if="detailData.longTermRentViolationDeposit">{{detailData.longTermRentViolationDeposit}}元</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">是否免分时保证金</div>
                  <div class="x-value">
                    <span v-if="$_has('customerIsAvoidTimeSharingDepositModified') && btnVisible">
                      <editInput :name="isAvoidTimeSharingDeposit" :value="detailData.isAvoidTimeSharingDeposit" :type="typeSelect" @updateVal="updateCustomer"></editInput>
                    </span>
                    <span v-else-if="detailData.isAvoidTimeSharingDeposit === 1">免</span>
                    <span v-else>不免</span>
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">是否免长租违章押金</div>
                  <div class="x-value">
                    <span v-if="$_has('customerIsAvoidFrozenMoneyModified') && btnVisible">
                      <editInput :name="isAvoidFrozenMoney" :value="detailData.isAvoidFrozenMoney" :type="typeSelect" @updateVal="updateCustomer"></editInput>
                    </span>
                    <span v-else-if="detailData.isAvoidFrozenMoney === 1">免</span>
                    <span v-else>不免</span>
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">是否免长租车辆押金</div>
                  <div class="x-value">
                    <span v-if="$_has('customerIsAvoidCarFrozenMoneyModified') && btnVisible">
                      <editInput :name="isAvoidCarFrozenMoney" :value="detailData.isAvoidCarFrozenMoney" :type="typeSelect" @updateVal="updateCustomer"></editInput>
                    </span>
                    <span v-else-if="detailData.isAvoidCarFrozenMoney === 1">免</span>
                    <span v-else>不免</span>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="x-detail-block">
            <h4 class="x-detail-title">虚拟资产</h4>
            <el-row :gutter="10">
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">优惠券</div>
                  <div class="x-value">
                    {{couponsTotalCount}}张
                    <el-button type="text" @click="getAllCoupons">查看</el-button>
                    <el-button type="text" v-if="$_has('customerSendCoupons') && btnVisible" @click="sendCouponsDialogVisible = true">发放优惠券</el-button>
                  </div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">当前积分</div>
                  <div class="x-value">
                    {{customerPoints}}
                    <el-button type="text" v-has="'customerDetailPointsView'" @click="handleShowPoints">查看</el-button>
                    <el-button type="text" v-has="'customerDetailPointsEdit'" @click="handleEditPoints">修改</el-button>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="x-detail-block">
            <h4 class="x-detail-title">身份补充信息</h4>
            <el-row :gutter="10">
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">昵称</div>
                  <div class="x-value" v-if="detailData.userNickname">{{detailData.userNickname}}</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">性别</div>
                  <div class="x-value" v-if="detailData.sex">
                    <span v-if="detailData.sex == 1">男</span>
                    <span v-else-if="detailData.sex == 2">女</span>
                  </div>
                  <div class="x-value" v-else>保密</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">QQ</div>
                  <div class="x-value" v-if="detailData.qq">{{detailData.qq}}</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">会员卡号</div>
                  <div class="x-value" v-if="detailData.virtualCarCardNumber">{{detailData.virtualCarCardNumber}}</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">所属企业</div>
                  <div class="x-value" v-if="detailData.companyName">{{detailData.companyName}}</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="x-detail-block">
            <h4 class="x-detail-title">用户行为信息</h4>
            <el-row :gutter="10">
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">注册时间</div>
                  <div class="x-value" v-if="detailData.registerTime">
                    {{detailData.registerTime|timeFilter}}
                    <span v-if="detailData.utmRegisterSourceText">{{detailData.utmRegisterSourceText}}</span>
                  </div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">资料提交时间</div>
                  <div class="x-value" v-if="detailData.userUploadTime">{{detailData.userUploadTime|timeFilter}}</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">首充保证金时间</div>
                  <div class="x-value" v-if="detailData.timeShareRechargeFirstTime">{{detailData.timeShareRechargeFirstTime/1000|timeFilter}}</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="x-detail-item">
                  <div class="x-label">首次下单时间</div>
                  <div class="x-value" v-if="detailData.timeShareOrderFirstTime">{{detailData.timeShareOrderFirstTime/1000|timeFilter}}</div>
                  <div class="x-value" v-else>暂无</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </v-page>

    <el-dialog title="重置预约次数" :visible.sync="resetDialogVisible" width="30%">
      <span>确定重置预约次数？重置后，系统发送重置短信。</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleReset">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="查看用车密码" :visible.sync="pinDialogVisible" width="30%">
      <span v-if="detailData">用车密码： {{detailData.userPin}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pinDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="pinDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="发送消息" :visible.sync="msgDialogVisible" width="30%">
      <el-form :model="msgForm" :rules="msgRules" ref="msgForm" label-width="100px">
        <el-form-item label="消息标题" prop="user_message_title">
          <el-input v-model="msgForm.user_message_title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="消息内容" prop="user_message_content">
          <el-input type="textarea" v-model="msgForm.user_message_content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="msgDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSendMsg('msgForm')">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="发放优惠券" :before-close="clearData" :visible.sync="sendCouponsDialogVisible" :modal-append-to-body="false" width="500px">
      <el-form :model="couponsForm" :rules="couponsRules" ref="couponsForm" label-width="100px">
        <el-form-item label="优惠券名称" prop="couponsId">
          <website-select :isCouponsRemote="isCouponsRemote" counponsUserId="counponsUserId" v-model="couponsForm.couponsId" placeholder="请输入优惠券" isRequest></website-select>
          <!-- <el-select v-model="couponsForm.couponsId" placeholder="优惠券名称" style="display: block;">
            <el-option v-for="item in couponsOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="发券原因" prop="remark">
          <el-input type="textarea" v-model="couponsForm.remark" placeholder="请填写发券原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancleCoupons" size="small">取 消</el-button>
        <el-button type="primary" @click="sendCoupons" size="small">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="查看优惠券" :visible.sync="couponsDialogVisible" width="90%" :modal-append-to-body="false" class="user-conpon-dialog" top="8vh">
      <el-card class="table-box">
        <div slot="header">
          <v-search :searchSettings="couponsSearchSettings" @search="handleSearch" :labelWidth="labelWidth"></v-search>
        </div>
        <div class="table-container">
          <el-table :data="couponsTableData" height="100%">
            <el-table-column prop="code" label="券码" min-width="160px">
            </el-table-column>
            <el-table-column prop="couponsName" label="优惠券名称" min-width="220px">
            </el-table-column>
            <el-table-column prop="isUsed" label="使用状态" min-width="100px">
              <template slot-scope="scope">
                <span>{{couponsStatusText[scope.row.isUsed]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="money" label="金额/折扣" min-width="180px">
              <template slot-scope="scope">
                <div v-if="scope.row.type === 1">
                  {{ scope.row.money }}元
                  <span v-if="scope.row.useMoneyCondition > 0">（满{{ scope.row.useMoneyCondition }}元可用）</span>
                </div>
                <div v-else-if="scope.row.type === 2">
                  {{ scope.row.discount/10 }}折
                  <span v-if="scope.row.useMoneyTop > 0">（最高可抵{{ scope.row.useMoneyTop }}元）</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="有效期" min-width="180px">
              <template slot-scope="scope">
                <div v-if="scope.row.beginDate">
                  {{ scope.row.beginDate }}
                </div>
                <div v-else>
                  暂无
                </div>
                <div v-if="scope.row.expireDate">
                  {{ scope.row.expireDate }}
                </div>
                <div v-else>
                  暂无
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="voucher" label="发券人" min-width="150px">
              <template slot-scope="scope">
                <span v-if="scope.row.voucher">
                  {{scope.row.voucher}}
                  <span v-if="scope.row.acountName">({{scope.row.acountName}})</span>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="addTime" label="发券时间" min-width="180px"></el-table-column>
            <el-table-column prop="remark" label="发券原因" min-width="160px">
              <template slot-scope="scope">
                <div v-if="scope.row.remark" style="white-space:nowrap">
                  <p v-if="scope.row.remark.length < 10">{{scope.row.remark}}</p>
                  <el-tooltip placement="top" v-else>
                    <div slot="content" class="tooltip-content">{{scope.row.remark}}</div>
                    <p>{{scope.row.remark.substr(0, 10)}}...</p>
                  </el-tooltip>
                </div>
                <div v-else> - </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" min-width="100px">
              <template slot-scope="scope">
                <el-button type="text" v-if="$_has('customerDeleteCoupons') && btnVisible" @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class='table-page'>
          <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
          </el-pagination>
        </div>
      </el-card>
    </el-dialog>
    <el-dialog title="修改积分" :visible.sync="pointsEditVisible" width="500px">
      <v-form ref="pointsForm" :formSettings="pointsFormSettings" :showButton="false" @save="handlePointsEdit"></v-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="pointsEditVisible = false">取 消</el-button>
        <el-button size="small" type="primary" :loading="loading" @click="handleSubmitPoints">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import editInput from '@/components/edit-input'
import searchHistoryMixin from '@/mixins/search-history.js'
import paginationMixin from '@/mixins/pagination.js'
import { handleDate } from '@/utils/date-filter'
import { handleSubmitSearchData } from '@/utils/common.js'
import websiteSelect from '@/components/website-select'

export default {
  name: 'v-details',
  mixins: [searchHistoryMixin, paginationMixin],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    userId: {
      type: Number
    },
    btnVisible: {
      type: Boolean,
      default: false
    }
  },
  components: {
    editInput,
    websiteSelect
  },
  data() {
    let validateNum = (rule, value, callback) => {
      if (value <= 0) {
        return callback(new Error('输入值需大于0'))
      }
      if (String(value).indexOf('.') > 0) {
        return callback(new Error('只能输入正整数'))
      }
      callback()
    }
    return {
      loading: false,
      detailData: null,
      checkDataStatusText: {
        '-1': '未上传资料',
        '0': '审核不通过',
        '1': '审核通过',
        '2': '待审核'
      },
      couponsTotalCount: null,
      typeText: 'text',
      typeNum: 'phoneNum',
      typeSelect: 'select',
      typeRole: 'role',
      typeDate: 'date',
      userName: 'userName',
      userPhone: 'userPhone',
      userIdentityNumber: 'userIdentityNumber',
      userRoleId: 'userRoleId',
      drivingLicenseExpire: 'drivingLicenseExpire',
      isAvoidTimeSharingDeposit: 'isAvoidTimeSharingDeposit',
      isAvoidFrozenMoney: 'isAvoidFrozenMoney',
      isAvoidCarFrozenMoney: 'isAvoidCarFrozenMoney',
      resetDialogVisible: false,
      pinDialogVisible: false,
      msgDialogVisible: false,
      sendCouponsDialogVisible: false,
      couponsDialogVisible: false,
      formLabelWidth: '80px',
      msgForm: {
        user_message_title: '',
        user_message_content: ''
      },
      msgRules: {
        user_message_title: [
          { required: true, message: '请输入消息标题', trigger: 'blur' }
        ],
        user_message_content: [
          { required: true, message: '请填写消息内容', trigger: 'blur' }
        ]
      },
      couponsOptions: [],
      isCouponsRemote: true,
      counponsUserId: null,
      couponsForm: {
        couponsId: '',
        remark: ''
      },
      couponsRules: {
        couponsId: [
          { required: true, message: '请选择优惠券名称', trigger: 'change' }
        ]
        // remark: [{ required: true, message: '请填写发券原因', trigger: 'blur' }]
      },
      couponsTableData: [],
      couponsStatusText: {
        '0': '未使用',
        '1': '已使用',
        '2': '已失效'
      },
      couponsSearchSettings: [
        {
          label: '优惠券状态',
          name: 'userCouponStatus',
          type: 'select',
          visible: true,
          options: [
            {
              label: '未使用',
              value: '0'
            },
            {
              label: '已使用',
              value: '1'
            },
            {
              label: '已失效',
              value: '2'
            }
          ]
        }
      ],
      labelWidth: '130px',
      pointsEditVisible: false,
      pointsFormSettings: [
        {
          label: '',
          items: [
            {
              label: '修改类型',
              name: 'type',
              type: 'select',
              value: 'DEC',
              required: true,
              options: [
                {
                  label: '减分',
                  value: 'DEC'
                }, {
                  label: '加分',
                  value: 'INC'
                }
              ]
            },
            {
              label: '修改数值',
              type: 'number',
              name: 'amount',
              controls: false,
              rule: [{
                validator: validateNum,
                trigger: 'blur',
                required: true
              }]
            },
            {
              label: '修改原因',
              type: 'textarea',
              name: 'adminNote',
              required: true,
              maxlength: 20
            }
          ]
        }
      ],
      // 用户当前积分
      customerPoints: '-'
    }
  },
  watch: {
    visible(val) {
      if (val && this.userId) {
        this.counponsUserId = this.userId
        this.getDetails()
        let obj = Object.assign({ userCouponStatus: 0 })
        console.log(obj)
        this.loadTableData(obj)
        // this.getAssignedCoupons()
        this.couponsTotalCount = null
        this.getCustomerPoints(this.userId)
      }
    }
  },
  methods: {
    /**
     * 获取用户当前可用积分
     */
    getCustomerPoints(userId) {
      this.$service.getCustomerPoints(userId || this.userId).then(res => {
        this.customerPoints = res.data.data.integralAvailable
      })
    },
    getDetails() {
      if (this.userId) {
        this.$service.getCustomerDetail({userId: this.userId}).then(res => {
          this.detailData = res.data.data
        })
      }
    },
    clearData() {
      this.sendCouponsDialogVisible = false
      this.couponsForm.remark = ''
      this.couponsForm.couponsId = ''
    },
    handleBeforeClose() {
      this.$emit('closePage')
      this.searchData = {}
      this.$emit('update:visible', false)
      return false
    },
    handleReset() {
      this.$service
        .resetReserveCount({ userId: this.userId })
        .then(res => {
          if (res.data.code === '0') {
            this.$message({ message: '操作成功', type: 'success' })
          }
          this.resetDialogVisible = false
        })
    },
    handleSendMsg(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = { user_id: this.userId, ...this.msgForm }
          this.$service.sendMsg(params).then(res => {
            if (res.data.code === '0') {
              this.$message({ message: '操作成功', type: 'success' })
            }
            this.msgDialogVisible = false
            this.msgForm = {}
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleSearch(data) {
      let searchData = Object.assign({}, data)
      searchData = handleSubmitSearchData(searchData)
      this.searchData = searchData
      this.page = 1
      this.loadTableData()
    },
    loadTableData(obj) {
      this.pageSize = 10
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        userId: this.userId,
        ...this.searchData
      }
      if (obj && obj.userCouponStatus === 0) {
        params = Object.assign(params, obj)
      }
      this.$service.getUserCouponsList(params).then(res => {
        this.couponsTableData = res.data.data.records
        this._changePageTotal(parseInt(res.data.data.totalElements))
        if (obj && obj.userCouponStatus === 0) {
          this.couponsTotalCount = parseInt(res.data.data.totalElements)
        }
      })
    },
    getAllCoupons() {
      this.couponsDialogVisible = true
      this.loadTableData()
    },
    handleDelete(row) {
      let params = {
        userCouponsId: row.id
      }
      this.$service.deleteCoupons(params).then(res => {
        if (res.data.code === '0') {
          this.$message({ message: '操作成功', type: 'success' })
        }
        this.loadTableData()
      })
    },
    getAssignedCoupons() {
      let params = { userId: this.userId }
      this.$service.isAssignedCoupons(params).then(res => {
        this.couponsOptions = res.data.data.map(function(val, index) {
          let obj = {}
          obj.value = val.coupons_id
          obj.label = val.coupons_name
          return obj
        })
      })
    },
    cancleCoupons() {
      this.couponsForm = {}
      this.sendCouponsDialogVisible = false
    },
    sendCoupons() {
      let params = {
        userId: this.userId,
        operator: this.$store.getters.user.username,
        operatorNickName: this.$store.getters.user.cnName,
        ...this.couponsForm
      }
      this.$service.assigneCoupons(params).then(res => {
        if (res.data.code == 0) {
          this.$message({ message: '操作成功', type: 'success' })
          this.couponsForm = {}
          this.loadTableData()
          this.$emit('update', this.userId)
        }
      })
      this.sendCouponsDialogVisible = false
    },
    updateCustomer(name, updateVal) {
      let obj = {}

      if (name === 'drivingLicenseExpire') {
        obj[name] = handleDate(updateVal, 'day')
      } else if (name === 'userRoleId') {
        obj[name] = updateVal.value
      } else {
        obj[name] = updateVal
      }

      obj.userId = this.userId
      this.$service.updateCustomer(obj).then(res => {
        if (res.data.code === '0') {
          this.$message({ message: '操作成功', type: 'success' })
        }

        if (name === 'drivingLicenseExpire') {
          this.detailData[name] = handleDate(updateVal, 'day')
        } else if (name === 'userRoleId') {
          this.detailData.userRoleName = updateVal.label
        } else {
          this.detailData[name] = updateVal
        }
        this.$emit('update', this.userId)
      })
    },
    handleShowPoints() {
      console.log('====aassdd====', this.$store.getters.activeTab)
      this.$store.commit('sendToTab', {
        name: 'customerPoints',
        params: {
          userPhone: this.detailData.userPhone,
          cityId: this.detailData.cityId
        }
      })
      if (this.$store.getters.activeTab.name == 'customerPoints') {
        this.$emit('update:visible', false)
      }
    },
    handleEditPoints() {
      this.pointsEditVisible = true
    },
    /**
     * 修改用户积分
     */
    handlePointsEdit(data) {
      if (data.type == 'DEC' && data.amount > this.customerPoints) {
        this.$message({
          message: '减分数值超出当前值，请重新输入',
          type: 'warning'
        })
        return
      }
      if (data.type == 'INC' && String(data.amount).length > 7) {
        this.$message({
          message: '加分数值超出正常范围，请重新输入',
          type: 'warning'
        })
        return
      }
      data.userId = this.userId
      this.loading = true
      this.$service.editCustomerPoints(data).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.getCustomerPoints()
        this.pointsEditVisible = false
        this.loading = false
      }).catch(err => {
        this.loading = false
      })
    },
    handleSubmitPoints() {
      this.$refs.pointsForm.onSave()
    }
  }
}
</script>

<style lang="scss">
.tooltip-content {
  max-width: 300px;
  overflow: hidden;
  white-space: normal;
  word-break: break-word;
  word-wrap: break-word;
}
.user-conpon-dialog{
  .el-dialog__body{
    padding-top: 10px;
  }
  .el-table__body-wrapper{
    height: auto!important;
    max-height: 600px;
  }
}
</style>
