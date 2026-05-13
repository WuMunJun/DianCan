const uniID = require('uni-id-common')
const createConfig = require('uni-config-center')

async function getAccessTokenInner() {
	const config = createConfig({
		pluginId: 'uni-id'
	})
	const mpWeixinConfig = config.config('mp-weixin.oauth.weixin')
	const appid = mpWeixinConfig && mpWeixinConfig.appid
	const secret = mpWeixinConfig && mpWeixinConfig.appsecret
	const db = uniCloud.database()
	const collection = db.collection('access-token')
	const now = Date.now()
	const res = await collection.where({
		provider: 'weixin-mp'
	}).get()
	if (res.data.length > 0 && res.data[0].expired > now) {
		return {
			errCode: 0,
			accessToken: res.data[0].access_token
		}
	}
	const result = await uniCloud.httpclient.request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + appid + '&secret=' + secret, {
		method: 'GET',
		dataType: 'json'
	})
	if (result.data.access_token) {
		const expired = now + result.data.expires_in * 1000 - 300000
		if (res.data.length > 0) {
			await collection.doc(res.data[0]._id).update({
				access_token: result.data.access_token,
				expired: expired
			})
		} else {
			await collection.add({
				provider: 'weixin-mp',
				access_token: result.data.access_token,
				expired: expired
			})
		}
		return {
			errCode: 0,
			accessToken: result.data.access_token
		}
	} else {
		return {
			errCode: 'GET_ACCESS_TOKEN_FAILED',
			errMsg: result.data.errmsg || '获取access_token失败'
		}
	}
}

async function generateQrcodeInner(zhuohao) {
	try {
		const tokenRes = await getAccessTokenInner()
		if (tokenRes.errCode) {
			return tokenRes
		}
		const result = await uniCloud.httpclient.request('https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + tokenRes.accessToken, {
			method: 'POST',
			contentType: 'json',
			dataType: 'buffer',
			data: {
				scene: zhuohao,
				width: 430,
				check_path: false
			}
		})
		if (result.status === 200 && result.data) {
			const contentType = result.headers && result.headers['content-type'] || ''
			if (contentType.includes('image')) {
				const uploadRes = await uniCloud.uploadFile({
					cloudPath: 'qrcode/zhuohao_' + zhuohao + '_' + Date.now() + '.png',
					fileContent: result.data
				})
				return {
					errCode: 0,
					fileID: uploadRes.fileID
				}
			} else {
				let errMsg = '生成小程序码失败'
				try {
					const errData = JSON.parse(result.data.toString())
					errMsg = errData.errmsg || errMsg
				} catch (e) {}
				return {
					errCode: 'GENERATE_QRCODE_FAILED',
					errMsg: errMsg
				}
			}
		} else {
			return {
				errCode: 'GENERATE_QRCODE_FAILED',
				errMsg: '生成小程序码失败'
			}
		}
	} catch (e) {
		return {
			errCode: 'GENERATE_QRCODE_ERROR',
			errMsg: e.message
		}
	}
}

module.exports = {
	_before: function () {
	},
	async createZhuohao(params) {
		let zhuohao, zhuoxing = '中桌', renshu = 4, status = '空桌'
		if (typeof params === 'object') {
			zhuohao = params.zhuohao
			zhuoxing = params.zhuoxing || '中桌'
			renshu = parseInt(params.renshu) || 4
			status = params.status || '空桌'
		} else {
			zhuohao = params
		}
		if (!zhuohao) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '桌号不能为空'
			}
		}
		const db = uniCloud.database()
		const collection = db.collection('zhuohao')
		const res = await collection.where({
			zhuohao: zhuohao
		}).get()
		if (res.data.length > 0) {
			return {
				errCode: 'ZHUOHAO_EXISTS',
				errMsg: '桌号已存在'
			}
		}
		const qrcodeRes = await generateQrcodeInner(zhuohao)
		if (qrcodeRes.errCode) {
			return qrcodeRes
		}
		const addRes = await collection.add({
			zhuohao: zhuohao,
			zhuoxing: zhuoxing,
			renshu: renshu,
			qrcode: qrcodeRes.fileID,
			status: status
		})
		return {
			errCode: 0,
			errMsg: '创建成功',
			data: {
				id: addRes.id,
				zhuohao: zhuohao,
				zhuoxing: zhuoxing,
				renshu: renshu,
				qrcode: qrcodeRes.fileID,
				status: status
			}
		}
	},
	async updateZhuohao(params) {
		let id, zhuohao, zhuoxing, renshu, status
		if (typeof params === 'object') {
			id = params.id
			zhuohao = params.zhuohao
			zhuoxing = params.zhuoxing
			renshu = params.renshu !== undefined ? parseInt(params.renshu) : undefined
			status = params.status
		} else {
			id = arguments[0]
			zhuohao = arguments[1]
		}
		if (!id || !zhuohao) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: 'ID和桌号不能为空'
			}
		}
		const db = uniCloud.database()
		const collection = db.collection('zhuohao')
		const currentRes = await collection.doc(id).get()
		if (currentRes.data.length === 0) {
			return {
				errCode: 'ZHUOHAO_NOT_FOUND',
				errMsg: '桌号不存在'
			}
		}
		const currentZhuohao = currentRes.data[0].zhuohao
		let updateData = { zhuohao: zhuohao }
		if (zhuoxing !== undefined) {
			updateData.zhuoxing = zhuoxing
		}
		if (renshu !== undefined) {
			updateData.renshu = renshu
		}
		if (status !== undefined) {
			updateData.status = status
		}
		if (zhuohao !== currentZhuohao) {
			const qrcodeRes = await generateQrcodeInner(zhuohao)
			if (qrcodeRes.errCode) {
				return qrcodeRes
			}
			updateData.qrcode = qrcodeRes.fileID
		}
		const updateRes = await collection.doc(id).update(updateData)
		return {
			errCode: 0,
			errMsg: '修改成功',
			data: {
				id: id,
				zhuohao: zhuohao,
				zhuoxing: updateData.zhuoxing || currentRes.data[0].zhuoxing,
				renshu: updateData.renshu || currentRes.data[0].renshu,
				qrcode: updateData.qrcode || currentRes.data[0].qrcode,
				status: updateData.status || currentRes.data[0].status
			}
		}
	},
	async createYuding(params) {
		if (!params || !params.zhuohao_id || !params.zhuohao) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '桌号信息不能为空'
			}
		}
		if (!params.yudingren || !params.lianxi) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '预定人和联系电话不能为空'
			}
		}
		if (!params.yuding_time) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '请选择到店时间'
			}
		}
		const db = uniCloud.database()
		const now = Date.now()
		const yudingTime = params.yuding_time
		const yudingStart = new Date(yudingTime)
		yudingStart.setHours(yudingStart.getHours() - 2)
		const yudingEnd = new Date(yudingTime)
		yudingEnd.setHours(yudingEnd.getHours() + 2)
		const conflictRes = await db.collection('yuding').where({
			zhuohao_id: params.zhuohao_id,
			status: db.command.in(['待审核', '已确认']),
			yuding_time: db.command.gte(yudingStart.getTime()).and(db.command.lte(yudingEnd.getTime()))
		}).get()
		if (conflictRes.data.length > 0) {
			return {
				errCode: 'YUDING_CONFLICT',
				errMsg: '该时段已有预定，存在冲突'
			}
		}
		const addRes = await db.collection('yuding').add({
			zhuohao_id: params.zhuohao_id,
			zhuohao: params.zhuohao,
			yudingren: params.yudingren,
			lianxi: params.lianxi,
			renshu: params.renshu || 4,
			yuding_time: yudingTime,
			beizhu: params.beizhu || '',
			status: '待审核'
		})
		return {
			errCode: 0,
			errMsg: '预定成功',
			data: {
				id: addRes.id
			}
		}
	},
	async confirmYuding(id) {
		if (!id) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: 'ID不能为空'
			}
		}
		const db = uniCloud.database()
		const yudingRes = await db.collection('yuding').doc(id).get()
		if (yudingRes.data.length === 0) {
			return {
				errCode: 'YUDING_NOT_FOUND',
				errMsg: '预定不存在'
			}
		}
		if (yudingRes.data[0].status !== '待审核') {
			return {
				errCode: 'YUDING_STATUS_ERROR',
				errMsg: '当前状态不允许审核'
			}
		}
		await db.collection('yuding').doc(id).update({
			status: '已确认'
		})
		await db.collection('zhuohao').doc(yudingRes.data[0].zhuohao_id).update({
			status: '已预定'
		})
		return {
			errCode: 0,
			errMsg: '审核通过'
		}
	},
	async cancelYuding(id) {
		if (!id) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: 'ID不能为空'
			}
		}
		const db = uniCloud.database()
		const yudingRes = await db.collection('yuding').doc(id).get()
		if (yudingRes.data.length === 0) {
			return {
				errCode: 'YUDING_NOT_FOUND',
				errMsg: '预定不存在'
			}
		}
		if (yudingRes.data[0].status !== '待审核' && yudingRes.data[0].status !== '已确认') {
			return {
				errCode: 'YUDING_STATUS_ERROR',
				errMsg: '当前状态不允许取消'
			}
		}
		await db.collection('yuding').doc(id).update({
			status: '已取消'
		})
		if (yudingRes.data[0].status === '已确认') {
			await db.collection('zhuohao').doc(yudingRes.data[0].zhuohao_id).update({
				status: '空桌'
			})
		}
		return {
			errCode: 0,
			errMsg: '已取消预定'
		}
	},
	async completeYuding(id) {
		if (!id) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: 'ID不能为空'
			}
		}
		const db = uniCloud.database()
		const yudingRes = await db.collection('yuding').doc(id).get()
		if (yudingRes.data.length === 0) {
			return {
				errCode: 'YUDING_NOT_FOUND',
				errMsg: '预定不存在'
			}
		}
		if (yudingRes.data[0].status !== '已确认') {
			return {
				errCode: 'YUDING_STATUS_ERROR',
				errMsg: '当前状态不允许完成'
			}
		}
		await db.collection('yuding').doc(id).update({
			status: '已完成'
		})
		await db.collection('zhuohao').doc(yudingRes.data[0].zhuohao_id).update({
			status: '空桌'
		})
		return {
			errCode: 0,
			errMsg: '已标记完成'
		}
	},
	async getAccessToken() {
		return getAccessTokenInner()
	},
	async generateQrcode(zhuohao) {
		return generateQrcodeInner(zhuohao)
	},
	async getZhuohaoList() {
		const db = uniCloud.database()
		const res = await db.collection('zhuohao').orderBy('create_time', 'desc').get()
		return {
			errCode: 0,
			errMsg: '获取成功',
			data: res.data
		}
	},
	async regenerateQrcode(id) {
		if (!id) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: 'ID不能为空'
			}
		}
		const db = uniCloud.database()
		const collection = db.collection('zhuohao')
		const currentRes = await collection.doc(id).get()
		if (currentRes.data.length === 0) {
			return {
				errCode: 'ZHUOHAO_NOT_FOUND',
				errMsg: '桌号不存在'
			}
		}
		const zhuohao = currentRes.data[0].zhuohao
		const qrcodeRes = await generateQrcodeInner(zhuohao)
		if (qrcodeRes.errCode) {
			return qrcodeRes
		}
		await collection.doc(id).update({
			qrcode: qrcodeRes.fileID
		})
		return {
			errCode: 0,
			errMsg: '二维码重新生成成功',
			data: {
				qrcode: qrcodeRes.fileID
			}
		}
	},
	async deleteZhuohao(id) {
		if (!id) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: 'ID不能为空'
			}
		}
		const db = uniCloud.database()
		const collection = db.collection('zhuohao')
		await collection.doc(id).remove()
		return {
			errCode: 0,
			errMsg: '删除成功'
		}
	}
}
