import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")

type ContentType =
  | { type: "status"; content: string }
  | { type: "text"; content: string; italic?: boolean }
  | { type: "task"; text: string; checked: boolean; level: number; children?: ContentType[] }
  | { type: "divider"; content: string }

type Theme = "tech-blue" | "tech-purple" | "tech-green" | "tech-red"

interface CarouselItem {
  id: number
  title: string
  theme: Theme
  content: ContentType[]
  image?: string
}

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

    if (trimmed.startsWith("# ")) {
      title = trimmed.replace("# ", "").trim()
      continue
    }

    if (trimmed.startsWith("theme:")) {
      const themeValue = trimmed.replace("theme:", "").trim()
      if (["tech-blue", "tech-purple", "tech-green", "tech-red"].includes(themeValue)) {
        theme = themeValue as Theme
      }
      continue
    }

    if (trimmed.startsWith("image:")) {
      image = trimmed.replace("image:", "").trim()
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

  return { title, theme, content: processedContent, image }
}

export async function GET() {
  try {
    const configContent = fs.readFileSync(path.join(DATA_DIR, "config.md"), "utf-8")
    const carousel1Content = fs.readFileSync(path.join(DATA_DIR, "carousel-1-about.md"), "utf-8")
    const carousel2Content = fs.readFileSync(path.join(DATA_DIR, "carousel-2-live.md"), "utf-8")
    const carousel3Content = fs.readFileSync(path.join(DATA_DIR, "carousel-3-tasks.md"), "utf-8")
    const carousel4Content = fs.readFileSync(path.join(DATA_DIR, "carousel-4-avatar.md"), "utf-8")

    const config = parseConfig(configContent)
    const carousel1 = parseMarkdown(carousel1Content)
    const carousel2 = parseMarkdown(carousel2Content)
    const carousel3 = parseMarkdown(carousel3Content)
    const carousel4 = parseMarkdown(carousel4Content)

    const carouselData: CarouselItem[] = [
      { id: 1, ...carousel1 },
      { id: 2, ...carousel2 },
      { id: 3, ...carousel3 },
      { id: 4, ...carousel4 },
    ]

    return NextResponse.json({
      techScannerText: config.techScannerText,
      carousel: {
        autoPlay: config.carouselAutoPlay,
        interval: config.carouselInterval,
        pauseOnHover: false,
        data: carouselData,
      },
      screenShare: {
        video: {
          cursor: "always",
          displaySurface: "monitor" as const,
        },
        audio: false,
        pictureInPicture: false,
      },
    })
  } catch (error) {
    console.error("Error reading content files:", error)
    return NextResponse.json({ error: "Failed to load content" }, { status: 500 })
  }
}