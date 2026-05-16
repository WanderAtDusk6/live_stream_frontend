import type { Metadata } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"

// 配置元数据（SEO）
export const metadata: Metadata = {
  title: "虚拟主播直播间",
  description: "科技风格的虚拟主播直播间UI",
  icons: {
    icon: "/favicon.ico",
  },
}

/**
 * Next.js 根布局组件
 * 所有页面都会包裹在此布局中
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={cn("antialiased", "font-sans")}
    >
      {/* 
        使用 suppressHydrationWarning 避免服务端渲染与客户端渲染的差异警告
        因为我们的直播UI有大量客户端交互（屏幕共享等）
      */}
      <body className="min-h-screen overflow-hidden bg-black text-white">
        {/* 
          ThemeProvider 提供深色/浅色主题切换功能
          我们的直播UI主要使用深色主题
        */}
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}