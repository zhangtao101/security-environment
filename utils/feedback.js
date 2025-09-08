// utils/feedback.js
/**
 * 消息提示工具
 * 封装uni.showToast，支持Promise和自动类型判断
 */

// 消息类型常量
export const MESSAGE_TYPE = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

/**
 * 显示消息提示
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型，可选值：success/error/warning/info
 * @param {number} duration - 显示时长(ms)
 * @returns {Promise} - 消息消失时resolve
 */
export function showToast(message, type = MESSAGE_TYPE.INFO, duration = 2000) {
  // 根据消息类型设置图标
  let icon = 'none';
  if (type === MESSAGE_TYPE.SUCCESS) {
    icon = 'success';
  } else if (type === MESSAGE_TYPE.ERROR) {
    // uni-app默认没有error图标，使用none或自定义图标
    icon = 'none';
  } else if (type === MESSAGE_TYPE.WARNING) {
    icon = 'none';
  }

  return new Promise((resolve) => {
    uni.showToast({
      title: message,
      icon,
      duration,
      mask: true,
      success: () => {
        setTimeout(() => {
          resolve();
        }, duration);
      }
    });
  });
}

/**
 * 显示成功消息
 * @param {string} message - 消息内容
 * @param {number} duration - 显示时长(ms)
 */
export function showSuccess(message, duration = 2000) {
  return showToast(message, MESSAGE_TYPE.SUCCESS, duration);
}

/**
 * 显示错误消息
 * @param {string} message - 消息内容
 * @param {number} duration - 显示时长(ms)
 */
export function showError(message, duration = 3000) {
  return showToast(message, MESSAGE_TYPE.ERROR, duration);
}

/**
 * 显示警告消息
 * @param {string} message - 消息内容
 * @param {number} duration - 显示时长(ms)
 */
export function showWarning(message, duration = 2500) {
  return showToast(message, MESSAGE_TYPE.WARNING, duration);
}

/**
 * 显示加载提示
 * @param {string} message - 消息内容
 */
export function showLoading(message = '加载中...') {
  uni.showLoading({
    title: message,
    mask: true
  });
}

/**
 * 隐藏加载提示
 */
export function hideLoading() {
  uni.hideLoading();
}

/**
 * 显示确认对话框
 * @param {string} title - 标题
 * @param {string} content - 内容
 * @param {function} confirmCallback - 确认回调
 * @param {function} cancelCallback - 取消回调
 */
export function showConfirm(title, content, confirmCallback, cancelCallback) {
  uni.showModal({
    title,
    content,
    confirmText: '确定',
    cancelText: '取消',
    success: (res) => {
      if (res.confirm && confirmCallback) {
        confirmCallback();
      } else if (res.cancel && cancelCallback) {
        cancelCallback();
      }
    }
  });
}