<template>
	<view class="wrap">

		<view v-if="swiperList.length">
			<u-swiper :list="swiperList" height="600" border-radius="0" mode="none"></u-swiper>
		</view>

		<view class="wrap__userinfo" @click="handleLogin">
			<view class="wrap__userinfo__left">
				<view>
					<u-image src="/static/logo.jpg" width="60" height="60" border-radius="50%" lazy-load></u-image>
				</view>
				<view class="wrap__userinfo__left__nickname">
					尊敬的用户
				</view>
			</view>
			<view class="wrap__userinfo__right">
				<view>注册/登录</view>
			</view>
		</view>

		<view class="wrap__menu">
			<view class="wrap__menu__box" @click="handlePointSingle('takein')">
				<view>
					<u-image src="/static/img/home/icon-1.jpg" width="180" height="180" lazy-load></u-image>
				</view>
				<view class="wrap__menu__box__name">门店堂食</view>
				<view class="wrap__menu__box__desc">提前点免排队</view>
			</view>

			<view class="wrap__menu__group"></view>

			<view class="wrap__menu__box" @click="handlePointSingle('takeout')">
				<view>
					<u-image src="/static/img/home/icon-2.jpg" width="180" height="180" lazy-load></u-image>
				</view>
				<view class="wrap__menu__box__name">外卖配送</view>
				<view class="wrap__menu__box__desc">外卖及时送达</view>
			</view>
		</view>

		<view class="wrap__pointsmall" @click="handleMyPromotion">
			<view>
				<u-image src="/static/img/home/promotion.png" width="180" height="180" lazy-load></u-image>
			</view>
			<view>
				<view class="wrap__pointsmall__mypoint">我的推广</view>
				<view class="wrap__pointsmall__pointdesc">
					推广奖励实时到账，支持余额提现
					<u-icon name="arrow-right" size="24"></u-icon>
				</view>
			</view>
		</view>

		<u-popup v-model="showZhuohaoPopup" mode="center" border-radius="20">
			<view class="zhuohao-popup">
				<view class="zhuohao-popup__title">欢迎光临</view>
				<view class="zhuohao-popup__zhuohao">桌号：{{ currentZhuohao }}</view>
				<view class="zhuohao-popup__label">请选择用餐人数</view>
				<view class="zhuohao-popup__people">
					<view 
						v-for="n in 10" 
						:key="n" 
						class="zhuohao-popup__people__item"
						:class="{ active: selectedPeople === n }"
						@click="selectedPeople = n"
					>
						{{ n }}人
					</view>
				</view>
				<view class="zhuohao-popup__btn" @click="confirmZhuohao">确认</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	const ORDER_TYPE = {
		TAKE_IN: 'takein',
		TAKE_OUT: 'takeout'
	};

	export default {
		data() {
			return {
				userinfo: {},
				swiperList: [{
					image: '/static/img/home/banner.jpg'
				}],
				showZhuohaoPopup: false,
				currentZhuohao: '',
				selectedPeople: 1
			}
		},
		onLoad(options) {
			if (options.scene) {
				const scene = decodeURIComponent(options.scene)
				const params = this.parseScene(scene)
				if (params.zhuohao) {
					this.currentZhuohao = params.zhuohao
					this.showZhuohaoPopup = true
				}
			}
		},
		methods: {
			parseScene(scene) {
				const params = {}
				const pairs = scene.split('&')
				pairs.forEach(pair => {
					const [key, value] = pair.split('=')
					if (key && value) {
						params[key] = value
					}
				})
				return params
			},
			confirmZhuohao() {
				this.$store.commit('SET_ZHUOHAO', this.currentZhuohao)
				this.$store.commit('SET_PEOPLE_COUNT', this.selectedPeople)
				this.showZhuohaoPopup = false
				this.$store.commit('SET_ORDER_TYPE', 'takein')
				uni.navigateTo({
					url: `/subpackageHome/pointSingle/point-single`
				})
			},
			handleLogin() {
				uni.navigateTo({
					url: `/pages/login/login`
				});
			},
			handlePointSingle(type) {
				this.$store.commit('SET_ORDER_TYPE', type);
				uni.navigateTo({
					url: `/subpackageHome/pointSingle/point-single`
				});
			},
			handleMyPromotion() {
				uni.navigateTo({
					url: `/subpackageHome/pointsMall/points-mall`
				});
			}
		}
	}
</script>

<style lang="scss">
	@import '@/common/scss/home/home.scss';
	
	.zhuohao-popup {
		width: 600rpx;
		padding: 40rpx;
		background: #fff;
		
		&__title {
			font-size: 36rpx;
			font-weight: bold;
			text-align: center;
			margin-bottom: 30rpx;
		}
		
		&__zhuohao {
			font-size: 32rpx;
			text-align: center;
			margin-bottom: 40rpx;
			color: #ff9900;
		}
		
		&__label {
			font-size: 28rpx;
			margin-bottom: 20rpx;
		}
		
		&__people {
			display: flex;
			flex-wrap: wrap;
			gap: 20rpx;
			margin-bottom: 40rpx;
			
			&__item {
				width: 100rpx;
				height: 70rpx;
				line-height: 70rpx;
				text-align: center;
				border: 2rpx solid #ddd;
				border-radius: 10rpx;
				font-size: 26rpx;
				
				&.active {
					border-color: #ff9900;
					background: #fff5e6;
					color: #ff9900;
				}
			}
		}
		
		&__btn {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			background: #ff9900;
			color: #fff;
			border-radius: 40rpx;
			font-size: 32rpx;
		}
	}
</style>