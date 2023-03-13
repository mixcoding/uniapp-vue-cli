/*
 * @Date: 2023-03-13 15:10:57
 * @LastEditors: mixcoding
 * @LastEditTime: 2023-03-13 15:12:47
 */
import request from '../util'

// 首页相关接口
import {URL} from '@/.env.dev.js'

// api地址
const api = {
	getGoods:[`${URL}/api/v1/goods/get-list`,'GET'],
}
// 获取热销商品接口
export const getGoods = (param) => {
	return request(api.getGoods, param)
}
