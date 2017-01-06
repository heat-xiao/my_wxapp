import api from '../../utils/api.js'
var identitys, startX, startY, endX, endY, key;
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
                    identitys = res.data.resultData
                    that.setData({
                        identitys: res.data.resultData,
                    });
                }
            }
        });
    },


    drawStart: function (e) {
        // console.log("drawStart");  
        var touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        key = true;
    },

    drawMove: function (e) {
        //console.log("drawMove");  
        var that = this;
        var dataId = e.currentTarget.id;
        if (key) {
            var touch = e.touches[0];
            endX = touch.clientX;
            endY = touch.clientY;
            var XNum = (endX - startX) < 0 ? startX - endX : endX - startX;
            var YNum = (endY - startY) < 0 ? startY - endY : endY - startY;
            var res = identitys
            if (XNum > YNum) {
                if ((endX - startX) <= -5) {
                    for (var k in res) {
                        if (res[k].identityId == dataId) {
                            res[k]["right"] = "15%"
                        } else {
                            res[k]["right"] = 0
                        }
                    }
                } else {
                    for (var k in res) {
                        if (res[k].identityId == dataId) {
                            res[k]["right"] = 0
                        }

                    }
                }
            }

            that.setData({
                identitys: identitys,
            });
        }
        key = false
    },
    
    //删除item  
    delIdentity: function (e) {
        var removeId = e.target.dataset.identityid;
        identitys = identitys.filter(function (item) {
            return item.identityId != removeId
        });

        api.deleteIdentity({
            url: `?identityId=${removeId}&accountId=${wx.getStorageSync('userInfo').accountId}`,
            method: "DELETE",
            success: (res) => {
                if (res.data && res.data != {}) {
                    console.log(identitys);
                    this.setData({
                        identitys: identitys
                    });
                }
            }
        });       
    },

});