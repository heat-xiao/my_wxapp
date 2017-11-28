const App = getApp();
Page({
	data: {},
	onLoad: function () {
		App
			.HttpService
			.aboutUs({
				storeId: App
					.WxService
					.getStorageSync("storeId")
			})
			.then(data => {
				this.setData({storePicture: data.resultData.storePicture});
			});
	}
});
