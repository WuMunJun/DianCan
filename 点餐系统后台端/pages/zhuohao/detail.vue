<template>
  <view class="uni-container">
    <view class="detail-card">
      <view class="detail-item">
        <text class="detail-label">桌号</text>
        <text class="detail-value">{{detailData.zhuohao}}</text>
      </view>
      <view class="detail-item">
        <text class="detail-label">桌型</text>
        <text class="detail-value">{{detailData.zhuoxing || '中桌'}}</text>
      </view>
      <view class="detail-item">
        <text class="detail-label">容纳人数</text>
        <text class="detail-value">{{detailData.renshu || 4}}人</text>
      </view>
      <view class="detail-item">
        <text class="detail-label">桌号状态</text>
        <text class="table-status" :class="'status-' + detailData.status">{{getStatusText(detailData.status)}}</text>
      </view>
    </view>
    <view v-if="qrcodeUrl" class="qrcode-preview">
      <text class="qrcode-preview-label">点餐二维码</text>
      <image :src="qrcodeUrl" class="qrcode-preview-img" mode="aspectFit"></image>
      <view class="qrcode-preview-url">
        <text class="url-label">文件地址：</text>
        <text class="url-text" selectable>{{qrcodeFileID}}</text>
      </view>
      <view class="qrcode-preview-url">
        <text class="url-label">临时链接：</text>
        <text class="url-text" selectable>{{qrcodeUrl}}</text>
      </view>
    </view>
    <view class="btns">
      <button type="primary" @click="handleUpdate">修改</button>
      <button type="default" @click="handleYuding">预定</button>
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
          zhuohao: '',
          zhuoxing: '中桌',
          renshu: 4,
          status: '空桌'
        },
        qrcodeFileID: '',
        qrcodeUrl: ''
      }
    },
    onLoad(e) {
      if (e.id) {
        this.formDataId = e.id
        this.getDetail(e.id)
      }
    },
    methods: {
      async convertCloudUrl(fileID) {
        if (!fileID) {
          this.qrcodeFileID = ''
          this.qrcodeUrl = ''
          return
        }
        this.qrcodeFileID = fileID
        if (fileID.startsWith('cloud://')) {
          try {
            const urlRes = await uniCloud.getTempFileURL({ fileList: [fileID] })
            if (urlRes.fileList && urlRes.fileList.length > 0) {
              this.qrcodeUrl = urlRes.fileList[0].tempFileURL
            }
          } catch (e) {
            this.qrcodeUrl = ''
          }
        } else {
          this.qrcodeUrl = fileID
        }
      },
      async getDetail(id) {
        uni.showLoading({ mask: true })
        try {
          const res = await db.collection('zhuohao').doc(id).field('zhuohao,zhuoxing,renshu,qrcode,status').get()
          const data = res.result.data[0]
          if (data) {
            this.detailData = {
              zhuohao: data.zhuohao || '',
              zhuoxing: data.zhuoxing || '中桌',
              renshu: data.renshu || 4,
              status: data.status || '空桌'
            }
            if (data.qrcode) {
              await this.convertCloudUrl(data.qrcode)
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
          '空桌': '空桌',
          '已开台': '已开台',
          '已下单': '已下单',
          '已结账': '已结账',
          '已预定': '已预定'
        }
        return statusMap[status] || '空桌'
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
      handleYuding() {
        uni.navigateTo({
          url: '/pages/yuding/add?zhuohao_id=' + this.formDataId + '&zhuohao=' + this.detailData.zhuohao + '&renshu=' + this.detailData.renshu,
          events: {
            refreshData: () => {
              this.getDetail(this.formDataId)
            }
          }
        })
      },
      handleDelete() {
        uni.showModal({
          title: '确认删除',
          content: '确定要删除该桌号吗？',
          success: (res) => {
            if (res.confirm) {
              uni.showLoading({ mask: true })
              db.collection('zhuohao').doc(this.formDataId).remove().then(() => {
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

  .table-status {
    font-size: 24rpx;
    padding: 6rpx 16rpx;
    border-radius: 20rpx;
    display: inline-block;
    width: fit-content;
  }

  .status-空桌 { background-color: #e8f5e9; color: #4caf50; }
  .status-已开台 { background-color: #fff3e0; color: #ff9800; }
  .status-已下单 { background-color: #e3f2fd; color: #2196f3; }
  .status-已结账 { background-color: #fce4ec; color: #e91e63; }
  .status-已预定 { background-color: #f3e5f5; color: #9c27b0; }

  .qrcode-preview {
    margin-top: 15px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .qrcode-preview-label {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
  }

  .qrcode-preview-img {
    width: 200px;
    height: 200px;
    border-radius: 8px;
    margin-bottom: 15px;
  }

  .qrcode-preview-url {
    width: 100%;
    margin-bottom: 10px;
    padding: 8px 10px;
    background-color: #fff;
    border-radius: 6px;
    word-break: break-all;
  }

  .url-label {
    font-size: 12px;
    color: #999;
    display: block;
    margin-bottom: 4px;
  }

  .url-text {
    font-size: 12px;
    color: #333;
    word-break: break-all;
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
