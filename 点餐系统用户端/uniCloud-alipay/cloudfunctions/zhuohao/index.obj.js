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
		let zhuohao, status = '空桌'
		if (typeof params === 'object') {
			zhuohao = params.zhuohao
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
			qrcode: qrcodeRes.fileID,
			status: status
		})
		return {
			errCode: 0,
			errMsg: '创建成功',
			data: {
				id: addRes.id,
				zhuohao: zhuohao,
				qrcode: qrcodeRes.fileID,
				status: status
			}
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
	async updateZhuohao(params) {
		let id, zhuohao, status
		if (typeof params === 'object') {
			id = params.id
			zhuohao = params.zhuohao
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
				qrcode: updateData.qrcode || currentRes.data[0].qrcode,
				status: status || currentRes.data[0].status
			}
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
