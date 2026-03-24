// utils/request.js - 网络请求封装

/**
 * 云函数调用封装
 * @param {string} name - 云函数名称
 * @param {object} data - 传递给云函数的数据
 * @returns {Promise}
 */
function callCloudFunction(name, data = {}) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name,
      data
    }).then(res => {
      if (res.errCode === 0 || res.result) {
        resolve(res.result)
      } else {
        reject(new Error(res.errMsg || '请求失败'))
      }
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 显示加载中
 * @param {string} title - 提示文字
 */
function showLoading(title = '加载中...') {
  wx.showLoading({
    title,
    mask: true
  })
}

/**
 * 隐藏加载中
 */
function hideLoading() {
  wx.hideLoading()
}

/**
 * 显示提示
 * @param {string} title - 提示文字
 * @param {string} icon - 图标类型
 */
function showToast(title, icon = 'none') {
  wx.showToast({
    title,
    icon,
    duration: 2000
  })
}

/**
 * 显示确认对话框
 * @param {string} content - 内容
 * @param {string} title - 标题
 * @returns {Promise<boolean>}
 */
function showModal(content, title = '提示') {
  return new Promise((resolve) => {
    wx.showModal({
      title,
      content,
      success: (res) => {
        resolve(res.confirm)
      }
    })
  })
}

/**
 * 节流函数
 * @param {function} fn - 要执行的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {function}
 */
function throttle(fn, delay = 300) {
  let lastTime = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      lastTime = now
      fn.apply(this, args)
    }
  }
}

/**
 * 防抖函数
 * @param {function} fn - 要执行的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {function}
 */
function debounce(fn, delay = 300) {
  let timer = null
  return function(...args) {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

module.exports = {
  callCloudFunction,
  showLoading,
  hideLoading,
  showToast,
  showModal,
  throttle,
  debounce
}
