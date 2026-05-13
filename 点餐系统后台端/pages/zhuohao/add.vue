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
      <view class="uni-button-group">
        <button type="primary" class="uni-button" @click="submit" :disabled="submitting">提交</button>
      </view>
    </uni-forms>
    <view v-if="qrcodeResult" class="qrcode-result">
      <view class="qrcode-result-title">二维码生成成功</view>
      <image :src="qrcodeResult.url" class="qrcode-result-img" mode="aspectFit"></image>
      <view class="qrcode-result-url">
        <text class="url-label">文件地址：</text>
        <text class="url-text" selectable>{{qrcodeResult.fileID}}</text>
      </view>
      <view class="qrcode-result-url">
        <text class="url-label">临时链接：</text>
        <text class="url-text" selectable>{{qrcodeResult.url}}</text>
      </view>
      <button type="default" class="uni-button" @click="goBack">返回列表</button>
    </view>
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
        qrcodeResult: null
      }
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
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
          const res = await zhuohaoCo.createZhuohao({
            zhuohao: value.zhuohao,
            zhuoxing: value.zhuoxing,
            renshu: value.renshu,
            status: value.status
          })
          if (res.errCode === 0) {
            uni.showToast({ icon: 'none', title: '新增成功' })
            this.getOpenerEventChannel().emit('refreshData')
            const fileID = res.data.qrcode
            let tempUrl = ''
            if (fileID && fileID.startsWith('cloud://')) {
              const urlRes = await uniCloud.getTempFileURL({ fileList: [fileID] })
              if (urlRes.fileList && urlRes.fileList.length > 0) {
                tempUrl = urlRes.fileList[0].tempFileURL
              }
            } else if (fileID) {
              tempUrl = fileID
            }
            this.qrcodeResult = {
              fileID: fileID,
              url: tempUrl
            }
          } else {
            uni.showModal({
              content: res.errMsg || '创建失败',
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
      goBack() {
        uni.navigateBack()
      }
    }
  }
</script>

<style>
  .uni-container {
    padding: 15px;
  }

  .qrcode-result {
    margin-top: 30px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .qrcode-result-title {
    font-size: 16px;
    font-weight: bold;
    color: #4caf50;
    margin-bottom: 15px;
  }

  .qrcode-result-img {
    width: 200px;
    height: 200px;
    border-radius: 8px;
    margin-bottom: 15px;
  }

  .qrcode-result-url {
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
