import siteMap from '@/components/siteMap/site-map'
export const position = {
  methods: {
    position (lng, lat) {
      if (lng && lat) {
        return [lng, lat]
      } else {
        return []
      }
    }
  },
  components: {
    siteMap
  }
}
