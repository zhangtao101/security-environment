<template>
	<view style="margin-top: 1em;">
		<wd-cell-group>
			<wd-cell v-for="(item, index) of inspectionTaskList" :key="index">
				<template #title>
					<view>
						<view>
							{{ item.area }}
						</view>
						<view style="display: inline-block; color: #7f7f7f;font-size: 15rpx;">
							{{ item.checkCode }}
							<wd-tag custom-class="space" type="primary">{{ item.checkType }}</wd-tag>
						</view>
						<view class="status" :class="item.state ? 'success' : 'notStarted'">
							{{ item.state ? '已完成' : '未开始'}}
						</view>
					</view>
				</template>
				<wd-icon name="arrow-right" size="22px" style="line-height: 2em;" @click="toDetails(item)"></wd-icon>
			</wd-cell>
		</wd-cell-group>


		<wd-message-box />
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		onMounted,
		ref
	} from 'vue';
	import {
		request,
		setToken,
		setUserInfo
	} from '@/utils';
	import { onPullDownRefresh } from '@dcloudio/uni-app';
	import config from '@/config'; // 引入配置文件


	const inspectionTaskList = ref([]);
	/**
	 * 查询列表数据
	 */
	function queryDate() {
		Promise.all([
			request({
				url: `/${config.mesMain}/hazardcheck/execution/taskList`,
				data: {
					area: '',
				},
				needAuth: true,
				method: 'GET'
			}),
			request({
				url: `/${config.mesMain}/hazardcheck/execution/taskListEd`,
				data: {
					area: '',
				},
				needAuth: true,
				method: 'GET'
			})
		]).then(([d1, d2]) => {
			inspectionTaskList.value = [
				...d1.list,
				...d2.list,
			]
			console.log(inspectionTaskList.value)
		}).finally(() => {
			 uni.stopPullDownRefresh();
		});
		
	}

	/**
	 * 跳转详情页
	 */
	function toDetails(deteils) {
		uni.navigateTo({
			url: `/pages/inspectionDetails/inspectionDetails?testId=${deteils.id}`
		});
	}

	onMounted(() => {
		queryDate()
	})
	
	onPullDownRefresh(() => {
		queryDate();
	});
</script>

<style lang="scss">
	.status {
		font-size: 15rpx;
		color: #7f7f7f;
		padding-left: 1em;

		&.success {
			position: relative;

			&::before {
				content: '';
				width: 10rpx;
				height: 10rpx;
				position: absolute;
				border-radius: 100%;
				top: 30%;
				left: 0;
				background-color: #2eff00;
				// 
			}
		}

		&.notStarted {
			position: relative;

			&::before {
				content: '';
				width: 10rpx;
				height: 10rpx;
				position: absolute;
				border-radius: 100%;
				top: 30%;
				left: 0;
				background-color: #7f7f7f;
				// 
			}
		}
	}

	.space {
		margin-left: 1em;
	}
</style>