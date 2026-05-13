<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validate-trigger="submit" err-show-type="toast">
      <uni-forms-item name="zhuohao" label="桌号" required>
        <uni-easyinput placeholder="请输入桌号" v-model="formData.zhuohao"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="zhuoxing" label="桌型">
        <uni-data-checkbox v-model="formData.zhuoxing" :localdata="zhuoxingOptions"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="renshu" label="容纳人数">
        <uni-number-box v-model="formData.renshu" :min="1" :max="30"></uni-number-box>
      </uni-forms-item>
      <uni-forms-item name="status" label="桌号状态">
        <uni-data-checkbox v-model="formData.status" :localdata="statusOptions"></uni-data-checkbox>
      </uni-forms-item>
      <view v-if="qrcodeUrl" class="qrcode-preview">
        <text class="qrcode-preview-label">当前二维码</text>
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
      <view class="uni-button-group">
        <button type="primary" class="uni-button" @click="submit" :disabled="submitting">提交</button>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '../../js_sdk/validator/zhuohao.js';

  const db = uniCloud.database();
  const dbCollectionName = 'zhuohao';

  function getValidator(fields) {
    let result = {}
    for (let key in validator) {
      if (fields.indexOf(key) > -1) {
        result[key] = validator[key]
      }
    }
    return result
  }

  export default {
    data() {
      let formData = {
        "zhuohao": "",
        "zhuoxing": "中桌",
        "renshu": 4,
        "status": "空桌"
      }
      return {
        formData,
        formDataId: '',
        originalZhuohao: '',
        formOptions: {},
        rules: {
          ...getValidator(Object.keys(formData))
        },
        zhuoxingOptions: [
          {text: '小桌', value: '小桌'},
          {text: '中桌', value: '中桌'},
          {text: '大桌', value: '大桌'},
          {text: '包间', value: '包间'}
        ],
        statusOptions: [
          {text: '空桌', value: '空桌'},
          {text: '已开台', value: '已开台'},
          {text: '已下单', value: '已下单'},
          {text: '已预定', value: '已预定'},
          {text: '已结账', value: '已结账'}
        ],
        submitting: false,
        qrcodeFileID: '',
        qrcodeUrl: ''
      }
    },
    onLoad(e) {
      if (e.id) {
        const id = e.id
        this.formDataId = id
        this.getDetail(id)
      }
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
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
      submit() {
        if (!this.formData.zhuohao.trim()) {
          uni.showToast({ icon: 'none', title: '请输入桌号' })
          return
        }
        this.submitting = true
        uni.showLoading({ mask: true })
        this.$refs.form.validate().then((res) => {
          return this.submitForm(res)
        }).catch(() => {
        }).finally(() => {
          this.submitting = false
          uni.hideLoading()
        })
      },
      async submitForm(value) {
        try {
          const zhuohaoCo = uniCloud.importObject('zhuohao')
          const res = await zhuohaoCo.updateZhuohao({
            id: this.formDataId,
            zhuohao: value.zhuohao,
            zhuoxing: value.zhuoxing,
            renshu: value.renshu,
            status: value.status
          })
          if (res.errCode === 0) {
            uni.showToast({ icon: 'none', title: '修改成功' })
            this.getOpenerEventChannel().emit('refreshData')
            const newQrcode = res.data.qrcode
            if (newQrcode && newQrcode !== this.qrcodeFileID) {
              await this.convertCloudUrl(newQrcode)
            }
          } else {
            uni.showModal({
              content: res.errMsg || '修改失败',
              showCancel: false
            })
          }
        } catch (err) {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        }
      },
      async getDetail(id) {
        uni.showLoading({
          mask: true
        })
        try {
          const res = await db.collection(dbCollectionName).doc(id).field("zhuohao,zhuoxing,renshu,qrcode,status").get()
          const data = res.result.data[0]
          if (data) {
            this.formData = {
              zhuohao: data.zhuohao || '',
              zhuoxing: data.zhuoxing || '中桌',
              renshu: data.renshu || 4,
              status: data.status || '空桌'
            }
            this.originalZhuohao = data.zhuohao || ''
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
      }
    }
  }
</script>

<style>
  .uni-container {
    padding: 15px;
  }

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

  .uni-button-group {
    margin-top: 50px;
    display: flex;
    justify-content: center;
  }

  .uni-button {
    width: 184px;
  }

  .uni-button[disabled] {
    opacity: 0.6;
  }
</style>
