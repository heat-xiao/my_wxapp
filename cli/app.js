
import WxValidate from "helpers/WxValidate";
import HttpService from "helpers/HttpService";
import WxService from "helpers/WxService";
import Tools from "helpers/Tools";
import Config from "etc/config";

App({
	onLaunch() {
		this.WxService.login()
			.then(r0 => {
				return this.HttpService.loginByCode({
					code: r0.code
				});
			})
			.then(r1 => {
				if(r1.resultStatus){
					const openId = r1.resultData.openId;
					const rdSession = r1.resultData.rdSession;
					const unionId = r1.resultData.unionId;
					if(r1.resultData.user){
						this.WxService.setStorageSync("userInfo", r1.resultData.user);
					}else{
						const getSystemInfoPromise = this.WxService.getSystemInfo();
						const getLocationPromise = this.WxService.getLocation({type: "wgs84"});
                        
						Promise.all([
							getSystemInfoPromise,
							getLocationPromise,
						]).then(([r2, r3])=>{
							const phoneType = r2.model;
							const lat = r3.latitude;
							const lon = r3.longitude;
							wx.request({
								url: "http://apis.map.qq.com/ws/geocoder/v1/?location=" + lat + "," + lon + "&get_poi=1&key=YBUBZ-VPWWS-DF3OQ-67VJE-B6KOZ-HRB4M",
								method: "GET",
								success: (r4) => {
									if (r4.statusCode == 200 && r4.data.status == 0) {
										const area = r4.data.result.address;
										this.WxService.getUserInfo().then(r5=>{
											const encryptedData = r5.encryptedData;
											const iv = r5.iv;
											this.HttpService.register({
												openId,
												rdSession,
												encryptedData,
												iv,
												unionId,
												phoneType,
												area
											}).then(r6=>{
												if(r6.resultStatus){
													this.WxService.setStorageSync("userInfo", r6.resultData);
												}                                           
											});
										});
									}
								},
							});
						});
					}
				}
			});
	},
	getUserInfo() {
		return this.WxService.login()
			.then(() => {
				return this.WxService.getUserInfo();
			})
			.then(data => {
				this.globalData.userInfo = data.userInfo;
				return this.globalData.userInfo;
			});
	},
	globalData: {
		userInfo: null
	},
	renderImage(path) {
		if (!path) return "";
		if (path.indexOf("http") !== -1) return path;
		return `${this.Config.fileBasePath}${path}`;
	},
	WxValidate: (rules, messages) => new WxValidate(rules, messages),
	HttpService: new HttpService({
		baseURL: Config.basePath,
	}), 
	WxService: new WxService,
	Tools: new Tools,
	Config,
});