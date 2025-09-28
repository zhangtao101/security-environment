<template>
	<view>
		<!-- form表单 -->
		<view>
			<wd-form ref="form" :model="formstate" border>
				<wd-picker align-right prop="discoverer" :columns="columns" label="受伤人员" v-model="formstate.discoverer"
					:column-change="onChangeDistrict" @confirm="test" placeholder="请选择上报人员"
					:rules="[{ required: true, message: '请选择上报人员' }]" />
				<wd-datetime-picker label="发生时间" align-right v-model="formstate.time" prop="time"
					:rules="[{ required: true, message: '请填写发生时间' }]" />
					
				<wd-picker 
					align-right 
					:columns="accidentType" 
					label="事故类型" 
					v-model="formstate.type" 
					prop="type" 
					:rules="[{ required: true, message: '请选择事故类型' }]" 
				/>

				<wd-textarea label="事件描述" v-model="formstate.eventDescription" placeholder="请填写详细的事件描述" :maxlength="300" clearable
					show-word-limit prop="eventDescription" :rules="[{ required: true, message: '请填写详细的事件描述' }]" />


				<wd-select-picker align-right :columns="injuredPart" label="受伤部位" v-model="formstate.injuredPartList"
					prop="injuredPartList" :rules="[{ required: true, message: '请选择受伤部位' }]" />
				<wd-textarea label="受伤情况描述" v-model="formstate.injuredDescription" placeholder="" :maxlength="300" clearable
					show-word-limit />

				<wd-select-picker align-right :columns="injuryTypes" label="伤害类型" v-model="formstate.injuredTypeList" />
					
				<wd-cell title="附件上传" top>
					<wd-upload v-model:file-list="photoList" multiple image-mode="aspectFill" :action="action"></wd-upload>
				</wd-cell>
				
				<wd-picker align-right prop="managerItem" :columns="columns" label="责任部门主管"
					v-model="formstate.managerItem" :column-change="onChangeDistrict" @confirm="changeManager"
					placeholder="请选择责任部门主管" :rules="[{ required: true, message: '请选择责任部门主管' }]" />
					
				<wd-textarea label="事故原因" v-model="formstate.reason" placeholder="" :maxlength="200" clearable
					show-word-limit />
				<wd-textarea label="整改措施" v-model="formstate.measures" placeholder="" :maxlength="200" clearable
					show-word-limit />
				<view class="footer">
					<wd-button type="primary" size="large" @click="submit" block class="footer_button">提交</wd-button>
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
		ref,
		getCurrentInstance,
	} from 'vue';
	import {
		request,
		setToken,
		setUserInfo,
		flattenTree,
		formatDate,
		showSuccess
	} from '@/utils'
	import config from '@/config'; // 引入配置文件

	// region form表单
	// form表单数据
	const formstate = ref({
		discoverTime: '',
		discoverer: []
	});
	const form = ref();

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
					};
					params.time = formatDate(params.time);
					params.fileList = [];
					// 获取图片数据
					photoList.value.forEach(item => {
						if (item.response) {
							const urlMessage = JSON.parse(item.response);
							params.fileList.push(urlMessage.data);
						} else {
							params.fileList.push(item.url);
						}
					});
					const url = `/${config.mesMain}/accident/register/insert`
						
					request({
						url,
						data: params,
						needAuth: true,
						method: 'POST'
					}).then((data) => {
						showSuccess({
							msg: '上报成功!'
						});
						setTimeout(() => {
							uni.navigateBack({
								delta: 1,
							});
						}, 500);
					});
				}
			})
			.catch((error) => {
				console.log(error, 'error')
			})
	}

	// endregion
	
	// region 事故类型
	
	const accidentType = ref([
		{
			label: '特别重大事故(I级)',
			value: 1,
		},
		{
			label: '重大事故(II级)',
			value: 2,
		},
		{
			label: '较大事故(III级)',
			value: 3,
		},
		{
			label: '一般事故(IV级)',
			value: 4,
		},
	]);
	
	// endregion

	// region 人员选择

	const columns = ref([
		[{
			label: '请选择',
			value: -1
		}],
		[{
			label: '请选择',
			value: -1
		}],
	]);
	/**
	 * 组织改变后查询用户并赋值
	 * @param {Object} pickerView
	 * @param {Object} value
	 * @param {Object} columnIndex
	 * @param {Object} resolve
	 */
	function onChangeDistrict(pickerView, value, columnIndex, resolve) {
		const item = value[columnIndex]
		if (columnIndex === 0) {
			listSysPerson(item.value, (arr) => {
				pickerView.setColumnData(1, arr);
			})
			// pickerView.setColumnData(2, district[district[item.value][0].value])
		}
	}

	function test({
		value,
		selectedItems: [v, item]
	}) {
		formstate.value.injuredUser = item.perName;
		formstate.value.worknumber = item.workNumber;
		formstate.value.depatment = item.orgName;
		formstate.value.position = item.stationName;
	}

	function changeManager({
		value,
		selectedItems: [v, item]
	}) {
		formstate.value.manager = item.perName;
	}

	/**
	 * 查询组织树
	 */
	function queryTree() {
		request({
			url: `/${config.mesUser}/sys/organization/listTree`, // 拼接URL: /mes-main/api/data
			data: {},
			needAuth: true,
			method: 'GET'
		}).then((data) => {
			const arr = flattenTree([data]);
			if (arr.length > 0) {
				columns.value[0] = [{
					label: '请选择',
					value: -1
				}];
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
		}).then(({
			list
		}) => {
			const arr = [{
				label: '请选择',
				value: -1
			}];
			if (list.length > 0) {
				list.forEach(item => {
					arr.push({
						...item,
						label: item.perName,
						value: item.perName,
					});
				});
			}
			callback(arr);
		});
	}

	// endregion

	// region 受伤类型

	const injuredPart = ref([{
			label: '手',
			value: '手',
		},
		{
			label: '脚',
			value: '脚',
		},
		{
			label: '头',
			value: '头',
		},
		{
			label: '眼睛',
			value: '眼睛',
		},
		{
			label: '面部',
			value: '面部',
		},
		{
			label: '腰',
			value: '腰',
		},
		{
			label: '腿',
			value: '腿',
		},
		{
			label: '胳膊',
			value: '胳膊',
		},
		{
			label: '躯干',
			value: '躯干',
		},
		{
			label: '其他',
			value: '其他',
		},
	]);

	// endregion

	// region 伤害类型

	const injuryTypes = ref([{
			label: '机械伤害',
			value: '机械伤害',
		},
		{
			label: '化学伤害',
			value: '化学伤害',
		},
		{
			label: '物理伤害',
			value: '物理伤害',
		},
		{
			label: '生物伤害',
			value: '生物伤害',
		},
		{
			label: '电气伤害',
			value: '电气伤害',
		},
		{
			label: '运动伤害',
			value: '运动伤害',
		},
		{
			label: '热伤害及温度伤害',
			value: '热伤害及温度伤害',
		},
	]);
	// endregion

	// region 隐患等级
	const hazardLevel = ref([{
			label: '一级',
			value: '一级'
		},
		{
			label: '二级',
			value: '二级'
		},
		{
			label: '三级',
			value: '三级'
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
				formstate.value.type1 = res.result;
			}
		});
	}

	// endregion

	// region 图片上传
	// 图片文件列表
	const photoList = ref([]);
	// 上传的地址
	const action = `${config.baseURL}/${config.mesMain}/accident/register/uploadFile`

	// endregion

	onMounted(() => {
		formstate.value.time = new Date().getTime()
		queryTree();
	})
</script>

<style lang="scss" scoped>
.footer_button {
	margin-bottom: 20rem !important;
}
.footer {
	height: 5rem;
}
</style>