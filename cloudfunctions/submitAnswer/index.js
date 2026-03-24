// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const { questionId, isCorrect, userAnswer, wrongCount } = event

  try {
    const openid = cloud.getWXContext().openid

    // 参数验证
    if (!questionId) {
      return {
        success: false,
        message: '缺少题目ID',
        coinReward: 0
      }
    }

    console.log('提交答案参数:', { questionId, isCorrect, userAnswer, wrongCount, openid })

    // 获取用户信息
    const userResult = await db.collection('users')
      .where({
        openid: openid
      })
      .get()

    if (!userResult.data || userResult.data.length === 0) {
      console.log('用户不存在，openid:', openid)
      return {
        success: false,
        message: '用户不存在',
        coinReward: 0
      }
    }

    const userId = userResult.data[0]._id
    console.log('找到用户:', userId)

    // 答对题目 - 增加金币
    let coinReward = 0
    if (isCorrect) {
      coinReward = userResult.data[0].vip_level >= 5 ? 2 : 1

      await db.collection('users')
        .doc(userId)
        .update({
          data: {
            coins: _.inc(coinReward)
          }
        })

      console.log('增加金币:', coinReward)
    }

    // 记录学习数据
    const today = new Date().toISOString().split('T')[0]

    try {
      // 检查今天是否已有记录
      const todayRecord = await db.collection('study_records')
        .where({
          user_id: userId,
          date: today
        })
        .get()

      if (todayRecord.data && todayRecord.data.length > 0) {
        // 更新今天记录
        await db.collection('study_records')
          .doc(todayRecord.data[0]._id)
          .update({
            data: {
            question_count: _.inc(1),
            correct_count: _.inc(isCorrect ? 1 : 0)
            // correct_rate 稍后计算
          }
          })
      } else {
        // 创建新记录
        await db.collection('study_records').add({
          data: {
            user_id: userId,
            date: today,
            question_count: 1,
            correct_count: isCorrect ? 1 : 0,
            correct_rate: isCorrect ? 100 : 0,
            study_duration: 0,
            created_at: new Date().toISOString()
          }
        })
      }
    } catch (err) {
      console.error('记录学习数据失败:', err)
      // 学习数据记录失败不影响主流程
    }

    return {
      success: true,
      coinReward: coinReward
    }
  } catch (err) {
    console.error('提交答案失败:', err)
    return {
      success: false,
      message: err.message || '提交答案失败',
      coinReward: 0
    }
  }
}
