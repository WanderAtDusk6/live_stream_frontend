"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"

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

interface CarouselItem {
  id: number
  title: string
  theme: Theme
  content: ContentType[]
  image?: string
}

interface AppConfig {
  techScannerText: string
  carousel: {
    autoPlay: boolean
    interval: number
    pauseOnHover: boolean
    data: CarouselItem[]
  }
  screenShare: {
    video: {
      cursor: string
      displaySurface: "monitor" | "window" | "browser"
    }
    audio: boolean
    pictureInPicture: boolean
  }
}

interface ContentContextType {
  config: AppConfig | null
  loading: boolean
  error: string | null
  refresh: () => void
}

const ContentContext = createContext<ContentContextType>({
  config: null,
  loading: true,
  error: null,
  refresh: () => {},
})

export function useContent() {
  return useContext(ContentContext)
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<AppConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConfig = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/content")
      if (!response.ok) {
        throw new Error("Failed to fetch content")
      }
      const data = await response.json()
      setConfig(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfig()
  }, [])

  return (
    <ContentContext.Provider
      value={{ config, loading, error, refresh: fetchConfig }}
    >
      {children}
    </ContentContext.Provider>
  )
}

export type { AppConfig, CarouselItem, ContentType, Theme }
