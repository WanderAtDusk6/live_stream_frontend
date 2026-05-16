import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")

type ContentType =
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

type Theme = "tech-blue" | "tech-purple" | "tech-green" | "tech-red"

interface CarouselConfig {
  id: number
  title?: string
  theme: Theme
  image?: string
}

interface ConfigData {
  techScannerText: string
  carouselAutoPlay: boolean
  carouselInterval: number
  carousel: CarouselConfig[]
}

interface CarouselItem {
  id: number
  title: string
  theme: Theme
  content: ContentType[]
  image?: string
}

function parseContent(content: string): {
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

export async function GET() {
  try {
    const configContent = fs.readFileSync(
      path.join(DATA_DIR, "config.json"),
      "utf-8"
    )
    const config: ConfigData = JSON.parse(configContent)

    const carousel1Content = fs.readFileSync(
      path.join(DATA_DIR, "carousel-1-about.md"),
      "utf-8"
    )
    const carousel2Content = fs.readFileSync(
      path.join(DATA_DIR, "carousel-2-live.md"),
      "utf-8"
    )
    const carousel3Content = fs.readFileSync(
      path.join(DATA_DIR, "carousel-3-tasks.md"),
      "utf-8"
    )
    const carousel4Content = fs.readFileSync(
      path.join(DATA_DIR, "carousel-4-avatar.md"),
      "utf-8"
    )

    const carousel1 = parseContent(carousel1Content)
    const carousel2 = parseContent(carousel2Content)
    const carousel3 = parseContent(carousel3Content)
    const carousel4 = parseContent(carousel4Content)

    const carousel1Config = config.carousel.find((c) => c.id === 1)!
    const carousel2Config = config.carousel.find((c) => c.id === 2)!
    const carousel3Config = config.carousel.find((c) => c.id === 3)!
    const carousel4Config = config.carousel.find((c) => c.id === 4)!

    const carouselData: CarouselItem[] = [
      {
        id: 1,
        title: carousel1.title || "未命名",
        theme: carousel1Config.theme,
        content: carousel1.content,
      },
      {
        id: 2,
        title: carousel2.title || "未命名",
        theme: carousel2Config.theme,
        content: carousel2.content,
      },
      {
        id: 3,
        title: carousel3.title || "未命名",
        theme: carousel3Config.theme,
        content: carousel3.content,
      },
      {
        id: 4,
        title: carousel4Config.title || carousel4.title || "未命名",
        theme: carousel4Config.theme,
        content: carousel4.content,
        image: carousel4Config.image,
      },
    ]

    return NextResponse.json({
      techScannerText: config.techScannerText || "SYSTEM ONLINE",
      carousel: {
        autoPlay: config.carouselAutoPlay !== false,
        interval: config.carouselInterval || 8000,
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
    return NextResponse.json(
      { error: "Failed to load content" },
      { status: 500 }
    )
  }
}
