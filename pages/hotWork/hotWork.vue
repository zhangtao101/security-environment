<template>
	<view>
		<!-- form表单 -->
		<view>
			<wd-form ref="form" :model="formstate" border>
				<wd-picker 
					align-right 
					:columns="applyDepartments" 
					label="申请部门" 
					v-model="formstate.department" 
					@confirm="queryLocations"
				/>
				<wd-input
					align-right
					label="部门管理员" 
					type="text" 
					v-model="formstate.departSupervisor" 
					readonly
				/>
				<wd-input
					align-right
					label="动火车间" 
					type="text" 
					v-model="formstate.workshop" 
				/>
				<wd-picker
					align-right
					prop="location" 
					:columns="hotWorkLocations" 
					label="动火部位" 
					v-model="formstate.location"
					placeholder="请选择动火部位"
					:disabled="!formstate.department"
					:rules="[{ required: true, message: '请选择动火部位' }]" 
				/>
				<wd-picker 
					align-right 
					:columns="level" 
					label="动火级别" 
					v-model="formstate.level" 
				/>
				<wd-datetime-picker 
					label="动火时间" 
					align-right 
					v-model="formstate.dateTime"
					:rules="[{ required: true, message: '请填写动火时间' }]" 
				/>
				<wd-textarea
					align-right
					label="动火内容"
					v-model="formstate.content" 
					placeholder="请填写详细的动火内容" 
					:maxlength="300"
					clearable 
					show-word-limit 
				/>
				<wd-input
					align-right
					label="动火设备"
					v-model="formstate.equipment" 
					placeholder="请填写详细的动火设备" 
					clearable 
				/>
				<wd-select-picker 
					align-right
					label="危险源识别" 
					v-model="formstate.hazardsourceIdentificationList" 
					:columns="hazardSources" 
				></wd-select-picker>
				<wd-input
					align-right
					label="危险源识别-其他" 
					type="text" 
					v-model="formstate.hazardsourceIdentificationList_other" 
					v-if="formstate.hazardsourceIdentificationList && formstate.hazardsourceIdentificationList.includes('其他')"
					placeholder="用英文状态的,分隔"
				/>
				
				<wd-select-picker 
					align-right
					label="危险辨识" 
					v-model="formstate.hazardIdentificationList" 
					:columns="warringType" 
				></wd-select-picker>
				<wd-input
					align-right
					label="危险辨识-其他" 
					type="text" 
					v-model="formstate.hazardIdentificationList_other" 
					v-if="formstate.hazardIdentificationList && formstate.hazardIdentificationList.includes('其他')"
					placeholder="用英文状态的,分隔"
				/>
				
				<wd-cell title="安全措施确认" top>
					<wd-button @click="open"> 安全措施确认 </wd-button>
				</wd-cell>
				<wd-input
					align-right
					label="动火人" 
					type="text" 
					v-model="formstate.hotworkUser" 
				/>
				<wd-input
					align-right
					label="特种作业操作证号或工作证号" 
					type="text" 
					v-model="formstate.certificateCode" 
					placeholder="请输入"
				/>
				<wd-input
					align-right
					label="现场监护人" 
					type="text" 
					v-model="formstate.guardian" 
					placeholder="请输入"
				/>
				<wd-input
					align-right
					label="现场指挥" 
					type="text" 
					v-model="formstate.siteSupervisor" 
					placeholder="请输入"
				/>
				
				
				<wd-cell title="资料上传(图片)" top>
					<wd-upload
						v-model:file-list="photoList" 
						image-mode="aspectFill" 
						:action="action"
					></wd-upload>
				</wd-cell>
				
				<wd-cell title="资料上传(文件)" top>
					<wd-upload
						v-model:file-list="fileList" 
						 accept="all" multiple
						:action="action"
					></wd-upload>
				</wd-cell>
				
				
				<view class="footer">
					<wd-button type="primary" size="large" @click="submit" block :loading="submitLoading">提交</wd-button>
				</view>
			</wd-form>
		</view>
		
		<!-- 安全措施确认 -->
		<wd-popup 
			v-model="show" 
			position="bottom"
			:close-on-click-modal="false" 
			closable 
			custom-style="height: 60%;"
			@close="handleClose"
			class='security_measure'
		>
		
			<view class='security_measure_view'>
				<wd-row class="security_measure_header">
					<wd-col :span="2"><view>序号</view></wd-col>
					<wd-col :span="13"><view>安全措施</view></wd-col>
					<wd-col :span="9"><view>确认</view></wd-col>
				</wd-row>
				
				<wd-row class="security_measure_row" v-for="(item, index) of securityMeasuresList" :key="index">
					<wd-col :span="2" class="security_measure_item">
						<view>{{ index + 1 }}</view>
					</wd-col>
					<wd-col :span="13" class="security_measure_item">
						<view>{{ item.securityMeasure }}</view>
					</wd-col>
					<wd-col :span="9" class="security_measure_item">
						<wd-radio-group v-model="item.confirm" shape="dot" inline>
							<wd-radio :value="true">通过</wd-radio>
							<wd-radio :value="false">不通过</wd-radio>
						</wd-radio-group>
					</wd-col>
				</wd-row>
			
				<wd-textarea
					align-right
					label="备注"
					v-model="securityMeasuresRemark" 
					placeholder="请填写备注信息" 
					:maxlength="300"
					clearable 
					show-word-limit 
					style="margin-top: 1rem;"
				/>
				
				<view class="footer">
					<wd-button type="primary" size="large" @click="confirm" bloc>确认</wd-button>
				</view>
			</view>
		</wd-popup>

		<!-- endregion -->
		
		<wd-message-box />
		<wd-toast />
	</view>
</template>

<script setup>
	import { pause } from '@/uni_modules/wot-design-uni/components/common/util'
	import { useToast } from '@/uni_modules/wot-design-uni'


	import TabBarVue from '../../components/TabBar.vue';
	import { request, setToken, setUserInfo, formatDate, base64ToFile, showSuccess } from '@/utils'
	import config from '@/config'; // 引入配置文件
	import {
		onMounted,
		ref
	} from 'vue';

	// region form表单
	// form表单数据
	const formstate = ref({
		dateTime: [Date.now(),''],
		hazardsourceIdentificationList: ['其他'],
		hazardIdentificationList: ['其他'],
		type: '',
	});
	const form = ref();
	const submitLoading = ref(false);
	
	function submit() {
		form.value.validate().then(() => {
			const params = {
				...formstate.value,
			};
			// params.department = params.workshop;
			
			if(params.hazardsourceIdentificationList && params.hazardsourceIdentificationList.includes('其他') && params.hazardsourceIdentificationList_other) {
				params.hazardsourceIdentificationList = [
					...params.hazardsourceIdentificationList,
					...params.hazardsourceIdentificationList_other.split(',')
				]
			}
			
			if(params.hazardIdentificationList && params.hazardIdentificationList.includes('其他') && params.hazardIdentificationList_other) {
				params.hazardIdentificationList = [
					...params.hazardIdentificationList,
					...params.hazardIdentificationList_other.split(',')
				]
			}
			
			if (params.dateTime && params.dateTime.length === 2) {
				params.startTime = formatDate(params.dateTime[0]);
				params.endTime = formatDate(params.dateTime[1]);
			}
			
			// 获取文件数据
			fileList.value.forEach(item => {
				params.fileList = [];
				if (item.response) {
					const urlMessage = JSON.parse(item.response);
					params.fileList.push(urlMessage.data);
				}
			});
			
			// 获取文件数据
			photoList.value.forEach(item => {
				params.photoList = [];
				if (item.response) {
					const urlMessage = JSON.parse(item.response);
					params.photoList.push(urlMessage.data);
				}
			});
			
			submitLoading.value = true;
			request({
				url: `/${config.mesMain}/hotwork/apply/insert`,
				data: params,
				needAuth: false,
				method: 'POST'
			}).then(() => {
				showSuccess('操作成功');
				setTimeout(() => {
					location.reload();
				}, 500)
			}).finally(() => {
				submitLoading.value = false;
			})
		});
	}

	// endregion
	
	// region 动火部位选择
	
	const hotWorkLocations = ref([
		{label: '请先选择申请部门', value: -1}
	]);
	
	/**
	 * 根据部门查询区域
	 */
	function queryLocations({value, selectedItems: { charge }}) {
		console.log(charge, value);
		formstate.value.departSupervisor = charge;
		request({
			url: `/${config.mesMain}/basic/area/getByDepart/${value}`,
			data: {},
			needAuth: false,
			method: 'GET'
		}).then(data => {
			hotWorkLocations.value = [];
			data.forEach(item => {
				hotWorkLocations.value.push({
					label: item,
					valueu: item,
				});
			});
		});
	}
	
	// endregion
	
	// region 申请部门
	
	const applyDepartments = ref([]);
	
	/**
	 * 查询部门
	 */
	function queryApplyDepartment() {
		request({
			url: `/${config.mesUser}/sys/organization/listByName`, // 拼接URL: /mes-main/api/data
			data: {
				orgName: ''
			},
			needAuth: false,
			method: 'GET'
		}).then((data) => {
			if (data) {
				applyDepartments.value = [];
				data.forEach(item => {
					applyDepartments.value.push({
						label: item.orgFullName,
						value: item.orgFullName,
						charge: item.charge,
					});
				});
			}
		}).finally(() => {
		});
	}
	
	// endregion
	
	// region 动火级别
	
	const level = ref([
		{
			label: '一级',
			value: 1
		},
		{
			label: '二级',
			value: 2
		},
		{
			label: '三级',
			value: 3
		},
	]);
	
	// endregion

	
	// region 危险源
	
	const hazardSources = ref([
		{
			label: '易燃易爆危险品',
			value: '易燃易爆危险品',
		},
		{
			label: '油漆',
			value: '油漆',
		},
		{
			label: '油类',
			value: '油类',
		},
		{
			label: '电器设备',
			value: '电器设备',
		},
		{
			label: '压力容器',
			value: '压力容器',
		},
		{
			label: '彩钢板',
			value: '彩钢板',
		},
		{
			label: '木材',
			value: '木材',
		},
		{
			label: '油回丝等',
			value: '油回丝等',
		},
		{
			label: '其他',
			value: '其他',
		},
	]);
	// region
	
	// region 危险辨识
	
	const warringType = ref([
		{
			label: '火灾',
			value: '火灾',
		},
		{
			label: '爆炸',
			value: '爆炸',
		},
		{
			label: '触电',
			value: '触电',
		},
		{
			label: '高处坠落',
			value: '高处坠落',
		},
		{
			label: '其他',
			value: '其他',
		}
	]);
	
	// endregion
	
	// region 安全措施确认
	// 是否显示
	const show =  ref(false);
	
	// 安全措施列表
	const securityMeasuresList = ref([]);
	// 安全措施备注
	const securityMeasuresRemark = ref('');
	
	/**
	 * 打开安全措施抽屉
	 */
	function open() {
		querySecurityMeasures();
		show.value = true;
	}
	
	/**
	 * 关闭安全措施抽屉
	 */
	function handleClose() {
		show.value = false;
		securityMeasuresRemark.value = '';
		securityMeasuresList.value = []
	}
	
	function confirm() {
		formstate.value.safeIdList = [];
		formstate.value.remark = securityMeasuresRemark.value;
		securityMeasuresList.value.forEach((item) => {
			formstate.value.safeIdList.push(item.securityMeasure);
		});
		handleClose();
	}
	
	/**
	 * 查询安全措施
	 */
	function querySecurityMeasures() {
		request({
			url: `/${config.mesUser}/sys/word/listWordListByParentCode/AQCS`,
			data: {},
			needAuth: false,
			method: 'GET'
		}).then((data) => {
			securityMeasuresList.value = [];
			data.forEach(item => {
				securityMeasuresList.value.push({
				securityMeasure: item.wordName,
				confirm: false,
			});
			});
		}).finally(() => {
		});
	}
	
	// endregion
	
	
	// region 资料上传
	// 图片文件列表
	const photoList = ref([]);
	// 文件列表
	const fileList = ref([]);
	// 上传的地址
	const action = `${config.baseURL}/${config.mesMain}/accident/register/uploadFile`
	
	// endregion

	onMounted(() => {
		queryApplyDepartment();
	})
</script>

<style lang="scss">
.security_measure {
	text-align: center;
	padding: 10rem;
	
	.security_measure_view {
		margin-top: 2rem;
		.security_measure_header {
			background: #99a9bf;
			color: white;
			height: 2em;
			line-height: 2em;
		}
		
		.security_measure_row {
			height: 3em;
			vertical-align: middle;
			border-bottom: 1px solid #b0b6bf;
			.security_measure_item {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 100%;
			}
		}
	}
}

.landscape-signature {
  height: 100vh;
  // #ifdef H5
  height: calc(100vh - 44px);
  // #endif
  background: #fff;
  position: relative;
  padding: 24px 0;
  padding-left: 48px;
  box-sizing: border-box;

  .custom-actions {
    position: fixed;
    left: 0;
    top: 50%;
    width: 48px;
    transform: translateY(-50%) rotate(90deg);
    transform-origin: center;
    z-index: 10;

    .button-group {
      display: flex;
      flex-direction: row;
      gap: 12px;
      white-space: nowrap;
      width: max-content;
      transform: translateX(-50%);
    }
  }
}
</style>