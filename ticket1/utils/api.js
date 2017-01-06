const host = 'https://xcxhn.30days-tech.com/ticket_node/v1';
const wxRequest = (params, url) => {
  wx.showToast({
    title: '加载中',
    icon: 'loading'
  })
  wx.request({
    url: params.url? `${url}${params.url}`:url,
    data: params.data || {},
    method: params.method || 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      'Content-Type': 'application/json' // 设置请求的 header
    },
    success: function (res) {
      // success
      params.success && params.success(res)
      wx.hideToast()
    },
    fail: function () {
      // fail
      params.fail && params.fail(res)
    },
    complete: function () {
      // complete
      params.complete && params.complete(res)
    }
  })
}

const getUserInfoBycode =(params)=> wxRequest(params,`${host}/account/wx/info`)

const UserRegister =(params)=> wxRequest(params,`${host}/account/register`)

const getAdOnHome = (params) => wxRequest(params, `${host}/home`)

const getPlaceByKeyword = (params) => wxRequest(params, `${host}/home/place/select`)

const getTickets = (params) => wxRequest(params, `${host}/home/ticket/search`)

const createOrder = (params) => wxRequest(params, `${host}/home/order/create`)

const getOrderList = (params) => wxRequest(params, `${host}/account/order/mine`)

const getOrderDetial = (params) => wxRequest(params, `${host}/account/order/detail`)

const applyRefund = (params) => wxRequest(params, `${host}/account/order/refund`)

const getProfile = (params) => wxRequest(params, `${host}/account/profile`)

const editProfile = (params) => wxRequest(params, `${host}/account/profile/edit`)

const getIdentitys = (params) => wxRequest(params, `${host}/account/identity/mine`)

const getInsuranceIntroduce = (params) => wxRequest(params, `${host}/common/insurance/introduce`)

const getTrafficGuide = (params) => wxRequest(params, `${host}/common/traffic/guide`)

const editIdentity = (params) => wxRequest(params, `${host}/account/identity/edit`)

const deleteIdentity = (params) => wxRequest(params, `${host}/account/identity/delete`)

const setDefaultIdentity = (params) => wxRequest(params, `${host}/account/identity/default`)

const upload = (params) => wxRequest(params, `${host}/common/upload`)

const orderPay = (params) => wxRequest(params, `${host}/home/order/pay`)

module.exports = {
  getUserInfoBycode,
  UserRegister,
  getAdOnHome,
  getPlaceByKeyword,
  getTickets,
  createOrder,
  getOrderList,
  getOrderDetial,
  applyRefund,
  getProfile,
  editProfile,
  getIdentitys,
  getInsuranceIntroduce,
  getTrafficGuide,
  editIdentity,
  deleteIdentity,
  setDefaultIdentity,
  orderPay
}