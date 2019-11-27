const news = () =>
  import(/* webpackChunkName: "website" */ '@/views/main/content/news/')
const websiteCityPartner = () =>
  import(/* webpackChunkName: "website" */ '@/views/main/content/city-partner/')
const agreementManagement = () =>
  import(/* webpackChunkName: "website" */ '@/views/main/content/agreement-management/')
export default {
  news,
  websiteCityPartner,
  agreementManagement
}
