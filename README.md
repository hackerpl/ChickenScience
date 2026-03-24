# 小鸡科学 (ChickenScience)

> 让孩子爱上科学的教育游戏化微信小程序

## 项目简介

小鸡科学是一款通过游戏化方式让孩子主动学习科学知识的微信小程序。通过对战、排行榜、成就、VIP系统等游戏化元素，让孩子从"不想学"变成"主动学"。

### 核心功能

- **学习系统**: 答题练习、错题档案、每周复习、视频讲解
- **对战系统**: 1v1双人对战、2v2多人对战（VIP20）
- **社交系统**: 好友系统（VIP10）、私聊功能
- **激励系统**: 排行榜、VIP等级（1-30）、成就系统、金币奖励
- **家长系统**: 双重验证、学习报告、内容监督

### 目标用户

- 学生：小学到大学（物理/化学/生物/语文）
- 家长：25-45岁，关注孩子学习

---

## 当前状态

### ✅ 已完成 (Phase 1 - 项目初始化)

- [x] 项目目录结构搭建
- [x] 小程序配置文件（app.js, app.json, app.wxss）
- [x] 云函数目录结构
- [x] 工具函数库（request, storage, filter, constant）
- [x] 数据库表结构设计文档

### ✅ 已完成 (Phase 2 - 核心页面)

- [x] 启动页面 (pages/index) - 身份选择
- [x] 新手指引页面 (pages/guide) - 科学基础知识
- [x] 学习/答题页面 (pages/study) - 核心功能
- [x] 个人中心页面 (pages/profile) - 用户信息

### 🚧 进行中 (MVP开发)

以下功能需要进一步开发：

#### 云函数开发
- [ ] login - 用户登录
- [ ] getUserInfo - 获取用户信息
- [ ] getQuestion - 获取题目
- [ ] submitAnswer - 提交答案
- [ ] getWrongQuestions - 错题管理
- [ ] updateUserInfo - 更新用户信息
- [ ] contentFilter - 内容过滤

#### 家长模式页面
- [ ] 家长验证页面
- [ ] 家长控制面板
- [ ] 学习报告页面

#### 错题功能
- [ ] 错题列表页面
- [ ] 错题复习模式
- [ ] 重点复习库

#### 视频播放组件
- [ ] 视频播放器组件
- [ ] 强制观看逻辑

---

## 技术栈

| 层级 | 技术选型 |
|------|----------|
| 前端 | 微信小程序原生开发 |
| 后端 | 腾讯云开发 (Serverless) |
| 数据库 | 云数据库 (MongoDB) |
| 实时通讯 | WebSocket |

---

## 快速开始

### 1. 环境准备

- 安装微信开发者工具
- 注册微信小程序账号
- 开通腾讯云开发服务

### 2. 项目配置

```bash
# 克隆项目
git clone https://github.com/hackerpl/ChickenScience.git
cd ChickenScience
```

### 3. 配置云开发

在微信开发者工具中：

1. 打开项目根目录
2. 点击"云开发"按钮
3. 创建云开发环境
4. 修改 `miniprogram/app.js` 中的环境ID：
   ```javascript
   wx.cloud.init({
     env: 'your-env-id' // 替换为你的云开发环境ID
   })
   ```

### 4. 部署云函数

在微信开发者工具中：

1. 右键点击 `cloudfunctions` 目录
2. 选择"上传并部署：云端安装依赖"
3. 依次部署每个云函数

### 5. 创建数据库集合

在云开发控制台创建以下集合：

- users (用户表)
- questions (题库表)
- wrong_questions (错题表)
- study_records (学习记录表)
- parents (家长表)

### 6. 运行项目

在微信开发者工具中点击"编译"按钮即可运行。

---

## 项目结构

```
ChickenScience/
├── miniprogram/              # 小程序前端代码
│   ├── pages/               # 页面
│   │   ├── index/          # 启动页
│   │   ├── guide/          # 新手指引
│   │   ├── study/          # 学习/答题
│   │   ├── profile/        # 个人中心
│   │   └── parent/         # 家长模式
│   ├── components/          # 组件
│   │   ├── question-card/  # 题目卡片
│   │   └── video-player/   # 视频播放器
│   ├── utils/              # 工具函数
│   │   ├── request.js      # 网络请求
│   │   ├── storage.js      # 本地存储
│   │   ├── filter.js       # 内容过滤
│   │   └── constant.js     # 常量定义
│   ├── app.js              # 小程序入口
│   ├── app.json            # 全局配置
│   └── app.wxss            # 全局样式
├── cloudfunctions/         # 云函数
│   ├── login/              # 登录
│   ├── getUserInfo/        # 获取用户信息
│   ├── getQuestion/        # 获取题目
│   └── submitAnswer/       # 提交答案
├── docs/                   # 文档
│   └── database-schema.md  # 数据库设计
├── ChickenScience_PRD.md   # 产品需求文档
├── Dialogue_Records.md     # 对话记录
└── README.md               # 项目说明
```

---

## 开发计划

| 阶段 | 时间 | 目标 | 状态 |
|------|------|------|------|
| MVP | 1-2个月 | 核心功能可用 | 🚧 进行中 |
| V1.0 | 3-4个月 | 完整功能上线 | ⏳ 待开始 |
| V2.0 | 6个月 | 内容扩展 | ⏳ 待开始 |
| V3.0 | 9个月 | 社交与创新 | ⏳ 待开始 |

详细开发计划请参考 [工作计划文档](/.claude/plans/golden-painting-planet.md)

---

## 核心文档

- [产品需求文档 (PRD)](./ChickenScience_PRD.md)
- [对话记录](./Dialogue_Records.md)
- [数据库设计](./docs/database-schema.md)
- [工作计划](/.claude/plans/golden-painting-planet.md)

---

## 贡献指南

欢迎贡献代码、报告问题或提出建议！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 许可证

本项目采用 MIT 许可证。

---

## 联系方式

- 项目地址: https://github.com/hackerpl/ChickenScience
- 问题反馈: https://github.com/hackerpl/ChickenScience/issues

---

**让我们一起让孩子爱上科学！** 🚀🐣
