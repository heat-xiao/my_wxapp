import api from '../../../utils/api.js'
Page({

  onLoad: function (options) {
    var orderNo = options.orderNo;
    var that = this
    api.getOrderDetial({
      data: {
        orderNo: orderNo
      },
      success: (res) => {
         if (res.data && res.data != {}&&res.data.resultStatus) {
          var orderDetail = res.data.resultData
          switch(orderDetail.orderStatus)
          {
          case 'UNPAID':
            var tipText ='未完成支付'
            break;
          case 'FINISHED':
            var tipText ='购票成功'
            break;
          default:
            var tipText ='操作成功'
          }
          that.setData({
            orderNo: orderNo,  
            orderStatus: orderDetail.orderStatus,
            tipText:tipText
          });
        }
      }
    });
  }
})
