// ============================================
// 配置文件说明 / Configuration Instructions
// ============================================
// 你只需要修改 data/ 目录下的以下文件，就能更新网页内容：
// You only need to modify these files in data/ directory to update the web content:
//
// 1. config.json             - 配置文件 (TechScanner文字、走马灯设置、主题等)
// 2. carousel-1-about.md     - 走马灯卡片1内容 (关于主包)
// 3. carousel-2-live.md      - 走马灯卡片2内容 (当前直播)
// 4. carousel-3-tasks.md     - 走马灯卡片3内容 (今日任务)
// 5. carousel-4-avatar.md    - 走马灯卡片4内容 (头像卡片)
//
// 修改后保存，刷新网页即可看到变化！
// ============================================

import configData from "./config.json"

export type ContentType =
  | { type: "status"; content: string }
  | { type: "text"; content: string; italic?: boolean }
  | {
      type: "task"
      text: string
      checked: boolean
      level: number
      children?: ContentType[]
    }
  | { type: "divider"; content: string }

export type Theme = "tech-blue" | "tech-purple" | "tech-green" | "tech-red"

export interface CarouselItem {
  id: number
  title: string
  theme: Theme
  content: ContentType[]
  image?: string
}

function parseMarkdown(content: string): {
  title: string
  content: ContentType[]
} {
  const lines = content.split("\n")
  const result: ContentType[] = []
  let title = ""
  let inComment = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    if (!trimmed) continue

    if (trimmed.startsWith("<!--")) {
      inComment = true
      if (trimmed.endsWith("-->")) {
        inComment = false
      }
      continue
    }

    if (inComment) {
      if (trimmed.endsWith("-->")) {
        inComment = false
      }
      continue
    }

    if (trimmed.startsWith("# ")) {
      title = trimmed.replace("# ", "").trim()
      continue
    }

    if (trimmed === "---") {
      result.push({ type: "divider", content: "---" })
      continue
    }

    const leadingSpacesMatch = line.match(/^(\s*)- \[([ x])\] (.+)$/)
    if (leadingSpacesMatch) {
      const leadingSpaces = leadingSpacesMatch[1]
      const level = Math.floor(leadingSpaces.length / 2)
      result.push({
        type: "task",
        text: leadingSpacesMatch[3],
        checked: leadingSpacesMatch[2] === "x",
        level: level,
      })
      continue
    }

    if (trimmed.startsWith(">")) {
      result.push({ type: "text", content: trimmed.replace(/^>\s*/, "") })
      continue
    }

    let contentText = trimmed
    let isItalic = false

    if (trimmed.startsWith("*") && trimmed.endsWith("*")) {
      contentText = trimmed.slice(1, -1)
      isItalic = true
    }

    result.push({ type: "text", content: contentText, italic: isItalic })
  }

  const processedContent: ContentType[] = []
  const levelStack: (ContentType & { type: "task" })[] = []

  for (const item of result) {
    if (item.type !== "task") {
      processedContent.push(item)
      continue
    }

    const task = item as ContentType & { type: "task" }

    while (levelStack.length > task.level) {
      levelStack.pop()
    }

    if (task.level === 0) {
      processedContent.push(task)
      levelStack.push(task)
    } else {
      const parent = levelStack[task.level - 1]
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(task)
      }
      levelStack.push(task)
    }
  }

  return { title, content: processedContent }
}

const carouselContent1 = `# 关于主包

[日常+互动] AI心翎
[编程+其他] 工具人

---

当前阶段工具人代播

---

*Fake it till you make it*

---
上方**SYSTEM ONLINE**时，可在弹幕与ai互动哦。`

const carouselContent2 = `# 当前直播

hihihihihi
内容内容内容`

const carouselContent3 = `# 今日直播目标

- [ ] [游戏] 鸣潮3.3
  - [x] 主线进度
  - [ ] 支线任务
  - [ ] 隐藏成就
- [ ] [游戏] 修改数据
  - [ ] 测试测试
  - [ ] 1111
- [x] [其他] 写代码`

const carouselContent4 = `vup: 心翎XinLing (号不创了)`

const carousel1Config = configData.carousel.find((c) => c.id === 1)!
const carousel2Config = configData.carousel.find((c) => c.id === 2)!
const carousel3Config = configData.carousel.find((c) => c.id === 3)!
const carousel4Config = configData.carousel.find((c) => c.id === 4)!

const carousel1 = parseMarkdown(carouselContent1)
const carousel2 = parseMarkdown(carouselContent2)
const carousel3 = parseMarkdown(carouselContent3)

export const appConfig = {
  techScannerText: configData.techScannerText || "SYSTEM ONLINE",
  carousel: {
    autoPlay: configData.carouselAutoPlay !== false,
    interval: configData.carouselInterval || 8000,
    pauseOnHover: false,
  },
  screenShare: {
    video: {
      cursor: "always",
      displaySurface: "monitor" as const,
    },
    audio: false,
  },
}

export const carouselData: CarouselItem[] = [
  {
    id: carousel1Config.id,
    title: carousel1.title || "未命名",
    theme: carousel1Config.theme as Theme,
    content: carousel1.content,
  },
  {
    id: carousel2Config.id,
    title: carousel2.title || "未命名",
    theme: carousel2Config.theme as Theme,
    content: carousel2.content,
  },
  {
    id: carousel3Config.id,
    title: carousel3.title || "未命名",
    theme: carousel3Config.theme as Theme,
    content: carousel3.content,
  },
  {
    id: carousel4Config.id,
    title: carousel4Config.title || "未命名",
    theme: carousel4Config.theme as Theme,
    content: parseMarkdown(carouselContent4).content,
    image: carousel4Config.image,
  },
]
