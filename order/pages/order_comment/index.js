const App = getApp()

Page({
    data: {

    },
    onLoad() {
        const commentOrder = App.WxService.getStorageSync('commentOrder')
        const score = []
        commentOrder.orderCommodities.forEach((item) => {
            score.push(5)
        })
        this.setData({
            commodities: commentOrder.orderCommodities,
            orderNo:commentOrder.orderNo,
            score: score
        });
    },
    submitComment(e) {
        const comments = [];
        this.data.commodities.forEach((item, index) => {
            comments.push({
                commodityId: item.commodityId,
                content: e.detail.value['content_' + index]?e.detail.value['content_' + index]:'味道不错，服务很好',
                score: this.data.score[index]
            })
        })

        const token = App.WxService.getStorageSync('token')
        App.HttpService.commentOrder({
            accountId: token.accountId,
            storeId: App.WxService.getStorageSync('storeId'),
            orderNo:this.data.orderNo,
            comments: comments
        }).then(data => {
            if (data.resultStatus) {
                App.WxService.showToast({
                    title: '感谢您的评价',
                    icon: 'success',
                    duration: 2000
                })

                App.WxService.navigateBack({
                    delta: 1
                })
            } else {
                App.WxService.showToast({
                    title: data.errorMessage,
                    icon: 'loading',
                    duration: 2000
                })
            }
        })
    },

    selectScore: function (e) {
        var score = this.data.score;
        var index = parseInt(e.currentTarget.dataset.index);
        score[index] = parseInt(e.currentTarget.dataset.value);
        this.setData({
            score: score
        });
    },

})
