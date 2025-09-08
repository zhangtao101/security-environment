<template>
	<view>
		<!-- form表单 -->
		<view v>
			<wd-form ref="form" :model="formstate" border>

				<wd-input align-right v-model="formstate.checkCode" label="检查编号" placeholder="" readonly />
				<wd-input align-right v-model="formstate.planCheckTime" label="计划开始时间" placeholder="" readonly />
				<wd-input align-right v-model="formstate.checkType" label="检查类别" placeholder="" readonly />
				<wd-input align-right v-model="formstate.checkCriteria" label="检查标准" placeholder="" readonly />
				<wd-input align-right v-model="formstate.checkUser" label="检查人" placeholder="" readonly />
				<wd-input align-right v-model="formstate.area" label="区域" placeholder="" readonly />
				<wd-input align-right v-model="formstate.content" label="内容" placeholder="" readonly />

				<wd-select-picker align-right label="巡检结果" v-model="formstate.result" :columns="resultList"
					:show-confirm="false" type="radio" prop="result"
					:rules="[{ required: true, message: '请选择巡检结果' }]"
					:disabled="formstate.state === 1" 
				></wd-select-picker>

				<wd-input align-right v-model="formstate.remark" label="备注" :disabled="formstate.state === 1" />

				<wd-input align-right v-model="formstate.sign" label="区域编码" suffix-icon="scan" readonly @click="scan()"
					prop="sign" :rules="[{ required: true, message: '请扫描区域编码' }]" :disabled="formstate.state === 1" />

				<wd-cell title="现场图片上传" top>
					<wd-upload v-model:file-list="fileList" image-mode="aspectFill" :action="action" :disabled="formstate.state === 1" ></wd-upload>
				</wd-cell>
				<view class="footer" v-if="formstate.state !== 1">
					<wd-button type="primary" size="large" @click="openReported" block v-if="formstate.result === 1" :disabled="formstate.isReport === 1">
						隐患上报
					</wd-button>
					<wd-button type="primary" size="large" @click="submit" block style="margin-top: 1rem;">提交</wd-button>
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
	import { useRoute } from 'vue-router';
	import { onLoad, onShow } from '@dcloudio/uni-app';

	import { useToast } from '@/uni_modules/wot-design-uni';
	
	import {
		request,
		setToken,
		setUserInfo
	} from '@/utils';
	import config from '@/config'; // 引入配置文件

	const editItemId = ref(-1);
	const { success: showSuccess } = useToast()
	

	// region form表单
	// form表单数据
	const formstate = ref();
	// 表单对象
	const form = ref();
	/**
	 * 查询详情
	 */
	function queryDetails() {
		request({
			url: `/${config.mesMain}/hazardcheck/execution/getBy/${editItemId.value}`,
			data: {
				area: '',
			},
			needAuth: true,
			method: 'GET'
		}).then((data) => {
			console.log(data);
			
			if(!data) data = {}
			data.result = ( data.result || data.result === 0 ) ? data.result : 1;
			if(data.photoList && data.photoList.length > 0) {
				fileList.value = [];
				data.photoList.forEach(item => {
					fileList.value.push({
						url: item,
					});
				})
			}
			formstate.value = data;
		});
	}
	/**
	 * 提交
	 */
	function submit() {
		form.value
			.validate()
			.then(({
				valid,
				errors
			}) => {
				if (valid) {
					const params = {
						...formstate.value
					};
					// 获取文件数据
					fileList.value.forEach(item => {
						params.photoList = [];
						if (item.response) {
							const urlMessage = JSON.parse(item.response);
							params.photoList.push(urlMessage.data);
						}
					});
					request({
						url: `/${config.mesMain}/hazardcheck/execution/update`, // 拼接URL: /mes-main/api/data
						data: params,
						needAuth: true,
						method: 'put'
					}).then((data) => {
						showSuccess({
							msg: '上报成功!'
						});
						uni.navigateBack({
							delta: 1,
						});
					});
				}
			})
			.catch((error) => {
				console.log(error, 'error')
			})
	}

	/**
	 * 打开上报页面
	 */
	function openReported() {
		uni.navigateTo({
			url: `/pages/hazardReporting/hazardReporting?testId=${formstate.value.id}`,
		});
	}
	// endregion

	// region 结果列表
	const resultList = [{
			label: '无隐患',
			value: 0,
		},
		{
			label: '有隐患',
			value: 1,
		},
	]
	// endregion


	// region 扫码

	function scan() {
		if(formstate.value.state === 1) return;
		// 允许从相机和相册扫码
		uni.scanCode({
			success: function(res) {
				console.log('条码类型：' + res.scanType);
				console.log('条码内容：' + res.result);
				formstate.value.sign = res.result;
			}
		});
	}

	// endregion

	// region 图片上传
	// 文件列表 url: 'https://img12.360buyimg.com//n0/jfs/t1/29118/6/4823/55969/5c35c16bE7c262192/c9fdecec4b419355.jpg'
	const fileList = ref([]);
	// 上传的地址
	const action = `${config.baseURL}/${config.mesMain}/accident/register/uploadFile`

	// endregion

	onLoad((option) => {
		// 获取查询字符串中的参数
		console.log('接收到的testId参数是：', option);
		editItemId.value = option.testId;
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