<script>
	export default {
		onLaunch: function(options) {
			console.log('App Launch', options)
			// 处理扫码进入
			if (options.scene) {
				this.handleScene(options.scene)
			}
		},
		onShow: function(options) {
			console.log('App Show', options)
			// 处理扫码进入（兼容从扫码直接打开）
			if (options.scene) {
				this.handleScene(options.scene)
			}
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			handleScene(scene) {
				try {
					const decodedScene = decodeURIComponent(scene)
					console.log('处理扫码参数:', decodedScene)
					// 存储到全局变量，首页onLoad时读取
					uni.setStorageSync('qrcode_scene', decodedScene)
				} catch (e) {
					console.error('解析扫码参数失败:', e)
				}
			}
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "./uni_modules/vk-uview-ui/index.scss";
	/*menu scss */
	@import '~@/static/styles/app.scss';
</style>
