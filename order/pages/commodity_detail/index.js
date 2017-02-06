const App = getApp()

Page({
    data: {
        swiper: {
            indicatorDots: true,
            autoplay: true,
            interval: 3000,
            duration: 1000,
        },
        isShowCart: 0,
        shoppingCart: [],
        totalPrice: 0,
        totalAmounts: 0,
        amount4List: {}
    },
    onLoad(options) {
        App.WxService.getSystemInfo()
            .then(data => {
                this.setData({
                    deviceHeight: data.windowHeight,
                });
            });

        App.HttpService.getCommodityDetailById({
            commodityId: options.commodityId
        }).then(data => {
            if (!data.resultStatus) {
                App.WxService.showToast({
                    title: data.errorMessage,
                    icon: 'loading',
                    duration: 2000
                })
                return
            }
            let imgUrls = new Array();
            imgUrls = data.resultData.commodityIcon.split(";")
            this.setData({
                commodityInfo: data.resultData,
                imgUrls: imgUrls
            });
            return App.HttpService.getCart({
                accountId: App.WxService.getStorageSync('token').accountId,
                storeId: App.WxService.getStorageSync('storeId')
            })
        }).then(data => {
            if (!data.resultStatus) {
                App.WxService.showToast({
                    title: data.errorMessage,
                    icon: 'loading',
                    duration: 2000
                })
                return
            }
            this.setData({
                shoppingCart: data.resultData,
                isShowCart: data.resultData.length ? this.data.isShowCart : 0,
                totalPrice: this.getTotalPriceAndSetAmount(data.resultData).totalPrice,
                totalAmounts: this.getTotalPriceAndSetAmount(data.resultData).totalAmounts
            })
        })
    },

    toggleShow() {
        if (this.data.shoppingCart.length) {
            this.setData({
                'isShowCart': !this.data.isShowCart
            });
        }
    },
    //点击遮罩层隐藏其本身
    hideMask() {
        this.setData({
            'cart.isShowInfo': 0
        });
    },
    addToCart(e) {
        const token = App.WxService.getStorageSync('token')
        const commodityId = e.currentTarget.dataset.id
        const type = e.currentTarget.dataset.type
        const _this = this
        if (this.data.amount4List[commodityId] && this.data.amount4List[commodityId] === 1 && type === 'decrease') {
            const url = `/menu/cart/remove?accountId=${token.accountId}&storeId=1&commodityId=${commodityId}`
            App.HttpService.deleteCart(url).then(data => {
                cb(data)
            })
        } else {
            App.HttpService.addOrEditCart({
                accountId: token.accountId,
                storeId: App.WxService.getStorageSync('storeId'),
                amounts: type === 'increase' && 1 || -1,
                commodityId
            }).then(data => {
                cb(data)
            })
        }
        const cb = (data) => {
            if (!data.resultStatus) {
                App.WxService.showToast({
                    title: data.errorMessage,
                    icon: 'loading',
                    duration: 2000
                })
                return
            }
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
                _this.setData({
                    shoppingCart: data.resultData,
                    totalPrice: this.getTotalPriceAndSetAmount(data.resultData).totalPrice,
                    totalAmounts: this.getTotalPriceAndSetAmount(data.resultData).totalAmounts
                })
            })
        }
    },

    getTotalPriceAndSetAmount(items) {
        let totalPrice = 0, totalAmounts = 0
        // 先重置一下list的数量部分
        this.setData({ amount4List: {} })
        items.forEach(item => {
            totalPrice += item.commodityPrice * item.amounts
            totalAmounts += item.amounts
            this.setData({
                [`amount4List.${item.commodityId}`]: item.amounts
            })
        })
        return { totalPrice: totalPrice, totalAmounts: totalAmounts }
    },
    balance() {
        if (this.data.shoppingCart.length > 0) {
            App.WxService.navigateTo('/pages/order_confirm/index')
        } else {
            App.WxService.showToast({
                title: '购物车空空如也',
                icon: 'loading',
                duration: 2000,
            })
        }
    }
})
