// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const { createUser, userData, updateData, userId, action } = event

  try {
    // 创建新用户
    if (createUser && userData) {
      const result = await db.collection('users').add({
        data: userData
      })
      return {
        _id: result._id,
        success: true
      }
    }

    // 更新用户信息
    if (updateData) {
      if (action === 'addCoins') {
        // 增加金币
        const result = await db.collection('users')
          .doc(userId)
          .update({
            data: {
              coins: _.inc(updateData.coins || 0)
            }
          })
        return { success: true }
      } else {
        // 其他更新 - 使用 doc 方法
        console.log('更新用户信息:', { userId, updateData })
        const result = await db.collection('users')
          .doc(userId)
          .update({
            data: updateData
          })
        console.log('更新结果:', result)
        return { success: true }
      }
    }

    return { success: false, message: '无效的请求' }
  } catch (err) {
    console.error('更新用户信息失败', err)
    throw err
  }
}
