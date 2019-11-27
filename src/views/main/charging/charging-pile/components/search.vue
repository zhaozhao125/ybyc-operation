<template>
    <div id="charging-pile-search">
        <v-search :searchSettings="searchSettings" labelWidth="120px" @reset="resetAll" @search="handleSearch">
          <template slot="stationId" slot-scope="scope">
            <div class="select-content">
            <website-select ref="website" v-model="scope.model.stationId"  placeholder="请输入站点名称" isRequest @selectItemId='getSelectItemId'></website-select>
            </div>
          </template>
        </v-search>
    </div>
</template>
<script>
import { searchSettings } from "./data";
import searchHistoryMixin from "@/mixins/search-history";
import { submitSearchDataMixin } from "@/mixins/search-page";
import websiteSelect from "./charging-station-select";
export default {
    name: "charging-pile-search",
    // mixins: [websiteSelect, searchHistoryMixin],
    data() {
        return {
          searchSettings: searchSettings,
          stationName:'',
          getStationId: null,
        };
    },
  mounted() {
    // 获取字典下拉列表
    this.carsInfoDict()
  },
    components: {
      websiteSelect
    },
  methods: {
    carsInfoDict() {
      this.$service.getChargingPileGenre().then(res => {
        let genreList = [];
        if(res.data.data){
          res.data.data.forEach(item => {
            genreList.push({value: item.id,label: item.equipmentModelName})
          })
        }
        this.searchSettings[3].options = genreList
      })
    },
    getSelectItemId(id) {
      this.getStationId = id
    },
    handleSearch(searchObj) {
      this.$emit('handleSearchData', searchObj)
    },
    resetAll(){
     this.$refs.website.clearInput()
    }
  }
};
</script>
