import api from '../../utils/api.js'

Page({
    data: {
        identityTypeArray: {
            "IDCARD": "身份证", "MTP": "台胞证", "PASSPORT": "护照", "REENTRY_PERMIT": "回乡证", "OFFICIAL_CARD": "军官证", "RESIDENCE_PERMIT": "外国人居留证", "OTHER": "其他"
        },
         identitys: []
    },
    onShow: function (options) {
        var that = this
        api.getIdentitys({
            data: {
                accountId: wx.getStorageSync('userInfo').accountId,
            },
            success: (res) => {
                if (res.data && res.data != {}) {
                    that.setData({
                        identitys: res.data.resultData,
                    });
                }
            }
        });
    },

});