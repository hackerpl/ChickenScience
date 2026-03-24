// pages/study/study.js
const app = getApp()

Page({
  data: {
    userInfo: {},
    currentMode: '', // normal, wrong, challenge
    questions: [],
    currentQuestion: null,
    currentIndex: 0,
    totalCount: 10,
    selectedAnswer: '',
    fillAnswer: '',
    answerResult: '',
    isCorrect: false,
    wrongCount: 0,
    showVideo: false,
    videoWatched: false,
    showComplete: false,
    correctRate: 0,
    earnedCoins: 0
  },

  onLoad() {
    // 检查登录状态
    if (!app.requireLogin()) {
      return
    }
    this.getUserInfo()
  },

  onShow() {
    // 检查登录状态
    if (!app.requireLogin()) {
      return
    }
    this.getUserInfo()
  },

  // 获取用户信息
  getUserInfo() {
    const userInfo = wx.getStorageSync('userInfo') || {}
    this.setData({ userInfo })
  },

  // 开始学习
  startStudy(e) {
    const mode = e.currentTarget.dataset.mode
    this.setData({ currentMode: mode })
    this.fetchQuestions(mode)
  },

  // 获取题目
  fetchQuestions(mode) {
    wx.showLoading({ title: '加载中...' })

    const userInfo = this.data.userInfo
    const params = {
      mode,
      grade: userInfo.grade,
      subject: '物理', // 可以让用户选择
      count: 10
    }

    // 调用云函数获取题目
    wx.cloud.callFunction({
      name: 'getQuestion',
      data: params
    }).then(res => {
      wx.hideLoading()

      if (res.result.questions && res.result.questions.length > 0) {
        this.setData({
          questions: res.result.questions,
          currentQuestion: res.result.questions[0],
          totalCount: res.result.questions.length
        })
      } else {
        wx.showToast({
          title: '暂无题目',
          icon: 'none'
        })
        this.setData({ currentMode: '' })
      }
    }).catch(err => {
      wx.hideLoading()
      console.error('获取题目失败', err)

      wx.showModal({
        title: '加载失败',
        content: '请检查网络连接或稍后重试',
        showCancel: false,
        success: () => {
          this.setData({ currentMode: '' })
        }
      })
    })
  },

  // 选择答案（判断题）
  selectAnswer(e) {
    const answer = e.currentTarget.dataset.answer
    this.setData({ selectedAnswer: answer })
    this.checkAnswer(answer)
  },

  // 输入答案（填空题）
  onFillInput(e) {
    this.setData({ fillAnswer: e.detail.value })
  },

  // 提交填空题答案
  submitFillAnswer() {
    if (!this.data.fillAnswer.trim()) {
      wx.showToast({
        title: '请输入答案',
        icon: 'none'
      })
      return
    }
    this.checkAnswer(this.data.fillAnswer.trim())
  },

  // 检查答案
  checkAnswer(answer) {
    const currentQuestion = this.data.currentQuestion
    const isCorrect = answer === currentQuestion.answer

    if (isCorrect) {
      // 回答正确
      this.setData({
        answerResult: answer,
        isCorrect: true,
        wrongCount: 0
      })

      // 记录正确答案
      this.recordAnswer(true, answer)
    } else {
      // 回答错误
      const wrongCount = this.data.wrongCount + 1

      if (wrongCount >= 3) {
        // 三次错误，需要看视频
        this.setData({
          answerResult: currentQuestion.answer,
          isCorrect: false,
          wrongCount,
          showVideo: true
        })

        // 记录错题
        this.recordWrongQuestion()
      } else {
        this.setData({
          answerResult: currentQuestion.answer,
          isCorrect: false,
          wrongCount
        })

        // 记录错误答案
        this.recordAnswer(false, answer)
      }
    }
  },

  // 记录答题结果
  recordAnswer(isCorrect, userAnswer) {
    const { currentQuestion, currentIndex, wrongCount } = this.data

    wx.cloud.callFunction({
      name: 'submitAnswer',
      data: {
        questionId: currentQuestion._id,
        isCorrect,
        userAnswer,
        wrongCount
      }
    }).then(res => {
      if (isCorrect && res.result.coinReward > 0) {
        // 答对获得金币，更新本地用户信息
        const userInfo = this.data.userInfo
        userInfo.coins = (userInfo.coins || 0) + res.result.coinReward
        wx.setStorageSync('userInfo', userInfo)
        this.setData({ userInfo })

        wx.showToast({
          title: `+${res.result.coinReward} 金币`,
          icon: 'success',
          duration: 1000
        })
      }
    }).catch(err => {
      console.error('记录答案失败', err)
    })
  },

  // 记录错题
  recordWrongQuestion() {
    const { currentQuestion } = this.data

    wx.cloud.callFunction({
      name: 'getWrongQuestions',
      data: {
        questionId: currentQuestion._id,
        action: 'add'
      }
    }).catch(err => {
      console.error('记录错题失败', err)
    })
  },

  // 视频播放结束
  onVideoEnd() {
    this.setData({ videoWatched: true })
  },

  // 关闭视频
  closeVideo() {
    this.setData({
      showVideo: false,
      videoWatched: false,
      selectedAnswer: '',
      fillAnswer: '',
      answerResult: '',
      isCorrect: false,
      wrongCount: 0
    })

    // 继续下一题
    this.nextQuestion()
  },

  // 下一题
  nextQuestion() {
    const { currentIndex, totalCount } = this.data

    if (currentIndex < totalCount - 1) {
      // 下一题
      const nextIndex = currentIndex + 1
      this.setData({
        currentIndex: nextIndex,
        currentQuestion: this.data.questions[nextIndex],
        selectedAnswer: '',
        fillAnswer: '',
        answerResult: '',
        isCorrect: false,
        wrongCount: 0
      })
    } else {
      // 完成所有题目
      this.showCompleteResult()
    }
  },

  // 显示完成结果
  showCompleteResult() {
    const { questions, currentIndex } = this.data

    // 计算正确率
    let correctCount = 0
    let totalCoins = 0

    // 这里应该从服务器获取统计结果
    // 暂时使用本地计算
    correctCount = Math.floor((currentIndex + 1) * 0.8) // 假设80%正确率
    totalCoins = correctCount

    const correctRate = Math.round((correctCount / questions.length) * 100)

    this.setData({
      showComplete: true,
      correctRate,
      earnedCoins: totalCoins
    })

    // 刷新用户信息
    this.getUserInfo()
  },

  // 返回首页
  backToHome() {
    this.setData({
      currentMode: '',
      questions: [],
      currentQuestion: null,
      currentIndex: 0,
      selectedAnswer: '',
      fillAnswer: '',
      answerResult: '',
      isCorrect: false,
      wrongCount: 0,
      showComplete: false
    })
  }
})
