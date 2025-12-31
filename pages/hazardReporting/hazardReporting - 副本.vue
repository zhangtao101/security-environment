<template>
	<view class="uni-app--wrapper">
		<!-- form表单 -->
		<view>
			<wd-form ref="form" :model="formstate" border>
				<!-- formstate.discoverer -->
				<wd-cell title="上报人员" top>
					<wd-button type="primary" @click="isShowUserDrawer = true" block>选择人员</wd-button>
				</wd-cell>
				<wd-datetime-picker label="上报时间" align-right v-model="formstate.discoverTime" prop="discoverTime"
					:rules="[{ required: true, message: '请填写上报时间' }]" readonly />
				<wd-picker align-right :columns="hiddenDangerType" label="隐患类型" v-model="formstate.hazardType"
					prop="hazardType" :rules="[{ required: true, message: '请选择隐患类型' }]" />
				<wd-input align-right v-model="formstate.location" label="发现区域" suffix-icon="scan" readonly
					@click="scan()" prop="location" :rules="[{ required: true, message: '请选择发现区域' }]" />
				<wd-textarea label="问题描述" v-model="formstate.description" placeholder="请填写详细的问题描述" :maxlength="300"
					clearable show-word-limit prop="description" :rules="[{ required: true, message: '请填写详细的问题描述' }]" />
				<wd-input align-right v-model="formstate.hazardSource" label="隐患来源" prop="hazardSource"
					:rules="[{ required: false, message: '请输入隐患来源' }]" />
				<wd-picker align-right :columns="hazardLevel" label="隐患等级" v-model="formstate.level" prop="level"
					:rules="[{ required: false, message: '请选择隐患等级' }]" />
				<wd-cell title="现场图片上传" top>
					<wd-upload v-model:file-list="fileList" image-mode="aspectFill" :action="action"
						multiple></wd-upload>
				</wd-cell>
				<view class="footer">
					<wd-button type="primary" size="large" @click="submit" block>提交</wd-button>
				</view>
			</wd-form>
		</view>
		
		<wd-overlay :show="isShowUserDrawer" @click="isShowUserDrawer = false">
		  <view class="wrapper">
		    <view class="block" @click.stop="">
				<wd-input v-model="userKey" @confirm="queryUserTimeout()" />
				<wd-radio-group v-model="userChecked">
					<wd-radio :value="item.value" v-for="item of userArr" :key="item.value">{{ item.label }}</wd-radio>
				</wd-radio-group>
				<wd-button type="primary" style="margin-top: 1em;" @click="selectChange" block>确定</wd-button>
			</view>
		  </view>
		</wd-overlay>
		
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
	import {
		onLoad
	} from '@dcloudio/uni-app';
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
					params.photoList = [];
					// 获取文件数据
					fileList.value.forEach(item => {
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
	
	const userArr = ref([{ label: '123', value: '123'}]);
	const isShowUserDrawer = ref(false);
	const userKey = ref('');
	const userChecked = ref('');
	let userTimeoutId;
	/**
	 * 防抖查询
	 */
	function queryUserTimeout() {
		console.log(123)
		clearTimeout(userTimeoutId);
		userTimeoutId = setTimeout(() => {
			listSysPerson(userKey.value);
		}, 500);
	}

	/**
	 * 查询用户
	 * @param {Object} perName 用户名
	 */
	function listSysPerson(perName) {
		console.log(perName)
		request({
			url: `/${config.mesUser}/sys/person/listSysPerson`, // 拼接URL: /mes-main/api/data
			data: {
				perName,
				pageNum: 1, // 当前页码。
				pageSize: 999, // 每页显示的数据条数。
			},
			needAuth: true,
			method: 'GET'
		}).then(({
			list
		}) => {
			userArr.value = [
				{
					label: perName,
					value: perName,
				}
			];
			if (list.length > 0) {
				list.forEach(item => {
					userArr.value.push({
						label: item.perName,
						value: item.perName,
					});
				});
			}
		});
	}
	
	/**
	 * 选中用户
	 */
	function selectChange(){
		console.log(123);
	} 

	// endregion

	// region 隐患类型

	const hiddenDangerType = ref([{
			label: '安全',
			value: '安全',
		},
		{
			label: '环境',
			value: '环境',
		},
		{
			label: '职业健康',
			value: '职业健康',
		},
		{
			label: '消防',
			value: '消防',
		},
		{
			label: '其他',
			value: '其他',
		},
	]);

	// endregion

	// region 隐患等级
	const hazardLevel = ref([{
			label: '一般隐患',
			value: 1
		},
		// {
		// 	label: '严重隐患',
		// 	value: 2
		// },
		// {
		// 	label: '较大隐患',
		// 	value: 3
		// },
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
	})
	onLoad((option) => {
		// 获取查询字符串中的参数
		console.log('接收到的testId参数是：', option);
		editItemId.value = option.testId;
	});
</script>

<style>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  z-index: 999999;
}

.block {
  width: 90%;
  height: 70%;
  background-color: #fff;
  z-index: 999999;
  padding: 1em;
  border-radius: 1em;
}
</style>