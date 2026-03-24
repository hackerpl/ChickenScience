// pages/parent/parent.js
const app = getApp()

Page({
  data: {
    isVerified: false,         // 是否已验证
    childInfo: {},             // 孩子信息
    reportExpanded: false,     // 报告展开状态
    settingsExpanded: false,   // 设置展开状态
    monitorExpanded: false,    // 监督展开状态

    // 学习报告数据
    reportData: {
      weekQuestions: 0,
      correctRate: 0,
      studyDuration: 0,
      dailyDuration: [30, 45, 20, 60, 40, 50, 35]
    },

    // 年级选项
    grades: [
      '小学一年级', '小学二年级', '小学三年级', '小学四年级',
      '小学五年级', '小学六年级',
      '初中一年级', '初中二年级', '初中三年级',
      '高中一年级', '高中二年级', '高中三年级'
    ],
    gradeIndex: 3,

    // 科目选项
    subjects: [
      { name: '物理', selected: true },
      { name: '化学', selected: true },
      { name: '生物', selected: true },
      { name: '语文', selected: true }
    ],

    // 过滤内容数量
    filteredCount: 0
  },

  onLoad() {
    // 检查登录状态
    if (!app.requireLogin()) {
      return
    }
    this.checkVerification()
  },

  onShow() {
    // 检查登录状态
    if (!app.requireLogin()) {
      return
    }
    if (this.data.isVerified) {
      this.loadChildInfo()
      this.loadReportData()
      this.getFilteredCount()
    }
  },

  // 检查验证状态
  checkVerification() {
    const verified = wx.getStorageSync('parentVerified') || false
    const verifiedTime = wx.getStorageSync('parentVerifiedTime') || 0

    // 验证有效期为1小时
    const now = Date.now()
    const isValid = verified && (now - verifiedTime < 3600000)

    this.setData({ isVerified: isValid })
  },

  // 前往验证页面
  goToVerify() {
    wx.navigateTo({
      url: '/pages/parent/verify'
    })
  },

  // 加载孩子信息
  loadChildInfo() {
    const childInfo = wx.getStorageSync('userInfo') || {}
    this.setData({ childInfo })

    // 设置年级索引
    const gradeIndex = this.data.grades.indexOf(childInfo.grade)
    if (gradeIndex >= 0) {
      this.setData({ gradeIndex })
    }
  },

  // 加载学习报告
  loadReportData() {
    const openid = wx.getStorageSync('openid')

    wx.cloud.callFunction({
      name: 'getParentReport',
      data: { openid }
    }).then(res => {
      if (res.result.data) {
        this.setData({
          reportData: res.result.data
        })
      }
    }).catch(err => {
      console.error('获取学习报告失败', err)
    })
  },

  // 获取被过滤内容数量
  getFilteredCount() {
    const openid = wx.getStorageSync('openid')

    wx.cloud.callFunction({
      name: 'getParentReport',
      data: {
        openid,
        action: 'getFilteredCount'
      }
    }).then(res => {
      if (res.result.count !== undefined) {
        this.setData({ filteredCount: res.result.count })
      }
    }).catch(err => {
      console.error('获取过滤内容数量失败', err)
    })
  },

  // 切换报告展开状态
  toggleReport() {
    this.setData({ reportExpanded: !this.data.reportExpanded })
  },

  // 切换设置展开状态
  toggleSettings() {
    this.setData({ settingsExpanded: !this.data.settingsExpanded })
  },

  // 切换监督展开状态
  toggleMonitor() {
    this.setData({ monitorExpanded: !this.data.monitorExpanded })
  },

  // 年级选择
  onGradeChange(e) {
    const gradeIndex = parseInt(e.detail.value)
    this.setData({ gradeIndex })
  },

  // 切换科目选择
  toggleSubject(e) {
    const index = e.currentTarget.dataset.index
    const subjects = this.data.subjects
    subjects[index].selected = !subjects[index].selected
    this.setData({ subjects })
  },

  // 编辑孩子信息
  editChildInfo() {
    wx.showModal({
      title: '修改姓名',
      editable: true,
      placeholderText: this.data.childInfo.nickname || '请输入姓名',
      success: (res) => {
        if (res.confirm && res.content) {
          this.updateChildInfo({ nickname: res.content })
        }
      }
    })
  },

  // 保存设置
  saveSettings() {
    const { gradeIndex, subjects } = this.data
    const grade = this.data.grades[gradeIndex]
    const selectedSubjects = subjects.filter(s => s.selected).map(s => s.name)

    if (selectedSubjects.length === 0) {
      wx.showToast({
        title: '请至少选择一个科目',
        icon: 'none'
      })
      return
    }

    wx.showLoading({ title: '保存中...' })

    wx.cloud.callFunction({
      name: 'updateUserInfo',
      data: {
        updateData: {
          grade,
          subjects: selectedSubjects
        }
      }
    }).then(() => {
      wx.hideLoading()
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })

      // 更新本地存储
      const childInfo = this.data.childInfo
      childInfo.grade = grade
      childInfo.subjects = selectedSubjects
      wx.setStorageSync('userInfo', childInfo)
      this.setData({ childInfo })
    }).catch(err => {
      wx.hideLoading()
      console.error('保存设置失败', err)
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      })
    })
  },

  // 更新孩子信息
  updateChildInfo(updateData) {
    wx.showLoading({ title: '保存中...' })

    wx.cloud.callFunction({
      name: 'updateUserInfo',
      data: { updateData }
    }).then(() => {
      wx.hideLoading()
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })

      // 更新本地存储
      const childInfo = { ...this.data.childInfo, ...updateData }
      wx.setStorageSync('userInfo', childInfo)
      this.setData({ childInfo })
    }).catch(err => {
      wx.hideLoading()
      console.error('更新信息失败', err)
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      })
    })
  },

  // 查看详细报告
  viewDetailReport() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  },

  // 查看被过滤的内容
  viewFilteredContent() {
    wx.navigateTo({
      url: '/pages/parent/filtered-content'
    })
  },

  // 查看聊天记录
  viewChatHistory() {
    wx.navigateTo({
      url: '/pages/parent/chat-history'
    })
  },

  // 退出家长模式
  exitParentMode() {
    wx.showModal({
      title: '退出家长模式',
      content: '确定要退出家长模式吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('parentVerified')
          wx.removeStorageSync('parentVerifiedTime')
          this.setData({ isVerified: false })
        }
      }
    })
  }
})
