'use strict';
const db = uniCloud.database()
const collection = db.collection('opendb-admin-menus')

exports.main = async (event, context) => {
	const method = event.method
	
	if (method === 'fixCircularMenu') {
		return await fixCircularMenu()
	} else if (method === 'deleteDuplicateMenu') {
		return await deleteDuplicateMenu()
	}
	
	return { errCode: -1, errMsg: '未知方法' }
}

async function fixCircularMenu() {
	const allMenusRes = await collection.limit(1000).get()
	const allMenus = allMenusRes.data
	
	const menuMap = {}
	allMenus.forEach(menu => {
		menuMap[menu.menu_id] = menu
	})
	
	const circularMenus = []
	
	for (const menu of allMenus) {
		if (!menu.parent_id) continue
		
		let current = menu
		let visited = new Set()
		let isCircular = false
		
		while (current) {
			if (visited.has(current.menu_id)) {
				isCircular = true
				break
			}
			visited.add(current.menu_id)
			
			if (!current.parent_id) break
			
			current = menuMap[current.parent_id]
		}
		
		if (isCircular) {
			circularMenus.push(menu)
		}
	}
	
	const fixedIds = []
	for (const menu of circularMenus) {
		await collection.doc(menu._id).update({
			parent_id: ''
		})
		fixedIds.push(menu.menu_id)
	}
	
	return {
		errCode: 0,
		errMsg: fixedIds.length > 0 ? '已修复' + fixedIds.length + '个循环引用菜单' : '未发现循环引用菜单',
		data: {
			totalMenus: allMenus.length,
			circularCount: circularMenus.length,
			fixedIds: fixedIds
		}
	}
}

async function deleteDuplicateMenu() {
	const allMenusRes = await collection.limit(1000).get()
	const allMenus = allMenusRes.data
	
	const nameMap = {}
	allMenus.forEach(menu => {
		const name = menu.name
		if (!nameMap[name]) {
			nameMap[name] = []
		}
		nameMap[name].push(menu)
	})
	
	const deletedIds = []
	
	for (const name in nameMap) {
		const items = nameMap[name]
		if (items.length > 1) {
			for (let i = 1; i < items.length; i++) {
				const hasChildren = allMenus.some(m => m.parent_id === items[i].menu_id)
				if (!hasChildren) {
					try {
						await collection.doc(items[i]._id).remove()
						deletedIds.push(items[i].menu_id)
					} catch (e) {}
				}
			}
		}
	}
	
	return {
		errCode: 0,
		errMsg: deletedIds.length > 0 ? '已删除' + deletedIds.length + '个重复菜单' : '未发现重复菜单',
		data: {
			deletedCount: deletedIds.length,
			deletedIds: deletedIds
		}
	}
}
