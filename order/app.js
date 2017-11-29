import polyfill from "assets/plugins/polyfill";
import WxValidate from "helpers/WxValidate";
import HttpResource from "helpers/HttpResource";
import HttpService from "helpers/HttpService";
import WxService from "helpers/WxService";
import Tools from "helpers/Tools";
import Config from "etc/config";

App({
	onLaunch() {
		let openId,token = this.WxService.getStorageSync("token");
		if(token){
			return;
		}
		//调用微信登录接口	
		this.WxService.login()
			.then(r0 => {
				return this.HttpService.getUserInfoByCode({
					code: r0.code
				});
			})
			.then(r1 => {
				openId = r1.resultData.openid;
				return this.WxService.getUserInfo();
			})
			.then(r2 => {
				return this.HttpService.register({
					encryptedData: r2.encryptedData,
					openId: openId,
					iv: r2.iv,
					storeId: 1
				});
			})
			.then(r3 => {
				this.globalData.userInfo = r3.resultData;
				// this.WxService.setStorageSync("token", r3.resultData);
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
	HttpResource: (url, paramDefaults, actions, options) => new HttpResource(url, paramDefaults, actions, options).init(),
	HttpService: new HttpService,
	WxService: new WxService,
	Tools: new Tools,
	Config: Config,
});