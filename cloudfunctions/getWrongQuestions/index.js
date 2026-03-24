// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const { questionId, action } = event

  try {
    const openid = cloud.getWXContext().openid

    // 获取用户信息
    const userResult = await db.collection('users')
      .where({ openid })
      .get()

    if (userResult.data.length === 0) {
      return { success: false, message: '用户不存在' }
    }

    const userId = userResult.data[0]._id

    if (action === 'add') {
      // 添加错题
      // 检查是否已存在
      const existResult = await db.collection('wrong_questions')
        .where({
          user_id: userId,
          question_id: questionId
        })
        .get()

      if (existResult.data.length > 0) {
        // 已存在，更新错误次数
        const wrongQuestion = existResult.data[0]

        await db.collection('wrong_questions')
          .doc(wrongQuestion._id)
          .update({
            data: {
              wrong_count: db.command.inc(1),
              wrong_times: db.command.push([new Date().toISOString()]),
              is_mastered: false,
              // 错误再错，进入重点复习库
              is_key_review: wrongQuestion.wrong_count >= 2
            }
          })

        return { success: true }
      } else {
        // 新增错题
        await db.collection('wrong_questions').add({
          data: {
            user_id: userId,
            question_id: questionId,
            wrong_count: 1,
            wrong_times: [new Date().toISOString()],
            is_mastered: false,
            is_key_review: false,
            created_at: new Date().toISOString()
          }
        })

        return { success: true }
      }
    }

    return { success: false, message: '无效的操作' }
  } catch (err) {
    console.error('错题操作失败', err)
    throw err
  }
}
