// 小程序入口文件
App({
  onLaunch() {
    // 初始化云开发
    if (wx.cloud) {
      wx.cloud.init({
        env: 'cloud1-6gad1q0255f7510b', // 替换为你的云开发环境ID
        traceUser: true
      })
    } else {
      wx.showToast({
        title: '请使用微信开发者工具或真机预览',
        icon: 'none',
        duration: 3000
      })
    }

    // 检查用户登录状态
    this.checkLoginStatus()
  },

  onShow() {
    // 小程序显示时的逻辑
  },

  // 检查登录状态
  checkLoginStatus() {
    const openid = wx.getStorageSync('openid')
    if (!openid) {
      // 未登录，跳转到启动页进行身份选择
      // 注意：不在这里自动登录，而是在index页面由用户选择身份后登录
      console.log('用户未登录，等待身份选择')
    }
  },

  // 登录
  login() {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'login',
        data: {}
      }).then(res => {
        console.log('登录成功', res)
        if (res.result.openid) {
          wx.setStorageSync('openid', res.result.openid)
          resolve(res.result.openid)
        } else {
          reject(new Error('获取openid失败'))
        }
      }).catch(err => {
        console.error('登录失败', err)
        reject(err)
      })
    })
  },

  // 获取用户信息
  getUserInfo(openid) {
    return new Promise((resolve, reject) => {
      wx.cloud.callFunction({
        name: 'getUserInfo',
        data: { openid }
      }).then(res => {
        if (res.result.data && res.result.data.length > 0) {
          // 用户已存在
          const user = res.result.data[0]
          wx.setStorageSync('userInfo', user)
          this.globalData.userInfo = user
          resolve(user)
        } else {
          // 新用户
          this.globalData.isNewUser = true
          resolve(null)
        }
      }).catch(err => {
        console.error('获取用户信息失败', err)
        reject(err)
      })
    })
  },

  // 获取或创建用户信息（兼容旧代码）
  getUserOrCreate() {
    const openid = wx.getStorageSync('openid')
    if (openid) {
      this.getUserInfo(openid).catch(err => {
        console.error('获取用户信息失败', err)
      })
    }
  },

  // 检查是否已登录
  checkLogin() {
    const openid = wx.getStorageSync('openid')
    const userInfo = wx.getStorageSync('userInfo')
    return !!(openid && userInfo)
  },

  // 需要登录的页面检查
  requireLogin() {
    if (!this.checkLogin()) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1500
      })
      setTimeout(() => {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }, 1500)
      return false
    }
    return true
  },

  // 全局数据
  globalData: {
    userInfo: null,
    isNewUser: false,
    systemInfo: null
  }
})
