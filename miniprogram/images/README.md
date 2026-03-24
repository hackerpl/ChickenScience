# TabBar 图标说明

## 需要的图标文件

请在 `miniprogram/images/` 目录下添加以下图标文件：

### 首页图标
- `tab-home.png` - 未选中状态（81x81 px，建议不超过 40kb）
- `tab-home-active.png` - 选中状态（81x81 px，建议不超过 40kb）

### 学习图标
- `tab-study.png` - 未选中状态（81x81 px，建议不超过 40kb）
- `tab-study-active.png` - 选中状态（81x81 px，建议不超过 40kb）

### 我的图标
- `tab-profile.png` - 未选中状态（81x81 px，建议不超过 40kb）
- `tab-profile-active.png` - 选中状态（81x81 px，建议不超过 40kb）

## 图标规范

1. **尺寸**: 81x81 px（推荐）
2. **格式**: PNG
3. **大小**: 不超过 40kb
4. **颜色**:
   - 未选中: 灰色系 (#999999)
   - 选中: 蓝色系 (#4A90E2)

## 添加图标后

添加图标文件后，修改 `miniprogram/app.json` 中的 tabBar 配置，将 iconPath 和 selectedIconPath 取消注释：

```json
"tabBar": {
  "color": "#999999",
  "selectedColor": "#4A90E2",
  "backgroundColor": "#FFFFFF",
  "borderStyle": "black",
  "list": [
    {
      "pagePath": "pages/index/index",
      "text": "首页",
      "iconPath": "images/tab-home.png",
      "selectedIconPath": "images/tab-home-active.png"
    },
    {
      "pagePath": "pages/study/study",
      "text": "学习",
      "iconPath": "images/tab-study.png",
      "selectedIconPath": "images/tab-study-active.png"
    },
    {
      "pagePath": "pages/profile/profile",
      "text": "我的",
      "iconPath": "images/tab-profile.png",
      "selectedIconPath": "images/tab-profile-active.png"
    }
  ]
}
```

## 图标资源获取

### 在线图标库
- [Iconfont](https://www.iconfont.cn/) - 阿里巴巴图标库
- [IconPark](https://iconpark.oceanengine.com/) - 字节跳动图标库
- [Flaticon](https://www.flaticon.com/) - 免费图标库

### 推荐图标
- 首页: 🏠 房子图标
- 学习: 📖 书本/学习图标
- 我的: 👤 用户/个人图标

### 快速制作
1. 从在线图标库下载 SVG 图标
2. 使用在线工具转换为 PNG:
   - [CloudConvert](https://cloudconvert.com/svg-to-png)
   - [Convertio](https://convertio.co/zh/svg-png/)
3. 调整尺寸为 81x81 px
4. 放入 `miniprogram/images/` 目录
