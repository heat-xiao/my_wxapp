import ServiceBase from 'ServiceBase'

class Service extends ServiceBase {
	constructor() {
		super()
		this.$$prefix = ''
		this.$$path = {
			userInfo: '/account/wx/info',
			register: '/account/register',
			menu: '/menu',
			commodities: '/menu/category/commodities',
			commodityDetail: '/menu/commodity/detail',
			orderList: '/account/order/mine',
			cart :'/menu/cart/mine',
			addOrEditCart: '/menu/cart/edit',
			deleteCart: '/menu/cart/remove',
			discount:'/menu/order/discount',
			createOrder:'/menu/order/create',
			orderPay:'/menu/order/pay',
			addSameOrder:'/menu/order/addSameOrder',
			commentOrder:'/account/order/comment',
			aboutUs:'/menu/aboutUs'
		}
	}
	getUserInfoByCode(params) {
		return this.getRequest(this.$$path.userInfo, params)
	}

	register(params) {
		return this.postRequest(this.$$path.register, params)
	}

	getMenu(params) {
		return this.getRequest(this.$$path.menu, params)
	}

	getCommoditiesByCategoryId(params) {
		return this.getRequest(this.$$path.commodities, params)
	}
	getCommodityDetailById(params) {
		return this.getRequest(this.$$path.commodityDetail, params)
	}

	getOrderList(params) {
		return this.getRequest(this.$$path.orderList, params)
	}

	getCart(params) {
		return this.getRequest(this.$$path.cart, params)
	}

	addOrEditCart(params) {
		return this.postRequest(this.$$path.addOrEditCart, params)
	}

	deleteCart(url) {
		return this.deleteRequest(url)
	}

	getDiscount(params) {
		return this.postRequest(this.$$path.discount, params)
	}

	createOrder(params) {
		return this.postRequest(this.$$path.createOrder, params)
	}

	orderPay(params) {
		return this.postRequest(this.$$path.orderPay, params)
	}

	addSameOrder(params) {
		return this.postRequest(this.$$path.addSameOrder, params)
	}

	commentOrder(params) {
		return this.postRequest(this.$$path.commentOrder, params)
	}

	aboutUs(params) {
		return this.getRequest(this.$$path.aboutUs, params)
	}
}

export default Service