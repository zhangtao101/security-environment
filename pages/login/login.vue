<template>
	<view class="login-view">
		<wd-form ref="form" :model="model">
			<wd-cell-group border>
				<wd-input label="用户名" label-width="100px" prop="loginName" clearable v-model="model.loginName"
					placeholder="请输入用户名" :rules="[{ required: true, message: '请填写用户名' }]" />
				<wd-input label="密码" label-width="100px" prop="password" show-password clearable
					v-model="model.password" placeholder="请输入密码" :rules="[{ required: true, message: '请填写密码' }]" />
			</wd-cell-group>
			<view class="footer">
				<wd-button type="primary" size="large" :loading="loading" @click="handleSubmit" block>登录</wd-button>
			</view>
		</wd-form>
		<wd-notify />
	</view>
</template>

<script lang="ts" setup>
	import { reactive, ref } from 'vue'
	import { useNotify } from '@/uni_modules/wot-design-uni'
	import { request, setToken, setUserInfo } from '@/utils'
	import config from '@/config'; // 引入配置文件


	const { showNotify, closeNotify } = useNotify()

	const model = reactive<{
		loginName : string
		password : string
	}>({
		loginName: '',
		password: ''
	})

	const form = ref()

	const loading = ref(false);
	/**
	 * 登录
	 */
	function handleSubmit() {
		form.value
			.validate()
			.then(({ valid, errors }) => {
				if (valid) {
					loading.value = true;
					request({
						url: `/${config.mesUser}/sys/user/authenticate`, // 拼接URL: /mes-main/api/data
						data: model,
						needAuth: false,
						method: 'POST'
					}).then(({ user, Authorization }) => {
						// 成功通知
						showNotify({ type: 'success', message: '登录成功' })
						setUserInfo(user);
						setToken(Authorization);
						uni.redirectTo({
							url: "/pages/inspectionTask/inspectionTask"
						});
					}).finally(() => {
						loading.value = false;
					});
				}
			})
			.catch((error) => {
				console.log(error, 'error')
			})
	}
</script>

<style lang="scss">
	.login-view {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 80%;
	}
</style>