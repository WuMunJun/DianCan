<template>
  <view class="uni-container">
    <uni-forms ref="form" :model="formData" validate-trigger="submit" err-show-type="toast">
      <uni-forms-item name="zhuohao" label="桌号">
        <uni-easyinput :value="formData.zhuohao" disabled></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="yudingren" label="预定人" required>
        <uni-easyinput placeholder="请输入预定人姓名" v-model="formData.yudingren"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="lianxi" label="联系电话" required>
        <uni-easyinput placeholder="请输入联系电话" v-model="formData.lianxi" type="number"></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="renshu" label="预定人数" required>
        <uni-number-box v-model="formData.renshu" :min="1" :max="30"></uni-number-box>
      </uni-forms-item>
      <uni-forms-item name="yuding_time" label="到店时间" required>
        <uni-datetime-picker type="datetime" v-model="formData.yuding_time" />
      </uni-forms-item>
      <uni-forms-item name="beizhu" label="备注">
        <uni-easyinput type="textarea" placeholder="请输入备注信息" v-model="formData.beizhu"></uni-easyinput>
      </uni-forms-item>
      <view class="uni-button-group">
        <button type="primary" class="uni-button" @click="submit" :disabled="submitting">提交预定</button>
      </view>
    </uni-forms>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        formData: {
          zhuohao_id: '',
          zhuohao: '',
          yudingren: '',
          lianxi: '',
          renshu: 4,
          yuding_time: '',
          beizhu: ''
        },
        submitting: false
      }
    },
    onLoad(e) {
      if (e.zhuohao_id) {
        this.formData.zhuohao_id = e.zhuohao_id
        this.formData.zhuohao = e.zhuohao || ''
        this.formData.renshu = parseInt(e.renshu) || 4
      }
    },
    methods: {
      submit() {
        if (!this.formData.yudingren.trim()) {
          uni.showToast({ icon: 'none', title: '请输入预定人姓名' })
          return
        }
        if (!this.formData.lianxi.trim()) {
          uni.showToast({ icon: 'none', title: '请输入联系电话' })
          return
        }
        if (!this.formData.yuding_time) {
          uni.showToast({ icon: 'none', title: '请选择到店时间' })
          return
        }
        this.submitting = true
        uni.showLoading({ mask: true })
        this.submitForm()
      },
      async submitForm() {
        try {
          const zhuohaoCo = uniCloud.importObject('zhuohao')
          const res = await zhuohaoCo.createYuding({
            zhuohao_id: this.formData.zhuohao_id,
            zhuohao: this.formData.zhuohao,
            yudingren: this.formData.yudingren,
            lianxi: this.formData.lianxi,
            renshu: this.formData.renshu,
            yuding_time: new Date(this.formData.yuding_time).getTime(),
            beizhu: this.formData.beizhu
          })
          if (res.errCode === 0) {
            uni.showToast({ icon: 'none', title: '预定成功' })
            this.getOpenerEventChannel().emit('refreshData')
            setTimeout(() => uni.navigateBack(), 500)
          } else {
            uni.showModal({
              content: res.errMsg || '预定失败',
              showCancel: false
            })
          }
        } catch (err) {
          uni.showModal({
            content: err.message || '请求服务失败',
            showCancel: false
          })
        } finally {
          this.submitting = false
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
