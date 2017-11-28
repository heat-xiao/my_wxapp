const App = getApp();

Page({
	data: {
		swiper: {
			indicatorDots: true,
			autoplay: true,
			interval: 3000,
			duration: 1000,
		},
		isPullDownRefresh:true,
		navbar: [
			{ menuId: 1, value: "点餐" },
			{ menuId: 2, value: "我的" }
		],
		activeMenuId: 1,
		prompt: {
			hidden: !0,
		},
		isShowCart: false,
		shoppingCart: [],
		totalPrice: 0,
		totalAmounts: 0,
		amount4List: {}
	},

	changeNavbar(e) {
		const menuId = e.currentTarget.dataset.id;
		if(menuId==2){
			this.setData({
				isPullDownRefresh: false,
			});
		}else{
			this.setData({
				isPullDownRefresh: true,
			}); 
		}
		this.setData({
			activeMenuId: menuId
		});
	},
	changeLeftTab(e) {
		const categoryId = e.currentTarget.dataset.id;
		App.HttpService.getCommoditiesByCategoryId({
			categoryId: categoryId
		}).then(data => {
			this.setData({
				commodities: data.resultData,
				"prompt.hidden": data.resultData.length,
				activeCategoryId: categoryId
			});
		});
	},
	onShow() {
		this.getCart();
	},

	getIndexData(){
		const token = App.WxService.getStorageSync("token");
		App.WxService.getSystemInfo()
			.then(data => {
				this.setData({
					deviceHeight: data.windowHeight,
					deviceWidth: data.windowWidth
				});
			});

		App.HttpService.getMenu({
			accountId: token.accountId,
			storeId: App.WxService.getStorageSync("storeId"),
		}).then(data => {
			if (!data.resultStatus) {
				App.WxService.showToast({
					title: data.errorMessage,
					icon: "loading",
					duration: 2000
				});
				return;
			}
			this.getCategoryBadge(data.resultData.shoppingCart);
			this.setData({
				topAds: data.resultData.topAds,
				categories: data.resultData.categories,
				shoppingCart: data.resultData.shoppingCart,
				commodities: data.resultData.commodities,
				"prompt.hidden": data.resultData.commodities.length,
				activeCategoryId: data.resultData.categories[0].categoryId,
				totalPrice: this.getTotalPriceAndSetAmount(data.resultData.shoppingCart).totalPrice,
				totalAmounts: this.getTotalPriceAndSetAmount(data.resultData.shoppingCart).totalAmounts
			});

			App.WxService.setNavigationBarTitle({
				title: data.resultData.storeName,
			});
		});
	},
	onLoad(options) {
		const storeId = options.storeId ? options.storeId : 1;
		const tableId = options.tableId ? options.tableId : 10;
		App.WxService.setStorageSync("storeId", storeId);
		App.WxService.setStorageSync("tableId", tableId);

		if(this.data.isPullDownRefresh){
			this.getIndexData();
			App.WxService.stopPullDownRefresh();
		} 
	},

	onPullDownRefresh() {
		if(this.data.isPullDownRefresh){
			this.getIndexData();
			App.WxService.stopPullDownRefresh();
		}    
	},

	toggleShow() {
		if (this.data.shoppingCart.length) {
			this.setData({
				"isShowCart": !this.data.isShowCart
			});
		}
	},

	addToCart(e) {
		const token = App.WxService.getStorageSync("token");
		const commodityId = e.currentTarget.dataset.id;
		const type = e.currentTarget.dataset.type;
		if (this.data.amount4List[commodityId] && this.data.amount4List[commodityId] === 1 && type === "decrease") {
			const url = `/menu/cart/remove?accountId=${token.accountId}&storeId=1&commodityId=${commodityId}`;
			App.HttpService.deleteCart(url).then(data => {
				cb(data);
			});
		} else {
			App.HttpService.addOrEditCart({
				accountId: token.accountId,
				storeId: App.WxService.getStorageSync("storeId"),
				amounts: type === "increase" && 1 || -1,
				commodityId
			}).then(data => {
				cb(data);
			});
		}
		const cb = (data) => {
			if (data.resultStatus) {
				this.getCart();
			} else {
				App.WxService.showToast({
					title: "编辑失败"
				});
			}
		};
	},

	getCart() {
		const token = App.WxService.getStorageSync("token");
		App.HttpService.getCart({
			accountId: token.accountId,
			storeId: App.WxService.getStorageSync("storeId")
		}).then(data => {
			if (!data.resultStatus) {
				App.WxService.showToast({
					title: data.errorMessage,
					icon: "loading",
					duration: 2000
				});
				return;
			}
			this.getCategoryBadge(data.resultData);
			this.setData({
				shoppingCart: data.resultData,
				isShowCart: data.resultData.length ? this.data.isShowCart : 0,
				totalPrice: this.getTotalPriceAndSetAmount(data.resultData).totalPrice,
				totalAmounts: this.getTotalPriceAndSetAmount(data.resultData).totalAmounts
			});
		});
	},

	getCategoryBadge(items) {
		let categoryBadge = {};
		items.forEach(item => {
			if (categoryBadge[item.categoryId]) {
				categoryBadge[item.categoryId] += item.amounts;
			} else {
				categoryBadge[item.categoryId] = item.amounts;
			}
		});
		this.setData({ categoryBadge });
	},

	getTotalPriceAndSetAmount(items) {
		let totalPrice = 0, totalAmounts = 0;
		// 先重置一下list的数量部分
		this.setData({ amount4List: {} });
		items.forEach(item => {
			totalPrice += item.commodityPrice * item.amounts;
			totalAmounts += item.amounts;
			this.setData({
				[`amount4List.${item.commodityId}`]: item.amounts
			});
		});
		return { totalPrice: totalPrice, totalAmounts: totalAmounts };
	},

	balance() {
		if (this.data.shoppingCart.length > 0) {
			App.WxService.navigateTo("/pages/order_confirm/index");
		} else {
			App.WxService.showToast({
				title: "购物车空空如也",
				icon: "loading",
				duration: 2000,
			});
		}
	}

});