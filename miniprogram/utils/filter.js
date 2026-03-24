// utils/filter.js - 内容过滤

/**
 * 敏感词列表（示例）
 * 实际应用中应该从服务器获取并定期更新
 */
const SENSITIVE_WORDS = [
  // 聊天无关话题
  '你好', '在吗', '在不在', '吃饭了吗', '吃了没',
  '在干嘛', '干什么', '去哪里', '去哪了',

  // 不良内容
  '傻瓜', '笨蛋', '白痴', '滚', '去死',

  // 广告
  '加微信', '扫码', '代练', '代充', '外挂'
]

/**
 * 检查内容是否包含敏感词
 * @param {string} content - 要检查的内容
 * @returns {object} - { isPass: boolean, reason: string }
 */
function checkSensitive(content) {
  if (!content || typeof content !== 'string') {
    return { isPass: false, reason: '内容为空' }
  }

  // 检查敏感词
  for (const word of SENSITIVE_WORDS) {
    if (content.includes(word)) {
      return { isPass: false, reason: `包含敏感词: ${word}` }
    }
  }

  return { isPass: true, reason: '' }
}

/**
 * 过滤内容（返回过滤后的内容）
 * @param {string} content - 要过滤的内容
 * @returns {string} - 过滤后的内容
 */
function filterContent(content) {
  if (!content || typeof content !== 'string') {
    return content
  }

  let filtered = content
  for (const word of SENSITIVE_WORDS) {
    const reg = new RegExp(word, 'g')
    filtered = filtered.replace(reg, '*'.repeat(word.length))
  }

  return filtered
}

/**
 * 检查题目内容是否与学科相关
 * @param {string} content - 题目内容
 * @returns {object} - { isPass: boolean, reason: string }
 */
function checkQuestionContent(content) {
  if (!content || typeof content !== 'string') {
    return { isPass: false, reason: '内容为空' }
  }

  // 检查长度
  if (content.length < 5) {
    return { isPass: false, reason: '内容太短' }
  }

  if (content.length > 500) {
    return { isPass: false, reason: '内容太长' }
  }

  // 检查是否包含敏感词
  const sensitiveResult = checkSensitive(content)
  if (!sensitiveResult.isPass) {
    return sensitiveResult
  }

  // 检查是否包含科学相关关键词（示例）
  const scienceKeywords = [
    '为什么', '是什么', '怎么', '如何', '原理',
    '物理', '化学', '生物', '科学', '实验',
    '发现', '研究', '证明', '定律', '公式'
  ]

  const hasScienceKeyword = scienceKeywords.some(keyword =>
    content.includes(keyword)
  )

  if (!hasScienceKeyword) {
    return { isPass: false, reason: '内容与科学无关' }
  }

  return { isPass: true, reason: '' }
}

/**
 * AI内容审核接口（调用云函数）
 * @param {string} content - 要审核的内容
 * @returns {Promise<object>}
 */
async function aiContentCheck(content) {
  try {
    const result = await wx.cloud.callFunction({
      name: 'contentFilter',
      data: { content }
    })

    return {
      isPass: result.result.pass,
      reason: result.result.reason || ''
    }
  } catch (err) {
    console.error('AI审核失败', err)
    // AI审核失败时，使用本地过滤
    return checkSensitive(content)
  }
}

module.exports = {
  checkSensitive,
  filterContent,
  checkQuestionContent,
  aiContentCheck,
  SENSITIVE_WORDS
}
