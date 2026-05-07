<template>
	<view class="wrap">
		<view class="wrap__image">
			<u-image src="/static/logo.jpg" width="150" height="150" border-radius="500"></u-image>
		</view>
		<view class="wrap__title">成为会员，立享更多优惠福利</view>
		<view class="wrap__desc">授权绑定账号 为您提供更好的服务</view>
		<view class="wrap__btn" @click="signup">一键登录</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/scss/login/login.scss';
</style>