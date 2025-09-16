<template>
	<view>
		<!-- form表单 -->
		<view v>
			<wd-form ref="form" :model="formstate" border disabled v>
				<wd-input align-right v-model="formstate.planCheckTime" label="计划开始时间" readonly />
				<wd-input align-right v-model="formstate.checkType" label="检查类别" readonly />
				<wd-input align-right v-model="formstate.checkCriteria" label="检查标准" readonly />
				<wd-input align-right v-model="formstate.checkUser" label="检查人" readonly />
				<wd-input align-right v-model="formstate.area" label="区域" readonly />
				<wd-input align-right v-model="formstate.content" label="内容" readonly />

				<wd-select-picker align-right label="巡检结果" v-model="formstate.result" :columns="resultList"
					:show-confirm="false" type="radio" prop="sign" :rules="[{ required: true, message: '请选扫描区域编码' }]"
					:disabled="formstate.state === 1"
				></wd-select-picker>
				<wd-cell title="备注" top>
					<wd-textarea v-model="formstate.remark" :disabled="formstate.state === 1"></wd-textarea>
				</wd-cell>

				<wd-input align-right v-model="formstate.sign" label="区域编码" suffix-icon="scan" readonly @click="scan()"
					prop="sign" :rules="[{ required: true, message: '请选扫描区域编码' }]" />

				<wd-cell title="现场图片上传" top>
					<wd-upload v-model:file-list="fileList" image-mode="aspectFill" :action="action"
						:disabled="formstate.state === 1"></wd-upload>
				</wd-cell>
				<view class="footer" v-if="formstate.state !== 1">
					<wd-button type="primary" size="large" @click="openReported" block v-if="formstate.result === 1" :disabled="formstate.isReport === 1">
						隐患上报
					</wd-button>
					<wd-button type="primary" size="large" @click="submit" block style="margin-top: 1rem;" :disabled="formstate.result === 1 && formstate.isReport !== 1">提交</wd-button>
				</view>
			</wd-form>
		</view>
		<wd-message-box />
		<wd-toast />
	</view>
</template>

<script setup>
	import {
		onMounted,
		getCurrentInstance,
		ref
	} from 'vue';
	import {
		useToast
	} from '@/uni_modules/wot-design-uni';
	import { onPullDownRefresh, onShow } from '@dcloudio/uni-app';
	import {
		request,
		setToken,
		setUserInfo
	} from '@/utils';
	import config from '@/config'; // 引入配置文件

	const editItemId = ref(-1);
	const {
		success: showSuccess
	} = useToast()


	// region form表单
	// form表单数据
	const formstate = ref();
	const form = ref();
	
	const taskId = ref();
	

	function submit() {
		form.value
			.validate()
			.then(({
				valid,
				errors
			}) => {
				if (valid) {
					const url = `/${config.mesMain}/riskcheck/execution/update`
						
					request({
						url,
						data: formstate.value,
						needAuth: true,
						method: 'PUT'
					}).then((data) => {
						showSuccess({
							msg: '上报成功!'
						});
						queryDetails();
					});
				}
			})
			.catch((error) => {
				console.log(error, 'error')
			})
	}
	
	function openReported() {
		uni.navigateTo({
			url: `/pages/riskReporting/riskReporting`,
			success(res) {
				res.eventChannel.emit('acceptDataFromOpenerPage', { id: formstate.value.id })
			}
		});
	}

	// endregion

	// region 结果列表
	const resultList = [{
			label: '无风险',
			value: 0,
		},
		{
			label: '有风险',
			value: 1,
		},
	]
	// endregion


	// region 扫码

	function scan() {
		if (formstate.value.state !== 1) {
			// 允许从相机和相册扫码
			uni.scanCode({
				success: function(res) {
					console.log('条码类型：' + res.scanType);
					console.log('条码内容：' + res.result);
					formstate.value.sign = res.result;
				}
			});
		}
	}

	// endregion

	// region 图片上传
	// 文件列表
	const fileList = ref([]);
	// 上传的地址
	const action = `${config.baseURL}/${config.mesMain}/accident/register/uploadFile`

	// endregion
	
	// 查询详情
	function queryDetails() {
		request({
			url: `/${config.mesMain}/riskcheck/execution/getBy/${taskId.value}`,
			data: {},
			needAuth: true,
			method: 'GET'
		}).then((data) => {
			if(!data) data = {}
			data.result = ( data.result || data.result === 0 ) ? data.result : 1;
			if (!formstate.value) {
				fileList.value = [];
				if(data.photoList && data.photoList.length > 0) {
					data.photoList.forEach(item => {
						fileList.value.push({
							url: item,
						});
					})
				}
				formstate.value = data;
			} else {
				formstate.value.isReport = data.isReport;
			}
		}).finally(() => {
			 uni.stopPullDownRefresh();
		});
	}

	onMounted(() => {
		const instance = getCurrentInstance().proxy
		const eventChannel = instance.getOpenerEventChannel();
		eventChannel.on('acceptDataFromOpenerPage', function(data) {
			console.log(data, data.id)
			taskId.value = data.id;
			queryDetails();
		})
	})
	
	onPullDownRefresh(() => {
		queryDetails();
	});

	onShow(() => {
		if(formstate.value) {
			queryDetails();
		}
	});
</script>

<style>

</style>