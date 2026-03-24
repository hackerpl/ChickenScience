// utils/constant.js - 常量定义

/**
 * VIP等级配置
 */
const VIP_CONFIG = {
  // VIP等级对应的功能描述
  FEATURES: {
    '1-4': '基础功能 + 额外题目',
    '5': '题库扩展',
    '6-9': '丰富学习资源',
    '10': '好友系统 + 私聊功能',
    '11-14': '基础特权',
    '15': '商店系统',
    '16-19': '高级题目',
    '20': '多人对战（2v2）',
    '21-29': '扩展特权（历史最高达到20后可解锁）',
    '30': '修改昵称'
  },

  // 每级VIP需要的条件
  CONDITIONS: {
    '1': { type: 'beginner', description: '新手用户' },
    '2-5': { type: 'rank', rank: 'top50', description: '排行榜前50名' },
    '6-10': { type: 'rank', rank: 'top20', description: '排行榜前20名' },
    '11-20': { type: 'rank', rank: 'top5', description: '排行榜前5名' },
    '21-30': { type: 'rank', rank: 'top5', maxVip: 20, description: '排行榜前5名（历史最高VIP达到20）' }
  }
}

/**
 * 金币配置
 */
const COIN_CONFIG = {
  // 答对题目奖励
  CORRECT_ANSWER: 1,
  // VIP用户答对题目奖励
  VIP_CORRECT_ANSWER: 2,
  // 对战胜利奖励（普通用户）
  BATTLE_WIN: 1,
  // 对战胜利奖励（VIP用户）
  VIP_BATTLE_WIN: 2,
  // 满勤奖励
  FULL_ATTENDANCE: 100,
  // 成就奖励
  ACHIEVEMENT: {
    'NEW_USER': 10,
    'ANSWER_100': 50,
    'PERFECT_10': 100,
    'BATTLE_WIN_10': 50
  }
}

/**
 * 题目类型
 */
const QUESTION_TYPES = {
  JUDGMENT: '判断题',
  FILL_BLANK: '填空题',
  CHALLENGE: '挑战题'
}

/**
 * 科目类型
 */
const SUBJECTS = {
  PHYSICS: '物理',
  CHEMISTRY: '化学',
  BIOLOGY: '生物',
  CHINESE: '语文'
}

/**
 * 年级配置
 */
const GRADES = [
  '小学一年级', '小学二年级', '小学三年级', '小学四年级',
  '小学五年级', '小学六年级',
  '初中一年级', '初中二年级', '初中三年级',
  '高中一年级', '高中二年级', '高中三年级',
  '大学一年级', '大学二年级', '大学三年级', '大学四年级'
]

/**
 * 难度等级
 */
const DIFFICULTY = {
  EASY: 1,
  MEDIUM: 2,
  HARD: 3,
  NAMES: {
    1: '简单',
    2: '中等',
    3: '困难'
  }
}

/**
 * 答题配置
 */
const QUIZ_CONFIG = {
  // 每次答题数量
  QUESTION_COUNT: 10,
  // 错误次数阈值（触发视频讲解）
  WRONG_THRESHOLD: 3,
  // 快速翻页阈值（秒）
  FAST_READ_THRESHOLD: 3
}

/**
 * 成就配置
 */
const ACHIEVEMENTS = {
  NEW_USER: {
    id: 'new_user',
    name: '🎓 新手学者',
    description: '完成10道题',
    condition: { type: 'answer_count', count: 10 },
    reward: 10
  },
  ANSWER_100: {
    id: 'answer_100',
    name: '🔥 答题达人',
    description: '完成100道题',
    condition: { type: 'answer_count', count: 100 },
    reward: 50
  },
  PERFECT_10: {
    id: 'perfect_10',
    name: '💯 满分王者',
    description: '连续10题全对',
    condition: { type: 'perfect_streak', count: 10 },
    reward: 100
  },
  BATTLE_WIN_10: {
    id: 'battle_win_10',
    name: '👑 对战之王',
    description: '获胜10次',
    condition: { type: 'battle_win', count: 10 },
    reward: 50
  },
  VIP_5: {
    id: 'vip_5',
    name: '⭐ 五连VIP',
    description: '获得5次VIP等级',
    condition: { type: 'vip_level', count: 5 },
    reward: 0,
    special: 'VIP专属头像框'
  }
}

/**
 * 学习模式
 */
const STUDY_MODES = {
  NORMAL: 'normal',
  WRONG: 'wrong',
  CHALLENGE: 'challenge',
  NAMES: {
    normal: '日常练习',
    wrong: '错题复习',
    challenge: '挑战模式'
  }
}

/**
 * API响应状态码
 */
const RESPONSE_CODE = {
  SUCCESS: 0,
  ERROR: -1,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
}

module.exports = {
  VIP_CONFIG,
  COIN_CONFIG,
  QUESTION_TYPES,
  SUBJECTS,
  GRADES,
  DIFFICULTY,
  QUIZ_CONFIG,
  ACHIEVEMENTS,
  STUDY_MODES,
  RESPONSE_CODE
}
