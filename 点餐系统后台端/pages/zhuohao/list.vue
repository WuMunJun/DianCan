<template>
  <view class="container">
    <view class="status-bar">
      <view class="status-dot" v-for="item in statusLegend" :key="item.label">
        <view class="dot" :style="{backgroundColor: item.color}"></view>
        <text class="dot-text">{{item.label}}</text>
      </view>
    </view>
    <view class="table-grid">
      <view v-for="(item, index) in dataList" :key="index" class="table-card" :class="'card-' + item.status" @click="handleItemClick(item._id)">
        <view class="card-header">
          <text class="card-zhuohao">{{item.zhuohao}}</text>
          <view class="card-status-tag" :style="{backgroundColor: getStatusColor(item.status), color: '#fff'}">
            {{getStatusText(item.status)}}
          </view>
        </view>
        <view class="card-body">
          <text class="card-info">{{item.zhuoxing || '中桌'}} · {{item.renshu || 4}}人</text>
        </view>
        <view class="card-footer">
          <image v-if="item.qrcodeUrl" :src="item.qrcodeUrl" class="card-qrcode" mode="aspectFit"></image>
          <view v-else class="card-qrcode-placeholder">
            <text class="placeholder-text">无二维码</text>
          </view>
        </view>
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
          size: 50
        },
        statusLegend: [
          { label: '空桌', color: '#4caf50' },
          { label: '已开台', color: '#ff9800' },
          { label: '已下单', color: '#2196f3' },
          { label: '已预定', color: '#9c27b0' },
          { label: '已结账', color: '#e91e63' }
        ]
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
            .field('zhuohao,zhuoxing,renshu,qrcode,status')
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
          '已结账': '已结账',
          '已预定': '已预定'
        }
        return statusMap[status] || '空桌'
      },
      getStatusColor(status) {
        const colorMap = {
          '空桌': '#4caf50',
          '已开台': '#ff9800',
          '已下单': '#2196f3',
          '已结账': '#e91e63',
          '已预定': '#9c27b0'
        }
        return colorMap[status] || '#4caf50'
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
.status-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}
.status-dot {
  display: flex;
  align-items: center;
  gap: 8rpx;
}
.dot {
  width: 20rpx;
  height: 20rpx;
  border-radius: 50%;
}
.dot-text {
  font-size: 24rpx;
  color: #666;
}
.table-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}
.table-card {
  width: calc(50% - 10rpx);
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.08);
  border-top: 6rpx solid #4caf50;
  box-sizing: border-box;
}
.card-空桌 { border-top-color: #4caf50; }
.card-已开台 { border-top-color: #ff9800; }
.card-已下单 { border-top-color: #2196f3; }
.card-已结账 { border-top-color: #e91e63; }
.card-已预定 { border-top-color: #9c27b0; }
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}
.card-zhuohao {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}
.card-status-tag {
  font-size: 20rpx;
  padding: 4rpx 14rpx;
  border-radius: 16rpx;
}
.card-body {
  margin-bottom: 16rpx;
}
.card-info {
  font-size: 24rpx;
  color: #999;
}
.card-footer {
  display: flex;
  justify-content: center;
}
.card-qrcode {
  width: 120rpx;
  height: 120rpx;
  border-radius: 8rpx;
}
.card-qrcode-placeholder {
  width: 120rpx;
  height: 120rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.placeholder-text {
  font-size: 20rpx;
  color: #ccc;
}
</style>
