// utils/user.js
const USER_INFO_KEY = 'user_info';

// 获取用户信息
export function getUserInfo() {
  const info = uni.getStorageSync(USER_INFO_KEY);
  return info ? JSON.parse(info) : null;
}

// 设置用户信息
export function setUserInfo(userInfo) {
  uni.setStorageSync(USER_INFO_KEY, JSON.stringify(userInfo));
}

// 清除用户信息
export function clearUserInfo() {
  uni.removeStorageSync(USER_INFO_KEY);
}

// 判断用户是否已登录（根据是否存在用户信息）
export function isLoggedIn() {
  return !!getUserInfo();
}