<template>
	<view class="wrap">
		<!-- 自定义导航栏 -->
		<u-navbar :background="background" :border-bottom="false" :is-back="false"></u-navbar>

		<!-- 用户信息 -->
		<view class="wrap__userinfo">
			<view class="wrap__userinfo__login" @click="handleUserInfo">
				<view>尊敬的顾客，</view>
				<view>QXS_4vjsk4f</view>
			</view>

			<view @click="handleUserInfo">
				<u-avatar src="/static/logo.jpg" size="77"></u-avatar>
			</view>
		</view>

		<view class="wrap__myasset">
			<view class="wrap__myasset__points" @click="handleMyBalance">
				<view>余额</view>
				<view>
					<text>0</text>
					<text>元</text>
				</view>
			</view>
			<view class="wrap__myasset__group"></view>
			<view class="wrap__myasset__coupon" @click="handleMyCoupon">
				<view>优惠券</view>
				<view>
					<text>0</text>
					<text>元</text>
				</view>
			</view>
		</view>

		<view class="wrap__cell">
			<u-cell-group :border="false">
				<u-cell-item title="骑手中心" hover-class="none" :title-style="titleStyle" :border-bottom="false"
					@click="handleRiderCenter"></u-cell-item>
				<u-cell-item title="收货地址" hover-class="none" :title-style="titleStyle" :border-bottom="false"
					@click="handleAddress"></u-cell-item>
				<u-cell-item title="问题反馈" hover-class="none" :title-style="titleStyle" :border-bottom="false">
				</u-cell-item>
				<u-cell-item title="我的客服" hover-class="none" :title-style="titleStyle" :border-bottom="false">
				</u-cell-item>
				<u-cell-item title="我的推广" hover-class="none" :title-style="titleStyle" :border-bottom="false"
					@click="handlePromotion"></u-cell-item>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	// 定义订单状态常量，方便维护
	const ORDER_STATUS = {
		ALL: 0,
		UNPAID: 1,
		UNSHIPPED: 2,
		UNRECEIVED: 3,
		REFUND: 4
	};

	export default {
		data() {
			return {
				background: {
					backgroundColor: '#F5F5F5'
				},
				titleStyle: {
					fontSize: '29rpx',
					color: '#333333'
				}
			}
		},
		methods: {
			handleAddress() {
				uni.navigateTo({
					url: `/subpackageMy/myAddress/address-manage?methods=my`
				});
			},

			handleUserInfo() {
				uni.navigateTo({
					url: `/subpackageMy/infoSet/set`
				});
			},

			handleMyBalance() {
				uni.navigateTo({
					url: `/subpackageMy/myBalance/balance-topup`
				});
			},

			handleMyCoupon() {
				uni.navigateTo({
					url: `/subpackageMy/myCoupon/coupon-topup`
				});
			},

			handlePromotion() {
				uni.navigateTo({
					url: `/subpackageHome/pointsMall/points-mall`
				});
			},

			handleRiderCenter() {
				uni.navigateTo({
					url: `/subpackageMy/riderCenter/rider-center`
				});
			},

			handleMyOrder(status) {
				uni.navigateTo({
					url: `/subpackageMy/myOrder/my-order?status=${status}`
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/scss/my/my.scss';
</style>