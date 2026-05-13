<template>
  <view class="uni-container">
    <view class="detail-card">
      <view class="detail-item">
        <text class="detail-label">桌号</text>
        <text class="detail-value">{{detailData.zhuohao}}号桌</text>
      </view>
      <view class="detail-item">
        <text class="detail-label">预定人</text>
        <text class="detail-value">{{detailData.yudingren}}</text>
      </view>
      <view class="detail-item">
        <text class="detail-label">联系电话</text>
        <text class="detail-value">{{detailData.lianxi}}</text>
      </view>
      <view class="detail-item">
        <text class="detail-label">预定人数</text>
        <text class="detail-value">{{detailData.renshu}}人</text>
      </view>
      <view class="detail-item">
        <text class="detail-label">到店时间</text>
        <text class="detail-value">{{formatTime(detailData.yuding_time)}}</text>
      </view>
      <view class="detail-item">
        <text class="detail-label">预定状态</text>
        <view class="yuding-status" :class="'ys-' + detailData.status">{{getStatusText(detailData.status)}}</view>
      </view>
      <view class="detail-item" v-if="detailData.beizhu">
        <text class="detail-label">备注</text>
        <text class="detail-value">{{detailData.beizhu}}</text>
      </view>
    </view>
    <view class="btns" v-if="detailData.status === '待审核'">
      <button type="primary" @click="handleConfirm">审核通过</button>
      <button type="warn" class="btn-cancel" @click="handleCancel">取消预定</button>
    </view>
    <view class="btns" v-else-if="detailData.status === '已确认'">
      <button type="primary" @click="handleComplete">标记完成</button>
      <button type="warn" class="btn-cancel" @click="handleCancel">取消预定</button>
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
          zhuohao: '',
          yudingren: '',
          lianxi: '',
          renshu: 0,
          yuding_time: 0,
          status: '待审核',
          beizhu: ''
        }
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
          const res = await db.collection('yuding').doc(id).field('zhuohao_id,zhuohao,yudingren,lianxi,renshu,yuding_time,status,beizhu').get()
          const data = res.result.data[0]
          if (data) {
            this.detailData = {
              zhuohao_id: data.zhuohao_id || '',
              zhuohao: data.zhuohao || '',
              yudingren: data.yudingren || '',
              lianxi: data.lianxi || '',
              renshu: data.renshu || 0,
              yuding_time: data.yuding_time || 0,
              status: data.status || '待审核',
              beizhu: data.beizhu || ''
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
      async handleConfirm() {
        uni.showLoading({ mask: true })
        try {
          const zhuohaoCo = uniCloud.importObject('zhuohao')
          const res = await zhuohaoCo.confirmYuding(this.formDataId)
          if (res.errCode === 0) {
            uni.showToast({ icon: 'none', title: '审核通过' })
            this.getDetail(this.formDataId)
          } else {
            uni.showModal({ content: res.errMsg || '操作失败', showCancel: false })
          }
        } catch (err) {
          uni.showModal({ content: err.message || '操作失败', showCancel: false })
        } finally {
          uni.hideLoading()
        }
      },
      async handleCancel() {
        uni.showModal({
          title: '确认取消',
          content: '确定要取消该预定吗？',
          success: async (res) => {
            if (res.confirm) {
              uni.showLoading({ mask: true })
              try {
                const zhuohaoCo = uniCloud.importObject('zhuohao')
                const result = await zhuohaoCo.cancelYuding(this.formDataId)
                if (result.errCode === 0) {
                  uni.showToast({ icon: 'none', title: '已取消预定' })
                  this.getDetail(this.formDataId)
                } else {
                  uni.showModal({ content: result.errMsg || '操作失败', showCancel: false })
                }
              } catch (err) {
                uni.showModal({ content: err.message || '操作失败', showCancel: false })
              } finally {
                uni.hideLoading()
              }
            }
          }
        })
      },
      async handleComplete() {
        uni.showLoading({ mask: true })
        try {
          const zhuohaoCo = uniCloud.importObject('zhuohao')
          const res = await zhuohaoCo.completeYuding(this.formDataId)
          if (res.errCode === 0) {
            uni.showToast({ icon: 'none', title: '已标记完成' })
            this.getDetail(this.formDataId)
          } else {
            uni.showModal({ content: res.errMsg || '操作失败', showCancel: false })
          }
        } catch (err) {
          uni.showModal({ content: err.message || '操作失败', showCancel: false })
        } finally {
          uni.hideLoading()
        }
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

  .yuding-status {
    font-size: 24rpx;
    padding: 6rpx 16rpx;
    border-radius: 20rpx;
    color: #fff;
    display: inline-block;
  }

  .ys-待审核 { background-color: #ff9800; }
  .ys-已确认 { background-color: #4caf50; }
  .ys-已取消 { background-color: #999; }
  .ys-已完成 { background-color: #2196f3; }

  .btns {
    margin-top: 30px;
    display: flex;
    flex-direction: row;
  }

  .btns button {
    flex: 1;
  }

  .btn-cancel {
    margin-left: 10px;
  }
</style>
