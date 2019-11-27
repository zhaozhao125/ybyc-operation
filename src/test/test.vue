<template>
  <div class="test">
    <div class="test-search">
      <v-search :searchSettings="searchSettings" @search="onSearch"></v-search>
    </div>
    <hr>
    <div class="test-form">
      <v-form :formSettings="formSettings" @save="onSaveForm" :formData="{img: [{
                  name: 'asd.jpg',
                  url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                }],imgUploadText:['aa'],startDate: 1514257954, daterange:[1412227954,1514257954]}">
        <template slot="location" slot-scope="scope">
          <el-input placeholder="" v-model="scope.model.location">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </template>
        <template slot="slotTest" slot-scope="scope">
          <el-form-item label="asdasd" prop="slot1">
            <el-input placeholder="aaa" v-model="scope.model.slot1">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="qweqwe" prop="slot2">
            <el-input placeholder="sss" v-model="scope.model.slot2">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-form-item>
        </template>
      </v-form>
    </div>
    <div class="test-detail">
      <v-detail :detailSettings='detailSettings' :data="detailData"></v-detail>
    </div>
    <div>
      <el-button type="danger" @click="viewImg">查看图片</el-button>
    </div>
    <div style="width:500px;height:300px;margin:50px">
      <vGallary :imgs="['http://static1.1byongche.com/152039363098632862IMG_5647.PNG']" :inbox="true"></vGallary>
    </div>
    <div style="width:500px;height:300px;margin:50px">
      <vGallary :imgs="['http://static1.1byongche.com/152039362508728469IMG_5644.JPG']" :inbox="true"></vGallary>
    </div>
    <div style="width:500px;height:300px;margin:50px">
      <vGallary :imgs="['http://static1.1byongche.com/152039360506010006IMG_5575.JPG']" :inbox="true"></vGallary>
    </div>
  </div>
</template>
<script>
import { carModelList, tboxList, areaList } from '@/config/select-data.js'
import vDetail from '@/components/detail/v-detail'
import imgViewer from '@/components/img-viewer/'
import vGallary from '@/components/gallery/vGallery'
export default {

  name: 'test',

  components: {
    vSearch: resolve => require(['@/components/search/vSearch'], resolve),
    vForm: resolve => require(['@/components/form/vForm'], resolve),
    vDetail,
    vGallary
  },

  data() {
    let validator1 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入xxx'))
      }
      if (value.length < 5) {
        return callback(new Error('xxx长度不能小于5位'))
      }
      callback()
    }
    return {
      searchSettings: [{
        type: 'selectSearch',
        name: 'selectSearchVal',
        options: [{
          label: '类型1',
          value: '1'
        }, {
          label: '类型2',
          value: '2'
        }],
        placeholder: 'aassdd',
        visible: true
      }, {
        type: 'labelSelectDateRange',
        placeholder: '请选择时间',
        name: 'selectDate',
        optionValue: 'date',
        options: [{
          label: '下单时间',
          value: 'date'
        }, {
          label: '取车时间',
          value: 'startDate'
        }, {
          label: '还车时间',
          value: 'returnDate'
        }],
        visible: true,
        unixTime: true,
        default: [new Date('2018-02-02'), new Date()]
      }, {
        label: '历史搜索',
        name: 'hisearch',
        type: 'autocomplete',
        placeholder: '输入车牌号=',
        visible: true,
        data: [
          { 'value': '三全鲜食（北新泾店）', 'address': '长宁区新渔路144号' },
          { 'value': 'Hot honey 首尔炸鸡（仙霞路）', 'address': '上海市长宁区淞虹路661号' },
          { 'value': '新旺角茶餐厅', 'address': '上海市普陀区真北路988号创邑金沙谷6号楼113' },
          { 'value': '泷千家(天山西路店)', 'address': '天山西路438号' },
          { 'value': '胖仙女纸杯蛋糕（上海凌空店）', 'address': '上海市长宁区金钟路968号1幢18号楼一层商铺18-101' },
          { 'value': '贡茶', 'address': '上海市长宁区金钟路633号' },
          { 'value': '豪大大香鸡排超级奶爸', 'address': '上海市嘉定区曹安公路曹安路1685号' },
          { 'value': '茶芝兰（奶茶，手抓饼）', 'address': '上海市普陀区同普路1435号' },
          { 'value': '十二泷町', 'address': '上海市北翟路1444弄81号B幢-107' },
          { 'value': '星移浓缩咖啡', 'address': '上海市嘉定区新郁路817号' },
          { 'value': '阿姨奶茶/豪大大', 'address': '嘉定区曹安路1611号' },
          { 'value': '新麦甜四季甜品炸鸡', 'address': '嘉定区曹安公路2383弄55号' },
          { 'value': 'Monica摩托主题咖啡店', 'address': '嘉定区江桥镇曹安公路2409号1F，2383弄62号1F' },
          { 'value': '浮生若茶（凌空soho店）', 'address': '上海长宁区金钟路968号9号楼地下一层' },
          { 'value': 'NONO JUICE  鲜榨果汁', 'address': '上海市长宁区天山西路119号' },
          { 'value': 'CoCo都可(北新泾店）', 'address': '上海市长宁区仙霞西路' },
          { 'value': '快乐柠檬（神州智慧店）', 'address': '上海市长宁区天山西路567号1层R117号店铺' },
          { 'value': 'Merci Paul cafe', 'address': '上海市普陀区光复西路丹巴路28弄6号楼819' }
        ],
        limit: 3
      }, {
        label: '搜索',
        name: 'search',
        type: 'text',
        placeholder: '输入车牌号、车架号',
        visible: true,
        value: 'test default value'
      }, {
        label: '城市',
        name: 'region',
        type: 'cascader',
        visible: true,
        changeOnSelect: true,
        options: [{
          label: '河南',
          value: '1',
          children: [{
            label: '郑州',
            value: '1'
          },
          {
            label: '洛阳',
            value: '2'
          },
          {
            label: '开封',
            value: '3'
          }
          ]
        },
        {
          label: '安徽',
          value: '2',
          children: [{
            label: '合肥',
            value: '1'
          },
          {
            label: '芜湖',
            value: '2'
          },
          {
            label: '黄山',
            value: '3'
          }
          ]
        }
        ]
      }, {
        label: '租赁类型',
        name: 'rentType',
        type: 'select',
        options: [{
          label: '类型1',
          value: '1'
        }, {
          label: '类型2',
          value: '2'
        }]
      }, {
        label: '车型',
        name: 'carModel',
        type: 'select',
        options: [{
          label: '2016款知豆D1',
          value: '1'
        }, {
          label: '江淮iEV4',
          value: '2'
        }, {
          label: '海马爱尚EV',
          value: '3'
        }]
      }, {
        label: '是否亏电',
        name: 'lowBattery',
        type: 'select'
      }, {
        label: '是否充电中',
        name: 'isCharging',
        type: 'select'
      }, {
        label: '在线状态',
        name: 'online',
        type: 'select',
        options: [{
          label: '在线',
          value: '1'
        }, {
          label: '离线',
          value: '2'
        }]
      }, {
        label: '日期',
        name: 'datesingle',
        type: 'daterange',
        unixTime: true,
        default: [new Date('2018-02-02'), new Date()]
      }],
      formSettings: [{
        label: 'slot test',
        slot: 'slotTest',
        items: [{
          name: 'slot1'
        }, {
          name: 'slot2'
        }]
      }, {
        label: '基本信息',
        items: [{
          label: '所属车型',
          name: 'carModel',
          type: 'select',
          options: carModelList,
          required: false,
          valueType: 'string'
        }, {
          label: '城市选择',
          name: 'area',
          type: 'cascader',
          options: areaList,
          required: false
        }, {
          label: '车牌号',
          name: 'carPlate',
          type: 'number',
          required: false
        }]
      }, {
        label: 'tbox信息',
        items: [{
          label: 'tbox类别',
          name: 'tboxType',
          type: 'select',
          options: tboxList,
          required: false
        }, {
          label: '经纬度',
          name: 'location',
          type: 'slot',
          required: false,
          value: ''
        }, {
          label: 'tbox sim卡号',
          name: 'tboxCard',
          type: 'text',
          placeholder: 'please enter your card number'
          // rule: [{
          //   validator: validator1,
          //   trigger: 'change'
          // }]
        }]
      }, {
        label: '其它信息',
        items: [{
          label: '开始使用日期',
          name: 'startDate',
          type: 'date',
          required: false,
          unixTime: true
        }, {
          label: '日期范围',
          name: 'daterange',
          type: 'daterange',
          required: false,
          unixTime: true
        }, {
          label: '车辆属性',
          name: 'carAttr',
          type: 'radio',
          value: 2,
          options: [{
            label: '一步用车',
            value: 1,
            default: true
          }, {
            label: '加盟商',
            value: 2
          }]
        }, {
          label: '图片',
          name: 'img',
          type: 'img',
          limit: 5,
          multiple: false,
          tip: ['只能上传图片', '可以有多行提示'],
          maxSize: 200,
          required: false,
          hasTextInput: true
        }, {
          label: '文件',
          name: 'file',
          type: 'file',
          limit: 2,
          multiple: true,
          tip: 'aaa',
          noRename: true
        }, {
          label: '支持支付方式',
          name: 'payMethod',
          type: 'checkbox',
          value: [2, 3],
          min: 1,
          max: 2,
          options: [{
            label: '刷卡支付',
            value: 1
          }, {
            label: '现金',
            value: 2
          }, {
            label: 'app',
            value: 3
          }]
        }, {
          label: '介绍',
          name: 'description',
          type: 'textarea',
          placeholder: 'aaasss'
        }]
      }],
      formData: { 'carModel': 2, 'area': ['2', '22'], 'carPlate': 123, 'tboxType': '2', 'location': '123123', 'tboxCard': '234234', 'startDate': new Date(), 'carAttr': 2, 'img': [], 'file': [], 'payMethod': [2, 3], 'description': 'aassdd' },
      detailSettings: [{
        label: '基本信息',
        items: [{
          label: '网点名称',
          value: 'name'
        },
        {
          label: '运营城市',
          value: 'operationCityName'
        },
        {
          label: '片区',
          value: 'districtName'
        },
        {
          label: '网点图片',
          value: 'imgs',
          type: 'image'
        },
        {
          label: '还车半径(米)',
          value: 'carOffScope'
        }
        ]
      },
      {
        label: '营业信息',
        items: [
          {
            label: '营业时间',
            value: 'openingHours'
          },
          {
            label: '服务电话',
            value: 'phone'
          },
          {
            label: '停车位(个)',
            value: 'parkings'
          },
          {
            label: '关联充电站',
            value: 'chargingName'
          },
          {
            label: '充电桩',
            value: 'fastPileNum',
            type: 'slot'
          }
        ]
      }
      ],
      detailData: {
        'areaName': '二七区',
        'address': '的说法你发个',
        'operationCityId': 410200,
        'operationCityName': '开封市',
        'id': 673,
        'sn': 'S4102000003',
        'name': '那个妇女节',
        'returnCarPolygon': [
          [113.654556, 34.748596],
          [113.660307, 34.749443],
          [113.662624, 34.741191],
          [113.659277, 34.741085],
          [113.654556, 34.748596]
        ],
        'location': [113.658075, 34.745793],
        'carOffScope': 10,
        'poi': '二七区',
        'openingHours': '00:00-24:00',
        'open': true,
        'phone': '9879754',
        'principal': '',
        'developer': '',
        'principalPhone': '',
        'parkings': 1,
        'intro': '',
        'remark': '',
        'sendCarService': false,
        'timeSharingStation': true,
        'del': false,
        'modifiedOn': '2018-03-07 11:33:56',
        'createdOn': '2018-03-06 18:57:23',
        'createdBy': 'wensiyuan',
        'modifiedBy': 'admin',
        'districtId': 6,
        'districtName': '开封片区',
        'imgs': ['http://static1.1byongche.com/152039360506010006IMG_5575.JPG', 'http://static1.1byongche.com/152039362508728469IMG_5644.JPG', 'http://static1.1byongche.com/152039363098632862IMG_5647.PNG'],
        // 图片描述，在图片字段名后加"ImgDescription"即可
        'imgsImgDescription': ['aaa', '', 'ddd'],
        'carNum': 0,
        'appCarNum': 0,
        'longCarNum': 0,
        'type': 'contract',
        'contractBusiness': {
          'payParkingFee': false,
          'parkingNum': null,
          'parkingMoney': null,
          'taskCommission': true,
          'payChargeFee': true,
          'baseChargeFee': 1.0,
          'differencesChargeFee': 0.0,
          'orderCommission': false,
          'commissionRate': null
        }
      }
    }
  },

  methods: {
    onSearch(data) {
      console.log('====search====', data)
      this.searchSettings[0].data = [{ 'value': 'aaa', 'address': '长宁区新渔路144号' },
        { 'value': 'sss', 'address': '上海市长宁区淞虹路661号' }
      ]
    },
    onSaveForm(data) {
      console.log('====data====', data)
    },
    viewImg() {
      imgViewer.viewImg(['https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521008427119&di=ee077e091a7469b4f8597cca3f36b365&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fac4bd11373f0820207282ceb41fbfbedaa641baf.jpg', 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1521008427118&di=cc681b21b762d38141597e6f030f6be0&imgtype=0&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2Fd788d43f8794a4c273cb6b0804f41bd5ad6e392c.jpg'])
    }
  }
}
</script>
<style lang="scss" scoped>
.test {
  // background-color: $color-red;
  padding: 20px;
  .test-search {}
  .test-form {
    width: 500px;
    margin: auto;
  }
}
</style>
