<template>
  <view class="container">
    <view class="filter-bar">
      <view class="filter-row">
        <uni-data-select v-model="filterType" :localdata="typeOptions" placeholder="全部类型" @change="onFilterChange" class="filter-select"></uni-data-select>
        <uni-data-select v-model="filterStatus" :localdata="statusFilterOptions" placeholder="全部状态" @change="onFilterChange" class="filter-select"></uni-data-select>
      </view>
      <view class="filter-row">
        <uni-easyinput prefixIcon="search" v-model="keyword" placeholder="搜索套餐名称" @confirm="search" @clear="search" class="filter-input"></uni-easyinput>
      </view>
    </view>
    <view class="list-wrap">
      <view v-for="(item, index) in dataList" :key="index" class="list-item" @click="handleItemClick(item._id)">
        <view class="item-left">
          <image v-if="item.imageUrl" :src="item.imageUrl" class="item-image" mode="aspectFill"></image>
          <view v-else class="item-image placeholder-img">
            <uni-icons type="gift" size="28" color="#ccc"></uni-icons>
          </view>
          <view class="item-info">
            <text class="item-name">{{item.name}}</text>
            <view class="item-type-tag">{{item.type}}</view>
            <view class="item-price-row">
              <text class="item-price">¥{{item.price}}</text>
              <text v-if="item.original_price" class="item-original-price">¥{{item.original_price}}</text>
            </view>
            <view class="item-meta">
              <text class="item-stock">{{item.stock === -1 ? '库存不限' : '库存:'+item.stock}}</text>
              <text class="item-count">{{(item.items || []).length}}款商品</text>
            </view>
          </view>
        </view>
        <view class="item-right">
          <view class="status-tag" :class="item.status === '上架' ? 'status-on' : 'status-off'" @click.stop="toggleStatus(item)">
            {{item.status}}
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
        filterType: null,
        filterStatus: null,
        typeOptions: [
          { value: '酒餐套餐', text: '酒餐套餐' },
          { value: '酒水套餐', text: '酒水套餐' },
          { value: '自定义套餐', text: '自定义套餐' }
        ],
        statusFilterOptions: [
          { value: '上架', text: '上架' },
          { value: '下架', text: '下架' }
        ],
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
          let where = {}
          if (this.keyword) {
            where.name = new RegExp(this.keyword)
          }
          if (this.filterType) {
            where.type = this.filterType
          }
          if (this.filterStatus) {
            where.status = this.filterStatus
          }
          let query = db.collection('taocan')
          if (Object.keys(where).length > 0) {
            query = query.where(where)
          }
          const res = await query.field('name,type,price,original_price,image,stock,status,sale_time_start,sale_time_end,sort,items')
            .orderBy('sort', 'asc')
            .orderBy('create_time', 'desc')
            .skip(skip)
            .limit(this.pagination.size)
            .get()
          const data = res.result.data || []
          if (data.length < this.pagination.size) {
            this.hasMore = false
          }
          const cloudFileIDs = data.filter(item => item.image && item.image.startsWith('cloud://')).map(item => item.image)
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
            if (item.image && urlMap[item.image]) {
              item.imageUrl = urlMap[item.image]
            } else if (item.image && !item.image.startsWith('cloud://')) {
              item.imageUrl = item.image
            } else {
              item.imageUrl = ''
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
      search() {
        this.loadData(true)
      },
      onFilterChange() {
        this.loadData(true)
      },
      handleItemClick(id) {
        uni.navigateTo({
          url: './detail?id=' + id,
          events: {
            refreshData: () => {
              this.loadData(true)
            }
          }
        })
      },
      async toggleStatus(item) {
        try {
          const taocanCo = uniCloud.importObject('taocan')
          const res = await taocanCo.toggleTaocanStatus(item._id)
          if (res.errCode === 0) {
            uni.showToast({ icon: 'none', title: res.errMsg })
            item.status = res.data.status
          } else {
            uni.showModal({ content: res.errMsg || '操作失败', showCancel: false })
          }
        } catch (err) {
          uni.showModal({ content: err.message || '请求服务失败', showCancel: false })
        }
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
  margin-bottom: 20rpx;
}
.filter-row {
  display: flex;
  gap: 16rpx;
  margin-bottom: 16rpx;
}
.filter-select {
  flex: 1;
}
.filter-input {
  flex: 1;
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
  overflow: hidden;
}
.item-image {
  width: 120rpx;
  height: 120rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
}
.placeholder-img {
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}
.item-info {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  overflow: hidden;
}
.item-name {
  font-size: 30rpx;
  color: #333;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item-type-tag {
  font-size: 20rpx;
  padding: 2rpx 12rpx;
  border-radius: 6rpx;
  background-color: #fff3e0;
  color: #ff9800;
  display: inline-block;
  width: fit-content;
}
.item-price-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.item-price {
  font-size: 30rpx;
  color: #e91e63;
  font-weight: bold;
}
.item-original-price {
  font-size: 22rpx;
  color: #ccc;
  text-decoration: line-through;
}
.item-meta {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.item-stock {
  font-size: 22rpx;
  color: #999;
}
.item-count {
  font-size: 22rpx;
  color: #409eff;
}
.item-right {
  display: flex;
  align-items: center;
  gap: 16rpx;
  flex-shrink: 0;
}
.status-tag {
  font-size: 22rpx;
  padding: 6rpx 16rpx;
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
