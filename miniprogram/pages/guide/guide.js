// pages/guide/guide.js
const app = getApp()

Page({
  data: {
    currentPage: 0,
    guideContent: [
      {
        title: '什么是科学？',
        content: '科学是人类探索自然规律的系统方法。通过观察、实验和推理，科学帮助我们理解世界是如何运作的。科学不仅仅是知识，更是一种思维方式。',
        example: '比如，牛顿通过观察苹果落地，发现了万有引力定律。这就是科学思维的力量！'
      },
      {
        title: '为什么要学科学？',
        content: '科学在我们的生活中无处不在。从我们呼吸的空气，到手机里的芯片，再到天上的星星，科学帮助我们理解这一切。学习科学可以：\n\n1. 培养逻辑思维能力\n2. 帮助我们做出明智的决定\n3. 解决实际问题\n4. 激发好奇心和创造力',
        example: '了解科学后，你就知道为什么天空是蓝色的，为什么冬天会下雪！'
      },
      {
        title: '科学的基本方法',
        content: '科学方法是一套系统的研究方法，包括以下步骤：\n\n1. 观察：仔细观察现象\n2. 提问：提出问题\n3. 假设：给出可能的解释\n4. 实验：设计实验验证假设\n5. 结论：根据实验结果得出结论\n6. 分享：与他人分享发现',
        example: '如果你想知道植物需要什么才能生长，你可以做一个实验：给两株植物不同的条件，观察它们的区别。'
      },
      {
        title: '科学的主要领域',
        content: '科学可以分为几个主要领域：\n\n🔬 物理学：研究物质和能量\n🧪 化学：研究物质的组成和变化\n🧬 生物学：研究生命现象\n🌍 地理学：研究地球\n🌌 天文学：研究宇宙',
        example: '物理学帮你理解为什么物体会掉下来；化学告诉你水为什么会有不同的形态。'
      },
      {
        title: '如何学习科学？',
        content: '学习科学最好的方法是：\n\n1. 保持好奇心：对周围的事物多问"为什么"\n2. 动手实践：做实验是最好的学习方式\n3. 阅读科普：看科学书籍和视频\n4. 讨论交流：和同学讨论科学问题\n5. 勇于犯错：错误是学习的一部分',
        example: '在小鸡科学里，你可以通过答题、对战等方式学习科学知识，还能和好朋友一起探索！'
      }
    ],
    showFastScrollTip: false,
    pageStartTime: 0,
    scrollPosition: 0
  },

  onLoad() {
    // 检查登录状态
    if (!app.requireLogin()) {
      return
    }
    this.setData({
      pageStartTime: Date.now()
    })
  },

  onShow() {
    // 检查登录状态
    if (!app.requireLogin()) {
      return
    }
    this.setData({
      pageStartTime: Date.now()
    })
  },

  // 监听滚动（用于检测快速翻页）
  onScroll(e) {
    this.setData({
      scrollPosition: e.detail.scrollTop
    })
  },

  // 下一页
  nextPage() {
    const timeOnPage = Date.now() - this.data.pageStartTime
    const QUICK_READ_THRESHOLD = 3000 // 3秒

    // 如果阅读时间少于3秒，标记为快速翻页
    if (timeOnPage < QUICK_READ_THRESHOLD) {
      this.recordFastScroll()
    }

    if (this.data.currentPage < this.data.guideContent.length - 1) {
      // 进入下一页
      this.setData({
        currentPage: this.data.currentPage + 1,
        pageStartTime: Date.now(),
        showFastScrollTip: false
      })
    } else {
      // 完成新手指引
      this.completeGuide()
    }
  },

  // 上一页
  prevPage() {
    if (this.data.currentPage > 0) {
      this.setData({
        currentPage: this.data.currentPage - 1,
        pageStartTime: Date.now()
      })
    }
  },

  // 记录快速翻页
  recordFastScroll() {
    const fastPages = wx.getStorageSync('fastScrollPages') || []
    fastPages.push(this.data.currentPage)

    wx.setStorageSync('fastScrollPages', fastPages)

    // 显示提示
    this.setData({
      showFastScrollTip: true
    })

    // 3秒后隐藏提示
    setTimeout(() => {
      this.setData({
        showFastScrollTip: false
      })
    }, 3000)
  },

  // 完成新手指引
  completeGuide() {
    const fastPages = wx.getStorageSync('fastScrollPages') || []

    if (fastPages.length > 0) {
      // 有快速翻页，标记为未认真阅读
      wx.setStorageSync('guideCompleted', 'fast')
      wx.showToast({
        title: '已归档到个人中心',
        icon: 'none'
      })
    } else {
      // 认真阅读完成
      wx.setStorageSync('guideCompleted', 'completed')
    }

    // 跳转到学习页面
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/study/study'
      })
    }, 1500)
  }
})
