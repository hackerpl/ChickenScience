// pages/grade-select/grade-select.js
const app = getApp()

Page({
  data: {
    gradeList: [
      '小学一年级',
      '小学二年级',
      '小学三年级',
      '小学四年级',
      '小学五年级',
      '小学六年级',
      '初中一年级',
      '初中二年级',
      '初中三年级',
      '高中一年级',
      '高中二年级',
      '高中三年级'
    ],
    openid: '',
    identity: ''
  },

  onLoad(options) {
    const { openid, identity } = options
    // 检查是否有openid参数（从登录页跳转过来）
    if (!openid) {
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
      return
    }
    this.setData({ openid, identity })
  },

  // 选择年级
  selectGrade(e) {
    const grade = e.currentTarget.dataset.grade
    const { openid, identity } = this.data

    wx.showLoading({ title: '创建中...' })

    // 创建用户
    wx.cloud.callFunction({
      name: 'updateUserInfo',
      data: {
        createUser: true,
        userData: {
          openid: openid,
          identity: identity,
          nickname: '科学小达人',
          avatar: '',
          grade: grade,
          vip_level: 1,
          max_vip_level: 1,
          coins: 100,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          last_login: new Date().toISOString()
        }
      }
    }).then(res => {
      wx.hideLoading()

      // 显示欢迎提示
      wx.showToast({
        title: '登录成功！',
        icon: 'success',
        duration: 1500
      })

      // 保存用户信息到本地
      const userInfo = {
        _id: res.result._id,
        openid: openid,
        identity: identity,
        nickname: '科学小达人',
        avatar: '',
        grade: grade,
        vip_level: 1,
        max_vip_level: 1,
        coins: 100
      }
      wx.setStorageSync('userInfo', userInfo)

      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        // 根据身份跳转
        if (identity === 'beginner') {
          wx.redirectTo({
            url: '/pages/guide/guide'
          })
        } else {
          wx.switchTab({
            url: '/pages/study/study'
          })
        }
      }, 1500)
    }).catch(err => {
      wx.hideLoading()
      console.error('创建用户失败', err)
      wx.showToast({
        title: '创建失败，请重试',
        icon: 'none'
      })
    })
  }
})
