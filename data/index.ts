// ============================================
// 配置文件说明 / Configuration Instructions
// ============================================
// 你只需要修改 data/ 目录下的以下文件，就能更新网页内容：
// You only need to modify these files in data/ directory to update the web content:
//
// 1. config.md              - 基础配置 (TechScanner文字、走马灯设置等)
// 2. carousel-1-about.md    - 走马灯卡片1 (关于主包)
// 3. carousel-2-live.md     - 走马灯卡片2 (当前直播)
// 4. carousel-3-tasks.md    - 走马灯卡片3 (今日任务)
// 5. carousel-4-avatar.md   - 走马灯卡片4 (头像卡片)
//
// 修改后保存，刷新网页即可看到变化！
// ============================================

// 配置文件内容 / Config file contents
// 下面的内容是从 data/*.md 文件复制过来的，请同步修改！

const configMarkdown = `# 直播间配置 / Live Stream Config

## TechScanner 文字 / TechScanner Text
SYSTEM ONLINE

## 走马灯自动播放 / Carousel Auto Play
true

## 走马灯间隔（毫秒）/ Carousel Interval (ms)
8000
`

const carousel1Markdown = `# 关于主包

theme: tech-blue

[日常+互动] AI心翎
[编程+其他] 工具人

---

当前阶段工具人代播

---

*Fake it till you make it*
`

const carousel2Markdown = `# 当前直播: 鸣潮3.3剧情

theme: tech-purple

剧透了剧透了，
没过剧情的kg出去

---

游戏太多了，
玩不完根本玩不完
`

const carousel3Markdown = `# 今日直播目标

theme: tech-green

- [ ] [游戏] 鸣潮3.3
  - [x] 主线进度
  - [ ] 支线任务
  - [ ] 隐藏成就
- [ ] [游戏] 原神5.0
  - [ ] 探索新地图
  - [ ] 角色突破
- [x] [其他] 写代码
`

const carousel4Markdown = `# Ciallo~(∠・ω< )⌒★

theme: tech-red
image: /character_sprite/XinLing.v2.olm.jpg

vup: 心翎XinLing (号不创了)
`

// 解析配置 / Parse config
function parseConfig(content: string) {
  const lines = content.split("\n")
  const config: Record<string, string> = {}
  
  let currentKey = ""
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue
    if (trimmed.startsWith("#")) continue
    
    if (trimmed.startsWith("## ")) {
      currentKey = trimmed.replace("## ", "").split(" / ")[0].trim()
      continue
    }
    
    if (currentKey) {
      config[currentKey] = trimmed
    }
  }
  
  return {
    techScannerText: config["TechScanner 文字"] || "SYSTEM ONLINE",
    carouselAutoPlay: config["走马灯自动播放"] !== "false",
    carouselInterval: parseInt(config["走马灯间隔（毫秒）"] || "8000"),
  }
}

export type ContentType =
  | { type: "status"; content: string }
  | { type: "text"; content: string; italic?: boolean }
  | { type: "task"; text: string; checked: boolean; level: number; children?: ContentType[] }
  | { type: "divider"; content: string }

export type Theme = "tech-blue" | "tech-purple" | "tech-green" | "tech-red"

export interface CarouselItem {
  id: number
  title: string
  theme: Theme
  content: ContentType[]
  image?: string
}

function parseMarkdown(content: string): { title: string; theme: Theme; content: ContentType[]; image?: string } {
  const lines = content.split("\n")
  const result: ContentType[] = []
  let title = ""
  let theme: Theme = "tech-blue"
  let image: string | undefined
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    if (!trimmed) continue
    
    // 提取标题 / Extract title
    if (trimmed.startsWith("# ")) {
      title = trimmed.replace("# ", "").trim()
      continue
    }
    
    // 提取主题 / Extract theme
    if (trimmed.startsWith("theme:")) {
      const themeValue = trimmed.replace("theme:", "").trim()
      if (["tech-blue", "tech-purple", "tech-green", "tech-red"].includes(themeValue)) {
        theme = themeValue as Theme
      }
      continue
    }
    
    // 提取图片 / Extract image
    if (trimmed.startsWith("image:")) {
      image = trimmed.replace("image:", "").trim()
      continue
    }
    
    if (trimmed === "---") {
      result.push({ type: "divider", content: "---" })
      continue
    }

    // 匹配任务，保留前面的空格 / Match task, preserve leading spaces
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
    
    // 检查斜体格式 *text* / Check italic format
    let contentText = trimmed
    let isItalic = false
    
    if (trimmed.startsWith("*") && trimmed.endsWith("*")) {
      contentText = trimmed.slice(1, -1)
      isItalic = true
    }

    result.push({ type: "text", content: contentText, italic: isItalic })
  }

  // 构建任务层级 / Build task hierarchy
  const processedContent: ContentType[] = []
  const levelStack: (ContentType & { type: "task" })[] = []
  
  for (const item of result) {
    if (item.type !== "task") {
      processedContent.push(item)
      continue
    }
    
    const task = item as ContentType & { type: "task" }
    
    // 移除比当前层级更深的任务 / Remove tasks deeper than current level
    while (levelStack.length > task.level) {
      levelStack.pop()
    }
    
    if (task.level === 0) {
      // 顶级任务 / Top-level task
      processedContent.push(task)
      levelStack.push(task)
    } else {
      // 子任务 / Child task
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

  return { title, theme, content: processedContent, image }
}

// 解析所有数据 / Parse all data
const config = parseConfig(configMarkdown)
const carousel1 = parseMarkdown(carousel1Markdown)
const carousel2 = parseMarkdown(carousel2Markdown)
const carousel3 = parseMarkdown(carousel3Markdown)
const carousel4 = parseMarkdown(carousel4Markdown)

export const appConfig = {
  techScannerText: config.techScannerText,
  carousel: {
    autoPlay: config.carouselAutoPlay,
    interval: config.carouselInterval,
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
    id: 1,
    title: carousel1.title,
    theme: carousel1.theme,
    content: carousel1.content,
  },
  {
    id: 2,
    title: carousel2.title,
    theme: carousel2.theme,
    content: carousel2.content,
  },
  {
    id: 3,
    title: carousel3.title,
    theme: carousel3.theme,
    content: carousel3.content,
  },
  {
    id: 4,
    title: carousel4.title,
    theme: carousel4.theme,
    content: carousel4.content,
    image: carousel4.image,
  },
]