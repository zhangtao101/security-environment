// utils/request.js
import { showToast, showLoading, hideLoading } from '@/utils';
import config from '@/config';

// token存储与管理
const TOKEN_KEY = 'auth_token';

export function getToken() {
  return uni.getStorageSync(TOKEN_KEY);
}

export function setToken(token) {
  uni.setStorageSync(TOKEN_KEY, token);
}

export function removeToken() {
  uni.removeStorageSync(TOKEN_KEY);
}

// 登录状态检查
export function isLoggedIn() {
  return !!getToken();
}

// 跳转到登录页
export function navigateToLogin() {
  removeToken();
  uni.navigateTo({
    url: '/pages/login/login'
  });
}

// 请求拦截器
export function request(options) {
  return new Promise((resolve, reject) => {
    // 检查登录状态
    if (options.needAuth && !isLoggedIn()) {
      navigateToLogin();
      return reject(new Error('未登录'));
    }
    
    // 显示加载状态
    if (options.loading) {
      showLoading(options.loadingText || '加载中...');
    }
    
    // 添加默认配置
    const defaultOptions = {
      url: '',
      method: 'GET',
      data: {},
      header: {
        'Content-Type': 'application/json',
		From: 'web'
      },
      needAuth: true,
      loading: true,
      showError: true,
      timeout: 30000, // 默认超时时间10秒
      baseURL: config.baseURL // 使用配置中的基础URL
    };
    
    const mergedOptions = {
      ...defaultOptions,
      ...options,
      url: options.baseURL || defaultOptions.baseURL + options.url
    };
    
    // 添加token到请求头
    if (mergedOptions.needAuth) {
      mergedOptions.header['Authorization'] = getToken();
    }
    
    uni.request({
      ...mergedOptions,
      success: (res) => {
        // 隐藏加载状态
        if (mergedOptions.loading) {
          hideLoading();
        }
        // 处理业务状态码
        if (res.statusCode === 200) {
          // 假设接口返回格式为 { code: 0, message: '成功', data: {} }
          if (res.data.code === 200) {
            resolve(res.data.data);
          } else if (res.data.code === 401) { // 未登录或token过期
            navigateToLogin();
            reject(new Error(res.data.message || '请先登录'));
          } else {
            if (mergedOptions.showError) {
              showToast(res.data.message || '操作失败', 'error');
            }
            reject(new Error(res.data.message || '请求失败'));
          }
        } else {
			console.log(res)
			console.log(defaultOptions.baseURL + options.url)
          if (mergedOptions.showError) {
            showToast(`请求错误 ${res.statusCode}`, 'error');
          }
          reject(new Error(`请求错误 ${res.statusCode}`));
        }
      },
      fail: (err) => {
		  console.log(err);
        // 隐藏加载状态
        if (mergedOptions.loading) {
          hideLoading();
        }
        
        let errorMsg = '网络连接失败';
        if (err.errMsg.includes('timeout')) {
          errorMsg = '请求超时，请重试';
        }
        
        if (mergedOptions.showError) {
          showToast(errorMsg, 'error');
        }
        reject(err);
      }
    });
  });
}
