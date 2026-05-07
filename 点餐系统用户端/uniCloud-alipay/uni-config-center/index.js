'use strict'
const createConfig = require('uni-config-center')
const uniIdConfig = createConfig({
	pluginId: 'uni-id'
})
const zhuohaoConfig = createConfig({
	pluginId: 'zhuohao'
})
module.exports = {
	uniIdConfig,
	zhuohaoConfig
}
