<template>
    <section id="car-start-record-search">
        <v-search :searchSettings="searchSettings" @search="handleSearch"></v-search>
    </section>
</template>
<script>
import vSearch from "@/components/search/vSearch";
import { searchSettings } from "./data";
import searchHistoryMixin from '@/mixins/search-history.js'
import { submitSearchDataMixin } from '@/mixins/search-page.js'
import { handleSearchTime } from '@/utils/common'
export default {
    name: "car-start-record-search",
    mixins: [submitSearchDataMixin, searchHistoryMixin],
    data() {
        return {
            searchSettings: searchSettings,
        };
    }
};
</script>
<style lang='scss'>

</style>

