<template>
  <view class="container">
    <view class="search-bar">
      <uni-easyinput prefixIcon="search" v-model="keyword" placeholder="搜索分类名称" @confirm="search" @clear="search"></uni-easyinput>
    </view>
    <view class="list-wrap">
      <view v-for="(item, index) in dataList" :key="index" class="list-item" @click="handleItemClick(item._id)">
        <view class="item-left">
          <view class="item-icon" v-if="item.icon">
            <uni-icons :type="item.icon" size="24" color="#409eff"></uni-icons>
          </view>
          <view class="item-icon placeholder-icon" v-else>
            <uni-icons type="list" size="24" color="#999"></uni-icons>
          </view>
          <view class="item-info">
            <text class="item-name">{{item.name}}</text>
            <text class="item-sort">排序：{{item.sort || 0}}</text>
          </view>
        </view>
        <view class="item-right">
          <view class="status-tag" :class="item.status ? 'status-on' : 'status-off'">
            {{item.status ? '启用' : '禁用'}}
          </view>
          <uni-icons type="forward" size="18" color="#ccc"></uni-icons>
        </view>
      </view>
      <uni-load-more :status="loading?'loading':(hasMore?'more':'noMore')"></uni-load-more>
    </view>
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
        keyword: '',
        pagination: {
          current: 0,
          size: 50
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
          let query = db.collection('shangpin_fenlei')
          if (this.keyword) {
            query = query.where({ name: new RegExp(this.keyword) })
          }
          const res = await query.field('name,icon,sort,status')
            .orderBy('sort', 'asc')
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
      search() {
        this.loadData(true)
      },
      handleItemClick(id) {
        uni.navigateTo({
          url: './edit?id=' + id,
          events: {
            refreshData: () => {
              this.loadData(true)
            }
          }
        })
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
.search-bar {
  margin-bottom: 20rpx;
}
.list-wrap {
  background-color: #fff;
  border-radius: 12rpx;
  overflow: hidden;
}
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 30rpx;
  border-bottom: 1rpx solid #f5f5f5;
}
.list-item:last-child {
  border-bottom: none;
}
.item-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
  flex: 1;
}
.item-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  background-color: #f0f7ff;
  display: flex;
  align-items: center;
  justify-content: center;
}
.placeholder-icon {
  background-color: #f5f5f5;
}
.item-info {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}
.item-name {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
}
.item-sort {
  font-size: 24rpx;
  color: #999;
}
.item-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.status-tag {
  font-size: 22rpx;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
}
.status-on {
  background-color: #e8f5e9;
  color: #4caf50;
}
.status-off {
  background-color: #fce4ec;
  color: #e91e63;
}
</style>
