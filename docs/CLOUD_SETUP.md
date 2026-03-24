# 小鸡科学 - 云开发快速设置指南

## ⚠️ 当前问题：云函数执行失败

错误信息：`查询参数对象值不能均为undefined`

这是因为：
1. 数据库安全规则未配置
2. 用户数据还未创建

---

## 🔧 解决方案

### 步骤 1: 配置数据库安全规则

1. 打开微信开发者工具
2. 点击顶部菜单 **"云开发"**
3. 点击 **"数据库"**
4. 点击 **"安全规则"** 标签页
5. 为每个集合设置以下规则：

```json
{
  "read": true,
  "write": "auth.openid == doc.openid"
}
```

**注意**：暂时设置为 `read: true, write: true` 便于开发调试

### 步骤 2: 创建数据库集合

在云开发控制台的数据库页面，创建以下集合：

| 集合名 | 说明 |
|--------|------|
| `users` | 用户表 |
| `questions` | 题库表 |
| `wrong_questions` | 错题表 |
| `study_records` | 学习记录表 |

### 步骤 3: 添加题目数据

选择以下任一方式添加题目：

#### 方式A: 云开发控制台手动添加

在 `questions` 集合中点击 **"添加记录"**，添加以下JSON：

```json
{
  "subject": "物理",
  "grade_level": "小学四年级",
  "type": "判断题",
  "question": "水星上有水吗？",
  "answer": "错",
  "options": ["对", "错"],
  "difficulty": 1,
  "knowledge_point": "太阳系",
  "status": "active"
}
```

#### 方式B: 导入JSON文件

1. 在云开发控制台点击 **"数据库"** → **"questions"** 集合
2. 点击 **"导入"** 按钮
3. 将以下完整JSON数据导入：

```json
[
  {
    "subject": "物理",
    "grade_level": "小学四年级",
    "type": "判断题",
    "question": "水星上有水吗？",
    "answer": "错",
    "options": ["对", "错"],
    "difficulty": 1,
    "knowledge_point": "太阳系",
    "status": "active"
  },
  {
    "subject": "物理",
    "grade_level": "小学四年级",
    "type": "判断题",
    "question": "声音在真空中可以传播吗？",
    "answer": "错",
    "options": ["对", "错"],
    "difficulty": 2,
    "knowledge_point": "声学",
    "status": "active"
  },
  {
    "subject": "化学",
    "grade_level": "小学四年级",
    "type": "判断题",
    "question": "水的化学式是H₂O，由氢和氧组成吗？",
    "answer": "对",
    "options": ["对", "错"],
    "difficulty": 1,
    "knowledge_point": "水的组成",
    "status": "active"
  },
  {
    "subject": "生物",
    "grade_level": "小学四年级",
    "type": "判断题",
    "question": "植物进行光合作用需要阳光、水和二氧化碳吗？",
    "answer": "对",
    "options": ["对", "错"],
    "difficulty": 1,
    "knowledge_point": "光合作用",
    "status": "active"
  },
  {
    "subject": "物理",
    "grade_level": "小学四年级",
    "type": "填空题",
    "question": "地球表面的重力方向是向____的。",
    "answer": "下",
    "difficulty": 1,
    "knowledge_point": "重力",
    "status": "active"
  }
]
```

### 步骤 4: 重新部署云函数

1. 右键点击 `cloudfunctions/submitAnswer` 文件夹
2. 选择 **"上传并部署：云端安装依赖"**
3. 等待部署完成

### 步骤 5: 测试

1. 重新编译小程序
2. 选择身份（科学大师/小白）
3. 点击"学习"开始答题
4. 答题后应该能正常记录

---

## 🐛 调试技巧

### 查看云函数日志

1. 在云开发控制台
2. 点击 **"云函数"**
3. 点击具体云函数名称
4. 查看 **"日志"** 标签页

### 常见问题

**Q: 提示"用户不存在"**

A: 说明数据库中还没有你的用户记录。需要先选择身份，系统会自动创建用户。

**Q: 提示"缺少题目ID"**

A: 说明题目数据还没有添加到数据库，请先执行步骤3。

**Q: 云函数调用超时**

A: 检查云开发环境是否已开通，环境ID是否正确。

---

## 📋 完整设置检查清单

- [ ] 云开发已开通
- [ ] 环境ID已配置（在 app.js 中）
- [ ] 数据库安全规则已设置
- [ ] users 集合已创建
- [ ] questions 集合已创建
- - [ ] 已添加5道测试题目
- [ ] wrong_questions 集合已创建
- [ ] study_records 集合已创建
- [ ] 云函数已部署（全部6个）
- [ ] 小程序重新编译

---

完成以上步骤后，小程序应该可以正常运行了！
