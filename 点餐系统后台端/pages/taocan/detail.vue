<template>
  <view class="uni-container">
    <view class="detail-card">
      <view class="detail-image-wrap" v-if="imageUrl">
        <image :src="imageUrl" class="detail-image" mode="aspectFill"></image>
      </view>
      <view class="detail-item">
        <text class="detail-label">套餐名称</text>
        <text class="detail-value">{{detailData.name}}</text>
      </view>
      <view class="detail-item">
        <text class="detail-label">套餐类型</text>
        <view class="type-tag">{{detailData.type}}</view>
      </view>
      <view class="detail-item">
        <text class="detail-label">套餐价格</text>
        <text class="detail-price">¥{{detailData.price}}</text>
      </view>
      <view class="detail-item" v-if="detailData.original_price">
        <text class="detail-label">套餐原价</text>
        <text class="detail-original-price">¥{{detailData.original_price}}</text>
      </view>
      <view class="detail-item">
        <text class="detail-label">库存</text>
        <text class="detail-value">{{detailData.stock === -1 ? '不限' : detailData.stock}}</text>
      </view>
      <view class="detail-item">
        <text class="detail-label">已售</text>
        <text class="detail-value">{{detailData.sale_count || 0}}</text>
      </view>
      <view class="detail-item">
        <text class="detail-label">状态</text>
        <view class="status-tag" :class="detailData.status === '上架' ? 'status-on' : 'status-off'">
          {{detailData.status}}
        </view>
      </view>
      <view class="detail-item" v-if="detailData.sale_time_start">
        <text class="detail-label">售卖时段</text>
        <text class="detail-value">{{detailData.sale_time_start}} - {{detailData.sale_time_end}}</text>
      </view>
      <view class="detail-item" v-if="detailData.description">
        <text class="detail-label">描述</text>
        <text class="detail-value desc-value">{{detailData.description}}</text>
      </view>
    </view>

    <view class="section-title">套餐内容</view>
    <view class="items-card">
      <view v-for="(item, index) in detailData.items" :key="index" class="content-item">
        <view class="content-left">
          <text class="content-name">{{item.shangpin_name || '未知商品'}}</text>
          <text class="content-price">¥{{item.price}} × {{item.quantity}}</text>
        </view>
        <text class="content-subtotal">¥{{(item.price * item.quantity).toFixed(2)}}</text>
      </view>
      <view v-if="detailData.items && detailData.items.length > 0" class="items-total">
        <text class="total-label">商品总价</text>
        <text class="total-value">¥{{itemsTotal}}</text>
      </view>
      <view v-if="!detailData.items || detailData.items.length === 0" class="empty-tip">
        <text>暂无套餐内容</text>
      </view>
    </view>

    <view class="btns">
      <button type="primary" @click="handleUpdate">修改</button>
      <button type="default" @click="handleToggleStatus">{{detailData.status === '上架' ? '下架' : '上架'}}</button>
      <button type="warn" class="btn-delete" @click="handleDelete">删除</button>
    </view>
  </view>
</template>

<script>
  const db = uniCloud.database()

  export default {
    data() {
      return {
        formDataId: '',
        detailData: {
          name: '',
          type: '自定义套餐',
          price: 0,
          original_price: 0,
          stock: -1,
          sale_count: 0,
          status: '上架',
          sale_time_start: '',
          sale_time_end: '',
          description: '',
          image: '',
          items: []
        },
        imageUrl: ''
      }
    },
    computed: {
      itemsTotal() {
        if (!this.detailData.items) return '0.00'
        return this.detailData.items.reduce((sum, item) => {
          return sum + (item.price || 0) * (item.quantity || 1)
        }, 0).toFixed(2)
      }
    },
    onLoad(e) {
      if (e.id) {
        this.formDataId = e.id
        this.getDetail(e.id)
      }
    },
    methods: {
      async getDetail(id) {
        uni.showLoading({ mask: true })
        try {
          const res = await db.collection('taocan').doc(id).field('name,type,price,original_price,image,description,stock,sale_count,status,sale_time_start,sale_time_end,sort,items').get()
          const data = res.result.data[0]
          if (data) {
            this.detailData = {
              name: data.name || '',
              type: data.type || '自定义套餐',
              price: data.price || 0,
              original_price: data.original_price,
              stock: data.stock !== undefined ? data.stock : -1,
              sale_count: data.sale_count || 0,
              status: data.status || '上架',
              sale_time_start: data.sale_time_start || '',
              sale_time_end: data.sale_time_end || '',
              description: data.description || '',
              image: data.image || '',
              items: data.items || []
            }
            if (data.image) {
              if (data.image.startsWith('cloud://')) {
                try {
                  const urlRes = await uniCloud.getTempFileURL({ fileList: [data.image] })
                  if (urlRes.fileList && urlRes.fileList.length > 0) {
                    this.imageUrl = urlRes.fileList[0].tempFileURL
                  }
                } catch (e) {}
              } else {
                this.imageUrl = data.image
              }
            }
          }
        } catch (err) {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        } finally {
          uni.hideLoading()
        }
      },
      handleUpdate() {
        uni.navigateTo({
          url: './edit?id=' + this.formDataId,
          events: {
            refreshData: () => {
              this.getDetail(this.formDataId)
            }
          }
        })
      },
      async handleToggleStatus() {
        try {
          const taocanCo = uniCloud.importObject('taocan')
          const res = await taocanCo.toggleTaocanStatus(this.formDataId)
          if (res.errCode === 0) {
            uni.showToast({ icon: 'none', title: res.errMsg })
            this.detailData.status = res.data.status
          } else {
            uni.showModal({ content: res.errMsg || '操作失败', showCancel: false })
          }
        } catch (err) {
          uni.showModal({ content: err.message || '请求服务失败', showCancel: false })
        }
      },
      handleDelete() {
        uni.showModal({
          title: '确认删除',
          content: '确定要删除该套餐吗？',
          success: (res) => {
            if (res.confirm) {
              uni.showLoading({ mask: true })
              db.collection('taocan').doc(this.formDataId).remove().then(() => {
                uni.showToast({ icon: 'none', title: '删除成功' })
                setTimeout(() => {
                  uni.navigateBack()
                }, 500)
              }).catch((err) => {
                uni.showModal({
                  content: err.message || '删除失败',
                  showCancel: false
                })
              }).finally(() => {
                uni.hideLoading()
              })
            }
          }
        })
      }
    }
  }
</script>

<style>
  .uni-container {
    padding: 15px;
  }
  .detail-card {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  }
  .detail-image-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  .detail-image {
    width: 300rpx;
    height: 300rpx;
    border-radius: 12rpx;
  }
  .detail-item {
    display: flex;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
  }
  .detail-item:last-child {
    border-bottom: none;
  }
  .detail-label {
    font-size: 14px;
    color: #999;
    width: 80px;
  }
  .detail-value {
    font-size: 14px;
    color: #333;
    flex: 1;
  }
  .desc-value {
    word-break: break-all;
    line-height: 1.6;
  }
  .detail-price {
    font-size: 18px;
    color: #e91e63;
    font-weight: bold;
    flex: 1;
  }
  .detail-original-price {
    font-size: 14px;
    color: #ccc;
    text-decoration: line-through;
    flex: 1;
  }
  .type-tag {
    font-size: 24rpx;
    padding: 4rpx 16rpx;
    border-radius: 6rpx;
    background-color: #fff3e0;
    color: #ff9800;
  }
  .status-tag {
    font-size: 24rpx;
    padding: 6rpx 16rpx;
    border-radius: 20rpx;
    display: inline-block;
    width: fit-content;
  }
  .status-on {
    background-color: #e8f5e9;
    color: #4caf50;
  }
  .status-off {
    background-color: #fce4ec;
    color: #e91e63;
  }
  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    padding: 24rpx 0 16rpx;
  }
  .items-card {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  }
  .content-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
  }
  .content-item:last-child {
    border-bottom: none;
  }
  .content-left {
    display: flex;
    flex-direction: column;
    gap: 4rpx;
  }
  .content-name {
    font-size: 28rpx;
    color: #333;
  }
  .content-price {
    font-size: 24rpx;
    color: #999;
  }
  .content-subtotal {
    font-size: 28rpx;
    color: #e91e63;
    font-weight: bold;
  }
  .items-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16rpx;
    margin-top: 12rpx;
    border-top: 2rpx solid #f0f0f0;
  }
  .total-label {
    font-size: 28rpx;
    color: #666;
  }
  .total-value {
    font-size: 32rpx;
    color: #e91e63;
    font-weight: bold;
  }
  .empty-tip {
    text-align: center;
    padding: 30rpx;
    color: #ccc;
    font-size: 28rpx;
  }
  .btns {
    margin-top: 30px;
    display: flex;
    flex-direction: row;
  }
  .btns button {
    flex: 1;
  }
  .btn-delete {
    margin-left: 10px;
  }
</style>
