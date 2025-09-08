<template>
	<view style="margin-top: 1em;">
		<wd-cell-group>
			<wd-cell title="隐患巡检">
				<wd-icon name="arrow-right" size="22px" style="line-height: 2em;" center @click="todo('1')"></wd-icon>
			</wd-cell>
			<wd-cell title="风险巡检">
				<wd-icon name="arrow-right" size="22px" style="line-height: 2em;" center @click="todo('2')"></wd-icon>
			</wd-cell>
		</wd-cell-group>

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

<style>

</style>