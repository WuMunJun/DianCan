<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validate-trigger="submit" err-show-type="toast">
      <uni-forms-item name="name" label="分类名称" required>
        <uni-easyinput placeholder="请输入分类名称" v-model="formData.name"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="icon" label="分类图标">
        <uni-easyinput placeholder="请输入图标名称" v-model="formData.icon"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="sort" label="排序号">
        <uni-number-box v-model="formData.sort" :min="0" :max="9999"></uni-number-box>
      </uni-forms-item>
      <uni-forms-item name="status" label="是否启用">
        <uni-data-checkbox v-model="formData.status" :localdata="statusOptions"></uni-data-checkbox>
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" @click="submit" :disabled="submitting">提交</button>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  import { validator } from '../../js_sdk/validator/shangpin_fenlei.js'

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
        "icon": "",
        "sort": 0,
        "status": true
      }
      return {
        formData,
        formDataId: '',
        rules: {
          ...getValidator(Object.keys(formData))
        },
        statusOptions: [
          { text: '启用', value: true },
          { text: '禁用', value: false }
        ],
        submitting: false
      }
    },
    onLoad(e) {
      if (e.id) {
        this.formDataId = e.id
        this.getDetail(e.id)
      }
    },
    onReady() {
      this.$refs.form.setRules(this.rules)
    },
    methods: {
      async getDetail(id) {
        uni.showLoading({ mask: true })
        try {
          const db = uniCloud.database()
          const res = await db.collection('shangpin_fenlei').doc(id).field('name,icon,sort,status').get()
          const data = res.result.data[0]
          if (data) {
            this.formData = {
              name: data.name || '',
              icon: data.icon || '',
              sort: data.sort || 0,
              status: data.status !== undefined ? data.status : true
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
      submit() {
        if (!this.formData.name.trim()) {
          uni.showToast({ icon: 'none', title: '请输入分类名称' })
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
          const res = await shangpinCo.updateFenlei({
            id: this.formDataId,
            name: value.name,
            icon: value.icon,
            sort: value.sort,
            status: value.status
          })
          if (res.errCode === 0) {
            uni.showToast({ icon: 'none', title: '修改成功' })
            this.getOpenerEventChannel().emit('refreshData')
            setTimeout(() => {
              uni.navigateBack()
            }, 500)
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
      }
    }
  }
</script>

<style>
  .uni-container {
    padding: 15px;
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
