const App = getApp()

Page({
    data: {
        remark: ''
    },
    onLoad() {   
        const token = App.WxService.getStorageSync('token')
        App.HttpService.getCart({
            accountId: token.accountId,
            storeId: App.WxService.getStorageSync('storeId')
        }).then(data => {
            if (!data.resultStatus) {
                App.WxService.showToast({
                    title: data.errorMessage,
                    icon: 'loading',
                    duration: 2000
                })
                return
            }
            let commodities = new Array();
            let totalPrice = 0
            data.resultData.forEach(item => {
                commodities.push({ "commodityId": item.commodityId, "amounts": item.amounts })
                totalPrice += item.commodityPrice * item.amounts
            })

            this.setData({
                shoppingCart: data.resultData,
                totalPrice: totalPrice,
                commodities: commodities
            })

            return App.HttpService.getDiscount({
                accountId: token.accountId,
                storeId: App.WxService.getStorageSync('storeId'),
                tableId: App.WxService.getStorageSync('tableId'),
                commodities: commodities
            })
        })
            .then(res => {
                if (!res.resultStatus) {
                    App.WxService.showToast({
                        title: res.errorMessage,
                        icon: 'loading',
                        duration: 2000
                    })
                    return
                }
                this.setData({
                    deductPrice: res.resultData.deductPrice,
                    tag: res.resultData.tag
                })
            })
    },

    selectTag(e) {
        const tagId = e.currentTarget.dataset.id
        const content = e.currentTarget.dataset.content
        this.setData({
            remark: content,
            activeTagId: tagId
        })
    },
    getRemark(e) {
        this.setData({
            remark: e.detail.value
        })
    },
    submitOrder() {
        const token = App.WxService.getStorageSync('token')
        App.HttpService.createOrder({
            accountId: token.accountId,
            storeId: App.WxService.getStorageSync('storeId'),
            tableId: App.WxService.getStorageSync('tableId'),
            orderCommodities: this.data.commodities
        }).then(r0 => {
            if (!r0.resultStatus) {
                App.WxService.showToast({
                    title: r0.errorMessage,
                    icon: 'loading',
                    duration: 2000
                })
                return
            }

            if (r0.resultData.paySetting == "BEFORE_MEAL") {
                return App.HttpService.orderPay({
                    openId: token.openId,
                    orderNo: r0.resultData.orderNo
                })
            } else {
                App.WxService.redirectTo('/pages/msg/order_success/index')
            }

        }).then(r1 => {
            if (!r1.resultStatus) {
                App.WxService.showToast({
                    title: r1.errorMessage,
                    icon: 'loading',
                    duration: 2000
                })
                return
            }
            return App.WxService.requestPayment({
                'timeStamp': r1.resultData.timeStamp.toString(),
                'nonceStr': r1.resultData.nonceStr,
                'package': r1.resultData.package,
                'signType': 'MD5',
                'paySign': r1.resultData.sign,
            })
        }).then(r2 => {
            App.WxService.redirectTo('/pages/msg/pay_success/index')
        })
            .catch(function (error) {
                App.WxService.showToast({
                    title: '取消支付',
                    icon: 'loaddging',
                    duration: 2000
                })
            });
    }

})
