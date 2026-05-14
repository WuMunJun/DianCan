module.exports = {
	_before: function () {
	},
	async createTaocan(params) {
		if (!params || !params.name) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '套餐名称不能为空'
			}
		}
		if (params.price === undefined || params.price === null) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '请设置套餐价格'
			}
		}
		const db = uniCloud.database()
		const items = (params.items || []).map(item => ({
			shangpin_id: item.shangpin_id || '',
			shangpin_name: item.shangpin_name || '',
			quantity: parseInt(item.quantity) || 1,
			price: parseFloat(item.price) || 0
		}))
		const addRes = await db.collection('taocan').add({
			name: params.name,
			type: params.type || '自定义套餐',
			price: parseFloat(params.price),
			original_price: params.original_price !== undefined ? parseFloat(params.original_price) : undefined,
			image: params.image || '',
			description: params.description || '',
			items: items,
			stock: params.stock !== undefined ? parseInt(params.stock) : -1,
			sale_count: 0,
			status: params.status || '上架',
			sale_time_start: params.sale_time_start || '',
			sale_time_end: params.sale_time_end || '',
			sort: params.sort !== undefined ? parseInt(params.sort) : 0
		})
		return {
			errCode: 0,
			errMsg: '创建成功',
			data: { id: addRes.id }
		}
	},
	async updateTaocan(params) {
		if (!params || !params.id) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: 'ID不能为空'
			}
		}
		const db = uniCloud.database()
		const collection = db.collection('taocan')
		const currentRes = await collection.doc(params.id).get()
		if (currentRes.data.length === 0) {
			return {
				errCode: 'TAOCAN_NOT_FOUND',
				errMsg: '套餐不存在'
			}
		}
		let updateData = {}
		if (params.name !== undefined) updateData.name = params.name
		if (params.type !== undefined) updateData.type = params.type
		if (params.price !== undefined) updateData.price = parseFloat(params.price)
		if (params.original_price !== undefined) updateData.original_price = parseFloat(params.original_price)
		if (params.image !== undefined) updateData.image = params.image
		if (params.description !== undefined) updateData.description = params.description
		if (params.items !== undefined) {
			updateData.items = params.items.map(item => ({
				shangpin_id: item.shangpin_id || '',
				shangpin_name: item.shangpin_name || '',
				quantity: parseInt(item.quantity) || 1,
				price: parseFloat(item.price) || 0
			}))
		}
		if (params.stock !== undefined) updateData.stock = parseInt(params.stock)
		if (params.status !== undefined) updateData.status = params.status
		if (params.sale_time_start !== undefined) updateData.sale_time_start = params.sale_time_start
		if (params.sale_time_end !== undefined) updateData.sale_time_end = params.sale_time_end
		if (params.sort !== undefined) updateData.sort = parseInt(params.sort)
		await collection.doc(params.id).update(updateData)
		return {
			errCode: 0,
			errMsg: '修改成功'
		}
	},
	async deleteTaocan(id) {
		if (!id) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: 'ID不能为空'
			}
		}
		const db = uniCloud.database()
		await db.collection('taocan').doc(id).remove()
		return {
			errCode: 0,
			errMsg: '删除成功'
		}
	},
	async toggleTaocanStatus(id) {
		if (!id) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: 'ID不能为空'
			}
		}
		const db = uniCloud.database()
		const collection = db.collection('taocan')
		const currentRes = await collection.doc(id).get()
		if (currentRes.data.length === 0) {
			return {
				errCode: 'TAOCAN_NOT_FOUND',
				errMsg: '套餐不存在'
			}
		}
		const newStatus = currentRes.data[0].status === '上架' ? '下架' : '上架'
		await collection.doc(id).update({ status: newStatus })
		return {
			errCode: 0,
			errMsg: newStatus === '上架' ? '已上架' : '已下架',
			data: { status: newStatus }
		}
	},
	async getTaocanList(params) {
		const db = uniCloud.database()
		let query = db.collection('taocan')
		const where = {}
		if (params && params.type) {
			where.type = params.type
		}
		if (params && params.status) {
			where.status = params.status
		}
		if (params && params.keyword) {
			where.name = new RegExp(params.keyword)
		}
		if (Object.keys(where).length > 0) {
			query = query.where(where)
		}
		const res = await query.orderBy('sort', 'asc').orderBy('create_time', 'desc').get()
		return {
			errCode: 0,
			errMsg: '获取成功',
			data: res.data
		}
	},
	async getTaocanById(id) {
		if (!id) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: 'ID不能为空'
			}
		}
		const db = uniCloud.database()
		const res = await db.collection('taocan').doc(id).get()
		if (res.data.length === 0) {
			return {
				errCode: 'TAOCAN_NOT_FOUND',
				errMsg: '套餐不存在'
			}
		}
		return {
			errCode: 0,
			errMsg: '获取成功',
			data: res.data[0]
		}
	}
}
