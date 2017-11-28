var App = getApp();
Page({
	data: {
	},  
	continueOrder() {
		App.WxService.redirectTo("/pages/index/index");
	},  
	toOrderList() {
		App.WxService.redirectTo("/pages/order_list/index");
	}
});
