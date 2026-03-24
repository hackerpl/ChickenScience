// pages/profile/profile.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    studyData: {
      totalQuestions: 0,
      correctRate: 0
    },
    guideStatus: 'none', // none, completed, fast
    friendCount: 0,
    achievementCount: 0,
    grades: [
      '小学一年级', '小学二年级', '小学三年级', '小学四年级',
      '小学五年级', '小学六年级',
      '初中一年级', '初中二年级', '初中三年级',
      '高中一年级', '高中二年级', '高中三年级'
    ],
    showGradePicker: false
  },

  onLoad() {
    // 检查登录状态
    if (!app.requireLogin()) {
      return
    }
    this.loadData()
  },

  onShow() {
    // 检查登录状态
    if (!app.requireLogin()) {
      return
    }
    this.loadData()
  },

  // 加载数据
  loadData() {
    this.getUserInfo()
    this.getStudyData()
    this.getGuideStatus()
    this.getFriendCount()
    this.getAchievementCount()
  },

  // 获取用户信息
  getUserInfo() {
    const userInfo = wx.getStorageSync('userInfo') || {}
    this.setData({ userInfo })
  },

  // 获取学习数据
  getStudyData() {
    const openid = wx.getStorageSync('openid')

    wx.cloud.callFunction({
      name: 'getUserInfo',
      data: {
        openid,
        getStudyData: true
      }
    }).then(res => {
      if (res.result.studyData) {
        this.setData({
          studyData: res.result.studyData
        })
      }
    }).catch(err => {
      console.error('获取学习数据失败', err)
    })
  },

  // 获取新手指引状态
  getGuideStatus() {
    const guideStatus = wx.getStorageSync('guideCompleted') || 'none'
    this.setData({ guideStatus })
  },

  // 获取好友数量
  getFriendCount() {
    // TODO: 从数据库获取好友数量
    const friendCount = 0
    this.setData({ friendCount })
  },

  // 获取成就数量
  getAchievementCount() {
    // TODO: 从数据库获取成就数量
    const achievementCount = 0
    this.setData({ achievementCount })
  },

  // 查看新手指引
  viewGuide() {
    wx.navigateTo({
      url: '/pages/guide/guide?review=true'
    })
  },

  // 编辑年级
  editGrade() {
    console.log('点击编辑年级，用户信息:', this.data.userInfo)

    const userInfo = this.data.userInfo
    if (!userInfo || !userInfo._id) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }

    const currentGrade = userInfo.grade || '小学四年级'
    const currentIndex = this.data.grades.indexOf(currentGrade)

    console.log('当前年级:', currentGrade, '索引:', currentIndex)

    wx.showActionSheet({
      itemList: this.data.grades,
      success: (res) => {
        console.log('选择了索引:', res.tapIndex)
        if (res.tapIndex !== undefined && res.tapIndex !== currentIndex) {
          this.updateGrade(this.data.grades[res.tapIndex])
        }
      },
      fail: (err) => {
        console.error('ActionSheet 失败:', err)
      }
    })
  },

  // 更新年级
  updateGrade(newGrade) {
    console.log('更新年级为:', newGrade)
    const userInfo = this.data.userInfo
    const oldGrade = userInfo.grade

    if (!userInfo._id) {
      wx.showToast({
        title: '用户信息错误',
        icon: 'none'
      })
      return
    }

    // 立即更新UI显示
    userInfo.grade = newGrade
    this.setData({ userInfo })

    wx.showLoading({ title: '保存中...' })

    wx.cloud.callFunction({
      name: 'updateUserInfo',
      data: {
        userId: userInfo._id,
        updateData: { grade: newGrade },
        action: 'update'
      }
    }).then(res => {
      console.log('更新年级成功:', res)
      wx.hideLoading()

      // 更新本地存储
      wx.setStorageSync('userInfo', userInfo)

      wx.showToast({
        title: '修改成功',
        icon: 'success'
      })
    }).catch(err => {
      console.error('更新年级失败:', err)
      wx.hideLoading()

      // 失败则恢复原值
      userInfo.grade = oldGrade
      this.setData({ userInfo })

      wx.showToast({
        title: '保存失败',
        icon: 'none'
      })
    })
  },

  // 前往家长模式
  goToParent() {
    wx.navigateTo({
      url: '/pages/parent/parent'
    })
  },

  // 前往好友
  goToFriends() {
    if (this.data.userInfo.vip_level < 10) {
      wx.showToast({
        title: '需要VIP10才能使用',
        icon: 'none'
      })
      return
    }

    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 前往聊天
  goToChat() {
    if (this.data.userInfo.vip_level < 10) {
      wx.showToast({
        title: '需要VIP10才能使用',
        icon: 'none'
      })
      return
    }

    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 前往成就
  goToAchievements() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 前往学习报告
  goToReport() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 前往我的物品
  goToItems() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 前往设置
  goToSettings() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 关于我们
  showAbout() {
    wx.showModal({
      title: '关于小鸡科学',
      content: '版本：1.0.0\n\n让孩子爱上科学，从"不想学"变成"主动学"。',
      showCancel: false
    })
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除本地存储
          wx.clearStorageSync()

          // 跳转到启动页
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }
      }
    })
  }
})
