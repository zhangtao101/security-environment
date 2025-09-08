<template>
	<view style="margin-top: 1em;">
		<wd-cell-group>
			<wd-cell title="隐患上报">
				<wd-icon name="arrow-right" size="22px" style="line-height: 2em;" center @click="todo('1')"></wd-icon>
			</wd-cell>
			<!-- <wd-cell title="风险上报">
				<wd-icon name="arrow-right" size="22px" style="line-height: 2em;" center @click="todo('2')"></wd-icon>
			</wd-cell> -->
			<wd-cell title="事故上报">
				<wd-icon name="arrow-right" size="22px" style="line-height: 2em;" center @click="todo('3')"></wd-icon>
			</wd-cell>
		</wd-cell-group>

		<TabBarVue tabbar='report'></TabBarVue>
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
					url: `/pages/hazardReporting/hazardReporting`
				});
				break;
			}
			case '2': {
				uni.navigateTo({
					url: `/pages/riskInspection/riskInspection`,
				});
				break;
			}
			case '3': {
				uni.navigateTo({
					url: `/pages/accidentReport/accidentReport`
				});
				break;
			}
		}
	}
</script>

<style>

</style>