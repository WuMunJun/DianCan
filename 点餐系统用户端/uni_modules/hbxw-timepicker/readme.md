# hbxw-timepicker预约时间选择组件

## 介绍
一个预约时间选择器组件，常用于如快递，按摩等上门服务时间预约选择

## 使用示例
推荐先直接复制示例代码到工程中看效果了解下使用方法再投入项目使用。

```html

<template>
	<view>
    <button @click="pickerTime(0)">预约时间0</button>
    <button @click="pickerTime(1)">预约时间1</button>
    <button @click="pickerTime(2)">预约时间2</button>
    <button @click="pickerTime(2)">预约时间3</button>
		<hbxw-timepicker v-model:isShow="showTimePicker0" :isBtn="false" @change="pickerChange"></hbxw-timepicker>
    <hbxw-timepicker v-model:isShow="showTimePicker1" :maxHour="16" :isBtn="false" @change="pickerChange"></hbxw-timepicker>
		<hbxw-timepicker v-model:isShow="showTimePicker2" :dayRange="7" :minHour="8" :maxHour="20" @change="pickerChange"></hbxw-timepicker>
		<hbxw-timepicker v-model:isShow="showTimePicker3" @change="pickerChange">
      <template #title="{title}">
        <view>{{title}}</view>
      </template>
      <template #btn="{result}">
        <button style="font-size: 24rpx;">{{result}}</button>
      </template>
    </hbxw-timepicker>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showTimePicker0: false,
				showTimePicker1: false,
				showTimePicker2: false,
				showTimePicker3: false
			}
		},
		methods: {
			pickerTime(index) {
        this['showTimePicker'+index] = true;
      },
      pickerChange(result) {
        console.log('---- pickerChange ----:',  result);
      }
		}
	}
</script>

<style>

</style>


```

## API

### Props

| 属性名       | 类型          | 默认值    | 必填 | 说明                               |
| ------------ | -------------| -------- | ---- | -----------------------------------|
| isShow      | Boolean   | false       | 是   | 支持v-model,控制时间选择的显示与隐藏              |
| title      | String      | 请选择快递上门取件时间    | 否   | 预约时间选择器标题              |
| subTitle        | String       | 快递1小时内上门取件，请自行做好数据备份  | 否   | 预约时间选择器子标题   |
| isFast     | Boolean    | true     | 否   | 是否要显示即时服务，即1小时内                   |
| anotherNames     | Array      | ['今天','明天','后天']   | 否   | 日期别名显示        |
| dayRange     | Number  | 3     | 否   | 预约天数范围        |
| minHour     |  Number  | 9     | 否   | 预约时间的开始时间         |
| maxHour     |  Number  | 19     | 否   | 预约时间的结束时间         |
| isBtn     |  Boolean  | true     | 否   | 是否显示底部按钮条         |
| isAni     |  Boolean  | true     | 否   | 是否有动效     |
| zIndex       | Number       | 9999     | 否   | 时间选择器的层级                     |
| maskOpacity     |  Number  | .76     | 否   | 值范围0-1，设置大于0的值就会有遮罩，值越大遮罩越深         |
| noDateTips     |  String  | 今日已暂无服务     | 否   | 当今天无服务时显示的提示         |
| isTwo     |  Boolean  |   true   | 否   | 月份日期时间是否需要被全二位         |
| isAutoClose     |  Boolean  |   false   | 否   | 切换时间的时候是否自动关闭         |
| emitEventName     |  String  |   'timepicker'   | 否   | uni.$emit的事件名，用于从外部控制组件         |
| closeImgSrc     |  String  |   组件自带图片close   | 否   | 用于修改关闭按钮图片         |
| selectImgSrc     |  String  |   组件自带图片select   | 否   | 用于修改已选择对勾图片         |

### Slots

| 插槽名       | 说明   |
| ------------ | ------------  |
| title         | 自定义标题区域，可获取到`title`和`subTitle` | 
| btn       | 自定义底部按钮区域，可获取到`result` | 

### Events

| 事件名       | 说明   | 返回值                                                                                                                                 |
| ------------ | ------------  |  ------------ | 
| change       | 预约时间发生变化、点击确认、关闭时触发 |  返回一个对象，包含 `result` 和 `form` 两个字段。<br>`result` 为当前选择的时间信息。<br>`form` 的值有 `day`(切换日期), `hour`(切换时间), `sure`(点击确认), `close`(关闭) |

### 注意事项

- `v-model` 在 vue2 和 vue3 中写法不一样，vue2 中为 `v-model="isShow"`，vue3 中为 `v-model:isShow="isShow"`
- 组件显示包体积较大，是因为有示例动图，其实真正打包到项目中的包体是比较小的，请放心使用