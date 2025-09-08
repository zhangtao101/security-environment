<template>
	<view>
		<!-- form表单 -->
		<view>
			<wd-form ref="form" :model="formstate" border>
				<wd-picker
					align-right
					prop="discoverer" 
					:columns="columns" 
					label="上报人员" 
					v-model="formstate.discoverer"
					:column-change="onChangeDistrict" 
					placeholder="请选择上报人员"
					:rules="[{ required: true, message: '请选择上报人员' }]" 
				/>
				<wd-datetime-picker 
					label="上报时间" 
					align-right 
					v-model="formstate.discoverTime"
					prop="discoverTime" 
					:rules="[{ required: true, message: '请填写上报时间' }]" 
					readonly
				/>
				<wd-picker 
					align-right 
					:columns="hiddenDangerType" 
					label="隐患类型" 
					v-model="formstate.hazardType" 
					prop="hazardType" 
					:rules="[{ required: true, message: '请选择隐患类型' }]" 
				/>
				<wd-input
				  align-right
				  v-model="formstate.location"
				  label="发现区域"
				  suffix-icon="scan"
				  readonly
				  @click="scan()"
				  prop="location"
				  :rules="[{ required: true, message: '请选择发现区域' }]"
				/>
				<wd-textarea
					label="问题描述"
					v-model="formstate.description" 
					placeholder="请填写详细的问题描述" 
					:maxlength="300"
					clearable 
					show-word-limit 
					prop="description"
					:rules="[{ required: true, message: '请填写详细的问题描述' }]" 
				/>
				<wd-input
				  align-right
				  v-model="formstate.hazardSource"
				  label="隐患来源"
				  prop="hazardSource"
				  :rules="[{ required: true, message: '请输入隐患来源' }]"
				/>
				<wd-picker 
					align-right 
					:columns="hazardLevel" 
					label="隐患等级" 
					v-model="formstate.level" 
					prop="level"
					:rules="[{ required: true, message: '请选择隐患等级' }]"
				/>
				<wd-cell title="现场图片上传" top>
					<wd-upload
						v-model:file-list="fileList" 
						image-mode="aspectFill" 
						:action="action"
					></wd-upload>
				</wd-cell>
				<view class="footer">
					<wd-button type="primary" size="large" @click="submit" block>提交</wd-button>
				</view>
			</wd-form>
		</view>
		<wd-message-box />
		<wd-toast />
	</view>
</template>

<script setup>
	import TabBarVue from '../../components/TabBar.vue';
	import {
		onMounted,
		ref
	} from 'vue';
	import { onLoad } from '@dcloudio/uni-app';
	import { request, setToken, setUserInfo, flattenTree, formatDate, showSuccess } from '@/utils'
	import config from '@/config'; // 引入配置文件

	// region form表单
	// form表单数据
	const formstate = ref({
		discoverTime: '',
		discoverer: []
	});
	const form = ref();
	const editItemId = ref();
	
	function submit() {
		form.value
			.validate()
			.then(({
				valid,
				errors
			}) => {
				if (valid) {
					const params = {
						...formstate.value,
						executionId: editItemId.value,
					};
					params.discoverTime = formatDate(params.discoverTime);
					params.discoverer = params.discoverer[1];
					// 获取文件数据
					fileList.value.forEach(item => {
						params.photoList = [];
						if (item.response) {
							const urlMessage = JSON.parse(item.response);
							params.photoList.push(urlMessage.data);
						} else {
							params.photoList.push(item.url);
						}
					});
					const url = `/${config.mesMain}/hazard/report/insert`
						
					request({
						url,
						data: params,
						needAuth: true,
						method: 'POST'
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

	// endregion
	
	// region 人员选择
	
	const columns = ref([
		[
			{label: '请选择', value: -1}
		],
		[
			{label: '请选择', value: -1}
		],
	]);
	
	function onChangeDistrict(pickerView, value, columnIndex, resolve) {
		const item = value[columnIndex]
		if (columnIndex === 0) {
			listSysPerson(item.value, (arr) => {
				pickerView.setColumnData(1, arr);
			})
			// pickerView.setColumnData(2, district[district[item.value][0].value])
		} 
	}
	
	function displayFormat() {
		
	}
	
	function queryTree() {
		request({
			url: `/${config.mesUser}/sys/organization/listTree`, // 拼接URL: /mes-main/api/data
			data: {},
			needAuth: true,
			method: 'GET'
		}).then((data) => {
			const arr = flattenTree([data]);
			if (arr.length > 0) {
				columns.value[0] = [
					{label: '请选择', value: -1}
				];
				arr.forEach(item => {
					columns.value[0].push({
						label: item.orgFullName,
						value: item.orgCode,
					});
				});
			}
		});
	}
	
	
	function listSysPerson(orgCode, callback) {
		request({
			url: `/${config.mesUser}/sys/person/listSysPerson`, // 拼接URL: /mes-main/api/data
			data: {
				orgCode,
				pageNum: 1, // 当前页码。
				pageSize: 999, // 每页显示的数据条数。
			},
			needAuth: true,
			method: 'GET'
		}).then(({list}) => {
			const arr = [
				{label: '请选择', value: -1}
			];
			if (list.length > 0) {
				list.forEach(item => {
					arr.push({
						label: item.perName,
						value: item.perName,
					});
				});
			}
			callback(arr);
		});
	}
	
	// endregion
	
	// region 隐患类型
	
	const hiddenDangerType = ref([
		{
			label: '安全',
			value: '安全',
		},
		{
			label: '环境',
			value: '环境',
		},
		{
			label: '健康',
			value: '健康',
		},
		{
			label: '其他',
			value: '其他',
		},
	]);
	
	// endregion
	
	// region 隐患等级
	const hazardLevel = ref([
		{
			label: '一般隐患',
			value: 1
		},
		{
			label: '严重隐患',
			value: 2
		},
		{
			label: '较大隐患',
			value: 3
		},
		{
			label: '重大隐患',
			value: 4
		},
	]);
	// endregion
	
	// region 扫码
	
	function scan() {
		// 允许从相机和相册扫码
		uni.scanCode({
			success: function(res) {
				console.log('条码类型：' + res.scanType);
				console.log('条码内容：' + res.result);
				formstate.value.location = res.result;
			}
		});
	}
	
	// endregion
	
	// region 图片上传
	// 文件列表
	const fileList = ref([]);
	// 上传的地址
	const action = `${config.baseURL}/${config.mesMain}/accident/register/uploadFile`
	
	// endregion

	onMounted(() => {
		formstate.value.discoverTime = new Date().getTime()
		queryTree();
	})
	onLoad((option) => {
		// 获取查询字符串中的参数
		console.log('接收到的testId参数是：', option);
		editItemId.value = option.testId;
	});
</script>

<style>

</style>