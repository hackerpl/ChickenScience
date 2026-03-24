// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const { openid, getStudyData } = event

  try {
    // 查询用户信息
    const result = await db.collection('users')
      .where({
        openid: openid
      })
      .get()

    if (getStudyData && result.data && result.data.length > 0) {
      // 获取学习数据
      const user = result.data[0]

      // 获取本周学习数据
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      const studyResult = await db.collection('study_records')
        .where({
          user_id: user._id,
          date: db.command.gte(weekAgo.toISOString().split('T')[0])
        })
        .get()

      // 统计数据
      let totalQuestions = 0
      let totalCorrect = 0

      studyResult.data.forEach(record => {
        totalQuestions += record.question_count || 0
        totalCorrect += record.correct_count || 0
      })

      const correctRate = totalQuestions > 0
        ? Math.round((totalCorrect / totalQuestions) * 100)
        : 0

      return {
        data: result.data,
        studyData: {
          totalQuestions,
          correctRate
        }
      }
    }

    return {
      data: result.data
    }
  } catch (err) {
    console.error('获取用户信息失败', err)
    throw err
  }
}
