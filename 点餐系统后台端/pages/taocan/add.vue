<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validate-trigger="submit" err-show-type="toast">
      <uni-forms-item name="name" label="套餐名称" required>
        <uni-easyinput placeholder="请输入套餐名称" v-model="formData.name"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="type" label="套餐类型">
        <uni-data-checkbox v-model="formData.type" :localdata="typeOptions"></uni-data-checkbox>
      </uni-forms-item>
      <uni-forms-item name="price" label="套餐价格" required>
        <uni-easyinput type="number" placeholder="请输入套餐价格" v-model="formData.price"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="original_price" label="套餐原价">
        <uni-easyinput type="number" placeholder="请输入原价(选填)" v-model="formData.original_price"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="image" label="套餐图片">
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
      <uni-forms-item name="description" label="套餐描述">
        <uni-easyinput type="textarea" placeholder="请输入套餐描述" v-model="formData.description"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="stock" label="库存数量">
        <view class="stock-row">
          <uni-number-box v-model="formData.stock" :min="-1" :max="99999"></uni-number-box>
          <text class="stock-tip">-1表示不限</text>
        </view>
      </uni-forms-item>
      <uni-forms-item name="status" label="套餐状态">
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

      <view class="section-title">套餐内容</view>
      <view class="items-wrap">
        <view v-for="(item, index) in formData.items" :key="index" class="item-row">
          <view class="item-fields">
            <uni-data-select v-model="item.shangpin_id" :localdata="shangpinOptions" placeholder="选择商品" @change="onShangpinChange($event, index)" class="item-select"></uni-data-select>
            <uni-number-box v-model="item.quantity" :min="1" :max="99" class="item-quantity"></uni-number-box>
            <text class="item-price-text" v-if="item.price">¥{{item.price}}</text>
          </view>
          <view class="item-actions">
            <uni-icons type="minus-filled" size="24" color="#e91e63" @click="removeItem(index)"></uni-icons>
          </view>
        </view>
        <view class="add-item-btn" @click="addItem">
          <uni-icons type="plus-filled" size="22" color="#409eff"></uni-icons>
          <text class="add-item-text">添加商品</text>
        </view>
      </view>

      <view class="uni-button-group">
        <button type="primary" class="uni-button" @click="submit" :disabled="submitting">提交</button>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '../../js_sdk/validator/taocan.js'

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
        "type": "自定义套餐",
        "price": "",
        "original_price": "",
        "image": "",
        "description": "",
        "stock": -1,
        "status": "上架",
        "sale_time_start": "",
        "sale_time_end": "",
        "sort": 0,
        "items": []
      }
      return {
        formData,
        rules: {
          ...getValidator(Object.keys(formData))
        },
        typeOptions: [
          { text: '酒餐套餐', value: '酒餐套餐' },
          { text: '酒水套餐', value: '酒水套餐' },
          { text: '自定义套餐', value: '自定义套餐' }
        ],
        statusOptions: [
          { text: '上架', value: '上架' },
          { text: '下架', value: '下架' }
        ],
        shangpinOptions: [],
        imageUrl: '',
        submitting: false
      }
    },
    onLoad() {
      this.loadShangpinList()
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      async loadShangpinList() {
        try {
          const shangpinCo = uniCloud.importObject('shangpin')
          const res = await shangpinCo.getShangpinList({ status: '上架' })
          if (res.errCode === 0) {
            this.shangpinOptions = res.data.map(item => ({
              value: item._id,
              text: item.name + ' ¥' + item.price
            }))
          }
        } catch (e) {}
      },
      onShangpinChange(shangpinId, index) {
        const option = this.shangpinOptions.find(o => o.value === shangpinId)
        if (option) {
          const name = option.text.split(' ¥')[0]
          this.formData.items[index].shangpin_name = name
          const shangpinData = this.shangpinOptions.find(o => o.value === shangpinId)
          if (shangpinData) {
            const priceStr = shangpinData.text.split(' ¥')[1]
            this.formData.items[index].price = parseFloat(priceStr) || 0
          }
        }
      },
      addItem() {
        this.formData.items.push({
          shangpin_id: null,
          shangpin_name: '',
          quantity: 1,
          price: 0
        })
      },
      removeItem(index) {
        this.formData.items.splice(index, 1)
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
                cloudPath: 'taocan/' + Date.now() + '_' + Math.random().toString(36).substr(2, 8) + '.jpg'
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
          uni.showToast({ icon: 'none', title: '请输入套餐名称' })
          return
        }
        if (this.formData.price === '' || this.formData.price === undefined) {
          uni.showToast({ icon: 'none', title: '请输入套餐价格' })
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
          const taocanCo = uniCloud.importObject('taocan')
          const res = await taocanCo.createTaocan({
            name: value.name,
            type: value.type,
            price: value.price,
            original_price: value.original_price || undefined,
            image: value.image || '',
            description: value.description || '',
            items: this.formData.items,
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
  .section-title {
    font-size: 30rpx;
    font-weight: bold;
    color: #333;
    padding: 20rpx 0 16rpx;
    border-top: 1rpx solid #f0f0f0;
    margin-top: 20rpx;
  }
  .items-wrap {
    background-color: #f9f9f9;
    border-radius: 12rpx;
    padding: 20rpx;
  }
  .item-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16rpx;
    padding: 16rpx;
    background-color: #fff;
    border-radius: 8rpx;
  }
  .item-fields {
    display: flex;
    align-items: center;
    gap: 12rpx;
    flex: 1;
    flex-wrap: wrap;
  }
  .item-select {
    min-width: 280rpx;
    flex: 1;
  }
  .item-quantity {
    width: 160rpx;
  }
  .item-price-text {
    font-size: 26rpx;
    color: #e91e63;
    font-weight: bold;
  }
  .item-actions {
    margin-left: 16rpx;
    flex-shrink: 0;
  }
  .add-item-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    padding: 20rpx;
    border: 2rpx dashed #409eff;
    border-radius: 8rpx;
    margin-top: 8rpx;
  }
  .add-item-text {
    font-size: 28rpx;
    color: #409eff;
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
