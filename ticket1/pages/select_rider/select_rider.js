import api from '../../utils/api.js'
Page({
    data: {
        identityTypeArray: {
            "IDCARD": "身份证", "MTP": "台胞证", "PASSPORT": "护照", "REENTRY_PERMIT": "回乡证", "OFFICIAL_CARD": "军官证", "RESIDENCE_PERMIT": "外国人居留证", "OTHER": "其他"
        }
    },
    onLoad: function () {
        var that = this
        
        api.getIdentitys({
            data: {
                accountId: wx.getStorageSync('userInfo').accountId,
            },
            success: (res) => {
                if (res.data && res.data != {}) {
                    that.setData({
                        allIdentitys: res.data.resultData,
                        selectIds: this.transfer2Obj(wx.getStorageSync('selectIds'))
                    });

                    wx.setStorageSync('allIdentitys', res.data.resultData);
                }
            }
        });

    },

    checkboxChange: function (e) {
        let checkedIds = e.detail.value;
        wx.setStorageSync('selectIds', checkedIds)
        this.setData({ selectIds: this.transfer2Obj(checkedIds) })
    },

    transfer2Obj: function (arr) {
        let obj = {}
        if (arr) {arr.forEach(item => obj[+item] = true)}
        return obj
    }
});