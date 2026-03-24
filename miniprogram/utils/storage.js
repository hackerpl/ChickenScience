// utils/storage.js - 本地存储封装

/**
 * 设置存储
 * @param {string} key - 键名
 * @param {any} value - 值
 */
function setStorage(key, value) {
  try {
    wx.setStorageSync(key, value)
    return true
  } catch (e) {
    console.error('设置存储失败', e)
    return false
  }
}

/**
 * 获取存储
 * @param {string} key - 键名
 * @param {any} defaultValue - 默认值
 * @returns {any}
 */
function getStorage(key, defaultValue = null) {
  try {
    const value = wx.getStorageSync(key)
    return value !== '' ? value : defaultValue
  } catch (e) {
    console.error('获取存储失败', e)
    return defaultValue
  }
}

/**
 * 删除存储
 * @param {string} key - 键名
 */
function removeStorage(key) {
  try {
    wx.removeStorageSync(key)
    return true
  } catch (e) {
    console.error('删除存储失败', e)
    return false
  }
}

/**
 * 清空所有存储
 */
function clearStorage() {
  try {
    wx.clearStorageSync()
    return true
  } catch (e) {
    console.error('清空存储失败', e)
    return false
  }
}

/**
 * 获取存储信息
 * @returns {object}
 */
function getStorageInfo() {
  try {
    return wx.getStorageInfoSync()
  } catch (e) {
    console.error('获取存储信息失败', e)
    return {}
  }
}

module.exports = {
  setStorage,
  getStorage,
  removeStorage,
  clearStorage,
  getStorageInfo
}
