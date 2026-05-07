<template>
	<view class="hbxw-timepicker" :class="{'hbxw-timepicker-ani': isAni}"
		:style="{'z-index': zIndex, '--opacity': maskOpacity}" v-if="isShow">
		<view class="hbxw-timepicker-mask" @click="close"></view>
		<view class="hbxw-timepicker-main" :class="{'hbxw-timepicker-main-ani': isAni}">

			<!-- 标题 -->
			<view class="hbxw-timepicker-title">
				<slot name="title" :title="title" :subTitle="subTitle">
					<view class="hbxw-timepicker-title-main">{{title}}</view>
					<view class="hbxw-timepicker-title-subtitle">{{subTitle}}</view>
				</slot>
				<image :src="closeImgSrc" class="hbxw-timepicker-close" @click="close"></image>
			</view>

			<!-- 主内容，日期和时间选择区 -->
			<view class="hbxw-timepicker-content">
				<view class="hbxw-timepicker-day">
					<view class="hbxw-timepicker-day-item"
						:class="{'hbxw-timepicker-day-item-active': dayActiveIndex === index}"
						v-for="(day, index) in days" :key="index" @click="toggleDay(index)">
						{{day.displayText}}
					</view>
				</view>
				<view class="hbxw-timepicker-time">
					<view v-if="hours.length > 0" class="hbxw-timepicker-time-item" v-for="(hour, index) in hours"
						:key="index" :class="{'hbxw-timepicker-time-item-active': hourActiveIndex === index}"
						@click="toggleHour(index)">
						<text class="hbxw-timepicker-time-val">{{hour.hoursStr}}</text>
						<view class="hbxw-timepicker-time-icon">
							<image :src="selectImgSrc" class="hbxw-timepicker-time-img"></image>
						</view>
					</view>
					<view class="hbxw-timepicker-notime" v-else>
						<text class="hbxw-timerpicker-nodata">{{noDateTips}}</text>
					</view>
				</view>
			</view>

			<!-- 底部按钮 -->
			<slot name="btn" :result="result" v-if="isBtn">
				<view class="hbxw-timerpicker-btn-wrap">
					<view class="hbxw-timerpicker-sure" @click="sure" v-if="btnStr">{{btnStr}}</view>
				</view>
			</slot>
		</view>
	</view>
</template>
<script>
	import guanbi from '../../static/guanbi.png'
	import gougou from '../../static/gougou.png'

	export default {
		props: {
			isShow: {
				type: Boolean,
				default: false
			},
			title: {
				type: String,
				default: '请选择配送时间'
			},
			subTitle: {
				type: String,
				default: '请选择期望的配送时间'
			},
			// 是否显示1小时内
			isFast: {
				type: Boolean,
				default: true
			},
			// 日期别名，用于一些特殊场景，如需要显示今天明天后天...
			anotherNames: {
				type: Array,
				default () {
					return ['今天', '明天', '后天']
				}
			},
			dayRange: {
				type: Number,
				default: 3
			},
			minHour: {
				type: Number,
				default: 9
			},
			maxHour: {
				type: Number,
				default: 19
			},
			isBtn: {
				type: Boolean,
				default: true
			},
			isAni: {
				type: Boolean,
				default: true
			},
			zIndex: {
				type: Number,
				default: 9999
			},
			maskOpacity: {
				type: Number,
				default: .76
			},
			noDateTips: {
				type: String,
				default: '今日配送时间已过'
			},
			isTwo: {
				type: Boolean,
				default: true
			},
			isAutoClose: {
				type: Boolean,
				default: false
			},
			emitEventName: {
				type: String,
				default: 'timepicker'
			},
			closeImgSrc: {
				type: String,
				default: guanbi
			},
			selectImgSrc: {
				type: String,
				default: gougou
			},
		},
		model: {
			prop: 'isShow',
			event: 'update'
		},
		watch: {
			isShow: {
				handler(newVal, oldVal) {
					if (newVal) {
						this.init();
					}
				},
				immediate: true
			}
		},
		mounted() {
			uni.$on(this.emitEventName, (type) => {
				this[type] && this[type]();
			})
		},
		// #ifdef VUE3
		unmounted() {
			uni.$off(this.emitEventName);
		},
		// #endif

		// #ifdef VUE2
		destroyed() {
			uni.$off(this.emitEventName);
		},
		// #endif
		data() {
			return {
				days: [],
				dayActiveIndex: 0,
				hourActiveIndex: 0,
			}
		},
		computed: {
			// 可选时间列表
			hours() {
				let nowDate = new Date();
				let hoursResult = [];
				let firstHour = this.minHour;
				if (this.dayActiveIndex === 0) {
					firstHour = nowDate.getHours() > firstHour ? nowDate.getHours() : firstHour;
					if (firstHour >= this.maxHour) {
						return [];
					}
					if (this.isFast) {
						hoursResult.push({
							start: firstHour,
							end: firstHour,
							hoursStr: '1小时内'
						})
						firstHour = firstHour + 1;
					}
				}
				for (let i = firstHour; i < this.maxHour; i++) {
					hoursResult.push({
						start: i,
						end: i + 1,
						hoursStr: `${this.isTwo ? ('0'+i).slice(-2) : i}:00~${this.isTwo ? ('0'+(i+1)).slice(-2) : i+1}:00`
					})
				}
				return hoursResult;
			},
			// 当前选中结果
			result() {
				if (this.days.length === 0 || this.hours.length === 0) {
					return null;
				}
				const {
					year,
					month,
					day,
					displayText // 添加 displayText
				} = this.days[this.dayActiveIndex];
				const {
					start,
					end,
					hoursStr
				} = this.hours[this.hourActiveIndex] || {};

				return {
					year: year,
					month: this.isTwo ? ('0' + month).slice(-2) : month,
					day: this.isTwo ? ('0' + day).slice(-2) : day,
					hourStart: this.isTwo ? ('0' + start).slice(-2) : start,
					hourEnd: this.isTwo ? ('0' + end).slice(-2) : end,
					hoursStr: hoursStr,
					anotherName: this.anotherNames[this.dayActiveIndex] || '',
					displayText: displayText // 添加 displayText 字段
				}
			},
			btnStr() {
				let hoursStr = '';
				if (!this.result) {
					return '待选择';
				}
				if (this.result.hourStart === this.result.hourEnd) {
					hoursStr = `${this.result.hourStart}:00(${this.result.hoursStr})`
				} else {
					hoursStr = this.result.hoursStr;
				}

				// 显示今天/明天/后天 + 具体日期
				const day = this.days[this.dayActiveIndex];
				const displayText = day.displayText;

				// 提取日期部分（去掉括号里的星期）
				const datePart = displayText.split('（')[0];
				const weekPart = displayText.split('（')[1]?.replace('）', '') || '';

				return `预约${datePart} ${hoursStr} ${weekPart}`;
			}
		},
		methods: {
			// 获取星期几的中文表示
			getWeekDay(date) {
				const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
				return weekDays[date.getDay()];
			},

			// 插件初如化
			init() {
				let today = new Date();
				this.days = [];

				for (let i = 0; i < this.dayRange; i++) {
					const dateItem = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
					const month = dateItem.getMonth() + 1;
					const day = dateItem.getDate();
					const weekDay = this.getWeekDay(dateItem);

					let displayText = '';

					if (i === 0) {
						// 今天
						displayText = `今天（${weekDay}）`;
					} else if (i === 1) {
						// 明天
						displayText = `明天（${weekDay}）`;
					} else if (i === 2) {
						// 后天
						displayText = `后天（${weekDay}）`;
					} else {
						// 其他日期显示具体月日
						displayText = `${month}月${day}日（${weekDay}）`;
					}

					this.days.push({
						year: dateItem.getFullYear(),
						month: month,
						day: day,
						displayText: displayText,
						value: `${month}月${day}日`
					});
				}
			},
			// 切换月份
			toggleDay(index) {
				this.dayActiveIndex = index;
				this.hourActiveIndex = 0;
				this.$nextTick(() => {
					this.$emit('change', {
						result: this.result,
						form: 'day'
					});
				});
			},
			// 切换时间
			toggleHour(index) {
				this.hourActiveIndex = index;
				this.$nextTick(() => {
					this.$emit('change', {
						result: this.result,
						form: 'hour'
					});
					if (this.isAutoClose) {
						this.$emit('update:isShow', false);
					}
				});
			},
			// 确认按钮
			sure() {
				this.$emit('change', {
					result: this.result,
					form: 'sure'
				});
			},
			// 关闭弹窗方法
			close() {
				this.$emit('change', {
					result: this.result,
					form: 'close'
				});
				this.$emit('update:isShow', false);
			}
		}
	}
</script>
<style lang="scss" scoped>
	@keyframes showAni {
		0% {
			opacity: 0;
			transform: translateY(40%);
		}

		100% {
			transform: translateY(0);
			opacity: 1;
		}
	}

	.hbxw-timepicker {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 9999
	}

	.hbxw-timepicker-mask {
		background-color: rgba(0, 0, 0, var(--opacity));
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 9998;
	}

	.hbxw-timepicker-main {
		position: absolute;
		left: 0;
		bottom: 0;
		z-index: 9999;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 40rpx 40rpx 0 0;
		// background-color: #F7F9FA;
		background-color: white;
		transform-origin: center bottom;
		opacity: 0;

		&.hbxw-timepicker-main-ani {
			opacity: 0;
		}
	}

	.hbxw-timepicker-ani {
		.hbxw-timepicker-main-ani {
			animation: showAni .3s linear 0.1s 1 forwards;
		}
	}

	.hbxw-timepicker-title {
		width: 100%;
		display: flex;
		flex-direction: column;
		position: relative;
		padding: 39rpx 32rpx 27rpx 32rpx;
		box-sizing: border-box;
		border-bottom: 1px solid #DCDFE0;

		.hbxw-timepicker-title-main {
			font-size: 32rpx;
			font-weight: bold;
			line-height: 54rpx;
			color: #303133;
		}

		.hbxw-timepicker-title-subtitle {
			font-size: 25rpx;
			line-height: 48rpx;
			color: #606266;
		}

		.hbxw-timepicker-close {
			width: 24rpx;
			height: 24rpx;
			position: absolute;
			top: 27rpx;
			right: 27rpx;
		}
	}

	.hbxw-timepicker-content {
		display: flex;
		flex-direction: row;
		width: 100%;
		border-radius: 40rpx;
		height: 740rpx;
		overflow: hidden;
		background-color: white;
	}

	.hbxw-timerpicker-btn-wrap {
		width: 100%;
		height: 160rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		box-shadow: 0px -10rpx 36rpx 0px rgba(165, 165, 165, 0.12);
		background-color: white;
	}

	.hbxw-timerpicker-sure {
		width: 686rpx;
		height: 100rpx;
		background-color: #AAF24E;
		border-radius: 50rpx;
		text-align: center;
		font-size: 32rpx;
		line-height: 100rpx;
		font-weight: bold;
		color: #000;
	}

	.hbxw-timepicker-day {
		width: 200rpx;
		height: 100%;
		overflow-y: auto;
		background-color: #F7F9FA;

		.hbxw-timepicker-day-item {
			width: 100%;
			height: 110rpx;
			font-size: 22rpx;
			text-align: center;
			line-height: 110rpx;
			box-sizing: border-box;
			border-bottom: 1px solid #DCDFE0;
			color: #737E85;

			&:nth-last-of-type(1) {
				border-bottom-color: transparent;
			}
		}

		.hbxw-timepicker-day-item-active {
			font-weight: bold;
			border-bottom: 1px solid white;
			background-color: white;
			color: #0A3D28;
		}
	}

	.hbxw-timepicker-time {
		flex: 1;
		padding: 0 32rpx;
		height: 100%;
		overflow-y: auto;

		.hbxw-timepicker-time-item {
			height: 110rpx;
			flex: none;
			box-sizing: border-box;
			width: 100%;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid #EBEDF0;
		}

		.hbxw-timepicker-time-item-active {
			.hbxw-timepicker-time-val {
				color: #0A3D28;
			}

			.hbxw-timepicker-time-icon {
				background-color: #ffffff;

				.hbxw-timepicker-time-img {
					opacity: 1;
				}
			}
		}

		.hbxw-timepicker-time-val {
			font-size: 28rpx;
			color: #000;
		}

		.hbxw-timepicker-time-icon {
			width: 32rpx;
			height: 32rpx;
			box-sizing: border-box;
			border-radius: 50%;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			border: 1px solid #A2A4A6;

			.hbxw-timepicker-time-img {
				width: 22rpx;
				height: 22rpx;
				opacity: 0;
			}
		}
	}

	.hbxw-timepicker-notime {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.hbxw-timerpicker-nodata {
		font-size: 24rpx;
		color: #737E85;
	}
</style>