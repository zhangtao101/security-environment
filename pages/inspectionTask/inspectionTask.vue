<template>
	<view class="uni-app--wrapper">
		<wd-text text="巡检任务" size="24px" style="margin-left: 1em;padding-left: 1em; border-left: 5px solid #2e7bfd;"></wd-text>

		<view class="icon_view">
			
			<view class="icon_view_item" @click="todo('1')">
				<image src="@/static/xunjian.svg" />
				隐患巡检
			</view>
			<view class="icon_view_item" @click="todo('2')">
				<image src="@/static/fengxian.svg" />
				风险巡检
			</view>
		</view>

		<TabBarVue></TabBarVue>
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
	import config from '@/config'; // 引入配置文件
	import TabBarVue from '../../components/TabBar.vue';

	function todo(type) {
		switch (type) {
			case '1': {
				uni.navigateTo({
					url: `/pages/onSiteInspection/onSiteInspection`
				});
				break;
			}
			case '2': {
				uni.navigateTo({
					url: `/pages/riskInspection/riskInspection`
				});
				break;
			}
		}
	}
</script>

<style lang="scss">
	.icon_view {
		display: flex;
		flex-wrap: wrap;
		.icon_view_item {
			width: 128px;
			display: flex;
			flex-direction: column;
			align-items: center;
			margin: 1em;
			font-size: 0.75em;
			
			image {
				margin-bottom: 1em;
				width: 48px;
				height: 48px;
				display: block;
			}
		}
	}
</style>