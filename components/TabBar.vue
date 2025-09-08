<template>
	<view class="footer">
		<wd-tabbar v-model="tabberValue" @change="change()">
			<wd-tabbar-item title="巡检" icon="file-unknown" name="onSiteInspection"></wd-tabbar-item>
			<wd-tabbar-item title="上报" icon="warning" name="report"></wd-tabbar-item>
			<wd-tabbar-item title="我的" icon="user" name="my"></wd-tabbar-item>
		</wd-tabbar>
	</view>
</template>
<script setup>
	import {
		onMounted,
		ref,
		watch
	} from 'vue'

	const props = defineProps({
		tabbar: {
			type: String,
			default: 'onSiteInspection'
		}
	});
	
	const tabberValue = ref();


	function change() {
		switch (tabberValue.value) {
			case "onSiteInspection": {
				uni.redirectTo({
					url: "/pages/inspectionTask/inspectionTask"
				});
				return;
			}
			case "report": {
				uni.redirectTo({
					url: "/pages/report/report"
				});
				return;
			}
			case "my": {
				uni.redirectTo({
					url: "/pages/my/my"
				});
				return;
			}
		}
	}
	
	onMounted(() => {
		tabberValue.value = props.tabbar;
	})
	
	
</script>

<style lang="scss" scoped>
	.footer {
		position: fixed;
		bottom: 0;
		right: 0;
		left: 0;
	}
</style>