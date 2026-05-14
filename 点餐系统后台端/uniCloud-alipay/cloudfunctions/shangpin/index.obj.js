module.exports = {
	_before: function () {
	},
	async createFenlei(params) {
		if (!params || !params.name) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '分类名称不能为空'
			}
		}
		const db = uniCloud.database()
		const collection = db.collection('shangpin_fenlei')
		const existRes = await collection.where({ name: params.name }).get()
		if (existRes.data.length > 0) {
			return {
				errCode: 'FENLEI_EXISTS',
				errMsg: '分类名称已存在'
			}
		}
		const addRes = await collection.add({
			name: params.name,
			icon: params.icon || '',
			sort: params.sort !== undefined ? parseInt(params.sort) : 0,
			status: params.status !== undefined ? params.status : true
		})
		return {
			errCode: 0,
			errMsg: '创建成功',
			data: { id: addRes.id }
		}
	},
	async updateFenlei(params) {
		if (!params || !params.id) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: 'ID不能为空'
			}
		}
		const db = uniCloud.database()
		const collection = db.collection('shangpin_fenlei')
		const currentRes = await collection.doc(params.id).get()
		if (currentRes.data.length === 0) {
			return {
				errCode: 'FENLEI_NOT_FOUND',
				errMsg: '分类不存在'
			}
		}
		if (params.name) {
			const existRes = await collection.where({
				name: params.name,
				_id: db.command.neq(params.id)
			}).get()
			if (existRes.data.length > 0) {
				return {
					errCode: 'FENLEI_EXISTS',
					errMsg: '分类名称已存在'
				}
			}
		}
		let updateData = {}
		if (params.name !== undefined) updateData.name = params.name
		if (params.icon !== undefined) updateData.icon = params.icon
		if (params.sort !== undefined) updateData.sort = parseInt(params.sort)
		if (params.status !== undefined) updateData.status = params.status
		await collection.doc(params.id).update(updateData)
		if (params.name && params.name !== currentRes.data[0].name) {
			await db.collection('shangpin').where({ fenlei_id: params.id }).update({ fenlei_name: params.name })
		}
		return {
			errCode: 0,
			errMsg: '修改成功'
		}
	},
	async deleteFenlei(id) {
		if (!id) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: 'ID不能为空'
			}
		}
		const db = uniCloud.database()
		const collection = db.collection('shangpin_fenlei')
		const shangpinRes = await db.collection('shangpin').where({ fenlei_id: id }).count()
		if (shangpinRes.total > 0) {
			return {
				errCode: 'FENLEI_HAS_SHANGPIN',
				errMsg: '该分类下存在商品，无法删除'
			}
		}
		await collection.doc(id).remove()
		return {
			errCode: 0,
			errMsg: '删除成功'
		}
	},
	async getFenleiList() {
		const db = uniCloud.database()
		const res = await db.collection('shangpin_fenlei').orderBy('sort', 'asc').get()
		return {
			errCode: 0,
			errMsg: '获取成功',
			data: res.data
		}
	},
	async createShangpin(params) {
		if (!params || !params.name) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '商品名称不能为空'
			}
		}
		if (!params.fenlei_id) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '请选择商品分类'
			}
		}
		if (params.price === undefined || params.price === null) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '请设置商品价格'
			}
		}
		const db = uniCloud.database()
		const fenleiRes = await db.collection('shangpin_fenlei').doc(params.fenlei_id).get()
		if (fenleiRes.data.length === 0) {
			return {
				errCode: 'FENLEI_NOT_FOUND',
				errMsg: '商品分类不存在'
			}
		}
		const addRes = await db.collection('shangpin').add({
			name: params.name,
			fenlei_id: params.fenlei_id,
			fenlei_name: fenleiRes.data[0].name,
			price: parseFloat(params.price),
			original_price: params.original_price !== undefined ? parseFloat(params.original_price) : undefined,
			image: params.image || '',
			description: params.description || '',
			unit: params.unit || '份',
			stock: params.stock !== undefined ? parseInt(params.stock) : -1,
			sale_count: 0,
			status: params.status || '上架',
			sale_time_start: params.sale_time_start || '',
			sale_time_end: params.sale_time_end || '',
			sort: params.sort !== undefined ? parseInt(params.sort) : 0,
			tags: params.tags || []
		})
		return {
			errCode: 0,
			errMsg: '创建成功',
			data: { id: addRes.id }
		}
	},
	async updateShangpin(params) {
		if (!params || !params.id) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: 'ID不能为空'
			}
		}
		const db = uniCloud.database()
		const collection = db.collection('shangpin')
		const currentRes = await collection.doc(params.id).get()
		if (currentRes.data.length === 0) {
			return {
				errCode: 'SHANGPIN_NOT_FOUND',
				errMsg: '商品不存在'
			}
		}
		let updateData = {}
		if (params.name !== undefined) updateData.name = params.name
		if (params.fenlei_id !== undefined) {
			updateData.fenlei_id = params.fenlei_id
			const fenleiRes = await db.collection('shangpin_fenlei').doc(params.fenlei_id).get()
			if (fenleiRes.data.length > 0) {
				updateData.fenlei_name = fenleiRes.data[0].name
			}
		}
		if (params.price !== undefined) updateData.price = parseFloat(params.price)
		if (params.original_price !== undefined) updateData.original_price = parseFloat(params.original_price)
		if (params.image !== undefined) updateData.image = params.image
		if (params.description !== undefined) updateData.description = params.description
		if (params.unit !== undefined) updateData.unit = params.unit
		if (params.stock !== undefined) updateData.stock = parseInt(params.stock)
		if (params.status !== undefined) updateData.status = params.status
		if (params.sale_time_start !== undefined) updateData.sale_time_start = params.sale_time_start
		if (params.sale_time_end !== undefined) updateData.sale_time_end = params.sale_time_end
		if (params.sort !== undefined) updateData.sort = parseInt(params.sort)
		if (params.tags !== undefined) updateData.tags = params.tags
		await collection.doc(params.id).update(updateData)
		return {
			errCode: 0,
			errMsg: '修改成功'
		}
	},
	async deleteShangpin(id) {
		if (!id) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: 'ID不能为空'
			}
		}
		const db = uniCloud.database()
		await db.collection('shangpin').doc(id).remove()
		return {
			errCode: 0,
			errMsg: '删除成功'
		}
	},
	async toggleShangpinStatus(id) {
		if (!id) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: 'ID不能为空'
			}
		}
		const db = uniCloud.database()
		const collection = db.collection('shangpin')
		const currentRes = await collection.doc(id).get()
		if (currentRes.data.length === 0) {
			return {
				errCode: 'SHANGPIN_NOT_FOUND',
				errMsg: '商品不存在'
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
	async getShangpinList(params) {
		const db = uniCloud.database()
		let query = db.collection('shangpin')
		const where = {}
		if (params && params.fenlei_id) {
			where.fenlei_id = params.fenlei_id
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
	async getShangpinById(id) {
		if (!id) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: 'ID不能为空'
			}
		}
		const db = uniCloud.database()
		const res = await db.collection('shangpin').doc(id).get()
		if (res.data.length === 0) {
			return {
				errCode: 'SHANGPIN_NOT_FOUND',
				errMsg: '商品不存在'
			}
		}
		return {
			errCode: 0,
			errMsg: '获取成功',
			data: res.data[0]
		}
	}
}
