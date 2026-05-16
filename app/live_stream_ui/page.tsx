"use client"

import { useState } from "react"
import {
  MainArea,
  RightPanel,
  CarouselSection,
  TerminalSection,
  TechScanner,
  ContentProvider,
  useContent,
} from "@/components/live-stream"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react"

interface CollapsibleItemProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
  showTitle?: boolean
}

function CollapsibleItem({
  title,
  defaultOpen = false,
  children,
  showTitle = true,
}: CollapsibleItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      {showTitle && (
        <CollapsibleTrigger className="flex w-full items-center justify-between border-b border-cyan-500/30 py-2 text-cyan-300 hover:text-cyan-200 hover:no-underline">
          <span>{title}</span>
          {isOpen ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
      )}
      <CollapsibleContent className="py-2 text-xs text-cyan-200/80">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

function LiveStreamPageContent() {
  const [carouselVisible, setCarouselVisible] = useState(true)
  const [carouselPaused, setCarouselPaused] = useState(false)
  const [terminalVisible, setTerminalVisible] = useState(true)
  const [carouselTitleVisible, setCarouselTitleVisible] = useState(false)
  const [terminalTitleVisible, setTerminalTitleVisible] = useState(false)
  const [systemStatus, setSystemStatus] = useState<"online" | "offline">(
    "offline"
  )
  const { config, loading, error } = useContent()

  const scannerText = `SYSTEM ${systemStatus.toUpperCase()}`

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="animate-pulse text-cyan-400">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-red-400">Error: {error}</div>
      </div>
    )
  }

  return (
    <div
      className="fixed inset-0 flex h-screen w-screen flex-col"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: "50px 50px",
      }}
    >
      {/* 顶部区域 - 可以在这里加标题、导航等 */}
      <div className="h-0">{/* 你要的新元素可以加在这里 */}</div>

      {/* 中间内容区域 */}
      <div className="flex flex-1 gap-1 p-2">
        {/* 主区域 - 左侧大区域 */}
        <MainArea />

        {/* 新元素可以放在这里 */}
        {/* <YourNewComponent /> */}

        {/* 右侧面板 - 布局完全在这里控制！ */}
        <RightPanel>
          {/* 顶部科技感动画 - 点击切换 ONLINE/OFFLINE */}
          <TechScanner
            className="mb-2"
            text={scannerText}
            status={systemStatus}
            onClick={() =>
              setSystemStatus(systemStatus === "online" ? "offline" : "online")
            }
          />

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
            {/* 跑马灯 */}
            {carouselVisible && (
              <CollapsibleItem
                title="Carousel"
                defaultOpen
                showTitle={carouselTitleVisible}
              >
                <CarouselSection isPaused={carouselPaused} />
              </CollapsibleItem>
            )}

            {/* 终端 */}
            {terminalVisible && (
              <CollapsibleItem
                title="Terminal"
                defaultOpen
                showTitle={terminalTitleVisible}
              >
                <TerminalSection />
              </CollapsibleItem>
            )}
          </div>

          {/* 底部控制栏 */}
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-1 border-t border-cyan-500/30 bg-black/50 px-2.5 py-1.5">
            <button
              onClick={() => setCarouselPaused(!carouselPaused)}
              className="cursor-pointer border border-cyan-500 bg-transparent px-1.5 py-0.5 text-[10px] text-cyan-400 transition-all hover:bg-cyan-500/20"
            >
              {carouselPaused ? "[Play]" : "[Pause]"}
            </button>
            <button
              onClick={() => setCarouselVisible(!carouselVisible)}
              className="cursor-pointer border border-cyan-500 bg-transparent px-1.5 py-0.5 text-[10px] text-cyan-400 transition-all hover:bg-cyan-500/20"
            >
              {carouselVisible ? "[Hide]" : "[Show]"} Carousel
            </button>
            <button
              onClick={() => setTerminalVisible(!terminalVisible)}
              className="cursor-pointer border border-cyan-500 bg-transparent px-1.5 py-0.5 text-[10px] text-cyan-400 transition-all hover:bg-cyan-500/20"
            >
              {terminalVisible ? "[Hide]" : "[Show]"} Terminal
            </button>
            <div className="h-3 w-px bg-cyan-500/30" />
            <button
              onClick={() => setCarouselTitleVisible(!carouselTitleVisible)}
              className="flex cursor-pointer items-center gap-0.5 border border-cyan-500 bg-transparent px-1.5 py-0.5 text-[10px] text-cyan-400 transition-all hover:bg-cyan-500/20"
            >
              {carouselTitleVisible ? (
                <EyeOffIcon className="h-3 w-3" />
              ) : (
                <EyeIcon className="h-3 w-3" />
              )}
              Carousel Title
            </button>
            <button
              onClick={() => setTerminalTitleVisible(!terminalTitleVisible)}
              className="flex cursor-pointer items-center gap-0.5 border border-cyan-500 bg-transparent px-1.5 py-0.5 text-[10px] text-cyan-400 transition-all hover:bg-cyan-500/20"
            >
              {terminalTitleVisible ? (
                <EyeOffIcon className="h-3 w-3" />
              ) : (
                <EyeIcon className="h-3 w-3" />
              )}
              Terminal Title
            </button>
          </div>
        </RightPanel>
      </div>

      {/* 底部区域 - 可以在这里加状态栏、版权信息等 */}
      <div className="h-0">{/* 你要的新元素可以加在这里 */}</div>
    </div>
  )
}

export default function LiveStreamPage() {
  return (
    <ContentProvider>
      <LiveStreamPageContent />
    </ContentProvider>
  )
}
