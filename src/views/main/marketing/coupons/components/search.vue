<template>
    <div id="coupons-search">
        <v-search :searchSettings="searchSettings" labelWidth="120px" @search="handleSearch">
        </v-search>
    </div>
</template>
<script>
import { searchSettings } from "./data";
import searchHistoryMixin from "@/mixins/search-history";
import { submitSearchDataMixin } from "@/mixins/search-page";
// import { handleDictData } from "@/utils/common";
// import searchSelect from "@/components/website-select";
export default {
    name: "coupons-search",
    mixins: [submitSearchDataMixin, searchHistoryMixin],
    data() {
        return {
            searchSettings: searchSettings
        };
    },
    components: {
        // searchSelect
    },
    methods: {
    }
};
</script>
