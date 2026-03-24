// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const { mode, grade, subject, count = 10 } = event

  try {
    let questions = []

    if (mode === 'wrong') {
      // 获取错题
      const openid = cloud.getWXContext().openid

      // 先获取用户ID
      const userResult = await db.collection('users')
        .where({ openid })
        .get()

      if (userResult.data.length === 0) {
        return { questions: [] }
      }

      const userId = userResult.data[0]._id

      // 获取错题ID列表
      const wrongQuestions = await db.collection('wrong_questions')
        .where({
          user_id: userId,
          is_mastered: false
        })
        .get()

      if (wrongQuestions.data.length === 0) {
        return { questions: [] }
      }

      const questionIds = wrongQuestions.data.map(wq => wq.question_id)

      // 获取题目详情
      const result = await db.collection('questions')
        .where({
          _id: _.in(questionIds)
        })
        .limit(count)
        .get()

      questions = result.data
    } else if (mode === 'challenge') {
      // 挑战模式 - 更高难度
      const result = await db.collection('questions')
        .where({
          grade_level: grade,
          subject: subject,
          difficulty: _.gte(2), // 中等或困难
          status: 'active'
        })
        .limit(count)
        .get()

      questions = result.data
    } else {
      // 日常练习 - 正常难度
      const result = await db.collection('questions')
        .where({
          grade_level: grade,
          subject: subject,
          status: 'active'
        })
        .limit(count)
        .get()

      questions = result.data
    }

    return {
      questions: questions
    }
  } catch (err) {
    console.error('获取题目失败', err)
    throw err
  }
}
