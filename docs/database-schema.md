# 小鸡科学 - 数据库表结构设计

## 数据库说明

使用腾讯云数据库（MongoDB），采用文档型存储。

---

## 1. 用户表 (users)

存储用户基本信息和状态。

```javascript
{
  "_id": "用户ID（自动生成）",
  "openid": "微信openid",
  "unionid": "微信unionid（可选）",

  // 基本信息
  "nickname": "用户昵称",
  "avatar": "头像URL",
  "grade": "年级",
  "age": "年龄",
  "identity": "身份（master/beginner）",

  // VIP系统
  "vip_level": 5,              // 当前VIP等级（1-30）
  "max_vip_level": 8,          // 历史最高VIP等级

  // 金币系统
  "coins": 1200,               // 金币余额

  // 状态
  "status": "active",          // 用户状态

  // 时间戳
  "created_at": "2026-02-15T00:00:00Z",
  "updated_at": "2026-02-15T00:00:00Z",
  "last_login": "2026-02-15T10:00:00Z"
}
```

**索引**:
- `openid` (唯一索引)
- `vip_level` (普通索引)

---

## 2. 家长表 (parents)

存储家长验证信息。

```javascript
{
  "_id": "家长ID（自动生成）",
  "user_id": "用户ID",
  "password": "加密后的密码",

  // 指纹验证
  "fingerprint_enabled": true,
  "fingerprint_data": "指纹数据（可选）",

  // 时间戳
  "created_at": "2026-02-15T00:00:00Z",
  "updated_at": "2026-02-15T00:00:00Z"
}
```

**索引**:
- `user_id` (唯一索引)

---

## 3. 题库表 (questions)

存储所有题目。

```javascript
{
  "_id": "题目ID（自动生成）",

  // 题目基本信息
  "subject": "物理",           // 科目：物理/化学/生物/语文
  "grade_level": "小学四年级", // 适用年级
  "type": "判断题",            // 类型：判断题/填空题/挑战题
  "question": "题目内容",

  // 答案
  "answer": "对",              // 正确答案
  "options": [                 // 选项（判断题使用）
    "对",
    "错"
  ],

  // 难度
  "difficulty": 1,             // 难度：1-简单 2-中等 3-困难
  "knowledge_point": "力与运动", // 知识点

  // 讲解
  "explanation": "题目解析...",
  "videoUrl": "https://...",   // 讲解视频URL（可选）

  // 状态
  "status": "active",          // 状态：active/inactive

  // 时间戳
  "created_at": "2026-02-15T00:00:00Z",
  "updated_at": "2026-02-15T00:00:00Z"
}
```

**索引**:
- `subject` (普通索引)
- `grade_level` (普通索引)
- `type` (普通索引)
- `difficulty` (普通索引)
- `knowledge_point` (普通索引)

---

## 4. 错题表 (wrong_questions)

存储用户错题记录。

```javascript
{
  "_id": "错题ID（自动生成）",
  "user_id": "用户ID",
  "question_id": "题目ID",

  // 错误记录
  "wrong_count": 3,            // 错误次数
  "wrong_times": [             // 错误时间记录
    "2026-02-15T10:00:00Z",
    "2026-02-15T11:00:00Z",
    "2026-02-15T12:00:00Z"
  ],
  "wrong_answers": [           // 错误答案记录
    "错",
    "错",
    "错"
  ],

  // 掌握状态
  "is_mastered": false,        // 是否已掌握
  "correct_streak": 0,         // 连续正确次数

  // 重点复习
  "is_key_review": true,       // 是否进入重点复习库

  // 时间戳
  "created_at": "2026-02-15T00:00:00Z",
  "updated_at": "2026-02-15T00:00:00Z"
}
```

**索引**:
- `user_id` (普通索引)
- `question_id` (普通索引)
- `is_key_review` (普通索引)
- `{user_id: 1, is_key_review: 1}` (复合索引)

---

## 5. 学习记录表 (study_records)

存储用户每日学习记录。

```javascript
{
  "_id": "记录ID（自动生成）",
  "user_id": "用户ID",

  // 日期
  "date": "2026-02-15",        // 学习日期

  // 统计数据
  "question_count": 50,        // 答题数量
  "correct_count": 45,         // 正确数量
  "wrong_count": 5,            // 错误数量
  "correct_rate": 90,          // 正确率

  // 学习时长（秒）
  "study_duration": 3600,      // 学习时长

  // 详细记录
  "subjects": {                // 各科目统计
    "物理": {
      "count": 20,
      "correct": 18
    },
    "化学": {
      "count": 15,
      "correct": 13
    }
  },

  // 时间戳
  "created_at": "2026-02-15T00:00:00Z",
  "updated_at": "2026-02-15T00:00:00Z"
}
```

**索引**:
- `user_id` (普通索引)
- `date` (普通索引)
- `{user_id: 1, date: 1}` (唯一复合索引)

---

## 6. 对战记录表 (battle_records)

存储用户对战记录。

```javascript
{
  "_id": "对战ID（自动生成）",

  // 对战双方
  "user_id": "用户ID",
  "opponent_id": "对手ID",

  // 对战信息
  "battle_type": "1v1",        // 对战类型：1v1/2v2
  "room_id": "房间ID",

  // 结果
  "result": "win",             // 结果：win/lose/draw
  "score": 10,                 // 得分
  "opponent_score": 8,         // 对手得分

  // 奖励
  "coins_earned": 2,           // 获得金币

  // 对战详情
  "questions": [               // 对战题目
    {
      "asker_id": "出题人ID",
      "question": "题目内容",
      "answer_result": "correct" // correct/wrong/skip
    }
  ],

  // 时间戳
  "battle_time": "2026-02-15T10:00:00Z",
  "created_at": "2026-02-15T00:00:00Z"
}
```

**索引**:
- `user_id` (普通索引)
- `opponent_id` (普通索引)
- `battle_time` (普通索引)

---

## 7. 好友表 (friends)

存储用户好友关系。

```javascript
{
  "_id": "好友ID（自动生成）",
  "user_id": "用户ID",
  "friend_id": "好友ID",

  // 关系状态
  "status": "accepted",        // 状态：pending/accepted/blocked

  // 添加方式
  "add_method": "battle",      // 添加方式：battle/search
  "add_reason": "对战中被击败",

  // 时间戳
  "created_at": "2026-02-15T00:00:00Z",
  "updated_at": "2026-02-15T00:00:00Z"
}
```

**索引**:
- `user_id` (普通索引)
- `friend_id` (普通索引)
- `{user_id: 1, friend_id: 1}` (唯一复合索引)
- `status` (普通索引)

---

## 8. 聊天记录表 (chat_messages)

存储用户聊天消息。

```javascript
{
  "_id": "消息ID（自动生成）",

  // 消息双方
  "sender_id": "发送者ID",
  "receiver_id": "接收者ID",

  // 消息内容
  "message": "消息内容",
  "message_type": "text",      // 类型：text/image

  // 过滤状态
  "is_filtered": false,        // 是否被过滤
  "filter_reason": "",         // 过滤原因

  // 状态
  "is_read": false,            // 是否已读

  // 时间戳
  "created_at": "2026-02-15T10:00:00Z"
}
```

**索引**:
- `sender_id` (普通索引)
- `receiver_id` (普通索引)
- `created_at` (普通索引)
- `{sender_id: 1, receiver_id: 1, created_at: 1}` (复合索引)

---

## 9. 成就表 (achievements)

存储用户成就解锁记录。

```javascript
{
  "_id": "成就ID（自动生成）",
  "user_id": "用户ID",

  // 成就信息
  "achievement_id": "answer_100", // 成就ID
  "achievement_name": "🔥 答题达人",
  "achievement_type": "answer",   // 类型：answer/battle/other

  // 奖励
  "coins_rewarded": 50,        // 金币奖励

  // 时间戳
  "completed_at": "2026-02-15T10:00:00Z",
  "created_at": "2026-02-15T00:00:00Z"
}
```

**索引**:
- `user_id` (普通索引)
- `achievement_id` (普通索引)
- `{user_id: 1, achievement_id: 1}` (唯一复合索引)

---

## 10. 创新发现表 (innovations)

存储用户提交的创新发现。

```javascript
{
  "_id": "发现ID（自动生成）",
  "user_id": "用户ID",

  // 发现内容
  "question": "创新问题",
  "description": "详细描述",
  "category": "物理",

  // 审核状态
  "status": "pending",         // 状态：pending/approved/rejected
  "review_result": "审核意见",
  "reviewer_id": "审核员ID",

  // 奖励
  "is_awarded": false,         // 是否已颁奖
  "awarded_at": "",            // 颁奖时间

  // 时间戳
  "created_at": "2026-02-15T00:00:00Z",
  "updated_at": "2026-02-15T00:00:00Z"
}
```

**索引**:
- `user_id` (普通索引)
- `status` (普通索引)

---

## 11. 出勤记录表 (attendance)

存储用户每日出勤记录。

```javascript
{
  "_id": "出勤ID（自动生成）",
  "user_id": "用户ID",

  // 日期
  "year": 2026,
  "month": 2,
  "day": 15,

  // 出勤状态
  "has_answered": true,        // 是否答题
  "answer_count": 10,          // 答题数量

  // 时间戳
  "created_at": "2026-02-15T00:00:00Z"
}
```

**索引**:
- `user_id` (普通索引)
- `{user_id: 1, year: 1, month: 1, day: 1}` (唯一复合索引)

---

## 12. VIP记录表 (vip_records)

存储用户VIP等级变化记录。

```javascript
{
  "_id": "记录ID（自动生成）",
  "user_id": "用户ID",

  // VIP变化
  "old_level": 4,
  "new_level": 5,
  "change_type": "promote",    // 类型：promote/demote/reset

  // 变化原因
  "reason": "排行榜前5名",

  // 时间戳
  "changed_at": "2026-02-15T10:00:00Z",
  "created_at": "2026-02-15T00:00:00Z"
}
```

**索引**:
- `user_id` (普通索引)
- `changed_at` (普通索引)

---

## 13. 被过滤内容表 (filtered_content)

存储被过滤的内容，供家长查看。

```javascript
{
  "_id": "记录ID（自动生成）",
  "user_id": "用户ID",

  // 内容信息
  "content_type": "chat",      // 类型：chat/question
  "original_content": "原始内容",
  "filter_reason": "过滤原因",

  // 相关信息
  "target_id": "接收者ID/题目ID",

  // 时间戳
  "created_at": "2026-02-15T10:00:00Z"
}
```

**索引**:
- `user_id` (普通索引)
- `created_at` (普通索引)

---

## 数据库安全规则

### 读取规则
- 所有用户只能读取自己的数据（`openid === doc.openid`）
- 题库表对所有用户开放读取
- 排行榜数据对所有用户开放读取

### 写入规则
- 用户只能创建/修改自己的数据
- 家长验证数据需要特殊权限
- 云函数拥有完全权限

### 示例安全规则

```json
{
  "read": "auth.openid == doc.openid || doc._id == 'public'",
  "write": "auth.openid == doc.openid"
}
```

---

## 数据备份

- 每日自动备份
- 保留最近30天的备份
- 重要变更前手动备份

---

**文档更新日期**: 2026-02-15
