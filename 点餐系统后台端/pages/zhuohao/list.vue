<template>
  <view class="container">
    <view class="table-list">
      <view v-for="(item, index) in dataList" :key="index" class="table-item" @click="handleItemClick(item._id)">
        <view class="table-info">
          <text class="table-name">桌号：{{item.zhuohao}}</text>
          <text class="table-status" :class="'status-' + item.status">{{getStatusText(item.status)}}</text>
        </view>
        <image v-if="item.qrcodeUrl" :src="item.qrcodeUrl" class="qrcode-img" mode="aspectFit"></image>
        <view class="arrow">></view>
      </view>
    </view>
    <uni-load-more :status="loading?'loading':(hasMore ? 'more' : 'noMore')"></uni-load-more>
    <uni-fab ref="fab" horizontal="right" vertical="bottom" :pop-menu="false" @fabClick="fabClick" />
  </view>
</template>

<script>
  const db = uniCloud.database()
  export default {
    data() {
      return {
        dataList: [],
        loading: false,
        hasMore: true,
        pagination: {
          current: 0,
          size: 20
        }
      }
    },
    onShow() {
      this.loadData(true)
    },
    onPullDownRefresh() {
      this.loadData(true, () => {
        uni.stopPullDownRefresh()
      })
    },
    onReachBottom() {
      if (this.hasMore && !this.loading) {
        this.loadData(false)
      }
    },
    methods: {
      async loadData(clear = false, callback) {
        if (this.loading) return
        this.loading = true
        if (clear) {
          this.pagination.current = 0
          this.dataList = []
          this.hasMore = true
        }
        try {
          const skip = this.pagination.current * this.pagination.size
          const res = await db.collection('zhuohao')
            .field('zhuohao,qrcode,status')
            .orderBy('create_time', 'desc')
            .skip(skip)
            .limit(this.pagination.size)
            .get()
          const data = res.result.data || []
          if (data.length < this.pagination.size) {
            this.hasMore = false
          }
          const cloudFileIDs = data.filter(item => item.qrcode && item.qrcode.startsWith('cloud://')).map(item => item.qrcode)
          let urlMap = {}
          if (cloudFileIDs.length > 0) {
            const urlRes = await uniCloud.getTempFileURL({ fileList: cloudFileIDs })
            if (urlRes.fileList) {
              urlRes.fileList.forEach(file => {
                urlMap[file.fileID] = file.tempFileURL
              })
            }
          }
          data.forEach(item => {
            if (item.qrcode && urlMap[item.qrcode]) {
              item.qrcodeUrl = urlMap[item.qrcode]
            } else if (item.qrcode && !item.qrcode.startsWith('cloud://')) {
              item.qrcodeUrl = item.qrcode
            } else {
              item.qrcodeUrl = ''
            }
          })
          if (clear) {
            this.dataList = data
          } else {
            this.dataList = this.dataList.concat(data)
          }
          this.pagination.current++
        } catch (e) {
          uni.showToast({ icon: 'none', title: '加载失败' })
        } finally {
          this.loading = false
          callback && callback()
        }
      },
      handleItemClick(id) {
        uni.navigateTo({
          url: './detail?id=' + id
        })
      },
      getStatusText(status) {
        const statusMap = {
          '空桌': '空桌',
          '已开台': '已开台',
          '已下单': '已下单',
          '已结账': '已结账'
        }
        return statusMap[status] || '空桌'
      },
      fabClick() {
        uni.navigateTo({
          url: './add',
          events: {
            refreshData: () => {
              this.loadData(true)
            }
          }
        })
      }
    }
  }
</script>

<style>
.container {
  padding: 20rpx;
}
.table-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.table-item {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}
.table-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}
.table-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}
.table-status {
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  display: inline-block;
  width: fit-content;
}
.status-空桌 {
  background-color: #e8f5e9;
  color: #4caf50;
}
.status-已开台 {
  background-color: #fff3e0;
  color: #ff9800;
}
.status-已下单 {
  background-color: #e3f2fd;
  color: #2196f3;
}
.status-已结账 {
  background-color: #fce4ec;
  color: #e91e63;
}
.qrcode-img {
  width: 120rpx;
  height: 120rpx;
  margin-left: 20rpx;
  border-radius: 10rpx;
}
.arrow {
  color: #999;
  font-size: 28rpx;
  margin-left: 20rpx;
}
</style>
