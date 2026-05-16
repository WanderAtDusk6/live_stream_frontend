# 配置指南 / Configuration Guide

## 快速开始 / Quick Start

只需修改 `data/` 目录下的 Markdown 文件，即可更新网页内容！

## 配置文件说明 / Config Files

### 1. `config.md` - 基础配置 / Basic Config

**TechScanner 文字 / TechScanner Text**  
修改显示在 TechScanner 组件中的文字，例如：
```
## TechScanner 文字 / TechScanner Text
LIVE NOW
```

**走马灯自动播放 / Carousel Auto Play**  
设置走马灯是否自动播放：
```
## 走马灯自动播放 / Carousel Auto Play
true
```
- `true` - 自动播放
- `false` - 不自动播放

**走马灯间隔（毫秒）/ Carousel Interval (ms)**  
设置走马灯切换间隔（毫秒）：
```
## 走马灯间隔（毫秒）/ Carousel Interval (ms)
8000
```

---

### 2. `carousel-1-about.md` - 走马灯卡片1（关于主包）/ Card 1 (About)

格式说明 / Format:
```markdown
# 卡片标题 / Card Title
theme: tech-blue

内容行1
内容行2
*斜体文字 / Italic text*

---  # 分隔线 / Divider

更多内容...
```

主题颜色 / Theme Colors:
- `tech-blue` - 蓝色
- `tech-purple` - 紫色
- `tech-green` - 绿色
- `tech-red` - 红色

---

### 3. `carousel-2-live.md` - 走马灯卡片2（当前直播）/ Card 2 (Live)

格式同上。

---

### 4. `carousel-3-tasks.md` - 走马灯卡片3（今日目标）/ Card 3 (Tasks)

任务列表格式 / Task List Format:
```markdown
# 今日直播目标

theme: tech-green

- [ ] 未完成的任务 / Unfinished task
- [x] 已完成的任务 / Finished task
- [ ] [分类] 任务 / [Category] Task
```

---

## 更新内容步骤 / How to Update

1. 编辑 `data/` 目录下对应的 Markdown 文件
2. 将修改后的内容同时复制到 `data/index.ts` 中的对应变量中
3. 保存文件
4. 刷新网页即可看到更新

---

## 完整示例 / Full Example

### config.md
```markdown
# 直播间配置

## TechScanner 文字
LIVE STREAMING

## 走马灯自动播放
true

## 走马灯间隔（毫秒）
5000
```

### carousel-1-about.md
```markdown
# 关于我

theme: tech-purple

[日常] 虚拟主播
[游戏] 鸣潮、原神

---

欢迎来到我的直播间！

---

*Enjoy the show!*
```
