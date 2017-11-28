const App = getApp();

Page({
	data: {
		logged: !1
	},
	onLoad() { },
	onShow() {
		const token = App.WxService.getStorageSync("token");
		token && setTimeout(this.goIndex, 1000);
	},
	login() {
		this.signIn(this.goIndex);
	},
	goIndex() {
		App.WxService.redirectTo("/pages/index/index");
	},
	signIn(cb) {
		let  openId;
		//调用微信登录接口	
		App.WxService.login()
			.then(r0 => {
				return App.HttpService.getUserInfoByCode({
					code: r0.code
				});
			})
			.then(r1 => {
				openId = r1.resultData.openid;
				return App.WxService.getUserInfo();
			})
			.then(r2 => {
				return App.HttpService.register({
					encryptedData: r2.encryptedData,
					openId: openId,
					iv: r2.iv,
					storeId: 1
				});
			})
			.then(r3 => {
				App.WxService.setStorageSync("token", r3.resultData);
				App.globalData.token = r3.resultData;
				cb();
			});
	}
});