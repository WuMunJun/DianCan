<template>
  <view class="container">
    <view class="card">
      <text class="title">菜单修复工具</text>
      <text class="tip">点击按钮修复菜单循环引用问题</text>
      
      <button type="primary" @click="fixCircular" :disabled="loading">{{loading ? '处理中...' : '修复循环引用菜单'}}</button>
      <button type="warn" @click="deleteDuplicate" :disabled="loading" style="margin-top: 20rpx;">删除重复菜单</button>
      
      <view class="result" v-if="result">
        <text class="result-text">{{result}}</text>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        loading: false,
        result: ''
      }
    },
    methods: {
      fixCircular() {
        this.loading = true
        this.result = '正在调用云函数...'
        
        uniCloud.callFunction({
          name: 'fix-menu',
          data: {
            method: 'fixCircularMenu'
          },
          success: (res) => {
            this.loading = false
            this.result = JSON.stringify(res.result, null, 2)
            if (res.result && res.result.errCode === 0) {
              uni.showToast({ title: res.result.errMsg, icon: 'none', duration: 3000 })
            }
          },
          fail: (err) => {
            this.loading = false
            this.result = '调用失败: ' + JSON.stringify(err)
            uni.showToast({ title: '调用失败', icon: 'none' })
          }
        })
      },
      deleteDuplicate() {
        this.loading = true
        this.result = '正在调用云函数...'
        
        uniCloud.callFunction({
          name: 'fix-menu',
          data: {
            method: 'deleteDuplicateMenu'
          },
          success: (res) => {
            this.loading = false
            this.result = JSON.stringify(res.result, null, 2)
            if (res.result && res.result.errCode === 0) {
              uni.showToast({ title: res.result.errMsg, icon: 'none', duration: 3000 })
            }
          },
          fail: (err) => {
            this.loading = false
            this.result = '调用失败: ' + JSON.stringify(err)
            uni.showToast({ title: '调用失败', icon: 'none' })
          }
        })
      }
    }
  }
</script>

<style>
.container {
  padding: 40rpx;
}
.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 40rpx;
}
.title {
  font-size: 36rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 16rpx;
  text-align: center;
}
.tip {
  font-size: 24rpx;
  color: #999;
  display: block;
  margin-bottom: 40rpx;
  text-align: center;
}
.result {
  margin-top: 40rpx;
  padding: 20rpx;
  background: #f5f5f5;
  border-radius: 8rpx;
}
.result-text {
  font-size: 24rpx;
  color: #333;
  word-break: break-all;
}
</style>
