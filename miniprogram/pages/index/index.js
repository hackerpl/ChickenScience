// pages/index/index.js
const app = getApp()

Page({
  data: {
    identitySelected: false,
    loading: false
  },

  onLoad(options) {
    // 检查是否已经选择过身份
    const identity = wx.getStorageSync('userIdentity')
    if (identity) {
      this.setData({ identitySelected: true })
      // 直接跳转到主页面
      this.navigateToMain()
    }
  },

  // 选择科学大师
  selectMaster() {
    this.setData({ loading: true })

    // 保存身份选择
    wx.setStorageSync('userIdentity', 'master')

    // 初始化用户信息
    this.initUserInfo('master')
  },

  // 选择小白
  selectBeginner() {
    this.setData({ loading: true })

    // 保存身份选择
    wx.setStorageSync('userIdentity', 'beginner')

    // 初始化用户信息
    this.initUserInfo('beginner')
  },

  // 初始化用户信息
  initUserInfo(identity) {
    wx.showLoading({ title: '登录中...' })

    // 先获取 openid
    wx.cloud.callFunction({
      name: 'login',
      data: {}
    }).then(res => {
      const openid = res.result.openid
      wx.setStorageSync('openid', openid)

      // 登录成功提示
      wx.hideLoading()
      wx.showToast({
        title: '登录成功！',
        icon: 'success',
        duration: 1200
      })

      // 获取用户信息
      return wx.cloud.callFunction({
        name: 'getUserInfo',
        data: { openid }
      })
    }).then(res => {
      if (res.result.data && res.result.data.length > 0) {
        // 用户已存在，更新身份
        const user = res.result.data[0]
        this.updateUserIdentity(user._id, identity)
      } else {
        // 新用户，跳转到年级选择页面
        const openid = wx.getStorageSync('openid')
        wx.redirectTo({
          url: `/pages/grade-select/grade-select?openid=${openid}&identity=${identity}`
        })
      }
    }).catch(err => {
      wx.hideLoading()
      console.error('初始化失败', err)

      wx.showModal({
        title: '初始化失败',
        content: '请检查网络连接或稍后重试',
        showCancel: false,
        success: () => {
          this.setData({ loading: false })
        }
      })
    })
  },

  // 更新用户身份
  updateUserIdentity(userId, identity) {
    wx.cloud.callFunction({
      name: 'updateUserInfo',
      data: {
        userId,
        updateData: { identity },
        action: 'update'
      }
    }).then(() => {
      // 更新本地用户信息
      const userInfo = wx.getStorageSync('userInfo') || {}
      userInfo.identity = identity
      wx.setStorageSync('userInfo', userInfo)

      // 欢迎回来提示
      wx.showToast({
        title: '欢迎回来！',
        icon: 'success',
        duration: 1200
      })

      // 根据身份跳转
      setTimeout(() => {
        if (identity === 'beginner') {
          wx.redirectTo({
            url: '/pages/guide/guide'
          })
        } else {
          this.navigateToMain()
        }
      }, 1200)
    }).catch(err => {
      console.error('更新用户身份失败', err)
      wx.showToast({
        title: '更新失败',
        icon: 'none'
      })
      this.setData({ loading: false })
    })
  },

  // 跳转到主页面
  navigateToMain() {
    wx.switchTab({
      url: '/pages/study/study'
    })
  }
})
