<template>
  <view class="container">
    <view class="filter-bar">
      <view class="filter-item" v-for="item in filterOptions" :key="item.value" :class="{'filter-active': currentFilter === item.value}" @click="setFilter(item.value)">
        <text>{{item.text}}</text>
      </view>
    </view>
    <view class="yuding-list">
      <view v-for="(item, index) in dataList" :key="index" class="yuding-item" @click="handleItemClick(item._id)">
        <view class="yuding-header">
          <text class="yuding-zhuohao">{{item.zhuohao}}号桌</text>
          <view class="yuding-status" :class="'ys-' + item.status">{{getStatusText(item.status)}}</view>
        </view>
        <view class="yuding-body">
          <view class="yuding-row">
            <text class="row-label">预定人：</text>
            <text class="row-value">{{item.yudingren}}</text>
          </view>
          <view class="yuding-row">
            <text class="row-label">联系电话：</text>
            <text class="row-value">{{item.lianxi}}</text>
          </view>
          <view class="yuding-row">
            <text class="row-label">预定人数：</text>
            <text class="row-value">{{item.renshu}}人</text>
          </view>
          <view class="yuding-row">
            <text class="row-label">到店时间：</text>
            <text class="row-value">{{formatTime(item.yuding_time)}}</text>
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
        currentFilter: '全部',
        pagination: {
          current: 0,
          size: 20
        },
        filterOptions: [
          { text: '全部', value: '全部' },
          { text: '待审核', value: '待审核' },
          { text: '已确认', value: '已确认' },
          { text: '已取消', value: '已取消' }
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
      setFilter(value) {
        this.currentFilter = value
        this.loadData(true)
      },
      async loadData(clear = false, callback) {
        if (this.loading) return
        this.loading = true
        if (clear) {
          this.pagination.current = 0
          this.dataList = []
          this.hasMore = true
        }
        try {
          let query = db.collection('yuding')
          if (this.currentFilter !== '全部') {
            query = query.where({ status: this.currentFilter })
          }
          const skip = this.pagination.current * this.pagination.size
          const res = await query
            .field('zhuohao_id,zhuohao,yudingren,lianxi,renshu,yuding_time,status,beizhu')
            .orderBy('create_time', 'desc')
            .skip(skip)
            .limit(this.pagination.size)
            .get()
          const data = res.result.data || []
          if (data.length < this.pagination.size) {
            this.hasMore = false
          }
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
          '待审核': '待审核',
          '已确认': '已确认',
          '已取消': '已取消',
          '已完成': '已完成'
        }
        return statusMap[status] || '待审核'
      },
      formatTime(timestamp) {
        if (!timestamp) return ''
        const date = new Date(timestamp)
        const y = date.getFullYear()
        const m = String(date.getMonth() + 1).padStart(2, '0')
        const d = String(date.getDate()).padStart(2, '0')
        const h = String(date.getHours()).padStart(2, '0')
        const min = String(date.getMinutes()).padStart(2, '0')
        return y + '-' + m + '-' + d + ' ' + h + ':' + min
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
.filter-bar {
  display: flex;
  gap: 16rpx;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.06);
}
.filter-item {
  padding: 10rpx 24rpx;
  border-radius: 20rpx;
  background-color: #f5f5f5;
  font-size: 24rpx;
  color: #666;
}
.filter-active {
  background-color: #4caf50;
  color: #fff;
}
.yuding-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}
.yuding-item {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.08);
}
.yuding-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
  padding-bottom: 16rpx;
  border-bottom: 1px solid #f0f0f0;
}
.yuding-zhuohao {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}
.yuding-status {
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 20rpx;
  color: #fff;
}
.ys-待审核 { background-color: #ff9800; }
.ys-已确认 { background-color: #4caf50; }
.ys-已取消 { background-color: #999; }
.ys-已完成 { background-color: #2196f3; }
.yuding-body {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.yuding-row {
  display: flex;
  align-items: center;
}
.row-label {
  font-size: 24rpx;
  color: #999;
  width: 140rpx;
}
.row-value {
  font-size: 24rpx;
  color: #333;
}
</style>
