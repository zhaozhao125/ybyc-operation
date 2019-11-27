<template>
  <div id="recommendStation">
    <el-card class="table-box">
      <div slot="header">
        <v-search :searchSettings="searchSettings" @search="handleSearch" labelWidth="120px">
        </v-search>
      </div>

      <div class="table-operator">
        <!--<el-button type="primary" size="small" @click="handleTemplate()">导出</el-button>-->
      </div>

      <div class="table-container">
        <el-table :data="tableData" height="100%">
          <el-table-column prop="user_phone" min-width="40" label="用户手机号"></el-table-column>
          <el-table-column prop="address" label="推荐地址" show-overflow-tooltip min-width="100"></el-table-column>
          <el-table-column prop="linkman_phone" label="联系电话" min-width="40"></el-table-column>
          <el-table-column prop="reason" label="推荐原因" show-overflow-tooltip min-width="56"></el-table-column>
          <el-table-column prop="created_on" label="推荐时间"></el-table-column>
          <el-table-column label="位置" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button type="text" @click="showMap(scope.row.location,scope.row.address)">显示位置</el-button>
            </template>
          </el-table-column>
          <el-table-column label="图片" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button v-if="scope.row.image_url" type="text" @click="viewImg(scope.row.image_url)">查看图片</el-button>
              <el-button v-else disabled type="text">暂无图片</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <section id="site-map">
        <el-dialog :visible.sync="dialogVisible" title='查看地图' width='600' v-show="dialogVisible">
          <div class="map-content" v-loading="loading" :element-loading-text="loadingConfig.loadingText" :element-loading-spinner="loadingConfig.loadingSpinner" :element-loading-background="loadingConfig.loadingBackground">
            <el-amap  :center="centerPosition" :expandZoomRange='true' :zooms="[3,20]" :zoom="zoom" :plugin="plugin" :events="mapEvents" :mapStyle='mapStyle'>
              <el-amap-marker v-if="currentMarker.position" :position="currentMarker.position" ></el-amap-marker>
              <el-amap-info-window  :autoMove="false" v-if="infoWindow.position" :position="infoWindow.position"  :content="infoWindow.content" isCustom :offset="[10, -30]"></el-amap-info-window>
            </el-amap>
          </div>
        </el-dialog>
      </section>

      <div class='table-page'>
        <el-pagination :current-page="page" :page-size="pageSize" layout="total, prev, pager, next" :total="pageTotal" @current-change="_handlePageChange">
        </el-pagination>
      </div>
    </el-card>

  </div>
</template>
<script>
  import { resultSelectData } from "@/utils/common";
  import popSwitch from '@/components/pop-switch';
  import websiteSelect from "@/components/website-select";
  import searchHistoryMixin from '@/mixins/search-history.js'
  import paginationMixin from '@/mixins/pagination.js'
  import {handleDictData,handleSubmitSearchData} from "@/utils/common.js";
  import loadingConfig from '@/config/loading'
  import mapConfig from "@/config/map-config"
  import imgViewer from '@/components/img-viewer/'

  export default {
    name: "recommendStation",
    components: {
      websiteSelect,
      popSwitch
    },
    mixins: [searchHistoryMixin, paginationMixin],
    data() {
      let self = this;
      return {
        zoom:15,
        centerPosition:[113.650992,34.742178],
        loading: false,
        loadSuccess: false,
        plugin: [
          {
            pName: 'Scale'
          }
        ], // 比例尺插件
        mapStyle: mapConfig.mapStyle[mapConfig.selectedStyle].url,
        dialogVisible: false,
        siteMarkers: [], //海量坐标
        currentMarker:[],//当前坐标
        address:'',//当前地址
        infoWindow:[],//信息窗口
        loadingConfig: loadingConfig,
        mapEvents: {
          // 初始化时加载
          init(map) {
            self.map = map;
            AMapUI.loadUI(['misc/PointSimplifier'], PointSimplifier => {
              self.pointSimplifierIns = new PointSimplifier({
                map: map,
                getPosition: function(dataItem) {
                  //返回数据项的经纬度，AMap.LngLat实例或者经纬度数组
                  return dataItem.position;
                },
                getHoverTitle: function(dataItem, idx) {
                  //返回数据项的Title信息，鼠标hover时显示
                  return dataItem.address;
                },
                renderOptions: {
                  //点的样式
                  pointStyle: {
                    fillStyle: 'blue' //蓝色填充
                  }
                },
                hoverTitleStyle:{
                  offset: [100,20]
                },
                autoSetFitView:false
              });
            });

            AMapUI.loadUI(['control/BasicControl'], BasicControl => {
              let zoomCtrl = new BasicControl.Zoom({
                position: {
                  right: '10px',
                  bottom: '10px'
                },
                showZoomNum: true
              });
              map.addControl(zoomCtrl)
            });
          }
        },
        labelWidth: '220px',
        tableData: [],
        locationData:[],
        searchSettings: [{
          label: '推荐地址',
          type: 'text',
          name: 'address',
          visible: true
        },
          {
            label: '推荐时间范围',
            name: 'created_on',
            type: 'daterange',
            unixTime: true,
            visible:true
          }
        ]};
    },

    computed: {
      user() {
        return this.$store.getters.user
      }
    },
    created() {
      this.loadTableData()
    },
    methods: {
      showMap(centerPosition,address) {
        // 获取地理位置
        if (centerPosition[0] < 0 || centerPosition[1] < 0) {
          this.$message.warning('地理位置错误');
          return;
        }

        this.address = address
        this.centerPosition = centerPosition;

        this.dialogVisible = true;
        this.getAllWebSite();
      },
      getAllWebSite() {
        this.loading = true;
        this.$service
          .getUserFeedbackNewStationLocation()
          .then(res => {
            console.log('加载中');
            this.dataHandle(res.data.data.list);
          })
          .catch(error => {
            this.loading = false;
          });
        // 获取所有网点列表
      },
      //处理数据
      dataHandle(siteData) {
        //展示所有推荐网点海量图
        this.siteMarkers = siteData.map((siteItem) => {
          return {
            position: [Number(siteItem.longitude), Number(siteItem.latitude)],
            address:siteItem.address
          };
        });

        console.log(this.pointSimplifierIns)
        this.loading = false;
        this.loadSuccess = true;
        //添加推荐网点标注
        this.currentMarker = {
          position: this.centerPosition,
          template: `<img src="./static/img/website.png" class="icon"></img>`
        }
        this.infoWindow = {
          position: this.centerPosition,
          content: this.address
        };
        console.log(this.siteMarkers)
        this.pointSimplifierIns.setData(this.siteMarkers);
      },
      handleSearch(data) {
        let searchData = Object.assign({}, data);
        searchData = handleSubmitSearchData(searchData);
        this.searchData = searchData;
        this.page = 1;
        console.log(this.searchData)
        this.loadTableData();
      },

      loadTableData() {
        this.pageSize = 10;
        let params = {page: this.page, pageSize: this.pageSize, ...this.searchData};
        //获取用户新建网点列表
        this.$service.getUserFeedbackNewStationList(params).then(res => {
          this.tableData = res.data.data.list.map(item => {
            item.longitude = parseFloat(item.longitude)
            item.latitude = parseFloat(item.latitude)
            item.location = []
            item.location.push(item.longitude)
            item.location.push(item.latitude)
            if(item.image_url.length > 30){
              item.image_url = eval('(' + item.image_url + ')')
              item.image_url.map((imgPath,index)=>{
                item.image_url[index] = 'http://static1.1byongche.com/'+imgPath
              })
            }else{
              item.image_url = '';
            }
            return item
          })
          console.log(this.tableData)

          this._changePageTotal(Number(res.data.data.pagination.totalCount))
        });
      },
      viewImg(imgUrls){
        imgViewer.viewImg(imgUrls)
      }
    }
  };
</script>
<style lang="scss">
  .el-form-item__label{
    width:100px;
  }
  #site-map {
    .map-content {
      height: 500px;
    } // 覆盖默认样式
    .amap-info-content {
      overflow: hidden;
    }
    .dialog-cursor {
      cursor: default;
    }
    .prompt {
      background: red;
      width: 100px;
      height: 30px;
      text-align: center;
    }

    .site-dialog {
      background: white;
      width: 100px;
    }

    .icon {
      // width: 41px;
      object-fit: contain;
      object-position: center;
      width: 100%;
      width: 27px;
    }
    .big-icon {
      width: 34px;
    }

    .dialog-mark-content {
      // 相对于mark点定位
      position: absolute;
      bottom: 0px;
      left: 0px;
      width: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .dialog-mark {
        background: white;
        width: 100%;
        padding: 2px;
        border-radius: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: normal;
        span {
          width: 200px;
          text-align: center;
          padding: 5px;
          line-height: 15px;
        }
      }
      .arrow-mark {
        width: 0px;
        height: 0px;
        border-width: 10px;
        border-style: solid;
        border-color: white transparent transparent transparent;
      }
    }
    .el-dialog__body {
      padding-top: 10px;
    }
  }
</style>
