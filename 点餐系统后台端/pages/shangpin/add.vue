<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validate-trigger="submit" err-show-type="toast">
      <uni-forms-item name="name" label="商品名称" required>
        <uni-easyinput placeholder="请输入商品名称" v-model="formData.name"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="fenlei_id" label="商品分类" required>
        <uni-data-select v-model="formData.fenlei_id" :localdata="fenleiOptions" placeholder="请选择分类"></uni-data-select>
      </uni-forms-item>
      <uni-forms-item name="price" label="售价" required>
        <uni-easyinput type="number" placeholder="请输入售价" v-model="formData.price"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="original_price" label="原价">
        <uni-easyinput type="number" placeholder="请输入原价(选填)" v-model="formData.original_price"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="image" label="商品图片">
        <view class="image-upload">
          <view v-if="imageUrl" class="image-preview" @click="chooseImage">
            <image :src="imageUrl" mode="aspectFill" class="preview-img"></image>
            <view class="image-delete" @click.stop="deleteImage">
              <uni-icons type="clear" size="22" color="#e91e63"></uni-icons>
            </view>
          </view>
          <view v-else class="image-add" @click="chooseImage">
            <uni-icons type="plusempty" size="30" color="#ccc"></uni-icons>
            <text class="add-text">上传图片</text>
          </view>
        </view>
      </uni-forms-item>
      <uni-forms-item name="description" label="商品描述">
        <uni-easyinput type="textarea" placeholder="请输入商品描述" v-model="formData.description"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="unit" label="计量单位">
        <uni-easyinput placeholder="请输入单位" v-model="formData.unit"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="stock" label="库存数量">
        <view class="stock-row">
          <uni-number-box v-model="formData.stock" :min="-1" :max="99999"></uni-number-box>
          <text class="stock-tip">-1表示不限</text>
        </view>
      </uni-forms-item>
      <uni-forms-item name="status" label="商品状态">
        <uni-data-checkbox v-model="formData.status" :localdata="statusOptions"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="sale_time" label="售卖时段">
        <view class="time-row">
          <uni-easyinput placeholder="如08:00" v-model="formData.sale_time_start" class="time-input"></uni-easyinput>
          <text class="time-separator">至</text>
          <uni-easyinput placeholder="如22:00" v-model="formData.sale_time_end" class="time-input"></uni-easyinput>
        </view>
      </uni-forms-item>
      <uni-forms-item name="sort" label="排序号">
        <uni-number-box v-model="formData.sort" :min="0" :max="9999"></uni-number-box>
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" @click="submit" :disabled="submitting">提交</button>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '../../js_sdk/validator/shangpin.js'

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
        "name": "",
        "fenlei_id": null,
        "price": "",
        "original_price": "",
        "image": "",
        "description": "",
        "unit": "份",
        "stock": -1,
        "status": "上架",
        "sale_time_start": "",
        "sale_time_end": "",
        "sort": 0
      }
      return {
        formData,
        rules: {
          ...getValidator(Object.keys(formData))
        },
        fenleiOptions: [],
        statusOptions: [
          { text: '上架', value: '上架' },
          { text: '下架', value: '下架' }
        ],
        imageUrl: '',
        submitting: false
      }
    },
    onLoad() {
      this.loadFenleiList()
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      async loadFenleiList() {
        try {
          const shangpinCo = uniCloud.importObject('shangpin')
          const res = await shangpinCo.getFenleiList()
          if (res.errCode === 0) {
            this.fenleiOptions = res.data.filter(item => item.status).map(item => ({
              value: item._id,
              text: item.name
            }))
          }
        } catch (e) {}
      },
      chooseImage() {
        uni.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: async (res) => {
            const tempFilePath = res.tempFilePaths[0]
            uni.showLoading({ title: '上传中...' })
            try {
              const uploadRes = await uniCloud.uploadFile({
                filePath: tempFilePath,
                cloudPath: 'shangpin/' + Date.now() + '_' + Math.random().toString(36).substr(2, 8) + '.jpg'
              })
              this.formData.image = uploadRes.fileID
              this.imageUrl = tempFilePath
            } catch (e) {
              uni.showToast({ icon: 'none', title: '上传失败' })
            } finally {
              uni.hideLoading()
            }
          }
        })
      },
      deleteImage() {
        this.formData.image = ''
        this.imageUrl = ''
      },
      submit() {
        if (!this.formData.name.trim()) {
          uni.showToast({ icon: 'none', title: '请输入商品名称' })
          return
        }
        if (!this.formData.fenlei_id) {
          uni.showToast({ icon: 'none', title: '请选择商品分类' })
          return
        }
        if (this.formData.price === '' || this.formData.price === undefined) {
          uni.showToast({ icon: 'none', title: '请输入售价' })
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
          const shangpinCo = uniCloud.importObject('shangpin')
          const res = await shangpinCo.createShangpin({
            name: value.name,
            fenlei_id: value.fenlei_id,
            price: value.price,
            original_price: value.original_price || undefined,
            image: value.image || '',
            description: value.description || '',
            unit: value.unit || '份',
            stock: value.stock,
            status: value.status,
            sale_time_start: value.sale_time_start || '',
            sale_time_end: value.sale_time_end || '',
            sort: value.sort
          })
          if (res.errCode === 0) {
            uni.showToast({ icon: 'none', title: '新增成功' })
            this.getOpenerEventChannel().emit('refreshData')
            setTimeout(() => {
              uni.navigateBack()
            }, 500)
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
      }
    }
  }
</script>

<style>
  .uni-container {
    padding: 15px;
  }
  .image-upload {
    display: flex;
    align-items: center;
  }
  .image-preview {
    position: relative;
    width: 160rpx;
    height: 160rpx;
  }
  .preview-img {
    width: 160rpx;
    height: 160rpx;
    border-radius: 8rpx;
  }
  .image-delete {
    position: absolute;
    top: -10rpx;
    right: -10rpx;
  }
  .image-add {
    width: 160rpx;
    height: 160rpx;
    border: 2rpx dashed #ddd;
    border-radius: 8rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6rpx;
  }
  .add-text {
    font-size: 22rpx;
    color: #ccc;
  }
  .stock-row {
    display: flex;
    align-items: center;
    gap: 16rpx;
  }
  .stock-tip {
    font-size: 24rpx;
    color: #999;
  }
  .time-row {
    display: flex;
    align-items: center;
    gap: 12rpx;
  }
  .time-input {
    flex: 1;
  }
  .time-separator {
    color: #999;
    font-size: 28rpx;
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
