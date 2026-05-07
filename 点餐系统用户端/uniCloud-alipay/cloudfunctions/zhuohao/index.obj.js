const uniID = require('uni-id-common')
const createConfig = require('uni-config-center')
module.exports = {
	_before: function () {

	},
	async createZhuohao(zhuohao) {
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
		const qrcodeRes = await this.generateQrcode(zhuohao)
		if (qrcodeRes.errCode) {
			return qrcodeRes
		}
		const addRes = await collection.add({
			zhuohao: zhuohao,
			qrcode: qrcodeRes.fileID
		})
		return {
			errCode: 0,
			errMsg: '创建成功',
			data: {
				id: addRes.id,
				zhuohao: zhuohao,
				qrcode: qrcodeRes.fileID
			}
		}
	},
	async getAccessToken() {
		const config = createConfig({
			pluginId: 'zhuohao'
		})
		const appid = config.config('mpWeixin.appid')
		const secret = config.config('mpWeixin.secret')
		if (!appid || !secret) {
			return {
				errCode: 'CONFIG_MISSING',
				errMsg: '请配置小程序appid和secret'
			}
		}
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
	},
	async generateQrcode(zhuohao) {
		try {
			const tokenRes = await this.getAccessToken()
			if (tokenRes.errCode) {
				return tokenRes
			}
			const result = await uniCloud.httpclient.request('https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + tokenRes.accessToken, {
				method: 'POST',
				contentType: 'json',
				dataType: 'buffer',
				data: {
					scene: 'zhuohao=' + zhuohao,
					page: 'pages/home/home',
					width: 430
				}
			})
			if (result.status === 200 && result.data) {
				const uploadRes = await uniCloud.uploadFile({
					cloudPath: 'qrcode/zhuohao_' + zhuohao + '_' + Date.now() + '.png',
					fileContent: result.data
				})
				return {
					errCode: 0,
					fileID: uploadRes.fileID
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
	async deleteZhuohao(id) {
		if (!id) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: 'ID不能为空'
			}
		}
		const db = uniCloud.database()
		const res = await db.collection('zhuohao').doc(id).remove()
		return {
			errCode: 0,
			errMsg: '删除成功'
		}
	}
}
